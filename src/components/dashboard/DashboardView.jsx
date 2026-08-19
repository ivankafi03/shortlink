import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink, 
  BarChart2, 
  Edit3, 
  Shield, 
  ShieldAlert,
  Globe, 
  Smartphone,
  Layers,
  Sliders,
  QrCode,
  Mail,
  User,
  Filter
} from 'lucide-react';
import { Header } from '../layout/Header';
import { QrCodeModal } from '../common/QrCodeModal';

export const DashboardView = ({ 
  links = [], 
  onDeleteLink, 
  onBulkDelete, 
  onEditLink, 
  onOpenCreateModal, 
  onSelectLinkAnalytics,
  currentUser = null
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('all');
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

  // Extract unique creator emails for quick filtering
  const uniqueOwners = useMemo(() => {
    const map = new Map();
    links.forEach(l => {
      const email = (l.createdBy || l.userEmail || 'admin.cuan@gmail.com').toLowerCase().trim();
      const name = l.createdByName || email.split('@')[0];
      if (!map.has(email)) {
        map.set(email, { email, name, count: 0 });
      }
      map.get(email).count++;
    });
    return Array.from(map.values());
  }, [links]);

  const filteredLinks = links.filter(link => {
    const query = searchQuery.toLowerCase().trim();
    const owner = (link.createdBy || link.userEmail || '').toLowerCase().trim();
    const matchesQuery = (
      (link.name || '').toLowerCase().includes(query) ||
      (link.shortCode || '').toLowerCase().includes(query) ||
      (link.targetUrl || '').toLowerCase().includes(query) ||
      (link.domain || '').toLowerCase().includes(query) ||
      owner.includes(query)
    );
    const matchesOwner = ownerFilter === 'all' || owner === ownerFilter.toLowerCase().trim();
    return matchesQuery && matchesOwner;
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input 
              type="text"
              placeholder="Cari nama, alias, URL, atau email pemilik..."
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Owner Filter Dropdown */}
          {uniqueOwners.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={15} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
              <select
                value={ownerFilter}
                onChange={e => setOwnerFilter(e.target.value)}
                className="form-control"
                style={{ fontSize: '0.825rem', padding: '0.55rem 0.75rem', maxWidth: '240px' }}
                title="Filter Tautan berdasarkan Akun Pemilik"
              >
                <option value="all">Semua Pemilik ({links.length})</option>
                {uniqueOwners.map(o => (
                  <option key={o.email} value={o.email}>
                    {o.email} ({o.count})
                  </option>
                ))}
              </select>
            </div>
          )}

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
              width: '52px', 
              height: '52px', 
              borderRadius: '50%', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '1rem', 
              color: 'var(--text-dim)' 
            }}>
              <Layers size={22} />
            </div>
            <h3 style={{ marginBottom: '0.35rem', fontWeight: 800, fontSize: '1.1rem' }}>
              {searchQuery ? 'Tautan Tidak Ditemukan' : 'Belum Ada Tautan'}
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.25rem auto', fontSize: '0.85rem', fontWeight: 600 }}>
              {searchQuery ? 'Tidak ada tautan yang sesuai dengan filter pencarian.' : 'Daftar tautan pendek yang aktif akan tampil di sini.'}
            </p>
            {!searchQuery && (
              <button onClick={onOpenCreateModal} className="btn btn-primary">
                <Plus size={16} />
                <span>Buat Tautan Baru</span>
              </button>
            )}
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
                    <th>PEMILIK (EMAIL)</th>
                    <th>ATURAN FILTER</th>
                    <th>KLIK</th>
                    <th style={{ textAlign: 'right' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map(link => {
                    const fullShortUrl = `https://${link.domain}/${link.shortCode}${link.addMp4Suffix ? '.mp4' : ''}`;
                    const isSelected = selectedIds.includes(link.id);
                    const ownerEmail = link.createdBy || link.userEmail || 'admin.cuan@gmail.com';

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
                            style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          >
                            <span>{link.targetUrl}</span>
                            <ExternalLink size={11} />
                          </a>
                        </td>

                        {/* Owner Email Column */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img 
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(ownerEmail)}`}
                              alt=""
                              style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', flexShrink: 0 }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span 
                                style={{ fontSize: '0.785rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)', maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                title={ownerEmail}
                              >
                                {ownerEmail}
                              </span>
                              {link.createdByName && link.createdByName !== ownerEmail.split('@')[0] && (
                                <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                                  {link.createdByName}
                                </span>
                              )}
                            </div>
                          </div>
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

                      {/* Owner Email Pill */}
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.4rem', background: 'var(--bg-main)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <Mail size={11} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          {link.createdBy || link.userEmail || 'admin.cuan@gmail.com'}
                        </span>
                      </div>
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
                        onClick={() => { setQrModalUrl(fullShortUrl); setQrModalOpen(true); }}
                        className="btn btn-sm"
                        style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem', justifyContent: 'center' }}
                        title="QR Code"
                      >
                        <QrCode size={12} style={{ color: 'var(--primary)' }} />
                        <span>QR</span>
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
