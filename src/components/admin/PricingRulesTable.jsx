import { useEffect, useState } from 'react';
import { rateRuleService } from '../../services/rateRuleService';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import EmptyState from '../ui/EmptyState';
import { formatCurrency } from '../../utils/formatters';

const EMPTY_NEW_RULE = { woodType: '', defaultRate: '' };

export default function PricingRulesTable() {
  const { t } = useLanguage();
  const toast = useToast();
  const [rules, setRules] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newRule, setNewRule] = useState(EMPTY_NEW_RULE);
  const [adding, setAdding] = useState(false);

  const loadRules = async () => {
    const data = await rateRuleService.getRateRules();
    setRules(data);
  };

  useEffect(() => {
    loadRules();
  }, []);

  if (!rules) return <Spinner label={t('common.loading')} />;

  const startEdit = (rule) => {
    setEditingId(rule.id);
    setEditValue(String(rule.defaultRate));
  };

  const saveEdit = async (rule) => {
    try {
      await rateRuleService.updateRateRule(rule.id, { defaultRate: editValue });
      setEditingId(null);
      await loadRules();
      toast.success(t('common.save'));
    } catch (err) {
      toast.error(err.message || 'Could not update rate');
    }
  };

  const handleDelete = async (rule) => {
    try {
      await rateRuleService.deleteRateRule(rule.id);
      await loadRules();
      toast.success(t('common.delete'));
    } catch (err) {
      toast.error(err.message || 'Could not delete rate rule');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newRule.woodType.trim() || !newRule.defaultRate) return;
    try {
      setAdding(true);
      await rateRuleService.addRateRule(newRule);
      setNewRule(EMPTY_NEW_RULE);
      await loadRules();
      toast.success(t('common.add'));
    } catch (err) {
      toast.error(err.message || 'Could not add rate rule');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <p className="admin-note">{t('admin.pricing.note')}</p>

      {rules.length === 0 ? (
        <EmptyState icon="🪵" title={t('reports.noData')} />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('admin.pricing.woodType')}</th>
                <th>{t('admin.pricing.defaultRate')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td data-label={t('admin.pricing.woodType')}>{rule.woodType}</td>
                  <td data-label={t('admin.pricing.defaultRate')}>
                    {editingId === rule.id ? (
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="field__input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      formatCurrency(rule.defaultRate)
                    )}
                  </td>
                  <td data-label={t('common.actions')} className="data-table__actions">
                    {editingId === rule.id ? (
                      <>
                        <button className="icon-btn" title={t('common.save')} onClick={() => saveEdit(rule)}>
                          ✅
                        </button>
                        <button className="icon-btn" title={t('common.cancel')} onClick={() => setEditingId(null)}>
                          ✖️
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="icon-btn" title={t('common.edit')} onClick={() => startEdit(rule)}>
                          ✏️
                        </button>
                        <button
                          className="icon-btn icon-btn--danger"
                          title={t('common.delete')}
                          onClick={() => handleDelete(rule)}
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={handleAdd} className="form-row admin-add-rule">
        <Input
          label={t('admin.pricing.woodType')}
          value={newRule.woodType}
          onChange={(e) => setNewRule((p) => ({ ...p, woodType: e.target.value }))}
          placeholder="e.g. Sheesham"
        />
        <Input
          label={t('admin.pricing.defaultRate')}
          type="number"
          min="0"
          step="0.01"
          value={newRule.defaultRate}
          onChange={(e) => setNewRule((p) => ({ ...p, defaultRate: e.target.value }))}
          placeholder="0.00"
        />
        <div className="form-actions">
          <Button type="submit" disabled={adding}>
            {t('admin.pricing.addRule')}
          </Button>
        </div>
      </form>
    </div>
  );
}
