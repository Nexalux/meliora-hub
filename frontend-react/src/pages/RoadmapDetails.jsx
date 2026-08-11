import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaBookOpen,
  FaBullseye,
  FaCheck,
  FaClock,
  FaGithub,
  FaLightbulb,
  FaLink,
  FaSignal,
  FaYoutube,
} from "react-icons/fa6";

import { getRoadmap } from "../api/roadmaps";
import { recordRoadmapVisit } from "../api/learning";

import BookmarkButton from "../components/ui/BookmarkButton";
import InfoCard from "../components/cards/InfoCard";
import ProgressCard from "../components/cards/ProgressCard";
import ResourceCard from "../components/cards/ResourceCard";
import RoadmapDetailsSkeleton from "../components/skeletons/RoadmapDetailsSkeleton";
import SkillTag from "../components/ui/SkillTag";
import StepResources from "../components/details/StepResources";

import { useAuth } from "../contexts/AuthContext";
import { useLearning } from "../contexts/LearningContext";

import "../styles/pages/details.css";

const STEP_BATCH_SIZE = 20;

function RoadmapDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleStepCount, setVisibleStepCount] = useState(
    STEP_BATCH_SIZE
  );

  const {
    isCompleted,
    isSaving,
    toggleStep,
    getCompletedCount,
    getProgress,
  } = useLearning();

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadRoadmap() {
      try {
        setLoading(true);
        setError("");
        setVisibleStepCount(STEP_BATCH_SIZE);

        const data = await getRoadmap(id, {
          signal: controller.signal,
        });

        if (!active) {
          return;
        }

        setRoadmap(data);

        if (user) {
          try {
            await recordRoadmapVisit(Number(id));
          } catch (visitError) {
            console.error(
              "Failed to record roadmap visit:",
              visitError
            );
          }
        }
      } catch (err) {
        if (!active) {
          return;
        }

        setError(
          err?.message ||
          "Failed to load roadmap."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRoadmap();

    return () => {
      active = false;
      controller.abort();
    };
  }, [id, user]);

  function toSkills(text = "") {
    return text
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function handleStepToggle(stepId) {
    if (!user) {
      navigate("/login", {
        state: {
          from: `${location.pathname}${location.search}${location.hash}`,
        },
      });
      return;
    }

    toggleStep(roadmap.id, stepId);
  }


  if (loading) {
    return <RoadmapDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="details-page">
        <div
          className="details-message"
          role="alert"
        >
          {error}
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="details-page">
        <div className="details-message">
          Roadmap not found.
        </div>
      </div>
    );
  }

  const learning = roadmap.learning ?? {};
  const resources = roadmap.resources ?? {};
  const steps = Array.isArray(roadmap.steps)
    ? roadmap.steps
    : [];

  const visibleSteps = steps.slice(0, visibleStepCount);

  const completedCount =
    getCompletedCount(roadmap.id);

  const progressPercent =
    getProgress(
      roadmap.id,
      steps.length
    );

  return (
    <div className="details-page">

      <Link
        to="/"
        className="back-link"
      >
        ← Back to Roadmaps
      </Link>

      {/* HEADER */}

      <div className="roadmap-hero">

        <div className="roadmap-hero-top">

          <div>

            <h1>{roadmap.title}</h1>

           {roadmap.short_description && (
  <div
    className="roadmap-description rich-content"
    dangerouslySetInnerHTML={{
      __html: roadmap.short_description,
    }}
  />
)}

          </div>

          <div className="desktop-bookmark">

            <BookmarkButton
              roadmapId={roadmap.id}
            />

          </div>

        </div>

        <div className="roadmap-badges">

          {roadmap.difficulty && (
            <span className="roadmap-badge">

              <span className="badge-icon">
                <FaSignal />
              </span>

              {roadmap.difficulty.name}

            </span>
          )}

          {roadmap.duration && (
            <span className="roadmap-badge">

              <span className="badge-icon">
                <FaClock />
              </span>

              {roadmap.duration}

            </span>
          )}

          <div className="mobile-bookmark">

            <BookmarkButton
              roadmapId={roadmap.id}
            />

          </div>

        </div>

      </div>

      {/* PROGRESS */}

      <ProgressCard
        completedCount={completedCount}
        totalSteps={steps.length}
        progressPercent={progressPercent}
      />

      {/* LEARNING */}

      <div className="details-grid">

        <InfoCard
          icon={<FaBookOpen />}
          title="Prerequisites"
        >

         <div
  className="rich-content"
  dangerouslySetInnerHTML={{
    __html: learning.prerequisites || "",
  }}
/>

        </InfoCard>

        <InfoCard
          icon={<FaLink />}
          title="Resources"
        >

          <div className="resource-list">

            <ResourceCard
              icon={<FaBookOpen />}
              title="Official Docs"
              url={resources.docs}
            />

            <ResourceCard
              icon={<FaGithub />}
              title="GitHub"
              url={resources.github}
            />

            <ResourceCard
              icon={<FaLink />}
              title="Roadmap.sh"
              url={resources.roadmapsh}
            />

            <ResourceCard
              icon={<FaYoutube />}
              title="YouTube"
              url={resources.youtube}
            />

            <ResourceCard
              icon={<FaBookOpen />}
              title="Course"
              url={resources.course}
            />

          </div>

        </InfoCard>

      </div>

      <InfoCard
        icon={<FaBullseye />}
        title="Learning Outcomes"
      >

        <div
  className="rich-content"
  dangerouslySetInnerHTML={{
    __html: learning.outcomes || "",
  }}
/>

      </InfoCard>

      <InfoCard
        icon={<FaLightbulb />}
        title="Skills Covered"
      >

        <div className="skills-container">

          {toSkills(learning.skills).map(
  (skill, index) => (
    <SkillTag
      key={`${skill}-${index}`}
      skill={skill}
    />
  )
)}

        </div>

      </InfoCard>

      {/* STEPS */}

      <div className="steps-section">

        <div className="section-heading">

          <h2>Learning Steps</h2>

          <p>
            Complete each step to track your progress.
          </p>

        </div>

        {steps.length === 0 ? (
          <p>No learning steps yet.</p>
        ) : (
          <>
          {visibleSteps.map((step, index) => {
            const completed =
              isCompleted(step.id);

            const saving =
              isSaving(step.id);

            return (
              <div
                key={step.id}
                className={`step-card ${
                  completed ? "completed" : ""
                }`}
              >

                <div className="step-header">

                  <button
                    type="button"
                    className={`step-checkbox ${
                      completed ? "checked" : ""
                    }`}
                    disabled={saving}
                    onClick={() => handleStepToggle(step.id)}
                    aria-label={
                      !user
                        ? "Log in to track this step"
                        : completed
                        ? "Mark as incomplete"
                        : "Mark as complete"
                    }
                    aria-pressed={completed}
                  >

                    {completed && <FaCheck />}

                  </button>

                  <div className="step-content">

                    <div className="step-label">

                      <span className="step-number">
                        STEP{" "}
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      {completed && (
                        <span className="step-status">
                          Completed
                        </span>
                      )}

                    </div>

                    <h3>{step.title}</h3>

                  </div>

                </div>

                <div
  className="step-description rich-content"
  dangerouslySetInnerHTML={{
    __html: step.description || "",
  }}
/>

                <div className="step-footer">

                  <div className="step-meta">

                    {step.duration && (
                      <span>
                        <FaClock />
                        {step.duration}
                      </span>
                    )}

                    {step.difficulty && (
                      <span>
                        <FaBullseye />
                        {step.difficulty}
                      </span>
                    )}

                  </div>

                </div>

                <StepResources
                  resources={step.resources}
                />

              </div>
            );
          })}

          {steps.length > STEP_BATCH_SIZE && (
            <div className="steps-pagination">
              <span aria-live="polite">
                Showing {visibleSteps.length} of {steps.length} steps
              </span>

              <div className="steps-pagination__actions">
                {visibleStepCount > STEP_BATCH_SIZE && (
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleStepCount(STEP_BATCH_SIZE)
                    }
                  >
                    Show less
                  </button>
                )}

                {visibleStepCount < steps.length && (
                  <button
                    type="button"
                    className="steps-pagination__more"
                    onClick={() =>
                      setVisibleStepCount((count) =>
                        Math.min(
                          steps.length,
                          count + STEP_BATCH_SIZE
                        )
                      )
                    }
                  >
                    Show more
                  </button>
                )}
              </div>
            </div>
          )}
          </>
        )}

      </div>

    </div>
  );
}

export default RoadmapDetails;
