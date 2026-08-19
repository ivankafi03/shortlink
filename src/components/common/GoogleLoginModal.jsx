import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Check, Key } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { loadGoogleSdk, parseGoogleJwt, getActiveGoogleClientId, openRealGooglePopup } from '../../services/googleAuthService';

export const GoogleLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [clientId, setClientId] = useState('');
  const [sdkRendered, setSdkRendered] = useState(false);
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const activeId = getActiveGoogleClientId();
    setClientId(activeId);

    loadGoogleSdk()
      .then((googleAuth) => {
        if (activeId && googleBtnRef.current) {
          googleAuth.initialize({
            client_id: activeId,
            callback: (response) => {
              const payload = parseGoogleJwt(response.credential);
              if (payload) {
                const userData = {
                  id: `google_${payload.sub}`,
                  name: payload.name || payload.email.split('@')[0],
                  email: payload.email.toLowerCase(),
                  avatar: payload.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(payload.email)}`,
                  authProvider: 'google_oauth2',
                  role: payload.email.toLowerCase() === 'ivankafipradana@gmail.com' || payload.email.includes('admin') || window.location.hostname.includes('whatsappp') ? 'admin' : 'member',
                  loggedInAt: new Date().toISOString()
                };
                onLoginSuccess(userData);
                onClose();
              }
            }
          });

          googleBtnRef.current.innerHTML = '';
          googleAuth.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left'
          });
          setSdkRendered(true);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleButtonClick = () => {
    openRealGooglePopup({
      clientId,
      onSuccess: (userData) => {
        onLoginSuccess(userData);
        onClose();
      }
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content neu-panel" 
        style={{ maxWidth: '440px', width: '92vw', padding: 0, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="neu-logo-box" style={{ width: '32px', height: '32px', borderRadius: '8px', padding: '2px' }}>
              <img src={logoImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
            </div>
            <span style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.02em' }}>
              D <span style={{ color: 'var(--primary)' }}>shortlink</span>
            </span>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ width: '32px', height: '32px', padding: 0 }} aria-label="Tutup Modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2rem 1.75rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
              Masuk dengan Google
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>
              Klik tombol di bawah untuk membuka pop-up otentikasi resmi Google (accounts.google.com).
            </p>
          </div>

          {/* Unified Single Google Login Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem', width: '100%' }}>
            <div 
              ref={googleBtnRef} 
              id="google-signin-btn-container" 
              style={{ display: sdkRendered ? 'flex' : 'none', justifyContent: 'center', width: '100%' }}
            />

            {!sdkRendered && (
              <button 
                type="button"
                onClick={handleGoogleButtonClick}
                className="neu-panel"
                style={{ 
                  width: '100%', 
                  padding: '0.85rem 1.25rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.85rem',
                  cursor: 'pointer',
                  background: '#ffffff',
                  border: '1px solid #dadce0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.15s ease'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span style={{ fontSize: '0.925rem', fontWeight: 600, color: '#3c4043', fontFamily: 'Roboto, sans-serif' }}>
                  Sign in with Google
                </span>
              </button>
            )}
          </div>

          {/* Security & Guarantee Note */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
            <ShieldCheck size={14} style={{ color: 'var(--accent-emerald)' }} />
            <span>Pop-up otentikasi resmi Google OAuth 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
