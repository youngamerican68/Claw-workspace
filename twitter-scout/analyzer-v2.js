#!/usr/bin/env node
/**
 * Twitter Scout Analyzer v2
 * Prepares data for LLM analysis by extracting URLs and fetching content
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const REPORTS_DIR = '/root/.openclaw/workspace/twitter-scout/reports';
const DATA_DIR = '/root/.openclaw/workspace/twitter-scout/data';

// Fetch URL content with timeout
function fetchUrl(url, timeout = 10000) {
  return new Promise((resolve) => {
    try {
      const protocol = url.startsWith('https') ? https : http;
      const req = protocol.get(url, { timeout }, (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchUrl(res.headers.location, timeout).then(resolve);
        }
        
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data.slice(0, 15000))); // Limit to 15k chars
      });
      
      req.on('error', () => resolve(null));
      req.on('timeout', () => { req.destroy(); resolve(null); });
    } catch (e) {
      resolve(null);
    }
  });
}

// Extract URLs from tweet text
function extractUrls(text) {
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
  const matches = text.match(urlRegex) || [];
  // Filter out twitter/x.com URLs (we already have the tweet)
  return matches.filter(url => 
    !url.includes('twitter.com') && 
    !url.includes('x.com') &&
    !url.includes('t.co')
  );
}

// Extract plain text from HTML (basic)
function htmlToText(html) {
  if (!html) return '';
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 10000);
}

// Process tweets and prepare data for LLM analysis
async function prepareTweetsForAnalysis(tweetFile) {
  const tweets = JSON.parse(fs.readFileSync(tweetFile, 'utf8'));
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // Filter valid tweets
  const validTweets = tweets.filter(t => !t.noResults && t.text);
  
  if (validTweets.length === 0) {
    console.log('No valid tweets to analyze');
    return null;
  }

  console.log(`Processing ${validTweets.length} tweets...`);

  const preparedData = {
    timestamp,
    date: new Date().toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    tweetCount: validTweets.length,
    tweets: [],
    linkedContent: []
  };

  // Process each tweet
  for (const tweet of validTweets) {
    const tweetData = {
      id: tweet.id,
      text: tweet.text,
      url: tweet.url || `https://x.com/${tweet.author?.userName}/status/${tweet.id}`,
      author: {
        handle: tweet.author?.userName || 'unknown',
        name: tweet.author?.name || 'Unknown',
        followers: tweet.author?.followers || 0,
        verified: tweet.author?.isVerified || false
      },
      engagement: {
        likes: tweet.likeCount || 0,
        reposts: tweet.retweetCount || 0,
        replies: tweet.replyCount || 0,
        views: tweet.viewCount || 0
      },
      createdAt: tweet.createdAt,
      urls: extractUrls(tweet.text)
    };
    
    preparedData.tweets.push(tweetData);
  }

  // Fetch content from linked URLs (deduplicated)
  const allUrls = [...new Set(preparedData.tweets.flatMap(t => t.urls))];
  console.log(`Found ${allUrls.length} unique external URLs to fetch...`);
  
  for (const url of allUrls.slice(0, 20)) { // Limit to 20 URLs
    console.log(`Fetching: ${url}`);
    const html = await fetchUrl(url);
    if (html) {
      const text = htmlToText(html);
      if (text.length > 100) {
        preparedData.linkedContent.push({
          url,
          content: text.slice(0, 5000) // Limit content size
        });
      }
    }
  }

  console.log(`Fetched content from ${preparedData.linkedContent.length} URLs`);

  // Save prepared data
  const preparedPath = path.join(DATA_DIR, `prepared-${timestamp}.json`);
  fs.writeFileSync(preparedPath, JSON.stringify(preparedData, null, 2));
  console.log(`Prepared data saved: ${preparedPath}`);

  // Update the NEW_DATA_READY flag with the path
  fs.writeFileSync(
    path.join('/root/.openclaw/workspace/twitter-scout', 'NEW_DATA_READY'),
    preparedPath
  );
  console.log('NEW_DATA_READY flag set');

  return preparedPath;
}

// Find the most recent tweets file
function findLatestTweetsFile() {
  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.startsWith('tweets-') && f.endsWith('.json'))
    .sort()
    .reverse();
  
  if (files.length === 0) {
    throw new Error('No tweet files found');
  }
  
  return path.join(DATA_DIR, files[0]);
}

// Main
async function main() {
  const tweetFile = process.argv[2] || findLatestTweetsFile();
  console.log(`Processing: ${tweetFile}`);
  
  const result = await prepareTweetsForAnalysis(tweetFile);
  if (result) {
    console.log('\n✅ Data prepared for LLM analysis');
    console.log('The agent will generate the full report on next heartbeat');
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
