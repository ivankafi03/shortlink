import { neon } from '@neondatabase/serverless';

// ── In-Memory Cache (Protects Neon Database from bot flooding) ──
let memoryCache = {
  data: null,
  timestamp: 0
};
const CACHE_TTL_MS = 4000; // 4 seconds in-memory cache for high-frequency reads

// ── In-Memory IP Rate Limiter ──
const ipRequestCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 10000; // 10 seconds window
const MAX_REQUESTS_PER_WINDOW = 40; // Max 40 requests per 10s per IP

const checkRateLimit = (clientIp) => {
  const now = Date.now();
  const clientData = ipRequestCounts.get(clientIp);

  if (!clientData || now - clientData.startTime > RATE_LIMIT_WINDOW_MS) {
    ipRequestCounts.set(clientIp, { count: 1, startTime: now });
    return true;
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Throttled
  }

  clientData.count++;
  return true;
};

// ── In-Memory IP Click Cooldown (Protects click counts from spam/k6/flooding) ──
const ipClickCooldown = new Map();
const CLICK_COOLDOWN_MS = 30000; // 30 seconds cooldown per IP per link

const isBotUserAgent = (userAgent) => {
  if (!userAgent || typeof userAgent !== 'string') return false;
  const ua = userAgent.toLowerCase();
  return (
    ua.includes('k6') ||
    ua.includes('artillery') ||
    ua.includes('locust') ||
    ua.includes('wrk') ||
    ua.includes('autocannon') ||
    ua.includes('vegeta') ||
    ua.includes('jmeter') ||
    ua.includes('apachebench') ||
    ua.includes('gatling') ||
    ua.includes('python') ||
    ua.includes('curl') ||
    ua.includes('wget') ||
    ua.includes('go-http') ||
    ua.includes('scrapy') ||
    ua.includes('aiohttp') ||
    ua.includes('headless') ||
    ua.includes('puppeteer') ||
    ua.includes('playwright') ||
    ua.includes('postman')
  );
};

// Cleanup old rate limit & click cooldown entries every 60 seconds
if (!global.__rateLimitCleanup) {
  global.__rateLimitCleanup = setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequestCounts.entries()) {
      if (now - data.startTime > RATE_LIMIT_WINDOW_MS * 2) {
        ipRequestCounts.delete(ip);
      }
    }
    for (const [key, timestamp] of ipClickCooldown.entries()) {
      if (now - timestamp > CLICK_COOLDOWN_MS * 2) {
        ipClickCooldown.delete(key);
      }
    }
  }, 60000);
}

