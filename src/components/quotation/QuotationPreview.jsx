import { CUSTOM_WOOD_TYPE, CHARGE_TYPES } from '../../utils/constants';
import { calculateRowAmount, calculateRowCFT, calculateSectionTotals } from '../../utils/calculations';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

export default function QuotationPreview({ quotation, settings }) {
  const { t } = useLanguage();
  if (!quotation) return null;

  // Extract nested data cleanly (supports direct objects & parsed DB JSON)
  const customerSnapshot = quotation.customerSnapshot || quotation.fullData?.customerSnapshot || {
    name: quotation.customerName || quotation.customer_name,
    phone: quotation.phone,
    address: quotation.address,
    gstNumber: quotation.gstNumber,
  };

  const sections = quotation.sections || quotation.fullData?.sections || [];
  const charges = quotation.charges || quotation.fullData?.charges || quotation.additionalCharges || {};

  const woodName = (section) =>
    section.woodType === CUSTOM_WOOD_TYPE
      ? section.customName || 'Custom Wood'
      : section.woodType || section.name || 'Timber';

  const activeCharges = CHARGE_TYPES.filter((c) => Number(charges[c.key]) > 0);

  return (
    <div className="w-full max-w-full overflow-x-auto pb-4">
      <div 
        className="quotation-doc w-full box-border p-3 sm:p-6 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-900" 
        id="quotation-print-area"
        style={{ maxWidth: '100%', boxSizing: 'border-box' }}
      >
        <header className="quotation-doc__header flex flex-col sm:flex-row justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="quotation-doc__company">
            {settings?.logo && <img src={settings.logo} alt="" className="quotation-doc__logo h-12 object-contain mb-2" />}
            <div>
              <h2 className="text-xl font-bold">{settings?.companyName || 'Your Timber Shop'}</h2>
              {settings?.address && <p className="text-sm text-slate-600">{settings.address}</p>}
              <p className="text-sm text-slate-600">
                {settings?.phone && <>Ph: {settings.phone} </>}
                {settings?.gstNumber && <>· GSTIN: {settings.gstNumber}</>}
              </p>
            </div>
          </div>
          <div className="quotation-doc__meta sm:text-right">
            <h3 className="text-lg font-bold text-slate-800">{t('quotation.title')}</h3>
            <p className="text-sm">
              <strong>{t('quotation.number')}:</strong> {quotation.quotationNumber || quotation.quotation_number}
            </p>
            <p className="text-sm">
              <strong>{t('common.date')}:</strong> {formatDate(quotation.date || quotation.created_at)}
            </p>
          </div>
        </header>

        <section className="quotation-doc__customer my-4 pb-4 border-b border-slate-100">
          <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">{t('quotation.billTo')}</h4>
          <p className="quotation-doc__customer-name font-bold text-slate-900">{customerSnapshot?.name || 'Guest Customer'}</p>
          {customerSnapshot?.phone && <p className="text-sm text-slate-600">Ph: {customerSnapshot.phone}</p>}
          {customerSnapshot?.address && <p className="text-sm text-slate-600">{customerSnapshot.address}</p>}
          {customerSnapshot?.gstNumber && <p className="text-sm text-slate-600">GSTIN: {customerSnapshot.gstNumber}</p>}
        </section>

        {sections.map((section, sIdx) => {
          const rows = section.rows || [];
          const totals = calculateSectionTotals ? calculateSectionTotals(section) : {
            totalCFT: rows.reduce((acc, r) => acc + (Number(r.cft) || calculateRowCFT(r) || 0), 0),
            totalAmount: rows.reduce((acc, r) => acc + (Number(r.amount) || calculateRowAmount(r) || 0), 0),
          };

          return (
            <section key={section.id || sIdx} className="quotation-doc__section my-4">
              <h4 
                className="wood-badge mb-2" 
                style={{ display: 'inline-block', color: '#0f172a', backgroundColor: '#fef08a', padding: '4px 12px', borderRadius: '16px', fontWeight: '700', fontSize: '0.85rem' }}
              >
                {woodName(section)}
              </h4>
              
              <div className="w-full overflow-x-auto my-2">
                <table className="quotation-doc__table w-full text-xs sm:text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="p-1.5 sm:p-2 border border-slate-200">#</th>
                      <th className="p-1.5 sm:p-2 border border-slate-200">{t('calculator.width')}</th>
                      <th className="p-1.5 sm:p-2 border border-slate-200">{t('calculator.thickness')}</th>
                      <th className="p-1.5 sm:p-2 border border-slate-200">{t('calculator.length')}</th>
                      <th className="p-1.5 sm:p-2 border border-slate-200">{t('calculator.quantity')}</th>
                      <th className="p-1.5 sm:p-2 border border-slate-200">{t('calculator.cft')}</th>
                      <th className="p-1.5 sm:p-2 border border-slate-200">{t('calculator.rate')}</th>
                      <th className="p-1.5 sm:p-2 border border-slate-200">{t('calculator.amount')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => {
                      const rowCft = row.cft !== undefined ? Number(row.cft) : calculateRowCFT(row);
                      const rowAmount = row.amount !== undefined ? Number(row.amount) : calculateRowAmount(row);

                      return (
                        <tr key={row.id || idx} className="border-b border-slate-200">
                          <td className="p-1.5 sm:p-2 border border-slate-200">{idx + 1}</td>
                          <td className="p-1.5 sm:p-2 border border-slate-200">{row.width || 0}</td>
                          <td className="p-1.5 sm:p-2 border border-slate-200">{row.thickness || row.height || 0}</td>
                          <td className="p-1.5 sm:p-2 border border-slate-200">{row.length || 0}</td>
                          <td className="p-1.5 sm:p-2 border border-slate-200">{row.quantity || row.pieces || 1}</td>
                          <td className="p-1.5 sm:p-2 border border-slate-200 font-semibold">{formatNumber(rowCft, 3)}</td>
                          <td className="p-1.5 sm:p-2 border border-slate-200">{formatCurrency(row.rate || 0)}</td>
                          <td className="p-1.5 sm:p-2 border border-slate-200 font-semibold">{formatCurrency(rowAmount)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={5} className="p-1.5 sm:p-2 border border-slate-200 text-right">Subtotal:</td>
                      <td className="p-1.5 sm:p-2 border border-slate-200">{formatNumber(totals.totalCFT || 0, 3)}</td>
                      <td className="p-1.5 sm:p-2 border border-slate-200"></td>
                      <td className="p-1.5 sm:p-2 border border-slate-200">{formatCurrency(totals.totalAmount || 0)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          );
        })}

        {activeCharges.length > 0 && (
          <section className="quotation-doc__charges my-4">
            <h4 className="text-sm font-bold text-slate-800 mb-2">{t('calculator.additionalCharges')}</h4>
            <div className="w-full overflow-x-auto">
              <table className="quotation-doc__table quotation-doc__table--compact w-full max-w-xs text-xs sm:text-sm">
                <tbody>
                  {activeCharges.map((c) => (
                    <tr key={c.key} className="border-b border-slate-200">
                      <td className="py-1.5 px-2">{t(`calculator.charge.${c.key}`)}</td>
                      <td className="py-1.5 px-2 font-semibold text-right">{formatCurrency(charges[c.key])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="quotation-doc__totals my-4 ml-auto max-w-xs border-t-2 border-slate-900 pt-2 space-y-1 text-xs sm:text-sm">
          <div className="quotation-doc__totals-row flex justify-between">
            <span>{t('calculator.sectionTotalCft')}:</span>
            <span className="font-semibold">{formatNumber(quotation.totalCFT || quotation.total_cft || 0, 3)}</span>
          </div>
          <div className="quotation-doc__totals-row flex justify-between">
            <span>{t('calculator.materialAmount')}:</span>
            <span className="font-semibold">{formatCurrency(quotation.materialTotal || quotation.grandTotal || 0)}</span>
          </div>
          <div className="quotation-doc__totals-row flex justify-between">
            <span>{t('calculator.additionalCharges')}:</span>
            <span className="font-semibold">{formatCurrency(quotation.chargesTotal || 0)}</span>
          </div>
          <div className="quotation-doc__totals-row quotation-doc__totals-row--grand flex justify-between text-base font-bold text-slate-900 border-t border-slate-300 pt-1 mt-1">
            <span>{t('calculator.grandTotal')}:</span>
            <span>{formatCurrency(quotation.grandTotal || quotation.total_amount || 0)}</span>
          </div>
        </section>

        {settings?.terms && (
          <section className="quotation-doc__terms my-4 pt-4 border-t border-slate-200 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800 mb-1">{t('quotation.termsTitle')}</h4>
            <p>{settings.terms}</p>
          </section>
        )}

        <footer className="quotation-doc__footer mt-6 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
          <p>{t('quotation.thankYou')}</p>
        </footer>
      </div>
    </div>
  );
}