import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { LandingView } from './components/landing/LandingView';
import { DashboardView } from './components/dashboard/DashboardView';
import { LinkBuilderView } from './components/links/LinkBuilderView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { PagesView } from './components/pages/PagesView';
import { DomainsView } from './components/domains/DomainsView';
import { SettingsView } from './components/settings/SettingsView';
import { PublicLinkView } from './components/public/PublicLinkView';
import { LoginView } from './components/auth/LoginView';
import { AdminAuthPortal } from './components/admin/AdminAuthPortal';
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
  saveUsers,
  fetchAllFromCloud,
  STORAGE_KEYS
} from './services/storageService';


// Extract shortcode from path (e.g. /fMRS4R.mp4 -> fMRS4R)
const extractShortCodeFromPath = (path) => {
  const clean = path.replace(/^\//, '').replace(/\/$/, '');
  return clean.replace(/\.(mp4|m3u8|webm)$/i, '');
};

// Comprehensive Path to Tab mapping
const getTabFromPath = (path) => {
  const cleanPath = (path || '').toLowerCase().split('?')[0].split('#')[0].trim().replace(/\/$/, '');
  const host = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const isAdminDomain = host.includes('whatsappp') || host.includes('admin');
  
  if (cleanPath === 'login' || cleanPath === 'masuk') return 'login';
  if (cleanPath.includes('dashboard') || cleanPath.includes('tautan')) return 'tautan';
  if (cleanPath.endsWith('/create')) return 'create_link';
  if (cleanPath.includes('analytics') || cleanPath.includes('analitik')) return 'analitik';
  if (cleanPath.includes('pages/editor') || cleanPath.includes('pages/create')) return 'create_page';
  if (cleanPath.includes('pages') || cleanPath.includes('halaman')) return 'halaman';
  if (cleanPath.includes('domains/create') || cleanPath.includes('domains/new')) return 'create_domain';
  if (cleanPath.includes('domains') || cleanPath.includes('domain')) return 'domain';
  if (cleanPath.includes('settings') || cleanPath.includes('pengaturan')) return 'pengaturan';
  if (cleanPath.includes('users') || cleanPath.includes('pengguna')) return 'pengguna';
  if (cleanPath.includes('api-docs') || cleanPath.includes('api')) return 'api_docs';
  
  if (cleanPath === '' || cleanPath === '/') {
    // whatsappp.my.id adalah domain dedicated Admin, default ke Dashboard Admin
    if (isAdminDomain) {
      return 'tautan';
    }
    // samehadakuu.com adalah domain Member/Publik, default ke Landing Page
    return 'home';
  }

  // Check if path is a shortlink code (e.g. /fMRS4R or /fMRS4R.mp4)
  const code = extractShortCodeFromPath(cleanPath);
  if (code && code.length > 0 && !code.includes('/')) {
    return 'public_shortlink';
  }

  return isAdminDomain ? 'tautan' : 'home';
};

// Tab to Path mapping
const getPathFromTab = (tab) => {
  switch (tab) {
    case 'home': return '/';
    case 'login': return '/login';
    case 'create_link': return '/create';
    case 'analitik': return '/analytics';
    case 'halaman': return '/pages';
    case 'create_page': return '/pages/editor';
    case 'domain': return '/domains';
    case 'create_domain': return '/domains/create';
    case 'pengaturan': return '/settings';
    case 'pengguna': return '/users';
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

  // Member Google User State — Default to null (Wajib login) & 1 Hour Expiration khusus whatsappp.my.id
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vidy_user_v1');
      if (saved) {
        if (isDedicatedAdminHost) {
          const lastActive = Number(localStorage.getItem('vidy_last_active_v1')) || 0;
          const ONE_HOUR = 60 * 60 * 1000;
          if (Date.now() - lastActive > ONE_HOUR) {
            localStorage.removeItem('vidy_user_v1');
            localStorage.removeItem('vidy_last_active_v1');
            return null;
          }
        }
        return JSON.parse(saved);
      }
    } catch {}
    return null;
  });

  // 1-Hour Inactivity Auto Logout Listener — KHUSUS DOMAIN ADMIN (whatsappp.my.id)
  useEffect(() => {
    if (!currentUser || !isDedicatedAdminHost) return;

    const ONE_HOUR = 60 * 60 * 1000;
    
    const updateActivity = () => {
      try {
        localStorage.setItem('vidy_last_active_v1', Date.now().toString());
      } catch {}
    };

    updateActivity();

    // Listen to user interactions with throttle
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'mousemove'];
    let lastRecorded = Date.now();
    const handleUserActivity = () => {
      const now = Date.now();
      if (now - lastRecorded > 15000) { // update every 15 seconds on activity
        lastRecorded = now;
        updateActivity();
      }
    };

    events.forEach(event => window.addEventListener(event, handleUserActivity, { passive: true }));

    // Periodic check for 1-hour inactivity timeout (every 30 seconds)
    const checkInterval = setInterval(() => {
      try {
        const lastActive = Number(localStorage.getItem('vidy_last_active_v1')) || 0;
        if (Date.now() - lastActive > ONE_HOUR) {
          handleLogout();
          alert('Sesi Admin Anda telah berakhir karena tidak ada aktivitas selama 1 jam. Silakan login kembali.');
        }
      } catch {}
    }, 30000);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleUserActivity));
      clearInterval(checkInterval);
    };
  }, [currentUser, isDedicatedAdminHost]);

  // Cloud Synchronization Listener — Syncs with Neon Postgres on Vercel across samehadakuu.com and whatsappp.my.id
  useEffect(() => {
    let isMounted = true;
    const syncCloudData = async () => {
      try {
        const cloudData = await fetchAllFromCloud();
        if (cloudData && typeof cloudData === 'object' && isMounted) {
          if (cloudData[STORAGE_KEYS.LINKS] && Array.isArray(cloudData[STORAGE_KEYS.LINKS])) {
            setLinks(cloudData[STORAGE_KEYS.LINKS]);
            localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(cloudData[STORAGE_KEYS.LINKS]));
          }
          if (cloudData[STORAGE_KEYS.USERS] && Array.isArray(cloudData[STORAGE_KEYS.USERS])) {
            setUsers(cloudData[STORAGE_KEYS.USERS]);
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(cloudData[STORAGE_KEYS.USERS]));
          }
          if (cloudData[STORAGE_KEYS.PAGES] && Array.isArray(cloudData[STORAGE_KEYS.PAGES])) {
            setPages(cloudData[STORAGE_KEYS.PAGES]);
            localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(cloudData[STORAGE_KEYS.PAGES]));
          }
          if (cloudData[STORAGE_KEYS.DOMAINS] && Array.isArray(cloudData[STORAGE_KEYS.DOMAINS])) {
            setDomains(cloudData[STORAGE_KEYS.DOMAINS]);
            localStorage.setItem(STORAGE_KEYS.DOMAINS, JSON.stringify(cloudData[STORAGE_KEYS.DOMAINS]));
          }
          if (cloudData[STORAGE_KEYS.ANALYTICS] && Array.isArray(cloudData[STORAGE_KEYS.ANALYTICS])) {
            setAnalyticsLogs(cloudData[STORAGE_KEYS.ANALYTICS]);
            localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(cloudData[STORAGE_KEYS.ANALYTICS]));
          }
          if (cloudData[STORAGE_KEYS.CONFIG] && typeof cloudData[STORAGE_KEYS.CONFIG] === 'object') {
            setConfig(cloudData[STORAGE_KEYS.CONFIG]);
            localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(cloudData[STORAGE_KEYS.CONFIG]));
          }
        }
      } catch {}
    };

    syncCloudData();

    // Periodic sync every 8 seconds and on window focus/tab switch
    const interval = setInterval(syncCloudData, 8000);
    window.addEventListener('focus', syncCloudData);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', syncCloudData);
    };
  }, []);

  const isSuperAdmin = currentUser?.role === 'admin' || isDedicatedAdminHost || currentUser?.email?.toLowerCase() === 'ivankafipradana@gmail.com' || currentUser?.email?.toLowerCase() === 'admin.cuan@gmail.com';

  // Strict Privacy Isolation:
  // Admin sees ALL links across the entire platform.
  // Member ONLY sees their own links!
  const userLinks = useMemo(() => {
    if (isSuperAdmin) return links;
    if (!currentUser?.email) return [];
    const myEmail = currentUser.email.toLowerCase().trim();
    return links.filter(l => 
      (l.createdBy && l.createdBy.toLowerCase().trim() === myEmail) ||
      (l.userEmail && l.userEmail.toLowerCase().trim() === myEmail)
    );
  }, [links, isSuperAdmin, currentUser]);

  // Analytics Isolation: Member only sees click logs for their own links
  const userAnalytics = useMemo(() => {
    if (isSuperAdmin) return analyticsLogs;
    const myLinkIds = new Set(userLinks.map(l => l.id));
    return analyticsLogs.filter(log => myLinkIds.has(log.linkId));
  }, [analyticsLogs, isSuperAdmin, userLinks]);

  const handleLoginSuccess = (userData) => {
    // Di domain whatsappp.my.id, hanya role admin yang boleh masuk
    const userEmail = (userData.email || '').toLowerCase().trim();
    const isRegisteredAdmin = users.some(
      u => u.email?.toLowerCase() === userEmail && u.role === 'admin' && u.status === 'active'
    );
    const isKnownAdmin = isRegisteredAdmin || userEmail === 'ivankafipradana@gmail.com' || userEmail === 'admin.cuan@gmail.com' || userEmail.startsWith('admin');

    if (isDedicatedAdminHost && !isKnownAdmin) {
      alert(`Akses Ditolak: Akun "${userData.email}" bukan Administrator. Hanya akun Admin yang diizinkan masuk ke portal whatsappp.my.id.`);
      return false;
    }

    const finalUserData = {
      ...userData,
      role: isDedicatedAdminHost || isKnownAdmin ? 'admin' : (userData.role || 'member'),
      loggedInAt: new Date().toISOString()
    };

    setCurrentUser(finalUserData);
    try {
      localStorage.setItem('vidy_user_v1', JSON.stringify(finalUserData));
      localStorage.setItem('vidy_last_active_v1', Date.now().toString());
    } catch {}

    // Jika member baru mendaftar di samehadakuu.com, simpan ke database member cloud
    if (!isKnownAdmin && finalUserData.role === 'member') {
      const currentUsers = getStoredUsers();
      const existsIndex = currentUsers.findIndex(u => u.email?.toLowerCase() === userEmail);
      let updatedUsers;
      if (existsIndex !== -1) {
        updatedUsers = [...currentUsers];
        updatedUsers[existsIndex] = { ...updatedUsers[existsIndex], ...finalUserData };
      } else {
        updatedUsers = [{
          id: finalUserData.id || `user_${Date.now()}`,
          name: finalUserData.name,
          email: finalUserData.email,
          role: 'member',
          status: 'active',
          avatar: finalUserData.avatar,
          createdAt: new Date().toISOString()
        }, ...currentUsers];
      }
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
    }

    setActiveTab('tautan');
    const targetPath = getPathFromTab('tautan');
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('vidy_user_v1');
      localStorage.removeItem('vidy_last_active_v1');
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

  // Halaman Login Member (/login)
  if (activeTab === 'login') {
    return <LoginView onLoginSuccess={handleLoginSuccess} onNavigate={navigateToTab} />;
  }

  // Jika domain Admin (whatsappp.my.id) dan belum login, tampilkan AdminAuthPortal
  if (isDedicatedAdminHost && !currentUser) {
    return <AdminAuthPortal onLoginSuccess={handleLoginSuccess} users={users} />;
  }

  // Jika domain Member (samehadakuu.com) dan belum login saat akses halaman internal:
  if (!isDedicatedAdminHost && !currentUser && activeTab !== 'home' && activeTab !== 'public_shortlink') {
    return <LoginView onLoginSuccess={handleLoginSuccess} onNavigate={navigateToTab} />;
  }

  // Landing page untuk domain member/publik (samehadakuu.com)
  if (activeTab === 'home') {
    return (
      <LandingView 
        onNavigate={(tab) => navigateToTab(tab)} 
        links={links}
        analyticsLogs={analyticsLogs}
        domains={domains}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSaveLink={handleSaveLink}
      />
    );
  }

  return (
    <div className="app-layout">

      {/* Left Vertical Sidebar */}
      <Sidebar 
        activeTab={getSidebarActiveTab()}
        setActiveTab={(tab) => navigateToTab(tab)}
        onOpenCreateModal={handleOpenCreateLink}
        onGoHome={() => navigateToTab('tautan')}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content View Area */}
      <main className="main-wrapper">
        {activeTab === 'tautan' && (
          <DashboardView 
            links={userLinks}
            onDeleteLink={handleDeleteLink}
            onBulkDelete={handleBulkDeleteLinks}
            onEditLink={handleEditLink}
            onOpenCreateModal={handleOpenCreateLink}
            onSelectLinkAnalytics={handleSelectLinkAnalytics}
            currentUser={currentUser}
            isAdmin={isSuperAdmin}
          />
        )}

        {activeTab === 'create_link' && (
          <LinkBuilderView 
            linkToEdit={linkToEdit}
            pages={pages}
            domains={domains}
            currentUser={currentUser}
            onSaveLink={handleSaveLink}
            onCancel={() => navigateToTab('tautan')}
          />
        )}

        {activeTab === 'analitik' && (
          <AnalyticsView 
            analyticsLogs={userAnalytics}
            links={userLinks}
          />
        )}

        {(activeTab === 'halaman' || activeTab === 'create_page') && (
          isSuperAdmin ? (
            <PagesView 
              pages={pages}
              onSavePage={handleSavePage}
              onDeletePage={handleDeletePage}
              onOpenCreateModal={handleOpenCreateLink}
              currentRoute={activeTab}
              onNavigate={(tab) => navigateToTab(tab)}
            />
          ) : (
            <div className="neu-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <h2 style={{ color: 'var(--accent-rose)', fontWeight: 900, marginBottom: '0.5rem' }}>Akses Dibatasi</h2>
              <p style={{ color: 'var(--text-muted)' }}>Fitur template halaman landing hanya dapat dikelola oleh Super Admin di whatsappp.my.id</p>
            </div>
          )
        )}

        {(activeTab === 'domain' || activeTab === 'create_domain') && (
          isSuperAdmin ? (
            <DomainsView 
              domains={domains}
              onAddDomain={handleAddDomain}
              onDeleteDomain={handleDeleteDomain}
              onOpenCreateModal={handleOpenCreateLink}
              currentRoute={activeTab}
              onNavigate={(tab) => navigateToTab(tab)}
            />
          ) : (
            <div className="neu-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <h2 style={{ color: 'var(--accent-rose)', fontWeight: 900, marginBottom: '0.5rem' }}>Akses Dibatasi</h2>
              <p style={{ color: 'var(--text-muted)' }}>Pengaturan domain server dan DNS hanya dapat dikelola oleh Super Admin di whatsappp.my.id</p>
            </div>
          )
        )}

        {activeTab === 'pengguna' && (
          currentUser?.role === 'admin' || isDedicatedAdminHost ? (
            <UsersView 
              users={users}
              links={links}
              onSaveUser={handleSaveUser}
              onDeleteUser={handleDeleteUser}
              onOpenCreateModal={handleOpenCreateLink}
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
            />
          ) : (
            <div className="neu-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <h2 style={{ color: 'var(--accent-rose)', fontWeight: 900 }}>Akses Dibatasi</h2>
              <p style={{ color: 'var(--text-muted)' }}>Pengaturan keamanan global hanya dapat diatur oleh Super Admin di whatsappp.my.id</p>
            </div>
          )
        )}

        {activeTab === 'api_docs' && (
          <ApiDocsView 
            onOpenCreateModal={handleOpenCreateLink}
            onSaveLink={handleSaveLink}
            currentUser={currentUser}
          />
        )}
      </main>
    </div>
  );
}

export default App;
