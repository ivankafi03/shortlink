import { getStoredConfig, getStoredPages, recordClick } from './storageService';

/**
 * Evaluates an incoming simulated visitor request against link rules and global configuration.
 * Returns the routing decision object: { action: 'target' | 'fallback' | 'bot_trap' | 'blocked', destination: string, reason: string }
 */
export const evaluateTrafficRouting = (link, simulatedRequest = {}, options = {}) => {
  const { dryRun = false } = options;
  const config = getStoredConfig();
  const pages = getStoredPages();

  const {
    userIp = '180.252.12.98',
    country = 'ID',
    device = 'seluler',
    referer = 'facebook.com',
    ispName = 'Telkomsel Indonesia',
    asnNumber = 'AS23693',
    userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
    queryParams = {}
  } = simulatedRequest;

  let isBot = false;
  let isProxy = false;
  let triggeredRule = 'Standard Allowed';
  let finalAction = 'target';
  let destinationUrl = link.targetUrl;
  let botPageContent = null;
  let fallbackPageContent = null;

  // Helper to generate OpenGraph HTML Card
  const generateOgHtml = (title, desc, image, domain) => `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Pratinjau Halaman'}</title>
  <meta property="og:title" content="${title || ''}">
  <meta property="og:description" content="${desc || ''}">
  <meta property="og:image" content="${image || ''}">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #eef2f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
    .og-card { background: #ffffff; width: 100%; max-width: 480px; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .og-img { width: 100%; height: 220px; object-fit: cover; background: #e2e8ed; }
    .og-content { padding: 1.5rem; }
    .og-domain { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 0.35rem; }
    .og-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; line-height: 1.3; }
    .og-desc { font-size: 0.875rem; color: #475569; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="og-card">
    ${image ? `<img src="${image}" class="og-img" alt="OG Preview" />` : ''}
    <div class="og-content">
      <div class="og-domain">${domain || link.domain}</div>
      <div class="og-title">${title || 'Tanpa Judul'}</div>
      <div class="og-desc">${desc || 'Tanpa Deskripsi'}</div>
    </div>
  </div>
</body>
</html>`;

  // Check if link enables bot blocker (default true)
  const isBotBlockerEnabled = link.enableBotBlocker !== undefined ? link.enableBotBlocker : false;

  // 1. Check Global Google Crawler Block (if bot blocker enabled)
  if (isBotBlockerEnabled && config.googleCrawlerBlock && (userAgent.includes('Googlebot') || userAgent.includes('Crawler'))) {
    isBot = true;
    triggeredRule = 'Global Google Crawler Blocked';
  }

  // 2. Check Global IP Blacklist
  const ipList = (config.ipBlacklist || '').split('\n').map(i => i.trim()).filter(Boolean);
  for (const pattern of ipList) {
    try {
      const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`);
      if (regex.test(userIp)) {
        triggeredRule = `IP Blacklisted (${pattern})`;
        finalAction = 'blocked';
      }
    } catch {
      // Pattern IP tidak valid, lewati
    }
  }

  // 3. Check Global ASN & ISP Blacklist
  const asnList = (config.asnList || '').split('\n').map(a => a.trim().toUpperCase()).filter(Boolean);
  if (asnList.includes(asnNumber.toUpperCase())) {
    triggeredRule = `ASN Blacklisted (${asnNumber})`;
    finalAction = 'blocked';
  }

  const ispKeywords = (config.ispKeywords || '').split('\n').map(i => i.trim().toLowerCase()).filter(Boolean);
  for (const kw of ispKeywords) {
    if (ispName.toLowerCase().includes(kw)) {
      isBot = true;
      triggeredRule = `ISP Keyword Blacklisted (${kw})`;
      finalAction = 'blocked';
    }
  }

  // 4. Check Proxy / VPN Blocker
  // Cek range IP private/LAN yang umum dipakai VPN atau proxy lokal
  const isProxyBlockerEnabled = link.blockProxy !== undefined ? link.blockProxy : true;
  const isPrivateIp = (
    userIp.startsWith('10.') ||
    userIp.startsWith('192.168.') ||
    userIp.startsWith('127.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(userIp) // 172.16.0.0/12
  );
  if (isProxyBlockerEnabled && (isProxy || isPrivateIp)) {
    isProxy = true;
    triggeredRule = 'Proxy / VPN / Private IP Detected';
    finalAction = 'blocked';
  }

  // 5. Check Global Click Limit (total clicks on this link, not per-IP)
  const clickCap = link.clickLimit || 0;
  if (clickCap > 0 && link.clicks >= clickCap) {
    triggeredRule = `Click Limit Reached (${clickCap} total clicks)`;
    finalAction = 'blocked';
  }

  // Determine Bot configuration (synced with fallback if botSameAsFallback is true)
  const isBotSynced = link.botSameAsFallback !== undefined ? link.botSameAsFallback : true;
  const effectiveBotType = isBotSynced ? (link.fallbackType || 'url') : (link.botType || 'url');
  const effectiveBotUrl = isBotSynced ? link.fallbackUrl : link.botUrl;
  const effectiveBotPageId = isBotSynced ? link.fallbackPageId : link.botPageId;
  const effectiveBotOgTitle = isBotSynced ? link.fallbackOgTitle : link.botOgTitle;
  const effectiveBotOgDesc = isBotSynced ? link.fallbackOgDesc : link.botOgDesc;
  const effectiveBotOgImage = isBotSynced ? link.fallbackOgImage : link.botOgImage;

  // 6. Check Bot Trap Rule (only if Bot Blocker is enabled)
  if (isBotBlockerEnabled && (isBot || userAgent.toLowerCase().includes('bot') || userAgent.toLowerCase().includes('spider'))) {
    isBot = true;

    if (effectiveBotType === 'url' && effectiveBotUrl) {
      triggeredRule = `Bot Redirect URL: ${effectiveBotUrl}`;
      finalAction = 'bot_trap';
      destinationUrl = effectiveBotUrl;
    } else if (effectiveBotType === 'page' && effectiveBotPageId) {
      const botPage = pages.find(p => p.id === effectiveBotPageId);
      if (botPage) {
        triggeredRule = `Bot Trap Page: ${botPage.name}`;
        finalAction = 'bot_trap';
        destinationUrl = `Page: ${botPage.name}`;
        botPageContent = botPage.htmlContent;
      }
    } else if (effectiveBotType === 'og') {
      triggeredRule = `Bot OG Preview: ${effectiveBotOgTitle || 'OG Card'}`;
      finalAction = 'bot_trap';
      destinationUrl = `OG Card: ${effectiveBotOgTitle || 'Pratinjau OG'}`;
      botPageContent = generateOgHtml(effectiveBotOgTitle, effectiveBotOgDesc, effectiveBotOgImage, link.domain);
    } else {
      triggeredRule = 'Bot Request Blocked';
      finalAction = 'blocked';
    }
  }

  // 7. If not blocked yet, evaluate Targeting Criteria
  if (finalAction === 'target') {
    let passedTargeting = true;

    // Device check
    if (link.devices && link.devices.length > 0) {
      if (!link.devices.includes(device)) {
        passedTargeting = false;
        triggeredRule = `Device Mismatch (Req: ${device}, Allowed: ${link.devices.join(', ')})`;
      }
    }

    // Country check
    if (passedTargeting && link.countries && link.countries.length > 0) {
      const inList = link.countries.map(c => c.toUpperCase()).includes(country.toUpperCase());
      if (link.countryRule === 'allow' && !inList) {
        passedTargeting = false;
        triggeredRule = `Country Not Allowed (${country})`;
      } else if (link.countryRule === 'block' && inList) {
        passedTargeting = false;
        triggeredRule = `Country Blocked (${country})`;
      }
    }

    // Referer check
    if (passedTargeting && link.referers && link.referers.length > 0) {
      const refMatch = link.referers.some(r => referer.toLowerCase().includes(r.toLowerCase()));
      if (link.refererRule === 'allow' && !refMatch) {
        passedTargeting = false;
        triggeredRule = `Referer Not Allowed (${referer})`;
      } else if (link.refererRule === 'block' && refMatch) {
        passedTargeting = false;
        triggeredRule = `Referer Blocked (${referer})`;
      }
    }

    // Query parameters check
    if (passedTargeting && link.params && link.params.length > 0) {
      for (const paramStr of link.params) {
        const [key, val] = paramStr.split('=').map(s => s?.trim());
        if (key) {
          if (!(key in queryParams) || (val && queryParams[key] !== val)) {
            passedTargeting = false;
            triggeredRule = `Missing Required Query Param (${paramStr})`;
            break;
          }
        }
      }
    }

    // Handle Fallback if targeting fails
    if (!passedTargeting) {
      const fallbackType = link.fallbackType || (link.fallbackPageId ? 'page' : 'url');

      if (fallbackType === 'url' && link.fallbackUrl) {
        finalAction = 'fallback';
        destinationUrl = link.fallbackUrl;
      } else if (fallbackType === 'page' && link.fallbackPageId) {
        const fbPage = pages.find(p => p.id === link.fallbackPageId);
        if (fbPage) {
          finalAction = 'fallback';
          destinationUrl = `Fallback Page: ${fbPage.name}`;
          fallbackPageContent = fbPage.htmlContent;
        } else {
          finalAction = 'blocked';
        }
      } else if (fallbackType === 'og') {
        finalAction = 'fallback';
        destinationUrl = `Fallback OG Card: ${link.fallbackOgTitle || 'Pratinjau OG'}`;
        fallbackPageContent = generateOgHtml(link.fallbackOgTitle, link.fallbackOgDesc, link.fallbackOgImage, link.domain);
      } else {
        finalAction = 'blocked';
      }
    } else {
      // Forward UTM & query parameters if enabled
      const isForwardUtmEnabled = link.forwardUtm !== undefined ? link.forwardUtm : true;
      if (isForwardUtmEnabled && Object.keys(queryParams).length > 0) {
        try {
          const urlObj = new URL(link.targetUrl);
          Object.entries(queryParams).forEach(([k, v]) => {
            urlObj.searchParams.set(k, v);
          });
          destinationUrl = urlObj.toString();
        } catch {
          destinationUrl = link.targetUrl;
        }
      }
    }
  }

  // Record Click Log
  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    linkId: link.id,
    shortCode: link.shortCode,
    timestamp: new Date().toISOString(),
    ip: userIp,
    country,
    device,
    referer,
    triggeredRule,
    destinationUrl,
    isBot,
    isProxy
  };

  // Jangan record click jika dry run (mis. dari simulator)
  if (!dryRun) {
    recordClick(logEntry);
  }

  return {
    action: finalAction,
    destination: destinationUrl,
    rule: triggeredRule,
    botPageContent,
    fallbackPageContent,
    logEntry
  };
};
