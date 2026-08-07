import { useState } from 'react';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import CustomerForm from '../customers/CustomerForm';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export default function CustomerPicker({ customerId, onSelect, error }) {
  const { customers, addCustomer } = useApp();
  const toast = useToast();
  const { t } = useLanguage();
  const [showAdd, setShowAdd] = useState(false);

  const options = customers.map((c) => ({ label: `${c.name}${c.phone ? ' - ' + c.phone : ''}`, value: c.id }));

  const handleAddCustomer = async (form) => {
    try {
      const created = await addCustomer(form);
      toast.success(t('customers.add'));
      setShowAdd(false);
      onSelect(created.id);
    } catch (err) {
      toast.error(err.message || 'Could not add customer');
    }
  };

  return (
    <div className="customer-picker">
      <div className="customer-picker__row">
        <Select
          label={t('calculator.customer')}
          required
          value={customerId || ''}
          onChange={(e) => onSelect(e.target.value)}
          options={options}
          placeholder={t('calculator.selectCustomer')}
          error={error}
          className="customer-picker__select"
        />
        <Button type="button" variant="secondary" onClick={() => setShowAdd(true)}>
          + {t('calculator.newCustomer')}
        </Button>
      </div>

      <Modal open={showAdd} title={t('customers.add')} onClose={() => setShowAdd(false)}>
        <CustomerForm onSubmit={handleAddCustomer} onCancel={() => setShowAdd(false)} />
      </Modal>
    </div>
  );
}
