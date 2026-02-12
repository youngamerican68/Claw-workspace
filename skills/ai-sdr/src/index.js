/**
 * AI SDR Agent - OpenClaw Skill
 * 
 * Main entry point for the AI SDR Agent.
 * Provides email automation, calendar integration, lead scoring,
 * and cadence management for sales development.
 */

const { EmailAgent } = require('./agents/EmailAgent');
const { CalendarAgent } = require('./agents/CalendarAgent');
const { CadenceEngine } = require('./cadence/CadenceEngine');
const { QualificationScorer } = require('./scoring/QualificationScorer');
const { LeadStore } = require('./store/LeadStore');
const { Logger } = require('./utils/Logger');

class AISDRAgent {
  constructor(configPath = './config/config.json') {
    this.config = this.loadConfig(configPath);
    this.logger = new Logger(this.config.logging);
    
    this.agents = {
      email: null,
      calendar: null
    };
    
    this.engines = {
      cadence: null,
      scoring: null
    };
    
    this.store = null;
    this.initialized = false;
  }

  loadConfig(configPath) {
    try {
      const config = require(configPath);
      return config;
    } catch (error) {
      throw new Error(`Failed to load config from ${configPath}: ${error.message}`);
    }
  }

  async initialize() {
    if (this.initialized) {
      this.logger.warn('Agent already initialized');
      return this;
    }

    this.logger.info('Initializing AI SDR Agent...');

    // Initialize data store
    this.store = new LeadStore(this.config.queue?.redis);
    await this.store.connect();

    // Initialize agents
    this.agents.email = new EmailAgent(this.config.email, this.store, this.logger);
    await this.agents.email.initialize();

    this.agents.calendar = new CalendarAgent(this.config.calendar, this.logger);
    await this.agents.calendar.initialize();

    // Initialize engines
    this.engines.cadence = new CadenceEngine(
      this.config.cadences,
      this.agents.email,
      this.store,
      this.logger
    );

    this.engines.scoring = new QualificationScorer(
      this.config.scoring,
      this.logger
    );

    this.initialized = true;
    this.logger.info('AI SDR Agent initialized successfully');
    
    return this;
  }

  /**
   * Send a single outbound email
   */
  async sendEmail(options) {
    this.ensureInitialized();
    return this.agents.email.sendOutbound(options);
  }

  /**
   * Enroll a lead in a cadence sequence
   */
  async enrollInCadence(lead, cadenceId) {
    this.ensureInitialized();
    return this.engines.cadence.enrollLead(lead, cadenceId);
  }

  /**
   * Score a lead for qualification
   */
  async scoreLead(leadData) {
    this.ensureInitialized();
    return this.engines.scoring.scoreLead(leadData);
  }

  /**
   * Generate a booking link
   */
  async getBookingLink(options) {
    this.ensureInitialized();
    return this.agents.calendar.getBookingLink(options);
  }

  /**
   * Process inbound webhook (email open, reply, etc.)
   */
  async processWebhook(payload) {
    this.ensureInitialized();
    
    switch (payload.event) {
      case 'email.opened':
        await this.agents.email.trackOpen(payload);
        break;
      case 'email.clicked':
        await this.agents.email.trackClick(payload);
        break;
      case 'email.replied':
        await this.agents.email.processReply(payload);
        break;
      case 'meeting.booked':
        await this.handleMeetingBooked(payload);
        break;
      default:
        this.logger.warn(`Unknown webhook event: ${payload.event}`);
    }
  }

  /**
   * Get campaign statistics
   */
  async getStats(cadenceId) {
    this.ensureInitialized();
    return this.engines.cadence.getStats(cadenceId);
  }

  /**
   * Start the cadence scheduler
   */
  async startScheduler() {
    this.ensureInitialized();
    return this.engines.cadence.startScheduler();
  }

  /**
   * Stop all operations gracefully
   */
  async shutdown() {
    this.logger.info('Shutting down AI SDR Agent...');
    
    if (this.engines.cadence) {
      await this.engines.cadence.stopScheduler();
    }
    
    if (this.store) {
      await this.store.disconnect();
    }
    
    this.initialized = false;
    this.logger.info('AI SDR Agent shut down');
  }

  ensureInitialized() {
    if (!this.initialized) {
      throw new Error('AI SDR Agent not initialized. Call initialize() first.');
    }
  }

  async handleMeetingBooked(payload) {
    this.logger.info(`Meeting booked: ${payload.meetingId}`);
    // Pause cadence for this lead
    if (payload.leadId) {
      await this.engines.cadence.setLeadStatus(payload.leadId, 'meeting_booked');
    }
  }
}

module.exports = {
  AISDRAgent,
  EmailAgent,
  CalendarAgent,
  CadenceEngine,
  QualificationScorer,
  LeadStore
};