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

export default function WoodSection({ section, index = 0, onChange, onRemove, canRemove, getDefaultRate }) {
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
    <div className="wood-section border-2 border-slate-700/60 rounded-2xl p-3 sm:p-5 mb-6 bg-slate-900/60 shadow-lg">
      {/* SECTION HEADER WITH NUMBERING BADGE */}
      <div className="wood-section__header flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400/20 text-amber-300 text-xs font-extrabold px-2.5 py-1 rounded-full border border-amber-400/30">
            SECTION #{index + 1}
          </span>
          <span className="text-sm font-semibold text-slate-300 hidden sm:inline">
            ({displayName})
          </span>
        </div>

        {canRemove &&
          (confirmingRemove ? (
            <div className="wood-section__confirm flex items-center gap-2">
              <span className="text-xs text-slate-300">{t('common.delete')}?</span>
              <Button size="sm" variant="danger" onClick={onRemove}>
                {t('common.yes')}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmingRemove(false)}>
                {t('common.no')}
              </Button>
            </div>
          ) : (
            <button className="icon-btn icon-btn--danger text-red-400 hover:text-red-300 p-1" title={t('common.delete')} onClick={() => setConfirmingRemove(true)}>
              🗑️ <span className="text-xs underline ml-1">Delete Section</span>
            </button>
          ))}
      </div>

      {/* WOOD TYPE SELECTOR */}
      <div className="wood-section__title-group mb-4">
        <Select
          label={t('calculator.woodType')}
          value={section.woodType}
          onChange={handleWoodTypeChange}
          options={WOOD_OPTIONS}
          placeholder={t('calculator.woodType')}
          className="wood-section__type-select w-full"
        />
        {section.woodType === CUSTOM_WOOD_TYPE && (
          <div className="mt-2">
            <Input
              label={t('calculator.customWoodName')}
              value={section.customName}
              onChange={(e) => updateSection({ customName: e.target.value })}
              placeholder="e.g. Sheesham"
            />
          </div>
        )}
      </div>

      {/* WOOD ROWS TABLE / CARDS */}
      <div className="wood-section__table-wrap">
        <table className="wood-table w-full">
          <thead className="hidden sm:table-header-group">
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
            {section.rows.map((row, rIdx) => (
              <WoodRow
                key={row.id}
                row={row}
                rowIndex={rIdx}
                onChange={(updated) => updateRow(row.id, updated)}
                onRemove={() => removeRow(row.id)}
                showRemove={section.rows.length > 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER ACTIONS (+ ADD ROW) */}
      <div className="wood-section__footer mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button
          size="sm"
          onClick={addRow}
          className="w-full sm:w-auto font-bold py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm transition-colors text-sm"
          style={{ backgroundColor: '#059669', color: '#ffffff' }}
        >
          + Add Dimension Row
        </Button>

        <div className="wood-section__totals text-xs sm:text-sm font-semibold text-slate-300 flex items-center justify-between w-full sm:w-auto gap-4">
          <span>
            {displayName} Total: <strong className="text-amber-400">{formatNumber(totals.totalCFT, 3)} CFT</strong>
          </span>
          <span>
            Amount: <strong className="text-emerald-400">{formatCurrency(totals.totalAmount)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}