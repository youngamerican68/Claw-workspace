/**
 * Email Agent - AI SDR
 * 
 * Handles Gmail/Outlook API integration for sending personalized
 * outbound emails and tracking engagement.
 */

const { google } = require('googleapis');
const axios = require('axios');
const Handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { format } = require('date-fns');

class EmailAgent {
  constructor(config, store, logger) {
    this.config = config;
    this.store = store;
    this.logger = logger;
    this.provider = null;
    this.templates = new Map();
    this.dailySent = 0;
    this.lastReset = new Date().toDateString();
  }

  async initialize() {
    this.logger.info(`Initializing EmailAgent with provider: ${this.config.provider}`);
    
    switch (this.config.provider) {
      case 'gmail':
        await this.initializeGmail();
        break;
      case 'outlook':
        await this.initializeOutlook();
        break;
      default:
        throw new Error(`Unsupported email provider: ${this.config.provider}`);
    }

    // Load email templates
    await this.loadTemplates();
    
    this.logger.info('EmailAgent initialized');
  }

  async initializeGmail() {
    const credentials = await fs.readFile(
      this.config.providers.gmail.credentialsPath,
      'utf8'
    ).then(JSON.parse);

    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Load token if exists
    try {
      const token = await fs.readFile(
        this.config.providers.gmail.tokenPath,
        'utf8'
      ).then(JSON.parse);
      oAuth2Client.setCredentials(token);
    } catch (err) {
      this.logger.warn('No Gmail token found. Run: npm run auth:gmail');
    }

    this.provider = {
      type: 'gmail',
      client: google.gmail({ version: 'v1', auth: oAuth2Client }),
      auth: oAuth2Client
    };
  }

