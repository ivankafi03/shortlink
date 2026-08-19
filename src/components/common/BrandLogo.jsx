import React from 'react';

/**
 * Modern Geometric SVG Brand Logo for D shortlink
 * Styled with futuristic isometric facets & vibrant gradients (inspired by modern tech wordmarks)
 */
export const BrandLogo = ({ 
  size = 36, 
  showText = true, 
  textClassName = '',
  textColor,
  style = {} 
}) => {
  const iconHeight = size;
  const iconWidth = Math.round(size * 1.05);

  return (
    <div 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: `${Math.max(6, Math.round(size * 0.22))}px`, 
        userSelect: 'none',
        lineHeight: 1,
        ...style 
      }}
    >
      {/* ── SVG Geometric Emblem (3D Faceted D) ── */}
      <svg 
        width={iconWidth} 
        height={iconHeight} 
        viewBox="0 0 120 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 8px rgba(37, 99, 235, 0.22))' }}
      >
        <defs>
          {/* Main Top-Right Electric Ribbon */}
          <linearGradient id="dRibbonTop" x1="20" y1="15" x2="105" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          {/* Bottom-Right Deep Azure Ribbon */}
          <linearGradient id="dRibbonBottom" x1="105" y1="60" x2="20" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* Left Vertical Spine / Facet */}
          <linearGradient id="dSpine" x1="20" y1="15" x2="52" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>

          {/* Inner Accent Core */}
          <linearGradient id="dCore" x1="45" y1="38" x2="75" y2="82" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          {/* Signal Wave / Link Glow */}
          <linearGradient id="dWave" x1="82" y1="20" x2="115" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* ── Outer Geometric "D" Facets ── */}
        {/* 1. Left Vertical Pillar */}
        <path
          d="M20 18 C20 14.5 23.5 12 27 12 L50 12 L44 108 L26 108 C22.5 108 20 105.5 20 102 Z"
          fill="url(#dSpine)"
        />

        {/* 2. Top Angled Facet */}
        <path
          d="M48 12 L78 12 C96 12 108 24 108 44 C108 53 104 60 97 65 L66 65 L48 12 Z"
          fill="url(#dRibbonTop)"
        />

        {/* 3. Bottom Angled Return Facet */}
        <path
          d="M97 65 C104 70 108 77 108 86 C108 102 94 108 76 108 L44 108 L66 65 L97 65 Z"
          fill="url(#dRibbonBottom)"
        />

        {/* 4. Center Geometric Negative Cutout */}
        <path
          d="M48 38 L68 38 C78 38 84 44 84 54 C84 62 78 68 68 68 L48 68 Z M48 68 L68 68 C78 68 84 74 84 82 C84 89 77 94 67 94 L46 94 Z"
          fill="var(--bg-surface, #ffffff)"
        />

        {/* 5. Modern Smart Link Accent Bar */}
        <path
          d="M52 48 L65 48 C70 48 73 51 73 56 C73 60 70 63 65 63 L52 63 Z"
          fill="url(#dCore)"
        />
        <path
          d="M51 71 L64 71 C69 71 72 74 72 79 C72 83 69 86 64 86 L50 86 Z"
          fill="url(#dCore)"
        />

        {/* 6. Dynamic Signal Dots / Link Nodes (Top Right) */}
        <circle cx="106" cy="18" r="4.5" fill="#38bdf8" />
        <path d="M96 14 C102 11 110 13 114 19" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85" />
      </svg>

      {/* ── Modern Typography Wordmark ── */}
      {showText && (
        <div 
          className={textClassName}
          style={{ 
            display: 'flex', 
            alignItems: 'baseline', 
            gap: '0.12em',
            fontFamily: 'var(--font-heading, "Plus Jakarta Sans", sans-serif)',
            letterSpacing: '-0.035em',
            color: textColor || 'var(--text-main, #0f172a)'
          }}
        >
          {/* Capital "D" */}
          <span 
            style={{ 
              fontWeight: 900, 
              fontSize: `${Math.round(size * 0.72)}px`,
              letterSpacing: '-0.03em',
              marginRight: '0.08em'
            }}
          >
            D
          </span>

          {/* "shortlink" with cyan accent dot on "i" */}
          <span 
            style={{ 
              fontWeight: 900, 
              fontSize: `${Math.round(size * 0.72)}px`,
              background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em'
            }}
          >
            shortlink
          </span>
        </div>
      )}
    </div>
  );
};
