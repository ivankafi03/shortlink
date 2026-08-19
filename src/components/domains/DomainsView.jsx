import React, { useState } from 'react';
import { 
  Globe, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Server, 
  Copy, 
  Check, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { Header } from '../layout/Header';

export const DomainsView = ({ 
  domains, 
  onAddDomain, 
  onDeleteDomain,
  onOpenCreateModal,
  currentRoute,
  onNavigate
}) => {
  const isCreatePage = currentRoute === 'create_domain';

  const [domainName, setDomainName] = useState('');
  const [copiedIp, setCopiedIp] = useState(false);

  const targetIp = '76.76.21.21';

  const handleCopyIp = () => {
    navigator.clipboard.writeText(targetIp);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!domainName.trim()) return;

    const cleanDomain = domainName.trim().toLowerCase().replace(/^https?:\/\//, '');

    const newDomain = {
      id: `domain_${Date.now()}`,
      domain: cleanDomain,
      status: 'active', // 'active' | 'pending'
      ssl: true,
      createdAt: new Date().toISOString()
    };

    onAddDomain(newDomain);
    setDomainName('');
    onNavigate('domain');
  };

  // If route is /domains/create, render full page domain creation form!
  if (isCreatePage) {
    return (
      <div>
        <div style={{ marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', marginBottom: '0.15rem', lineHeight: 1.25 }}>Hubungkan Domain Kustom Baru</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
              Gunakan domain web atau subdomain anda sendiri untuk tautan pendek D shortlink
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          {/* DNS Configuration Guide Panel */}
          <div className="neu-panel" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={18} style={{ color: 'var(--primary)' }} /> Petunjuk Konfigurasi DNS A-Record
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.25rem', lineHeight: '1.6' }}>
              Sebelum menambahkan domain di sini, harap atur A-Record pada penyedia DNS domain anda (Cloudflare, Namecheap, GoDaddy, dll) ke alamat IP server berikut:
            </p>

            <div className="neu-panel-inset" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>TARGET IP ADDRESS (A-RECORD)</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.1rem' }}>
                  {targetIp}
                </div>
              </div>

              <button type="button" onClick={handleCopyIp} className="btn btn-sm">
                {copiedIp ? <Check size={14} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={14} />}
                <span>{copiedIp ? 'Tersalin' : 'Salin IP'}</span>
              </button>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} /> SSL / HTTPS Otomatis diterbitkan gratis dalam 1-5 menit setelah DNS terdeteksi.
            </div>
          </div>

          {/* Domain Input Form Card */}
          <form onSubmit={handleAdd} className="neu-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '1.25rem' }}>Masukkan Nama Domain</h3>

            <div className="form-group">
              <label className="form-label">Nama Domain / Subdomain *</label>
              <input 
                type="text" 
                required 
                placeholder="link.domainku.com atau s.brandku.id" 
                className="form-control" 
                value={domainName}
                onChange={e => setDomainName(e.target.value)}
              />
              <span className="form-hint">Masukkan nama domain tanpa http:// atau https://</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button type="button" onClick={() => onNavigate('domain')} className="btn btn-ghost">
                Batal
              </button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                <Check size={16} />
                <span>Simpan & Hubungkan Domain</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Main Domains List View (/domains)
  return (
    <div>
      <Header 
        title="Domain Kustom" 
        subtitle="Kelola domain kustom untuk memperkuat branding tautan pendek anda"
        onOpenCreateModal={onOpenCreateModal}
      />

      {/* Main Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900 }}>Daftar Domain ({domains.length})</h2>
        </div>
        <button onClick={() => onNavigate('create_domain')} className="btn btn-primary">
          <Plus size={16} />
          <span>+ Hubungkan Domain Baru</span>
        </button>
      </div>

      {/* DNS Summary Card */}
      <div className="neu-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={18} style={{ color: 'var(--primary)' }} /> Server IP Target A-Record
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
              Arahkan DNS A-Record domain kustom anda ke IP server cloud berikut:
            </p>
          </div>

          <div className="neu-panel-inset" style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
              {targetIp}
            </span>
            <button onClick={handleCopyIp} className="btn btn-sm">
              {copiedIp ? <Check size={13} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={13} />}
              <span>{copiedIp ? 'Tersalin' : 'Salin IP'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Domains Grid */}
      {domains.length === 0 ? (
        <div className="neu-panel" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <div className="neu-panel-inset" style={{ width: '52px', height: '52px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--text-dim)' }}>
            <Globe size={22} />
          </div>
          <h3 style={{ marginBottom: '0.35rem', fontWeight: 800, fontSize: '1.1rem' }}>Belum Ada Domain Kustom</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.25rem auto', fontSize: '0.85rem', fontWeight: 600 }}>
            Hubungkan domain Anda sendiri untuk menggunakan nama domain kustom pada shortlink.
          </p>
          <button onClick={() => onNavigate('create_domain')} className="btn btn-primary">
            <Plus size={16} />
            <span>+ Hubungkan Domain Baru</span>
          </button>
        </div>
      ) : (
        <div className="responsive-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {domains.map((dom, idx) => {
          const domainId = dom.id || dom.domainName || dom.domain || dom;
          const displayName = dom.domainName || dom.domain || dom;
          return (
            <div key={domainId || idx} className="neu-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="neu-panel-inset" style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <Globe size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.1rem' }}>
                        {displayName}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                          <CheckCircle2 size={10} /> Terverifikasi & Aktif
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  SSL / HTTPS: <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>Aktif (Let's Encrypt)</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button 
                  onClick={() => onDeleteDomain(domainId)}
                  className="btn btn-danger btn-sm"
                  title="Hapus Domain"
                >
                  <Trash2 size={14} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
