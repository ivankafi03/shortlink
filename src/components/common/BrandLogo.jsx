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
      {/* ── SVG Geometric Emblem (Unmistakable Capital Letter D) ── */}
      <svg 
        width={iconWidth} 
        height={iconHeight} 
        viewBox="0 0 120 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 8px rgba(254, 96, 129, 0.38))' }}
      >
        <defs>
          {/* Top-Right Glowing Vidoy Pink Ribbon */}
          <linearGradient id="capD_top" x1="20" y1="12" x2="116" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff8ca5" />
            <stop offset="100%" stopColor="#fe6081" />
          </linearGradient>

          {/* Bottom-Right Deep Vidoy Pink Ribbon */}
          <linearGradient id="capD_bottom" x1="116" y1="60" x2="20" y2="108" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fe6081" />
            <stop offset="100%" stopColor="#e5496d" />
          </linearGradient>

          {/* Left Vertical Spine */}
          <linearGradient id="capD_spine" x1="16" y1="12" x2="48" y2="108" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffd7df" />
            <stop offset="50%" stopColor="#fe6081" />
            <stop offset="100%" stopColor="#e5496d" />
          </linearGradient>

          {/* Inner Accent Core */}
          <linearGradient id="capD_core" x1="44" y1="36" x2="88" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffd5de" />
            <stop offset="100%" stopColor="#fe6081" />
          </linearGradient>
        </defs>

        {/* ── 1. Left Vertical Spine of Capital "D" ── */}
        <path
          d="M 18 16 C 18 13.5 20 12 23 12 L 48 12 L 48 108 L 23 108 C 20 108 18 106.5 18 104 Z"
          fill="url(#capD_spine)"
        />

        {/* ── 2. Top-Half Arc of Capital "D" ── */}
        <path
          d="M 44 12 L 68 12 C 96 12 114 32 114 60 L 68 60 L 44 12 Z"
          fill="url(#capD_top)"
        />

        {/* ── 3. Bottom-Half Arc of Capital "D" ── */}
        <path
          d="M 114 60 C 114 88 96 108 68 108 L 44 108 L 68 60 L 114 60 Z"
          fill="url(#capD_bottom)"
        />

        {/* ── 4. Single Continuous Inner Counter / Hole of Capital "D" (Negative Space) ── */}
        <path
          d="M 46 34 L 64 34 C 80 34 90 45 90 60 C 90 75 80 86 64 86 L 46 86 Z"
          fill="var(--bg-surface, #ffffff)"
        />

        {/* ── 5. Modern Smart Link Inner Accent ── */}
        <path
          d="M 48 44 L 62 44 C 72 44 79 51 79 60 C 79 69 72 76 62 76 L 48 76 Z"
          fill="url(#capD_core)"
          opacity="0.9"
        />

        {/* ── 6. Futuristic Core Negative Gap ── */}
        <path
          d="M 48 52 L 60 52 C 65 52 69 55 69 60 C 69 65 65 68 60 68 L 48 68 Z"
          fill="var(--bg-surface, #ffffff)"
        />

        {/* ── 7. Smart Node Dot & Radar Arc (Top Right) ── */}
        <circle cx="106" cy="18" r="4" fill="#38bdf8" />
        <path d="M 96 15 C 102 12 109 13 113 19" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
      </svg>

      {/* ── Modern Typography Wordmark (Clean Black "shortlink") ── */}
      {showText && (
        <div 
          className={textClassName}
          style={{ 
            display: 'flex', 
            alignItems: 'baseline', 
            fontFamily: 'var(--font-heading, "Plus Jakarta Sans", sans-serif)',
            letterSpacing: '-0.035em',
            color: textColor || 'var(--text-main, #0f172a)'
          }}
        >
          {/* "shortlink" in bold black */}
          <span 
            style={{ 
              fontWeight: 900, 
              fontSize: `${Math.round(size * 0.72)}px`,
              color: textColor || 'var(--text-main, #0f172a)',
              letterSpacing: '-0.035em'
            }}
          >
            shortlink
          </span>
        </div>
      )}
    </div>
  );
};
