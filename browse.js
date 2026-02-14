#!/usr/bin/env node
/**
 * browse.js - Headless browser tool for ClawBot
 *
 * Usage:
 *   node browse.js <url>                    # Extract page text (markdown)
 *   node browse.js <url> --screenshot       # Save screenshot to /tmp/
 *   node browse.js <url> --links            # Extract all links
 *   node browse.js <url> --full             # Text + links + metadata
 *   node browse.js <url> --wait 5000        # Wait ms before capture (for JS-heavy pages)
 *   node browse.js <url> --screenshot --out /path/to/file.png
 *   node browse.js <url> --no-cookies           # Dismiss cookie banners before capture
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROMIUM_PATH = '/usr/bin/chromium-browser';
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_WAIT = 2000;

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    url: null,
    screenshot: false,
    links: false,
    full: false,
    wait: DEFAULT_WAIT,
    out: null,
    timeout: DEFAULT_TIMEOUT,
    noCookies: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--screenshot') opts.screenshot = true;
    else if (args[i] === '--links') opts.links = true;
    else if (args[i] === '--full') opts.full = true;
    else if (args[i] === '--no-cookies') opts.noCookies = true;
    else if (args[i] === '--wait' && args[i + 1]) opts.wait = parseInt(args[++i], 10);
    else if (args[i] === '--out' && args[i + 1]) opts.out = args[++i];
    else if (args[i] === '--timeout' && args[i + 1]) opts.timeout = parseInt(args[++i], 10);
    else if (!args[i].startsWith('--')) opts.url = args[i];
  }

  if (!opts.url) {
    console.error('Usage: node browse.js <url> [--screenshot] [--links] [--full] [--wait ms] [--out path]');
    process.exit(1);
  }

  // Ensure URL has protocol
  if (!opts.url.startsWith('http://') && !opts.url.startsWith('https://')) {
    opts.url = 'https://' + opts.url;
  }

  return opts;
}

async function dismissCookies(page) {
  // Common cookie consent button selectors
  const selectors = [
    // Generic accept/agree buttons
    'button[id*="accept" i]',
    'button[id*="agree" i]',
    'button[id*="consent" i]',
    'button[class*="accept" i]',
    'button[class*="agree" i]',
    'button[class*="consent" i]',
    'a[id*="accept" i]',
    'a[class*="accept" i]',
    // Common cookie platforms
    '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll', // Cookiebot
    '#onetrust-accept-btn-handler',    // OneTrust
    '.cc-accept-all',                   // CookieConsent
    '.cc-btn.cc-dismiss',              // CookieConsent alt
    '[data-cookiefirst-action="accept"]', // CookieFirst
    '#gdpr-cookie-accept',             // Generic GDPR
    '.cookie-notice-accept',           // Generic
    '#cookie-accept',                  // Generic
    '.js-cookie-accept',               // Generic
    '[aria-label*="accept" i][aria-label*="cookie" i]',
    '[aria-label*="Accept all" i]',
    // Text-based matching via evaluate below
  ];

  for (const sel of selectors) {
    try {
      const btn = await page.$(sel);
      if (btn) {
        const visible = await btn.boundingBox();
        if (visible) {
          await btn.click();
          await new Promise(r => setTimeout(r, 500));
          return true;
        }
      }
    } catch {}
  }

  // Fallback: find buttons by text content
  const clicked = await page.evaluate(() => {
    const patterns = [
      /^accept\s*(all)?$/i,
      /^agree$/i,
      /^allow\s*(all)?$/i,
      /^i\s*accept$/i,
      /^ok$/i,
      /^got\s*it$/i,
      /^accept\s*(cookies?|all\s*cookies?)?$/i,
      /^allow\s*(cookies?|all\s*cookies?)?$/i,
      /^consent$/i,
    ];
    const candidates = document.querySelectorAll('button, a[role="button"], [class*="cookie"] a, [class*="consent"] a');
    for (const el of candidates) {
      const text = el.textContent.trim();
      if (text.length > 50) continue;
      for (const pat of patterns) {
        if (pat.test(text)) {
          el.click();
          return true;
        }
      }
    }
    return false;
  });

  if (clicked) {
    await new Promise(r => setTimeout(r, 500));
    return true;
  }

  // Nuclear option: remove common cookie overlay elements from the DOM
  await page.evaluate(() => {
    const overlaySelectors = [
      '#CybotCookiebotDialog',
      '#onetrust-banner-sdk',
      '#onetrust-consent-sdk',
      '.cc-window',
      '.cookie-banner',
      '.cookie-consent',
      '.cookie-notice',
      '.cookie-popup',
      '.gdpr-banner',
      '[class*="cookiebot" i]',
      '[class*="cookie-banner" i]',
      '[class*="cookie-consent" i]',
      '[class*="cookie-notice" i]',
      '[id*="cookie-banner" i]',
      '[id*="cookie-consent" i]',
      '[id*="cookie-notice" i]',
    ];
    for (const sel of overlaySelectors) {
      document.querySelectorAll(sel).forEach(el => el.remove());
    }
    // Also remove any fixed/sticky overlays that look like cookie banners
    document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]').forEach(el => {
      const text = el.textContent.toLowerCase();
      if (text.includes('cookie') || text.includes('consent') || text.includes('gdpr') || text.includes('privacy')) {
        el.remove();
      }
    });
  });

  return false;
}

async function extractText(page) {
  return await page.evaluate(() => {
    // Remove script, style, nav, footer, header noise
    const remove = document.querySelectorAll('script, style, noscript, svg, iframe');
    remove.forEach(el => el.remove());

    // Remove cookie/consent overlays from DOM before extraction
    const cookieSelectors = [
      '#CybotCookiebotDialog', '#CybotCookiebotDialogBodyUnderlay',
      '#onetrust-banner-sdk', '#onetrust-consent-sdk',
      '.cc-window', '.cookie-banner', '.cookie-consent', '.cookie-notice',
      '.cookie-popup', '.gdpr-banner',
      '[class*="cookiebot" i]', '[class*="cookie-banner" i]',
      '[class*="cookie-consent" i]', '[class*="cookie-notice" i]',
      '[id*="cookie-banner" i]', '[id*="cookie-consent" i]',
      '[id*="CybotCookiebot" i]', '[id*="cookieconsent" i]',
    ];
    for (const sel of cookieSelectors) {
      try { document.querySelectorAll(sel).forEach(el => el.remove()); } catch {}
    }
    // Remove fixed/sticky elements that mention cookies/consent/privacy
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.position === 'fixed' || style.position === 'sticky') {
        const text = el.textContent.toLowerCase();
        if (text.includes('cookie') || text.includes('consent') || text.includes('gdpr') || text.includes('we use cookies')) {
          el.remove();
        }
      }
    });

    function walk(node, depth) {
      let text = '';
      if (node.nodeType === Node.TEXT_NODE) {
        const t = node.textContent.trim();
        if (t) text += t + ' ';
        return text;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return '';

      const tag = node.tagName.toLowerCase();
      const block = ['div', 'p', 'section', 'article', 'main', 'li', 'tr', 'br', 'hr'];
      const heading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

      if (heading.includes(tag)) {
        const level = parseInt(tag[1]);
        const prefix = '#'.repeat(level) + ' ';
        let inner = '';
        for (const child of node.childNodes) inner += walk(child, depth + 1);
        text += '\n' + prefix + inner.trim() + '\n';
      } else if (tag === 'a') {
        let inner = '';
        for (const child of node.childNodes) inner += walk(child, depth + 1);
        const href = node.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          text += '[' + inner.trim() + '](' + href + ') ';
        } else {
          text += inner;
        }
      } else if (tag === 'img') {
        const alt = node.getAttribute('alt');
        if (alt) text += '[image: ' + alt + '] ';
      } else if (tag === 'li') {
        let inner = '';
        for (const child of node.childNodes) inner += walk(child, depth + 1);
        text += '\n- ' + inner.trim();
      } else if (block.includes(tag)) {
        let inner = '';
        for (const child of node.childNodes) inner += walk(child, depth + 1);
        text += '\n' + inner.trim() + '\n';
      } else {
        for (const child of node.childNodes) text += walk(child, depth + 1);
      }
      return text;
    }

    const body = document.body;
    if (!body) return '';
    let result = walk(body, 0);

    // Clean up excessive newlines
    result = result.replace(/\n{3,}/g, '\n\n').trim();
    return result;
  });
}

async function extractLinks(page) {
  return await page.evaluate(() => {
    const links = [];
    const seen = new Set();
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.href;
      const text = a.textContent.trim().slice(0, 100);
      if (href && !seen.has(href) && !href.startsWith('javascript:')) {
        seen.add(href);
        links.push({ text: text || '(no text)', url: href });
      }
    });
    return links;
  });
}

async function extractMeta(page) {
  return await page.evaluate(() => {
    const title = document.title || '';
    const desc = document.querySelector('meta[name="description"]')?.content || '';
    const ogTitle = document.querySelector('meta[property="og:title"]')?.content || '';
    const ogDesc = document.querySelector('meta[property="og:description"]')?.content || '';
    const ogImage = document.querySelector('meta[property="og:image"]')?.content || '';
    return { title, description: desc, ogTitle, ogDescription: ogDesc, ogImage };
  });
}

async function main() {
  const opts = parseArgs();
  let browser;

  try {
    browser = await puppeteer.launch({
      executablePath: CHROMIUM_PATH,
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions',
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36');

    await page.goto(opts.url, {
      waitUntil: 'networkidle2',
      timeout: opts.timeout,
    });

    // Dismiss cookie banners
    if (opts.noCookies) {
      // First attempt right after load
      await dismissCookies(page);
      // Wait for page to react to cookie acceptance
      await new Promise(r => setTimeout(r, opts.wait));
      // Second pass to catch any stragglers
      await dismissCookies(page);
      // Extra wait for SPA content to load after cookie wall clears
      await new Promise(r => setTimeout(r, 1500));
    } else {
      // Normal wait for JS rendering
      if (opts.wait > 0) {
        await new Promise(r => setTimeout(r, opts.wait));
      }
    }

    // Screenshot mode
    if (opts.screenshot) {
      const outPath = opts.out || path.join('/tmp', 'screenshot-' + Date.now() + '.png');
      await page.screenshot({ path: outPath, fullPage: true });
      console.log('Screenshot saved: ' + outPath);
      return;
    }

    // Links mode
    if (opts.links) {
      const links = await extractLinks(page);
      for (const l of links) {
        console.log(l.url + '  ' + l.text);
      }
      return;
    }

    // Full mode
    if (opts.full) {
      const meta = await extractMeta(page);
      const text = await extractText(page);
      const links = await extractLinks(page);

      console.log('# ' + (meta.title || opts.url));
      if (meta.description) console.log('> ' + meta.description);
      console.log('\n---\n');
      console.log(text.slice(0, 15000));
      if (text.length > 15000) console.log('\n... (truncated, ' + text.length + ' chars total)');
      console.log('\n---\n## Links (' + links.length + ')\n');
      for (const l of links.slice(0, 50)) {
        console.log('- [' + l.text.slice(0, 60) + '](' + l.url + ')');
      }
      if (links.length > 50) console.log('... and ' + (links.length - 50) + ' more');
      return;
    }

    // Default: text extraction
    const meta = await extractMeta(page);
    const text = await extractText(page);
    if (meta.title) console.log('# ' + meta.title + '\n');
    console.log(text.slice(0, 20000));
    if (text.length > 20000) console.log('\n... (truncated, ' + text.length + ' chars total)');

  } catch (err) {
    console.error('Browse error: ' + err.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

main();
