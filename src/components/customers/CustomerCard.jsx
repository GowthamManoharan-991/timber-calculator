import { useLanguage } from '../../context/LanguageContext';

export default function CustomerCard({ customer, onEdit, onDelete, onCreateQuotation }) {
  const { t } = useLanguage();
  return (
    <div className="customer-card">
      <div className="customer-card__avatar" aria-hidden="true">
        {customer.name?.charAt(0)?.toUpperCase() || '?'}
      </div>
      <div className="customer-card__info">
        <p className="customer-card__name">{customer.name}</p>
        <p className="customer-card__meta">
          {customer.phone || '-'} {customer.email ? `· ${customer.email}` : ''}
        </p>
        {customer.address && <p className="customer-card__address">{customer.address}</p>}
      </div>
      <div className="customer-card__actions">
        <button className="icon-btn" title={t('customers.newQuotation')} onClick={() => onCreateQuotation(customer)}>
          📝
        </button>
        <button className="icon-btn" title={t('common.edit')} onClick={() => onEdit(customer)}>
          ✏️
        </button>
        <button className="icon-btn icon-btn--danger" title={t('common.delete')} onClick={() => onDelete(customer)}>
          🗑️
        </button>
      </div>
    </div>
  );
}
