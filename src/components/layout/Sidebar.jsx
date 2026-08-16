import React, { useState, useEffect } from 'react';
import { 
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
  onGoHome
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

  const navItems = [
    { id: 'tautan', label: 'Tautan & Dashboard', icon: Link2 },
    { id: 'analitik', label: 'Analitik Trafik', icon: BarChart2 },
    { id: 'halaman', label: 'Halaman Landing', icon: FileText },
    { id: 'domain', label: 'Domain Kustom', icon: Globe },
    { id: 'pengaturan', label: 'Pengaturan Keamanan', icon: Shield },
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
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
        >
          <div className="neu-logo-box" style={{ width: '38px', height: '38px', borderRadius: '12px', padding: '2px', flexShrink: 0 }}>
            <img src={logoImg} alt="D shortlink Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-main)' }}>
            D <span style={{ color: 'var(--primary)' }}>shortlink</span>
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

          <div className="neu-panel-inset" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 0.85rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>
              D
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Ivanka Fipradana
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                ivankafipradana@gmail.com
              </div>
            </div>
          </div>

          <button
            onClick={() => { onGoHome(); setMobileDrawerOpen(false); }}
            className="btn btn-ghost"
            style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'flex-start', fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-muted)' }}
          >
            <LogOut size={16} style={{ color: 'var(--text-muted)' }} />
            <span>Keluar</span>
          </button>
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
            title="Halaman Utama"
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
              <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.06em' }}>
                TRAFFIC ROUTER ENGINE
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
                  onClick={() => setActiveTab(item.id)}
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

          <div className="neu-panel-inset" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.65rem',
            padding: '0.75rem 0.85rem'
          }}>
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
              D
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Ivanka Fipradana
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                ivankafipradana@gmail.com
              </div>
            </div>
          </div>

          <button
            onClick={onGoHome}
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
        </div>
      </aside>
    </>
  );
};

