import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { evaluateTrafficRouting } from '../../services/trafficRouter';
import { NativeAdBanner } from '../common/NativeAdBanner';
import logoImg from '../../assets/logo.png';

const MANDATORY_CPM_DIRECT_LINK = 'https://www.effectivecpmnetwork.com/xzgfq5xkc8?key=55406436bb6e7d868ad1a2c1d9a3f4fc';

export const PublicLinkView = ({ shortCode, link, onRecordClick }) => {
  // Fallback active link configuration
  const activeLink = link || {
    id: `dyn_${shortCode}`,
    shortCode: shortCode,
    domain: window.location.hostname,
    targetUrl: 'https://youtube.com',
    ogTitle: `Shortlink ${shortCode}`,
    ogDesc: 'Redirecting to target URL...',
    ogImage: '',
    name: `Shortlink ${shortCode}`,
    mode: 'redirect',
    redirectMode: 'auto',
    redirectDelay: 3,
    addMp4Suffix: true
  };

  const [routingResult, setRoutingResult] = useState(null);
  const [countdown, setCountdown] = useState(3);

  // Evaluate traffic routing on mount
  useEffect(() => {
    const userAgent = navigator.userAgent || '';
    const simulatedRequest = {
      userIp: '180.252.12.98',
      country: 'ID',
      device: /mobile|android|iphone|ipad/i.test(userAgent) ? 'seluler' : 'desktop',
      referer: document.referrer || 'direct',
      ispName: 'Provider Internet',
      asnNumber: 'AS23693',
      userAgent,
      queryParams: Object.fromEntries(new URLSearchParams(window.location.search))
    };

    const result = evaluateTrafficRouting(activeLink, simulatedRequest);
    setRoutingResult(result);

    // Record click log
    if (onRecordClick && typeof onRecordClick === 'function') {
      onRecordClick(activeLink.id, result);
    }

    // 100% Direct Routing / Auto Redirect Logic (videy.tf structure + Dark Theme)
    if (result.action === 'target') {
      const mode = activeLink.redirectMode || 'auto';
      const delaySec = activeLink.redirectDelay !== undefined ? Number(activeLink.redirectDelay) : 3;

      setCountdown(delaySec);

      if (delaySec > 0) {
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              triggerDestination(result.destinationUrl, activeLink.directLink);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } else {
        // Zero-delay direct routing
        triggerDestination(result.destinationUrl, activeLink.directLink);
      }
    }
  }, [activeLink, shortCode]);

  // Destination Trigger (Handles Mandatory CPM Direct Link Ad + Target Destination URL)
  const triggerDestination = (targetUrl, customDirectLink) => {
    if (!targetUrl) return;

    const adUrl = (customDirectLink && customDirectLink.trim() !== '') ? customDirectLink : MANDATORY_CPM_DIRECT_LINK;

    // Try popup ad safely in non-blocking try-catch
    try {
      window.open(adUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Ad popup handled:', e);
    }

    // Force redirection to destination URL using replace & assign
    setTimeout(() => {
      try {
        window.location.replace(targetUrl);
      } catch {
        window.location.href = targetUrl;
      }
    }, 150);
  };

  const handleManualClick = (e) => {
    e.preventDefault();
    const dest = routingResult?.destinationUrl || activeLink.targetUrl || 'https://youtube.com';
    triggerDestination(dest, activeLink.directLink);
  };

  // 1. Bot Trap / OG Card / Fallback Custom Content
  if (routingResult?.action === 'bot_trap' || routingResult?.action === 'fallback') {
    const htmlContent = routingResult.botPageContent || routingResult.fallbackPageContent;
    if (htmlContent) {
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
          style={{ width: '100%', minHeight: '100vh' }}
        />
      );
    }
  }

  // 2. Blocked Request
  if (routingResult?.action === 'blocked') {
    return (
      <div style={{
        minHeight: '100vh', background: '#090d16', color: '#f8fafc',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem', textAlign: 'center', fontFamily: 'sans-serif'
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px',
          background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#f59e0b', marginBottom: '1.25rem'
        }}>
          <ShieldAlert size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Akses Dibatasi</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '420px', marginBottom: '1rem' }}>
          Perangkat, lokasi, atau jaringan kamu tidak memenuhi kriteria akses untuk tautan ini.
        </p>
        <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
          Alasan: {routingResult.reason || 'Restriksi Penargetan'}
        </div>
      </div>
    );
  }

  // 3. Dark Theme Redirection Layout (videy.tf bouncing dots & delay structure in OUR dark theme)
  const destinationUrl = routingResult?.destinationUrl || activeLink.targetUrl || 'https://youtube.com';

  return (
    <div 
      onClick={handleManualClick}
      style={{
        boxSizing: 'border-box',
        margin: 0,
        padding: '24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Segoe UI", Roboto, sans-serif',
        background: '#0b0f19',
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px)',
        backgroundSize: '18px 18px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '16px',
        color: '#f8fafc',
        cursor: 'pointer'
      }}
    >
      <style>{`
        .nb-dots {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          margin-bottom: 8px;
        }
        .nb-dots span {
          display: block;
          width: 14px;
          height: 14px;
          border-radius: 4px;
          animation: nb-b 0.75s ease-in-out infinite;
        }
        .nb-dots span:nth-child(1) {
          background: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        .nb-dots span:nth-child(2) {
          background: #06b6d4;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
          animation-delay: 0.15s;
        }
        .nb-dots span:nth-child(3) {
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.4);
          animation-delay: 0.3s;
        }
        @keyframes nb-b {
          0%, 100% { transform: translateY(0); }
          45% { transform: translateY(-11px); }
        }
        .lbl {
          font-size: 0.9rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #3b82f6;
          margin-bottom: 4px;
        }
        .sub-lbl {
          font-size: 0.8rem;
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 6px;
        }
        .ad-slot {
          width: 100%;
          margin: 12px 0;
          min-height: 50px;
        }
        .manual-btn {
          display: inline-block;
          margin-top: 10px;
          padding: 8px 16px;
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 20px;
          color: #60a5fa;
          font-size: 0.775rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }
        .manual-btn:hover {
          background: rgba(59, 130, 246, 0.3);
          color: #ffffff;
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
        maxWidth: '420px',
        width: '100%',
        background: '#151c2c',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '2.25rem 1.5rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
      }}>
        {/* Logo & Domain Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <img src={logoImg} alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#f8fafc', letterSpacing: '-0.02em' }}>
            {activeLink.domain || window.location.hostname}
          </span>
        </div>

        {/* Animated Bouncing Dots */}
        <div className="nb-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Delay Status Label */}
        <div>
          <div className="lbl">
            {countdown > 0 ? `REDIRECTING IN ${countdown}s…` : 'REDIRECTING…'}
          </div>
          <div className="sub-lbl">
            Mengalihkan langsung ke tautan tujuan
          </div>
          <a 
            href={destinationUrl} 
            onClick={handleManualClick} 
            className="manual-btn"
          >
            Klik di sini jika tidak beralih otomatis &rarr;
          </a>
        </div>

        {/* Native Ad Banner Slot */}
        <div className="ad-slot" onClick={(e) => e.stopPropagation()}>
          <NativeAdBanner style={{ margin: '0' }} />
        </div>
      </div>
    </div>
  );
};
