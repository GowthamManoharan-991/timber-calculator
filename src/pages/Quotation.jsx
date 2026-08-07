import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { quotationService } from '../services/quotationService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import QuotationPreview from '../components/quotation/QuotationPreview';

export default function Quotation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings, removeQuotation, duplicateQuotation } = useApp();
  const toast = useToast();
  const { t } = useLanguage();

  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await quotationService.getQuotation(id);
        if (!data) {
          toast.error('Quotation not found');
          navigate('/history');
          return;
        }
        setQuotation(data);
      } catch (err) {
        toast.error(err.message || 'Failed to load quotation');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePrint = () => window.print();

  const handleDuplicate = async () => {
    try {
      const clone = await duplicateQuotation(id);
      toast.success(t('common.duplicate'));
      navigate(`/quotation/${clone.id}`);
    } catch (err) {
      toast.error(err.message || 'Could not duplicate quotation');
    }
  };

  const handleDelete = async () => {
    try {
      await removeQuotation(id);
      toast.success(t('common.delete'));
      navigate('/history');
    } catch (err) {
      toast.error(err.message || 'Could not delete quotation');
    }
  };

  if (loading) return <Spinner label={t('common.loading')} />;
  if (!quotation) return null;

  return (
    <div className="page">
      <div className="quotation-toolbar no-print">
        <Link to="/history" className="link">
          &larr; {t('quotation.backToHistory')}
        </Link>
        <div className="quotation-toolbar__actions">
          <Button variant="secondary" onClick={() => navigate(`/calculator/${id}`)}>
            {t('common.edit')}
          </Button>
          <Button variant="secondary" onClick={handleDuplicate}>
            {t('common.duplicate')}
          </Button>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            {t('common.delete')}
          </Button>
          <Button onClick={handlePrint}>{t('quotation.printSave')}</Button>
        </div>
      </div>

      <Card className="quotation-card" noPadding>
        <QuotationPreview quotation={quotation} settings={settings} />
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        title={t('common.delete')}
        message={`${t('common.delete')} ${quotation.quotationNumber}?`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
