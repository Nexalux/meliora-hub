import {
  FaBookmark,
  FaCheckCircle,
  FaClock,
  FaEye,
} from "react-icons/fa";

import "../../styles/components/activity-item.css";

function formatRelativeTime(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString.replace(" ", "T"));
  const now = new Date();

  const seconds = Math.floor(
    (now - date) / 1000
  );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return date.toLocaleDateString();
}

function ActivityItem({ activity }) {

  let icon = <FaCheckCircle />;
  let modifier = "completed";

  switch (activity.type) {

    case "roadmap_bookmarked":
      icon = <FaBookmark />;
      modifier = "bookmark";
      break;

    case "roadmap_opened":
      icon = <FaEye />;
      modifier = "opened";
      break;

    default:
      icon = <FaCheckCircle />;
      modifier = "completed";
      break;

  }

  const timestamp =
    activity.timestamp ||
    activity.completed_at ||
    activity.created_at ||
    activity.opened_at;

  return (

    <article
      className={`activity-item activity-item--${modifier}`}
    >

      <div className="activity-item__icon">
        {icon}
      </div>

      <div className="activity-item__content">

        <h4 className="activity-item__title">
          {activity.title}
        </h4>

        <p className="activity-item__description">
          {activity.description}
        </p>

      </div>

      <time className="activity-item__time">

        <FaClock />

        {formatRelativeTime(timestamp)}

      </time>

    </article>

  );

}

export default ActivityItem;