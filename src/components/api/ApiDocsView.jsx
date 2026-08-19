import React, { useState } from 'react';
import { 
  Braces, 
  Key, 
  Copy, 
  Check, 
  Send, 
  Code, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  RefreshCw,
  Server,
  Layers,
  Link2,
  FileCode
} from 'lucide-react';
import { Header } from '../layout/Header';

export const ApiDocsView = ({ onOpenCreateModal, onOpenSimulator }) => {
  const [activeCodeTab, setActiveCodeTab] = useState('curl');
  const [apiKey, setApiKey] = useState('sl_live_7a9f82c41e5b3091d842a');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Playground State
  const [testUrl, setTestUrl] = useState('https://example.com/target-page');
  const [testAlias, setTestAlias] = useState('');
  const [testDomain, setTestDomain] = useState(typeof window !== 'undefined' ? window.location.hostname : 'cuanflix.site');
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cuanflix.site';

  const generateNewKey = () => {
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setApiKey(`sl_live_${randomHex}`);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const copyCodeSnippet = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRunPlayground = (e) => {
    e.preventDefault();
    setIsLoadingApi(true);

    setTimeout(() => {
      const alias = testAlias.trim() || Math.random().toString(36).substring(2, 8);
      const shortUrl = `https://${testDomain}/${alias}`;

      setApiResponse({
        status: 200,
        success: true,
        data: {
          id: `link_${Date.now()}`,
          short_url: shortUrl,
          target_url: testUrl,
          alias: alias,
          domain: testDomain,
          redirect_mode: 'auto',
          redirect_delay: 2,
          created_at: new Date().toISOString()
        }
      });
      setIsLoadingApi(false);
    }, 600);
  };

  const codeSnippets = {
    curl: `curl -X POST "${baseUrl}/api/v1/shorten" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "${testUrl}", "alias": "${testAlias || 'promo2026'}"}'`,

    js: `fetch("${baseUrl}/api/v1/shorten", {
  method: "POST",
  headers: { "Authorization": "Bearer ${apiKey}", "Content-Type": "application/json" },
  body: JSON.stringify({ url: "${testUrl}", alias: "${testAlias || 'promo2026'}" })
}).then(r => r.json()).then(console.log);`,

    python: `import requests

res = requests.post(
    "${baseUrl}/api/v1/shorten",
    headers={"Authorization": "Bearer ${apiKey}"},
    json={"url": "${testUrl}", "alias": "${testAlias || 'promo2026'}"}
)
print(res.json())`,

    php: `<?php
$res = file_get_contents("${baseUrl}/api/v1/shorten", false, stream_context_create([
    "http" => [
        "method" => "POST",
        "header" => "Authorization: Bearer ${apiKey}\r\nContent-Type: application/json\r\n",
        "content" => json_encode(["url" => "${testUrl}"])
    ]
]));
echo $res;`
  };

  return (
    <div>
      <Header 
        title="Developer REST API" 
        subtitle="Integrasi otomatisasi penyingkat tautan via HTTP API & Telegram Bot"
        onOpenCreateModal={onOpenCreateModal}
        onOpenSimulator={onOpenSimulator}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* API Key Box */}
        <section className="neu-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Key size={13} /> Authentication
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.25rem' }}>Kunci API Pengembang (API Key)</h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Gunakan header HTTP <code style={{ background: 'var(--bg-inset)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>Authorization: Bearer YOUR_API_KEY</code> pada setiap request.
              </p>
            </div>

            <button
              onClick={generateNewKey}
              className="btn btn-ghost btn-sm"
              style={{ fontWeight: 800, padding: '0.5rem 0.85rem' }}
            >
              <RefreshCw size={14} />
              <span>Generasi Key Baru</span>
            </button>
          </div>

          <div className="neu-panel-inset" style={{ padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', maxWidth: '650px' }}>
            <input
              type="text"
              readOnly
              value={apiKey}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.925rem',
                fontWeight: 800,
                color: 'var(--primary)',
                outline: 'none'
              }}
            />
            <button
              onClick={copyApiKey}
              className="btn btn-primary btn-sm"
              style={{ flexShrink: 0, padding: '0.45rem 0.85rem' }}
            >
              {copiedKey ? <Check size={14} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={14} />}
              <span>{copiedKey ? 'Tersalin' : 'Salin Key'}</span>
            </button>
          </div>
        </section>

        {/* Endpoints & Code Snippets Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          
          {/* Left: API Endpoints Specification */}
          <section className="neu-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <Server size={18} style={{ color: 'var(--primary)' }} /> Spesifikasi Endpoint REST API
            </h3>

            {/* Endpoint item 1 */}
            <div className="neu-panel-inset" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-success" style={{ fontWeight: 900 }}>
                  POST
                </span>
                <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  /api/v1/shorten
                </code>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>
                Membuat shortlink baru secara instan dengan opsi cloaking, mode redirect, dan alias kustom.
              </p>

              <div style={{ fontSize: '0.775rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase' }}>Parameter JSON Body:</div>
                <ul style={{ listStyle: 'circle', paddingLeft: '1.2rem', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text-muted)' }}>
                  <li><strong style={{ color: 'var(--text-main)' }}>url</strong> (string, wajib): URL target tujuan.</li>
                  <li><strong style={{ color: 'var(--text-main)' }}>alias</strong> (string, opsional): Slug kustom (3-50 karakter).</li>
                  <li><strong style={{ color: 'var(--text-main)' }}>domain</strong> (string, opsional): Domain shortlink.</li>
                  <li><strong style={{ color: 'var(--text-main)' }}>add_mp4</strong> (boolean, opsional): Tambah akhiran .mp4</li>
                  <li><strong style={{ color: 'var(--text-main)' }}>redirect_mode</strong> (string): "auto" | "click" | "direct"</li>
                  <li><strong style={{ color: 'var(--text-main)' }}>redirect_delay</strong> (integer): Penundaan (1-30s).</li>
                </ul>
              </div>
            </div>

            {/* Endpoint item 2 */}
            <div className="neu-panel-inset" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-primary" style={{ fontWeight: 900 }}>
                  GET
                </span>
                <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  /api/v1/links
                </code>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Mengambil daftar seluruh shortlink yang dibuat beserta jumlah klik & data analitik.
              </p>
            </div>
          </section>

          {/* Right: Code Snippets & Sandbox */}
          <section className="neu-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Code size={18} style={{ color: 'var(--primary)' }} /> Contoh Code Request
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {/* Code Tabs */}
                  <div className="neu-panel-inset" style={{ display: 'flex', padding: '0.2rem', gap: '0.2rem' }}>
                    {['curl', 'js', 'python', 'php'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveCodeTab(tab)}
                        className={`btn ${activeCodeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', fontWeight: 800 }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Copy Code Button */}
                  <button
                    onClick={copyCodeSnippet}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', fontWeight: 800 }}
                    title="Salin Code"
                  >
                    {copiedCode ? <Check size={13} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={13} />}
                    <span>{copiedCode ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {/* Code Display Box */}
              <div 
                className="neu-panel-inset" 
                style={{ 
                  padding: '1.1rem', 
                  background: 'var(--bg-app)', 
                  borderRadius: 'var(--radius-sm)', 
                  border: '1px solid var(--border-subtle)',
                  overflowX: 'auto' 
                }}
              >
                <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary)', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {codeSnippets[activeCodeTab]}
                </pre>
              </div>
            </div>

            {/* Live Interactive API Sandbox */}
            <div className="neu-panel-inset" style={{ padding: '1.25rem', marginTop: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 900, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={16} style={{ color: 'var(--accent-amber)' }} /> Live Interactive API Sandbox
              </h4>
              
              <form onSubmit={handleRunPlayground} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.725rem' }}>Target URL *</label>
                    <input
                      type="url"
                      value={testUrl}
                      onChange={(e) => setTestUrl(e.target.value)}
                      className="form-control"
                      style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.725rem' }}>Alias Kustom</label>
                    <input
                      type="text"
                      placeholder="custom-alias"
                      value={testAlias}
                      onChange={(e) => setTestAlias(e.target.value)}
                      className="form-control"
                      style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoadingApi}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', fontWeight: 800, justifyContent: 'center' }}
                >
                  <Send size={15} />
                  <span>{isLoadingApi ? 'Memproses API Request...' : 'Jalankan Test API Request'}</span>
                </button>
              </form>

              {/* API JSON Output */}
              {apiResponse && (
                <div style={{ marginTop: '1rem', padding: '0.85rem', background: '#020617', borderRadius: 'var(--radius-sm)', overflowX: 'auto', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', marginBottom: '0.35rem' }}>// HTTP 200 OK Response:</div>
                  <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#4ade80', margin: 0 }}>
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
