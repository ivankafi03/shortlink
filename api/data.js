import { neon } from '@neondatabase/serverless';

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
        const rows = await sql`SELECT key, value FROM app_store;`;
        const result = {};
        for (const row of rows) {
          result[row.key] = row.value;
        }
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
      const { action, key, value, data, logEntry } = req.body || {};

      if (action === 'record_click' && logEntry) {
        const linkIdentifier = logEntry.linkId || logEntry.shortCode;

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
