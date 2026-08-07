import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';

export default function Dashboard() {
  const { customers, quotations, loading } = useApp();
  const { t } = useLanguage();

  if (loading) return <Spinner label={t('common.loading')} />;

  const totalAmount = quotations.reduce((sum, q) => sum + (q.grandTotal || 0), 0);
  const recent = quotations.slice(0, 5);

  return (
    <div className="page">
      <div className="stat-grid">
        <StatCard label={t('dashboard.totalQuotations')} value={quotations.length} icon="🧾" accent="amber" />
        <StatCard label={t('dashboard.totalCustomers')} value={customers.length} icon="👥" accent="teal" />
        <StatCard label={t('dashboard.totalAmount')} value={formatCurrency(totalAmount)} icon="💰" accent="walnut" />
        <StatCard
          label={t('dashboard.totalCFT')}
          value={formatNumber(
            quotations.reduce((sum, q) => sum + (q.totalCFT || 0), 0),
            2
          )}
          icon="📐"
          accent="green"
        />
      </div>

      <Card
        title={t('dashboard.recentCalculations')}
        action={
          <Link to="/calculator">
            <Button size="sm">+ {t('dashboard.newQuotation')}</Button>
          </Link>
        }
      >
        {recent.length === 0 ? (
          <EmptyState
            icon="🧮"
            title={t('dashboard.noQuotations')}
            message=""
            action={
              <Link to="/calculator">
                <Button>{t('dashboard.startCalculating')}</Button>
              </Link>
            }
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
                  <th>{t('calculator.amount')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recent.map((q) => (
                  <tr key={q.id}>
                    <td data-label={t('quotation.number')}>{q.quotationNumber}</td>
                    <td data-label={t('calculator.customer')}>{q.customerSnapshot?.name}</td>
                    <td data-label={t('common.date')}>{formatDate(q.date)}</td>
                    <td data-label={t('calculator.cft')}>{formatNumber(q.totalCFT, 2)}</td>
                    <td data-label={t('calculator.amount')}>{formatCurrency(q.grandTotal)}</td>
                    <td data-label="">
                      <Link to={`/quotation/${q.id}`} className="link">
                        {t('common.view')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
