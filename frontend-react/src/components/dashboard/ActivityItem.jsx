import "../../styles/components/activity-item.css";

function ActivityItem({
    icon,
    title,
    time,
}) {
    return (
        <article className="activity-item">

            <div className="activity-icon">
                {icon}
            </div>

            <div className="activity-content">

                <h4 className="activity-title">
                    {title}
                </h4>

                <span className="activity-time">
                    {time}
                </span>

            </div>

        </article>
    );
}

export default ActivityItem;