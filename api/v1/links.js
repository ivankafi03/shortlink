import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 405,
      success: false,
      error: 'Method Not Allowed. Use GET method.'
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
    const rows = await sql`SELECT value FROM app_store WHERE key = 'vidy_links_v1';`;
    let currentLinks = [];
    if (rows.length > 0 && Array.isArray(rows[0].value)) {
      currentLinks = rows[0].value;
    }

    const formatted = currentLinks.map(l => ({
      id: l.id,
      short_url: `https://${l.domain}/${l.shortCode}${l.addMp4Suffix ? '.mp4' : ''}`,
      target_url: l.targetUrl,
      alias: l.shortCode,
      domain: l.domain,
      name: l.name,
      mode: l.mode,
      clicks: l.clicks || 0,
      created_at: l.createdAt
    }));

    return res.status(200).json({
      status: 200,
      success: true,
      total: formatted.length,
      data: formatted
    });
  } catch (err) {
    console.error('API Error in /api/v1/links:', err);
    return res.status(500).json({
      status: 500,
      success: false,
      error: err.message
    });
  }
}
