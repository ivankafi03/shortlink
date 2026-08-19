import React, { useState, useEffect } from 'react';
import { 
  Users,
  Link2, 
  BarChart2, 
  FileText, 
  Globe, 
  Shield, 
  Plus,
  LogOut,
  Menu,
  X,
  Braces
} from 'lucide-react';
import { LiveStatusBadge } from '../common/LiveStatusBadge';
import { BrandLogo } from '../common/BrandLogo';

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  onOpenCreateModal,
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
    (typeof window !== 'undefined' && (window.location.hostname.toLowerCase().includes('whatsappp') || window.location.hostname.toLowerCase().includes('admin'))) ||
    currentUser?.email?.toLowerCase() === 'ivankafipradana@gmail.com';

  const navItems = [
    { id: 'tautan', label: 'Tautan & Dashboard', icon: Link2 },
    { id: 'analitik', label: 'Analitik Trafik', icon: BarChart2 },
    ...(isAdmin ? [
      { id: 'halaman', label: 'Halaman Landing', icon: FileText },
      { id: 'domain', label: 'Domain Kustom', icon: Globe },
      { id: 'pengguna', label: 'Data Member', icon: Users },
      { id: 'pengaturan', label: 'Pengaturan Keamanan', icon: Shield },
    ] : []),
    { id: 'api_docs', label: 'Developer REST API', icon: Braces },
  ];

  const bottomNavItems = [
    { id: 'tautan', label: 'Tautan', icon: Link2 },
    { id: 'analitik', label: 'Analitik', icon: BarChart2 },
    ...(isAdmin ? [
      { id: 'halaman', label: 'Halaman', icon: FileText },
      { id: 'domain', label: 'Domain', icon: Globe },
    ] : [
      { id: 'api_docs', label: 'API', icon: Braces },
    ]),
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {/* ─── 1. MOBILE TOP BAR (Only visible on small screens <= 900px) ─── */}
      <header className="mobile-top-bar">
        <div 
          onClick={onGoHome}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <BrandLogo size={32} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <BrandLogo size={32} />
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
              onClick={() => { setActiveTab('login'); setMobileDrawerOpen(false); }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.85rem', fontWeight: 800, justifyContent: 'center', gap: '0.5rem' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
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
          const isActive = activeTab === item.id;
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
              display: 'flex', alignItems: 'center', 
              padding: '0.5rem 0.25rem 1.5rem 0.25rem',
              cursor: 'pointer',
              transition: 'opacity 0.15s'
            }}
            title="Dashboard"
          >
            <BrandLogo size={36} />
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {currentUser.name}
                    </div>
                    <LiveStatusBadge size="small" />
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
              onClick={() => setActiveTab('login')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.85rem', fontWeight: 800, justifyContent: 'center', gap: '0.5rem' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Masuk dengan Google</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

