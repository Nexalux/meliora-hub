import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaBookOpen,
  FaBullseye,
  FaClock,
  FaSignal,
  FaFire,
  FaRocket,
  FaTrophy
} from "react-icons/fa6";

import DashboardEmpty from "./DashboardEmpty";

import "../../styles/components/continue-learning-card.css";

function ContinueLearningCard({ roadmap }) {
  if (!roadmap) {
    return (
      <article className="continue-card">
        <DashboardEmpty
          icon={<FaBookOpen />}
          title="No roadmap in progress"
          description="Start learning from any roadmap to track your progress here."
        />
      </article>
    );
  }

  const {
    id,
    title,
    duration,
    difficulty,
    completed_count,
    total_steps,
    progress_percent,
    next_step,
  } = roadmap;

  const progress = progress_percent ?? 0;

 function getProgressMessage(percent) {
  if (percent >= 100)
    return (
      <>
        <FaTrophy />
        <span>Completed</span>
      </>
    );

  if (percent >= 80)
    return (
      <>
        <FaBullseye />
        <span>Almost Finished</span>
      </>
    );

  if (percent >= 50)
    return (
      <>
        <FaFire />
        <span>Great Progress</span>
      </>
    );

  if (percent >= 20)
    return (
      <>
        <FaBookOpen />
        <span>Building Momentum</span>
      </>
    );

  return (
    <>
      <FaRocket />
      <span>Getting Started</span>
    </>
  );
}

  return (
    <article className="continue-card">

      {/* Header */}

      <div className="continue-card__top">

        <div>

          <span className="continue-card__badge">
            Continue Learning
          </span>

          <h2 className="continue-card__title">
            {title}
          </h2>

          <p className="continue-card__meta">
            {difficulty?.name} • {duration}
          </p>

        </div>

        <div className="continue-card__percentage">

          <span>{progress}%</span>

        </div>

      </div>

      {/* Progress */}

      <div className="continue-card__progress">

        <div className="continue-card__progress-bar">

          <div
            className="continue-card__progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

       <div className="continue-card__progress-footer">

  <span className="continue-card__status">

    {getProgressMessage(progress)}

    {" • "}

    {completed_count}/{total_steps} Steps

  </span>

</div>

      </div>

      {/* Up Next */}

      {next_step && (

        <div className="continue-card__next">

          <div className="continue-card__next-icon">

            <FaBullseye />

          </div>

          <div className="continue-card__next-content">

            <span className="continue-card__label">

              Up Next

            </span>

            <h3>

              {next_step.title}

            </h3>

            <div className="continue-card__step-meta">

              <span>

                <FaSignal />

                {next_step.difficulty}

                {" • "}

                <FaClock />

                {next_step.duration}

              </span>

            </div>

          </div>

        </div>

      )}

      <Link
        to={`/roadmap/${id}`}
        className="continue-card__button"
      >

        Continue

        <FaArrowRight />

      </Link>

    </article>
  );
}

export default ContinueLearningCard;
