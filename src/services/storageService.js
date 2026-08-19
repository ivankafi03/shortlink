export const STORAGE_KEYS = {
  USERS: 'vidy_users_v1',
  LINKS: 'vidy_links_v1',
  PAGES: 'vidy_pages_v1',
  ANALYTICS: 'vidy_analytics_v1',
  DOMAINS: 'vidy_domains_v1',
  CONFIG: 'vidy_config_v1'
};

// Cloud Database Sync Helper for Neon Postgres
export const syncToCloud = async (key, value) => {
  try {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
  } catch {
    // Offline / fallback silently handled
  }
};

export const fetchAllFromCloud = async () => {
  try {
    const res = await fetch('/api/data?all=true');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

export const AVAILABLE_DOMAINS = [
  'cuanflix.site',
  'link.cuanflix.site',
  'cdn.cuanflix.site',
  'go.cuanflix.site',
  'whatsappp.my.id'
];

export const DEFAULT_USERS = [];


const INITIAL_PAGES = [
  {
    id: 'page_bot_trap_1',
    name: 'Halaman Perangkap Bot (Bot Trap)',
    slug: 'security-verification',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <title>Verifikasi Keamanan</title>
  <style>
    body { font-family: sans-serif; background: #0f172a; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { background: #1e293b; padding: 2rem; border-radius: 12px; text-align: center; max-width: 400px; border: 1px solid #334155; }
    h2 { color: #f43f5e; margin-top: 0; }
    p { color: #94a3b8; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Access Restricted</h2>
    <p>Sistem kami mendeteksi lalu lintas otomatis atau bot crawling. Silakan verifikasi identitas Anda.</p>
  </div>
</body>
</html>`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'page_bio_link_1',
    name: 'Halaman Arahan Bio Link (Template)',
    slug: 'bio-links',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <title>Official Links & Bio</title>
  <style>
    body { font-family: sans-serif; background: #f6f8fc; color: #1e293b; display: flex; justify-content: center; padding: 2rem 1rem; }
    .container { max-width: 420px; width: 100%; text-align: center; }
    .avatar { width: 80px; height: 80px; border-radius: 50%; background: #2563eb; color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; margin-bottom: 1rem; }
    .link-btn { display: block; width: 100%; padding: 1rem; margin: 0.75rem 0; background: white; color: #0f172a; font-weight: 600; text-decoration: none; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .link-btn:hover { border-color: #2563eb; color: #2563eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="avatar">D</div>
    <h3>Official Links & Bio</h3>
    <p style="color: #64748b; font-size: 0.9rem;">Tautan Resmi & Penawaran Spesial</p>
    <a href="#" class="link-btn">Kunjungi Website Utama</a>
    <a href="#" class="link-btn">Follow Akun Media Sosial</a>
    <a href="#" class="link-btn">Hubungi Dukungan CS</a>
  </div>
</body>
</html>`,
    createdAt: new Date().toISOString()
  }
];

const INITIAL_LINKS = [];

const INITIAL_ANALYTICS = [];

const INITIAL_DOMAINS = [
  {
    id: 'dom_whatsappp_1',
    domainName: 'whatsappp.my.id',
    serverIp: '51.79.145.138',
    status: 'active',
    sslActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'dom_cuanflix_1',
    domainName: 'cuanflix.site',
    serverIp: '51.79.145.138',
    status: 'active',
    sslActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'dom_cuanflix_2',
    domainName: 'link.cuanflix.site',
    serverIp: '51.79.145.138',
    status: 'active',
    sslActive: true,
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_CONFIG = {
  googleClientId: '189146836407-tlu7pjcacmeki4k2ne1ubg8mostet92t.apps.googleusercontent.com',
  timezone: 'Asia/Jakarta',
  googleCrawlerBlock: true,
  ipBlacklist: '185.220.101.*\n185.220.102.*',
  asnList: 'AS15169\nAS16509',
  ispKeywords: 'Googlebot\nDigitalOcean\nLinode\nAmazon'
};

// Auto Self-Healing function to prune bloated localStorage items & purge old dummy seeds
const sanitizeStorageQuota = () => {
  try {
    const rawAnalytics = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (rawAnalytics) {
      try {
        const parsed = JSON.parse(rawAnalytics);
        if (Array.isArray(parsed)) {
          // Purge legacy sample dummy logs
          const filtered = parsed.filter(l => l.id !== 'log_1' && l.id !== 'log_2' && l.id !== 'log_3');
          localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(filtered.slice(0, 300)));
        } else {
          localStorage.removeItem(STORAGE_KEYS.ANALYTICS);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEYS.ANALYTICS);
      }
    }

    const rawLinks = localStorage.getItem(STORAGE_KEYS.LINKS);
    if (rawLinks) {
      try {
        const parsed = JSON.parse(rawLinks);
        if (Array.isArray(parsed)) {
          // Purge legacy dummy demo links
          const filtered = parsed.filter(l => !['link_1', 'link_2', 'link_3', 'link_4', 'link_5'].includes(l.id));
          if (filtered.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(filtered));
          }
        }
      } catch {}
    }
  } catch {
    try {
      localStorage.removeItem(STORAGE_KEYS.ANALYTICS);
    } catch {}
  }
};

// Run self-healing immediately on module load
sanitizeStorageQuota();

export const getStoredLinks = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LINKS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(INITIAL_LINKS));
      return INITIAL_LINKS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_LINKS;
  }
};

export const saveLinks = (links) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
  } catch {
    sanitizeStorageQuota();
    try {
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
    } catch (err) {
      console.warn('Failed to save links after cleanup:', err);
    }
  }
  syncToCloud(STORAGE_KEYS.LINKS, links);
};

