import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ─── Domain Redirect Guard (runs SYNCHRONOUSLY before any React render) ───────
// All shortlink domains (cuanflix.site, link.cuanflix.site, etc.) forward to
// whatsappp.my.id so link resolution always reads the correct localStorage.
;(function domainGuard() {
  const host = window.location.hostname.toLowerCase();
  // Primary canonical domain — ALL link data lives here
  const isPrimary =
    host === 'whatsappp.my.id' ||
    host.includes('whatsappp') ||
    host === 'cuanflix.site' ||
    host.includes('cuanflix') ||
    host === 'localhost' ||
    host === '127.0.0.1';

  if (!isPrimary) {
    // Preserve the full path + query + hash so the shortlink still resolves
    const dest =
      'https://whatsappp.my.id' +
      window.location.pathname +
      window.location.search +
      window.location.hash;
    window.location.replace(dest);
    // Stop — do NOT mount React, page is already navigating away
    throw new Error('[domainGuard] Redirecting to primary domain: ' + dest);
  }
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
