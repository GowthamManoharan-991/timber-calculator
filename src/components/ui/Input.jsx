export default function Input({
  label,
  id,
  error,
  hint,
  required = false,
  className = '',
  ...rest
}) {
  const inputId = id || rest.name;
  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="field__label">
          {label} {required && <span className="field__required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`field__input ${error ? 'field__input--error' : ''}`}
        aria-invalid={!!error}
        {...rest}
      />
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
