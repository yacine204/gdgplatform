const StatCard = ({ label, value, accent = 'var(--color-primary)' }) => (
	<div className="card stat-card" style={{ borderColor: accent }}>
		<p className="card__label">{label}</p>
		<h3 className="card__value">{value}</h3>
	</div>
);

export default StatCard;
