/**
 * Calendar Agent - AI SDR
 * 
 * Integrates with Cal.com and Google Calendar for booking links
 * and availability checking.
 */

const axios = require('axios');
const { format, addDays, startOfDay, endOfDay } = require('date-fns');

class CalendarAgent {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.client = null;
  }

  async initialize() {
    this.logger.info(`Initializing CalendarAgent with provider: ${this.config.primaryProvider}`);
    
    switch (this.config.primaryProvider) {
      case 'calcom':
        this.client = new CalComClient(this.config.providers.calcom, this.logger);
        break;
      case 'google':
        this.client = new GoogleCalendarClient(this.config.providers.google, this.logger);
        break;
      default:
        throw new Error(`Unsupported calendar provider: ${this.config.primaryProvider}`);
    }

    await this.client.initialize();
    this.logger.info('CalendarAgent initialized');
  }

  /**
   * Generate a booking link
   */
  async getBookingLink(options = {}) {
    const {
      eventType = '30min',
      prefilled = {},
      redirectAfter = null
    } = options;

    return this.client.generateBookingLink(eventType, prefilled, redirectAfter);
  }

  /**
   * Check availability for a date range
   */
  async checkAvailability(dateRange) {
    const {
      start = new Date(),
      end = addDays(new Date(), 7),
      eventType = '30min'
    } = dateRange;

    return this.client.getAvailability(start, end, eventType);
  }

  /**
   * Get next available slot
   */
  async getNextAvailableSlot(eventType = '30min', after = new Date()) {
    const availability = await this.checkAvailability({
      start: after,
      end: addDays(after, this.config.availability?.maxDaysInFuture || 14),
      eventType
    });

    if (availability.length === 0) {
      return null;
    }

    return availability[0];
  }

  /**
   * Book a meeting directly (bypasses booking page)
   */
  async bookMeeting(slot, attendee, eventType = '30min') {
    return this.client.createBooking(eventType, slot, attendee);
  }

  /**
   * Cancel a meeting
   */
  async cancelMeeting(bookingId, reason) {
    return this.client.cancelBooking(bookingId, reason);
  }

  /**
   * Reschedule a meeting
   */
  async rescheduleMeeting(bookingId, newSlot, reason) {
    return this.client.rescheduleBooking(bookingId, newSlot, reason);
  }
}

/**
 * Cal.com API Client
 */
class CalComClient {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.baseUrl = config.baseUrl || 'https://api.cal.com/v1';
  }

  async initialize() {
    // Test connection
    try {
      await this.getUser();
      this.logger.info('Connected to Cal.com API');
    } catch (err) {
      throw new Error(`Failed to connect to Cal.com: ${err.message}`);
    }
  }

  async getUser() {
    const res = await axios.get(`${this.baseUrl}/me`, {
      headers: { Authorization: `Bearer ${this.config.apiKey}` }
    });
    return res.data;
  }

  generateBookingLink(eventType, prefilled = {}, redirectAfter = null) {
    const eventConfig = this.config.eventTypes[eventType];
    if (!eventConfig) {
      throw new Error(`Unknown event type: ${eventType}`);
    }

    let url = `${this.config.baseUrl.replace('/v1', '')}/${eventConfig.slug}`;
    
    // Add prefilled parameters
    const params = new URLSearchParams();
    if (prefilled.name) params.append('name', prefilled.name);
    if (prefilled.email) params.append('email', prefilled.email);
    if (prefilled.notes) params.append('notes', prefilled.notes);
    if (redirectAfter) params.append('redirect', redirectAfter);

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return url;
  }

  async getAvailability(start, end, eventType) {
    const eventConfig = this.config.eventTypes[eventType];
    if (!eventConfig) {
      throw new Error(`Unknown event type: ${eventType}`);
    }

    const startDate = format(startOfDay(start), 'yyyy-MM-dd');
    const endDate = format(endOfDay(end), 'yyyy-MM-dd');

    try {
      const res = await axios.get(
        `${this.baseUrl}/availability`, {
          headers: { Authorization: `Bearer ${this.config.apiKey}` },
          params: {
            eventTypeId: eventConfig.id,
            startTime: startDate,
            endTime: endDate
          }
        }
      );

      return res.data?.slots || [];
    } catch (err) {
      this.logger.error(`Failed to get availability: ${err.message}`);
      return [];
    }
  }

  async createBooking(eventType, slot, attendee) {
    const eventConfig = this.config.eventTypes[eventType];
    
    const booking = {
      eventTypeId: eventConfig.id,
      start: slot.start,
      end: slot.end,
      name: attendee.name,
      email: attendee.email,
      notes: attendee.notes || '',
      guests: attendee.guests || []
    };

    try {
      const res = await axios.post(
        `${this.baseUrl}/bookings`,
        booking,
        { headers: { Authorization: `Bearer ${this.config.apiKey}` } }
      );

      this.logger.info(`Booking created: ${res.data.uid}`);
      
      return {
        id: res.data.uid,
        url: res.data.metadata?.videoCallUrl,
        start: res.data.startTime,
        end: res.data.endTime,
        attendee: res.data.attendees[0]
      };
    } catch (err) {
      this.logger.error(`Failed to create booking: ${err.message}`);
      throw err;
    }
  }

  async cancelBooking(bookingId, reason) {
    try {
      await axios.post(
        `${this.baseUrl}/bookings/${bookingId}/cancel`,
        { reason },
        { headers: { Authorization: `Bearer ${this.config.apiKey}` } }
      );

      this.logger.info(`Booking cancelled: ${bookingId}`);
      return { success: true };
    } catch (err) {
      this.logger.error(`Failed to cancel booking: ${err.message}`);
      throw err;
    }
  }

  async rescheduleBooking(bookingId, newSlot, reason) {
    try {
      const res = await axios.post(
        `${this.baseUrl}/bookings/${bookingId}/reschedule`,
        {
          start: newSlot.start,
          end: newSlot.end,
          reason
        },
        { headers: { Authorization: `Bearer ${this.config.apiKey}` } }
      );

      this.logger.info(`Booking rescheduled: ${bookingId}`);
      return {
        id: res.data.uid,
        start: res.data.startTime,
        end: res.data.endTime
      };
    } catch (err) {
      this.logger.error(`Failed to reschedule booking: ${err.message}`);
      throw err;
    }
  }
}

/**
 * Google Calendar API Client
 */
class GoogleCalendarClient {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.client = null;
  }

  async initialize() {
    const { google } = require('googleapis');
    
    const credentials = require(this.config.credentialsPath);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });

    this.client = google.calendar({ version: 'v3', auth });
    this.logger.info('Connected to Google Calendar API');
  }

  generateBookingLink(eventType, prefilled = {}) {
    // For Google Calendar, we generate a calendar invite link
    // This is a simplified version - for full booking links, Cal.com is preferred
    
    const eventConfig = this.config.eventTypes?.[eventType] || { duration: 30 };
    const duration = eventConfig.duration || 30;
    
    // Create a Google Calendar event creation link
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Meeting with ${this.config.fromName || 'Me'}`,
      details: prefilled.notes || '',
