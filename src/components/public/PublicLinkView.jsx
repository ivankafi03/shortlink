import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { evaluateTrafficRouting } from '../../services/trafficRouter';
import { NativeAdBanner } from '../common/NativeAdBanner';
import logoImg from '../../assets/logo.png';

export const PublicLinkView = ({ shortCode, link, onRecordClick }) => {
  // Stable ref so we never recreate the object inside useEffect
  const activeLinkRef = useRef(link || {
    id: `dyn_${shortCode}`,
    shortCode: shortCode,
    domain: window.location.hostname,
    targetUrl: 'https://youtube.com',
    name: `Shortlink ${shortCode}`,
    mode: 'redirect',
    redirectMode: 'auto',
    addMp4Suffix: false
  });

  // If link prop changes (after data loads), update ref
  if (link && link !== activeLinkRef.current) {
    activeLinkRef.current = link;
  }

  const activeLink = activeLinkRef.current;

  const [resolvedIp, setResolvedIp] = useState('180.252.12.98');
  const [routingResult, setRoutingResult] = useState(null);
  // 'redirecting' = initial loading screen, 'card' = landing card (only for redirectMode='click')
  const [phase, setPhase] = useState('redirecting');

  // Redirect function — stable, no deps
  const doRedirect = (dest) => {
    const url = dest || 'https://youtube.com';
    try {
      window.location.replace(url);
    } catch {
      window.location.href = url;
    }
  };

  useEffect(() => {
    // Inject Popunder script dynamically (only on shortlink public view)
    const popScript = document.createElement('script');
    popScript.src = 'https://pl29429557.effectivecpmnetwork.com/ec/06/5a/ec065a7e4c204506aa310f99c17a98a4.js';
    popScript.async = true;
    document.head.appendChild(popScript);

    // Coba dapatkan IP real pengunjung dari API publik
    // Ini async tapi tidak menghambat routing (routing jalan duluan)
    fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(data => { if (data?.ip) setResolvedIp(data.ip); })
      .catch(() => {}); // Silently fail, pakai IP default

    const al = activeLinkRef.current;
    const userAgent = navigator.userAgent || '';
    const simulatedRequest = {
      userIp: resolvedIp,  // Fix: gunakan IP yang diresolve, bukan hardcode
      country: 'ID',
      device: /mobile|android|iphone|ipad/i.test(userAgent) ? 'seluler' : 'desktop',
      referer: document.referrer || 'direct',
      ispName: 'Provider Internet',
      asnNumber: 'AS23693',
      userAgent,
      queryParams: Object.fromEntries(new URLSearchParams(window.location.search))
    };

    const result = evaluateTrafficRouting(al, simulatedRequest);
    setRoutingResult(result);

    if (onRecordClick && typeof onRecordClick === 'function') {
      try { onRecordClick(al.id, result); } catch {}
    }

    if (result.action === 'target') {
      const mode = al.redirectMode;
      // `result.destination` is the resolved destination from trafficRouter
      const dest = result.destination || al.targetUrl || 'https://youtube.com';

      // Always switch to 'card' so NativeAdBanner mounts & registers impression
      setPhase('card');

      if (mode === 'click') {
        // Mode Landing Page: stays on card until user clicks button
        return;
      } else {
        // Mode Langsung: auto-redirect 400ms after banner script mounts, no user click required
        const t = setTimeout(() => doRedirect(dest), 400);
        return () => clearTimeout(t);
      }
    }
    // For blocked/fallback/bot_trap: setRoutingResult will trigger re-render with correct UI
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortCode]); // Only run once per shortCode — link data is loaded synchronously

  // ── Bot Trap / Fallback HTML ────────────────────────────────────────────────
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

  // ── Blocked ─────────────────────────────────────────────────────────────────
  if (routingResult?.action === 'blocked') {
    return (
      <div style={{
        minHeight: '100vh', background: '#eef2f5', color: '#0f172a',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem', textAlign: 'center',
        fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px',
          background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#d97706', marginBottom: '1.25rem'
        }}>
          <ShieldAlert size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Akses Dibatasi</h2>
        <p style={{ color: '#334155', fontSize: '0.9rem', maxWidth: '420px' }}>
          Perangkat, lokasi, atau jaringan kamu tidak memenuhi kriteria akses untuk tautan ini.
        </p>
      </div>
    );
  }

  // ── Phase 1: REDIRECTING... Loading Screen ───────────────────────────────────
  if (phase === 'redirecting') {
    return (
      <div style={{
        minHeight: '100vh', background: '#eef2f5',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
        gap: '12px'
      }}>
        <style>{`
          @keyframes nb-b {
            0%, 100% { transform: translateY(0); }
            45% { transform: translateY(-12px); }
          }
          .nb-dot { display:block; width:14px; height:14px; border-radius:4px; animation:nb-b 0.75s ease-in-out infinite; }
          .nb-dot:nth-child(2){animation-delay:.15s}
          .nb-dot:nth-child(3){animation-delay:.3s}
        `}</style>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <span className="nb-dot" style={{ background: '#2563eb', boxShadow: '3px 3px 6px #c1cbd4,-3px -3px 6px #fff' }}></span>
          <span className="nb-dot" style={{ background: '#38bdf8', boxShadow: '3px 3px 6px #c1cbd4,-3px -3px 6px #fff' }}></span>
          <span className="nb-dot" style={{ background: '#0f172a', boxShadow: '3px 3px 6px #c1cbd4,-3px -3px 6px #fff' }}></span>
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2563eb' }}>
          REDIRECTING…
        </span>
      </div>
    );
  }

  // ── Phase 2: Landing Card (only when redirectMode = 'click') ─────────────────
  const handleGoToLink = (e) => {
    e.stopPropagation();
    const dest = routingResult?.destination || activeLink.targetUrl || 'https://youtube.com';
    doRedirect(dest);
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#eef2f5',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{
        maxWidth: '420px', width: '100%', background: '#eef2f5',
        border: '1px solid rgba(255,255,255,0.8)', borderRadius: '20px',
        padding: '2rem 1.5rem', textAlign: 'center',
        boxShadow: '6px 6px 14px #c1cbd4, -6px -6px 14px #ffffff',
        display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center'
      }}>
        {/* Logo & Domain */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <img src={logoImg} alt="Logo" style={{ width: '24px', height: '24px', borderRadius: '6px', boxShadow: '2px 2px 4px #c1cbd4,-2px -2px 4px #fff' }} />
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#2563eb' }}>
            {activeLink.domain || window.location.hostname}
          </span>
        </div>

        {/* Title & Desc */}
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.3rem', lineHeight: 1.3 }}>
            {activeLink.ogTitle || 'Tautan Siap'}
          </h1>
          <p style={{ fontSize: '0.825rem', color: '#334155', lineHeight: 1.4, margin: 0 }}>
            {activeLink.ogDesc || 'Klik tombol di bawah untuk membuka tautan.'}
          </p>
        </div>

        {/* Native Banner Ad */}
        <div style={{ width: '100%', margin: '0.5rem 0' }}>
          <NativeAdBanner style={{ margin: 0 }} />
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGoToLink}
          style={{
            width: '100%', padding: '0.85rem 1.25rem', borderRadius: '12px',
            background: '#2563eb', color: '#fff', border: 'none',
            fontSize: '0.925rem', fontWeight: 800, cursor: 'pointer',
            boxShadow: '4px 4px 10px #c1cbd4,-4px -4px 10px #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}
        >
          <span>Lanjutkan ke Tautan</span>
          <ExternalLink size={18} />
        </button>

        <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle2 size={13} style={{ color: '#059669' }} />
          <span>Direct Routing · Aman & Terverifikasi</span>
        </div>
      </div>
    </div>
  );
};
