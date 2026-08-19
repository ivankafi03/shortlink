import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ExternalLink,
  Globe,
  Smartphone,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('id-ID', { 
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const toInputDate = (d) => {
  if (!d) return '';
  return d.toISOString().split('T')[0];
};

// ─── KPI Stat Card ────────────────────────────────────────────────────────────

const StatCard = ({ label, value, color }) => (
  <div className="neu-panel" style={{ padding: '1.1rem 1.4rem', textAlign: 'center' }}>
    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
      {label}
    </div>
    <div style={{ fontSize: '2rem', fontWeight: 900, color: color || 'var(--primary)', lineHeight: 1 }}>
      {value}
    </div>
  </div>
);

// ─── Bar Chart (daily clicks) ─────────────────────────────────────────────────

const DailyBarChart = ({ logs }) => {
  const today = new Date();
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  const counts = {};
  logs.forEach(log => {
    const day = log.timestamp?.split('T')[0];
    if (day) counts[day] = (counts[day] || 0) + 1;
  });

  const maxCount = Math.max(...days.map(d => counts[d] || 0), 1);

  if (logs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
        belum ada data
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '80px', padding: '0 0.25rem' }}>
      {days.map(day => {
        const count = counts[day] || 0;
        const heightPct = maxCount > 0 ? (count / maxCount) * 100 : 0;
        const isToday = day === toInputDate(today);
        return (
          <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'default' }} title={`${day}: ${count} klik`}>
            <div style={{ 
              width: '100%', 
              height: count > 0 ? `${Math.max(heightPct, 10)}%` : '3px',
              background: isToday ? 'var(--primary)' : count > 0 ? '#93c5fd' : 'var(--border-subtle)',
              borderRadius: '3px 3px 0 0',
              transition: 'all 0.2s ease'
            }} />
          </div>
        );
      })}
    </div>
  );
};

// ─── Breakdown List ─────────────────────────────────────────────────────────────

