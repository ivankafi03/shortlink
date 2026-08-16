import React, { useEffect, useRef } from 'react';

export const NativeAdBanner = ({ style = {} }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear previous container content
      containerRef.current.innerHTML = '';

      // Create container div
      const adDiv = document.createElement('div');
      adDiv.id = 'container-863f6aef8282a41ad5ebdefcf161468b';

      // Create script tag
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl29429652.effectivecpmnetwork.com/863f6aef8282a41ad5ebdefcf161468b/invoke.js';
      
      script.onerror = () => {
        // Silently handle AdBlocker blocked requests without breaking the app
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
      };

      containerRef.current.appendChild(adDiv);
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div 
      className="native-ad-wrapper" 
      style={{
        margin: '1.25rem 0',
        minHeight: '100px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        ...style
      }}
    >
      <div ref={containerRef} style={{ width: '100%', textAlign: 'center' }} />
    </div>
  );
};
