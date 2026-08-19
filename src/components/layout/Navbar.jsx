import React from 'react';
import { 
  Link2, 
  BarChart2, 
  FileText, 
  Globe, 
  Settings, 
  Sun, 
  Moon, 
  Play,
  Plus
} from 'lucide-react';

export const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  theme, 
  setTheme, 
  onOpenCreateModal 
}) => {
  const navItems = [
    { id: 'tautan', label: 'tautan', icon: Link2 },
    { id: 'analitik', label: 'analitik', icon: BarChart2 },
    { id: 'halaman', label: 'halaman', icon: FileText },
    { id: 'domain', label: 'domain', icon: Globe },
    { id: 'pengaturan', label: 'pengaturan', icon: Settings },
  ];

  return (
    <header className="neu-panel" style={{ 
      margin: '1.25rem 1.5rem 2rem 1.5rem', 
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: '1.25rem',
      zIndex: 100
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div className="neu-panel-inset" style={{
          width: '34px',
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '1rem',
          color: 'var(--primary)'
        }}>
          v
        </div>
        <span style={{ 
          fontFamily: 'var(--font-heading)', 
          fontWeight: 700, 
          fontSize: '1.2rem',
          letterSpacing: '-0.03em'
        }}>
          vidy<span style={{ color: 'var(--primary)' }}>.my</span>
        </span>
      </div>

      {/* Main Nav Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`btn btn-ghost ${isActive ? 'active' : ''}`}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>

        {/* Create Link Quick Action */}
        <button 
          onClick={onOpenCreateModal} 
          className="btn btn-primary btn-sm"
        >
          <Plus size={14} />
          <span>buat tautan</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
          className="btn btn-ghost btn-sm"
          style={{ width: '34px', padding: 0 }}
          title="Ganti Tema (Gelap / Terang)"
        >
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        {/* User Account Info */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          paddingLeft: '0.75rem',
          borderLeft: '1px solid var(--border-subtle)'
        }}>
          <div className="neu-panel-inset" style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            IP
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            ivankafipradana@gmail.com
          </span>
        </div>
      </div>
    </header>
  );
};