const BreakdownList = ({ items, total }) => {
  if (!items || items.length === 0) {
    return <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>—</div>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {items.map(([label, count]) => {
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.2rem' }}>
              <span style={{ textTransform: 'capitalize' }}>{label}</span>
              <span style={{ color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
            </div>
            <div className="neu-panel-inset" style={{ height: '6px', overflow: 'hidden', borderRadius: '3px' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Analytics List View ───────────────────────────────────────────────────────

const AnalyticsListView = ({ links, analyticsLogs, onSelectLink }) => {
  const validLinkIds = useMemo(() => new Set(links.map(l => l.id)), [links]);
  const activeLogs = useMemo(() => {
    if (links.length === 0) return [];
    return analyticsLogs.filter(l => validLinkIds.has(l.linkId));
  }, [links, analyticsLogs, validLinkIds]);

  const totalLinks = links.length;
  const totalClicks = activeLogs.length;
  const totalTargeted = activeLogs.filter(l => !l.isBot && !l.isProxy).length;
  const totalBot = activeLogs.filter(l => l.isBot).length;
  const totalProxy = activeLogs.filter(l => l.isProxy).length;

  const linkStats = links.map(link => {
    const logs = activeLogs.filter(l => l.linkId === link.id);
    const total = logs.length;
    const targeted = logs.filter(l => !l.isBot && !l.isProxy).length;
    const bot = logs.filter(l => l.isBot).length;
    const proxy = logs.filter(l => l.isProxy).length;
    return { link, total, targeted, bot, proxy };
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.15rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900 }}>Analitik Trafik</h1>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontWeight: 800, color: '#059669', background: '#d1fae5', padding: '0.2rem 0.65rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            Live Real-Time
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
          Statistik trafik real-time seluruh tautan kamu
        </p>
      </div>

      {/* Global KPI Row */}
      <div className="analytics-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Total Tautan" value={totalLinks} color="var(--primary)" />
        <StatCard label="Total Klik" value={totalClicks} color="var(--primary)" />
        <StatCard label="Tertarget" value={totalTargeted} color="#10b981" />
        <StatCard label="Bot & Crawler" value={totalBot} color="#f43f5e" />
        <StatCard label="Proxy / VPN" value={totalProxy} color="#f59e0b" />
      </div>

      {/* Per-link Table */}
      <div className="neu-panel" style={{ padding: '1.5rem' }}>
        <div className="desktop-table-view custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>TAUTAN</th>
                <th style={{ textAlign: 'right' }}>TOTAL KLIK</th>
                <th style={{ textAlign: 'right' }}>TERTARGET</th>
                <th style={{ textAlign: 'right' }}>BOT</th>
                <th style={{ textAlign: 'right' }}>PROXY</th>
                <th style={{ textAlign: 'right' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {linkStats.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    Belum ada tautan aktif. Buat tautan pertama Anda untuk mulai mengumpulkan statistik trafik.
                  </td>
                </tr>
              ) : (
                linkStats.map(({ link, total, targeted, bot, proxy }) => (
                  <tr key={link.id} onClick={() => onSelectLink(link.id)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                        /{link.shortCode}{link.addMp4Suffix ? '.mp4' : ''}
                      </div>
                      <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-dim)', marginTop: '0.1rem' }}>
                        {link.name || 'Tanpa Nama'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '1rem' }}>{total}</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '1rem', color: '#10b981' }}>{targeted}</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '1rem', color: '#f43f5e' }}>{bot}</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '1rem', color: '#f59e0b' }}>{proxy}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        Detail <ChevronRight size={14} />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="mobile-cards-view">
          {linkStats.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Belum ada tautan
            </div>
          ) : (
            linkStats.map(({ link, total, targeted, bot, proxy }, idx) => (
              <div 
                key={link.id} 
                onClick={() => onSelectLink(link.id)}
                style={{ 
                  padding: '0.85rem 0.25rem', 
                  borderBottom: idx === linkStats.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontSize: '0.9rem' }}>
                    /{link.shortCode}{link.addMp4Suffix ? '.mp4' : ''}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    Detail <ChevronRight size={14} />
                  </span>
                </div>

                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  {link.name || 'Tanpa Nama'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge" style={{ fontSize: '0.725rem', fontWeight: 800 }}>
                    Total: {total}
                  </span>
                  <span className="badge badge-success" style={{ fontSize: '0.725rem', fontWeight: 800 }}>
                    Target: {targeted}
                  </span>
                  <span className="badge badge-danger" style={{ fontSize: '0.725rem', fontWeight: 800 }}>
                    Bot: {bot}
                  </span>
                  <span className="badge badge-amber" style={{ fontSize: '0.725rem', fontWeight: 800 }}>
                    Proksi: {proxy}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Analytics Detail View ─────────────────────────────────────────────────────

const AnalyticsDetailView = ({ link, analyticsLogs, onBack }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [perPage, setPerPage] = useState(50);

  const linkLogs = useMemo(() => {
    return analyticsLogs.filter(l => l.linkId === link.id);
  }, [analyticsLogs, link.id]);

  const filteredLogs = useMemo(() => {
    return linkLogs.filter(log => {
      const ts = new Date(log.timestamp);
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (ts < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (ts > to) return false;
      }
      return true;
    });
  }, [linkLogs, dateFrom, dateTo]);

  const total = filteredLogs.length;
  const unique = new Set(filteredLogs.map(l => l.ip)).size;
  const targeted = filteredLogs.filter(l => !l.isBot && !l.isProxy).length;
  const botCount = filteredLogs.filter(l => l.isBot).length;
  const proxyCount = filteredLogs.filter(l => l.isProxy).length;

  const countryCounts = Object.entries(
    filteredLogs.reduce((acc, l) => { acc[l.country] = (acc[l.country] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const deviceCounts = Object.entries(
    filteredLogs.reduce((acc, l) => { acc[l.device] = (acc[l.device] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]);

  const ruleCounts = Object.entries(
    filteredLogs.reduce((acc, l) => { acc[l.triggeredRule] = (acc[l.triggeredRule] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const displayedLogs = filteredLogs.slice(0, perPage);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', marginBottom: '0.15rem', lineHeight: 1.25 }}>
            /{link.shortCode}{link.addMp4Suffix ? '.mp4' : ''}
          </h1>
          <a 
            href={link.targetUrl} 
            target="_blank" 
            rel="noreferrer"
            style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', wordBreak: 'break-all' }}
          >
            {link.targetUrl?.slice(0, 70)}{link.targetUrl?.length > 70 ? '…' : ''}
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* KPI Row */}
      <div className="analytics-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
        <StatCard label="total klik" value={total} color="var(--primary)" />
        <StatCard label="unik" value={unique} color="var(--primary)" />
        <StatCard label="tertarget" value={targeted} color="#10b981" />
        <StatCard label="bot" value={botCount} color="#f43f5e" />
        <StatCard label="proksi" value={proxyCount} color="#f59e0b" />
      </div>

      {/* Date Filter + Per Page */}
      <div className="neu-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>dari</span>
          <input 
            type="date" 
            className="form-control"
            style={{ maxWidth: '155px', fontSize: '0.85rem' }}
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
          />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>sampai</span>
          <input 
            type="date" 
            className="form-control"
            style={{ maxWidth: '155px', fontSize: '0.85rem' }}
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
          />
          {(dateFrom || dateTo) && (
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
            >
              reset
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>per halaman</span>
          <select 
            className="form-control"
            style={{ maxWidth: '90px', fontSize: '0.85rem' }}
            value={perPage}
            onChange={e => setPerPage(Number(e.target.value))}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
          </select>
        </div>
      </div>

      {/* Daily Bar Chart */}
      <div className="neu-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <TrendingUp size={16} style={{ color: 'var(--primary)' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>klik harian</h3>
        </div>
        <DailyBarChart logs={filteredLogs} />
      </div>

      {/* 3-Column Breakdowns */}
      <div className="analytics-breakdown-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div className="neu-panel" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
            <Globe size={15} style={{ color: '#10b981' }} />
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800 }}>negara</h4>
          </div>
          <BreakdownList items={countryCounts} total={total} />
        </div>

        <div className="neu-panel" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
            <Smartphone size={15} style={{ color: 'var(--primary)' }} />
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800 }}>perangkat</h4>
          </div>
          <BreakdownList items={deviceCounts} total={total} />
        </div>

        <div className="neu-panel" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
            <Activity size={15} style={{ color: '#f59e0b' }} />
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800 }}>aturan cocok</h4>
          </div>
          <BreakdownList items={ruleCounts} total={total} />
        </div>
      </div>

      {/* Click Log Table */}
      <div className="neu-panel" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>log klik</h3>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            {filteredLogs.length} klik total
          </span>
        </div>

        {/* Desktop View Table */}
        <div className="desktop-table-view custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>waktu</th>
                <th>ip</th>
                <th>negara</th>
                <th>perangkat</th>
                <th>referer</th>
                <th>aturan</th>
                <th>pengalihan</th>
                <th>flag</th>
              </tr>
            </thead>
            <tbody>
              {displayedLogs.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    belum ada klik
                  </td>
                </tr>
              ) : (
                displayedLogs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {fmtDate(log.timestamp)}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700 }}>
                        {log.ip}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                        {log.country}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize' }}>
                        {log.device}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-dim)' }}>
                        {log.referer || '—'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.775rem', fontWeight: 700, color: log.isBot ? '#f43f5e' : log.isProxy ? '#f59e0b' : 'var(--text-main)', maxWidth: '160px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.triggeredRule}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, maxWidth: '150px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.destinationUrl || '—'}
                      </span>
                    </td>
                    <td>
                      {log.isBot ? (
                        <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>bot</span>
                      ) : log.isProxy ? (
                        <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>proksi</span>
                      ) : (
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Lolos</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Log List */}
        <div className="mobile-cards-view">
          {displayedLogs.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', fontSize: '0.875rem', fontWeight: 600 }}>
              belum ada klik
            </div>
          ) : (
            displayedLogs.map((log, idx) => (
              <div 
                key={log.id} 
                style={{ 
                  padding: '0.75rem 0.25rem', 
                  borderBottom: idx === displayedLogs.length - 1 ? 'none' : '1px solid var(--border-subtle)' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {log.ip}
                  </span>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {fmtDate(log.timestamp)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.675rem' }}>{log.country}</span>
                  <span className="badge" style={{ fontSize: '0.675rem', textTransform: 'capitalize' }}>{log.device}</span>
                  {log.isBot ? (
                    <span className="badge badge-danger" style={{ fontSize: '0.675rem' }}>Bot Trap</span>
                  ) : log.isProxy ? (
                    <span className="badge badge-amber" style={{ fontSize: '0.675rem' }}>Proksi</span>
                  ) : (
                    <span className="badge badge-success" style={{ fontSize: '0.675rem' }}>Targeted</span>
                  )}
                </div>

                <div style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Aturan: <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{log.triggeredRule}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredLogs.length > perPage && (
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Menampilkan {perPage} dari {filteredLogs.length} klik
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Export ───────────────────────────────────────────────────────────────

export const AnalyticsView = ({ analyticsLogs, links }) => {
  const [selectedLinkId, setSelectedLinkId] = useState(null);

  const selectedLink = selectedLinkId ? links.find(l => l.id === selectedLinkId) : null;

  if (selectedLink) {
    return (
      <AnalyticsDetailView
        link={selectedLink}
        analyticsLogs={analyticsLogs}
        onBack={() => setSelectedLinkId(null)}
      />
    );
  }

  return (
    <AnalyticsListView
      links={links}
      analyticsLogs={analyticsLogs}
      onSelectLink={(id) => setSelectedLinkId(id)}
    />
  );
};
