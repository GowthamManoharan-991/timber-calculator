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
    <div className="quotation-doc" id="quotation-print-area">
      <header className="quotation-doc__header">
        <div className="quotation-doc__company">
          {settings?.logo && <img src={settings.logo} alt="" className="quotation-doc__logo" />}
          <div>
            <h2>{settings?.companyName || 'Your Timber Shop'}</h2>
            {settings?.address && <p>{settings.address}</p>}
            <p>
              {settings?.phone && <>Ph: {settings.phone} </>}
              {settings?.gstNumber && <>· GSTIN: {settings.gstNumber}</>}
            </p>
          </div>
        </div>
        <div className="quotation-doc__meta">
          <h3>{t('quotation.title')}</h3>
          <p>
            <strong>{t('quotation.number')}:</strong> {quotation.quotationNumber || quotation.quotation_number}
          </p>
          <p>
            <strong>{t('common.date')}:</strong> {formatDate(quotation.date || quotation.created_at)}
          </p>
        </div>
      </header>

      <section className="quotation-doc__customer">
        <h4>{t('quotation.billTo')}</h4>
        <p className="quotation-doc__customer-name">{customerSnapshot?.name || 'Guest Customer'}</p>
        {customerSnapshot?.phone && <p>Ph: {customerSnapshot.phone}</p>}
        {customerSnapshot?.address && <p>{customerSnapshot.address}</p>}
        {customerSnapshot?.gstNumber && <p>GSTIN: {customerSnapshot.gstNumber}</p>}
      </section>

      {sections.map((section, sIdx) => {
        const rows = section.rows || [];
        const totals = calculateSectionTotals ? calculateSectionTotals(section) : {
          totalCFT: rows.reduce((acc, r) => acc + (Number(r.cft) || calculateRowCFT(r) || 0), 0),
          totalAmount: rows.reduce((acc, r) => acc + (Number(r.amount) || calculateRowAmount(r) || 0), 0),
        };

        return (
          <section key={section.id || sIdx} className="quotation-doc__section">
            <h4>{woodName(section)}</h4>
            <table className="quotation-doc__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('calculator.width')}</th>
                  <th>{t('calculator.thickness')}</th>
                  <th>{t('calculator.length')}</th>
                  <th>{t('calculator.quantity')}</th>
                  <th>{t('calculator.cft')}</th>
                  <th>{t('calculator.rate')}</th>
                  <th>{t('calculator.amount')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const rowCft = row.cft !== undefined ? Number(row.cft) : calculateRowCFT(row);
                  const rowAmount = row.amount !== undefined ? Number(row.amount) : calculateRowAmount(row);

                  return (
                    <tr key={row.id || idx}>
                      <td>{idx + 1}</td>
                      <td>{row.width || 0}</td>
                      <td>{row.thickness || row.height || 0}</td>
                      <td>{row.length || 0}</td>
                      <td>{row.quantity || row.pieces || 1}</td>
                      <td>{formatNumber(rowCft, 3)}</td>
                      <td>{formatCurrency(row.rate || 0)}</td>
                      <td>{formatCurrency(rowAmount)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5}></td>
                  <td colSpan={1}>
                    <strong>{formatNumber(totals.totalCFT || 0, 3)}</strong>
                  </td>
                  <td></td>
                  <td>
                    <strong>{formatCurrency(totals.totalAmount || 0)}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </section>
        );
      })}

      {activeCharges.length > 0 && (
        <section className="quotation-doc__charges">
          <h4>{t('calculator.additionalCharges')}</h4>
          <table className="quotation-doc__table quotation-doc__table--compact">
            <tbody>
              {activeCharges.map((c) => (
                <tr key={c.key}>
                  <td>{t(`calculator.charge.${c.key}`)}</td>
                  <td>{formatCurrency(charges[c.key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="quotation-doc__totals">
        <div className="quotation-doc__totals-row">
          <span>{t('calculator.sectionTotalCft')}</span>
          <span>{formatNumber(quotation.totalCFT || quotation.total_cft || 0, 3)}</span>
        </div>
        <div className="quotation-doc__totals-row">
          <span>{t('calculator.materialAmount')}</span>
          <span>{formatCurrency(quotation.materialTotal || quotation.grandTotal || 0)}</span>
        </div>
        <div className="quotation-doc__totals-row">
          <span>{t('calculator.additionalCharges')}</span>
          <span>{formatCurrency(quotation.chargesTotal || 0)}</span>
        </div>
        <div className="quotation-doc__totals-row quotation-doc__totals-row--grand">
          <span>{t('calculator.grandTotal')}</span>
          <span>{formatCurrency(quotation.grandTotal || quotation.total_amount || 0)}</span>
        </div>
      </section>

      {settings?.terms && (
        <section className="quotation-doc__terms">
          <h4>{t('quotation.termsTitle')}</h4>
          <p>{settings.terms}</p>
        </section>
      )}

      <footer className="quotation-doc__footer">
        <p>{t('quotation.thankYou')}</p>
      </footer>
    </div>
  );
}