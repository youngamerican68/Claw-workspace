#!/usr/bin/env node
/**
 * marketplace-scout.js - Marketplace/classifieds scanner for Rook
 *
 * Wraps browse.js to scan any marketplace site, extract structured listing data,
 * and produce ranked shortlists. Works with Craigslist, eBay, OfferUp, Mercari, etc.
 *
 * Usage:
 *   node marketplace-scout.js search <url> [--pages N] [--delay ms] [--output path]
 *   node marketplace-scout.js scrape <url> [--output path]
 *   node marketplace-scout.js scan <url> [--pages N] [--delay ms] [--max-listings N] [--resume] [--output path]
 *   node marketplace-scout.js report <json> [--max-price N] [--min-price N] [--keywords w1,w2] [--top N] [--output path]
 *   node marketplace-scout.js watch add --url <url> --name <name> [--max-price N] [--keywords w1,w2]
 *   node marketplace-scout.js watch list
 *   node marketplace-scout.js watch remove --name <name>
 *   node marketplace-scout.js watch run
 *
 * No dependencies - uses only Node.js builtins and calls browse.js as subprocess.
 */

const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Paths
const WORKSPACE = '/root/.openclaw/workspace';
const BROWSE_JS = path.join(WORKSPACE, 'browse.js');
const SCOUT_DIR = path.join(WORKSPACE, 'marketplace-scout');
const DATA_DIR = path.join(SCOUT_DIR, 'data');
const REPORTS_DIR = path.join(SCOUT_DIR, 'reports');
const PROGRESS_DIR = path.join(SCOUT_DIR, 'progress');
const WATCHES_FILE = path.join(SCOUT_DIR, 'watches.json');

// Vision API (Synthetic / Kimi K2.5 via Anthropic Messages format)
const VISION_AUTH_FILE = '/root/.openclaw/agents/main/agent/auth-profiles.json';
const VISION_API_URL = 'https://api.synthetic.new/anthropic/v1/messages';
const VISION_MODEL = 'hf:moonshotai/Kimi-K2.5';
const VISION_MAX_IMAGES = 4;

// Defaults
const DEFAULT_DELAY = 4000;
const DEFAULT_MAX_LISTINGS = 50;
const DEFAULT_PAGES = 3;
const MAX_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const MAX_CONSECUTIVE_FAILURES = 3;
const PROGRESS_STALE_DAYS = 7;

