import "../../styles/components/stat-card.css";

function StatCard({
    icon,
    title,
    value,
    subtitle,
}) {
    return (
        <article className="stat-card">
            <div className="stat-card__icon">
                {icon}
            </div>

            <div className="stat-card__content">
                <span className="stat-card__title">
                    {title}
                </span>

                <h3 className="stat-card__value">
                    {value}
                </h3>

                {subtitle && (
                    <span className="stat-card__subtitle">
                        {subtitle}
                    </span>
                )}
            </div>
        </article>
    );
}

export default StatCard;