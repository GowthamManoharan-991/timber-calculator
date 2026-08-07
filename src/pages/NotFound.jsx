import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="page">
      <div className="empty-state">
        <div className="empty-state__icon" aria-hidden="true">
          🪚
        </div>
        <h4>Page not found</h4>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button>{t('nav.dashboard')}</Button>
        </Link>
      </div>
    </div>
  );
}