export const getStoredPages = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PAGES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(INITIAL_PAGES));
      return INITIAL_PAGES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_PAGES;
  }
};

export const savePages = (pages) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages));
  } catch {
    sanitizeStorageQuota();
    try {
      localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages));
    } catch (err) {
      console.warn('Failed to save pages:', err);
    }
  }
  syncToCloud(STORAGE_KEYS.PAGES, pages);
};

export const getStoredAnalytics = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(INITIAL_ANALYTICS));
      return INITIAL_ANALYTICS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_ANALYTICS;
  }
};

export const recordClick = (logEntry) => {
  try {
    const logs = getStoredAnalytics();
    // Cap analytics logs to latest 50 items to prevent QuotaExceededError
    const updatedLogs = [logEntry, ...logs].slice(0, 50);

    try {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(updatedLogs));
    } catch {
      sanitizeStorageQuota();
      const trimmed = updatedLogs.slice(0, 15);
      try {
        localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(trimmed));
      } catch {}
    }
    syncToCloud(STORAGE_KEYS.ANALYTICS, updatedLogs);

    const links = getStoredLinks();
    const targetLinkIndex = links.findIndex((l) => l.id === logEntry.linkId);
    if (targetLinkIndex !== -1) {
      links[targetLinkIndex].clicks = (links[targetLinkIndex].clicks || 0) + 1;
      saveLinks(links);
    }
  } catch (err) {
    console.warn('Click log quota handled gracefully:', err);
  }
};

export const getStoredDomains = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DOMAINS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.DOMAINS, JSON.stringify(INITIAL_DOMAINS));
      return INITIAL_DOMAINS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_DOMAINS;
  }
};

export const saveDomains = (domains) => {
  try {
    localStorage.setItem(STORAGE_KEYS.DOMAINS, JSON.stringify(domains));
  } catch {
    sanitizeStorageQuota();
    try {
      localStorage.setItem(STORAGE_KEYS.DOMAINS, JSON.stringify(domains));
    } catch (err) {
      console.warn('Failed to save domains:', err);
    }
  }
  syncToCloud(STORAGE_KEYS.DOMAINS, domains);
};

export const getStoredConfig = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
      return DEFAULT_CONFIG;
    }
    const parsed = JSON.parse(data);
    if (!parsed.googleClientId) {
      parsed.googleClientId = DEFAULT_CONFIG.googleClientId;
    }
    return parsed;
  } catch {
    return DEFAULT_CONFIG;
  }
};

export const saveConfig = (config) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch {
    sanitizeStorageQuota();
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch (err) {
      console.warn('Failed to save config:', err);
    }
  }
  syncToCloud(STORAGE_KEYS.CONFIG, config);
};

export const getPublicShowcaseLinks = () => {
  const links = getStoredLinks();
  const publicLinks = links.filter((l) => l.shortCode && l.shortCode.trim() !== '');
  return publicLinks.map((l) => ({
    id: l.id,
    shortCode: l.shortCode,
    domain: l.domain || (typeof window !== 'undefined' ? window.location.hostname : ''),
    ogTitle: l.ogTitle || l.name || `Video Trending ${l.shortCode}`,
    ogDesc: l.ogDesc || 'Klik untuk nonton video streaming full HD.',
    ogImage: l.ogImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    clicks: l.clicks || 0,
    addMp4Suffix: l.addMp4Suffix !== undefined ? l.addMp4Suffix : true
  }));
};

export const getStoredUsers = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Filter out previous dummy seed accounts
      const dummyEmails = ['admin.cuan@gmail.com', 'member@samehadakuu.com', 'affiliate.owner@gmail.com', 'jokosusilo011203@gmail.com'];
      return Array.isArray(parsed) ? parsed.filter(u => !dummyEmails.includes(u.email?.toLowerCase())) : [];
    }
  } catch {}
  return [];
};

export const saveUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch {}
  syncToCloud(STORAGE_KEYS.USERS, users);
};
