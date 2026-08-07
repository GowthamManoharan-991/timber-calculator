import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import CustomerForm from '../components/customers/CustomerForm';
import CustomerCard from '../components/customers/CustomerCard';

export default function Customers() {
  const { customers, loading, addCustomer, editCustomer, removeCustomer } = useApp();
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return customers;
    const q = query.trim().toLowerCase();
    return customers.filter(
      (c) => c.name?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
    );
  }, [customers, query]);

  const handleAdd = async (form) => {
    try {
      await addCustomer(form);
      toast.success(t('customers.add'));
      setShowForm(false);
    } catch (err) {
      toast.error(err.message || 'Could not add customer');
    }
  };

  const handleEdit = async (form) => {
    try {
      await editCustomer(editing.id, form);
      toast.success(t('common.update'));
      setEditing(null);
    } catch (err) {
      toast.error(err.message || 'Could not update customer');
    }
  };

  const handleDelete = async () => {
    try {
      await removeCustomer(deleting.id);
      toast.success(t('common.delete'));
      setDeleting(null);
    } catch (err) {
      toast.error(err.message || 'Could not delete customer');
    }
  };

  return (
    <div className="page">
      <Card
        title={`${t('customers.title')} (${customers.length})`}
        action={<Button onClick={() => setShowForm(true)}>+ {t('customers.add')}</Button>}
      >
        <Input
          placeholder={t('customers.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />

        {loading ? (
          <Spinner label={t('common.loading')} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="👥"
            title={customers.length === 0 ? t('customers.none') : t('customers.noMatch')}
          />
        ) : (
          <div className="customer-list">
            {filtered.map((c) => (
              <CustomerCard
                key={c.id}
                customer={c}
                onEdit={setEditing}
                onDelete={setDeleting}
                onCreateQuotation={(customer) => navigate('/calculator', { state: { customerId: customer.id } })}
              />
            ))}
          </div>
        )}
      </Card>

      <Modal open={showForm} title={t('customers.add')} onClose={() => setShowForm(false)}>
        <CustomerForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      </Modal>

      <Modal open={!!editing} title={t('customers.edit')} onClose={() => setEditing(null)}>
        {editing && (
          <CustomerForm
            initialValue={editing}
            onSubmit={handleEdit}
            onCancel={() => setEditing(null)}
            submitLabel={t('common.update')}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title={t('common.delete')}
        message={`${t('common.delete')} "${deleting?.name}"?`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
