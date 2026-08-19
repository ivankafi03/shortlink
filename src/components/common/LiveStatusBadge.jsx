import React, { useState, useEffect } from 'react';

export const LiveStatusBadge = ({ size = 'normal', showText = true }) => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isSmall = size === 'small';

  const dotColor = !isOnline 
    ? '#f43f5e' 
    : isSyncing 
      ? '#f59e0b' 
      : '#10b981';

  const bgColor = !isOnline 
    ? 'rgba(244, 63, 94, 0.12)' 
    : isSyncing 
      ? 'rgba(245, 158, 11, 0.12)' 
      : 'rgba(16, 185, 129, 0.12)';

  const textColor = !isOnline 
    ? '#e11d48' 
    : isSyncing 
      ? '#d97706' 
      : '#059669';

  const statusText = !isOnline 
    ? 'Terputus (Offline)' 
    : isSyncing 
      ? 'Menyinkronkan…' 
      : 'Live Real-Time';

  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '0.35rem' : '0.45rem',
        fontSize: isSmall ? '0.7rem' : '0.75rem',
        fontWeight: 800,
        color: textColor,
        background: bgColor,
        padding: isSmall ? '0.15rem 0.5rem' : '0.22rem 0.65rem',
        borderRadius: '999px',
        letterSpacing: '0.03em',
        userSelect: 'none',
        transition: 'all 0.3s ease'
      }}
      title={isOnline ? 'Terhubung ke server cloud real-time' : 'Koneksi internet terputus'}
    >
      <span 
        className={isOnline ? 'live-blinking-dot' : 'offline-blinking-dot'}
        style={{ 
          position: 'relative',
          display: 'inline-flex',
          width: isSmall ? '7px' : '8px',
          height: isSmall ? '7px' : '8px',
          borderRadius: '50%',
          background: dotColor,
          flexShrink: 0
        }} 
      />

      {showText && (
        <span style={{ textTransform: 'uppercase', fontSize: isSmall ? '0.675rem' : '0.725rem' }}>
          {statusText}
        </span>
      )}
    </span>
  );
};
