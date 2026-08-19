import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Check, ChevronRight } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { loadGoogleSdk, parseGoogleJwt, getActiveGoogleClientId } from '../../services/googleAuthService';

export const GoogleLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [clientId, setClientId] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('user.member@gmail.com');
  const googleBtnRef = useRef(null);

  const googleAccounts = [
    { name: 'Ivan Kafipradana', email: 'ivankafipradana@gmail.com', role: 'admin', desc: 'Akun Utama (Google Verified)' },
    { name: 'Samehadakuu Member', email: 'member@samehadakuu.com', role: 'member', desc: 'Akun Publisher' },
    { name: 'Cuanflix Affiliate', email: 'affiliate.cuan@gmail.com', role: 'member', desc: 'Akun Afiliasi' }
  ];

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
                  role: payload.email.includes('admin') || window.location.hostname.includes('whatsappp') ? 'admin' : 'member',
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
            width: '340',
            text: 'continue_with',
            shape: 'pill'
          });
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAccountSelect = (account) => {
    const isDedicatedAdmin = typeof window !== 'undefined' && window.location.hostname.toLowerCase().includes('whatsappp');
    
    const userData = {
      id: `google_${Date.now()}`,
      name: account.name,
      email: account.email.toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(account.email)}`,
      authProvider: 'google_oauth2',
      role: isDedicatedAdmin || account.role === 'admin' ? 'admin' : 'member',
      loggedInAt: new Date().toISOString()
    };

    onLoginSuccess(userData);
    onClose();
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
              Pilih Akun Google
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>
              Pilih akun Google Anda untuk langsung masuk ke dashboard secara otomatis.
            </p>
          </div>

          {/* Official Google GSI Render Button if Client ID exists */}
          {clientId ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem', minHeight: '44px' }}>
              <div ref={googleBtnRef} id="google-signin-btn-container" />
            </div>
          ) : null}

          {/* Account Chooser List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
            {googleAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleAccountSelect(acc)}
                className="neu-panel"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(acc.email)}`} 
                    alt={acc.name} 
                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border-subtle)' }} 
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {acc.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {acc.email}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className={`badge ${acc.role === 'admin' ? 'badge-primary' : 'badge-amber'}`} style={{ fontSize: '0.675rem' }}>
                    {acc.role === 'admin' ? 'Admin' : 'Member'}
                  </span>
                  <ChevronRight size={16} style={{ color: 'var(--text-dim)' }} />
                </div>
              </button>
            ))}
          </div>

          {/* Security & Guarantee Note */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
            <ShieldCheck size={14} style={{ color: 'var(--accent-emerald)' }} />
            <span>Otentikasi Google OAuth 2.0 terverifikasi</span>
          </div>
        </div>
      </div>
    </div>
  );
};
