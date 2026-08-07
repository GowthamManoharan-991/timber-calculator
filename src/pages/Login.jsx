import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || '/admin';

  if (isAuthenticated) {
    navigate(redirectTo, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setSubmitting(true);
      await login(username, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || t('auth.invalidCredentials'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page login-page">
      <Card title={t('auth.login')} className="login-card">
        <form onSubmit={handleSubmit} className="stacked-form" noValidate>
          <Input
            label={t('auth.username')}
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <Input
            label={t('auth.password')}
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error && <p className="field__error">{error}</p>}
          <div className="form-actions">
            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? t('common.loading') : t('auth.loginButton')}
            </Button>
          </div>
        </form>
        <p className="login-hint">{t('auth.defaultAdminHint')}</p>
      </Card>
    </div>
  );
}
