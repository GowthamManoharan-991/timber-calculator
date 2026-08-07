import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function MobileNav() {
  const { t } = useLanguage();

  const items = [
    { to: '/', label: t('nav.home') || 'Home', icon: '🏠', end: true },
    { to: '/calculator', label: t('nav.calculator') || 'Quotations', icon: '📝' },
    { to: '/customers', label: t('nav.customers') || 'Customers', icon: '👥' },
    { to: '/history', label: t('nav.history') || 'History', icon: '🕒' },
    { to: '/reports', label: t('nav.reports') || 'Reports', icon: '📊' }
  ];

  return (
    <nav className="mobile-nav" aria-label="Primary">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`}
        >
          <span className="mobile-nav__icon" aria-hidden="true">{item.icon}</span>
          <span className="mobile-nav__label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}