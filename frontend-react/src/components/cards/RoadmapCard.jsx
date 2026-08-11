import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaBookOpen,
    FaClock,
    FaSignal,
} from "react-icons/fa6";

import BookmarkButton from "../ui/BookmarkButton";

import "../../styles/components/roadmap-card.css";

function RoadmapCard({
    roadmap,
    variant = "home",
}) {

   const description =
    roadmap.short_description
        ?.replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim() ||
    "No description available yet.";

    const totalSteps =
        roadmap.steps_count ??
        roadmap.steps?.length ??
        0;

    const difficulty =
        roadmap.difficulty?.name ?? null;

    const duration =
        typeof roadmap.duration === "string"
            ? roadmap.duration
            : roadmap.duration?.name ?? null;

    const buttonText =
        variant === "bookmark"
            ? "Continue Learning"
            : "Start Learning";

    return (

        <article className="roadmap-card">

            <div className="roadmap-card__bookmark">

                <BookmarkButton roadmapId={roadmap.id} />

            </div>

            <Link
                to={`/roadmap/${roadmap.id}`}
                className="roadmap-card__link"
                aria-label={`Open roadmap: ${roadmap.title}`}
            >

                <div className="roadmap-card__content">

                    <h3 className="roadmap-card__title">
                        {roadmap.title}
                    </h3>

                    <p className="roadmap-card__description">
                        {description}
                    </p>

                    <div className="roadmap-card__tags">

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

                <footer className="roadmap-card__footer">

                    <span className="roadmap-card__cta">
                        {buttonText}
                    </span>

                    <FaArrowRight className="roadmap-card__arrow" />

                </footer>

            </Link>

        </article>

    );

}

export default RoadmapCard;