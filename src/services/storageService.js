const STORAGE_KEYS = {
  USERS: 'vidy_users_v1',
  LINKS: 'vidy_links_v1',
  PAGES: 'vidy_pages_v1',
  ANALYTICS: 'vidy_analytics_v1',
  DOMAINS: 'vidy_domains_v1',
  CONFIG: 'vidy_config_v1'
};

export const AVAILABLE_DOMAINS = [
  'cuanflix.site',
  'link.cuanflix.site',
  'cdn.cuanflix.site',
  'go.cuanflix.site',
  'whatsappp.my.id'
];

export const DEFAULT_USERS = [
  {
    id: 'user_admin_1',
    name: 'Super Admin',
    email: 'admin.cuan@gmail.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin.cuan@gmail.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user_member_1',
    name: 'Member Samehadakuu',
    email: 'member@samehadakuu.com',
    role: 'member',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member@samehadakuu.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user_member_2',
    name: 'Affiliate Publisher',
    email: 'affiliate.owner@gmail.com',
    role: 'member',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=affiliate.owner@gmail.com',
    createdAt: new Date().toISOString()
  }
];


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
    name: 'Halaman Arahan Bio Link Affiliate',
    slug: 'bio-links',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <title>My Bio Link</title>
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
    <div class="avatar">IV</div>
    <h3>Ivanka Fipradana</h3>
    <p style="color: #64748b; font-size: 0.9rem;">Official Links & Special Offers</p>
    <a href="#" class="link-btn">Promo Shopee Hari Ini</a>
    <a href="#" class="link-btn">Join Channel Telegram VIP</a>
    <a href="#" class="link-btn">Kunjungi Website Resmi</a>
  </div>
</body>
</html>`,
    createdAt: new Date().toISOString()
  }
];

const INITIAL_LINKS = [
  {
    id: 'link_1',
    shortCode: 'e17QVX',
    domain: 'vidy.vu',
    targetUrl: 'https://shopee.co.id/promo-affiliate-special',
    name: 'Kampanye Shopee Sales ID',
    mode: 'redirect',
    addMp4Suffix: false,
    fallbackPageId: '',
    botPageId: 'page_bot_trap_1',
    devices: ['seluler', 'desktop'],
    countries: ['ID', 'MY', 'SG'],
    countryRule: 'allow',
    referers: ['facebook.com', 'instagram.com'],
    refererRule: 'allow',
    params: ['utm_source=fb', 'ref=campaign1'],
    blockProxy: true,
    clickLimit: 1000,
    forwardUtm: true,
    clicks: 142,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'link_2',
    shortCode: 'x89KLP',
    domain: 'videy.fans',
    targetUrl: 'https://github.com/trending',
    name: 'Github Trending Bot Filter',
    mode: 'redirect',
    addMp4Suffix: false,
    fallbackPageId: 'page_bio_link_1',
    botPageId: 'page_bot_trap_1',
    devices: ['desktop'],
    countries: ['US', 'JP', 'DE'],
    countryRule: 'allow',
    referers: [],
    refererRule: 'allow',
    params: [],
    blockProxy: false,
    clickLimit: 0,
    forwardUtm: false,
    clicks: 89,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'link_3',
    shortCode: 'bunny-demo',
    domain: 'cdn.vidy.my',
    targetUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    name: 'Big Buck Bunny Video Player',
    mode: 'video',
    redirectMode: 'click',
    addMp4Suffix: true,
    fallbackPageId: '',
    botPageId: '',
    devices: [],
    countries: [],
    countryRule: 'allow',
    referers: [],
    refererRule: 'allow',
    params: [],
    blockProxy: false,
    clickLimit: 0,
    forwardUtm: false,
    clicks: 310,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'link_4',
    shortCode: 'fMRS4R',
    domain: 'cuanflix.site',
    targetUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    ogTitle: 'Full HD Viral Video Stream',
    ogDesc: 'Klik tombol play untuk streaming full HD.',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    name: 'Cuanflix Video Demo fMRS4R',
    mode: 'redirect',
    redirectMode: 'click',
    redirectDelay: 3,
    addMp4Suffix: true,
    fallbackPageId: '',
    botPageId: '',
    devices: [],
    countries: [],
    countryRule: 'allow',
    referers: [],
    refererRule: 'allow',
    params: [],
    blockProxy: false,
    clickLimit: 0,
    forwardUtm: false,
    clicks: 520,
    createdAt: new Date().toISOString()
  },
  {
    id: 'link_5',
    shortCode: 'Yq8WF6',
    domain: 'cuanflix.site',
    targetUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    ogTitle: 'Full HD Viral Video Stream Yq8WF6',
    ogDesc: 'Klik tombol play untuk streaming full HD.',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    name: 'Cuanflix Video Yq8WF6',
    mode: 'redirect',
    redirectMode: 'click',
    redirectDelay: 3,
    addMp4Suffix: true,
    fallbackPageId: '',
    botPageId: '',
    devices: [],
    countries: [],
    countryRule: 'allow',
    referers: [],
    refererRule: 'allow',
    params: [],
    blockProxy: false,
    clickLimit: 0,
    forwardUtm: false,
    clicks: 120,
    createdAt: new Date().toISOString()
  }
];

const INITIAL_ANALYTICS = [
  {
    id: 'log_1',
    linkId: 'link_1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    ip: '180.252.12.98',
    country: 'ID',
    device: 'seluler',
    referer: 'facebook.com',
    triggeredRule: 'Rule Allowed (Mobile ID)',
    destinationUrl: 'https://shopee.co.id/promo-affiliate-special?utm_source=fb',
    isBot: false,
    isProxy: false
  },
  {
    id: 'log_2',
    linkId: 'link_1',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    ip: '66.249.66.1',
    country: 'US',
    device: 'desktop',
    referer: 'google.com',
    triggeredRule: 'Bot Trap Triggered',
    destinationUrl: 'Page: Halaman Perangkap Bot (Bot Trap)',
    isBot: true,
    isProxy: false
  },
  {
    id: 'log_3',
    linkId: 'link_2',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    ip: '103.111.42.10',
    country: 'JP',
    device: 'desktop',
    referer: 'direct',
    triggeredRule: 'Rule Allowed (Desktop JP)',
    destinationUrl: 'https://github.com/trending',
    isBot: false,
    isProxy: false
  }
];

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

const INITIAL_CONFIG = {
  timezone: 'Asia/Jakarta',
  googleCrawlerBlock: true,
  ipBlacklist: '192.168.1.*\n10.0.0.1',
  asnList: 'AS15169\nAS13335',
  ispKeywords: 'meta\nfacebook\namazon\ndigitalocean'
};

// Auto Self-Healing function to prune bloated localStorage items
const sanitizeStorageQuota = () => {
  try {
    const rawAnalytics = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (rawAnalytics && rawAnalytics.length > 30000) {
      try {
        const parsed = JSON.parse(rawAnalytics);
        if (Array.isArray(parsed)) {
          const trimmed = parsed.slice(0, 50);
          localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(trimmed));
        } else {
          localStorage.removeItem(STORAGE_KEYS.ANALYTICS);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEYS.ANALYTICS);
      }
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
};

export const getStoredConfig = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(INITIAL_CONFIG));
      return INITIAL_CONFIG;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_CONFIG;
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
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_USERS;
};

export const saveUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch {}
};
