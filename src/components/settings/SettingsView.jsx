import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Shield, 
  Zap, 
  Check, 
  Save,
  Key,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Radio,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Header } from '../layout/Header';

export const SettingsView = ({ config, onSaveConfig, onOpenCreateModal }) => {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'ip' | 'asn'

  const [timezone, setTimezone] = useState(config.timezone || 'Asia/Jakarta');
  const [googleCrawlerBlock, setGoogleCrawlerBlock] = useState(!!config.googleCrawlerBlock);
  const [ipBlacklist, setIpBlacklist] = useState(config.ipBlacklist || '');
  const [ipWhitelist, setIpWhitelist] = useState(config.ipWhitelist || '');
  const [asnList, setAsnList] = useState(config.asnList || '');
  const [ispKeywords, setIspKeywords] = useState(config.ispKeywords || '');
  const [googleClientId, setGoogleClientId] = useState(config.googleClientId || '');

  const [isSaved, setIsSaved] = useState(false);
  const [detectingIp, setDetectingIp] = useState(false);
  const [detectedMsg, setDetectedMsg] = useState('');
  const [clearingCooldown, setClearingCooldown] = useState(false);

  // Sync state lokal saat prop config berubah dari luar (mis. reset ke default)
  useEffect(() => {
    setTimezone(config.timezone || 'Asia/Jakarta');
    setGoogleCrawlerBlock(!!config.googleCrawlerBlock);
    setIpBlacklist(config.ipBlacklist || '');
    setIpWhitelist(config.ipWhitelist || '');
    setAsnList(config.asnList || '');
    setIspKeywords(config.ispKeywords || '');
    setGoogleClientId(config.googleClientId || '');
  }, [config]);

  const handleDetectAndWhitelistMyIp = async () => {
    setDetectingIp(true);
    setDetectedMsg('');
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      if (data?.ip) {
        const myIp = data.ip.trim();
        const currentList = ipWhitelist.split('\n').map(s => s.trim()).filter(Boolean);
        if (!currentList.includes(myIp)) {
          const updated = [...currentList, myIp].join('\n');
          setIpWhitelist(updated);
          onSaveConfig({
            ...config,
            ipWhitelist: updated
          });
          setDetectedMsg(`IP Anda (${myIp}) berhasil ditambahkan ke Whitelist.`);
        } else {
          setDetectedMsg(`IP Anda (${myIp}) sudah ada di dalam Whitelist.`);
        }
      }
    } catch {
      setDetectedMsg('Gagal mendeteksi IP otomatis. Silakan masukkan IP secara manual.');
    } finally {
      setDetectingIp(false);
    }
  };

  const handleClearAllCooldowns = async () => {
    setClearingCooldown(true);
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_cooldown' })
      });
      setDetectedMsg('Semua riwayat blokir dan cooldown IP berhasil di-reset.');
    } catch {
      setDetectedMsg('Gagal mereset cooldown server.');
    } finally {
      setClearingCooldown(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      googleClientId: googleClientId.trim(),
      timezone,
      googleCrawlerBlock,
      ipBlacklist,
      ipWhitelist,
      asnList,
      ispKeywords
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div>
      <Header 
        title="Pengaturan Keamanan" 
        subtitle="Konfigurasi filter keamanan global, daftar hitam IP, ASN data center, dan zona waktu"
        onOpenCreateModal={onOpenCreateModal}
      />

      <form onSubmit={handleSave}>
        {/* Google OAuth 2.0 Configuration */}
        <div className="neu-panel" style={{ padding: '1.75rem', maxWidth: '800px', margin: '0 auto 1.75rem auto' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={18} style={{ color: 'var(--primary)' }} /> Konfigurasi Google OAuth 2.0 Client ID
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '1rem' }}>
            Masukkan Google OAuth Client ID dari Google Cloud Console agar tombol Google Sign-In asli aktif sepenuhnya.
          </p>

          <div className="form-group">
            <label className="form-label">Google OAuth Client ID</label>
            <input 
              type="text" 
              placeholder="YOUR_CLIENT_ID.apps.googleusercontent.com" 
              className="form-control"
              value={googleClientId}
              onChange={e => setGoogleClientId(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
            />
            <span className="form-hint">Dapatkan Client ID gratis di Google Cloud Console (APIs & Services -> Credentials -> OAuth 2.0 Client IDs).</span>
          </div>
        </div>

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
              <span>IP Whitelist & Blacklist</span>
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

          <div style={{ marginTop: '1.5rem' }}>
            {/* Status Alert Message */}
            {detectedMsg && (
              <div className="neu-panel-inset" style={{ padding: '0.85rem 1.1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}>
                {detectedMsg}
              </div>
            )}

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

            {/* Tab 2: IP Whitelist & Blacklist */}
            {activeTab === 'ip' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Whitelist Section */}
                <div className="neu-panel-inset" style={{ padding: '1.25rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--accent-emerald)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <ShieldCheck size={16} /> IP Whitelist (Bebas Akses Khusus Admin)
                      </h4>
                      <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, margin: '0.2rem 0 0 0' }}>
                        Alamat IP di daftar ini dikecualikan dari Rate Limiting, Cooldown, dan Filter Bot.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleDetectAndWhitelistMyIp}
                      disabled={detectingIp}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.775rem', padding: '0.45rem 0.85rem' }}
                    >
                      <Zap size={14} />
                      <span>{detectingIp ? 'Mendeteksi...' : 'Deteksi & Whitelist IP Saya'}</span>
                    </button>
                  </div>

                  <textarea 
                    className="form-control"
                    style={{ minHeight: '90px', fontFamily: 'var(--font-mono)', fontSize: '0.825rem' }}
                    placeholder="127.0.0.1&#10;180.252.12.34"
                    value={ipWhitelist}
                    onChange={e => setIpWhitelist(e.target.value)}
                  />
                </div>

                {/* Blacklist Section */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <ShieldAlert size={15} style={{ color: 'var(--accent-rose)' }} /> IP Blacklist (Satu per baris)
                    </label>
                    <button
                      type="button"
                      onClick={handleClearAllCooldowns}
                      disabled={clearingCooldown}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                      title="Reset semua cooldown dan blokir sementara"
                    >
                      <RotateCcw size={13} />
                      <span>{clearingCooldown ? 'Mereset...' : 'Reset Cooldown Server'}</span>
                    </button>
                  </div>
                  <textarea 
                    className="form-control"
                    style={{ minHeight: '100px', fontFamily: 'var(--font-mono)', fontSize: '0.825rem' }}
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
          </div>
        </div>
      </form>
    </div>
  );
};
