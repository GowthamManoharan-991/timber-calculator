import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const MAX_LOGO_BYTES = 500 * 1024; // 500KB - keeps localStorage usage sane

export default function Settings() {
  const { settings, loading, updateSettings } = useApp();
  const toast = useToast();
  const { t, language, setLanguage, languages } = useLanguage();
  const { isAdmin } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [logoError, setLogoError] = useState('');

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  if (loading || !form) return <Spinner label={t('common.loading')} />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoError('');
    if (!file.type.startsWith('image/')) {
      setLogoError('Please choose an image file');
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('Logo must be under 500KB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, logo: reader.result }));
    reader.onerror = () => setLogoError('Could not read that image');
    reader.readAsDataURL(file);
  };

  const removeLogo = () => setForm((prev) => ({ ...prev, logo: '' }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateSettings(form);
      toast.success(t('settings.saveSettings'));
    } catch (err) {
      toast.error(err.message || 'Could not save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <Card title={t('settings.language')}>
        <div className="field" style={{ maxWidth: 260 }}>
          <select
            className="field__input field__select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card title={t('settings.companyProfile')}>
          <p className="admin-note">
            {t('settings.brandingNotice')}{' '}
            {isAdmin && (
              <Link to="/admin" className="link">
                {t('settings.goToAdmin')}
              </Link>
            )}
          </p>
          <div className="stacked-form">
            <Input label={t('settings.companyName')} name="companyName" value={form.companyName} onChange={handleChange} required />

            <div className="field">
              <label className="field__label">{t('settings.logo')}</label>
              <div className="logo-uploader">
                {form.logo ? (
                  <div className="logo-uploader__preview">
                    <img src={form.logo} alt="Company logo preview" />
                    <button type="button" className="link" onClick={removeLogo}>
                      {t('common.delete')}
                    </button>
                  </div>
                ) : (
                  <span className="logo-uploader__placeholder">—</span>
                )}
                <input type="file" accept="image/*" onChange={handleLogoUpload} />
              </div>
              {logoError && <span className="field__error">{logoError}</span>}
            </div>

            <Input label={t('common.address')} name="address" value={form.address} onChange={handleChange} />
            <div className="form-row">
              <Input label={t('common.phone')} name="phone" value={form.phone} onChange={handleChange} />
              <Input label={t('settings.gstNumber')} name="gstNumber" value={form.gstNumber} onChange={handleChange} />
            </div>
          </div>
        </Card>

        <Card title={t('settings.termsConditions')}>
          <div className="field">
            <textarea
              name="terms"
              className="field__input field__textarea"
              rows={6}
              value={form.terms}
              onChange={handleChange}
              placeholder="Terms printed at the bottom of every quotation"
            />
          </div>
        </Card>

        <div className="form-actions">
          <Button type="submit" disabled={saving}>
            {saving ? t('common.saving') : t('settings.saveSettings')}
          </Button>
        </div>
      </form>
    </div>
  );
}
