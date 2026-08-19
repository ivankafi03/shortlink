import { neon } from '@neondatabase/serverless';

// ── In-Memory IP Rate Limiter for Shortlink Creation ──
const ipShortenCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_SHORTENS_PER_MINUTE = 30; // Max 30 shortlinks created per minute per IP

const checkRateLimit = (clientIp) => {
  const now = Date.now();
  const clientData = ipShortenCounts.get(clientIp);

  if (!clientData || now - clientData.startTime > RATE_LIMIT_WINDOW_MS) {
    ipShortenCounts.set(clientIp, { count: 1, startTime: now });
    return true;
  }

  if (clientData.count >= MAX_SHORTENS_PER_MINUTE) {
    return false;
  }

  clientData.count++;
  return true;
};

export default async function handler(req, res) {
  // CORS Headers for API Consumers (Telegram bot, Python, cURL, etc.)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract client IP
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.socket?.remoteAddress || '127.0.0.1');

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      status: 429,
      success: false,
      error: 'Too Many Requests: Rate limit of 30 shortlinks/minute exceeded. Please wait a minute.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 405,
      success: false,
      error: 'Method Not Allowed. Use POST method to create shortlinks.'
    });
  }

  // Authorization Bearer Token Check
  const authHeader = req.headers['authorization'] || '';
  const apiKey = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!apiKey) {
    return res.status(401).json({
      status: 401,
      success: false,
      error: 'Unauthorized: Missing API Key in Authorization header (Bearer token required).'
    });
  }

  const {
    url,
    alias,
    domain,
    add_mp4,
    redirect_mode = 'auto',
    redirect_delay = 0,
    name
  } = req.body || {};

  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({
      status: 400,
      success: false,
      error: 'Bad Request: "url" field is required and must be a valid URL string.'
    });
  }

  const targetUrl = url.trim();
  const hostHeader = req.headers['host'] || 'samehadakuu.com';
  const targetDomain = (domain && domain.trim()) || hostHeader.replace(/:\d+$/, '');

  // Generate or sanitize alias / slug
  let shortCode = (alias && typeof alias === 'string' && alias.trim()) 
    ? alias.trim().replace(/[^a-zA-Z0-9_-]/g, '') 
    : '';

  if (!shortCode) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 6; i++) {
      shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    return res.status(500).json({
      status: 500,
      success: false,
      error: 'Database connection not configured on server.'
    });
  }

  const sql = neon(connectionString);

  try {
    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS app_store (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Fetch current stored links
    const rows = await sql`SELECT value FROM app_store WHERE key = 'vidy_links_v1';`;
    let currentLinks = [];
    if (rows.length > 0 && Array.isArray(rows[0].value)) {
      currentLinks = rows[0].value;
    }

    // Check alias conflict on same domain
    const isConflict = currentLinks.some(
      l => l.domain?.toLowerCase() === targetDomain.toLowerCase() && 
           l.shortCode?.toLowerCase() === shortCode.toLowerCase()
    );

    if (isConflict) {
      return res.status(409).json({
        status: 409,
        success: false,
        error: `Conflict: Alias "${shortCode}" already exists on domain "${targetDomain}". Please choose another alias.`
      });
    }

    const newLink = {
      id: `link_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      shortCode,
      domain: targetDomain,
      targetUrl,
      name: name || `API Link ${shortCode}`,
      mode: 'redirect',
      addMp4Suffix: Boolean(add_mp4),
      redirectMode: ['auto', 'click', 'direct'].includes(redirect_mode) ? redirect_mode : 'auto',
      redirectDelay: Number(redirect_delay) || 0,
      devices: [],
      countries: [],
      countryRule: 'allow',
      referers: [],
      refererRule: 'allow',
      params: [],
      blockProxy: false,
      forwardUtm: false,
      enableBotBlocker: false,
      clicks: 0,
      createdBy: 'api_developer@samehadakuu.com',
      createdByName: 'Developer REST API',
      createdAt: new Date().toISOString()
    };

    const updatedLinks = [newLink, ...currentLinks];
    const jsonVal = JSON.stringify(updatedLinks);

    await sql`
      INSERT INTO app_store (key, value, updated_at)
      VALUES ('vidy_links_v1', ${jsonVal}::jsonb, NOW())
      ON CONFLICT (key)
      DO UPDATE SET value = ${jsonVal}::jsonb, updated_at = NOW();
    `;

    const fullShortUrl = `https://${targetDomain}/${shortCode}${newLink.addMp4Suffix ? '.mp4' : ''}`;

    return res.status(200).json({
      status: 200,
      success: true,
      data: {
        id: newLink.id,
        short_url: fullShortUrl,
        target_url: targetUrl,
        alias: shortCode,
        domain: targetDomain,
        add_mp4: newLink.addMp4Suffix,
        redirect_mode: newLink.redirectMode,
        redirect_delay: newLink.redirectDelay,
        created_at: newLink.createdAt
      }
    });
  } catch (err) {
    console.error('API Error in /api/v1/shorten:', err);
    return res.status(500).json({
      status: 500,
      success: false,
      error: err.message
    });
  }
}
