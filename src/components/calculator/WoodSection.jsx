import { useState } from 'react';
import WoodRow from './WoodRow';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calculateSectionTotals } from '../../utils/calculations';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { CUSTOM_WOOD_TYPE, DEFAULT_WOOD_TYPES } from '../../utils/constants';
import { generateId } from '../../utils/id';
import { useLanguage } from '../../context/LanguageContext';

const WOOD_OPTIONS = [...DEFAULT_WOOD_TYPES, CUSTOM_WOOD_TYPE].map((w) => ({ label: w, value: w }));

function makeEmptyRow(defaultRate) {
  return {
    id: generateId('row'),
    width: '',
    thickness: '',
    length: '',
    quantity: '',
    rate: defaultRate ? String(defaultRate) : ''
  };
}

export default function WoodSection({ section, onChange, onRemove, canRemove, getDefaultRate }) {
  const { t } = useLanguage();
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const totals = calculateSectionTotals(section);

  const updateSection = (patch) => onChange({ ...section, ...patch });

  const resolvedWoodTypeName = section.woodType === CUSTOM_WOOD_TYPE ? section.customName : section.woodType;
  const defaultRate = getDefaultRate ? getDefaultRate(resolvedWoodTypeName) : null;

  const handleWoodTypeChange = (e) => {
    const value = e.target.value;
    const newDefaultRate = getDefaultRate ? getDefaultRate(value) : null;
    updateSection({
      woodType: value,
      customName: value === CUSTOM_WOOD_TYPE ? section.customName || '' : '',
      rows: section.rows.map((r) => (r.rate ? r : { ...r, rate: newDefaultRate ? String(newDefaultRate) : '' }))
    });
  };

  const updateRow = (rowId, updatedRow) => {
    updateSection({ rows: section.rows.map((r) => (r.id === rowId ? updatedRow : r)) });
  };

  const addRow = () => {
    updateSection({ rows: [...section.rows, makeEmptyRow(defaultRate)] });
  };

  const removeRow = (rowId) => {
    updateSection({ rows: section.rows.filter((r) => r.id !== rowId) });
  };

  const displayName = section.woodType === CUSTOM_WOOD_TYPE ? section.customName || 'Custom Wood' : section.woodType;

  return (
    <div className="wood-section">
      <div className="wood-section__header">
        <div className="wood-section__title-group">
          <Select
            label={t('calculator.woodType')}
            value={section.woodType}
            onChange={handleWoodTypeChange}
            options={WOOD_OPTIONS}
            placeholder={t('calculator.woodType')}
            className="wood-section__type-select"
          />
          {section.woodType === CUSTOM_WOOD_TYPE && (
            <Input
              label={t('calculator.customWoodName')}
              value={section.customName}
              onChange={(e) => updateSection({ customName: e.target.value })}
              placeholder="e.g. Sheesham"
            />
          )}
        </div>
        {canRemove &&
          (confirmingRemove ? (
            <div className="wood-section__confirm">
              <span>{t('common.delete')}?</span>
              <Button size="sm" variant="danger" onClick={onRemove}>
                {t('common.yes')}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmingRemove(false)}>
                {t('common.no')}
              </Button>
            </div>
          ) : (
            <button className="icon-btn icon-btn--danger" title={t('common.delete')} onClick={() => setConfirmingRemove(true)}>
              🗑️
            </button>
          ))}
      </div>

      <div className="wood-section__table-wrap">
        <table className="wood-table">
          <thead>
            <tr>
              <th>{t('calculator.width')}</th>
              <th>{t('calculator.thickness')}</th>
              <th>{t('calculator.length')}</th>
              <th>{t('calculator.quantity')}</th>
              <th>{t('calculator.rate')}</th>
              <th>{t('calculator.cft')}</th>
              <th>{t('calculator.amount')}</th>
              <th aria-label="Remove row" />
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row) => (
              <WoodRow
                key={row.id}
                row={row}
                onChange={(updated) => updateRow(row.id, updated)}
                onRemove={() => removeRow(row.id)}
                showRemove={section.rows.length > 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="wood-section__footer">
        {/* Updated Button: High-contrast white background with dark text for dark mode */}
        <Button
          size="sm"
          onClick={addRow}
          className="btn--add-row !bg-white !text-slate-900 hover:!bg-slate-100 font-bold border-0 shadow-sm transition-colors"
          style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
        >
          + {t('calculator.addRow')}
        </Button>
        
        <div className="wood-section__totals">
          <span>
            {displayName} {t('calculator.sectionTotalCft')}: <strong>{formatNumber(totals.totalCFT, 3)}</strong>
          </span>
          <span>
            {t('calculator.sectionTotalAmount')}: <strong>{formatCurrency(totals.totalAmount)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}