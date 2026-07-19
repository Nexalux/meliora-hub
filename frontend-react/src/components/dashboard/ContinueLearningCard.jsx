import "../../styles/components/continue-learning-card.css";

function ContinueLearningCard({
    title = "Web Development Mastery",
    difficulty = "Beginner",
    duration = "3 Months",
    progress = 58,
    completedSteps = 7,
    totalSteps = 12,
}) {
    return (
        <article className="continue-card">

            <div className="continue-header">

                <div>

                    <span className="continue-label">
                        Continue Learning
                    </span>

                    <h2 className="continue-title">
                        {title}
                    </h2>

                    <p className="continue-meta">
                        {difficulty} • {duration}
                    </p>

                </div>

            </div>

            <div className="progress-section">

                <div className="progress-bar">

                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    />

                </div>

                <div className="progress-info">

                    <span>
                        {completedSteps} of {totalSteps} steps completed
                    </span>

                    <span>{progress}%</span>

                </div>

            </div>

            <div className="continue-footer">

                <button className="resume-btn">
                    Resume Learning →
                </button>

            </div>

        </article>
    );
}

export default ContinueLearningCard;