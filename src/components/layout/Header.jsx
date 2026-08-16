import React from 'react';
import { Search, Plus, Play } from 'lucide-react';

export const Header = ({ title, subtitle, onOpenCreateModal, onOpenSimulator }) => {
  return (
    <header className="page-header" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '0.85rem'
    }}>
      <div style={{ flex: '1 1 220px' }}>
        <h1 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)', marginBottom: '0.15rem', lineHeight: 1.25 }}>{title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{subtitle}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {onOpenSimulator && (
          <button onClick={onOpenSimulator} className="btn btn-sm" style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}>
            <Play size={14} style={{ color: 'var(--accent-emerald)' }} />
            <span>Test Router</span>
          </button>
        )}
        {onOpenCreateModal && (
          <button onClick={onOpenCreateModal} className="btn btn-primary btn-sm" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
            <Plus size={14} />
            <span>Buat Tautan</span>
          </button>
        )}
      </div>
    </header>
  );
};
