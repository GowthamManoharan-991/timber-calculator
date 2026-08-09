import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import WoodSection from '../components/calculator/WoodSection';
import ChargesPanel from '../components/calculator/ChargesPanel';
import TotalsSummary from '../components/calculator/TotalsSummary';
import CustomerPicker from '../components/calculator/CustomerPicker';
import { generateId } from '../utils/id';
import { calculateQuotationSummary } from '../utils/calculations';
import { validateQuotation } from '../utils/validators';
import { DEFAULT_WOOD_TYPES } from '../utils/constants';
import { quotationService } from '../services/quotationService';
import { rateRuleService } from '../services/rateRuleService';

function makeEmptySection(defaultRate) {
  return {
    id: generateId('section'),
    woodType: DEFAULT_WOOD_TYPES[0],
    customName: '',
    rows: [
      {
        id: generateId('row'),
        width: '',
        thickness: '',
        length: '',
        quantity: '',
        rate: defaultRate ? String(defaultRate) : ''
      }
    ]
  };
}

const EMPTY_CHARGES = { planing: '', cutting: '', polish: '', transport: '', labour: '', misc: '' };

export default function Calculator() {
  const { id } = useParams(); // present when editing an existing quotation
  const location = useLocation();
  const navigate = useNavigate();
  const { customers, saveQuotation, editQuotation } = useApp();
  const toast = useToast();
  const { t } = useLanguage();

  const [customerId, setCustomerId] = useState(location.state?.customerId || '');
  const [rateRules, setRateRules] = useState([]);
  const [sections, setSections] = useState([makeEmptySection()]);
  const [charges, setCharges] = useState(EMPTY_CHARGES);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(!!id);

  // Load admin-configured default rates once, then seed the first section.
  useEffect(() => {
    (async () => {
      const rules = await rateRuleService.getRateRules();
      setRateRules(rules);
      if (!id) {
        const defaultRate = rules.find((r) => r.woodType === DEFAULT_WOOD_TYPES[0])?.defaultRate;
        setSections([makeEmptySection(defaultRate)]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDefaultRate = (woodType) => {
    const match = rateRules.find((r) => r.woodType.toLowerCase() === (woodType || '').toLowerCase());
    return match ? match.defaultRate : null;
  };

  // Load an existing quotation into the form when editing.
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoadingExisting(true);
        const existing = await quotationService.getQuotation(id);
        if (!existing) {
          toast.error('Quotation not found');
          navigate('/history');
          return;
        }
        setCustomerId(existing.customerId);
        setSections(existing.sections);
        setCharges({ ...EMPTY_CHARGES, ...existing.charges });
      } catch (err) {
        toast.error(err.message || 'Failed to load quotation');
      } finally {
        setLoadingExisting(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const summary = calculateQuotationSummary({ sections, charges });

  const updateSection = (sectionId, updated) => {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? updated : s)));
  };

  const addSection = () => {
    const defaultRate = getDefaultRate(DEFAULT_WOOD_TYPES[0]);
    setSections((prev) => [...prev, makeEmptySection(defaultRate)]);
  };
  const removeSection = (sectionId) => setSections((prev) => prev.filter((s) => s.id !== sectionId));

  const resetForm = () => {
    setCustomerId('');
    setSections([makeEmptySection(getDefaultRate(DEFAULT_WOOD_TYPES[0]))]);
    setCharges(EMPTY_CHARGES);
    setErrors({});
  };

  const handleSave = async () => {
    const draft = { customerId, sections, charges };
    const { valid, errors: validationErrors } = validateQuotation(draft);
    setErrors(validationErrors);
    if (!valid) {
      toast.error('Please fix the highlighted fields');
      return;
    }

    const customer = customers.find((c) => c.id === customerId);
    const customerSnapshot = customer
      ? {
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          gstNumber: customer.gstNumber
        }
      : null;

    try {
      setSaving(true);
      if (id) {
        await editQuotation(id, { customerId, customerSnapshot, sections, charges });
        toast.success(t('common.update'));
        navigate(`/quotation/${id}`);
      } else {
        const created = await saveQuotation({ customerId, customerSnapshot, sections, charges });
        toast.success(t('common.save'));
        resetForm();
        navigate(`/quotation/${created.id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Could not save quotation');
    } finally {
      setSaving(false);
    }
  };

  if (loadingExisting) return <Spinner label={t('common.loading')} />;

  return (
    <div className="page calculator-page pb-24 sm:pb-8">
      <Card title={t('calculator.customer')}>
        <CustomerPicker customerId={customerId} onSelect={setCustomerId} error={errors.customer} />
      </Card>

      <Card
        title={t('calculator.woodSections')}
        action={
          <Button size="sm" variant="secondary" onClick={addSection}>
            + {t('calculator.addSection')}
          </Button>
        }
      >
        {errors.sections && <p className="field__error">{errors.sections}</p>}
        <div className="wood-section-list">
          {sections.map((section) => (
            <WoodSection
              key={section.id}
              section={section}
              onChange={(updated) => updateSection(section.id, updated)}
              onRemove={() => removeSection(section.id)}
              canRemove={sections.length > 1}
              getDefaultRate={getDefaultRate}
            />
          ))}
        </div>
      </Card>

      <Card title={t('calculator.additionalCharges')}>
        <ChargesPanel charges={charges} onChange={setCharges} />
      </Card>

      <Card title={t('calculator.summary')}>
        <TotalsSummary {...summary} />
        <div className="form-actions flex flex-col gap-3 mt-6 w-full">
          {/* Primary Action Button: Save & Generate Quotation (On Top) */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-base"
          >
            {saving ? t('common.saving') : id ? t('calculator.update') : t('calculator.saveGenerate')}
          </Button>

          {/* Reset Action Button: Red and positioned below Save button */}
          <Button
            type="button"
            variant="danger"
            onClick={resetForm}
            disabled={saving}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all text-sm border-0"
            style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
          >
            {t('common.reset')}
          </Button>
        </div>
      </Card>
    </div>
  );
}