import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { evaluateTrafficRouting } from '../../services/trafficRouter';
import { NativeAdBanner } from '../common/NativeAdBanner';

const MANDATORY_CPM_DIRECT_LINK = 'https://www.effectivecpmnetwork.com/xzgfq5xkc8?key=55406436bb6e7d868ad1a2c1d9a3f4fc';

export const PublicLinkView = ({ shortCode, link, onRecordClick }) => {
  const activeLink = link || {
    id: `dyn_${shortCode}`,
    shortCode: shortCode,
    domain: window.location.hostname,
    targetUrl: 'https://youtube.com',
    ogTitle: `Shortlink ${shortCode}`,
    ogDesc: 'Redirecting...',
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

    if (onRecordClick && typeof onRecordClick === 'function') {
      onRecordClick(activeLink.id, result);
    }

    if (result.action === 'target') {
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
        triggerDestination(result.destinationUrl, activeLink.directLink);
      }
    }
  }, [activeLink, shortCode]);

  const triggerDestination = (targetUrl, customDirectLink) => {
    if (!targetUrl) return;

    const adUrl = (customDirectLink && customDirectLink.trim() !== '') ? customDirectLink : MANDATORY_CPM_DIRECT_LINK;

    try {
      window.open(adUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Ad popup handled:', e);
    }

    setTimeout(() => {
      try {
        window.location.replace(targetUrl);
      } catch {
        window.location.href = targetUrl;
      }
    }, 150);
  };

  const handlePageClick = () => {
    const dest = routingResult?.destinationUrl || activeLink.targetUrl || 'https://youtube.com';
    triggerDestination(dest, activeLink.directLink);
  };

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
      </div>
    );
  }

  // 100% PURE EXACT videy.tf / laju.asia REDIRECTION PAGE
  return (
    <div 
      onClick={handlePageClick}
      style={{
        boxSizing: 'border-box',
        margin: 0,
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#f4f4f0',
        backgroundImage: 'radial-gradient(#d5d5d0 1.5px, transparent 1.5px)',
        backgroundSize: '18px 18px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '16px',
        color: '#111111',
        cursor: 'pointer'
      }}
    >
      <style>{`
        .nb-dots {
          display: flex;
          align-items: flex-end;
          gap: 7px;
          margin-bottom: 4px;
        }
        .nb-dots span {
          display: block;
          width: 14px;
          height: 14px;
          border: 2.5px solid #111111;
          box-shadow: 3px 3px 0 #111111;
          animation: nb-b 0.75s ease-in-out infinite;
        }
        .nb-dots span:nth-child(1) {
          background: #fde047;
        }
        .nb-dots span:nth-child(2) {
          background: #ffffff;
          animation-delay: 0.15s;
        }
        .nb-dots span:nth-child(3) {
          background: #111111;
          animation-delay: 0.3s;
        }
        @keyframes nb-b {
          0%, 100% { transform: translateY(0); }
          45% { transform: translateY(-11px); }
        }
        .lbl {
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #444444;
          margin-bottom: 6px;
        }
        .ad-slot {
          width: 100%;
          margin: 8px 0;
          min-height: 50px;
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Animated Bouncing Dots */}
        <div className="nb-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Redirecting Label */}
        <div className="lbl">
          {countdown > 0 ? `REDIRECTING IN ${countdown}s…` : 'REDIRECTING…'}
        </div>

        {/* Native Ad Banner Slot */}
        <div className="ad-slot" onClick={(e) => e.stopPropagation()}>
          <NativeAdBanner style={{ margin: '0' }} />
        </div>
      </div>
    </div>
  );
};
