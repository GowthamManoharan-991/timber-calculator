import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import QuotationPreview from '../components/quotation/QuotationPreview';
import Spinner from '../components/ui/Spinner';

export default function QuotationView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quotations, settings, removeQuotation, duplicateQuotation } = useApp();
  const { t } = useLanguage();
  
  const quotation = quotations.find((q) => String(q.id) === String(id));

  if (!quotation) {
    return <Spinner label={t('common.loading')} />;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="quotation-view-page w-full max-w-full overflow-x-hidden p-2 sm:p-6 pb-24">
      {/* Top Action Buttons - Scrollable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 w-full no-scrollbar">
        <button
          onClick={() => navigate(`/calculator/${quotation.id}`)}
          className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg shrink-0"
        >
          {t('common.edit')}
        </button>
        <button
          onClick={async () => {
            const clone = await duplicateQuotation(quotation.id);
            navigate(`/quotation/${clone.id}`);
          }}
          className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg shrink-0"
        >
          {t('common.duplicate')}
        </button>
        <button
          onClick={async () => {
            await removeQuotation(quotation.id);
            navigate('/history');
          }}
          className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg shrink-0"
        >
          {t('common.delete')}
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 text-sm font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg shrink-0"
        >
          Print / Save PDF
        </button>
      </div>

      {/* Main Document Preview Wrapper - Fits screen without forced min-width */}
      <div className="w-full max-w-full overflow-x-auto">
        <QuotationPreview quotation={quotation} settings={settings} />
      </div>
    </div>
  );
}