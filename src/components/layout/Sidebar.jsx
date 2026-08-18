import React, { useState, useEffect } from 'react';
import { 
  Users,
  Link2, 
  BarChart2, 
  FileText, 
  Globe, 
  Shield, 
  Play,
  Plus,
  LogOut,
  Menu,
  X,
  Braces
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  onOpenCreateModal,
  onOpenSimulator,
  onGoHome,
  currentUser,
  onOpenGoogleLogin,
  onLogout
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Lock body scroll when drawer is open to prevent background scrolling glitch
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

  const isAdmin = currentUser?.role === 'admin' || 
    (typeof window !== 'undefined' && (window.location.hostname.toLowerCase().includes('whatsappp') || window.location.hostname.toLowerCase().includes('admin')));

  const navItems = [
    { id: 'tautan', label: 'Tautan & Dashboard', icon: Link2 },
    { id: 'analitik', label: 'Analitik Trafik', icon: BarChart2 },
    { id: 'halaman', label: 'Halaman Landing', icon: FileText },
    { id: 'domain', label: 'Domain Kustom', icon: Globe },
    ...(isAdmin ? [
      { id: 'pengguna', label: 'Manajemen Pengguna', icon: Users },
      { id: 'pengaturan', label: 'Pengaturan Keamanan', icon: Shield },
    ] : []),
    { id: 'api_docs', label: 'Developer REST API', icon: Braces },
  ];

  const bottomNavItems = [
    { id: 'tautan', label: 'Tautan', icon: Link2 },
    { id: 'analitik', label: 'Analitik', icon: BarChart2 },
    { id: 'halaman', label: 'Halaman', icon: FileText },
    { id: 'domain', label: 'Domain', icon: Globe },
    { id: 'simulator', label: 'Simulator', icon: Play },
  ];

  const handleTabClick = (tabId) => {
    if (tabId === 'simulator') {
      onOpenSimulator();
    } else {
      setActiveTab(tabId);
    }
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {/* ─── 1. MOBILE TOP BAR (Only visible on small screens <= 900px) ─── */}
      <header className="mobile-top-bar">
        <div 
          onClick={onGoHome}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '1.75rem' }}
        >
          <div className="neu-logo-box" style={{ width: '42px', height: '42px', borderRadius: '12px', padding: '2px', flexShrink: 0 }}>
            <img src={logoImg} alt="D shortlink Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              D <span style={{ color: 'var(--primary)' }}>shortlink</span>
            </div>
            <div style={{ fontSize: '0.675rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Shield size={10} /> {(typeof window !== 'undefined' && (window.location.hostname.toLowerCase().includes('whatsappp') || window.location.hostname.toLowerCase().includes('admin'))) ? 'SUPER ADMIN PORTAL' : 'MEMBER DASHBOARD'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={() => { onOpenCreateModal(); setMobileDrawerOpen(false); }}
            className="btn btn-primary btn-sm"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Plus size={15} />
            <span>Buat</span>
          </button>

          <button 
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="btn btn-ghost btn-sm"
            style={{ width: '38px', height: '38px', padding: 0 }}
            aria-label="Buka Menu"
          >
            {mobileDrawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ─── 2. MOBILE SLIDE-OUT SIDEBAR DRAWER (Slides in from left) ─── */}
      <div 
        className={`mobile-slide-backdrop ${mobileDrawerOpen ? 'open' : ''}`}
        onClick={() => setMobileDrawerOpen(false)}
      />

      <aside className={`mobile-slide-drawer ${mobileDrawerOpen ? 'open' : ''}`}>
        <div>
          {/* Header in Drawer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div 
              onClick={() => { onGoHome(); setMobileDrawerOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
            >
              <div className="neu-logo-box" style={{ width: '38px', height: '38px', borderRadius: '12px', padding: '2px', flexShrink: 0 }}>
                <img src={logoImg} alt="D shortlink Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-main)', lineHeight: 1.1 }}>
                  D <span style={{ color: 'var(--primary)' }}>shortlink</span>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>TRAFFIC ROUTER</span>
              </div>
            </div>

            <button 
              onClick={() => setMobileDrawerOpen(false)}
              className="btn btn-ghost btn-sm"
              style={{ width: '32px', height: '32px', padding: 0 }}
              aria-label="Tutup Menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Create Link Primary Action */}
          <button 
            onClick={() => { onOpenCreateModal(); setMobileDrawerOpen(false); }}
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1.25rem', padding: '0.75rem', fontSize: '0.9rem', fontWeight: 800 }}
          >
            <Plus size={18} />
            <span>Buat Tautan</span>
          </button>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`btn btn-ghost ${isActive ? 'active' : ''}`}
                  style={{
                    justifyContent: 'flex-start',
                    padding: '0.75rem 1rem',
                    fontSize: '0.9rem',
                    width: '100%',
                    fontWeight: isActive ? 800 : 700
                  }}
                >
                  <Icon size={18} style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer Actions & Account */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
          <button 
            onClick={() => { onOpenSimulator(); setMobileDrawerOpen(false); }}
            className="btn btn-sm"
            style={{ width: '100%', marginBottom: '1rem', justifyContent: 'flex-start', fontWeight: 800 }}
          >
            <Play size={15} style={{ color: 'var(--accent-emerald)' }} />
            <span>Test Router Simulator</span>
          </button>

          {currentUser ? (
            <>
              <div className="neu-panel-inset" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 0.85rem' }}>
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>
                    {currentUser.name?.charAt(0) || 'G'}
                  </div>
                )}
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <button
                onClick={() => { onLogout(); setMobileDrawerOpen(false); }}
                className="btn btn-ghost"
                style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'flex-start', fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-muted)' }}
              >
                <LogOut size={16} style={{ color: 'var(--text-muted)' }} />
                <span>Keluar</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => { onOpenGoogleLogin(); setMobileDrawerOpen(false); }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.85rem', fontWeight: 800, justifyContent: 'center', gap: '0.5rem' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              </svg>
              <span>Masuk dengan Google</span>
            </button>
          )}
        </div>
      </aside>

      {/* ─── 3. MOBILE BOTTOM NAVIGATION BAR ─── */}
      <nav className="mobile-bottom-nav">
        {bottomNavItems.map(item => {
          const Icon = item.icon;
          const isActive = item.id === 'simulator' ? false : activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`mobile-bottom-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ─── 4. DESKTOP VERTICAL SIDEBAR (Screens > 900px) ─── */}
      <aside className="sidebar sidebar-desktop">
        {/* Brand Header */}
        <div>
          <div 
            onClick={onGoHome}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.85rem', 
              padding: '0.5rem 0.25rem 1.75rem 0.25rem',
              cursor: 'pointer',
              transition: 'opacity 0.15s'
            }}
            title="Dashboard Admin"
          >
            <div className="neu-logo-box" style={{ width: '54px', height: '54px', borderRadius: '16px', padding: '3px', overflow: 'hidden', flexShrink: 0 }}>
              <img 
                src={logoImg} 
                alt="D shortlink Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '13px' }} 
                loading="eager"
                decoding="sync"
              />
            </div>

            <div>
              <div style={{ 
                fontFamily: 'var(--font-heading)', 
                fontWeight: 900, 
                fontSize: '1.35rem',
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                color: 'var(--text-main)'
              }}>
                D <span style={{ color: 'var(--primary)' }}>shortlink</span>
              </div>
              <span style={{ fontSize: '0.675rem', color: 'var(--primary)', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                <Shield size={10} /> {(typeof window !== 'undefined' && (window.location.hostname.toLowerCase().includes('whatsappp') || window.location.hostname.toLowerCase().includes('admin'))) ? 'SUPER ADMIN PORTAL' : 'MEMBER DASHBOARD'}
              </span>
            </div>
          </div>

          {/* Create Link Primary CTA */}
          <button 
            onClick={onOpenCreateModal}
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1.5rem', padding: '0.8rem', fontSize: '0.925rem', fontWeight: 800 }}
          >
            <Plus size={18} />
            <span>Buat Tautan</span>
          </button>

          {/* Navigation Menu */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`btn btn-ghost ${isActive ? 'active' : ''}`}
                  style={{
                    justifyContent: 'flex-start',
                    padding: '0.75rem 1rem',
                    fontSize: '0.9rem',
                    width: '100%',
                    fontWeight: isActive ? 800 : 700
                  }}
                >
                  <Icon size={17} style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions & Account */}
        <div>
          <button 
            onClick={onOpenSimulator}
            className="btn btn-sm"
            style={{ width: '100%', marginBottom: '1.25rem', justifyContent: 'flex-start', fontWeight: 800 }}
          >
            <Play size={14} style={{ color: 'var(--accent-emerald)' }} />
            <span>Test Router Simulator</span>
          </button>

          {currentUser ? (
            <>
              <div className="neu-panel-inset" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.65rem',
                padding: '0.75rem 0.85rem'
              }}>
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 800
                  }}>
                    {currentUser.name?.charAt(0) || 'G'}
                  </div>
                )}
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="btn btn-ghost"
                style={{ 
                  width: '100%', marginTop: '0.75rem', justifyContent: 'flex-start',
                  fontWeight: 700, fontSize: '0.875rem',
                  color: 'var(--text-muted)'
                }}
              >
                <LogOut size={15} style={{ color: 'var(--text-muted)' }} />
                <span>Keluar</span>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenGoogleLogin}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.85rem', fontWeight: 800, justifyContent: 'center', gap: '0.5rem' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              </svg>
              <span>Masuk dengan Google</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

