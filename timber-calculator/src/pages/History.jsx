import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';

export default function History() {
  const { quotations, loading, removeQuotation, duplicateQuotation } = useApp();
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [query, setQuery] = useState('');
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return quotations;
    const q = query.trim().toLowerCase();
    return quotations.filter(
      (item) =>
        item.quotationNumber?.toLowerCase().includes(q) ||
        item.customerSnapshot?.name?.toLowerCase().includes(q) ||
        item.customerSnapshot?.phone?.toLowerCase().includes(q)
    );
  }, [quotations, query]);

  const handleDuplicate = async (id) => {
    try {
      const clone = await duplicateQuotation(id);
      toast.success(t('common.duplicate'));
      navigate(`/quotation/${clone.id}`);
    } catch (err) {
      toast.error(err.message || 'Could not duplicate quotation');
    }
  };

  const handleDelete = async () => {
    try {
      await removeQuotation(deleting.id);
      toast.success(t('common.delete'));
      setDeleting(null);
    } catch (err) {
      toast.error(err.message || 'Could not delete quotation');
    }
  };

  return (
    <div className="page">
      <Card title={`${t('history.title')} (${quotations.length})`}>
        <Input
          placeholder={t('history.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />

        {loading ? (
          <Spinner label={t('common.loading')} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🕓"
            title={quotations.length === 0 ? t('dashboard.noQuotations') : t('customers.noMatch')}
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('quotation.number')}</th>
                  <th>{t('calculator.customer')}</th>
                  <th>{t('common.date')}</th>
                  <th>{t('calculator.cft')}</th>
                  <th>{t('calculator.grandTotal')}</th>
                  <th>{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr key={q.id}>
                    <td data-label={t('quotation.number')}>
                      <Link to={`/quotation/${q.id}`} className="link">
                        {q.quotationNumber}
                      </Link>
                    </td>
                    <td data-label={t('calculator.customer')}>{q.customerSnapshot?.name || '—'}</td>
                    <td data-label={t('common.date')}>{formatDate(q.date)}</td>
                    <td data-label={t('calculator.cft')}>{formatNumber(q.totalCFT, 2)}</td>
                    <td data-label={t('calculator.grandTotal')}>{formatCurrency(q.grandTotal)}</td>
                    <td data-label={t('common.actions')} className="data-table__actions">
                      <button className="icon-btn" title={t('common.edit')} onClick={() => navigate(`/calculator/${q.id}`)}>
                        ✏️
                      </button>
                      <button className="icon-btn" title={t('common.duplicate')} onClick={() => handleDuplicate(q.id)}>
                        📄
                      </button>
                      <button className="icon-btn icon-btn--danger" title={t('common.delete')} onClick={() => setDeleting(q)}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleting}
        title={t('common.delete')}
        message={`${t('common.delete')} ${deleting?.quotationNumber}?`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
