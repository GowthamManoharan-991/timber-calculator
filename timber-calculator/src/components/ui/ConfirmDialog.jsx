import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  danger = true,
  onConfirm,
  onCancel
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
}