  async initializeOutlook() {
    const { ClientSecretCredential } = require('@azure/identity');
    const { Client } = require('@microsoft/microsoft-graph-client');
    const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');

    const credential = new ClientSecretCredential(
      this.config.providers.outlook.tenantId,
      this.config.providers.outlook.clientId,
      this.config.providers.outlook.clientSecret
    );

    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ['https://graph.microsoft.com/.default']
    });

    this.provider = {
      type: 'outlook',
      client: Client.initWithMiddleware({ authProvider })
    };
  }

  async loadTemplates() {
    const templatesDir = this.config.tracking?.templatesDir || './templates';
    
    try {
      const files = await fs.readdir(templatesDir);
      for (const file of files) {
        if (file.endsWith('.hbs') || file.endsWith('.html') || file.endsWith('.txt')) {
          const content = await fs.readFile(path.join(templatesDir, file), 'utf8');
          const templateName = path.basename(file, path.extname(file));
          this.templates.set(templateName, Handlebars.compile(content));
        }
      }
      this.logger.info(`Loaded ${this.templates.size} email templates`);
    } catch (err) {
      this.logger.warn(`Could not load templates from ${templatesDir}: ${err.message}`);
    }
  }

  /**
   * Send a personalized outbound email
   */
  async sendOutbound(options) {
    this.checkRateLimit();
    
    const {
      to,
      firstName,
      company,
      role,
      template = 'outbound-v1',
      subjectLine,
      valueProp,
      triggerEvent,
      customFields = {},
      leadId,
      track = true
    } = options;

    // Validate
    if (!to || !firstName) {
      throw new Error('Email and firstName are required');
    }

    // Generate tracking ID
    const trackingId = uuidv4();

    // Prepare template data
    const templateData = {
      firstName,
      company,
      role,
      valueProp,
      triggerEvent,
      myName: this.config.fromName,
      myCompany: this.config.fromEmail.split('@')[1],
      ...customFields
    };

    // Compile email
    const emailBody = await this.compileEmail(template, templateData, track, trackingId);
    const subject = subjectLine || this.generateSubject(templateData, template);

    // Send
    let result;
    if (this.provider.type === 'gmail') {
      result = await this.sendGmail(to, subject, emailBody);
    } else {
      result = await this.sendOutlook(to, subject, emailBody);
    }

    // Record in store
    const emailRecord = {
      id: trackingId,
      leadId,
      to,
      subject,
      template,
      sentAt: new Date().toISOString(),
      status: 'sent',
      provider: this.provider.type,
      opens: 0,
      clicks: 0,
      replied: false
    };

    await this.store.saveEmail(emailRecord);
    this.dailySent++;

    this.logger.info(`Email sent to ${to} | Template: ${template} | ID: ${trackingId}`);

    return {
      success: true,
      trackingId,
      messageId: result.messageId,
      to,
      subject
    };
  }

  async compileEmail(templateName, data, track, trackingId) {
    // Load template if not cached
    if (!this.templates.has(templateName)) {
      const templatesDir = this.config.tracking?.templatesDir || './templates';
      const content = await fs.readFile(
        path.join(templatesDir, `${templateName}.hbs`),
        'utf8'
      );
      this.templates.set(templateName, Handlebars.compile(content));
    }

    const template = this.templates.get(templateName);
    let body = template(data);

    // Add signature
    body += this.config.signature || '';

    // Add tracking pixel
    if (track && this.config.tracking?.enabled) {
      const pixelUrl = `https://${this.config.tracking.pixelDomain}/pixel/${trackingId}.gif`;
      body += `<img src="${pixelUrl}" width="1" height="1" alt="" />`;
    }

    // Add unsubscribe
    if (this.config.compliance?.includeUnsubscribe) {
      body += `\n\n<a href="${this.config.compliance.unsubscribeLink}?id=${trackingId}">Unsubscribe</a>`;
    }

    return body;
  }

  generateSubject(data, template) {
    // A/B test subject lines based on template
    const subjects = {
      'outbound-v1': [
        `Quick question about {{company}}`,
        `{{firstName}}, scaling {{company}}'s infrastructure`,
        `Idea for {{company}}`
      ],
      'followup-day-3': [
        `Re:`,
        `Bumping this up`,
        `Quick follow-up`
      ],
      'followup-day-7': [
        `{{firstName}}, thought you'd find this helpful`,
        `How {{similar_company}} reduced costs by 40%`,
        `One more thing about {{company}}`
      ]
    };

    const templateSubjects = subjects[template] || subjects['outbound-v1'];
    const randomSubject = templateSubjects[Math.floor(Math.random() * templateSubjects.length)];
    
    const compiled = Handlebars.compile(randomSubject);
    return compiled(data);
  }

  async sendGmail(to, subject, htmlBody) {
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    
    const messageParts = [
      `From: ${this.config.fromName} <${this.config.fromEmail}>`,
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      '',
      htmlBody
    ];

    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await this.provider.client.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    return { messageId: res.data.id };
  }

  async sendOutlook(to, subject, htmlBody) {
    const message = {
      message: {
        subject,
        body: {
          contentType: 'HTML',
          content: htmlBody
        },
        toRecipients: [
          {
            emailAddress: {
              address: to
            }
          }
        ],
        from: {
          emailAddress: {
            address: this.config.fromEmail,
            name: this.config.fromName
          }
        }
      }
    };

    const res = await this.provider.client
      .api('/me/sendMail')
      .post(message);

    return { messageId: res?.id || 'outlook-sent' };
  }

  /**
   * Track email open event
   */
  async trackOpen(payload) {
    const { trackingId } = payload;
    
    await this.store.updateEmail(trackingId, {
      $inc: { opens: 1 },
      $set: { lastOpenedAt: new Date().toISOString() }
    });

    // Update lead engagement score
    if (payload.leadId) {
      await this.store.updateLead(payload.leadId, {
        $inc: { emailOpens: 1 },
        $set: { lastActivity: 'email_opened', lastActivityAt: new Date().toISOString() }
      });
    }

    this.logger.debug(`Email opened: ${trackingId}`);
  }

  /**
   * Track link click
   */
  async trackClick(payload) {
    const { trackingId, url } = payload;
    
    await this.store.updateEmail(trackingId, {
      $inc: { clicks: 1 },
      $push: { clickedLinks: { url, at: new Date().toISOString() } }
    });

    if (payload.leadId) {
      await this.store.updateLead(payload.leadId, {
        $inc: { linkClicks: 1 },
        $set: { lastActivity: 'link_clicked', lastActivityAt: new Date().toISOString() }
      });
    }

    this.logger.debug(`Link clicked: ${url} in email ${trackingId}`);
  }

  /**
   * Process email reply
   */
  async processReply(payload) {
    const { trackingId, from, body, leadId } = payload;
    
    // Mark email as replied
    await this.store.updateEmail(trackingId, {
      $set: { 
        replied: true, 
        repliedAt: new Date().toISOString(),
        replyBody: body
      }
    });

    // Analyze reply sentiment/intent
    const intent = await this.analyzeReplyIntent(body);
    
    // Update lead
    if (leadId) {
      await this.store.updateLead(leadId, {
        $inc: { replies: 1 },
        $set: { 
          lastActivity: 'replied',
          lastActivityAt: new Date().toISOString(),
          replyIntent: intent,
          status: intent === 'interested' ? 'hot_lead' : 'responded'
        }
      });
    }

    // Handle different intents
    switch (intent) {
      case 'unsubscribe':
        await this.handleUnsubscribe(leadId, from);
        break;
      case 'meeting_request':
        await this.handleMeetingRequest(leadId, from);
        break;
      case 'not_interested':
        await this.handleNotInterested(leadId);
        break;
    }

    this.logger.info(`Reply processed: ${from} | Intent: ${intent} | Lead: ${leadId}`);

    return { intent };
  }

  async analyzeReplyIntent(body) {
    const bodyLower = body.toLowerCase();
    
    // Simple keyword-based classification (can be enhanced with LLM)
    if (bodyLower.includes('unsubscribe') || bodyLower.includes('remove me')) {
      return 'unsubscribe';
    }
    if (bodyLower.includes('meeting') || bodyLower.includes('schedule') || bodyLower.includes('calendar')) {
      return 'meeting_request';
    }
    if (bodyLower.includes('not interested') || bodyLower.includes('pass') || bodyLower.includes('no thanks')) {
      return 'not_interested';
    }
    if (bodyLower.includes('interested') || bodyLower.includes('tell me more') || bodyLower.includes('pricing')) {
      return 'interested';
    }
    if (bodyLower.includes('wrong person') || bodyLower.includes('not the right')) {
      return 'wrong_person';
    }
    
    return 'neutral';
  }

  async handleUnsubscribe(leadId, email) {
    this.logger.info(`Unsubscribing lead: ${leadId} / ${email}`);
    
    if (leadId) {
      await this.store.updateLead(leadId, {
        $set: { 
          unsubscribed: true,
          unsubscribedAt: new Date().toISOString(),
          status: 'unsubscribed',
          canContact: false
        }
      });
    }
  }

  async handleMeetingRequest(leadId, email) {
    this.logger.info(`Meeting requested by lead: ${leadId} / ${email}`);
    
    if (leadId) {
      await this.store.updateLead(leadId, {
        $set: { 
          requestedMeeting: true,
          requestedMeetingAt: new Date().toISOString(),
          status: 'meeting_requested'
        }
      });
    }
  }

  async handleNotInterested(leadId) {
    this.logger.info(`Lead not interested: ${leadId}`);
    
    if (leadId) {
      await this.store.updateLead(leadId, {
        $set: { 
          notInterested: true,
          status: 'nurture'
        }
      });
    }
  }

  checkRateLimit() {
    // Reset counter if it's a new day
    const today = new Date().toDateString();
    if (today !== this.lastReset) {
      this.dailySent = 0;
      this.lastReset = today;
    }

    const limit = this.config.rateLimit?.dailyMax || 200;
    if (this.dailySent >= limit) {
      throw new Error(`Daily rate limit reached (${limit} emails)`);
    }
  }

  /**
   * Get email statistics
   */
  async getStats(leadId) {
    if (leadId) {
      return this.store.getEmailsForLead(leadId);
    }
    
    return {
      dailySent: this.dailySent,
      dailyLimit: this.config.rateLimit?.dailyMax || 200,
      templatesLoaded: this.templates.size,
      provider: this.provider?.type
    };
  }
}

module.exports = { EmailAgent };
