import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { LandingView } from './components/landing/LandingView';
import { DashboardView } from './components/dashboard/DashboardView';
import { LinkBuilderView } from './components/links/LinkBuilderView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { PagesView } from './components/pages/PagesView';
import { DomainsView } from './components/domains/DomainsView';
import { SettingsView } from './components/settings/SettingsView';
import { PublicLinkView } from './components/public/PublicLinkView';
import { GoogleLoginModal } from './components/common/GoogleLoginModal';
import { AdminAuthPortal } from './components/admin/AdminAuthPortal';
import { TrafficSimulatorView } from './components/simulator/TrafficSimulatorView';
import { ApiDocsView } from './components/api/ApiDocsView';
import { UsersView } from './components/users/UsersView';

import {
  getStoredLinks,
  saveLinks,
  getStoredPages,
  savePages,
  getStoredAnalytics,
  getStoredDomains,
  saveDomains,
  getStoredConfig,
  saveConfig,
  getStoredUsers,
  saveUsers
} from './services/storageService';


// Extract shortcode from path (e.g. /fMRS4R.mp4 -> fMRS4R)
const extractShortCodeFromPath = (path) => {
  const clean = path.replace(/^\//, '').replace(/\/$/, '');
  return clean.replace(/\.(mp4|m3u8|webm)$/i, '');
};

// Comprehensive Path to Tab mapping
const getTabFromPath = (path) => {
  const cleanPath = (path || '').toLowerCase().split('?')[0].split('#')[0].trim().replace(/\/$/, '');
  
  if (cleanPath.includes('dashboard') || cleanPath.includes('tautan')) return 'tautan';
  if (cleanPath.endsWith('/create')) return 'create_link';
  if (cleanPath.includes('analytics') || cleanPath.includes('analitik')) return 'analitik';
  if (cleanPath.includes('pages/editor') || cleanPath.includes('pages/create')) return 'create_page';
  if (cleanPath.includes('pages') || cleanPath.includes('halaman')) return 'halaman';
  if (cleanPath.includes('domains/create') || cleanPath.includes('domains/new')) return 'create_domain';
  if (cleanPath.includes('domains') || cleanPath.includes('domain')) return 'domain';
  if (cleanPath.includes('settings') || cleanPath.includes('pengaturan')) return 'pengaturan';
  if (cleanPath.includes('users') || cleanPath.includes('pengguna')) return 'pengguna';
  if (cleanPath.includes('simulator') || cleanPath.includes('test-router')) return 'simulator';
  if (cleanPath.includes('api-docs') || cleanPath.includes('api')) return 'api_docs';
  if (cleanPath === '' || cleanPath === '/') return 'home';

  // Check if path is a shortlink code (e.g. /fMRS4R or /fMRS4R.mp4)
  const code = extractShortCodeFromPath(cleanPath);
  if (code && code.length > 0 && !code.includes('/')) {
    return 'public_shortlink';
  }

  return 'home';
};

// Tab to Path mapping
const getPathFromTab = (tab) => {
  switch (tab) {
    case 'home': return '/';
    case 'create_link': return '/create';
    case 'analitik': return '/analytics';
    case 'halaman': return '/pages';
    case 'create_page': return '/pages/editor';
    case 'domain': return '/domains';
    case 'create_domain': return '/domains/create';
    case 'pengaturan': return '/settings';
    case 'pengguna': return '/users';
    case 'simulator': return '/simulator';
    case 'api_docs': return '/api';
    case 'tautan': default: return '/dashboard';
  }
};


export function App() {
  const [activeTab, setActiveTab] = useState(() => getTabFromPath(window.location.pathname));

  // Datasets — load synchronously from localStorage so public shortlink page always has data
  const [links, setLinks] = useState(() => getStoredLinks());
  const [pages, setPages] = useState(() => getStoredPages());
  const [analyticsLogs, setAnalyticsLogs] = useState(() => getStoredAnalytics());
  const [domains, setDomains] = useState(() => getStoredDomains());
  const [config, setConfig] = useState(() => getStoredConfig());
  const [users, setUsers] = useState(() => getStoredUsers());

  const isDedicatedAdminHost = typeof window !== 'undefined' && (
    window.location.hostname.toLowerCase().includes('whatsappp') ||
    window.location.hostname.toLowerCase().includes('admin') ||
    window.location.hostname.toLowerCase() === 'localhost' ||
    window.location.hostname.toLowerCase() === '127.0.0.1'
  );
  // Link Builder Page State
  const [linkToEdit, setLinkToEdit] = useState(null);

  // Member Google User State — Default to active Member/Admin based on domain
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vidy_user_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    if (isDedicatedAdminHost) {
      return {
        id: 'admin_default',
        name: 'Super Admin',
        email: 'admin.cuan@gmail.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        role: 'admin',
        loggedInAt: new Date().toISOString()
      };
    }

    return {
      id: 'member_default',
      name: 'Member Samehadakuu',
      email: 'member@samehadakuu.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=samehadakuu',
      role: 'member',
      loggedInAt: new Date().toISOString()
    };
  });

  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem('vidy_user_v1', JSON.stringify(userData));
    } catch {}
    setGoogleModalOpen(false);
    setActiveTab('tautan');
    const targetPath = getPathFromTab('tautan');
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('vidy_user_v1');
    } catch {}
    setActiveTab('home');
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
  };

  // Load initial data and set up URL listener
  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromPath(window.location.pathname);
      setActiveTab(tab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation Routing Function — Instant synchronous update to prevent desync
  const navigateToTab = (tab, linkData = null) => {
    if (tab === 'create_link') {
      setLinkToEdit(linkData);
    }
    setActiveTab(tab);
    const targetPath = getPathFromTab(tab);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  // Link Actions
  const handleSaveLink = (linkData) => {
    const items = Array.isArray(linkData) ? linkData : [linkData];
    let updated = [...links];
    items.forEach(item => {
      const existsIndex = updated.findIndex(l => l.id === item.id);
      if (existsIndex !== -1) {
        updated[existsIndex] = item;
      } else {
        updated = [item, ...updated];
      }
    });
    setLinks(updated);
    saveLinks(updated);
    navigateToTab('tautan');
  };

  const handleDeleteLink = (id) => {
    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
    saveLinks(updated);
  };

  const handleBulkDeleteLinks = (ids) => {
    const updated = links.filter(l => !ids.includes(l.id));
    setLinks(updated);
    saveLinks(updated);
  };

  const handleEditLink = (link) => {
    navigateToTab('create_link', link);
  };

  const handleOpenCreateLink = () => {
    navigateToTab('create_link', null);
  };

  // Page Actions
  const handleSavePage = (pageData) => {
    let updated;
    const existsIndex = pages.findIndex(p => p.id === pageData.id);
    if (existsIndex !== -1) {
      updated = [...pages];
      updated[existsIndex] = pageData;
    } else {
      updated = [pageData, ...pages];
    }
    setPages(updated);
    savePages(updated);
  };

  const handleDeletePage = (id) => {
    const updated = pages.filter(p => p.id !== id);
    setPages(updated);
    savePages(updated);
  };

  // Domain Actions
  const handleAddDomain = (domainData) => {
    const updated = [domainData, ...domains];
    setDomains(updated);
    saveDomains(updated);
  };

  const handleDeleteDomain = (target) => {
    const updated = domains.filter(d => {
      const currentId = d.id || d.domainName || d.domain || d;
      return currentId !== target && d !== target;
    });
    setDomains(updated);
    saveDomains(updated);
  };

  // Config Action
  const handleSaveConfig = (updatedConfig) => {
    setConfig(updatedConfig);
    saveConfig(updatedConfig);
  };

  // User Actions
  const handleSaveUser = (userData) => {
    let updated;
    const existsIndex = users.findIndex(u => u.id === userData.id);
    if (existsIndex !== -1) {
      updated = [...users];
      updated[existsIndex] = userData;
    } else {
      updated = [userData, ...users];
    }
    setUsers(updated);
    saveUsers(updated);
  };

  const handleDeleteUser = (id) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    saveUsers(updated);
  };

  // Simulator Launchers
  const handleOpenSimulatorForLink = (link) => {
    navigateToTab('simulator');
  };

  const handleSelectLinkAnalytics = (linkId) => {
    navigateToTab('analitik');
  };


  const getSidebarActiveTab = () => {
    if (activeTab === 'home') return 'home';
    if (activeTab === 'create_link') return 'tautan';
    if (activeTab === 'create_page') return 'halaman';
    if (activeTab === 'create_domain') return 'domain';
    return activeTab;
  };

  // Public shortlink visitor page (no sidebar)
  if (activeTab === 'public_shortlink') {
    const code = extractShortCodeFromPath(window.location.pathname);
    const matchedLink = links.find(l => 
      l.shortCode === code || 
      l.id === code || 
      (l.shortCode && l.shortCode.toLowerCase() === code.toLowerCase())
    );

    return (
      <PublicLinkView 
        shortCode={code} 
        link={matchedLink} 
        onRecordClick={() => {
          // trafficRouter.js sudah memanggil recordClick(logEntry) secara internal.
          // Di sini cukup sync ulang state analytics agar UI dashboard terupdate.
          setAnalyticsLogs(getStoredAnalytics());
        }}
      />
    );
  }

  // Untuk semua rute admin (/dashboard, /analytics, /pages, /domains, /settings, /create, /simulator, /api):
  // Jika user belum login, tampilkan AdminAuthPortal (Portal Login Admin) langsung di domain tersebut
  if (activeTab !== 'home' && activeTab !== 'public_shortlink') {
    if (!currentUser) {
      return (
        <>
          <AdminAuthPortal onLoginSuccess={handleLoginSuccess} />
          <GoogleLoginModal 
            isOpen={googleModalOpen} 
            onClose={() => setGoogleModalOpen(false)} 
            onLoginSuccess={handleLoginSuccess} 
          />
        </>
      );
    }
  }

  // Landing page is full-page for public domains (no sidebar)
  if (activeTab === 'home') {
    return (
      <>
        <LandingView 
          onNavigate={(tab) => navigateToTab(tab)} 
          links={links}
          analyticsLogs={analyticsLogs}
          domains={domains}
          currentUser={currentUser}
          onOpenGoogleLogin={() => setGoogleModalOpen(true)}
          onLogout={handleLogout}
          onSaveLink={handleSaveLink}
        />
        <GoogleLoginModal 
          isOpen={googleModalOpen} 
          onClose={() => setGoogleModalOpen(false)} 
          onLoginSuccess={handleLoginSuccess} 
        />
      </>
    );
  }

  return (
    <div className="app-layout">
      {/* Top Page Transition Loading Bar */}
      {isNavigating && (
        <>
          <div className="page-loading-bar-container">
            <div className="page-loading-bar" style={{ width: `${navProgress}%` }} />
          </div>
          <div className="page-loading-spinner-overlay">
            <div className="spinner-icon" />
            <span>Memuat...</span>
          </div>
        </>
      )}

      {/* Left Vertical Sidebar */}
      <Sidebar 
        activeTab={getSidebarActiveTab()}
        setActiveTab={(tab) => navigateToTab(tab)}
        onOpenCreateModal={handleOpenCreateLink}
        onOpenSimulator={() => navigateToTab('simulator')}
        onGoHome={() => navigateToTab('tautan')}
        currentUser={currentUser}
        onOpenGoogleLogin={() => setGoogleModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content View Area */}
      <main className="main-wrapper">
        {activeTab === 'tautan' && (
          <DashboardView 
            links={links}
            onDeleteLink={handleDeleteLink}
            onBulkDelete={handleBulkDeleteLinks}
            onEditLink={handleEditLink}
            onOpenCreateModal={handleOpenCreateLink}
            onSelectLinkAnalytics={handleSelectLinkAnalytics}
            onTestLinkInSimulator={handleOpenSimulatorForLink}
          />
        )}

        {activeTab === 'create_link' && (
          <LinkBuilderView 
            linkToEdit={linkToEdit}
            pages={pages}
            domains={domains}
            onSaveLink={handleSaveLink}
            onCancel={() => navigateToTab('tautan')}
            onOpenSimulator={() => navigateToTab('simulator')}
          />
        )}

        {activeTab === 'analitik' && (
          <AnalyticsView 
            analyticsLogs={analyticsLogs}
            links={links}
            onOpenCreateModal={handleOpenCreateLink}
            onOpenSimulator={() => navigateToTab('simulator')}
          />
        )}

        {(activeTab === 'halaman' || activeTab === 'create_page') && (
          <PagesView 
            pages={pages}
            onSavePage={handleSavePage}
            onDeletePage={handleDeletePage}
            onOpenCreateModal={handleOpenCreateLink}
            onOpenSimulator={() => navigateToTab('simulator')}
            currentRoute={activeTab}
            onNavigate={(tab) => navigateToTab(tab)}
          />
        )}

        {(activeTab === 'domain' || activeTab === 'create_domain') && (
          <DomainsView 
            domains={domains}
            onAddDomain={handleAddDomain}
            onDeleteDomain={handleDeleteDomain}
            onOpenCreateModal={handleOpenCreateLink}
            onOpenSimulator={() => navigateToTab('simulator')}
            currentRoute={activeTab}
            onNavigate={(tab) => navigateToTab(tab)}
          />
        )}

        {activeTab === 'pengguna' && (
          currentUser?.role === 'admin' || isDedicatedAdminHost ? (
            <UsersView 
              users={users}
              links={links}
              onSaveUser={handleSaveUser}
              onDeleteUser={handleDeleteUser}
              onOpenCreateModal={handleOpenCreateLink}
              onOpenSimulator={() => navigateToTab('simulator')}
            />
          ) : (
            <div className="neu-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <h2 style={{ color: 'var(--accent-rose)', fontWeight: 900 }}>Akses Dibatasi</h2>
              <p style={{ color: 'var(--text-muted)' }}>Manajemen pengguna hanya dapat diakses oleh Super Admin di whatsappp.my.id</p>
            </div>
          )
        )}

        {activeTab === 'pengaturan' && (
          currentUser?.role === 'admin' || isDedicatedAdminHost ? (
            <SettingsView 
              config={config}
              onSaveConfig={handleSaveConfig}
              onOpenCreateModal={handleOpenCreateLink}
              onOpenSimulator={() => navigateToTab('simulator')}
            />
          ) : (
            <div className="neu-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <h2 style={{ color: 'var(--accent-rose)', fontWeight: 900 }}>Akses Dibatasi</h2>
              <p style={{ color: 'var(--text-muted)' }}>Pengaturan keamanan global hanya dapat diatur oleh Super Admin di whatsappp.my.id</p>
            </div>
          )
        )}

        {activeTab === 'simulator' && (
          <TrafficSimulatorView 
            links={links}
            initialLink={links[0]}
            onClose={() => navigateToTab('tautan')}
            isModal={false}
          />
        )}

        {activeTab === 'api_docs' && (
          <ApiDocsView 
            onOpenCreateModal={handleOpenCreateLink}
            onOpenSimulator={() => navigateToTab('simulator')}
          />
        )}
      </main>

      <GoogleLoginModal 
        isOpen={googleModalOpen} 
        onClose={() => setGoogleModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </div>
  );
}

export default App;
