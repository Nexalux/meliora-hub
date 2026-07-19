import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaClock,
  FaSignal,
  FaBookOpen,
} from "react-icons/fa6";

import BookmarkButton from "../ui/BookmarkButton";

import "../../styles/components/roadmap-card.css";

function RoadmapCard({
  roadmap,
  variant = "home",
}) {
  const description =
    roadmap.short_description?.trim() ||
    roadmap.data?.basic?.short_description?.trim() ||
    "No description available yet.";

  const totalSteps =
    roadmap.steps_count ??
    roadmap.data?.steps?.length ??
    0;

  const difficulty =
    roadmap.difficulty?.name || null;

  const duration =
    roadmap.duration_text ||
    (typeof roadmap.duration === "string"
    ? roadmap.duration
    : roadmap.duration?.name) ||
    null;

  const buttonText =
    variant === "bookmark"
      ? "Continue Learning"
      : "Start Learning";

  return (
    <article className="roadmap-card">
      {/* Bookmark */}

      <div className="roadmap-bookmark">
        <BookmarkButton roadmapId={roadmap.id} />
      </div>

      {/* Clickable Card */}

      <Link
        to={`/roadmap/${roadmap.id}`}
        className="roadmap-card-link"
      >
        <div className="roadmap-card-accent" />

        <div className="roadmap-card-content">

          <h3 className="roadmap-card-title">
            {roadmap.title}
          </h3>

          <p className="roadmap-card-description">
            {description}
          </p>

          <div className="roadmap-card-tags">

            {difficulty && (
              <span className="roadmap-tag">
                <FaSignal />
                <span>{difficulty}</span>
              </span>
            )}

            {duration && (
              <span className="roadmap-tag">
                <FaClock />
                <span>{duration}</span>
              </span>
            )}

            {totalSteps > 0 && (
              <span className="roadmap-tag">
                <FaBookOpen />
                <span>{totalSteps} Steps</span>
              </span>
            )}

          </div>

        </div>

        <div className="roadmap-card-footer">

          <span className="roadmap-link">
            {buttonText}
          </span>

          <FaArrowRight className="roadmap-arrow" />

        </div>

      </Link>
    </article>
  );
}

export default RoadmapCard;