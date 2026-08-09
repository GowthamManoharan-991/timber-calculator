import { CUSTOM_WOOD_TYPE, CHARGE_TYPES } from '../../utils/constants';
import { calculateRowAmount, calculateRowCFT, calculateSectionTotals } from '../../utils/calculations';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

export default function QuotationPreview({ quotation, settings }) {
  const { t } = useLanguage();
  if (!quotation) return null;

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
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'auto', paddingBottom: '16px' }}>
      <div 
        className="quotation-doc" 
        id="quotation-print-area"
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          padding: '12px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          color: '#0f172a'
        }}
      >
        {/* Header - Left-Aligned Meta */}
        <header style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
          <div className="quotation-doc__company" style={{ textAlign: 'left' }}>
            {settings?.logo && <img src={settings.logo} alt="" style={{ height: '48px', objectFit: 'contain', marginBottom: '8px' }} />}
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0' }}>{settings?.companyName || 'Your Timber Shop'}</h2>
              {settings?.address && <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0' }}>{settings.address}</p>}
              <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0' }}>
                {settings?.phone && <>Ph: {settings.phone} </>}
                {settings?.gstNumber && <>· GSTIN: {settings.gstNumber}</>}
              </p>
            </div>
          </div>

          {/* Left-aligned "QUOTATION" header block */}
          <div className="quotation-doc__meta" style={{ textAlign: 'left', paddingTop: '4px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('quotation.title')}
            </h3>
            <p style={{ fontSize: '12px', margin: '2px 0', color: '#334155' }}>
              <strong>{t('quotation.number')}:</strong> {quotation.quotationNumber || quotation.quotation_number}
            </p>
            <p style={{ fontSize: '12px', margin: '2px 0', color: '#334155' }}>
              <strong>{t('common.date')}:</strong> {formatDate(quotation.date || quotation.created_at)}
            </p>
          </div>
        </header>

        {/* Bill To */}
        <section style={{ margin: '12px 0', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', textAlign: 'left' }}>
          <h4 style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700', color: '#94a3b8', margin: '0 0 2px 0' }}>
            {t('quotation.billTo')}
          </h4>
          <p style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 2px 0', color: '#0f172a' }}>
            {customerSnapshot?.name || 'Guest Customer'}
          </p>
          {customerSnapshot?.phone && <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0' }}>Ph: {customerSnapshot.phone}</p>}
          {customerSnapshot?.address && <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0' }}>{customerSnapshot.address}</p>}
          {customerSnapshot?.gstNumber && <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0' }}>GSTIN: {customerSnapshot.gstNumber}</p>}
        </section>

        {/* Sections & Tables */}
        {sections.map((section, sIdx) => {
          const rows = section.rows || [];
          const totals = calculateSectionTotals ? calculateSectionTotals(section) : {
            totalCFT: rows.reduce((acc, r) => acc + (Number(r.cft) || calculateRowCFT(r) || 0), 0),
            totalAmount: rows.reduce((acc, r) => acc + (Number(r.amount) || calculateRowAmount(r) || 0), 0),
          };

          return (
            <section key={section.id || sIdx} style={{ margin: '12px 0', textAlign: 'left' }}>
              <h4 
                style={{
                  display: 'inline-block',
                  color: '#0f172a',
                  backgroundColor: '#F7BA00',
                  padding: '3px 10px',
                  borderRadius: '5px',
                  fontWeight: '700',
                  fontSize: '12px',
                  marginBottom: '8px'
                }}
              >
                {woodName(section)}
              </h4>
              
              <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', minWidth: '450px', fontSize: '11px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', color: '#334155' }}>
                      <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0', textAlign: 'center' }}>#</th>
                      <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}>{t('calculator.width')}</th>
                      <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}>{t('calculator.thickness')}</th>
                      <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}>{t('calculator.length')}</th>
                      <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{t('calculator.quantity')}</th>
                      <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{t('calculator.cft')}</th>
                      <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{t('calculator.rate')}</th>
                      <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{t('calculator.amount')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => {
                      const rowCft = row.cft !== undefined ? Number(row.cft) : calculateRowCFT(row);
                      const rowAmount = row.amount !== undefined ? Number(row.amount) : calculateRowAmount(row);

                      return (
                        <tr key={row.id || idx}>
                          <td style={{ padding: '6px 4px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{idx + 1}</td>
                          <td style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}>{row.width || 0}</td>
                          <td style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}>{row.thickness || row.height || 0}</td>
                          <td style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}>{row.length || 0}</td>
                          <td style={{ padding: '6px 4px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{row.quantity || row.pieces || 1}</td>
                          <td style={{ padding: '6px 4px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: '600' }}>{formatNumber(rowCft, 3)}</td>
                          <td style={{ padding: '6px 4px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{formatCurrency(row.rate || 0)}</td>
                          <td style={{ padding: '6px 4px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: '600' }}>{formatCurrency(rowAmount)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ backgroundColor: '#f8fafc', fontWeight: '700' }}>
                      <td colSpan={5} style={{ padding: '6px 4px', border: '1px solid #e2e8f0', textAlign: 'right' }}>Subtotal:</td>
                      <td style={{ padding: '6px 4px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{formatNumber(totals.totalCFT || 0, 3)}</td>
                      <td style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}></td>
                      <td style={{ padding: '6px 4px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{formatCurrency(totals.totalAmount || 0)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          );
        })}

        {/* Additional Charges */}
        {activeCharges.length > 0 && (
          <section style={{ margin: '12px 0', textAlign: 'left' }}>
            <h4 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>{t('calculator.additionalCharges')}</h4>
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', maxWidth: '280px', fontSize: '12px' }}>
                <tbody>
                  {activeCharges.map((c) => (
                    <tr key={c.key} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '4px 6px' }}>{t(`calculator.charge.${c.key}`)}</td>
                      <td style={{ padding: '4px 6px', fontWeight: '600', textAlign: 'right' }}>{formatCurrency(charges[c.key])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Totals Section */}
        <section style={{ margin: '12px 0 0 auto', maxWidth: '280px', borderTop: '2px solid #0f172a', paddingTop: '8px', fontSize: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
            <span>{t('calculator.sectionTotalCft')}:</span>
            <span style={{ fontWeight: '600' }}>{formatNumber(quotation.totalCFT || quotation.total_cft || 0, 3)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
            <span>{t('calculator.materialAmount')}:</span>
            <span style={{ fontWeight: '600' }}>{formatCurrency(quotation.materialTotal || quotation.grandTotal || 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
            <span>{t('calculator.additionalCharges')}:</span>
            <span style={{ fontWeight: '600' }}>{formatCurrency(quotation.chargesTotal || 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0 0 0', marginTop: '4px', borderTop: '1px solid #cbd5e1', fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
            <span>{t('calculator.grandTotal')}:</span>
            <span>{formatCurrency(quotation.grandTotal || quotation.total_amount || 0)}</span>
          </div>
        </section>

        {/* Terms */}
        {settings?.terms && (
          <section style={{ margin: '12px 0 0 0', paddingTop: '12px', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#475569', textAlign: 'left' }}>
            <h4 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '2px' }}>{t('quotation.termsTitle')}</h4>
            <p style={{ margin: '0' }}>{settings.terms}</p>
          </section>
        )}

        <footer style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
          <p style={{ margin: '0' }}>{t('quotation.thankYou')}</p>
        </footer>
      </div>
    </div>
  );
}