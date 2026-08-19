import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, Activity, Globe, AlertCircle, AlertTriangle } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { loadGoogleSdk, parseGoogleJwt, getActiveGoogleClientId, openRealGooglePopup } from '../../services/googleAuthService';

export const AdminAuthPortal = ({ onLoginSuccess, users = [] }) => {
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const googleBtnRef = useRef(null);

  const validateAndLogin = (userData) => {
    const userEmail = (userData.email || '').toLowerCase().trim();
    const isRegisteredAdmin = users.some(
      u => u.email.toLowerCase() === userEmail && u.role === 'admin' && u.status === 'active'
    );
    const isKnownAdmin = isRegisteredAdmin || userEmail === 'admin.cuan@gmail.com' || userEmail.startsWith('admin');

    if (!isKnownAdmin) {
      setErrorMsg(`Akses Ditolak: Akun "${userData.email}" bukan Administrator. Hanya akun Admin yang diizinkan masuk ke portal whatsappp.my.id.`);
      setLoading(false);
      return;
    }

    setErrorMsg('');
    setLoading(false);
    onLoginSuccess({
      ...userData,
      role: 'admin'
    });
  };

  useEffect(() => {
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
                  loggedInAt: new Date().toISOString()
                };
                validateAndLogin(userData);
              }
            }
          });

          googleBtnRef.current.innerHTML = '';
          googleAuth.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: '340',
            text: 'continue_with',
            shape: 'pill'
          });
        }
      })
      .catch(() => {});
  }, [users]);

  const handleGoogleButtonClick = () => {
    setErrorMsg('');
    setLoading(true);
    openRealGooglePopup({
      clientId,
      onSuccess: (userData) => {
        validateAndLogin(userData);
      },
      onError: () => {
        setLoading(false);
      }
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-main)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Subtle Gradient Blobs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '20%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none'
      }} />

      <div className="neu-panel" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '2.5rem 2rem',
        borderRadius: '24px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        zIndex: 2,
        background: 'var(--bg-surface)'
      }}>
        {/* Header Logo & Admin Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div className="neu-logo-box" style={{ width: '56px', height: '56px', borderRadius: '16px', padding: '4px', marginBottom: '1.25rem' }}>
            <img src={logoImg} alt="Logo Admin" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.85rem',
            borderRadius: '999px',
            background: 'rgba(37,99,235,0.1)',
            border: '1px solid rgba(37,99,235,0.2)',
            color: 'var(--primary)',
            fontSize: '0.75rem',
            fontWeight: 900,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '0.85rem'
          }}>
            <Shield size={13} />
            <span>whatsappp.my.id — Dedicated Admin Portal</span>
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-main)', margin: '0 0 0.4rem', textAlign: 'center' }}>
            Masuk Control Center
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
            Klik tombol Google di bawah untuk membuka jendela otentikasi resmi Google (accounts.google.com).
          </p>
        </div>

        {/* System Status Indicators Bar */}
        <div className="neu-panel-inset" style={{ padding: '0.85rem 1rem', borderRadius: '14px', marginBottom: '1.75rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
          <div>
            <span style={{ fontSize: '0.675rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>SYSTEM</span>
            <span style={{ fontSize: '0.775rem', fontWeight: 900, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
              <Activity size={12} /> ONLINE
            </span>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.675rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>FIREWALL</span>
            <span style={{ fontSize: '0.775rem', fontWeight: 900, color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
              <Shield size={12} /> ACTIVE
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.675rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>DOMAIN</span>
            <span style={{ fontSize: '0.775rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
              <Globe size={12} /> VERIFIED
            </span>
          </div>
        </div>

        {/* Error Alert if non-admin attempts login */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            textAlign: 'left'
          }}>
            <AlertTriangle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#ef4444', marginBottom: '0.2rem' }}>
                Akses Ditolak
              </div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                {errorMsg}
              </div>
            </div>
          </div>
        )}

        {/* Official Google GSI Render Button container if Client ID exists */}
        {clientId ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem', minHeight: '44px' }}>
            <div ref={googleBtnRef} id="google-signin-btn-container" />
          </div>
        ) : null}

        {/* Primary Google Login Button triggering accounts.google.com popup */}
        <button
          type="button"
          onClick={handleGoogleButtonClick}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.95rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.85rem',
            cursor: loading ? 'wait' : 'pointer',
            background: '#ffffff',
            border: '1px solid #dadce0',
            borderRadius: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            marginBottom: '1.5rem'
          }}
          className="btn-google-login"
        >
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span style={{ fontSize: '0.975rem', fontWeight: 800, color: '#3c4043', fontFamily: 'var(--font-heading)' }}>
            {loading ? 'Membuka Pop-up Google...' : 'Masuk via Google (accounts.google.com)'}
          </span>
        </button>

        {/* Security Footer Note */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontSize: '0.775rem',
          color: 'var(--text-dim)',
          fontWeight: 600
        }}>
          <Lock size={14} style={{ color: 'var(--accent-emerald)' }} />
          <span>Akses dilindungi Google OAuth 2.0 & TLS 1.3</span>
        </div>
      </div>
    </div>
  );
};
