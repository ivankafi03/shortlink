import React, { useRef, useState, useEffect } from 'react';
import { QrCode, Download, Copy, Check, X, ExternalLink } from 'lucide-react';

export const QrCodeModal = ({ isOpen, onClose, url, title = 'Shortlink QR Code' }) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);
  const [qrLoaded, setQrLoaded] = useState(false);

  // Generate QR Code on canvas using api.qrserver.com loaded image for maximum compatibility & zero crash risk
  useEffect(() => {
    if (!isOpen || !url) return;
    setQrLoaded(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&margin=10`;

    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      setQrLoaded(true);
    };

    img.onerror = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 300, 300);
      ctx.fillStyle = '#000000';
      ctx.font = '14px sans-serif';
      ctx.fillText('QR Code Generator', 80, 150);
      setQrLoaded(true);
    };
  }, [isOpen, url]);

  if (!isOpen || !url) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    const cleanUrlName = url.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `qrcode_${cleanUrlName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease'
      }}
    >
      <div 
        className="neu-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '1.75rem',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'var(--bg-app)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '34px',
            height: '34px',
            padding: 0
          }}
          title="Tutup"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', width: '100%' }}>
          <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <QrCode size={22} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, lineHeight: 1.2 }}>{title}</h3>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
              {url}
            </p>
          </div>
        </div>

        {/* QR Canvas Box */}
        <div className="neu-panel-inset" style={{ padding: '1.25rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px', marginBottom: '1rem' }}>
          <canvas
            ref={canvasRef}
            style={{ width: '220px', height: '220px', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          {!qrLoaded && (
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.5rem' }}>Generasi QR Code...</p>
          )}
        </div>

        {/* URL Box */}
        <div className="neu-panel-inset" style={{ width: '100%', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.775rem', fontWeight: 700, color: 'var(--primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {url}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-muted)', flexShrink: 0, padding: '0.2rem' }}
            title="Buka Tautan"
          >
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%' }}>
          <button
            onClick={handleCopy}
            className="btn btn-ghost"
            style={{ padding: '0.75rem', fontSize: '0.85rem', fontWeight: 800, justifyContent: 'center' }}
          >
            {copied ? <Check size={16} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={16} />}
            <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
          </button>
          
          <button
            onClick={handleDownload}
            disabled={!qrLoaded}
            className="btn btn-primary"
            style={{ padding: '0.75rem', fontSize: '0.85rem', fontWeight: 800, justifyContent: 'center' }}
          >
            <Download size={16} />
            <span>Unduh PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
