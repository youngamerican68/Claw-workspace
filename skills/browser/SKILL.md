# Browser - Web Browsing Tool

You have a headless browser available. Use it to visit websites, read their content, take screenshots, and extract links.

## How to Use

Run the browse tool via bash:

```bash
node /root/.openclaw/workspace/browse.js <url> [options]
```

## Modes

### Read a page (default)
Extracts page content as clean markdown text.
```bash
node /root/.openclaw/workspace/browse.js https://example.com
```

### Full page analysis
Text + links + metadata in one shot.
```bash
node /root/.openclaw/workspace/browse.js https://example.com --full
```

### Screenshot
Saves a full-page PNG screenshot.
```bash
node /root/.openclaw/workspace/browse.js https://example.com --screenshot
```

Save to a specific path:
```bash
node /root/.openclaw/workspace/browse.js https://example.com --screenshot --out /path/to/file.png
```

### Extract links only
```bash
node /root/.openclaw/workspace/browse.js https://example.com --links
```

## Options

- `--wait <ms>` — Extra wait time for JS-heavy pages (default: 2000ms)
- `--timeout <ms>` — Navigation timeout (default: 30000ms). Use 60000 for slow sites.
- `--out <path>` — Output path for screenshots

## Tips

- For JS-heavy sites (SPAs, React apps), use `--wait 5000` or higher
- If a site times out, try `--timeout 60000`
- Screenshots are full-page by default
- Text output is truncated at 20,000 chars; use the raw page if you need more
- The browser runs headless Chromium — it renders JavaScript, handles cookies, and follows redirects
