import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function MobileNav() {
  const { t } = useLanguage();

  const items = [
    { to: '/', label: t('nav.home'), icon: '\u25A6', end: true },
    { to: '/calculator', label: t('nav.calculator'), icon: '\u{1F9EE}' },
    { to: '/customers', label: t('nav.customers'), icon: '\u{1F465}' },
    { to: '/history', label: t('nav.history'), icon: '\u{1F553}' },
    { to: '/reports', label: t('nav.reports'), icon: '\u{1F4CA}' }
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
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
