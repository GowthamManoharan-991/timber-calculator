import { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { ROLES } from '../../utils/constants';

const EMPTY = { name: '', username: '', email: '', password: '', role: ROLES.USER };

export default function UserForm({ initialValue, requirePassword = true, onSubmit, onCancel }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ ...EMPTY, ...initialValue, password: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const roleOptions = [
    { value: ROLES.USER, label: t('admin.users.role.user') },
    { value: ROLES.ADMIN, label: t('admin.users.role.admin') }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.username.trim()) {
      setError(`${t('common.name')} / ${t('admin.users.username')} ${t('common.required')}`);
      return;
    }
    if (requirePassword && !form.password) {
      setError(`${t('admin.users.password')} ${t('common.required')}`);
      return;
    }
    try {
      setSaving(true);
      const payload = { ...form };
      if (!payload.password) delete payload.password; // don't overwrite hash when editing without changing it
      await onSubmit(payload);
    } catch (err) {
      setError(err.message || 'Could not save user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stacked-form" noValidate>
      <Input label={t('common.name')} name="name" value={form.name} onChange={handleChange} required />
      <Input
        label={t('admin.users.username')}
        name="username"
        value={form.username}
        onChange={handleChange}
        required
        autoComplete="off"
      />
      <Input label={t('common.email')} name="email" type="email" value={form.email} onChange={handleChange} />
      <Input
        label={t('admin.users.password')}
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder={requirePassword ? '' : 'Leave blank to keep current password'}
        autoComplete="new-password"
      />
      <Select
        label={t('admin.users.role')}
        name="role"
        value={form.role}
        onChange={handleChange}
        options={roleOptions}
        placeholder=""
      />
      {error && <p className="field__error">{error}</p>}
      <div className="form-actions">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit" disabled={saving}>
          {saving ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  );
}
