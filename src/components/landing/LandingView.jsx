import { 
  ArrowRight, 
  Link2, 
  Target, 
  Shield, 
  Globe, 
  BarChart2, 
  Zap,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Menu,
  X,
  Plus,
  Play,
  QrCode,
  Copy,
  Check,
  Braces,
  Clock,
  MousePointerClick,
  Sparkles,
  TrendingUp,
  Eye,
  Shuffle,
  Film
} from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { QrCodeModal } from '../common/QrCodeModal';
import { getPublicShowcaseLinks } from '../../services/storageService';
import { NativeAdBanner } from '../common/NativeAdBanner';

// ... (keep T translations)


// ─── Translations ──────────────────────────────────────────────────────────────

const T = {
  ID: {
    login: 'Masuk',
    heroTitle1: 'Tautanmu tahu',
    heroTitle2: 'siapa yang lihat.',
    heroSub: 'Satu tautan, halaman berbeda. Pengunjung asli lihat penawaranmu — bot dan moderator lihat sesuatu yang lain. Tahu persis siapa yang klik, dari mana, pakai apa.',
    statLinks: 'TAUTAN DIBUAT',
    statClicks: 'TOTAL KLIK',
    statActive: 'PENGUNJUNG AKTIF',
    widgetTitleRedirect: 'Buat tautan',
    widgetTitleVideo: 'Halaman Video',
    subRedirect: 'Tempel URL, dapat tautan pendek. Selesai.',
    subVideo: 'Tempel URL video. Pengunjung melihat pemutar layar penuh.',
    tabOne: 'Satu URL',
    tabBulk: 'Massal',
    tabOneV: 'Satu',
    tabBulkV: 'Massal (maks 20)',
    placeholderRedirect: 'Tempel URL di sini...',
    placeholderVideo: 'Tempel link mp4 atau m3u8...',
    placeholderBulkRedirect: 'Tempel URL di sini, satu per baris...',
    placeholderBulkVideo: 'Tempel link mp4 atau m3u8, satu per baris...',
    btnShorten: 'Perpendek',
    btnCreate: 'Buat',
    addMp4: 'Tambah akhiran .mp4',
    ogPreview: 'OG preview & opsi',
    directLinkLabel: 'Direct Link',
    directLinkHint: 'Terbuka saat diklik. Maks 4x per jam.',
    overlayMode: 'Overlay (1x/jam)',
    redirectMode: 'Redirect',
    overlayHint: 'Overlay: popup tab baru, muncul lagi setelah jeda.',
    redirectHint: 'Redirect: buka video di tab baru + redirect halaman ini ke Direct Link.',
    tagline: 'Tautan yang bekerja di mana saja',
    howTitle: 'Cara kerja',
    howSub: 'Tiga langkah. Tanpa daftar.',
    steps: [
      { num: '01', title: 'Tempel URL', desc: 'Masukkan URL apa saja. Website, link afiliasi, halaman kampanye — semua bisa.' },
      { num: '02', title: 'Atur aturan', desc: 'Opsional: atur targeting. Kirim HP ke satu arah, desktop ke arah lain. Blokir bot. Batasi per negara. Tambah alias.' },
      { num: '03', title: 'Sebar', desc: 'Salin tautan pendeknya. Pakai di mana saja — bio, chat, email, iklan. Setiap klik terlacak.' },
    ],
    featTitle: 'Yang kamu dapat',
    featSub: 'Dari tautan cepat sampai kontrol trafik penuh. Sembunyikan tujuanmu, filter per negara, blokir bot. Semua dalam satu alat.',
    features: [
      { title: 'Siapa lihat apa', desc: 'Pengunjung asli lihat penawaranmu. Moderator, bot, dan traffic dari negara yang salah lihat halaman aman. Kamu yang tentukan siapa ke mana.' },
      { title: 'Bot jebakan', desc: 'Reviewer Facebook? Crawler Google? Mereka lihat halaman bersih. Audiens aslimu lihat yang sesungguhnya. Gak kena banned, gak kena flag, data tetap bersih.' },
      { title: 'Tamu asli doang', desc: 'VPN dan proxy ketahuan sebelum sampai halamanmu. Blokir atau kasih konten lain — terserah kamu.' },
      { title: 'Intelijen Geo', desc: 'Cuma izinkan Indonesia dan Malaysia. Atau blokir Singapura. Daftar izin/tolak simpel. Sisanya kena halaman fallback.' },
      { title: 'Domain Kustom', desc: 'Pakai domain sendiri. SSL termasuk. Audiensmu lihat merekmu, bukan merek kami. Jalankan banyak domain untuk kampanye berbeda.' },
      { title: 'Tiap klik terlacak', desc: 'Setiap klik tercatat: IP, negara, perangkat, referer, aturan mana yang kena. Tahu persis apa yang terjadi — bukan cuma berapa yang klik.' },
    ],
    faqTitle: 'Yang sering ditanya',
    faqSub: 'Ada yang belum terjawab? Hubungi kami.',
    faqs: [
      { q: 'Bagaimana cara penargetan bekerja?', a: 'Kamu bisa atur aturan berdasarkan perangkat, negara, referer, atau parameter URL. Pengunjung yang cocok aturan dikirim ke tujuan utama. Yang tidak cocok dikirim ke fallback — bisa berupa URL lain, halaman landing kustom, atau OG preview.' },
      { q: 'Apakah perlu akun?', a: 'Tidak. Kamu bisa langsung buat tautan tanpa daftar. Data tersimpan di browser kamu. Daftar akun jika kamu mau sinkronisasi lintas perangkat dan fitur lanjutan.' },
      { q: 'Bisa pakai domain sendiri?', a: 'Ya! Tambahkan domain kustom kamu di menu Domain Kustom. Cukup arahkan DNS ke server kami, SSL otomatis diaktifkan.' },
      { q: 'Apakah gratis?', a: 'Ya, gratis selamanya untuk penggunaan dasar. Fitur lanjutan seperti domain kustom, ekspor data, dan manajemen tim tersedia di paket pro.' },
      { q: 'Apa yang membuat ini berbeda dari pemendek tautan lain?', a: 'Pemendek biasa hanya memendekkan URL. Kami memberikan kontrol trafik penuh: siapa yang lihat apa, blokir bot, filter geo, dan laporan detail setiap klik.' },
      { q: 'Berapa lama tautan saya bertahan?', a: 'Tautan tidak pernah kedaluwarsa selama akun aktif. Untuk mode tanpa akun (local), tautan tersimpan di browser kamu.' },
    ],
    ctaTitle: 'Siap mulai?',
    ctaSub: 'Buat tautan dalam detik. Tahu dari mana setiap klik berasal, perangkat apa, apakah itu bot. Tanpa akun, tanpa kartu, tanpa batas.',
    ctaBtn: 'Mulai gratis',
    footerTagline: 'Link intelligence · Gratis selamanya · Tanpa batas',
    footerLinks: ['Tentang', 'Kontak', 'Privasi', 'Ketentuan'],
    genCodeTitle: 'Generate kode acak',
  },
  EN: {
    login: 'Login',
    heroTitle1: 'Your link knows',
    heroTitle2: "who's watching.",
    heroSub: "One link, different pages. Real visitors see your offer — bots and moderators see something else. Know exactly who clicked, from where, on what device.",
    statLinks: 'LINKS CREATED',
    statClicks: 'TOTAL CLICKS',
    statActive: 'ACTIVE VISITORS',
    widgetTitleRedirect: 'Create link',
    widgetTitleVideo: 'Video Page',
    subRedirect: 'Paste a URL, get a short link. Done.',
    subVideo: 'Paste a video URL. Visitors see a fullscreen player.',
    tabOne: 'Single URL',
    tabBulk: 'Bulk',
    tabOneV: 'Single',
    tabBulkV: 'Bulk (max 20)',
    placeholderRedirect: 'Paste URL here...',
    placeholderVideo: 'Paste mp4 or m3u8 link...',
    placeholderBulkRedirect: 'Paste URLs here, one per line...',
    placeholderBulkVideo: 'Paste mp4 or m3u8 links, one per line...',
    btnShorten: 'Shorten',
    btnCreate: 'Create',
    addMp4: 'Add .mp4 suffix',
    ogPreview: 'OG preview & options',
    directLinkLabel: 'Direct Link',
    directLinkHint: 'Opens on click. Max 4x per hour.',
    overlayMode: 'Overlay (1x/hr)',
    redirectMode: 'Redirect',
    overlayHint: 'Overlay: opens a new tab popup, reappears after cooldown.',
    redirectHint: 'Redirect: opens video in new tab + redirects this page to Direct Link.',
    tagline: 'Links that work everywhere',
    howTitle: 'How it works',
    howSub: 'Three steps. No signup.',
    steps: [
      { num: '01', title: 'Paste URL', desc: 'Enter any URL. Website, affiliate link, campaign page — anything works.' },
      { num: '02', title: 'Set rules', desc: 'Optional: set targeting. Send mobile to one place, desktop to another. Block bots. Restrict by country. Add alias.' },
      { num: '03', title: 'Share', desc: 'Copy the short link. Use anywhere — bio, chat, email, ads. Every click is tracked.' },
    ],
    featTitle: 'What you get',
    featSub: 'From quick links to full traffic control. Hide your destination, filter by country, block bots. All in one tool.',
    features: [
      { title: 'Who sees what', desc: 'Real visitors see your offer. Moderators, bots, and traffic from the wrong countries see a safe page. You decide who goes where.' },
      { title: 'Bot trap', desc: 'Facebook reviewer? Google crawler? They see a clean page. Your real audience sees the real thing. No bans, no flags, clean data.' },
      { title: 'Real visitors only', desc: 'VPNs and proxies are caught before reaching your page. Block them or show different content — your choice.' },
      { title: 'Geo intelligence', desc: 'Only allow Indonesia and Malaysia. Or block Singapore. Simple allow/deny list. The rest hit the fallback page.' },
      { title: 'Custom domain', desc: 'Use your own domain. SSL included. Your audience sees your brand, not ours. Run multiple domains for different campaigns.' },
      { title: 'Every click tracked', desc: 'Every click logged: IP, country, device, referer, which rule triggered. Know exactly what happens — not just how many clicked.' },
    ],
    faqTitle: 'Frequently asked',
    faqSub: 'Still have questions? Contact us.',
    faqs: [
      { q: 'How does targeting work?', a: 'You can set rules based on device, country, referer, or URL parameters. Visitors matching the rules go to the main destination. Others go to fallback — another URL, a custom landing page, or an OG preview.' },
      { q: 'Do I need an account?', a: 'No. You can create links without signing up. Data is stored in your browser. Create an account if you want cross-device sync and advanced features.' },
      { q: 'Can I use my own domain?', a: 'Yes! Add your custom domain in the Custom Domain menu. Just point your DNS to our server, SSL is activated automatically.' },
      { q: 'Is it free?', a: 'Yes, free forever for basic use. Advanced features like custom domains, data export, and team management are available in the pro plan.' },
      { q: 'What makes this different from other URL shorteners?', a: 'Regular shorteners just shorten URLs. We give you full traffic control: who sees what, block bots, geo filtering, and detailed per-click reports.' },
      { q: 'How long do my links last?', a: 'Links never expire as long as your account is active. For no-account mode (local), links are stored in your browser.' },
    ],
    ctaTitle: 'Ready to start?',
    ctaSub: 'Create a link in seconds. Know where every click comes from, what device, whether it\'s a bot. No account, no card, no limits.',
    ctaBtn: 'Start free',
    footerTagline: 'Link intelligence · Free forever · No limits',
    footerLinks: ['About', 'Contact', 'Privacy', 'Terms'],
    genCodeTitle: 'Generate random code',
  }
};

