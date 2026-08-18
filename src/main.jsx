import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ─── Domain Redirect Guard (runs SYNCHRONOUSLY before any React render) ───────
// All shortlink domains forward to whatsappp.my.id so link resolution always reads correct localStorage.
;(function domainGuard() {
  const host = window.location.hostname.toLowerCase();
  const isPrimary =
    host === 'samehadakuu.com' ||
    host === 'www.samehadakuu.com' ||
    host === 'samehadakuu.site' ||
    host.includes('samehadakuu') ||
    host === 'whatsappp.my.id' ||
    host.includes('whatsappp') ||
    host === 'cuanflix.site' ||
    host.includes('cuanflix') ||
    host === 'localhost' ||
    host === '127.0.0.1';

  if (!isPrimary) {
    const dest =
      'https://whatsappp.my.id' +
      window.location.pathname +
      window.location.search +
      window.location.hash;
    window.location.replace(dest);
    throw new Error('[domainGuard] Redirecting to primary domain: ' + dest);
  }
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
