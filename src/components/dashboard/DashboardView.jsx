import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink, 
  BarChart2, 
  Edit3, 
  Play, 
  Shield, 
  ShieldAlert,
  Globe, 
  Smartphone,
  Layers,
  Sliders,
  QrCode
} from 'lucide-react';
import { Header } from '../layout/Header';
import { QrCodeModal } from '../common/QrCodeModal';

export const DashboardView = ({ 
  links, 
  onDeleteLink, 
  onBulkDelete, 
  onEditLink, 
  onOpenCreateModal, 
  onSelectLinkAnalytics,
  onTestLinkInSimulator 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrModalUrl, setQrModalUrl] = useState('');

  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const activeLinks = links.filter(link => !link.clickLimit || link.clicks < link.clickLimit).length;
  const totalRules = links.reduce((sum, link) => {
    let count = 0;
    if (link.devices && link.devices.length > 0) count++;
    if (link.countries && link.countries.length > 0) count++;
    if (link.referers && link.referers.length > 0) count++;
    if (link.botPageId) count++;
    if (link.blockProxy) count++;
    return sum + count;
  }, 0);

  const filteredLinks = links.filter(link => {
    const query = searchQuery.toLowerCase();
    return (
      link.name.toLowerCase().includes(query) ||
      link.shortCode.toLowerCase().includes(query) ||
      link.targetUrl.toLowerCase().includes(query) ||
      link.domain.toLowerCase().includes(query)
    );
  });

  const handleCopy = (shortUrl, id) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredLinks.map(l => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div>
      <Header 
        title="Dashboard & Tautan" 
        subtitle="Kelola tautan pendek, penargetan pengunjung, dan filter keamanan"
        onOpenCreateModal={onOpenCreateModal}
        onOpenSimulator={() => onTestLinkInSimulator(links[0] || null)}
      />

      {/* 4 Equal-Aligned Neumorphic Stat Cards Grid */}
      <div className="stats-grid">
        <div className="neu-panel" style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL TAUTAN</span>
            <div className="neu-panel-inset" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', borderRadius: '10px' }}>
              <Layers size={15} />
            </div>
          </div>
          <span className="stat-card-value">{totalLinks}</span>
        </div>

        <div className="neu-panel" style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL KLIK</span>
            <div className="neu-panel-inset" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', borderRadius: '10px' }}>
              <BarChart2 size={15} />
            </div>
          </div>
          <span className="stat-card-value" style={{ color: 'var(--accent-emerald)' }}>{totalClicks}</span>
        </div>

        <div className="neu-panel" style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TAUTAN AKTIF</span>
            <div className="neu-panel-inset" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', borderRadius: '10px' }}>
              <Shield size={15} />
            </div>
          </div>
          <span className="stat-card-value">{activeLinks}</span>
        </div>

        <div className="neu-panel" style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ATURAN AKTIF</span>
            <div className="neu-panel-inset" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-amber)', borderRadius: '10px' }}>
              <Sliders size={15} />
            </div>
          </div>
          <span className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>{totalRules}</span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="neu-panel" style={{ padding: '1.5rem' }}>
        {/* Filter Controls Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input 
              type="text"
              placeholder="Cari berdasarkan nama, short code, atau URL tujuan..."
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {selectedIds.length > 0 && (
            <button 
              onClick={() => {
                onBulkDelete(selectedIds);
                setSelectedIds([]);
              }}
              className="btn btn-danger btn-sm"
            >
              <Trash2 size={14} />
              <span>Hapus Selected ({selectedIds.length})</span>
            </button>
          )}
        </div>

        {/* Links List */}
        {filteredLinks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
            <div className="neu-panel-inset" style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '1rem',
              color: 'var(--primary)'
            }}>
              <Plus size={24} />
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontWeight: 900 }}>buat tautan pendek pertama anda</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem auto', fontSize: '0.875rem', fontWeight: 600 }}>
              Tautan pendek memungkinkan anda mengalihkan pengunjung ke tujuan apa pun dengan kendali penuh atas siapa yang melihat apa.
            </p>
            <button onClick={onOpenCreateModal} className="btn btn-primary">
              buat tautan pertama anda
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="desktop-table-view custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll} 
                        checked={selectedIds.length === filteredLinks.length && filteredLinks.length > 0} 
                      />
                    </th>
                    <th>TAUTAN PENDEK</th>
                    <th>NAMA & TUJUAN</th>
                    <th>ATURAN FILTER</th>
                    <th>KLIK</th>
                    <th style={{ textAlign: 'right' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map(link => {
                    const fullShortUrl = `https://${link.domain}/${link.shortCode}${link.addMp4Suffix ? '.mp4' : ''}`;
                    const isSelected = selectedIds.includes(link.id);

                    return (
                      <tr key={link.id}>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleToggleSelect(link.id)} 
                          />
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontSize: '0.925rem', marginBottom: '0.15rem' }}>
                            {link.shortCode}{link.addMp4Suffix ? '.mp4' : ''}
                          </div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                            {link.domain}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.15rem' }}>
                            {link.name || 'Tanpa Nama'}
                            {link.mode === 'video' && <span className="badge badge-amber" style={{ marginLeft: '0.5rem' }}>Video</span>}
                          </div>
                          <a 
                            href={link.targetUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          >
                            <span>{link.targetUrl}</span>
                            <ExternalLink size={11} />
                          </a>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {link.devices && link.devices.length > 0 && (
                              <span className="badge badge-primary">
                                <Smartphone size={10} />
                                {link.devices.join(', ')}
                              </span>
                            )}
                            {link.countries && link.countries.length > 0 && (
                              <span className="badge badge-success">
                                <Globe size={10} />
                                {link.countries.join(', ')}
                              </span>
                            )}
                            {link.botPageId && (
                              <span className="badge badge-danger">Bot Trap</span>
                            )}
                            {(!link.devices?.length && !link.countries?.length && !link.botPageId) && (
                              <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-dim)' }}>Semua Pengunjung</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                            {link.clicks || 0}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                            <button 
                              onClick={() => handleCopy(fullShortUrl, link.id)}
                              className="btn btn-sm"
                              title="Salin Tautan"
                            >
                              {copiedId === link.id ? <Check size={13} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={13} />}
                            </button>
                            <button 
                              onClick={() => { setQrModalUrl(fullShortUrl); setQrModalOpen(true); }}
                              className="btn btn-sm"
                              title="Generasi & Unduh QR Code"
                            >
                              <QrCode size={13} style={{ color: 'var(--primary)' }} />
                            </button>
                            <button 
                              onClick={() => onTestLinkInSimulator(link)}
                              className="btn btn-sm"
                              title="Test dalam Traffic Router Simulator"
                            >
                              <Play size={13} style={{ color: 'var(--accent-cyan)' }} />
                            </button>
                            <button 
                              onClick={() => onSelectLinkAnalytics(link.id)}
                              className="btn btn-sm"
                              title="Lihat Analitik Detail"
                            >
                              <BarChart2 size={13} />
                            </button>
                            <button 
                              onClick={() => onEditLink(link)}
                              className="btn btn-sm"
                              title="Edit Tautan"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button 
                              onClick={() => onDeleteLink(link.id)}
                              className="btn btn-danger btn-sm"
                              title="Hapus"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile List View (Clean flat rows inside single panel - No Card-in-Card) */}
            <div className="mobile-cards-view">
              <div style={{ padding: '0.5rem 0.25rem 0.75rem 0.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-subtle)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={selectedIds.length === filteredLinks.length && filteredLinks.length > 0} 
                  />
                  <span>Pilih Semua ({filteredLinks.length})</span>
                </label>
                {selectedIds.length > 0 && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {selectedIds.length} Terpilih
                  </span>
                )}
              </div>

              {filteredLinks.map((link, idx) => {
                const fullShortUrl = `https://${link.domain}/${link.shortCode}${link.addMp4Suffix ? '.mp4' : ''}`;
                const isSelected = selectedIds.includes(link.id);

                return (
                  <div 
                    key={link.id} 
                    style={{ 
                      padding: '0.9rem 0.5rem', 
                      borderBottom: idx === filteredLinks.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'var(--primary-light)' : 'transparent',
                      borderRadius: '10px',
                      transition: 'background 0.15s ease',
                      marginBottom: '0.25rem'
                    }}
                  >
                    {/* Top Row: Checkbox + Shortcode + Domain + Clicks Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => handleToggleSelect(link.id)} 
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                        <span style={{ fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontSize: '0.925rem', letterSpacing: '0.02em' }}>
                          /{link.shortCode}{link.addMp4Suffix ? '.mp4' : ''}
                        </span>
                        <span className="neu-panel-inset" style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '6px', color: 'var(--text-muted)' }}>
                          {link.domain}
                        </span>
                      </div>

                      <div className="badge badge-primary" style={{ fontSize: '0.725rem', fontWeight: 900, padding: '0.2rem 0.55rem', borderRadius: '20px' }}>
                        <BarChart2 size={11} />
                        <span>{link.clicks || 0} klik</span>
                      </div>
                    </div>

                    {/* Middle: Name & Target URL */}
                    <div style={{ marginBottom: '0.55rem', paddingLeft: '0.25rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <span>{link.name || 'Tanpa Nama'}</span>
                        {link.mode === 'video' && <span className="badge badge-amber" style={{ fontSize: '0.625rem', padding: '0.1rem 0.35rem' }}>Video</span>}
                      </div>

                      <a 
                        href={link.targetUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', maxWidth: '100%', wordBreak: 'break-all' }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{link.targetUrl}</span>
                        <ExternalLink size={11} style={{ flexShrink: 0, color: 'var(--text-dim)' }} />
                      </a>
                    </div>

                    {/* Filter Rules Row */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.65rem', paddingLeft: '0.25rem' }}>
                      {link.devices && link.devices.length > 0 && (
                        <span className="badge badge-primary" style={{ fontSize: '0.675rem', padding: '0.15rem 0.45rem' }}>
                          <Smartphone size={10} />
                          {link.devices.join(', ')}
                        </span>
                      )}
                      {link.countries && link.countries.length > 0 && (
                        <span className="badge badge-success" style={{ fontSize: '0.675rem', padding: '0.15rem 0.45rem' }}>
                          <Globe size={10} />
                          {link.countries.join(', ')}
                        </span>
                      )}
                      {link.botPageId && (
                        <span className="badge badge-danger" style={{ fontSize: '0.675rem', padding: '0.15rem 0.45rem' }}>
                          <ShieldAlert size={10} /> Bot Trap
                        </span>
                      )}
                      {(!link.devices?.length && !link.countries?.length && !link.botPageId) && (
                        <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-dim)' }}>Semua Pengunjung</span>
                      )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(64px, 1fr))', gap: '0.35rem', paddingLeft: '0.25rem' }}>
                      <button 
                        onClick={() => handleCopy(fullShortUrl, link.id)}
                        className="btn btn-sm"
                        style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem', justifyContent: 'center' }}
                      >
                        {copiedId === link.id ? <Check size={12} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={12} />}
                        <span>Salin</span>
                      </button>

                      <button 
                        onClick={() => onTestLinkInSimulator(link)}
                        className="btn btn-sm"
                        style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem', justifyContent: 'center' }}
                      >
                        <Play size={12} style={{ color: 'var(--accent-cyan)' }} />
                        <span>Test</span>
                      </button>

                      <button 
                        onClick={() => onSelectLinkAnalytics(link.id)}
                        className="btn btn-sm"
                        style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem', justifyContent: 'center' }}
                      >
                        <BarChart2 size={12} />
                        <span>Analitik</span>
                      </button>

                      <button 
                        onClick={() => onEditLink(link)}
                        className="btn btn-sm"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        title="Edit Tautan"
                      >
                        <Edit3 size={12} />
                      </button>

                      <button 
                        onClick={() => onDeleteLink(link.id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        title="Hapus Tautan"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <QrCodeModal 
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        url={qrModalUrl}
      />
    </div>
  );
};