const FEATURE_ICONS = [Target, Shield, Zap, Globe, Link2, BarChart2];
const FEATURE_COLORS = ['#2563eb', '#f43f5e', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4'];
const DOMAINS = ['cuanflix.site', 'link.cuanflix.site', 'cdn.cuanflix.site', 'go.cuanflix.site'];

// ─── FAQ Item ──────────────────────────────────────────────────────────────────

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div 
      style={{ borderBottom: '1px solid var(--border-subtle)', padding: '1.25rem 0', cursor: 'pointer' }}
      onClick={() => setOpen(!open)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--text-main)' }}>{q}</span>
        {open 
          ? <ChevronUp size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> 
          : <ChevronDown size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        }
      </div>
      {open && (
        <p style={{ marginTop: '0.85rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.65 }}>
          {a}
        </p>
      )}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

export const LandingView = ({ onNavigate, links = [], analyticsLogs = [], domains = [] }) => {
  const [lang, setLang] = useState('ID');
  const [langOpen, setLangOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const domainOptions = useMemo(() => {
    if (domains && domains.length > 0) {
      return domains.map(d => d.domainName || d.domain || d);
    }
    return DOMAINS;
  }, [domains]);

  const showcaseLinks = useMemo(() => getPublicShowcaseLinks(), [links]);

  const [domain, setDomain] = useState(domainOptions[0] || DOMAINS[0]);

  useEffect(() => {
    if (domainOptions.length > 0 && !domainOptions.includes(domain)) {
      setDomain(domainOptions[0]);
    }
  }, [domainOptions]);
  const [shortCode, setShortCode] = useState('wV62lQ');
  const [videoMode, setVideoMode] = useState(false);
  const [addMp4, setAddMp4] = useState(false);
  const [isBulk, setIsBulk] = useState(false);
  const [directLink, setDirectLink] = useState('');
  const [videoOverlay, setVideoOverlay] = useState(true);

  const [redirectMode, setRedirectMode] = useState('click'); // 'auto' | 'click' | 'direct'
  const [redirectDelay, setRedirectDelay] = useState(2);
  const [generatedResults, setGeneratedResults] = useState([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrModalUrl, setQrModalUrl] = useState('');

  // Lock body scroll when mobile landing drawer is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);

  const t = T[lang];

  const stats = useMemo(() => {
    const totalLinks = links.length;
    const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const recentIps = new Set(
      analyticsLogs
        .filter(l => new Date(l.timestamp).getTime() > cutoff)
        .map(l => l.ip)
    );
    const fmt = (n) => n.toLocaleString(lang === 'ID' ? 'id-ID' : 'en-US');
    return [
      { label: t.statLinks, value: fmt(totalLinks) },
      { label: t.statClicks, value: fmt(totalClicks) },
      { label: t.statActive, value: fmt(recentIps.size) },
    ];
  }, [links, analyticsLogs, lang]);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setShortCode(result);
  };

  const handleShorten = () => {
    const input = urlInput.trim();
    if (!input) return;

    const lines = isBulk ? input.split('\n').filter(l => l.trim()) : [input];
    const newItems = lines.map((targetUrl, idx) => {
      const alias = (lines.length === 1 && shortCode.trim())
        ? shortCode.trim()
        : Math.random().toString(36).substring(2, 8);
      const fullUrl = `https://${domain}/${alias}${addMp4 ? '.mp4' : ''}`;
      return {
        id: `gen_${Date.now()}_${idx}`,
        shortUrl: fullUrl,
        targetUrl,
        alias,
        domain,
        redirectMode,
        redirectDelay,
        addMp4,
        createdAt: new Date().toISOString()
      };
    });

    setGeneratedResults(newItems);
  };

  const handleCopyAll = () => {
    const text = generatedResults.map(item => item.shortUrl).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-body)' }}>

      {/* ── Mobile Slide-Out Sidebar Drawer for Landing Page ───────────────── */}
      <div 
        className={`mobile-slide-backdrop ${mobileNavOpen ? 'open' : ''}`}
        onClick={() => setMobileNavOpen(false)}
      />

      <aside className={`mobile-slide-drawer ${mobileNavOpen ? 'open' : ''}`}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div className="neu-logo-box" style={{ width: '36px', height: '36px', borderRadius: '10px', padding: '2px', flexShrink: 0 }}>
                <img src={logoImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
              </div>
              <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.03em' }}>
                D <span style={{ color: 'var(--primary)' }}>shortlink</span>
              </span>
            </div>
            <button 
              onClick={() => setMobileNavOpen(false)} 
              className="btn btn-ghost btn-sm"
              style={{ width: '32px', height: '32px', padding: 0 }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button 
              className="btn btn-primary" 
              style={{ padding: '0.75rem', fontSize: '0.9rem', width: '100%', fontWeight: 800 }}
              onClick={() => { onNavigate('tautan'); setMobileNavOpen(false); }}
            >
              <Plus size={16} />
              <span>{t.login} / Dashboard</span>
            </button>

            <button 
              className="btn btn-ghost" 
              style={{ padding: '0.75rem', fontSize: '0.9rem', width: '100%', justifyContent: 'flex-start', fontWeight: 700 }}
              onClick={() => { onNavigate('create_link'); setMobileNavOpen(false); }}
            >
              <Link2 size={16} style={{ color: 'var(--primary)' }} />
              <span>Buat Tautan Cepat</span>
            </button>

            <button 
              className="btn btn-ghost" 
              style={{ padding: '0.75rem', fontSize: '0.9rem', width: '100%', justifyContent: 'flex-start', fontWeight: 700 }}
              onClick={() => { onNavigate('simulator'); setMobileNavOpen(false); }}
            >
              <Play size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span>Test Router Simulator</span>
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Pilih Bahasa</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className={`btn ${lang === 'ID' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.825rem' }}
              onClick={() => setLang('ID')}
            >
              Indonesia
            </button>
            <button 
              className={`btn ${lang === 'EN' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.825rem' }}
              onClick={() => setLang('EN')}
            >
              English
            </button>
          </div>
        </div>
      </aside>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div className="neu-logo-box" style={{ width: '34px', height: '34px', borderRadius: '10px', padding: '2px', overflow: 'hidden' }}>
            <img src={logoImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} loading="eager" decoding="sync" />
          </div>
          <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.03em' }}>
            D <span style={{ color: 'var(--primary)' }}>shortlink</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="btn btn-ghost" style={{ padding: '0.5rem 0.85rem', fontSize: '0.875rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} onClick={() => onNavigate('api_docs')}>
            <Braces size={16} style={{ color: 'var(--primary)' }} />
            <span>API</span>
          </button>

          <button className="btn btn-ghost" style={{ padding: '0.5rem 0.85rem', fontSize: '0.875rem', fontWeight: 700 }} onClick={() => onNavigate('tautan')}>
            {t.login}
          </button>

          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-ghost"
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.825rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              onClick={() => setLangOpen(o => !o)}
            >
              {lang}
              <ChevronDown size={13} style={{ transition: 'transform 0.15s', transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            {langOpen && (
              <div className="neu-panel" style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', minWidth: '90px', padding: '0.4rem', zIndex: 100 }}>
                {['ID', 'EN'].map(l => (
                  <button key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                    style={{ 
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '0.5rem 0.75rem', fontSize: '0.825rem', fontWeight: 800,
                      background: lang === l ? 'var(--primary)' : 'none',
                      color: lang === l ? '#fff' : 'var(--text-main)',
                      border: 'none', cursor: 'pointer', borderRadius: '6px',
                    }}
                  >
                    {l === 'ID' ? 'ID' : 'EN'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hamburger Menu Toggle for Mobile */}
          <button 
            onClick={() => setMobileNavOpen(true)}
            className="btn btn-ghost btn-sm mobile-hamburger-btn"
            style={{ width: '38px', height: '38px', padding: 0 }}
            aria-label="Buka Menu Sidebar"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="landing-hero">
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '1rem' }}>
          {t.heroTitle1}<br />
          <span style={{ color: 'var(--primary)' }}>{t.heroTitle2}</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.65, maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          {t.heroSub}
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
          {stats.map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.07em', marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Builder Widget */}
        <div className="neu-panel landing-widget-panel">
          <div style={{ fontWeight: 900, fontSize: '1rem', marginBottom: '1.25rem' }}>
            {videoMode ? t.widgetTitleVideo : t.widgetTitleRedirect}
          </div>

          {/* Redirect / Video toggle */}
          <div className="neu-panel-inset" style={{ display: 'flex', gap: '0.4rem', padding: '0.35rem', marginBottom: '1.25rem' }}>
            <button type="button" onClick={() => { setVideoMode(false); setIsBulk(false); }}
              className={`btn ${!videoMode ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, padding: '0.65rem', fontSize: '0.875rem' }}
            >
              <Link2 size={15} /> Redirect
            </button>
            <button type="button" onClick={() => { setVideoMode(true); setIsBulk(false); }}
              className={`btn ${videoMode ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, padding: '0.65rem', fontSize: '0.875rem' }}
            >
              Video
            </button>
          </div>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '1rem' }}>
            {videoMode ? t.subVideo : t.subRedirect}
          </p>

          {/* Bulk toggle */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.85rem' }}>
            {(videoMode ? [t.tabOneV, t.tabBulkV] : [t.tabOne, t.tabBulk]).map((opt, i) => (
              <button key={opt} type="button" onClick={() => setIsBulk(i === 1)}
                style={{ 
                  fontSize: '0.825rem', fontWeight: 800, padding: '0.2rem 0',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: i === (isBulk ? 1 : 0) ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom: i === (isBulk ? 1 : 0) ? '2px solid var(--primary)' : '2px solid transparent'
                }}
              >{opt}</button>
            ))}
          </div>

          {/* URL Input */}
          {isBulk ? (
            <textarea className="form-control" rows={4} style={{ marginBottom: '1rem', fontSize: '0.9rem' }}
              placeholder={videoMode ? t.placeholderBulkVideo : t.placeholderBulkRedirect}
              value={urlInput} onChange={e => setUrlInput(e.target.value)}
            />
          ) : (
            <input type="url" className="form-control" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}
              placeholder={videoMode ? t.placeholderVideo : t.placeholderRedirect}
              value={urlInput} onChange={e => setUrlInput(e.target.value)}
            />
          )}

          {/* Domain + ShortCode + Submit */}
          <div className="landing-widget-row">
            <select className="form-control" value={domain} onChange={e => setDomain(e.target.value)} style={{ maxWidth: '150px', fontSize: '0.875rem' }}>
              {domainOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <span style={{ color: 'var(--text-dim)', fontWeight: 700 }}>/</span>
            <div style={{ flex: 1, position: 'relative' }}>
              <input type="text" className="form-control" value={shortCode} onChange={e => setShortCode(e.target.value)}
                style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)', paddingRight: '2.5rem' }}
              />
              <button type="button" onClick={generateCode} title={t.genCodeTitle}
                style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.2rem' }}
              >
                <RefreshCw size={13} />
              </button>
            </div>
            <button onClick={handleShorten} className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem', fontWeight: 800, flexShrink: 0 }}>
              {videoMode ? t.btnCreate : t.btnShorten}
            </button>
          </div>

          {/* Video extra fields */}
          {videoMode && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{t.directLinkLabel}</label>
                <input type="url" className="form-control" placeholder="https://..." style={{ fontSize: '0.875rem', marginBottom: '0.3rem' }} value={directLink} onChange={e => setDirectLink(e.target.value)} />
                <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.directLinkHint}</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div className="neu-panel-inset" style={{ display: 'flex', gap: '0.4rem', padding: '0.3rem' }}>
                  <button type="button" onClick={() => setVideoOverlay(true)} className={`btn ${videoOverlay ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, padding: '0.55rem', fontSize: '0.825rem' }}>{t.overlayMode}</button>
                  <button type="button" onClick={() => setVideoOverlay(false)} className={`btn ${!videoOverlay ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, padding: '0.55rem', fontSize: '0.825rem' }}>{t.redirectMode}</button>
                </div>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginTop: '0.35rem' }}>
                  {videoOverlay ? t.overlayHint : t.redirectHint}
                </span>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" checked={addMp4} onChange={e => setAddMp4(e.target.checked)} />
                {t.addMp4}
              </label>
            </>
          )}

          {/* Redirect extra fields */}
          {!videoMode && (
            <div style={{ marginTop: '1rem', borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.75rem' }}>
              {/* Redirect Mode Selection Cards */}
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Mode Pengalihan</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {/* Option 1: Landing Page */}
                  <button
                    type="button"
                    onClick={() => setRedirectMode('click')}
                    style={{
                      flex: 1, padding: '0.65rem 0.5rem', borderRadius: '10px', border: 'none',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      background: redirectMode === 'click'
                        ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                        : 'var(--neu-bg)',
                      color: redirectMode === 'click' ? '#fff' : 'var(--text-primary)',
                      boxShadow: redirectMode === 'click'
                        ? '0 4px 14px rgba(37,99,235,0.4)'
                        : '4px 4px 8px var(--neu-shadow-dark),-4px -4px 8px var(--neu-shadow-light)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>🃏</div>
                    <div style={{ fontWeight: 800, fontSize: '0.825rem' }}>Landing Page</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.85, marginTop: '0.1rem' }}>
                      Ada kartu iklan & tombol lanjutkan
                    </div>
                  </button>

                  {/* Option 2: Langsung */}
                  <button
                    type="button"
                    onClick={() => setRedirectMode('auto')}
                    style={{
                      flex: 1, padding: '0.65rem 0.5rem', borderRadius: '10px', border: 'none',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      background: redirectMode === 'auto'
                        ? 'linear-gradient(135deg, #059669, #047857)'
                        : 'var(--neu-bg)',
                      color: redirectMode === 'auto' ? '#fff' : 'var(--text-primary)',
                      boxShadow: redirectMode === 'auto'
                        ? '0 4px 14px rgba(5,150,105,0.4)'
                        : '4px 4px 8px var(--neu-shadow-dark),-4px -4px 8px var(--neu-shadow-light)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>⚡</div>
                    <div style={{ fontWeight: 800, fontSize: '0.825rem' }}>Langsung</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.85, marginTop: '0.1rem' }}>
                      Iklan termuat & auto-redirect
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Generated Results Container */}
          {generatedResults.length > 0 && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '2px solid var(--border-subtle)', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Check size={16} style={{ color: 'var(--accent-emerald)' }} /> Tautan Berhasil Dibuat!
                </span>

                {generatedResults.length > 1 && (
                  <button
                    onClick={handleCopyAll}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.775rem', fontWeight: 800 }}
                  >
                    {copiedAll ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedAll ? 'Semua Tersalin!' : 'Salin Semua Tautan'}</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {generatedResults.map(item => (
                  <div key={item.id} className="neu-panel-inset" style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ overflow: 'hidden', flex: 1, minWidth: '180px' }}>
                      <a href={item.shortUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--primary)', textDecoration: 'none', display: 'block', wordBreak: 'break-all' }}>
                        {item.shortUrl}
                      </a>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Tujuan: {item.targetUrl}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', shrink: 0 }}>
                      <button
                        onClick={() => handleCopySingle(item.id, item.shortUrl)}
                        className="btn btn-sm"
                        style={{ padding: '0.45rem 0.65rem', fontSize: '0.75rem' }}
                        title="Salin Link"
                      >
                        {copiedId === item.id ? <Check size={13} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={13} />}
                      </button>

                      <button
                        onClick={() => { setQrModalUrl(item.shortUrl); setQrModalOpen(true); }}
                        className="btn btn-sm"
                        style={{ padding: '0.45rem 0.65rem', fontSize: '0.75rem' }}
                        title="Tampilkan QR Code"
                      >
                        <QrCode size={13} style={{ color: 'var(--primary)' }} />
                      </button>

                      <button
                        onClick={() => onNavigate('create_link')}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '0.45rem 0.65rem', fontSize: '0.75rem', fontWeight: 800 }}
                        title="Buka Editor Aturan Lengkap"
                      >
                        Edit Aturan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p style={{ marginTop: '1.5rem', fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.tagline}</p>

        {/* Native Ad Banner */}
        <NativeAdBanner style={{ marginTop: '2rem' }} />
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="landing-section">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>{t.howTitle}</h2>
        <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2.5rem' }}>{t.howSub}</p>
        <div className="landing-steps-grid">
          {t.steps.map(step => (
            <div key={step.num} className="neu-panel" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>{step.num}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>{step.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="landing-section">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>{t.featTitle}</h2>
        <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2.5rem' }}>{t.featSub}</p>
        <div className="landing-features-grid">
          {t.features.map((feat, i) => {
            const Icon = FEATURE_ICONS[i];
            const color = FEATURE_COLORS[i];
            return (
              <div key={feat.title} className="neu-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.925rem', fontWeight: 800, marginBottom: '0.4rem' }}>{feat.title}</h3>
                  <p style={{ fontSize: '0.845rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.6 }}>{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="landing-section-narrow">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>{t.faqTitle}</h2>
        <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2rem' }}>{t.faqSub}</p>
        <div>
          {t.faqs.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="landing-section" style={{ textAlign: 'center' }}>
        <div className="neu-panel" style={{ padding: '3.5rem 2rem', background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>{t.ctaTitle}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600, lineHeight: 1.65, maxWidth: '480px', margin: '0 auto 2rem' }}>{t.ctaSub}</p>
          <button onClick={() => onNavigate('tautan')} className="btn btn-primary"
            style={{ padding: '0.9rem 2.25rem', fontSize: '1rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {t.ctaBtn} <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span style={{ fontWeight: 900, fontSize: '0.95rem' }}>D <span style={{ color: 'var(--primary)' }}>shortlink</span></span>
          {t.footerLinks.map(link => (
            <a key={link} href="#" style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)', textDecoration: 'none' }}>{link}</a>
          ))}
        </div>
        <p style={{ fontSize: '0.775rem', color: 'var(--text-dim)', fontWeight: 600 }}>{t.footerTagline}</p>
      </footer>

      <QrCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        url={qrModalUrl}
      />
    </div>
  );
};
