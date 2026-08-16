import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { LandingView } from './components/landing/LandingView';
import { DashboardView } from './components/dashboard/DashboardView';
import { LinkBuilderView } from './components/links/LinkBuilderView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { PagesView } from './components/pages/PagesView';
import { DomainsView } from './components/domains/DomainsView';
import { SettingsView } from './components/settings/SettingsView';
import { TrafficSimulatorView } from './components/simulator/TrafficSimulatorView';
import { PublicLinkView } from './components/public/PublicLinkView';

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
  recordClick
} from './services/storageService';

// Extract shortcode from path (e.g. /fMRS4R.mp4 -> fMRS4R)
const extractShortCodeFromPath = (path) => {
  const clean = path.replace(/^\//, '').replace(/\/$/, '');
  return clean.replace(/\.(mp4|m3u8|webm)$/i, '');
};

// Comprehensive Path to Tab mapping
const getTabFromPath = (path) => {
  const cleanPath = path.toLowerCase().replace(/\/$/, '');
  if (cleanPath === '' || cleanPath === '/') return 'home';
  if (cleanPath === '/create') return 'create_link';
  if (cleanPath === '/analytics' || cleanPath === '/analitik') return 'analitik';
  if (cleanPath === '/pages/editor' || cleanPath === '/pages/create') return 'create_page';
  if (cleanPath === '/pages' || cleanPath === '/halaman') return 'halaman';
  if (cleanPath === '/domains/create' || cleanPath === '/domains/new') return 'create_domain';
  if (cleanPath === '/domains' || cleanPath === '/domain') return 'domain';
  if (cleanPath === '/settings' || cleanPath === '/pengaturan') return 'pengaturan';
  if (cleanPath === '/simulator' || cleanPath === '/test-router') return 'simulator';
  if (cleanPath === '/api' || cleanPath === '/api-docs') return 'api_docs';
  if (cleanPath === '/dashboard' || cleanPath === '/tautan') return 'tautan';

  // Check if path is a shortlink code (e.g. /fMRS4R or /fMRS4R.mp4)
  const code = extractShortCodeFromPath(path);
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

  // Link Builder Page State
  const [linkToEdit, setLinkToEdit] = useState(null);

  // Load initial data and set up URL listener
  useEffect(() => {
    // Primary Domain Redirection Logic:
    // All access to non-primary domains (e.g. cuanflix.site) is forwarded to samehadakuu.com
    // INCLUDING shortlinks — this ensures all link resolution happens on the primary domain
    // where all link data (localStorage) is stored.
    const host = window.location.hostname.toLowerCase();
    const fullPath = window.location.pathname + window.location.search + window.location.hash;
    const isPrimaryDomain = host.includes('samehadakuu.com') || host === 'localhost' || host === '127.0.0.1';
    if (!isPrimaryDomain) {
      window.location.replace('https://samehadakuu.com' + fullPath);
      return;
    }

    // No need to re-load data here — already loaded synchronously above
    // (keeping useEffect only for popstate + domain redirect)

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const tab = getTabFromPath(window.location.pathname);
      setActiveTab(tab);
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation Routing Function
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
    let updated;
    const existsIndex = links.findIndex(l => l.id === linkData.id);
    if (existsIndex !== -1) {
      updated = [...links];
      updated[existsIndex] = linkData;
    } else {
      updated = [linkData, ...links];
    }
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

  const handleDeleteDomain = (id) => {
    const updated = domains.filter(d => d.id !== id);
    setDomains(updated);
    saveDomains(updated);
  };

  // Config Action
  const handleSaveConfig = (updatedConfig) => {
    setConfig(updatedConfig);
    saveConfig(updatedConfig);
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
        onRecordClick={(linkId, routingResult) => {
          recordClick(linkId, routingResult);
          setAnalyticsLogs(getStoredAnalytics());
        }}
      />
    );
  }

  // Landing page is full-page (no sidebar)
  if (activeTab === 'home') {
    return (
      <LandingView 
        onNavigate={(tab) => navigateToTab(tab)} 
        links={links}
        analyticsLogs={analyticsLogs}
        domains={domains}
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
        onOpenSimulator={() => navigateToTab('simulator')}
        onGoHome={() => navigateToTab('home')}
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

        {activeTab === 'pengaturan' && (
          <SettingsView 
            config={config}
            onSaveConfig={handleSaveConfig}
            onOpenCreateModal={handleOpenCreateLink}
            onOpenSimulator={() => navigateToTab('simulator')}
          />
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
    </div>
  );
}

export default App;
