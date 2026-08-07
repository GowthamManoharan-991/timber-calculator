export default function EmptyState({ icon = '📋', title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        {icon}
      </div>
      <h4>{title}</h4>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
