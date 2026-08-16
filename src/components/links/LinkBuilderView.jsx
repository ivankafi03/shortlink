import React, { useState, useEffect, useRef } from 'react';
import { 
  Info, 
  ListFilter, 
  Shield, 
  Crosshair, 
  Sliders, 
  Video, 
  Link as LinkIcon, 
  RefreshCw,
  Plus,
  Check,
  Globe,
  FileText,
  Layout,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Copy
} from 'lucide-react';
import { AVAILABLE_DOMAINS } from '../../services/storageService';

export const LinkBuilderView = ({ 
  linkToEdit, 
  pages, 
  domains = [],
  onSaveLink, 
  onCancel,
  onOpenSimulator,
  onNavigate
}) => {
  const domainOptions = (domains && domains.length > 0)
    ? domains.map(d => d.domainName || d.domain || d)
    : AVAILABLE_DOMAINS;

  const [mode, setMode] = useState('redirect'); // 'redirect' | 'video'
  const [activeTab, setActiveTab] = useState('dasar'); // 'dasar' | 'Fallback' | 'Bot' | 'penargetan' | 'opsi'

  // File input refs for uploading OG images
  const fallbackFileRef = useRef(null);
  const botFileRef = useRef(null);

  // Tab 1: dasar (Redirect mode)
  const [isBulk, setIsBulk] = useState(false);
  const [bulkUrls, setBulkUrls] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [addMp4Suffix, setAddMp4Suffix] = useState(false);
  const [domain, setDomain] = useState(domainOptions[0] || AVAILABLE_DOMAINS[0]);
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');

  // Tab 1: dasar (Video mode)
  const [videoUrl, setVideoUrl] = useState('');
  const [directLink, setDirectLink] = useState('');
  const [videoMode, setVideoMode] = useState('overlay'); // 'overlay' | 'redirect'

  // Tab 2: Fallback
  const [fallbackType, setFallbackType] = useState('url'); // 'url' | 'page' | 'og'
  const [fallbackUrl, setFallbackUrl] = useState('');
  const [fallbackPageId, setFallbackPageId] = useState('');
  const [fallbackOgTitle, setFallbackOgTitle] = useState('');
  const [fallbackOgDesc, setFallbackOgDesc] = useState('');
  const [fallbackOgImage, setFallbackOgImage] = useState('');

  // Tab 3: Bot
  const [botSameAsFallback, setBotSameAsFallback] = useState(true); // Default checked like vidy.my
  const [botType, setBotType] = useState('url'); // 'url' | 'page' | 'og'
  const [botUrl, setBotUrl] = useState('');
  const [botPageId, setBotPageId] = useState('');
  const [botOgTitle, setBotOgTitle] = useState('');
  const [botOgDesc, setBotOgDesc] = useState('');
  const [botOgImage, setBotOgImage] = useState('');

  // Tab 4: penargetan
  const [devices, setDevices] = useState([]); // ['desktop', 'seluler', 'tablet']
  const [countryText, setCountryText] = useState('');
  const [countryRule, setCountryRule] = useState('allow');
  const [refererText, setRefererText] = useState('');
  const [refererRule, setRefererRule] = useState('allow');
  const [paramText, setParamText] = useState('');

  // Tab 5: opsi (Options) — Default UNCHECKED (false) to match vidy.my 100%
  const [redirectMode, setRedirectMode] = useState('auto'); // 'auto' (Langsung) | 'click' (Landing Page)
  const [redirectDelay, setRedirectDelay] = useState(2); // 1-30s
  const [enableBotBlocker, setEnableBotBlocker] = useState(false);
  const [blockProxy, setBlockProxy] = useState(false);
  const [forwardUtm, setForwardUtm] = useState(false);
  const [clickLimitPerIp, setClickLimitPerIp] = useState('');
  const [resetLimitHours, setResetLimitHours] = useState('');

  // Populate data when editing
  useEffect(() => {
    if (linkToEdit) {
      setMode(linkToEdit.mode || 'redirect');
      setTargetUrl(linkToEdit.targetUrl || '');
      setShortCode(linkToEdit.shortCode || '');
      setAddMp4Suffix(!!linkToEdit.addMp4Suffix);
      setDomain(linkToEdit.domain || AVAILABLE_DOMAINS[0]);
      setName(linkToEdit.name || '');
      setTags((linkToEdit.tags || []).join(', '));

      // Video mode fields
      setVideoUrl(linkToEdit.videoUrl || '');
      setDirectLink(linkToEdit.directLink || '');
      setVideoMode(linkToEdit.videoMode || 'overlay');

      setFallbackType(linkToEdit.fallbackType || (linkToEdit.fallbackPageId ? 'page' : 'url'));
      setFallbackUrl(linkToEdit.fallbackUrl || '');
      setFallbackPageId(linkToEdit.fallbackPageId || '');
      setFallbackOgTitle(linkToEdit.fallbackOgTitle || '');
      setFallbackOgDesc(linkToEdit.fallbackOgDesc || '');
      setFallbackOgImage(linkToEdit.fallbackOgImage || '');

      setBotSameAsFallback(linkToEdit.botSameAsFallback !== undefined ? linkToEdit.botSameAsFallback : true);
      setBotType(linkToEdit.botType || (linkToEdit.botPageId ? 'page' : 'url'));
      setBotUrl(linkToEdit.botUrl || '');
      setBotPageId(linkToEdit.botPageId || '');
      setBotOgTitle(linkToEdit.botOgTitle || '');
      setBotOgDesc(linkToEdit.botOgDesc || '');
      setBotOgImage(linkToEdit.botOgImage || '');

      setDevices(linkToEdit.devices || []);
      setCountryText((linkToEdit.countries || []).join('\n'));
      setCountryRule(linkToEdit.countryRule || 'allow');
      setRefererText((linkToEdit.referers || []).join('\n'));
      setRefererRule(linkToEdit.refererRule || 'allow');
      setParamText((linkToEdit.params || []).join('\n'));

      setEnableBotBlocker(!!linkToEdit.enableBotBlocker);
      setBlockProxy(!!linkToEdit.blockProxy);
      setForwardUtm(!!linkToEdit.forwardUtm);
      setClickLimitPerIp(linkToEdit.clickLimitPerIp || '');
      setResetLimitHours(linkToEdit.resetLimitHours || '');
    } else {
      generateRandomShortCode();
      setEnableBotBlocker(false);
      setBlockProxy(false);
      setForwardUtm(false);
    }
  }, [linkToEdit]);

  const generateRandomShortCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setShortCode(result);
  };

  const handleDeviceToggle = (dev) => {
    if (devices.includes(dev)) {
      setDevices(devices.filter(d => d !== dev));
    } else {
      setDevices([...devices, dev]);
    }
  };

  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const countries = countryText.split('\n').map(c => c.trim().toUpperCase()).filter(Boolean);
    const referers = refererText.split('\n').map(r => r.trim()).filter(Boolean);
    const params = paramText.split('\n').map(p => p.trim()).filter(Boolean);

    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

    const linkData = {
      id: linkToEdit ? linkToEdit.id : `link_${Date.now()}`,
      shortCode,
      domain,
      targetUrl: mode === 'video' ? videoUrl : targetUrl,
      name: name || 'Tautan Baru',
      tags: tagsArray,
      mode,
      addMp4Suffix,

      // Video mode fields
      videoUrl,
      directLink,
      videoMode,

      fallbackType,
      fallbackUrl,
      fallbackPageId,
      fallbackOgTitle,
      fallbackOgDesc,
      fallbackOgImage,

      botSameAsFallback,
      botType: botSameAsFallback ? fallbackType : botType,
      botUrl: botSameAsFallback ? fallbackUrl : botUrl,
      botPageId: botSameAsFallback ? fallbackPageId : botPageId,
      botOgTitle: botSameAsFallback ? fallbackOgTitle : botOgTitle,
      botOgDesc: botSameAsFallback ? fallbackOgDesc : botOgDesc,
      botOgImage: botSameAsFallback ? fallbackOgImage : botOgImage,

      devices,
      countries,
      countryRule,
      referers,
      refererRule,
      params,

      enableBotBlocker,
      blockProxy,
      forwardUtm,
      redirectMode,
      redirectDelay,
      clickLimitPerIp: clickLimitPerIp ? Number(clickLimitPerIp) : 0,
      resetLimitHours: resetLimitHours ? Number(resetLimitHours) : 0,

      clicks: linkToEdit ? linkToEdit.clicks : 0,
      createdAt: linkToEdit ? linkToEdit.createdAt : new Date().toISOString()
    };

    onSaveLink(linkData);
  };

  return (
    <div>
      {/* Header Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.15rem' }}>
          {linkToEdit ? 'Edit Tautan' : 'buat tautan'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
          Atur URL tujuan, alias pendek, penargetan pengunjung, dan fitur keamanan
        </p>
      </div>

      {/* Hidden File Inputs for Image Upload */}
      <input 
        type="file" 
        ref={fallbackFileRef} 
        accept="image/*" 
        style={{ display: 'none' }} 
        onChange={e => handleImageUpload(e, setFallbackOgImage)} 
      />
      <input 
        type="file" 
        ref={botFileRef} 
        accept="image/*" 
        style={{ display: 'none' }} 
        onChange={e => handleImageUpload(e, setBotOgImage)} 
      />

      {/* Main Form Container */}
      <div className="neu-panel" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        {/* Mode Selector */}
        <div className="neu-panel-inset" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', padding: '0.4rem' }}>
          <button 
            type="button"
            onClick={() => setMode('redirect')} 
            className={`btn ${mode === 'redirect' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, padding: '0.75rem' }}
          >
            <LinkIcon size={16} />
            <span>Redirect</span>
          </button>
          <button 
            type="button"
            onClick={() => setMode('video')} 
            className={`btn ${mode === 'video' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, padding: '0.75rem' }}
          >
            <Video size={16} />
            <span>Video</span>
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="tabs-nav" style={{ marginBottom: '1.75rem' }}>
          <button 
            type="button"
            onClick={() => setActiveTab('dasar')}
            className={`tab-btn ${activeTab === 'dasar' ? 'active' : ''}`}
          >
            <Info size={15} />
            <span>dasar</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('Fallback')}
            className={`tab-btn ${activeTab === 'Fallback' ? 'active' : ''}`}
          >
            <ListFilter size={15} />
            <span>Fallback</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('Bot')}
            className={`tab-btn ${activeTab === 'Bot' ? 'active' : ''}`}
          >
            <Shield size={15} />
            <span>Bot</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('penargetan')}
            className={`tab-btn ${activeTab === 'penargetan' ? 'active' : ''}`}
          >
            <Crosshair size={15} />
            <span>penargetan</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('opsi')}
            className={`tab-btn ${activeTab === 'opsi' ? 'active' : ''}`}
          >
            <Sliders size={15} />
            <span>opsi</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tab 1: dasar */}
          {activeTab === 'dasar' && (
            <div>
              {/* ── VIDEO MODE ── */}
              {mode === 'video' ? (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.15rem', color: 'var(--text-primary)' }}>dasar</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    URL tujuan dan kode pendek — yang penting.
                  </p>

                  {/* Bulk toggle */}
                  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="checkbox" 
                      id="bulkCreateVideo" 
                      checked={isBulk} 
                      onChange={e => setIsBulk(e.target.checked)} 
                    />
                    <label htmlFor="bulkCreateVideo" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                      Bulk (max 20)
                    </label>
                  </div>

                  {/* Video URL */}
                  <div className="form-group">
                    <label className="form-label">Video URL *</label>
                    {isBulk ? (
                      <textarea 
                        className="form-control" 
                        placeholder="https://example.com/video.mp4"
                        rows={5}
                        value={videoUrl}
                        onChange={e => setVideoUrl(e.target.value)}
                      />
                    ) : (
                      <input 
                        type="url"
                        required
                        placeholder="https://example.com/video.mp4" 
                        className="form-control" 
                        value={videoUrl}
                        onChange={e => setVideoUrl(e.target.value)}
                      />
                    )}
                    <span className="form-hint">Paste an mp4 or m3u8 link. Visitors get a fullscreen player on a dark page.</span>
                  </div>

                  {/* Direct Link */}
                  <div className="form-group">
                    <label className="form-label">Direct Link</label>
                    <input 
                      type="url" 
                      placeholder="https://..." 
                      className="form-control" 
                      value={directLink}
                      onChange={e => setDirectLink(e.target.value)}
                    />
                    <span className="form-hint">Terbuka saat pengunjung mengklik video. Maks 4 kali per jam.</span>
                  </div>

                  {/* Mode Selector */}
                  <div className="form-group">
                    <label className="form-label">Mode</label>
                    <div className="neu-panel-inset" style={{ display: 'flex', gap: '0.4rem', padding: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => setVideoMode('overlay')}
                        className={`btn ${videoMode === 'overlay' ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                      >
                        Overlay (1x/jam)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoMode('redirect')}
                        className={`btn ${videoMode === 'redirect' ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                      >
                        Redirect
                      </button>
                    </div>
                    <span className="form-hint">
                      {videoMode === 'overlay'
                        ? 'Overlay: popup tab baru, muncul lagi setelah jeda.'
                        : 'Redirect: buka video di tab baru + redirect halaman ini ke Direct Link.'}
                    </span>
                  </div>

                  {/* Short code & domain row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>kode pendek *</span>
                        <button 
                          type="button" 
                          onClick={generateRandomShortCode} 
                          className="btn btn-ghost btn-sm" 
                          style={{ padding: '0.1rem 0.4rem', fontSize: '0.75rem' }}
                        >
                          <RefreshCw size={11} /> Auto
                        </button>
                      </label>
                      <input 
                        type="text" 
                        required 
                        placeholder="eXlBma" 
                        className="form-control" 
                        value={shortCode}
                        onChange={e => setShortCode(e.target.value)}
                        disabled={!!linkToEdit}
                      />
                      <span className="form-hint">2-50 huruf dan angka.</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">domain</label>
                      <select 
                        className="form-control"
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                      >
                        {domainOptions.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* .mp4 suffix checkbox */}
                  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0' }}>
                    <input 
                      type="checkbox" 
                      id="mp4SuffixVideo" 
                      checked={addMp4Suffix} 
                      onChange={e => setAddMp4Suffix(e.target.checked)} 
                    />
                    <label htmlFor="mp4SuffixVideo" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                      Tambah akhiran .mp4
                    </label>
                  </div>

                  {/* Name */}
                  <div className="form-group">
                    <label className="form-label">nama</label>
                    <input 
                      type="text" 
                      placeholder="kampanye saya" 
                      className="form-control" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                    <span className="form-hint">Buat kamu sendiri — tidak ditampilkan ke pengunjung.</span>
                  </div>

                  {/* Tags */}
                  <div className="form-group">
                    <label className="form-label">tag <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>(opsional)</span></label>
                    <input 
                      type="text" 
                      placeholder="marketing, facebook, q4" 
                      className="form-control" 
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                /* ── REDIRECT MODE ── */
                <div>
                  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="checkbox" 
                      id="bulkCreate" 
                      checked={isBulk} 
                      onChange={e => setIsBulk(e.target.checked)} 
                    />
                    <label htmlFor="bulkCreate" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                      Bulk create (paste multiple URLs)
                    </label>
                  </div>

                  {isBulk ? (
                    <div className="form-group">
                      <label className="form-label">Daftar URL Tujuan (Satu per baris)</label>
                      <textarea 
                        className="form-control" 
                        placeholder="https://example.com/link1&#10;https://example.com/link2"
                        value={bulkUrls}
                        onChange={e => setBulkUrls(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="form-group">
                      <label className="form-label">URL tujuan *</label>
                      <input 
                        type="url" 
                        required 
                        placeholder="https://example.com" 
                        className="form-control" 
                        value={targetUrl}
                        onChange={e => setTargetUrl(e.target.value)}
                      />
                      <span className="form-hint">Pengunjung yang lolos aturan akan sampai di sini.</span>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>kode pendek *</span>
                        <button 
                          type="button" 
                          onClick={generateRandomShortCode} 
                          className="btn btn-ghost btn-sm" 
                          style={{ padding: '0.1rem 0.4rem', fontSize: '0.75rem' }}
                        >
                          <RefreshCw size={11} /> Auto
                        </button>
                      </label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e17QVX" 
                        className="form-control" 
                        value={shortCode}
                        onChange={e => setShortCode(e.target.value)}
                        disabled={!!linkToEdit}
                      />
                      <span className="form-hint">2-50 huruf dan angka.</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Domain Shortlink</label>
                      <select 
                        className="form-control"
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                      >
                        {domainOptions.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0 1rem 0' }}>
                    <input 
                      type="checkbox" 
                      id="mp4Suffix" 
                      checked={addMp4Suffix} 
                      onChange={e => setAddMp4Suffix(e.target.checked)} 
                    />
                    <label htmlFor="mp4Suffix" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                      Tambah akhiran .mp4
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label">nama kampanye</label>
                    <input 
                      type="text" 
                      placeholder="kampanye saya" 
                      className="form-control" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">tag <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>(opsional)</span></label>
                    <input 
                      type="text" 
                      placeholder="marketing, facebook, q4" 
                      className="form-control" 
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Fallback */}
          {activeTab === 'Fallback' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem' }}>fallback — pengunjung tidak lolos</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                Pengunjung yang tidak cocok dengan aturan akan berakhir di sini.
              </p>

              {/* 3 Action Options: kirim ke URL | tampilkan halaman | tampilkan OG preview */}
              <div className="neu-panel-inset" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.35rem' }}>
                <button 
                  type="button" 
                  onClick={() => setFallbackType('url')}
                  className={`btn ${fallbackType === 'url' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                >
                  <ExternalLink size={14} />
                  <span>kirim ke URL</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setFallbackType('page')}
                  className={`btn ${fallbackType === 'page' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                >
                  <FileText size={14} />
                  <span>tampilkan halaman</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setFallbackType('og')}
                  className={`btn ${fallbackType === 'og' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                >
                  <Layout size={14} />
                  <span>tampilkan OG preview</span>
                </button>
              </div>

              {/* Option 1: kirim ke URL */}
              {fallbackType === 'url' && (
                <div className="form-group">
                  <label className="form-label">URL tujuan fallback *</label>
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    className="form-control" 
                    value={fallbackUrl}
                    onChange={e => setFallbackUrl(e.target.value)}
                  />
                  <span className="form-hint">Pengunjung tidak lolos dikirim ke URL ini.</span>
                </div>
              )}

              {/* Option 2: tampilkan halaman */}
              {fallbackType === 'page' && (
                <div className="form-group">
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Pilih Halaman Landing</span>
                    {onNavigate && (
                      <button 
                        type="button" 
                        onClick={() => onNavigate('create_page')} 
                        className="btn btn-ghost btn-sm" 
                        style={{ padding: '0.1rem 0.4rem', fontSize: '0.75rem', color: 'var(--primary)' }}
                      >
                        + buat halaman landing baru
                      </button>
                    )}
                  </div>
                  <select 
                    className="form-control"
                    value={fallbackPageId}
                    onChange={e => setFallbackPageId(e.target.value)}
                  >
                    <option value="">pilih halaman...</option>
                    {pages.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (/{p.slug})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Option 3: tampilkan OG preview */}
              {fallbackType === 'og' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">judul og</label>
                      <input 
                        type="text" 
                        placeholder="judul halaman" 
                        className="form-control" 
                        value={fallbackOgTitle}
                        onChange={e => setFallbackOgTitle(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">deskripsi og</label>
                      <input 
                        type="text" 
                        placeholder="deskripsi singkat" 
                        className="form-control" 
                        value={fallbackOgDesc}
                        onChange={e => setFallbackOgDesc(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">url gambar og</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="url" 
                        placeholder="https://..." 
                        className="form-control" 
                        value={fallbackOgImage}
                        onChange={e => setFallbackOgImage(e.target.value)}
                      />
                      <button 
                        type="button" 
                        onClick={() => fallbackFileRef.current?.click()}
                        className="btn btn-ghost" 
                        style={{ padding: '0.65rem 1rem' }}
                      >
                        <Upload size={14} /> unggah
                      </button>
                    </div>
                  </div>

                  {/* OG Card Live Preview Box */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <label className="form-label" style={{ marginBottom: '0.5rem' }}>Pratinjau halaman</label>
                    <div className="neu-panel" style={{ padding: '1.25rem', maxWidth: '420px', borderRadius: 'var(--radius-md)' }}>
                      {fallbackOgImage ? (
                        <img src={fallbackOgImage} alt="OG Preview" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }} />
                      ) : (
                        <div className="neu-panel-inset" style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                          <ImageIcon size={24} /> <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>tidak ada gambar</span>
                        </div>
                      )}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>{domain}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                        {fallbackOgTitle || 'Isi kolom di atas'}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {fallbackOgDesc || 'Deskripsi pratinjau OG akan tampil di sini'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Bot */}
          {activeTab === 'Bot' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem' }}>bot — crawler dan scraper</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                Googlebot, scraper, dan bot lain mendarat di sini.
              </p>

              {/* Checkbox: sama seperti fallback — bot melihat yang sama dengan fallback */}
              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                <input 
                  type="checkbox" 
                  id="sameAsFallback" 
                  checked={botSameAsFallback} 
                  onChange={e => setBotSameAsFallback(e.target.checked)} 
                />
                <label htmlFor="sameAsFallback" className="form-label" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: 700 }}>
                  sama seperti fallback — bot melihat yang sama dengan fallback
                </label>
              </div>

              {botSameAsFallback ? (
                /* Synced State Notice */
                <div className="neu-panel-inset" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 700 }}>
                    <Copy size={16} style={{ color: 'var(--primary)' }} />
                    <span>OG mengikuti halaman fallback pengaturan OG saat disinkronkan</span>
                  </div>
                </div>
              ) : (
                /* Unsynced Custom Bot Configuration */
                <div>
                  {/* 3 Action Options: kirim ke URL | tampilkan halaman | tampilkan OG preview */}
                  <div className="neu-panel-inset" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.35rem' }}>
                    <button 
                      type="button" 
                      onClick={() => setBotType('url')}
                      className={`btn ${botType === 'url' ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                    >
                      <ExternalLink size={14} />
                      <span>kirim ke URL</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setBotType('page')}
                      className={`btn ${botType === 'page' ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                    >
                      <FileText size={14} />
                      <span>tampilkan halaman</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setBotType('og')}
                      className={`btn ${botType === 'og' ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                    >
                      <Layout size={14} />
                      <span>tampilkan OG preview</span>
                    </button>
                  </div>

                  {/* Option 1: kirim ke URL */}
                  {botType === 'url' && (
                    <div className="form-group">
                      <label className="form-label">URL tujuan perangkap bot *</label>
                      <input 
                        type="url" 
                        placeholder="https://..." 
                        className="form-control" 
                        value={botUrl}
                        onChange={e => setBotUrl(e.target.value)}
                      />
                      <span className="form-hint">Bot dan crawler akan dikirim ke URL ini.</span>
                    </div>
                  )}

                  {/* Option 2: tampilkan halaman */}
                  {botType === 'page' && (
                    <div className="form-group">
                      <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Pilih Halaman Perangkap Bot</span>
                        {onNavigate && (
                          <button 
                            type="button" 
                            onClick={() => onNavigate('create_page')} 
                            className="btn btn-ghost btn-sm" 
                            style={{ padding: '0.1rem 0.4rem', fontSize: '0.75rem', color: 'var(--primary)' }}
                          >
                            + buat halaman landing baru
                          </button>
                        )}
                      </div>
                      <select 
                        className="form-control"
                        value={botPageId}
                        onChange={e => setBotPageId(e.target.value)}
                      >
                        <option value="">pilih halaman...</option>
                        {pages.map(p => (
                          <option key={p.id} value={p.id}>{p.name} (/{p.slug})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Option 3: tampilkan OG preview */}
                  {botType === 'og' && (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                        <div className="form-group">
                          <label className="form-label">judul og</label>
                          <input 
                            type="text" 
                            placeholder="judul halaman" 
                            className="form-control" 
                            value={botOgTitle}
                            onChange={e => setBotOgTitle(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">deskripsi og</label>
                          <input 
                            type="text" 
                            placeholder="deskripsi singkat" 
                            className="form-control" 
                            value={botOgDesc}
                            onChange={e => setBotOgDesc(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">url gambar og</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input 
                            type="url" 
                            placeholder="https://..." 
                            className="form-control" 
                            value={botOgImage}
                            onChange={e => setBotOgImage(e.target.value)}
                          />
                          <button 
                            type="button" 
                            onClick={() => botFileRef.current?.click()}
                            className="btn btn-ghost" 
                            style={{ padding: '0.65rem 1rem' }}
                          >
                            <Upload size={14} /> unggah
                          </button>
                        </div>
                      </div>

                      {/* OG Card Live Preview Box */}
                      <div style={{ marginTop: '1.5rem' }}>
                        <label className="form-label" style={{ marginBottom: '0.5rem' }}>Pratinjau halaman</label>
                        <div className="neu-panel" style={{ padding: '1.25rem', maxWidth: '420px', borderRadius: 'var(--radius-md)' }}>
                          {botOgImage ? (
                            <img src={botOgImage} alt="OG Preview" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }} />
                          ) : (
                            <div className="neu-panel-inset" style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                              <ImageIcon size={24} /> <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>tidak ada gambar</span>
                            </div>
                          )}
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>{domain}</div>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                            {botOgTitle || 'Isi kolom di atas'}
                          </div>
                          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {botOgDesc || 'Deskripsi pratinjau OG akan tampil di sini'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: penargetan */}
          {activeTab === 'penargetan' && (
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                Filter pengunjung berdasarkan perangkat, negara, referer, atau parameter URL.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">perangkat</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.25rem' }}>
                    {['desktop', 'seluler', 'tablet'].map(dev => (
                      <label key={dev} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700 }}>
                        <input 
                          type="checkbox" 
                          checked={devices.includes(dev)}
                          onChange={() => handleDeviceToggle(dev)}
                        />
                        <span style={{ textTransform: 'capitalize' }}>{dev}</span>
                      </label>
                    ))}
                  </div>
                  <span className="form-hint" style={{ marginTop: '0.5rem' }}>kosongkan untuk izinkan semua</span>
                </div>

                <div className="form-group">
                  <label className="form-label">parameter (satu per baris)</label>
                  <textarea 
                    className="form-control"
                    placeholder="utm_source=fb&#10;ref=campaign1"
                    value={paramText}
                    onChange={e => setParamText(e.target.value)}
                  />
                  <span className="form-hint">satu per baris: kunci=nilai atau kunci saja</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">negara (kode ISO, satu per baris)</label>
                  <textarea 
                    className="form-control"
                    placeholder="ID&#10;MY&#10;SG"
                    value={countryText}
                    onChange={e => setCountryText(e.target.value)}
                  />
                  <select 
                    className="form-control" 
                    style={{ marginTop: '0.5rem' }}
                    value={countryRule}
                    onChange={e => setCountryRule(e.target.value)}
                  >
                    <option value="allow">allow — hanya ini</option>
                    <option value="block">block — blokir ini</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">referer (domain, satu per baris)</label>
                  <textarea 
                    className="form-control"
                    placeholder="facebook.com&#10;google.com"
                    value={refererText}
                    onChange={e => setRefererText(e.target.value)}
                  />
                  <select 
                    className="form-control" 
                    style={{ marginTop: '0.5rem' }}
                    value={refererRule}
                    onChange={e => setRefererRule(e.target.value)}
                  >
                    <option value="allow">allow — hanya ini</option>
                    <option value="block">block — blokir ini</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: opsi (100% Vidy.my Exact UI & Defaults) */}
          {activeTab === 'opsi' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem' }}>opsi & mode pengalihan</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                Atur mode pengalihan (Auto / Tombol Klik / Langsung), penundaan timer, deteksi bot, dan batas klik.
              </p>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Mode Pengalihan</label>
                  <div className="neu-panel-inset" style={{ display: 'flex', gap: '0.4rem', padding: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => setRedirectMode('click')}
                      className={`btn ${redirectMode === 'click' ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', fontWeight: 800 }}
                    >
                      Landing Page
                    </button>
                    <button
                      type="button"
                      onClick={() => setRedirectMode('auto')}
                      className={`btn ${redirectMode === 'auto' ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', fontWeight: 800 }}
                    >
                      Langsung
                    </button>
                  </div>
                  <span className="form-hint" style={{ marginTop: '0.4rem' }}>
                    {redirectMode === 'click'
                      ? 'Landing Page: Menampilkan halaman iklan banner & tombol lanjutkan.'
                      : 'Langsung: Memuat iklan di background & otomatis mengalihkan tanpa klik.'}
                  </span>
                </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.65rem' }}>
                  <input 
                    type="checkbox" 
                    id="enableBotBlocker" 
                    checked={enableBotBlocker} 
                    onChange={e => setEnableBotBlocker(e.target.checked)} 
                  />
                  <label htmlFor="enableBotBlocker" className="form-label" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: 700 }}>
                    pemblokir bot
                  </label>
                </div>

                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.65rem' }}>
                  <input 
                    type="checkbox" 
                    id="blockProxy" 
                    checked={blockProxy} 
                    onChange={e => setBlockProxy(e.target.checked)} 
                  />
                  <label htmlFor="blockProxy" className="form-label" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: 700 }}>
                    pemblokir proksi
                  </label>
                </div>

                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.65rem' }}>
                  <input 
                    type="checkbox" 
                    id="forwardUtm" 
                    checked={forwardUtm} 
                    onChange={e => setForwardUtm(e.target.checked)} 
                  />
                  <label htmlFor="forwardUtm" className="form-label" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: 700 }}>
                    teruskan parameter UTM & query
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">batas klik per IP</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="tak terbatas" 
                    className="form-control" 
                    value={clickLimitPerIp}
                    onChange={e => setClickLimitPerIp(e.target.value)}
                  />
                  <span className="form-hint">Batas berapa kali IP yang sama bisa memicu tautan ini.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">reset setelah (jam)</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="tidak pernah" 
                    className="form-control" 
                    value={resetLimitHours}
                    onChange={e => setResetLimitHours(e.target.value)}
                  />
                  <span className="form-hint">Kosongkan untuk tidak pernah reset.</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button type="button" onClick={onCancel} className="btn btn-ghost">
              Batal
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              <Check size={16} />
              <span>{linkToEdit ? 'Simpan Perubahan' : 'buat tautan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
