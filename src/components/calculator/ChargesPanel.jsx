import { CHARGE_TYPES } from '../../utils/constants';
import { calculateChargesTotal } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

export default function ChargesPanel({ charges, onChange }) {
  const { t } = useLanguage();

  const handleChange = (key) => (e) => {
    onChange({ ...charges, [key]: e.target.value });
  };

  const total = calculateChargesTotal(charges);

  return (
    <div className="charges-panel">
      <div className="charges-panel__grid">
        {CHARGE_TYPES.map((c) => (
          <div className="field" key={c.key}>
            <label className="field__label" htmlFor={`charge-${c.key}`}>
              {t(`calculator.charge.${c.key}`)}
            </label>
            <input
              id={`charge-${c.key}`}
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              className="field__input"
              placeholder="0.00"
              value={charges[c.key] || ''}
              onChange={handleChange(c.key)}
            />
          </div>
        ))}
      </div>
      <div className="charges-panel__total">
        {t('calculator.additionalCharges')}: <strong>{formatCurrency(total)}</strong>
      </div>
    </div>
  );
}
