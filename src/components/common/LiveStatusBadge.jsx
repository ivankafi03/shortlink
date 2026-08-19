import React, { useState, useEffect } from 'react';

export const LiveStatusBadge = ({ size = 'normal', title }) => {
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

  const tooltipText = title || (
    !isOnline 
      ? 'Koneksi Terputus (Offline)' 
      : isSyncing 
        ? 'Sedang Menyinkronkan Data Cloud…' 
        : 'Sistem Terhubung Real-Time'
  );

  return (
    <span 
      className={isOnline ? 'live-blinking-dot' : 'offline-blinking-dot'}
      style={{ 
        position: 'relative',
        display: 'inline-flex',
        width: isSmall ? '8px' : '9px',
        height: isSmall ? '8px' : '9px',
        borderRadius: '50%',
        background: dotColor,
        flexShrink: 0,
        cursor: 'default',
        verticalAlign: 'middle',
        transition: 'background 0.3s ease'
      }} 
      title={tooltipText}
    />
  );
};

