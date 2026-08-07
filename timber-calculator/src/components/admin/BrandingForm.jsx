import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

const MAX_LOGO_BYTES = 500 * 1024; // 500KB - keeps localStorage usage sane

export default function BrandingForm() {
  const { settings, loading, updateSettings } = useApp();
  const { t } = useLanguage();
  const toast = useToast();

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
      toast.success(t('common.save'));
    } catch (err) {
      toast.error(err.message || 'Could not save branding');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stacked-form" noValidate>
      <p className="admin-note">{t('admin.branding.invoiceNote')}</p>

      <Input
        label={t('admin.branding.shopName')}
        name="companyName"
        value={form.companyName}
        onChange={handleChange}
        required
      />

      <div className="field">
        <label className="field__label">{t('settings.logo')}</label>
        <div className="logo-uploader">
          {form.logo ? (
            <div className="logo-uploader__preview">
              <img src={form.logo} alt="Shop logo preview" />
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
        <Input label={t('admin.branding.gstin')} name="gstNumber" value={form.gstNumber} onChange={handleChange} />
      </div>

      <div className="form-actions">
        <Button type="submit" disabled={saving}>
          {saving ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  );
}
