import { useEffect } from 'react';

export default function Modal({ open, title, onClose, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onMouseDown={onClose}
    >
      <div
        className={`modal modal--${size} relative w-full max-w-lg bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[80vh] sm:max-h-[90vh] mb-20 sm:mb-0 border border-slate-800`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal__header flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            className="modal__close text-slate-400 hover:text-white p-1 text-xl leading-none"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="modal__body p-4 overflow-y-auto space-y-4 flex-1 text-slate-200">
          {children}
        </div>

        {/* Footer (Sticky at bottom) */}
        {footer && (
          <div className="modal__footer p-4 border-t border-slate-800 bg-slate-900 shrink-0 flex items-center justify-end gap-3 pb-6 sm:pb-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}