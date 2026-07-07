import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/details.css";

function RoadmapDetails() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);

  // start as null so we can tell “no‐data yet” from “zero steps”
  const [steps, setSteps] = useState(null);

  // derive a loading flag instead of storing it separately
  const loading = roadmap === null || steps === null;

  // ✅ Lazy localStorage initialization
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem(`progress-${id}`);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    let isMounted = true;

    // Fetch roadmap with taxonomy + media
    fetch(
      `http://meliorahub.local/wp-json/wp/v2/roadmaps/${id}?_embed`
    )
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setRoadmap(data);
        }
      });

    // Fetch steps
    fetch(
      "http://meliorahub.local/wp-json/wp/v2/roadmap_steps?_embed"
    )
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          const filtered = data
            .filter(
              (step) =>
                step.acf?.parent_roadmap == id
            )
            .sort(
              (a, b) =>
                a.acf?.step_order -
                b.acf?.step_order
            );

          setSteps(filtered);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleStep = (stepId) => {
    const updated = {
      ...completed,
      [stepId]: !completed[stepId],
    };

    setCompleted(updated);
    localStorage.setItem(
      `progress-${id}`,
      JSON.stringify(updated)
    );
  };

  const completedCount =
    Object.values(completed).filter(Boolean).length;

  const progressPercent =
    steps && steps.length > 0
      ? Math.round(
          (completedCount / steps.length) * 100
        )
      : 0;

  if (loading)
    return (
      <div className="details-page">
        Loading...
      </div>
    );

  if (!roadmap)
    return (
      <div className="details-page">
        Roadmap not found.
      </div>
    );

  // 🔥 Extract difficulty taxonomy safely
  const terms =
    roadmap._embedded?.["wp:term"] || [];

  const difficultyTerm = terms
    .flat()
    .find(
      (term) =>
        term.taxonomy === "difficulty"
    );

  const difficultyName =
    difficultyTerm?.name || "";

  return (
    <div className="details-page">
      <Link
        to="/"
        className="back-link"
      >
        ← Back to Roadmaps
      </Link>

      {/* HEADER */}
      <div className="details-header">
        <h1
          dangerouslySetInnerHTML={{
            __html:
              roadmap.title.rendered,
          }}
        />

        <div className="details-meta">
          {difficultyName && (
            <span className="badge">
              {difficultyName}
            </span>
          )}

          {roadmap.acf?.duration && (
            <span className="duration">
              {roadmap.acf.duration}
            </span>
          )}
        </div>
      </div>

      {/* PROGRESS */}
      <div className="progress-section">
        <div className="progress-info">
          <span>Progress</span>
          <strong>
            {progressPercent}%
          </strong>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>
      </div>

      {/* STEPS */}
      <div className="steps-section">
        {!steps || steps.length === 0 ? (
          <p>No steps available.</p>
        ) : (
          steps.map((step) => (
            <div
              key={step.id}
              className={`step-card ${
              completed[step.id] ? "completed" : ""
              }`}
            >
              <div className="step-header">
                <input
                  type="checkbox"
                  checked={
                    !!completed[step.id]
                  }
                  onChange={() =>
                    toggleStep(step.id)
                  }
                />

                <h3
                  dangerouslySetInnerHTML={{
                    __html: `${
                      step.acf?.step_order
                    }. ${
                      step.title
                        .rendered
                    }`,
                  }}
                />
              </div>

              {step.acf?.description && (
                <p className="step-description">
                  {
                    step.acf
                      .description
                  }
                </p>
              )}

              {step.acf?.resource_link && (
                <a
                  href={
                    step.acf
                      .resource_link
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="step-link"
                >
                  View Resource →
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RoadmapDetails;