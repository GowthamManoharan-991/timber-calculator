export default function StatCard({ label, value, icon, accent = 'amber' }) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__icon" aria-hidden="true">
        {icon}
      </div>
      <div>
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
      </div>
    </div>
  );
}
