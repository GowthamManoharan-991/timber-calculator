import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';
import { useLanguage } from '../../context/LanguageContext';

const TITLE_KEYS = {
  '/': 'nav.dashboard',
  '/customers': 'nav.customers',
  '/calculator': 'calculator.title',
  '/history': 'nav.history',
  '/reports': 'nav.reports',
  '/settings': 'nav.settings',
  '/admin': 'admin.title',
  '/login': 'auth.login'
};

function resolveTitleKey(pathname) {
  if (TITLE_KEYS[pathname]) return TITLE_KEYS[pathname];
  if (pathname.startsWith('/calculator')) return 'calculator.title';
  if (pathname.startsWith('/quotation')) return 'quotation.title';
  return 'nav.dashboard';
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      <div className="app-main">
        <Topbar title={t(resolveTitleKey(location.pathname))} onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main className="app-content">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
