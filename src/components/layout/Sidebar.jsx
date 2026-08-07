import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ open, onNavigate }) {
  const { t } = useLanguage();
  const { isAdmin, isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { to: '/', label: t('nav.dashboard'), icon: '\u25A6', end: true },
    { to: '/calculator', label: t('nav.quotations') || t('nav.calculator') || 'Quotations', icon: '\u{1F4DD}' },
    { to: '/customers', label: t('nav.customers'), icon: '\u{1F465}' },
    { to: '/history', label: t('nav.history'), icon: '\u{1F553}' },
    { to: '/reports', label: t('nav.reports'), icon: '\u{1F4CA}' },
    { to: '/settings', label: t('nav.settings'), icon: '\u2699' }
  ];

  if (isAdmin) {
    navItems.push({ to: '/admin', label: t('nav.admin'), icon: '\u{1F6E1}' });
  }

  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="sidebar__brand">
        <span className="sidebar__logo" aria-hidden="true">
          🪵
        </span>
        <div>
          <p className="sidebar__brand-name">SMT Timber</p>
          <p className="sidebar__brand-sub">{t('app.tagline')}</p>
        </div>
      </div>
      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            onClick={onNavigate}
          >
            <span className="sidebar__icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__account">
        {isAuthenticated ? (
          <>
            <p className="sidebar__account-name">
              {t('auth.loggedInAs')}: <strong>{user.name}</strong>
            </p>
            <button className="sidebar__link sidebar__link--logout" onClick={logout}>
              <span className="sidebar__icon" aria-hidden="true">
                &#8630;
              </span>
              {t('nav.logout')}
            </button>
          </>
        ) : (
          <NavLink to="/login" className="sidebar__link" onClick={onNavigate}>
            <span className="sidebar__icon" aria-hidden="true">
              &#8618;
            </span>
            {t('nav.login')}
          </NavLink>
        )}
      </div>
      <div className="sidebar__footer">
        <p>SMT Timber Billing v1.0</p>
        <p className="sidebar__footer-sub">{t('app.offline')}</p>
      </div>
    </aside>
  );
}