// Ensure directories exist
[DATA_DIR, REPORTS_DIR, PROGRESS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function dateStr() {
  return new Date().toISOString().split('T')[0];
}

function hashUrl(url) {
  return crypto.createHash('md5').update(url).digest('hex').slice(0, 12);
}

function parseRelativeAge(dateStr) {
  // Convert "3 months ago", "2 days ago", etc. to age in days. Returns null if unparseable.
  if (!dateStr) return null;
  const m = dateStr.match(/(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  switch (m[2].toLowerCase()) {
    case 'minute': return n / 1440;
    case 'hour': return n / 24;
    case 'day': return n;
    case 'week': return n * 7;
    case 'month': return n * 30;
    case 'year': return n * 365;
    default: return null;
  }
}

function browse(url, flags = '') {
  const cmd = `node ${BROWSE_JS} "${url}" --no-cookies ${flags}`.trim();
  try {
    const out = execSync(cmd, { timeout: 90000, maxBuffer: 10 * 1024 * 1024, encoding: 'utf-8' });
    return out;
  } catch (err) {
    const msg = err.stderr || err.message || 'unknown error';
    if (msg.includes('403') || msg.includes('Access Denied') || msg.includes('captcha')) {
      throw new Error('BLOCKED: ' + msg.slice(0, 200));
    }
    throw new Error('BROWSE_FAIL: ' + msg.slice(0, 200));
  }
}

// ---------------------------------------------------------------------------
// Vision API (Synthetic + Kimi K2.5)
// ---------------------------------------------------------------------------

function loadVisionKey() {
  try {
    const raw = fs.readFileSync(VISION_AUTH_FILE, 'utf-8');
    const auth = JSON.parse(raw);
    const profile = auth.profiles?.['synthetic:default'];
    return profile?.key || null;
  } catch {
    return null;
  }
}

function visionRequest(apiKey, imageUrls, listingPrice, listingTitle) {
  return new Promise((resolve, reject) => {
    // Build content array: images first, then text prompt (Anthropic Messages format)
    const content = [];

    // Send first image only to keep response fast (Anthropic format: type "image" with source.url)
    const imgs = imageUrls.slice(0, 1);
    for (const imgUrl of imgs) {
      content.push({
        type: 'image',
        source: { type: 'url', url: imgUrl }
      });
    }

    content.push({
      type: 'text',
      text: `You are an expert at identifying valuable items in marketplace listings. Analyze the listing image(s) above.

Listing title: "${listingTitle || 'Unknown'}"
Listing price: ${listingPrice !== null ? '$' + listingPrice : 'Not listed'}

Respond in this exact JSON format (no markdown, no code fences, no thinking):
{
  "identified_item": "What this item actually is (brand, model, specific product name)",
  "brand_confidence": "high/medium/low",
  "estimated_retail_value": "$XXX-$XXX range",
  "estimated_resale_value": "$XXX-$XXX range",
  "deal_rating": "great_deal/good_deal/fair_price/overpriced/unknown",
  "key_observations": "What you see that helps identify value (brand markings, materials, condition visible in photo, model indicators)",
  "flip_potential": "Brief assessment of profit potential if bought at listing price"
}`
    });

    const payload = JSON.stringify({
      model: VISION_MODEL,
      max_tokens: 4096,
      messages: [{ role: 'user', content }],
    });

    const urlObj = new URL(VISION_API_URL);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            reject(new Error(`Vision API: ${json.error.message || JSON.stringify(json.error)}`));
            return;
          }
          // Anthropic Messages format: content is an array of blocks
          // Collect all text (from text blocks and thinking blocks)
          let text = '';
          for (const block of (json.content || [])) {
            if (block.type === 'text') text += block.text;
            if (block.type === 'thinking' && block.thinking) text += block.thinking;
          }
          // Try to parse a JSON object from anywhere in the response
          const jsonMatch = text.match(/\{[^{}]*"identified_item"[\s\S]*?\}/);
          if (jsonMatch) {
            try {
              resolve(JSON.parse(jsonMatch[0]));
            } catch {
              // Try a more permissive match
              const looseMatch = text.match(/\{[\s\S]*\}/);
              if (looseMatch) {
                try { resolve(JSON.parse(looseMatch[0])); } catch {
                  resolve({ raw_response: text.slice(0, 500), parse_error: 'JSON parse failed' });
                }
              } else {
                resolve({ raw_response: text.slice(0, 500), parse_error: 'JSON parse failed' });
              }
            }
          } else {
            resolve({ raw_response: text.slice(0, 500), parse_error: 'Could not extract JSON from response' });
          }
        } catch (e) {
          reject(new Error(`Vision parse error: ${e.message} — raw: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(120000, () => { req.destroy(); reject(new Error('Vision API timeout')); });
    req.write(payload);
    req.end();
  });
}

async function analyzeListingVision(listing, apiKey) {
  if (!listing.images || listing.images.length === 0) {
    return { skipped: true, reason: 'no images' };
  }

  // Filter to likely-valid image URLs (http/https, not placeholders)
  const validImages = listing.images.filter(url =>
    url.startsWith('http') && !url.includes('placeholder') && !url.includes('no-image')
  );

  if (validImages.length === 0) {
    return { skipped: true, reason: 'no valid image URLs' };
  }

  try {
    const result = await visionRequest(apiKey, validImages, listing.price, listing.title);
    return result;
  } catch (err) {
    return { skipped: true, reason: err.message };
  }
}

function parseArgs(argv) {
  const args = argv || process.argv.slice(2);
  const opts = {
    command: null,
    subcommand: null,
    url: null,
    pages: DEFAULT_PAGES,
    delay: DEFAULT_DELAY,
    maxListings: DEFAULT_MAX_LISTINGS,
    resume: false,
    output: null,
    maxPrice: null,
    minPrice: null,
    keywords: [],
    top: 10,
    name: null,
    jsonFile: null,
    vision: false,
    maxAge: 7, // days — skip listings older than this
  };

  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  opts.command = args[0];

  let i = 1;

  // For watch command, grab subcommand
  if (opts.command === 'watch') {
    opts.subcommand = args[1] || null;
    i = 2;
  }

  // For report command, next positional arg is the JSON file
  if (opts.command === 'report' && args[1] && !args[1].startsWith('--')) {
    opts.jsonFile = args[1];
    i = 2;
  }

  // For search/scrape/scan, next positional arg is URL
  if (['search', 'scrape', 'scan'].includes(opts.command) && args[1] && !args[1].startsWith('--')) {
    opts.url = args[1];
    i = 2;
  }

  for (; i < args.length; i++) {
    switch (args[i]) {
      case '--pages': opts.pages = parseInt(args[++i], 10); break;
      case '--delay': opts.delay = parseInt(args[++i], 10); break;
      case '--max-listings': opts.maxListings = parseInt(args[++i], 10); break;
      case '--resume': opts.resume = true; break;
      case '--output': opts.output = args[++i]; break;
      case '--max-price': opts.maxPrice = parseFloat(args[++i]); break;
      case '--min-price': opts.minPrice = parseFloat(args[++i]); break;
      case '--keywords': opts.keywords = args[++i].split(',').map(k => k.trim().toLowerCase()); break;
      case '--top': opts.top = parseInt(args[++i], 10); break;
      case '--name': opts.name = args[++i]; break;
      case '--url': opts.url = args[++i]; break;
      case '--vision': opts.vision = true; break;
      case '--max-age': opts.maxAge = parseInt(args[++i], 10); break;
      default:
        if (!args[i].startsWith('--') && !opts.url) {
          opts.url = args[i];
        }
    }
  }

  return opts;
}

function printUsage() {
  console.log(`Marketplace Scout - Scan classifieds/marketplace sites for deals

Commands:
  search <url>                    Extract listing links from search results
  scrape <url>                    Structured extraction from one listing
  scan <url>                      Full pipeline: search + batch scrape
  report <json-file>              Filter/rank scan results into markdown shortlist
  watch add|list|remove|run       Overnight monitoring with delta detection

Options:
  --pages N          Pages to crawl (default: 3)
  --delay ms         Delay between requests (default: 4000)
  --max-listings N   Max listings to scrape (default: 50)
  --resume           Resume interrupted scan
  --output path      Output file path
  --max-price N      Filter: maximum price
  --min-price N      Filter: minimum price
  --keywords w1,w2   Filter/boost keywords (comma-separated)
  --top N            Top N results in report (default: 10)
  --name name        Watch name (for watch add/remove)
  --url url          Watch URL (for watch add)
  --vision           AI visual analysis via NVIDIA Kimi K2.5 (scrape/scan)`);
}

// ---------------------------------------------------------------------------
// Marketplace URL pattern detection
// ---------------------------------------------------------------------------

const MARKETPLACE_PATTERNS = [
  // Craigslist
  { domain: 'craigslist.org', listingPattern: /\/\d{10,}\.html/, nextPattern: /\bstart=(\d+)/, paginateParam: 'start', pageSize: 120 },
  // eBay
  { domain: 'ebay.com', listingPattern: /\/itm\//, nextPattern: /&_pgn=(\d+)/, paginateParam: '_pgn', pageSize: 1 },
  // Facebook Marketplace
  { domain: 'facebook.com', listingPattern: /\/marketplace\/item\/\d+/, nextPattern: null, paginateParam: null },
  // OfferUp
  { domain: 'offerup.com', listingPattern: /\/item\/detail\/\d+/, nextPattern: null, paginateParam: null },
  // Mercari
  { domain: 'mercari.com', listingPattern: /\/item\/m\d+/, nextPattern: /\bpage=(\d+)/, paginateParam: 'page', pageSize: 1 },
  // Gumtree
  { domain: 'gumtree.com', listingPattern: /\/p\/[^/]+\/\d+/, nextPattern: /\bpage=(\d+)/, paginateParam: 'page', pageSize: 1 },
];

function detectMarketplace(url) {
  for (const mp of MARKETPLACE_PATTERNS) {
    if (url.includes(mp.domain)) return mp;
  }
  return null;
}

function isListingUrl(url, marketplace) {
  if (marketplace && marketplace.listingPattern) {
    return marketplace.listingPattern.test(url);
  }
  // Generic heuristic: URL path segment with 5+ consecutive digits (likely a listing ID)
  return /\/\d{5,}/.test(url) || /\/item\//.test(url) || /\/listing\//.test(url);
}

function buildNextPageUrl(baseUrl, page, marketplace) {
  if (!marketplace || !marketplace.paginateParam) return null;

  const url = new URL(baseUrl);
  const offset = marketplace.pageSize > 1 ? page * marketplace.pageSize : page + 1;
  url.searchParams.set(marketplace.paginateParam, String(offset));
  return url.toString();
}

// ---------------------------------------------------------------------------
// SEARCH: Extract listing links from search results
// ---------------------------------------------------------------------------

async function cmdSearch(opts) {
  const url = opts.url;
  if (!url) { console.error('Error: URL required for search command'); process.exit(1); }

  const marketplace = detectMarketplace(url);
  const allLinks = [];
  const seen = new Set();
  let consecutiveFailures = 0;

  console.error(`Searching: ${url}`);
  console.error(`Marketplace: ${marketplace ? marketplace.domain : 'generic'}`);
  console.error(`Pages: ${opts.pages}, Delay: ${opts.delay}ms`);

  for (let page = 0; page < opts.pages; page++) {
    const pageUrl = page === 0 ? url : buildNextPageUrl(url, page, marketplace);
    if (!pageUrl) {
      console.error(`No pagination support for this marketplace, stopping after page 1`);
      break;
    }

    console.error(`Page ${page + 1}/${opts.pages}: ${pageUrl}`);

    try {
      const output = browse(pageUrl, '--links');
      const lines = output.split('\n').filter(l => l.trim());

      let pageLinks = 0;
      for (const line of lines) {
        // browse.js --links format: "url  text"
        const linkUrl = line.split(/\s{2,}/)[0].trim();
        if (!linkUrl || seen.has(linkUrl)) continue;
        if (isListingUrl(linkUrl, marketplace)) {
          seen.add(linkUrl);
          allLinks.push(linkUrl);
          pageLinks++;
        }
      }

      console.error(`  Found ${pageLinks} listing links (${allLinks.length} total)`);
      consecutiveFailures = 0;
    } catch (err) {
      consecutiveFailures++;
      console.error(`  Error: ${err.message}`);
      if (err.message.startsWith('BLOCKED') || consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        console.error(`Aborting: ${consecutiveFailures >= MAX_CONSECUTIVE_FAILURES ? 'too many failures' : 'blocked/captcha detected'}`);
        break;
      }
    }

    if (page < opts.pages - 1) await sleep(opts.delay);
  }

  const result = JSON.stringify(allLinks, null, 2);

  if (opts.output) {
    fs.writeFileSync(opts.output, result);
    console.error(`Saved ${allLinks.length} links to ${opts.output}`);
  } else {
    console.log(result);
  }

  return allLinks;
}

// ---------------------------------------------------------------------------
// SCRAPE: Structured extraction from a single listing
// ---------------------------------------------------------------------------

function extractPrice(text) {
  // Match currency patterns: $1,234.56, €500, £100, "price: 500"
  const patterns = [
    /(?:[\$\€\£])\s*([\d,]+(?:\.\d{2})?)/,
    /(?:price|asking|obo)\s*[:;]?\s*\$?\s*([\d,]+(?:\.\d{2})?)/i,
    /\$([\d,]+(?:\.\d{2})?)/,
  ];
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m) {
      const val = parseFloat(m[1].replace(/,/g, ''));
      if (val > 0 && val < 1000000) return val;
    }
  }
  return null;
}

function extractTitle(text) {
  // Try OG title first (usually in the first heading of browse.js output)
  const h1 = text.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim().slice(0, 200);
  const h2 = text.match(/^##\s+(.+)$/m);
  if (h2) return h2[1].trim().slice(0, 200);
  // Fallback: first non-empty line
  const first = text.split('\n').find(l => l.trim().length > 10);
  return first ? first.trim().slice(0, 200) : null;
}

function extractCondition(text) {
  const lower = text.toLowerCase();
  const conditions = [
    { label: 'new', patterns: [/\bnew\b/, /\bbrand new\b/, /\bnew in box\b/, /\bnib\b/, /\bbnib\b/] },
    { label: 'like new', patterns: [/\blike new\b/, /\bmint\b/, /\bexcellent condition\b/] },
    { label: 'good', patterns: [/\bgood condition\b/, /\bgently used\b/] },
    { label: 'fair', patterns: [/\bfair condition\b/, /\bused\b/] },
    { label: 'for parts', patterns: [/\bfor parts\b/, /\bas[- ]is\b/, /\bbroken\b/, /\bnot working\b/] },
    { label: 'refurbished', patterns: [/\brefurbished\b/, /\brefurb\b/, /\breconditioned\b/] },
  ];
  for (const c of conditions) {
    for (const p of c.patterns) {
      if (p.test(lower)) return c.label;
    }
  }
  return null;
}

function extractLocation(text) {
  // "location: ...", "located in ...", City, ST ZIP
  const patterns = [
    /(?:location|located\s+in|posted\s+in)\s*[:;]?\s*(.{5,60})/i,
    /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?,\s*[A-Z]{2})\b/,
    /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?,\s*[A-Z]{2}\s+\d{5})\b/,
  ];
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m) return m[1].trim().replace(/\n.*/s, '').slice(0, 100);
  }
  return null;
}

function extractSeller(text) {
  const patterns = [
    /(?:sold by|posted by|seller|by)\s*[:;]?\s*([^\n]{2,40})/i,
  ];
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m) return m[1].trim();
  }
  return null;
}

function extractContactUrls(text) {
  const contacts = [];
  const mailto = text.match(/mailto:([^\s\)]+)/g);
  if (mailto) contacts.push(...mailto.map(m => m));
  const tel = text.match(/tel:([^\s\)]+)/g);
  if (tel) contacts.push(...tel.map(t => t));
  return contacts.length > 0 ? contacts : null;
}

function extractImages(text) {
  const images = [];
  const seen = new Set();

  function addImage(url) {
    if (url && !seen.has(url) && !url.includes('data:') && url.startsWith('http')) {
      seen.add(url);
      images.push(url);
    }
  }

  // Markdown image syntax: ![alt](url)
  const mdImgs = text.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g);
  for (const m of mdImgs) addImage(m[2]);

  // Linked images: [[image: alt]](url) — common on Craigslist
  const linkedImgs = text.matchAll(/\[\[image:[^\]]*\]\]\(([^)]+)\)/g);
  for (const m of linkedImgs) addImage(m[1]);

  // Bare image URLs (Craigslist CDN, eBay, common image hosts)
  const bareUrls = text.matchAll(/(https?:\/\/images\.craigslist\.org\/[^\s\)]+|https?:\/\/i\.ebayimg\.com\/[^\s\)]+|https?:\/\/[^\s\)]+\.(?:jpg|jpeg|png|webp))/gi);
  for (const m of bareUrls) addImage(m[1]);

  // OG image (browse.js --full includes it)
  const ogImg = text.match(/og:image[^\n]*?(https?:\/\/[^\s\)]+)/i);
  if (ogImg) addImage(ogImg[1]);

  return images.length > 0 ? images.slice(0, 10) : null;
}

function extractPostedDate(text) {
  const patterns = [
    /(?:posted|listed)\s+(\d+\s+(?:minutes?|hours?|days?|weeks?|months?)\s+ago)/i,
    /(?:posted|listed)\s*[:;]?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
    /(?:posted|listed)\s*[:;]?\s*(\w+ \d{1,2},?\s*\d{4})/i,
  ];
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m) return m[1].trim();
  }
  return null;
}

function extractDescription(text) {
  // Grab the first substantial paragraph-like content after the title
  const lines = text.split('\n');
  let desc = [];
  let collecting = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!collecting && trimmed.length > 40 && !trimmed.startsWith('#') && !trimmed.startsWith('-')) {
      collecting = true;
    }
    if (collecting) {
      if (trimmed.length === 0 && desc.length > 2) break;
      desc.push(trimmed);
      if (desc.join(' ').length > 500) break;
    }
  }
  return desc.length > 0 ? desc.join(' ').slice(0, 500) : null;
}

function computeConfidence(listing) {
  let fields = 0;
  if (listing.price !== null) fields++;
  if (listing.title) fields++;
  if (listing.condition) fields++;
  if (listing.location) fields++;
  if (listing.description) fields++;
  if (listing.images) fields++;

  if (fields >= 5) return 'high';
  if (fields >= 3) return 'medium';
  return 'low';
}

function scrapeListing(url) {
  const raw = browse(url, '--full --wait 2000');

  const listing = {
    url,
    title: extractTitle(raw),
    price: extractPrice(raw),
    condition: extractCondition(raw),
    location: extractLocation(raw),
    seller: extractSeller(raw),
    contact_urls: extractContactUrls(raw),
    images: extractImages(raw),
    posted_date: extractPostedDate(raw),
    description: extractDescription(raw),
    raw_text: raw.slice(0, 3000),
    scraped_at: new Date().toISOString(),
  };

  listing.extraction_confidence = computeConfidence(listing);
  return listing;
}

async function cmdScrape(opts) {
  const url = opts.url;
  if (!url) { console.error('Error: URL required for scrape command'); process.exit(1); }

  console.error(`Scraping: ${url}`);

  try {
    const listing = scrapeListing(url);

    // Vision analysis if requested
    if (opts.vision) {
      const apiKey = loadVisionKey();
      if (!apiKey) {
        console.error('Vision: Synthetic API key not found in ' + VISION_AUTH_FILE);
        console.error('Vision: Skipping. Check Synthetic auth in OpenClaw.');
      } else {
        console.error('Vision: Analyzing listing images...');
        listing.vision = await analyzeListingVision(listing, apiKey);
        if (listing.vision.skipped) {
          console.error(`Vision: Skipped — ${listing.vision.reason}`);
        } else {
          console.error(`Vision: ${listing.vision.identified_item || 'analyzed'} | Deal: ${listing.vision.deal_rating || '?'} | Resale: ${listing.vision.estimated_resale_value || '?'}`);
        }
      }
    }

    const result = JSON.stringify(listing, null, 2);

    if (opts.output) {
      fs.writeFileSync(opts.output, result);
      console.error(`Saved to ${opts.output}`);
    } else {
      console.log(result);
    }

    console.error(`Confidence: ${listing.extraction_confidence} | Price: ${listing.price !== null ? '$' + listing.price : 'N/A'} | Title: ${(listing.title || 'N/A').slice(0, 60)}`);
    return listing;
  } catch (err) {
    console.error(`Scrape failed: ${err.message}`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// SCAN: Full pipeline (search + batch scrape)
// ---------------------------------------------------------------------------

async function cmdScan(opts) {
  const url = opts.url;
  if (!url) { console.error('Error: URL required for scan command'); process.exit(1); }

  const startTime = Date.now();
  const scanId = `scan-${dateStr()}-${hashUrl(url)}`;
  const outFile = opts.output || path.join(DATA_DIR, `${scanId}.json`);
  const progressFile = path.join(PROGRESS_DIR, `${scanId}.json`);

  // Clean stale progress files
  cleanStaleProgress();

  // Load or initialize progress
  let progress = { scrapedUrls: [], results: [], startedAt: new Date().toISOString() };
  if (opts.resume && fs.existsSync(progressFile)) {
    try {
      progress = JSON.parse(fs.readFileSync(progressFile, 'utf-8'));
      console.error(`Resuming scan: ${progress.scrapedUrls.length} already scraped`);
    } catch { /* start fresh */ }
  }

  // Load vision API key if needed
  let visionKey = null;
  if (opts.vision) {
    visionKey = loadVisionKey();
    if (!visionKey) {
      console.error('Vision: Synthetic API key not found in ' + VISION_AUTH_FILE);
      console.error('Vision: Continuing without visual analysis. Check Synthetic auth.');
      opts.vision = false;
    }
  }

  console.error(`Scan: ${url}`);
  console.error(`Pages: ${opts.pages}, Max listings: ${opts.maxListings}, Delay: ${opts.delay}ms${opts.vision ? ', Vision: ON' : ''}`);
  console.error(`Output: ${outFile}`);

  // Step 1: Search for listing URLs
  console.error('\n--- Phase 1: Finding listings ---');
  const listingUrls = await cmdSearch({ ...opts, output: null });

  if (listingUrls.length === 0) {
    console.error('No listing URLs found. Aborting.');
    process.exit(1);
  }

  // Filter out already-scraped URLs
  const toScrape = listingUrls.filter(u => !progress.scrapedUrls.includes(u));
  const cap = Math.min(toScrape.length, opts.maxListings - progress.results.length);

  console.error(`\n--- Phase 2: Scraping ${cap} listings ---`);

  let consecutiveFailures = 0;

  for (let i = 0; i < cap; i++) {
    // Check duration cap
    if (Date.now() - startTime > MAX_DURATION_MS) {
      console.error(`Duration cap reached (30 min). Stopping.`);
      break;
    }

    const listingUrl = toScrape[i];
    console.error(`[${progress.results.length + 1}/${cap}] ${listingUrl.slice(0, 80)}`);

    try {
      const listing = scrapeListing(listingUrl);

      // Vision analysis if enabled
      if (opts.vision && visionKey) {
        console.error(`  Vision: analyzing...`);
        listing.vision = await analyzeListingVision(listing, visionKey);
        if (!listing.vision.skipped) {
          console.error(`  Vision: ${listing.vision.identified_item || '?'} | Deal: ${listing.vision.deal_rating || '?'}`);
        }
      }

      progress.results.push(listing);
      progress.scrapedUrls.push(listingUrl);
      consecutiveFailures = 0;

      console.error(`  -> $${listing.price || '?'} | ${(listing.title || 'no title').slice(0, 50)} [${listing.extraction_confidence}]`);
    } catch (err) {
      consecutiveFailures++;
      progress.scrapedUrls.push(listingUrl); // Don't retry failed URLs
      console.error(`  -> FAILED: ${err.message.slice(0, 100)}`);

      if (err.message.startsWith('BLOCKED') || consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        console.error(`Aborting: ${consecutiveFailures >= MAX_CONSECUTIVE_FAILURES ? 'too many consecutive failures (likely IP ban)' : 'blocked/captcha'}`);
        break;
      }
    }

    // Save progress incrementally (valid JSON after each listing)
    fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));

    if (i < cap - 1) await sleep(opts.delay);
  }

  // Write final output
  const output = {
    scan_url: url,
    scan_date: new Date().toISOString(),
    total_listings: progress.results.length,
    listings: progress.results,
  };

  fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
  console.error(`\nScan complete: ${progress.results.length} listings saved to ${outFile}`);

  // Clean up progress file on successful completion
  if (fs.existsSync(progressFile)) fs.unlinkSync(progressFile);

  return output;
}

function cleanStaleProgress() {
  try {
    const files = fs.readdirSync(PROGRESS_DIR);
    const cutoff = Date.now() - (PROGRESS_STALE_DAYS * 24 * 60 * 60 * 1000);
    for (const f of files) {
      const fp = path.join(PROGRESS_DIR, f);
      const stat = fs.statSync(fp);
      if (stat.mtimeMs < cutoff) {
        fs.unlinkSync(fp);
        console.error(`Cleaned stale progress: ${f}`);
      }
    }
  } catch { /* ignore */ }
}

// ---------------------------------------------------------------------------
// REPORT: Filter, rank, and generate markdown shortlist
// ---------------------------------------------------------------------------

async function cmdReport(opts) {
  const jsonFile = opts.jsonFile;
  if (!jsonFile) { console.error('Error: JSON file path required for report command'); process.exit(1); }
  if (!fs.existsSync(jsonFile)) { console.error(`Error: File not found: ${jsonFile}`); process.exit(1); }

  const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
  let listings = data.listings || data;
  if (!Array.isArray(listings)) { console.error('Error: No listings array found in JSON'); process.exit(1); }

  console.error(`Loaded ${listings.length} listings from ${jsonFile}`);

  // Filter by price
  if (opts.maxPrice !== null) {
    listings = listings.filter(l => l.price === null || l.price <= opts.maxPrice);
    console.error(`After max price ($${opts.maxPrice}): ${listings.length}`);
  }
  if (opts.minPrice !== null) {
    listings = listings.filter(l => l.price === null || l.price >= opts.minPrice);
    console.error(`After min price ($${opts.minPrice}): ${listings.length}`);
  }

  // Score each listing
  listings = listings.map(l => {
    let score = 0;

    // Confidence bonus
    if (l.extraction_confidence === 'high') score += 3;
    else if (l.extraction_confidence === 'medium') score += 1;

    // Keyword matches (in title + description + raw_text)
    if (opts.keywords.length > 0) {
      const searchText = [l.title, l.description, l.raw_text].filter(Boolean).join(' ').toLowerCase();
      for (const kw of opts.keywords) {
        if (searchText.includes(kw)) score += 2;
      }
    }

    // Data completeness
    if (l.price !== null) score += 1;
    if (l.location) score += 1;
    if (l.condition) score += 1;
    if (l.images && l.images.length > 0) score += 1;
    if (l.posted_date) score += 0.5;

    // Vision deal rating bonus
    if (l.vision && !l.vision.skipped) {
      if (l.vision.deal_rating === 'great_deal') score += 5;
      else if (l.vision.deal_rating === 'good_deal') score += 3;
      else if (l.vision.deal_rating === 'fair_price') score += 1;
      else if (l.vision.deal_rating === 'overpriced') score -= 2;
    }

    return { ...l, _score: score };
  });

  // Sort by score descending, then by price ascending (deals first)
  listings.sort((a, b) => {
    if (b._score !== a._score) return b._score - a._score;
    const ap = a.price || Infinity;
    const bp = b.price || Infinity;
    return ap - bp;
  });

  const topN = listings.slice(0, opts.top);

  // Generate markdown report
  const report = generateReport(data, topN, listings, opts);
  const outFile = opts.output || path.join(REPORTS_DIR, `shortlist-${dateStr()}-${hashUrl(data.scan_url || jsonFile)}.md`);

  fs.writeFileSync(outFile, report);
  console.error(`Report saved: ${outFile}`);
  console.log(report);

  return topN;
}

function generateReport(data, topN, allFiltered, opts) {
  const prices = allFiltered.filter(l => l.price !== null).map(l => l.price);
  const avgPrice = prices.length > 0 ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(0) : 'N/A';
  const minPrice = prices.length > 0 ? Math.min(...prices) : 'N/A';
  const maxPriceFound = prices.length > 0 ? Math.max(...prices) : 'N/A';

  const conditions = {};
  allFiltered.forEach(l => {
    const c = l.condition || 'unknown';
    conditions[c] = (conditions[c] || 0) + 1;
  });

  let md = `# Marketplace Scout Shortlist\n\n`;
  md += `**Source:** ${data.scan_url || 'N/A'}\n`;
  md += `**Scanned:** ${data.scan_date || 'N/A'}\n`;
  md += `**Total listings scanned:** ${data.total_listings || allFiltered.length}\n`;
  md += `**After filters:** ${allFiltered.length}\n`;
  md += `**Showing top:** ${topN.length}\n\n`;

  md += `## Summary Stats\n\n`;
  md += `| Metric | Value |\n|--------|-------|\n`;
  md += `| Price range | $${minPrice} - $${maxPriceFound} |\n`;
  md += `| Average price | $${avgPrice} |\n`;
  md += `| Listings with price | ${prices.length}/${allFiltered.length} |\n`;

  if (Object.keys(conditions).length > 0) {
    md += `\n**Condition breakdown:** `;
    md += Object.entries(conditions).map(([k, v]) => `${k}: ${v}`).join(', ');
    md += `\n`;
  }

  if (opts.keywords.length > 0) {
    md += `**Keywords:** ${opts.keywords.join(', ')}\n`;
  }
  if (opts.maxPrice !== null) md += `**Max price filter:** $${opts.maxPrice}\n`;
  if (opts.minPrice !== null) md += `**Min price filter:** $${opts.minPrice}\n`;

  md += `\n---\n\n## Top ${topN.length} Listings\n\n`;

  topN.forEach((l, i) => {
    md += `### ${i + 1}. ${l.title || 'Untitled'}\n\n`;
    md += `- **Price:** ${l.price !== null ? '$' + l.price : 'Not listed'}\n`;
    if (l.condition) md += `- **Condition:** ${l.condition}\n`;
    if (l.location) md += `- **Location:** ${l.location}\n`;
    if (l.posted_date) md += `- **Posted:** ${l.posted_date}\n`;
    if (l.seller) md += `- **Seller:** ${l.seller}\n`;
    md += `- **Confidence:** ${l.extraction_confidence}\n`;
    if (l.description) md += `- **Description:** ${l.description.slice(0, 200)}${l.description.length > 200 ? '...' : ''}\n`;
    if (l.vision && !l.vision.skipped) {
      md += `- **AI Identified:** ${l.vision.identified_item || 'N/A'}\n`;
      md += `- **Estimated Resale:** ${l.vision.estimated_resale_value || 'N/A'}\n`;
      md += `- **Deal Rating:** ${(l.vision.deal_rating || 'unknown').replace(/_/g, ' ').toUpperCase()}\n`;
      if (l.vision.key_observations) md += `- **AI Notes:** ${l.vision.key_observations}\n`;
      if (l.vision.flip_potential) md += `- **Flip Potential:** ${l.vision.flip_potential}\n`;
    }
    md += `- **Link:** ${l.url}\n`;
    md += `\n`;
  });

  md += `---\n*Generated by Marketplace Scout on ${new Date().toISOString()}*\n`;

  return md;
}

// ---------------------------------------------------------------------------
// WATCH: Persistent monitoring with delta detection
// ---------------------------------------------------------------------------

function loadWatches() {
  if (!fs.existsSync(WATCHES_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(WATCHES_FILE, 'utf-8'));
  } catch { return []; }
}

function saveWatches(watches) {
  fs.writeFileSync(WATCHES_FILE, JSON.stringify(watches, null, 2));
}

async function cmdWatch(opts) {
  switch (opts.subcommand) {
    case 'add': return watchAdd(opts);
    case 'list': return watchList();
    case 'remove': return watchRemove(opts);
    case 'run': return watchRun(opts);
    default:
      console.error('Usage: marketplace-scout.js watch add|list|remove|run');
      process.exit(1);
  }
}

function watchAdd(opts) {
  if (!opts.url) { console.error('Error: --url required'); process.exit(1); }
  if (!opts.name) { console.error('Error: --name required'); process.exit(1); }

  const watches = loadWatches();

  if (watches.find(w => w.name === opts.name)) {
    console.error(`Watch "${opts.name}" already exists. Remove it first.`);
    process.exit(1);
  }

  const watch = {
    name: opts.name,
    url: opts.url,
    maxPrice: opts.maxPrice,
    minPrice: opts.minPrice,
    keywords: opts.keywords,
    createdAt: new Date().toISOString(),
    lastRun: null,
    knownListingUrls: [],
  };

  watches.push(watch);
  saveWatches(watches);
  console.log(`Watch added: "${opts.name}"`);
  console.log(JSON.stringify(watch, null, 2));
}

function watchList() {
  const watches = loadWatches();
  if (watches.length === 0) {
    console.log('No active watches.');
    return;
  }
  console.log(`Active watches (${watches.length}):\n`);
  for (const w of watches) {
    console.log(`  ${w.name}`);
    console.log(`    URL: ${w.url}`);
    if (w.maxPrice !== null) console.log(`    Max price: $${w.maxPrice}`);
    if (w.keywords && w.keywords.length) console.log(`    Keywords: ${w.keywords.join(', ')}`);
    console.log(`    Known listings: ${w.knownListingUrls.length}`);
    console.log(`    Last run: ${w.lastRun || 'never'}`);
    console.log('');
  }
}

function watchRemove(opts) {
  if (!opts.name) { console.error('Error: --name required'); process.exit(1); }

  const watches = loadWatches();
  const idx = watches.findIndex(w => w.name === opts.name);
  if (idx === -1) {
    console.error(`Watch "${opts.name}" not found.`);
    process.exit(1);
  }

  watches.splice(idx, 1);
  saveWatches(watches);
  console.log(`Watch removed: "${opts.name}"`);
}

async function watchRun(opts) {
  const watches = loadWatches();
  if (watches.length === 0) {
    console.error('No active watches to run.');
    return;
  }

  const maxAgeDays = opts.maxAge || 7;

  // Load vision API key
  let visionKey = null;
  if (opts.vision) {
    visionKey = loadVisionKey();
    if (!visionKey) {
      console.error('Warning: Vision requested but no API key found. Running without vision.');
    }
  }

  console.error(`Running ${watches.length} watch(es)... (max-age: ${maxAgeDays} days, vision: ${visionKey ? 'ON' : 'OFF'})`);
  const allDeltas = [];

  for (const watch of watches) {
    console.error(`\n--- Watch: ${watch.name} ---`);

    try {
      // Search for current listings
      const searchOpts = {
        url: watch.url,
        pages: 1,
        delay: opts.delay || DEFAULT_DELAY,
        output: null,
      };
      const currentUrls = await cmdSearch(searchOpts);

      // Find new listings (not in knownListingUrls)
      const newUrls = currentUrls.filter(u => !watch.knownListingUrls.includes(u));

      if (newUrls.length === 0) {
        console.error(`  No new listings for "${watch.name}"`);
        watch.lastRun = new Date().toISOString();
        continue;
      }

      console.error(`  ${newUrls.length} new listing(s) found`);

      // Scrape new listings (max 10 per watch run to stay within time limits)
      const cap = Math.min(newUrls.length, 10);
      const newListings = [];

      for (let i = 0; i < cap; i++) {
        console.error(`  Scraping new [${i + 1}/${cap}]: ${newUrls[i].slice(0, 60)}`);
        try {
          const listing = scrapeListing(newUrls[i]);

          // Age filter — skip listings older than maxAgeDays
          const ageDays = parseRelativeAge(listing.posted_date);
          if (ageDays !== null && ageDays > maxAgeDays) {
            console.error(`    -> Skipped (${listing.posted_date} — older than ${maxAgeDays} days)`);
            continue;
          }

          // Apply watch price filters
          if (watch.maxPrice !== null && listing.price !== null && listing.price > watch.maxPrice) {
            console.error(`    -> Filtered out (price $${listing.price} > max $${watch.maxPrice})`);
            continue;
          }
          if (watch.minPrice !== null && listing.price !== null && listing.price < watch.minPrice) {
            console.error(`    -> Filtered out (price $${listing.price} < min $${watch.minPrice})`);
            continue;
          }

          // Vision analysis if enabled
          if (visionKey) {
            console.error(`    Vision: analyzing...`);
            listing.vision = await analyzeListingVision(listing, visionKey);
            if (!listing.vision.skipped) {
              console.error(`    Vision: ${listing.vision.identified_item || '?'} | Deal: ${listing.vision.deal_rating || '?'} | Resale: ${listing.vision.estimated_resale_value || '?'}`);
            }
          }

          newListings.push(listing);
        } catch (err) {
          console.error(`    -> Failed: ${err.message.slice(0, 80)}`);
        }
        if (i < cap - 1) await sleep(opts.delay || DEFAULT_DELAY);
      }

      // Update known URLs (add ALL search results, not just scraped ones)
      watch.knownListingUrls = [...new Set([...watch.knownListingUrls, ...currentUrls])];
      // Keep only the latest 500 to prevent unbounded growth
      if (watch.knownListingUrls.length > 500) {
        watch.knownListingUrls = watch.knownListingUrls.slice(-500);
      }
      watch.lastRun = new Date().toISOString();

      if (newListings.length > 0) {
        allDeltas.push({ watchName: watch.name, listings: newListings });
      }
    } catch (err) {
      console.error(`  Watch "${watch.name}" failed: ${err.message}`);
    }
  }

  saveWatches(watches);

  // Generate delta report
  if (allDeltas.length > 0) {
    const deltaReport = generateDeltaReport(allDeltas);
    const outFile = path.join(REPORTS_DIR, `delta-${dateStr()}.md`);
    fs.writeFileSync(outFile, deltaReport);
    console.error(`\nDelta report: ${outFile}`);
    console.log(deltaReport);
  } else {
    console.error('\nNo new listings across any watches.');
  }
}

function generateDeltaReport(deltas) {
  let md = `# Marketplace Watch - New Listings (${dateStr()})\n\n`;

  let totalNew = 0;
  for (const d of deltas) {
    totalNew += d.listings.length;
    md += `## ${d.watchName} (${d.listings.length} new)\n\n`;

    for (const l of d.listings) {
      md += `- **${l.title || 'Untitled'}** — ${l.price !== null ? '$' + l.price : 'no price'}`;
      if (l.condition) md += ` (${l.condition})`;
      if (l.location) md += ` | ${l.location}`;
      md += `\n  ${l.url}\n`;
      if (l.vision && !l.vision.skipped) {
        md += `  AI: ${l.vision.identified_item || '?'} | Resale: ${l.vision.estimated_resale_value || '?'} | ${(l.vision.deal_rating || '').replace(/_/g, ' ')}\n`;
      }
    }
    md += `\n`;
  }

  md += `---\n*${totalNew} new listing(s) found on ${new Date().toISOString()}*\n`;
  return md;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const opts = parseArgs();

  switch (opts.command) {
    case 'search': await cmdSearch(opts); break;
    case 'scrape': await cmdScrape(opts); break;
    case 'scan': await cmdScan(opts); break;
    case 'report': await cmdReport(opts); break;
    case 'watch': await cmdWatch(opts); break;
    default:
      console.error(`Unknown command: ${opts.command}`);
      printUsage();
      process.exit(1);
  }
}

main().catch(err => {
  console.error('Marketplace Scout error:', err.message);
  process.exit(1);
});
