import "../../styles/components/dashboard-empty.css";

function DashboardEmpty({
    icon,
    title,
    description,
}) {
    return (
        <div className="dashboard-empty">

            <div className="dashboard-empty__icon">
                {icon}
            </div>

            <h3 className="dashboard-empty__title">
                {title}
            </h3>

            <p className="dashboard-empty__description">
                {description}
            </p>

        </div>
    );
}

export default DashboardEmpty;