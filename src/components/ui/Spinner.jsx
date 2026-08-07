export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className="spinner" />
      {label && <span className="spinner__label">{label}</span>}
    </div>
  );
}
