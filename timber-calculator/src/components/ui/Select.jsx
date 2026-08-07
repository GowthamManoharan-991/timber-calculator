export default function Select({
  label,
  id,
  error,
  required = false,
  options = [],
  placeholder = 'Select...',
  className = '',
  ...rest
}) {
  const selectId = id || rest.name;
  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={selectId} className="field__label">
          {label} {required && <span className="field__required">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`field__input field__select ${error ? 'field__input--error' : ''}`}
        aria-invalid={!!error}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
