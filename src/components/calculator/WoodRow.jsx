import { calculateRowAmount, calculateRowCFT } from '../../utils/calculations';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

export default function WoodRow({ row, rowIndex = 0, onChange, onRemove, showRemove }) {
  const { t } = useLanguage();
  const cft = calculateRowCFT(row);
  const amount = calculateRowAmount(row);

  const FIELDS = [
    { key: 'width', label: t('calculator.width') },
    { key: 'thickness', label: t('calculator.thickness') },
    { key: 'length', label: t('calculator.length') },
    { key: 'quantity', label: t('calculator.quantity') },
    { key: 'rate', label: t('calculator.rate') }
  ];

  const handleField = (key) => (e) => {
    onChange({ ...row, [key]: e.target.value });
  };

  return (
    <tr
      className="wood-row relative"
      data-row-number={`Row #${rowIndex + 1}`}
      data-amount-line={`${t('calculator.amount')}: ${formatCurrency(amount)}`}
    >
      {FIELDS.map((f) => (
        <td key={f.key} data-label={f.label}>
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            className="wood-row__input"
            value={row[f.key]}
            onChange={handleField(f.key)}
            placeholder="0"
          />
        </td>
      ))}
      <td data-label={t('calculator.cft')} className="wood-row__computed">
        {formatNumber(cft, 3)}
      </td>
      <td
        data-label={t('calculator.amount')}
        className="wood-row__computed wood-row__computed--amount"
      >
        {formatCurrency(amount)}
      </td>
      <td data-label="" className="wood-row__remove">
        {showRemove && (
          <button
            type="button"
            className="icon-btn icon-btn--danger wood-row__delete-btn"
            onClick={onRemove}
            aria-label={t('calculator.deleteRow')}
          >
            <span className="wood-row__delete-icon" aria-hidden="true">
              &times;
            </span>
            <span className="wood-row__delete-label">
              Delete Row
            </span>
          </button>
        )}
      </td>
    </tr>
  );
}