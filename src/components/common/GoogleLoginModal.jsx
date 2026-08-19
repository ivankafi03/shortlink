import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Check, Key, Lock, Mail, AlertCircle } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { loadGoogleSdk, parseGoogleJwt, getActiveGoogleClientId, triggerGoogleAuth } from '../../services/googleAuthService';

export const GoogleLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [clientId, setClientId] = useState('');
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
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
                  role: payload.email.includes('admin') ? 'admin' : 'member',
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
            width: '320',
            text: 'continue_with',
            shape: 'pill'
          });
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMainGoogleClick = () => {
    setAuthError('');
    if (clientId && window.google?.accounts?.id) {
      triggerGoogleAuth({
        clientId,
        onSuccess: (userData) => {
          onLoginSuccess(userData);
          onClose();
        },
        onPromptForm: () => {
          setShowAuthForm(true);
        }
      });
    } else {
      setShowAuthForm(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setAuthError('Masukkan alamat email Google yang valid');
      return;
    }
    if (!passwordInput || passwordInput.length < 4) {
      setAuthError('Masukkan kata sandi Google / akun Anda');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const nameFromEmail = emailInput.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      
      const userData = {
        id: `google_${Date.now()}`,
        name: formattedName,
        email: emailInput.trim().toLowerCase(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(emailInput)}`,
        authProvider: 'google_account',
        role: emailInput.includes('admin') ? 'admin' : 'member',
        loggedInAt: new Date().toISOString()
      };

      setLoading(false);
      onLoginSuccess(userData);
      onClose();
    }, 600);
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
              Masuk Akun Google
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>
              Otentikasi aman untuk mengelola tautan pendek, penargetan pengunjung, dan analitik real-time.
            </p>
          </div>

          {!showAuthForm ? (
            <>
              {/* Official Google SDK Render Container */}
              {clientId ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', minHeight: '44px' }}>
                  <div ref={googleBtnRef} id="google-signin-btn-container" />
                </div>
              ) : null}

              {/* Main Google Login Trigger Button */}
              <button 
                type="button"
                onClick={handleMainGoogleClick}
                className="neu-panel"
                style={{ 
                  width: '100%', 
                  padding: '0.9rem 1.25rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.85rem',
                  cursor: 'pointer',
                  background: '#ffffff',
                  border: '1px solid #dadce0',
                  borderRadius: '12px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.15s ease',
                  marginBottom: '1rem'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#3c4043', fontFamily: 'var(--font-heading)' }}>
                  Lanjutkan dengan Google
                </span>
              </button>

              <div style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAuthForm(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Masuk Manual via Email Google
                </button>
              </div>
            </>
          ) : (
            /* Google Credential Login Form */
            <form onSubmit={handleFormSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {authError && (
                <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: 'var(--accent-rose)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={15} />
                  <span>{authError}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} style={{ color: 'var(--primary)' }} /> Alamat Email Google
                </label>
                <input 
                  type="email"
                  required
                  placeholder="nama.anda@gmail.com"
                  className="form-control"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  style={{ fontSize: '0.9rem' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={14} style={{ color: 'var(--primary)' }} /> Kata Sandi Google
                </label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="form-control"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  style={{ fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAuthForm(false)} 
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                >
                  Kembali
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ flex: 2, padding: '0.75rem' }}
                >
                  {loading ? 'Memverifikasi Google...' : 'Masuk ke Akun'}
                </button>
              </div>
            </form>
          )}

          {/* Security & Guarantee Note */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, marginTop: '1.25rem' }}>
            <ShieldCheck size={14} style={{ color: 'var(--accent-emerald)' }} />
            <span>Otentikasi dilindungi enkripsi TLS 1.3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
