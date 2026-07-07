import { useParams, Link } from "react-router-dom";
import { useState } from "react";

const paths = {
  frontend: [
    "HTML",
    "CSS",
    "JavaScript",
    "Git",
    "React",
    "Next.js"
  ],
  backend: [
    "Internet",
    "Linux",
    "Node.js",
    "Databases",
    "APIs",
    "System Design"
  ],
  devops: [
    "Linux",
    "Networking",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Cloud"
  ],
  ai: [
    "Python",
    "Math",
    "Machine Learning",
    "Deep Learning",
    "LLMs"
  ]
};

function Path() {

  const { slug } = useParams();
  const steps = paths[slug] || [];

  const [completed, setCompleted] = useState(() => {
    const stored = localStorage.getItem(slug);
    return stored ? JSON.parse(stored) : [];
  });

  function toggleStep(step) {

    let updated;

    if (completed.includes(step)) {
      updated = completed.filter(s => s !== step);
    } else {
      updated = [...completed, step];
    }

    setCompleted(updated);
    localStorage.setItem(slug, JSON.stringify(updated));
  }

  const progress = steps.length
    ? Math.round((completed.length / steps.length) * 100)
    : 0;

  return (
    <div className="page">

      <h1 className="title">
        {slug?.toUpperCase()} Developer Path
      </h1>

      {/* Progress */}
      <div className="path-progress">

        <div className="progress-info">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>

      {/* Graph Button */}
      <div style={{ marginBottom: "30px" }}>
        <Link to={`/graph/${slug}`}>
          <button className="filter-btn">
            View Skill Graph
          </button>
        </Link>
      </div>

      {/* Steps */}
      <div className="path-steps">

        {steps.map((step, index) => {

          const done = completed.includes(step);

          return (

            <div
              key={index}
              className={`path-step ${done ? "done" : ""}`}
              onClick={() => toggleStep(step)}
            >

              <span className="step-number">
                {done ? "✔" : index + 1}
              </span>

              <span>{step}</span>

            </div>

          );

        })}

      </div>

    </div>
  );
}

export default Path;