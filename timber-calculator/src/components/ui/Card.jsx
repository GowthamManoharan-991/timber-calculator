export default function Card({ title, action, children, className = '', noPadding = false }) {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {action && <div className="card__action">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'card__body'}>{children}</div>
    </div>
  );
}
