import React, { useState } from 'react';
import { 
  Play, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Radio
} from 'lucide-react';
import { evaluateTrafficRouting } from '../../services/trafficRouter';

export const TrafficSimulatorModal = ({ links, initialLink, onClose }) => {
  const [selectedLinkId, setSelectedLinkId] = useState(initialLink ? initialLink.id : (links[0]?.id || ''));

  // Visitor Preset Simulation Inputs
  const [userIp, setUserIp] = useState('180.252.12.98');
  const [country, setCountry] = useState('ID');
  const [device, setDevice] = useState('seluler');
  const [referer, setReferer] = useState('facebook.com');
  const [ispName, setIspName] = useState('Telkomsel Indonesia');
  const [asnNumber, setAsnNumber] = useState('AS23693');
  const [userAgent, setUserAgent] = useState('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)');
  const [queryString, setQueryString] = useState('utm_source=fb&ref=campaign1');

  const [simulationResult, setSimulationResult] = useState(null);

  const activeLink = links.find(l => l.id === selectedLinkId);

  const handleRunSimulation = (e) => {
    e.preventDefault();
    if (!activeLink) return;

    // Parse query string into key-value map
    const queryParams = {};
    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      for (const [k, v] of searchParams.entries()) {
        queryParams[k] = v;
      }
    }

    const simRequest = {
      userIp,
      country,
      device,
      referer,
      ispName,
      asnNumber,
      userAgent,
      queryParams
    };

    const result = evaluateTrafficRouting(activeLink, simRequest);
    setSimulationResult(result);
  };

  const handlePresetChange = (preset) => {
    if (preset === 'normal_mobile') {
      setUserIp('180.252.12.98');
      setCountry('ID');
      setDevice('seluler');
      setReferer('facebook.com');
      setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)');
    } else if (preset === 'bot_google') {
      setUserIp('66.249.66.1');
      setCountry('US');
      setDevice('desktop');
      setReferer('google.com');
      setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1)');
    } else if (preset === 'us_desktop') {
      setUserIp('104.28.12.5');
      setCountry('US');
      setDevice('desktop');
      setReferer('direct');
      setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content neu-panel" style={{ maxWidth: '850px', width: '90vw' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="neu-panel-inset" style={{ padding: '0.45rem', borderRadius: '10px', color: 'var(--accent-emerald)' }}>
              <Radio size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '0.1rem' }}>Traffic Router Simulator</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Uji coba langsung pengalihan lalu lintas berdasarkan perangkat, negara, bot, atau IP
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleRunSimulation} style={{ padding: '1.5rem' }}>
          {/* Link Selector */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Pilih Tautan Pendek Yang Ingin Diuji</label>
            <select 
              className="form-control"
              value={selectedLinkId}
              onChange={e => setSelectedLinkId(e.target.value)}
            >
              {links.map(l => (
                <option key={l.id} value={l.id}>{l.name} ({l.domain}/{l.shortCode})</option>
              ))}
            </select>
          </div>

          {/* Quick Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Simulasi Preset:</span>
            <button type="button" onClick={() => handlePresetChange('normal_mobile')} className="btn btn-sm" style={{ fontSize: '0.75rem' }}>
              Mobile Indonesia (FB)
            </button>
            <button type="button" onClick={() => handlePresetChange('bot_google')} className="btn btn-sm" style={{ fontSize: '0.75rem' }}>
              Googlebot Crawler
            </button>
            <button type="button" onClick={() => handlePresetChange('us_desktop')} className="btn btn-sm" style={{ fontSize: '0.75rem' }}>
              Desktop USA (Direct)
            </button>
          </div>

          {/* Simulation Input Grid */}
          <div className="responsive-three-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label">Alamat IP Pengunjung</label>
              <input type="text" className="form-control" value={userIp} onChange={e => setUserIp(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Negara (Kode ISO)</label>
              <input type="text" className="form-control" value={country} onChange={e => setCountry(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Perangkat</label>
              <select className="form-control" value={device} onChange={e => setDevice(e.target.value)}>
                <option value="seluler">seluler (Mobile)</option>
                <option value="desktop">desktop</option>
                <option value="tablet">tablet</option>
              </select>
            </div>
            <div>
              <label className="form-label">Domain Referer</label>
              <input type="text" className="form-control" value={referer} onChange={e => setReferer(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Nama ISP</label>
              <input type="text" className="form-control" value={ispName} onChange={e => setIspName(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Parameter Query URL</label>
              <input type="text" className="form-control" value={queryString} onChange={e => setQueryString(e.target.value)} placeholder="utm_source=fb" />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.7rem 2rem' }}>
              <Play size={15} />
              <span>Jalankan Simulasi Router</span>
            </button>
          </div>

          {/* Output Results Section */}
          {simulationResult && (
            <div className="neu-panel-inset" style={{ padding: '1.25rem', animation: 'fadeIn 0.15s ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>HASIL EVALUASI ROUTING</span>
                
                {simulationResult.action === 'target' && (
                  <span className="badge badge-success" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                    <CheckCircle2 size={13} /> Pass → Target URL
                  </span>
                )}
                {simulationResult.action === 'fallback' && (
                  <span className="badge badge-amber" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                    <AlertTriangle size={13} /> Redirected → Fallback Page
                  </span>
                )}
                {simulationResult.action === 'bot_trap' && (
                  <span className="badge badge-danger" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                    <ShieldAlert size={13} /> Trap → Bot Landing Page
                  </span>
                )}
                {simulationResult.action === 'blocked' && (
                  <span className="badge badge-danger" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                    <X size={13} /> Akses Ditolak (Blocked)
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                <strong>Aturan Terpicu: </strong>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{simulationResult.rule}</span>
              </div>

              <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                <strong>Tujuan Pengalihan: </strong>
                <a 
                  href={simulationResult.destination} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: 'var(--primary)', fontWeight: 600, wordBreak: 'break-all' }}
                >
                  {simulationResult.destination}
                </a>
              </div>

              {/* Render Bot Trap / Fallback HTML Preview if applicable */}
              {(simulationResult.botPageContent || simulationResult.fallbackPageContent) && (
                <div>
                  <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>TAMPILAN OUTPUT HALAMAN HTML PREVIEW:</span>
                  <div style={{ height: '170px', border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden', background: '#ffffff' }}>
                    <iframe 
                      title="Simulation Preview" 
                      srcDoc={simulationResult.botPageContent || simulationResult.fallbackPageContent}
                      style={{ width: '100%', height: '100%', border: 'none' }} 
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
