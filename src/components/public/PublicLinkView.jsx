import React, { useState, useEffect } from 'react';
import { ExternalLink, ShieldAlert, AlertTriangle, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { evaluateTrafficRouting } from '../../services/trafficRouter';
import logoImg from '../../assets/logo.png';

export const PublicLinkView = ({ shortCode, link, onRecordClick }) => {
  // If link is not explicitly found in localStorage, create a dynamic active link fallback
  const activeLink = link || {
    id: `dyn_${shortCode}`,
    shortCode: shortCode,
    domain: window.location.hostname,
    targetUrl: 'https://youtube.com',
    ogTitle: `Tautan Pendek (${shortCode})`,
    ogDesc: 'Klik tombol di bawah untuk membuka tautan tujuan.',
    ogImage: '',
    name: `Shortlink ${shortCode}`,
    mode: 'redirect',
    redirectMode: 'auto',
    redirectDelay: 0,
    addMp4Suffix: true
  };

  const [routingResult, setRoutingResult] = useState(null);
  const [countdown, setCountdown] = useState(0);

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

    // 100% Direct Routing / Auto Redirect Logic (laju.asia concept)
    if (result.action === 'target') {
      const mode = activeLink.redirectMode || 'auto';
      const delaySec = activeLink.redirectDelay !== undefined ? Number(activeLink.redirectDelay) : 0;

      if (mode === 'auto' || mode === 'direct') {
        if (delaySec > 0) {
          setCountdown(delaySec);
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
    }
  }, [activeLink, shortCode]);

  // Destination Trigger (Handles CPM Direct Link Ad + Target Destination URL)
  const triggerDestination = (targetUrl, directLink) => {
    if (!targetUrl) return;

    if (directLink && directLink.trim() !== '') {
      // Open CPM Direct Link Ad in new tab
      try {
        window.open(directLink, '_blank', 'noopener,noreferrer');
      } catch {
        // ignore popup blocks
      }
    }

    // Direct routing to destination URL (e.g. YouTube)
    window.location.href = targetUrl;
  };

  const handleManualClick = () => {
    if (routingResult?.action === 'target' && routingResult?.destinationUrl) {
      triggerDestination(routingResult.destinationUrl, activeLink.directLink);
    }
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

  // 3. Zero Delay Direct Routing Loader (Shown briefly when redirecting)
  if (routingResult?.action === 'target' && (activeLink.redirectMode === 'auto' || activeLink.redirectMode === 'direct') && countdown === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0b0f19',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#3b82f6', marginBottom: '1rem',
          animation: 'pulse 1.5s infinite'
        }}>
          <Zap size={28} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>Mengalihkan ke Tautan...</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Direct Routing & Zero Delay Redirect</p>
      </div>
    );
  }

  // 4. Click Mode / Delay Mode Landing Page (laju.asia style clean card)
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b0f19',
      color: '#f1f5f9',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: '#151c2c',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '2rem 1.5rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
      }}>
        {/* Logo / Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <img src={logoImg} alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#f8fafc', letterSpacing: '-0.02em' }}>
            {activeLink.domain || window.location.hostname}
          </span>
        </div>

        {/* OG Image / Thumbnail if available */}
        {activeLink.ogImage && (
          <div style={{
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <img src={activeLink.ogImage} alt="OG Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        {/* Title & Desc */}
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          {activeLink.ogTitle || 'Tautan Anda Siap'}
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.75rem' }}>
          {activeLink.ogDesc || 'Klik tombol di bawah ini untuk membuka tautan tujuan.'}
        </p>

        {/* Auto Delay Progress Banner */}
        {countdown > 0 && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            color: '#60a5fa',
            fontWeight: 700
          }}>
            Mengalihkan otomatis dalam <span style={{ fontSize: '1rem', fontWeight: 900 }}>{countdown}</span> detik...
          </div>
        )}

        {/* Main Action Button */}
        <button
          onClick={handleManualClick}
          style={{
            width: '100%',
            padding: '0.9rem 1.25rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'transform 0.15s'
          }}
        >
          <span>Lanjutkan ke Tautan</span>
          <ExternalLink size={18} />
        </button>

        <div style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          <CheckCircle2 size={13} style={{ color: '#22c55e' }} />
          <span>100% Direct Routing · Aman & Terverifikasi</span>
        </div>
      </div>
    </div>
  );
};
