import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  FileText, 
  Trash2, 
  Edit3, 
  Code, 
  Eye, 
  ArrowLeft,
  Check,
  Globe
} from 'lucide-react';
import { Header } from '../layout/Header';

export const PagesView = ({ 
  pages, 
  onSavePage, 
  onDeletePage, 
  onOpenCreateModal, 
  currentRoute,
  onNavigate
}) => {
  const isEditorPage = currentRoute === 'create_page';

  // Editor Form State
  const [pageToEdit, setPageToEdit] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [htmlContent, setHtmlContent] = useState('');

  // Default HTML Template
  const defaultTemplate = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page Perangkap Bot</title>
  <style>
    body { font-family: sans-serif; background: #f8fafc; color: #1e293b; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #ffffff; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); text-align: center; max-width: 420px; }
    h1 { font-size: 1.5rem; margin-bottom: 0.75rem; color: #0f172a; }
    p { color: #64748b; font-size: 0.9rem; line-height: 1.6; }
    .btn { display: inline-block; margin-top: 1.25rem; background: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Halaman Selamat Datang</h1>
    <p>Terima kasih telah mengunjungi halaman kami. Silakan klik tombol di bawah untuk melanjutkan.</p>
    <a href="#" class="btn">Lanjutkan Ke Konten</a>
  </div>
</body>
</html>`;

  const handleOpenEditor = (page = null) => {
    if (page) {
      setPageToEdit(page);
      setName(page.name || '');
      setSlug(page.slug || '');
      setHtmlContent(page.htmlContent || defaultTemplate);
    } else {
      setPageToEdit(null);
      setName('');
      setSlug(`page-${Date.now().toString().slice(-4)}`);
      setHtmlContent(defaultTemplate);
    }
    onNavigate('create_page');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const pageData = {
      id: pageToEdit ? pageToEdit.id : `page_${Date.now()}`,
      name: name || 'Halaman Landing Baru',
      slug: slug || `page-${Date.now()}`,
      htmlContent,
      createdAt: pageToEdit ? pageToEdit.createdAt : new Date().toISOString()
    };
    onSavePage(pageData);
    onNavigate('halaman');
  };

  // If route is /pages/editor, render the full page HTML editor!
  if (isEditorPage) {
    return (
      <div>
        <div style={{ marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', marginBottom: '0.15rem', lineHeight: 1.25 }}>
              {pageToEdit ? 'Edit Halaman Landing' : 'Buat Halaman Landing Baru'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
              Tulis kode HTML/CSS kustom dan langsung lihat pratinjau live di sebelah kanan
            </p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="neu-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="responsive-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Nama Halaman *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Halaman Perangkap Bot Facebook" 
                  className="form-control" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Slug *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="bot-trap-fb" 
                  className="form-control" 
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Split Screen Editor & Live Preview */}
          <div className="responsive-editor-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* HTML Editor Panel */}
            <div className="neu-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Code size={16} style={{ color: 'var(--primary)' }} /> Editor Kode HTML/CSS
                </span>
              </div>
              <textarea 
                className="form-control"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', minHeight: '380px', flex: 1, resize: 'vertical' }}
                value={htmlContent}
                onChange={e => setHtmlContent(e.target.value)}
              />
            </div>

            {/* Live Preview Panel */}
            <div className="neu-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Eye size={16} style={{ color: 'var(--accent-emerald)' }} /> Pratinjau Live Halaman
                </span>
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                  <Globe size={10} /> Interactive Preview
                </span>
              </div>

              <div className="neu-panel-inset" style={{ flex: 1, minHeight: '380px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#ffffff' }}>
                <iframe 
                  title="Live HTML Preview"
                  srcDoc={htmlContent}
                  style={{ width: '100%', height: '100%', border: 'none', background: '#ffffff' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => onNavigate('halaman')} className="btn btn-ghost">
              Batal
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2.25rem' }}>
              <Check size={16} />
              <span>{pageToEdit ? 'Simpan Perubahan' : 'Simpan Halaman'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Main Pages List View (/pages)
  return (
    <div>
      <Header 
        title="Halaman Landing" 
        subtitle="Buat dan kelola template halaman HTML kustom untuk bot trap atau fallback"
        onOpenCreateModal={onOpenCreateModal}
      />

      {/* Primary Actions Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: 'normal' }}>Daftar Halaman Landing ({pages.length})</h2>
        </div>
        <button onClick={() => handleOpenEditor(null)} className="btn btn-primary">
          <Plus size={16} />
          <span>+ Buat Halaman Landing</span>
        </button>
      </div>

      {pages.length === 0 ? (
        <div className="neu-panel" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <div className="neu-panel-inset" style={{ width: '56px', height: '56px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
            <FileText size={24} />
          </div>
          <h3 style={{ marginBottom: '0.5rem', fontWeight: 800, letterSpacing: 'normal' }}>Belum Ada Halaman Landing</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem auto', fontSize: '0.875rem', fontWeight: 600 }}>
            Halaman landing kustom dapat dipakai sebagai perangkap bot atau halaman pengalihan khusus.
          </p>
          <button onClick={() => handleOpenEditor(null)} className="btn btn-primary">
            + Buat Halaman Landing Baru
          </button>
        </div>
      ) : (
        <div className="responsive-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {pages.map(page => (
            <div key={page.id} className="neu-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="neu-panel-inset" style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: 'normal', lineHeight: 1.25, marginBottom: '0.2rem', color: 'var(--text-main)' }}>
                        {page.name}
                      </h4>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                        /{page.slug}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Clean Iframe Thumbnail Box Without Scrollbars */}
                <div className="neu-panel-inset" style={{ 
                  height: '160px', 
                  overflow: 'hidden', 
                  margin: '1.1rem 0', 
                  borderRadius: 'var(--radius-md)',
                  position: 'relative',
                  background: '#ffffff'
                }}>
                  <iframe 
                    title={`Preview ${page.name}`}
                    srcDoc={page.htmlContent}
                    scrolling="no"
                    style={{ 
                      width: '200%', 
                      height: '200%', 
                      border: 'none', 
                      background: '#ffffff', 
                      pointerEvents: 'none', 
                      transform: 'scale(0.5)', 
                      transformOrigin: 'top left',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      overflow: 'hidden'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button 
                  onClick={() => handleOpenEditor(page)}
                  className="btn btn-sm"
                >
                  <Edit3 size={14} />
                  <span>Edit Kode</span>
                </button>
                <button 
                  onClick={() => onDeletePage(page.id)}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
