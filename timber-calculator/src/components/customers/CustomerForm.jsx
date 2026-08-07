import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { validateCustomer } from '../../utils/validators';
import { useLanguage } from '../../context/LanguageContext';

const EMPTY = { name: '', phone: '', email: '', address: '', gstNumber: '', notes: '' };

export default function CustomerForm({ initialValue, onSubmit, onCancel, submitLabel }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ ...EMPTY, ...initialValue });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid, errors: validationErrors } = validateCustomer(form);
    setErrors(validationErrors);
    if (!valid) return;
    try {
      setSaving(true);
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stacked-form" noValidate>
      <Input
        label={t('common.name')}
        name="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        required
        placeholder="e.g. Ramesh Traders"
      />
      <div className="form-row">
        <Input
          label={t('common.phone')}
          name="phone"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="e.g. 9876543210"
        />
        <Input
          label={t('common.email')}
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder={t('common.optional')}
        />
      </div>
      <Input
        label={t('common.address')}
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Shop / delivery address"
      />
      <Input
        label={t('customers.gst')}
        name="gstNumber"
        value={form.gstNumber}
        onChange={handleChange}
        placeholder={t('common.optional')}
      />
      <Input
        label={t('customers.notes')}
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder={t('common.optional')}
      />
      <div className="form-actions">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit" disabled={saving}>
          {saving ? t('common.saving') : submitLabel || t('customers.add')}
        </Button>
      </div>
    </form>
  );
}
