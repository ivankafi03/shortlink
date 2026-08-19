import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { loadGoogleSdk, parseGoogleJwt, getActiveGoogleClientId, openRealGooglePopup } from '../../services/googleAuthService';

export const AdminAuthPortal = ({ onLoginSuccess, users = [] }) => {
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [sdkRendered, setSdkRendered] = useState(false);
  const googleBtnRef = useRef(null);

  const validateAndLogin = (userData) => {
    const userEmail = (userData.email || '').toLowerCase().trim();
    const isRegisteredAdmin = users.some(
      u => u.email.toLowerCase() === userEmail && u.role === 'admin' && u.status === 'active'
    );
    const isKnownAdmin = 
      isRegisteredAdmin || 
      userEmail === 'ivankafipradana@gmail.com' || 
      userEmail === 'jokosusilo011203@gmail.com' || 
      userEmail === 'admin.cuan@gmail.com' || 
      userEmail.startsWith('admin');

    if (!isKnownAdmin) {
      setErrorMsg(`Akses Ditolak: Akun "${userData.email}" bukan Administrator. Hanya akun Admin yang diizinkan masuk.`);
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
            width: 320,
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left'
          });
          setSdkRendered(true);
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
      padding: '1.5rem'
    }}>
      <div className="neu-panel" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '2.5rem 2rem',
        borderRadius: '20px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-md)',
        background: 'var(--bg-surface)',
        textAlign: 'center'
      }}>
        {/* Header Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.75rem' }}>
          <div className="neu-logo-box" style={{ width: '52px', height: '52px', borderRadius: '14px', padding: '4px', marginBottom: '1rem' }}>
            <img src={logoImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
          </div>

          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-main)', margin: '0 0 0.4rem' }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            Masuk dengan akun Google Administrator
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '10px',
            padding: '0.75rem 0.9rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            textAlign: 'left'
          }}>
            <AlertTriangle size={16} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.775rem', color: '#ef4444', fontWeight: 600, lineHeight: 1.4 }}>
              {errorMsg}
            </div>
          </div>
        )}

        {/* Single Clean Google Login Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', width: '100%' }}>
          <div 
            ref={googleBtnRef} 
            id="google-signin-btn-container" 
            style={{ display: sdkRendered ? 'flex' : 'none', justifyContent: 'center', width: '100%' }}
          />

          {!sdkRendered && (
            <button
              type="button"
              onClick={handleGoogleButtonClick}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                cursor: loading ? 'wait' : 'pointer',
                background: '#ffffff',
                border: '1px solid #dadce0',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3c4043', fontFamily: 'Roboto, sans-serif' }}>
                {loading ? 'Membuka Google...' : 'Sign in with Google'}
              </span>
            </button>
          )}
        </div>

        {/* Minimal Subtle Domain Tag */}
        <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          <Shield size={12} style={{ color: 'var(--primary)' }} />
          <span>whatsappp.my.id</span>
        </div>
      </div>
    </div>
  );
};
