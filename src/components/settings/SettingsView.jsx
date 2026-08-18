import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Shield, 
  Zap, 
  Check, 
  Save
} from 'lucide-react';
import { Header } from '../layout/Header';

export const SettingsView = ({ config, onSaveConfig, onOpenCreateModal, onOpenSimulator }) => {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'ip' | 'asn'

  const [timezone, setTimezone] = useState(config.timezone || 'Asia/Jakarta');
  const [googleCrawlerBlock, setGoogleCrawlerBlock] = useState(!!config.googleCrawlerBlock);
  const [ipBlacklist, setIpBlacklist] = useState(config.ipBlacklist || '');
  const [asnList, setAsnList] = useState(config.asnList || '');
  const [ispKeywords, setIspKeywords] = useState(config.ispKeywords || '');

  const [isSaved, setIsSaved] = useState(false);

  // Sync state lokal saat prop config berubah dari luar (mis. reset ke default)
  useEffect(() => {
    setTimezone(config.timezone || 'Asia/Jakarta');
    setGoogleCrawlerBlock(!!config.googleCrawlerBlock);
    setIpBlacklist(config.ipBlacklist || '');
    setAsnList(config.asnList || '');
    setIspKeywords(config.ispKeywords || '');
  }, [config]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedConfig = {
      timezone,
      googleCrawlerBlock,
      ipBlacklist,
      asnList,
      ispKeywords
    };
    onSaveConfig(updatedConfig);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div>
      <Header 
        title="Pengaturan Keamanan" 
        subtitle="Konfigurasi filter keamanan global, daftar hitam IP, ASN data center, dan zona waktu"
        onOpenCreateModal={onOpenCreateModal}
        onOpenSimulator={onOpenSimulator}
      />

      {/* Main Settings Card */}
      <div className="neu-panel" style={{ padding: '1.75rem', maxWidth: '800px', margin: '0 auto' }}>
        {/* Sub Tabs Nav */}
        <div className="tabs-nav" style={{ justifyContent: 'center' }}>
          <button 
            type="button"
            onClick={() => setActiveTab('general')}
            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
          >
            <Clock size={15} />
            <span>General</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('ip')}
            className={`tab-btn ${activeTab === 'ip' ? 'active' : ''}`}
          >
            <Zap size={15} />
            <span>IP Blocking</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('asn')}
            className={`tab-btn ${activeTab === 'asn' ? 'active' : ''}`}
          >
            <Shield size={15} />
            <span>ASN & ISP</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          {/* Tab 1: General */}
          {activeTab === 'general' && (
            <div>
              <div className="form-group">
                <label className="form-label">Zona Waktu (Timezone)</label>
                <select 
                  className="form-control"
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                >
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  <option value="UTC">UTC (Universal Time Coordinated)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
                <span className="form-hint">Semua log analitik akan ditampilkan dalam zona waktu ini.</span>
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
                <input 
                  type="checkbox" 
                  id="googleCrawler" 
                  checked={googleCrawlerBlock} 
                  onChange={e => setGoogleCrawlerBlock(e.target.checked)} 
                />
                <div>
                  <label htmlFor="googleCrawler" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                    Blokir Googlebot & Web Crawler Secara Global
                  </label>
                  <span className="form-hint">Mencegah spider atau bot indeksasi mesin pencari mengakses tautan anda.</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: IP Blocking */}
          {activeTab === 'ip' && (
            <div>
              <div className="form-group">
                <label className="form-label">IP Blacklist (Satu per baris)</label>
                <textarea 
                  className="form-control"
                  style={{ minHeight: '140px' }}
                  placeholder="192.168.1.*&#10;10.0.0.1"
                  value={ipBlacklist}
                  onChange={e => setIpBlacklist(e.target.value)}
                />
                <span className="form-hint">Mendukung notasi wildcard (contoh: 192.168.1.* untuk memblokir seluruh subnet).</span>
              </div>
            </div>
          )}

          {/* Tab 3: ASN & ISP */}
          {activeTab === 'asn' && (
            <div>
              <div className="form-group">
                <label className="form-label">ASN Blocking (Satu per baris)</label>
                <textarea 
                  className="form-control"
                  placeholder="AS15169&#10;AS13335"
                  value={asnList}
                  onChange={e => setAsnList(e.target.value)}
                />
                <span className="form-hint">Nomor ASN Autonomous System (seperti AS Google, Amazon Web Services, dll.).</span>
              </div>

              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-label">ISP Blocking (Kata kunci, satu per baris)</label>
                <textarea 
                  className="form-control"
                  placeholder="meta&#10;facebook&#10;amazon&#10;digitalocean"
                  value={ispKeywords}
                  onChange={e => setIspKeywords(e.target.value)}
                />
                <span className="form-hint">Keyword match — memblokir pengunjung jika nama ISP mengandung kata kunci ini.</span>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2.5rem' }}>
              {isSaved ? <Check size={16} /> : <Save size={16} />}
              <span>{isSaved ? 'Pengaturan Tersimpan!' : 'simpan pengaturan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
