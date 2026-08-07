import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import BrandingForm from '../components/admin/BrandingForm';
import PricingRulesTable from '../components/admin/PricingRulesTable';
import UserManagement from '../components/admin/UserManagement';

const TABS = [
  { key: 'branding', labelKey: 'admin.tab.branding' },
  { key: 'pricing', labelKey: 'admin.tab.pricing' },
  { key: 'users', labelKey: 'admin.tab.users' }
];

export default function Admin() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('branding');

  return (
    <div className="page">
      <Card>
        <div className="admin-header">
          <div>
            <h3 style={{ margin: 0 }}>{t('admin.title')}</h3>
            <p className="admin-header__user">
              {t('auth.loggedInAs')}: <strong>{user?.name}</strong> ({user?.username})
            </p>
          </div>
          <Button variant="ghost" onClick={logout}>
            {t('nav.logout')}
          </Button>
        </div>
        <div className="tabs">
          {TABS.map((tabItem) => (
            <button
              key={tabItem.key}
              className={`tabs__item ${tab === tabItem.key ? 'tabs__item--active' : ''}`}
              onClick={() => setTab(tabItem.key)}
            >
              {t(tabItem.labelKey)}
            </button>
          ))}
        </div>
      </Card>

      {tab === 'branding' && (
        <Card title={t('admin.tab.branding')}>
          <BrandingForm />
        </Card>
      )}
      {tab === 'pricing' && (
        <Card title={t('admin.tab.pricing')}>
          <PricingRulesTable />
        </Card>
      )}
      {tab === 'users' && (
        <Card title={t('admin.tab.users')}>
          <UserManagement />
        </Card>
      )}
    </div>
  );
}
