import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Spinner from '../ui/Spinner';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

/**
 * Guards a route by required role. Unauthenticated users are redirected to
 * /login (remembering where they were headed). Authenticated users lacking
 * the required role see an in-app "Access denied" message rather than being
 * silently redirected, which is clearer for a shop owner who mistakenly
 * shares the /admin link with staff.
 */
export default function RequireRole({ role, children }) {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (loading) return <Spinner label={t('common.loading')} />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!hasRole(role)) {
    return (
      <div className="page">
        <EmptyState
          icon="🔒"
          title={t('admin.access.denied.title')}
          message={t('admin.access.denied.message')}
          action={
            <Link to="/">
              <Button>{t('nav.dashboard')}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return children;
}
