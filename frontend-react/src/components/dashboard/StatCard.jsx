import "../../styles/components/stat-card.css";

function StatCard({ icon, title, value }) {
    return (
        <article className="stat-card">

            <div className="stat-icon">
                {icon}
            </div>

            <div className="stat-content">

                <span className="stat-title">
                    {title}
                </span>

                <h3 className="stat-value">
                    {value}
                </h3>

            </div>

        </article>
    );
}

export default StatCard;