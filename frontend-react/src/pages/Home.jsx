import RoadmapCard from "../components/cards/RoadmapCard";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getRoadmaps } from "../api/roadmaps";
import "../styles/pages/home.css";

function Home() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 9;

  useEffect(() => {
    async function loadRoadmaps() {
      try {
        setError("");
        setLoading(true);

        const data = await getRoadmaps();
        setRoadmaps(data);
      } catch (err) {
        setError(err.message || "Failed to fetch roadmaps");
      } finally {
        setLoading(false);
      }
    }

    loadRoadmaps();
  }, []);

  const categories = useMemo(() => {
    const unique = new Map();

    roadmaps.forEach((roadmap) => {
      if (roadmap.category) {
        unique.set(roadmap.category.name, roadmap.category.name);
      }
    });

    return ["All", ...unique.values()];
  }, [roadmaps]);

  const difficulties = useMemo(() => {
    const unique = new Map();

    roadmaps.forEach((roadmap) => {
      if (roadmap.difficulty) {
        unique.set(roadmap.difficulty.name, roadmap.difficulty.name);
      }
    });

    return ["All", ...unique.values()];
  }, [roadmaps]);

  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter((roadmap) => {
      const title = roadmap.title || "";
      const shortDescription = roadmap.data?.basic?.short_description || "";

      const matchesSearch =
        title.toLowerCase().includes(searchInput.toLowerCase()) ||
        shortDescription.toLowerCase().includes(searchInput.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        roadmap.category?.name === activeCategory;

      const matchesDifficulty =
        activeDifficulty === "All" ||
        roadmap.difficulty?.name === activeDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [roadmaps, searchInput, activeCategory, activeDifficulty]);

  const totalPages = Math.max(1, Math.ceil(filteredRoadmaps.length / perPage));

  const paginatedRoadmaps = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredRoadmaps.slice(start, start + perPage);
  }, [filteredRoadmaps, currentPage]);

  function resetPage() {
    setCurrentPage(1);
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [activeCategory, activeDifficulty, searchInput, currentPage]);

  if (loading) {
    return (
      <div className="page">
        <div className="grid">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
  return (
    <div className="page">
      <div className="empty-state">
        <h3>Something went wrong</h3>
        <p>{error}</p>

      </div>
    </div>
  );

}

  return (
    <div className="page">
      
{/* ================= HERO ================= */}

<section className="hero">

  <div className="hero-content">

    <span className="hero-label">
      MELIORA HUB
    </span>

    <h1 className="hero-title">
      Master Tech Skills
      <br />
      Through Structured Roadmaps
    </h1>

    <p className="hero-subtitle">
      Learn modern technologies through carefully
      structured roadmaps designed for beginners,
      intermediate learners and professionals.
    </p>

    <input
      type="text"
      className="hero-search"
      placeholder="Search roadmaps..."
      value={searchInput}
      onChange={(e) => {
        setSearchInput(e.target.value);
        resetPage();
      }}
    />

  </div>

</section>

      {/* CONTINUE LEARNING */}
      {(() => {
        const startedRoadmaps = roadmaps.filter((roadmap) => {
         const completed = JSON.parse(
  localStorage.getItem(`progress-${roadmap.id}`) || "{}"
);

const completedCount =
  Object.values(completed).filter(Boolean).length;

return completedCount > 0;
        });

        if (startedRoadmaps.length === 0) return null;

        return (
          <div className="continue-section">
            <h2 className="section-title">Continue Learning</h2>

            <div className="continue-grid">
              {startedRoadmaps.map((roadmap) => {
                const completed = JSON.parse(
  localStorage.getItem(`progress-${roadmap.id}`) || "{}"
);

const completedCount =
  Object.values(completed).filter(Boolean).length;

const totalSteps =
  roadmap.data?.steps?.length || 1;

const progress = Math.round(
  (completedCount / totalSteps) * 100
);

                return (
                  <Link
                    key={roadmap.id}
                    to={`/roadmap/${roadmap.id}`}
                    className="continue-card"
                  >
                    <div className="continue-top">
                      <h3>{roadmap.title}</h3>

                      <span className="continue-percent">
                        {progress}%
                      </span>
                    </div>

                    <div className="continue-progress-bar">
                      <div
                        className="continue-progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ================= BROWSE SECTION ================= */}

<section className="browse-section">
  <div className="browse-header">

    <h2>
      Browse Roadmaps
    </h2>

    <p>
      Discover structured learning paths based on your
      interests and experience level.
    </p>

  </div>

  <div className="filter-group">

    <span className="filter-title">
      Categories
    </span>

    <div className="category-grid">

      {categories.map((cat) => (

        <button
          key={cat}
          className={`filter-btn ${
            activeCategory === cat
              ? "active"
              : ""
          }`}
          onClick={() => {
            setActiveCategory(cat);
            resetPage();
          }}
        >
          {cat}
        </button>

      ))}

    </div>

  </div>

  <div className="filter-group">

    <span className="filter-title">
      Difficulty
    </span>

    <div className="filters">

      {difficulties.map((diff) => (

        <button
          key={diff}
          className={`filter-btn ${
            activeDifficulty === diff
              ? "active"
              : ""
          }`}
          onClick={() => {
            setActiveDifficulty(diff);
            resetPage();
          }}
        >
          {diff === "All"
            ? "All Levels"
            : diff}
        </button>

      ))}

    </div>

  </div>

</section>

{/* RESULTS */}

<div className="results-bar">
  <p className="results-count">

    Showing <strong>{filteredRoadmaps.length}</strong>{" "}

    {filteredRoadmaps.length === 1
      ? "Roadmap"
      : "Roadmaps"}

  </p>

</div>

      {/* ROADMAP GRID */}

      {paginatedRoadmaps.length === 0 ? (

        <div className="empty-state">
         <h3>No roadmaps found</h3>
         <p> Try changing your search or filters. </p>
         </div>

      ) : (
        <div className="grid">
          {paginatedRoadmaps.map((roadmap) => (
  <RoadmapCard
    key={roadmap.id}
    roadmap={roadmap}
  />
))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;