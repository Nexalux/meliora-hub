import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FaBookOpen,
  FaBullseye,
  FaLightbulb,
  FaLink,
  FaGithub,
  FaYoutube,
  FaSignal,
  FaClock
} from "react-icons/fa6";

import { getRoadmap } from "../api/roadmaps";
import ProgressCard from "../components/cards/ProgressCard";
import InfoCard from "../components/cards/InfoCard";
import ResourceCard from "../components/cards/ResourceCard";
import SkillTag from "../components/ui/SkillTag";

import "../styles/pages/details.css";

function RoadmapDetails() {

  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem(`progress-${id}`);

    return saved ? JSON.parse(saved) : {};

  });

  useEffect(() => {

    async function loadRoadmap() {

      try {
        setLoading(true);
        const data = await getRoadmap(id);
        setRoadmap(data);
      }
      catch (err) {
        setError(err.message);
      }
      finally {
        setLoading(false);
      }
    }
    loadRoadmap();

  }, [id]);

  function toggleStep(index) {

    const updated = {
      ...completed,
      [index]: !completed[index]

    };

    setCompleted(updated);
    localStorage.setItem(
      `progress-${id}`,
      JSON.stringify(updated)
    );

  }

 function toList(text = "") {
  return text
    .split("\n")
    .map(item => item.trim())
    .filter(Boolean);
}

function toSkills(text = "") {
  return text
    .split(/\n|,/)
    .map(item => item.trim())
    .filter(Boolean);
}

  const steps = roadmap?.data?.steps || [];
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPercent =
    steps.length
      ? Math.round(
          (completedCount / steps.length) * 100
        )
      : 0;

  if (loading) {
    return (
      <div className="details-page">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-page">
        {error}
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="details-page">
        Roadmap not found.
      </div>
    );
  }

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

    <h1>{roadmap.title}</h1>

    <p className="roadmap-description">
        {roadmap.data.basic.short_description}
    </p>

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
                {roadmap.duration.name}
            </span>
        )}

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

    <ul className="info-list">

      {toList(
        roadmap.data.learning.prerequisites
      ).map((item, index) => (

        <li key={index}>{item}</li>

      ))}

    </ul>

  </InfoCard>

  <InfoCard
    icon={<FaLink />}
    title="Resources"
  >

    <div className="resource-list">

      <ResourceCard
        icon={<FaBookOpen />}
        title="Official Docs"
        url={roadmap.data.resources.docs}
      />

      <ResourceCard
        icon={<FaGithub />}
        title="GitHub"
        url={roadmap.data.resources.github}
      />

      <ResourceCard
        icon={<FaLink />}
        title="Roadmap.sh"
        url={roadmap.data.resources.roadmapsh}
      />

      <ResourceCard
        icon={<FaYoutube />}
        title="YouTube"
        url={roadmap.data.resources.youtube}
      />

      <ResourceCard
    icon={<FaBookOpen />}
    title="Course"
    url={roadmap.data.resources.course}
/>

    </div>

  </InfoCard>

</div>

<InfoCard
  icon={<FaBullseye />}
  title="Learning Outcomes"
>

  <ul className="info-list">

    {toList(
      roadmap.data.learning.outcomes
    ).map((item, index) => (

      <li key={index}>{item}</li>

    ))}

  </ul>

</InfoCard>

<InfoCard
  icon={<FaLightbulb />}
  title="Skills Covered"
>

  <div className="skills-container">

    {toSkills(
      roadmap.data.learning.skills
    ).map((skill, index) => (

      <SkillTag
        key={index}
        skill={skill}
      />

    ))}

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
        steps.map((step, index) => (
          <div
            key={index}
            className={`step-card ${
              completed[index] ? "completed" : ""
            }`}
          >
            <div className="step-header">
              <input
                type="checkbox"
                checked={!!completed[index]}
                onChange={() =>
                  toggleStep(index)
                }
              />
              <h3>
                {index + 1}. {step.title}
              </h3>
            </div>
            {step.description && (
              <p className="step-description">
                {step.description}
              </p>
            )}
            <div className="step-meta">
              <span>
                <FaClock /> {step.duration}
              </span>
              <span>
                <FaBullseye /> {step.difficulty}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
}
export default RoadmapDetails;