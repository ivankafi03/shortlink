import React, { useState, useEffect } from 'react';
import { 
  Play, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Globe, 
  Smartphone, 
  Search, 
  RefreshCw, 
  ExternalLink,
  Sliders,
  Cpu
} from 'lucide-react';
import { evaluateTrafficRouting } from '../../services/trafficRouter';
import { getStoredPages, getStoredConfig } from '../../services/storageService';
import { Header } from '../layout/Header';

export const TrafficSimulatorView = ({ 
  links, 
  initialLink, 
  onClose,
  isModal = false 
}) => {
  const [selectedLinkCode, setSelectedLinkCode] = useState(initialLink ? initialLink.shortCode : (links[0] ? links[0].shortCode : ''));
  const [device, setDevice] = useState('seluler');
  const [country, setCountry] = useState('ID');
  const [ip, setIp] = useState('180.252.12.44');
  const [userAgent, setUserAgent] = useState('Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X)');
  const [referer, setReferer] = useState('https://facebook.com');
  const [urlParams, setUrlParams] = useState('utm_source=fb_ad&campaign=sales');

  const [simulationResult, setSimulationResult] = useState(null);

  const selectedLink = links.find(l => l.shortCode === selectedLinkCode) || links[0];
  const pages = getStoredPages();

  const presets = [
    {
      name: 'Pengunjung Seluler Asli (Indonesia)',
      device: 'seluler',
      country: 'ID',
      ip: '180.252.12.44',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15',
      referer: 'https://facebook.com',
      urlParams: 'utm_source=fb_ad'
    },
    {
      name: 'Googlebot Search Crawler (USA)',
      device: 'desktop',
      country: 'US',
      ip: '66.249.66.1',
      userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      referer: 'https://google.com',
      urlParams: ''
    },
    {
      name: 'Pengunjung VPN / Proxy (Singapura)',
      device: 'desktop',
      country: 'SG',
      ip: '128.199.200.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      referer: 'https://direct.com',
      urlParams: ''
    }
  ];

  const handleApplyPreset = (p) => {
    setDevice(p.device);
    setCountry(p.country);
    setIp(p.ip);
    setUserAgent(p.userAgent);
    setReferer(p.referer);
    setUrlParams(p.urlParams);
  };

  const handleRunSimulation = () => {
    if (!selectedLink) return;

    const requestContext = {
      userIp: ip,
      country,
      device,
      userAgent,
      referer,
      queryParams: { utm_source: 'fb_ad' }
    };

    const result = evaluateTrafficRouting(selectedLink, requestContext);
    setSimulationResult(result);
  };

  // Run simulation automatically when inputs change
  useEffect(() => {
    if (selectedLink) {
      handleRunSimulation();
    }
  }, [selectedLinkCode, device, country, ip, userAgent, referer, urlParams]);

  const content = (
    <div>
      {!isModal && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', marginBottom: '0.15rem', lineHeight: 1.25 }}>Traffic Router Simulator</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
              Uji coba dan simulasikan bagaimana tautan anda mengevaluasi pengunjung real-time
            </p>
          </div>
        </div>
      )}

      {/* Preset Schnell Selector */}
      <div className="neu-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.775rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>
          PRESET PENGUNJUNG CEPAT
        </span>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {presets.map((p, idx) => (
            <button 
              key={idx}
              type="button" 
              onClick={() => handleApplyPreset(p)}
              className="btn btn-sm"
              style={{ fontSize: '0.8rem' }}
            >
              <Cpu size={13} style={{ color: 'var(--primary)' }} />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Split Screen Simulator & Results */}
      <div className="responsive-editor-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Simulator Parameters Form */}
        <div className="neu-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} style={{ color: 'var(--primary)' }} /> Parameter Simulasi Trafik
          </h3>

          <div className="form-group">
            <label className="form-label">Pilih Tautan Pendek *</label>
            <select 
              className="form-control"
              value={selectedLinkCode}
              onChange={e => setSelectedLinkCode(e.target.value)}
            >
              {links.map(l => (
                <option key={l.id} value={l.shortCode}>
                  {l.name} (https://{l.domain}/{l.shortCode})
                </option>
              ))}
            </select>
          </div>

          <div className="responsive-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Perangkat</label>
              <select 
                className="form-control"
                value={device}
                onChange={e => setDevice(e.target.value)}
              >
                <option value="seluler">Seluler (Mobile)</option>
                <option value="desktop">Desktop</option>
                <option value="tablet">Tablet</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Negara (Kode ISO)</label>
              <input 
                type="text" 
                className="form-control"
                value={country}
                onChange={e => setCountry(e.target.value.toUpperCase())}
                placeholder="ID, US, MY, SG"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Alamat IP Pengunjung</label>
            <input 
              type="text" 
              className="form-control"
              value={ip}
              onChange={e => setIp(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">User-Agent Header</label>
            <input 
              type="text" 
              className="form-control"
              style={{ fontSize: '0.775rem', fontFamily: 'var(--font-mono)' }}
              value={userAgent}
              onChange={e => setUserAgent(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">HTTP Referer</label>
            <input 
              type="text" 
              className="form-control"
              value={referer}
              onChange={e => setReferer(e.target.value)}
            />
          </div>
        </div>

        {/* Live Evaluation Output Panel */}
        <div className="neu-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Play size={18} style={{ color: 'var(--accent-emerald)' }} /> Hasil Evaluasi Traffic Router
          </h3>

          {simulationResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {/* Verdict Card */}
              <div className="neu-panel-inset" style={{ 
                padding: '1rem', 
                borderColor: simulationResult.action === 'target' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                minWidth: 0
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  KEPUTUSAN ROUTER
                </div>
                <div style={{ 
                  fontSize: 'clamp(1rem, 3.8vw, 1.35rem)', 
                  fontWeight: 900, 
                  color: simulationResult.action === 'target' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                  marginTop: '0.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  flexWrap: 'wrap'
                }}>
                  {simulationResult.action === 'target' ? <CheckCircle2 size={22} style={{ flexShrink: 0 }} /> : <XCircle size={22} style={{ flexShrink: 0 }} />}
                  <span>{simulationResult.action === 'target' ? 'LOLOS (PENGUNJUNG ASLI)' : 'TERFILTER / DIBLOKIR'}</span>
                </div>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, marginTop: '0.4rem', color: 'var(--text-main)', wordBreak: 'break-word' }}>
                  Aturan Terpemicu: <span style={{ color: 'var(--primary)' }}>{simulationResult.rule}</span>
                </div>
              </div>

              {/* Destination Output */}
              <div className="neu-panel" style={{ padding: '0.85rem 1rem', minWidth: 0 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  TUJUAN AKHIR EVALUASI
                </div>
                <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem', wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
                  {simulationResult.destination}
                </div>
              </div>

              {/* Live Rendered Content Box */}
              {(simulationResult.botPageContent || simulationResult.fallbackPageContent) ? (
                <div className="neu-panel-inset" style={{ flex: 1, minHeight: '220px', overflow: 'hidden', borderRadius: 'var(--radius-md)', minWidth: 0 }}>
                  <iframe 
                    title="Rendered HTML Output"
                    srcDoc={simulationResult.botPageContent || simulationResult.fallbackPageContent}
                    style={{ width: '100%', height: '100%', border: 'none', background: '#ffffff' }}
                  />
                </div>
              ) : (
                <div className="neu-panel-inset" style={{ flex: 1, minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem', textAlign: 'center', minWidth: 0 }}>
                  <div>
                    <ExternalLink size={26} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>Pengunjung dialihkan langsung ke URL eksternal</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Menjalankan simulasi...</p>
          )}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" style={{ maxWidth: '960px' }} onClick={e => e.stopPropagation()}>
          <div style={{ padding: '1.25rem' }}>
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
};
