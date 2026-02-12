#!/usr/bin/env node
/**
 * Twitter Scout - Automated feed monitoring and analysis
 * Runs every 6 hours via cron
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load configuration
const config = JSON.parse(fs.readFileSync('/root/.openclaw/workspace/twitter-scout/config.json', 'utf8'));
const APIFY_API_KEY = process.env.APIFY_API_KEY || 
  fs.readFileSync('/root/.openclaw/.env', 'utf8')
    .split('\n')
    .find(line => line.startsWith('APIFY_API_KEY='))
    ?.split('=')[1]?.trim();

if (!APIFY_API_KEY) {
  console.error('Error: APIFY_API_KEY not found');
  process.exit(1);
}

// Apify API client
class ApifyClient {
  constructor(token) {
    this.token = token;
    this.baseUrl = 'api.apify.com';
  }

  async runActor(actorId, input) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(input);
      const options = {
        hostname: this.baseUrl,
        port: 443,
        path: `/v2/acts/${actorId.replace('/', '~')}/runs?token=${this.token}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            console.log('Apify response:', JSON.stringify(parsed, null, 2).substring(0, 500));
            resolve(parsed);
          } catch (e) {
            reject(new Error(`Invalid JSON response: ${responseData}`));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  async getRunStatus(runId) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.baseUrl,
        port: 443,
        path: `/v2/actor-runs/${runId}?token=${this.token}`,
        method: 'GET'
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => responseData += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(responseData));
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.end();
    });
  }

  async getDatasetItems(datasetId) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.baseUrl,
        port: 443,
        path: `/v2/datasets/${datasetId}/items?token=${this.token}&format=json`,
        method: 'GET'
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => responseData += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(responseData));
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.end();
    });
  }
}

// Build search queries from handles
function buildSearchQueries(handles) {
  return handles.map(handle => `from:${handle}`);
}

// Main scout function
async function runScout() {
  console.log('🪶 Starting Twitter Scout run...');
  console.log(`Monitoring ${config.handles.length} handles`);
  
  const client = new ApifyClient(APIFY_API_KEY);
  
  // Build input for Apify actor
  // kaitoeasyapi actor uses searchTerms array for batching
  const since = new Date();
  since.setHours(since.getHours() - 6); // Look back 6 hours
  const sinceStr = since.toISOString().replace(/T/, '_').replace(/\..+/, '_UTC');
  
  const searchTerms = config.handles.map(handle => `from:${handle} since:${sinceStr}`);
  
  const input = {
    searchTerms: searchTerms,
    "filter:replies": true,  // Exclude replies to save costs
    "filter:nativeretweets": true,  // Exclude retweets
    lang: "en"
  };

  console.log('Launching Apify actor...');
  
  try {
    // Start the actor run
    const run = await client.runActor(config.apifyActor, input);
    console.log(`Run started: ${run.data.id}`);
    console.log(`Dataset ID: ${run.data.defaultDatasetId}`);
    
    // Save run info for later retrieval
    const runInfo = {
      runId: run.data.id,
      datasetId: run.data.defaultDatasetId,
      startedAt: new Date().toISOString(),
      handles: config.handles,
      status: 'RUNNING'
    };
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.writeFileSync(
      path.join(config.outputDir, `run-${timestamp}.json`),
      JSON.stringify(runInfo, null, 2)
    );
    
    console.log('Run info saved. Will poll for completion...');
    
    // Poll for completion (max 5 minutes)
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
      const status = await client.getRunStatus(run.data.id);
      console.log(`Status: ${status.data.status} (attempt ${attempts + 1}/${maxAttempts})`);
      
      if (status.data.status === 'SUCCEEDED') {
        console.log('Run completed successfully!');
        
        // Fetch results
        const items = await client.getDatasetItems(run.data.defaultDatasetId);
        console.log(`Retrieved ${items.length} total tweets`);
        
        // Filter out replies - only keep original tweets
        const originalTweets = items.filter(tweet => !tweet.isReply);
        console.log(`Filtered to ${originalTweets.length} original tweets (excluded ${items.length - originalTweets.length} replies)`);
        
        // Save raw data (filtered)
        fs.writeFileSync(
          path.join(config.outputDir, `tweets-${timestamp}.json`),
          JSON.stringify(originalTweets, null, 2)
        );
        
        // Analyze and generate report
        await generateReport(items, timestamp);
        
        // Prepare data for LLM analysis (v2 - fetches linked content)
        console.log('Preparing data for LLM analysis...');
        const { execSync } = require('child_process');
        try {
          execSync(`node /root/.openclaw/workspace/twitter-scout/analyzer-v2.js "${path.join(config.outputDir, `tweets-${timestamp}.json`)}"`, {
            stdio: 'inherit'
          });
        } catch (e) {
          console.error('Analyzer v2 error:', e.message);
          // Fallback to basic flagging
          fs.writeFileSync('/root/.openclaw/workspace/twitter-scout/NEW_DATA_READY', timestamp);
        }
        console.log('Data prepared for agent analysis');
        
        return;
      } else if (status.data.status === 'FAILED') {
        throw new Error('Actor run failed');
      }
      
      attempts++;
    }
    
    console.log('Run still in progress. Will check later.');
    
  } catch (error) {
    console.error('Scout error:', error.message);
    process.exit(1);
  }
}

// Generate analysis report
async function generateReport(tweets, timestamp) {
  console.log('Generating analysis report...');
  
  // Group tweets by author
  const byAuthor = {};
  tweets.forEach(tweet => {
    const author = tweet.author?.userName || 'unknown';
    if (!byAuthor[author]) byAuthor[author] = [];
    byAuthor[author].push(tweet);
  });
  
  // Generate report structure
  const report = {
    date: new Date().toISOString(),
    totalTweets: tweets.length,
    authorsMonitored: Object.keys(byAuthor).length,
    findings: [],
    summary: []
  };
  
  // Analyze tweets for business opportunities
  // This is a placeholder - will be enhanced with AI analysis
  tweets.forEach(tweet => {
    const text = tweet.text || '';
    const url = tweet.url || `https://twitter.com/${tweet.author?.userName}/status/${tweet.id}`;
    
    // Basic keyword detection for business signals
    const businessKeywords = ['launch', 'product', 'startup', 'revenue', 'mrr', 'arr', ' funding', 'ai', 'tool', 'app'];
    const hasBusinessSignal = businessKeywords.some(kw => text.toLowerCase().includes(kw.toLowerCase()));
    
    if (hasBusinessSignal) {
      report.findings.push({
        type: 'business_signal',
        author: tweet.author?.userName,
        text: text.substring(0, 200),
        url: url,
        engagement: {
          likes: tweet.likeCount || 0,
          retweets: tweet.retweetCount || 0,
          replies: tweet.replyCount || 0
        },
        priority: config.priorityHandles.includes(tweet.author?.userName) ? 'HIGH' : 'MEDIUM'
      });
    }
  });
  
  // Save report
  const reportPath = path.join('/root/.openclaw/workspace/twitter-scout/reports', `report-${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`Report saved: ${reportPath}`);
  console.log(`Found ${report.findings.length} business signals`);
}

// Run if called directly
if (require.main === module) {
  runScout().catch(console.error);
}

module.exports = { runScout, generateReport };
