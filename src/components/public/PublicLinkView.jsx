import React, { useState, useEffect, useRef } from 'react';
import { Play, ShieldAlert, AlertTriangle, ExternalLink, ArrowRight, Volume2, VolumeX, Maximize } from 'lucide-react';
import { evaluateTrafficRouting } from '../../services/trafficRouter';
import logoImg from '../../assets/logo.png';

export const PublicLinkView = ({ shortCode, link, onRecordClick }) => {
  const [routingResult, setRoutingResult] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasClicked, setHasClicked] = useState(false);
  const videoRef = useRef(null);

  // Evaluate traffic routing on mount
  useEffect(() => {
    if (!link) {
      setRoutingResult({ action: 'not_found' });
      return;
    }

    // Determine visitor context (simulated browser visitor)
    const userAgent = navigator.userAgent || '';
    const simulatedRequest = {
      userIp: '180.252.12.98', // Default visitor IP
      country: 'ID',
      device: /mobile|android|iphone|ipad/i.test(userAgent) ? 'seluler' : 'desktop',
      referer: document.referrer || 'direct',
      ispName: 'Provider Internet',
      asnNumber: 'AS23693',
      userAgent,
      queryParams: Object.fromEntries(new URLSearchParams(window.location.search))
    };

    const result = evaluateTrafficRouting(link, simulatedRequest);
    setRoutingResult(result);

    // Record click log
    if (onRecordClick && typeof onRecordClick === 'function') {
      onRecordClick(link.id, result);
    }

    // Handle Auto Redirect Timer if mode is 'auto'
    if (result.action === 'target' && (link.redirectMode === 'auto' || !link.redirectMode)) {
      const delaySec = link.redirectDelay !== undefined ? link.redirectDelay : 3;
      setCountdown(delaySec);

      if (delaySec > 0) {
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              triggerDestination(result.destinationUrl, link.directLink);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } else {
        triggerDestination(result.destinationUrl, link.directLink);
      }
    } else if (result.action === 'target' && link.redirectMode === 'direct') {
      // Direct mode (0 delay)
      triggerDestination(result.destinationUrl, link.directLink);
    }
  }, [link, shortCode]);

  // Destination Trigger (Handles Direct Link CPM Ad + Target Video URL)
  const triggerDestination = (targetUrl, directLink) => {
    if (!targetUrl) return;

    if (directLink && directLink.trim() !== '') {
      // Open CPM Direct Link Ad in new tab
      window.open(directLink, '_blank', 'noopener,noreferrer');
    }

    // Redirect current tab to target URL
    window.location.href = targetUrl;
  };

  // Play Video / Click Action
  const handlePlayClick = () => {
    setHasClicked(true);

    if (routingResult?.action === 'target' && routingResult?.destinationUrl) {
      if (link.directLink && link.directLink.trim() !== '') {
        // Open Direct Link CPM Ad in new tab
        window.open(link.directLink, '_blank', 'noopener,noreferrer');
      }

      // If video URL is direct mp4/m3u8, attempt to play in video player first or redirect
      const isMediaFile = /\.(mp4|m3u8|webm)($|\?)/i.test(link.targetUrl);
      if (isMediaFile && videoRef.current) {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // If browser blocks autoplay, redirect to target URL
          window.location.href = routingResult.destinationUrl;
        });
      } else {
        // Redirect to target URL
        window.location.href = routingResult.destinationUrl;
      }
    }
  };

  // 1. Link Not Found (404)
  if (!link || routingResult?.action === 'not_found') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        textAlign: 'center',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px',
          background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ef4444', marginBottom: '1.25rem'
        }}>
          <AlertTriangle size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Tautan Tidak Ditemukan</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '400px', marginBottom: '1.5rem' }}>
          Tautan pendek yang kamu tuju tidak ada atau telah dihapus oleh pemiliknya.
        </p>
        <a href="/" style={{
          padding: '0.65rem 1.25rem', background: '#3b82f6', color: '#fff',
          borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem'
        }}>
          Kembali ke Beranda
        </a>
      </div>
    );
  }

  // 2. Bot Trap / OG Card / Fallback Custom Content
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

  // 3. Blocked Request
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

  // 4. Real Visitor Target View (Video Player & Redirect Landing Page)
  const isVideo = link.targetUrl && /\.(mp4|m3u8|webm)($|\?)/i.test(link.targetUrl);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b0f19',
      color: '#f1f5f9',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem'
    }}>
      {/* Top Header Branding */}
      <header style={{
        width: '100%',
        maxWidth: '720px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 0',
        marginBottom: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img src={logoImg} alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '8px' }} />
          <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', color: '#f8fafc' }}>
            {link.domain || 'cuanflix.site'}
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontWeight: 700 }}>
          HD Streaming Player
        </span>
      </header>

      {/* Main Container */}
      <main style={{ width: '100%', maxWidth: '720px' }}>

        {/* Timer Banner (for Auto Mode) */}
        {link.redirectMode === 'auto' && countdown > 0 && (
          <div style={{
            background: 'linear-gradient(90deg, #1e293b, #0f172a)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '0.85rem 1.25rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#cbd5e1' }}>
              Mengalihkan otomatis dalam <span style={{ color: '#60a5fa', fontWeight: 800, fontSize: '1rem' }}>{countdown}</span> detik...
            </div>
            <button
              onClick={() => triggerDestination(routingResult?.destinationUrl, link.directLink)}
              style={{
                background: '#2563eb', color: '#fff', border: 'none', padding: '0.4rem 0.85rem',
                borderRadius: '8px', fontWeight: 700, fontSize: '0.775rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.35rem'
              }}
            >
              <span>Lompati</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Video Player Box */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          background: '#000',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {isVideo ? (
            <video
              ref={videoRef}
              src={link.targetUrl}
              poster={link.ogImage || ''}
              playsInline
              muted={isMuted}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              backgroundImage: `url(${link.ogImage || 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: isPlaying ? 'none' : 'brightness(0.7)'
            }} />
          )}

          {/* Big Center Play Button Overlay */}
          {(!isPlaying || !isVideo) && (
            <button
              onClick={handlePlayClick}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                border: '4px solid rgba(255, 255, 255, 0.8)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(37, 99, 235, 0.5)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                zIndex: 10
              }}
              aria-label="Play Video"
            >
              <Play size={32} style={{ marginLeft: '4px' }} fill="#ffffff" />
            </button>
          )}

          {/* Video Title Bar overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '1rem',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            zIndex: 5
          }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {link.ogTitle || 'Video Content HD'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#cbd5e1', margin: '0.2rem 0 0 0' }}>
                {link.ogDesc || 'Klik tombol play untuk melanjutkan ke pemutar full HD.'}
              </p>
            </div>
            {isVideo && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', padding: '0.4rem', borderRadius: '50%', cursor: 'pointer' }}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            )}
          </div>
        </div>

        {/* Call to Action Button below video */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <button
            onClick={handlePlayClick}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              color: '#ffffff',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'transform 0.15s'
            }}
          >
            <Play size={20} fill="#ffffff" />
            <span>NONTON FULL VIDEO HD DISINI</span>
          </button>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.65rem' }}>
            Aman & Bebas Virus · Bebas Streaming Tanpa Batas
          </p>
        </div>

      </main>
    </div>
  );
};
