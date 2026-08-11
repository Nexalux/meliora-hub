import { useState } from "react";
import { Link } from "react-router-dom";
import { useLearning } from "../../contexts/LearningContext";
import "../../styles/components/continue-learning-home.css";

const CARDS_PER_PAGE = 3;

function ContinueLearning({
    roadmaps,
    loading,
}) {
    const {
        getCompletedCount,
        getProgress,
    } = useLearning();

    const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);

   if (loading) {
    return (
        <section className="continue-section">

            <h2 className="section-title">
                Continue Learning
            </h2>

            <div className="continue-grid">

                {Array.from({ length: 3 }).map((_, index) => (

                    <div
                        key={index}
                        className="continue-loading-card"
                    >

                        <div className="continue-loading-top">
                            <div className="skeleton continue-loading-title" />
                            <div className="skeleton skeleton--circle continue-loading-percent" />

                        </div>

                        <div className="skeleton continue-loading-line" />
                        <div className="skeleton continue-loading-progress" />

                    </div>

                ))}

            </div>

        </section>
    );
}

    const startedRoadmaps = roadmaps
        .map((roadmap) => {
            const totalSteps =
                roadmap.steps?.length ??
                roadmap.steps_count ??
                0;
            const completedCount = getCompletedCount(roadmap.id);
            const progress = getProgress(roadmap.id, totalSteps);

            return {
                ...roadmap,
                totalSteps,
                completedCount,
                progress,
            };
        })
        .filter(
            (roadmap) =>
                roadmap.totalSteps > 0 &&
                roadmap.completedCount > 0
        )
        .sort((a, b) => b.progress - a.progress);

    if (startedRoadmaps.length === 0) {
        return null;
    }

    return (
        <section className="continue-section">

            <h2 className="section-title">
                Continue Learning
            </h2>

            <div className="continue-grid">

                {startedRoadmaps
                    .slice(0, visibleCount)
                    .map((roadmap) => {

                    const {
                        totalSteps,
                        completedCount,
                        progress,
                    } = roadmap;

                    return (

                        <Link
                            key={roadmap.id}
                            to={`/roadmap/${roadmap.id}`}
                            className="continue-card"
                        >

                            <div className="continue-top">

    <div className="continue-info">

        <h3>{roadmap.title}</h3>

        <p>
            {completedCount} of {totalSteps} steps completed
        </p>

    </div>

    <span className="continue-percent">
        {progress}%
    </span>

</div>

<div className="continue-progress-bar">

    <div
        className="continue-progress-fill"
        style={{
            width: `${progress}%`,
        }}
    />

</div>

<span className="continue-link">
    Continue →
</span>

                        </Link>

                    );

                })}

            </div>

            {startedRoadmaps.length > CARDS_PER_PAGE && (
                <div className="continue-actions">
                    {visibleCount > CARDS_PER_PAGE && (
                        <button
                            type="button"
                            className="continue-toggle"
                            onClick={() =>
                                setVisibleCount((count) =>
                                    Math.max(CARDS_PER_PAGE, count - CARDS_PER_PAGE)
                                )
                            }
                        >
                            Show less
                        </button>
                    )}

                    {visibleCount < startedRoadmaps.length && (
                        <button
                            type="button"
                            className="continue-toggle continue-toggle--primary"
                            onClick={() =>
                                setVisibleCount((count) =>
                                    Math.min(startedRoadmaps.length, count + CARDS_PER_PAGE)
                                )
                            }
                        >
                            Show more
                        </button>
                    )}
                </div>
            )}

        </section>
    );
}

export default ContinueLearning;
