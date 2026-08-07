import { formatCurrency, formatNumber } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

export default function TotalsSummary({ totalCFT, materialTotal, chargesTotal, grandTotal }) {
  const { t } = useLanguage();
  return (
    <div className="totals-summary">
      <div className="totals-summary__row">
        <span>{t('calculator.sectionTotalCft')}</span>
        <span>{formatNumber(totalCFT, 3)}</span>
      </div>
      <div className="totals-summary__row">
        <span>{t('calculator.materialAmount')}</span>
        <span>{formatCurrency(materialTotal)}</span>
      </div>
      <div className="totals-summary__row">
        <span>{t('calculator.additionalCharges')}</span>
        <span>{formatCurrency(chargesTotal)}</span>
      </div>
      <div className="totals-summary__row totals-summary__row--grand">
        <span>{t('calculator.grandTotal')}</span>
        <span>{formatCurrency(grandTotal)}</span>
      </div>
    </div>
  );
}
