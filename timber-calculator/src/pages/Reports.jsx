import { useEffect, useState } from 'react';
import { reportService } from '../services/reportService';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { REPORT_RANGES } from '../utils/constants';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function Reports() {
  const [range, setRange] = useState(REPORT_RANGES.MONTHLY);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { t } = useLanguage();

  const RANGE_TABS = [
    { key: REPORT_RANGES.DAILY, label: t('reports.daily') },
    { key: REPORT_RANGES.MONTHLY, label: t('reports.monthly') },
    { key: REPORT_RANGES.YEARLY, label: t('reports.yearly') }
  ];

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await reportService.getReport(range);
        setReport(data);
      } catch (err) {
        toast.error(err.message || 'Could not load report');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const maxSales = report?.breakdown.length ? Math.max(...report.breakdown.map((b) => b.sales)) : 0;

  return (
    <div className="page">
      <Card>
        <div className="tabs">
          {RANGE_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`tabs__item ${range === tab.key ? 'tabs__item--active' : ''}`}
              onClick={() => setRange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {loading || !report ? (
        <Spinner label={t('common.loading')} />
      ) : (
        <>
          <div className="stat-grid">
            <StatCard label={t('reports.totalSales')} value={formatCurrency(report.totals.totalSales)} icon="💵" accent="amber" />
            <StatCard label={t('reports.totalCFT')} value={formatNumber(report.totals.totalCFT, 2)} icon="📐" accent="teal" />
            <StatCard label={t('reports.totalLabour')} value={formatCurrency(report.totals.totalLabour)} icon="🛠️" accent="walnut" />
            <StatCard label={t('reports.totalRevenue')} value={formatCurrency(report.totals.totalRevenue)} icon="📈" accent="green" />
          </div>

          <Card title={`${t('reports.breakdown')} (${report.totals.totalQuotations})`}>
            {report.breakdown.length === 0 ? (
              <EmptyState icon="📊" title={t('reports.noData')} />
            ) : (
              <div className="report-chart">
                {report.breakdown.map((b) => (
                  <div className="report-chart__bar-row" key={b.key}>
                    <span className="report-chart__label">{b.key}</span>
                    <div className="report-chart__track">
                      <div
                        className="report-chart__bar"
                        style={{ width: `${maxSales ? (b.sales / maxSales) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="report-chart__value">{formatCurrency(b.sales)}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
