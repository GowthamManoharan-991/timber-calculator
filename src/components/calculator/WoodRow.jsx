import { calculateRowAmount, calculateRowCFT } from '../../utils/calculations';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

// NOTE ON RESPONSIVE LAYOUT:
// This component renders one <tr> per timber row. On desktop/tablet it's a
// normal table row (unchanged). On mobile, CSS Grid re-flows this exact
// same markup into a 2-column card (see index.css "MOBILE: WOOD ROW CARDS"
// section) - no JSX/logic branching needed, no duplicate markup, and no
// change to the calculation values themselves.
//
// `data-amount-line` carries the pre-formatted "Amount: ₹0.00" string so the
// mobile-only CSS can render it as a prominent total bar via
// `content: attr(data-amount-line)` on a pseudo-element, positioned below
// the input grid and above the Delete Row button using CSS Grid placement.

export default function WoodRow({ row, onChange, onRemove, showRemove }) {
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
      className="wood-row"
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
              {t('calculator.deleteRow')}
            </span>
          </button>
        )}
      </td>
    </tr>
  );
}