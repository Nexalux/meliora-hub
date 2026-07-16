import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaClock,
  FaSignal,
  FaBookOpen,
} from "react-icons/fa6";

import BookmarkButton from "../ui/BookmarkButton";
import "../../styles/components/roadmap-card.css";

function RoadmapCard({ roadmap }) {

  const description =
    roadmap.data?.basic?.short_description?.trim() ||
    "No description available yet.";

  const totalSteps =
    roadmap.data?.steps?.length || 0;

  return (

    <div className="roadmap-card">

      {/* Bookmark */}

      <div className="roadmap-bookmark">

       <BookmarkButton
  roadmapId={roadmap.id}
/>

      </div>

      {/* Clickable Card */}

      <Link
        to={`/roadmap/${roadmap.id}`}
        className="roadmap-card-link"
      >

        {/* Accent */}

        <div className="roadmap-card-accent"></div>
        <div className="roadmap-card-content">

          <h3 className="roadmap-card-title">
            {roadmap.title}
          </h3>

          <p className="roadmap-card-description">
            {description}
          </p>

          <div className="roadmap-card-tags">

            {roadmap.difficulty && (

              <span className="roadmap-tag">
                <FaSignal />
                {roadmap.difficulty.name}
              </span>

            )}

            {roadmap.duration && (

              <span className="roadmap-tag">
                <FaClock />
                {roadmap.duration.name}
              </span>

            )}

            {totalSteps > 0 && (

              <span className="roadmap-tag">
                <FaBookOpen />
                {totalSteps} Steps
              </span>

            )}

          </div>

        </div>

        <div className="roadmap-card-footer">
          <span className="roadmap-link">
            Start Learning
          </span>

          <FaArrowRight
            className="roadmap-arrow"
          />

        </div>
      </Link>
    </div>

  );

}

export default RoadmapCard;