export default async function handler(req, res) {
  // CORS Headers for multi-domain support (samehadakuu.com and whatsappp.my.id)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract REAL verified client IP from Cloudflare edge proxy (cannot be faked by k6 or client)
  const cfIp = req.headers['cf-connecting-ip'];
  const xRealIp = req.headers['x-real-ip'];
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = (cfIp && cfIp.trim()) || 
                   (xRealIp && xRealIp.trim()) || 
                   (forwarded ? forwarded.split(',')[0].trim() : '') || 
                   (req.socket?.remoteAddress || '127.0.0.1');

  const clientCountry = req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || 'ID';

  // Apply Anti-DDoS Rate Limiter on REAL physical IP
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please wait a few seconds before trying again.'
    });
  }

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    return res.status(500).json({ error: 'DATABASE_URL or POSTGRES_URL not configured' });
  }

  const sql = neon(connectionString);

  try {
    // Auto-create key-value store table in Neon Postgres
    await sql`
      CREATE TABLE IF NOT EXISTS app_store (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    if (req.method === 'GET') {
      const { key, all } = req.query || {};

      if (all === 'true') {
        const now = Date.now();
        // Return memory cache if fresh (< 4s) to shield Neon Postgres
        if (memoryCache.data && (now - memoryCache.timestamp < CACHE_TTL_MS)) {
          return res.status(200).json(memoryCache.data);
        }

        const rows = await sql`SELECT key, value FROM app_store;`;
        const result = {};
        for (const row of rows) {
          result[row.key] = row.value;
        }

        // Update memory cache
        memoryCache = { data: result, timestamp: now };
        return res.status(200).json(result);
      }

      if (!key) {
        return res.status(400).json({ error: 'Missing key parameter' });
      }

      const rows = await sql`SELECT value FROM app_store WHERE key = ${key};`;
      if (rows.length === 0) {
        return res.status(200).json({ key, value: null });
      }
      return res.status(200).json({ key, value: rows[0].value });
    }

    if (req.method === 'POST') {
      // Invalidate memory cache on any write
      memoryCache = { data: null, timestamp: 0 };

      const { action, key, value, data, logEntry } = req.body || {};

      if (action === 'clear_cooldown') {
        ipRequestCounts.clear();
        ipClickCooldown.clear();
        return res.status(200).json({ success: true, message: 'All IP cooldowns and rate limits cleared' });
      }

      if (action === 'record_click' && logEntry) {
        const userAgentHeader = req.headers['user-agent'] || logEntry.userAgent || '';
        if (isBotUserAgent(userAgentHeader) || logEntry.isBot) {
          return res.status(200).json({ success: false, reason: 'bot_click_ignored' });
        }

        // Server-Side Security: Overwrite client payload with verified network IP & country
        logEntry.ip = clientIp;
        logEntry.country = clientCountry;
        logEntry.timestamp = new Date().toISOString();

        const linkIdentifier = logEntry.linkId || logEntry.shortCode;
        const cooldownKey = `${clientIp}_${linkIdentifier}`;
        const now = Date.now();
        const lastClick = ipClickCooldown.get(cooldownKey);

        // Click Cooldown: Only count 1 click per IP every 30 seconds
        if (lastClick && now - lastClick < CLICK_COOLDOWN_MS) {
          return res.status(200).json({ success: true, ignored: 'duplicate_cooldown' });
        }
        ipClickCooldown.set(cooldownKey, now);

        // 1. Atomically update links clicks in Postgres
        const linkRows = await sql`SELECT value FROM app_store WHERE key = 'vidy_links_v1';`;
        if (linkRows.length > 0 && Array.isArray(linkRows[0].value)) {
          const links = linkRows[0].value;
          const targetIndex = links.findIndex(
            l => l.id === linkIdentifier || l.shortCode === linkIdentifier || l.shortCode?.toLowerCase() === linkIdentifier?.toLowerCase()
          );
          if (targetIndex !== -1) {
            links[targetIndex].clicks = (links[targetIndex].clicks || 0) + 1;
            const updatedLinksJson = JSON.stringify(links);
            await sql`
              INSERT INTO app_store (key, value, updated_at)
              VALUES ('vidy_links_v1', ${updatedLinksJson}::jsonb, NOW())
              ON CONFLICT (key)
              DO UPDATE SET value = ${updatedLinksJson}::jsonb, updated_at = NOW();
            `;
          }
        }

        // 2. Atomically prepend analytics log in Postgres
        const analyticsRows = await sql`SELECT value FROM app_store WHERE key = 'vidy_analytics_v1';`;
        let analytics = [];
        if (analyticsRows.length > 0 && Array.isArray(analyticsRows[0].value)) {
          analytics = analyticsRows[0].value;
        }
        const updatedAnalytics = [logEntry, ...analytics].slice(0, 300);
        const updatedAnalyticsJson = JSON.stringify(updatedAnalytics);
        await sql`
          INSERT INTO app_store (key, value, updated_at)
          VALUES ('vidy_analytics_v1', ${updatedAnalyticsJson}::jsonb, NOW())
          ON CONFLICT (key)
          DO UPDATE SET value = ${updatedAnalyticsJson}::jsonb, updated_at = NOW();
        `;

        return res.status(200).json({ success: true, action: 'record_click' });
      }

      if (action === 'save_all' && data && typeof data === 'object') {
        for (const [k, val] of Object.entries(data)) {
          const jsonVal = JSON.stringify(val);
          await sql`
            INSERT INTO app_store (key, value, updated_at)
            VALUES (${k}, ${jsonVal}::jsonb, NOW())
            ON CONFLICT (key)
            DO UPDATE SET value = ${jsonVal}::jsonb, updated_at = NOW();
          `;
        }
        return res.status(200).json({ success: true });
      }

      if (key && value !== undefined) {
        const jsonVal = JSON.stringify(value);
        await sql`
          INSERT INTO app_store (key, value, updated_at)
          VALUES (${key}, ${jsonVal}::jsonb, NOW())
          ON CONFLICT (key)
          DO UPDATE SET value = ${jsonVal}::jsonb, updated_at = NOW();
        `;
        return res.status(200).json({ success: true, key });
      }

      return res.status(400).json({ error: 'Invalid request payload' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Neon Postgres error in /api/data:', err);
    return res.status(500).json({ error: err.message });
  }
}
