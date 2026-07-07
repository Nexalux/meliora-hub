import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [roadmaps, setRoadmaps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [error, setError] = useState(null);

  const activeCategory = searchParams.get("category");
  const activeDifficulty = searchParams.get("difficulty");
  const searchQuery = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [searchInput, setSearchInput] = useState(searchQuery);
  const decodeHTML = (text) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;

  
  return txt.value;
};

  /* ================================
     Update URL Params
  ================================ */
  const updateParams = useCallback(
    (newParams) => {
      const params = {
        category: activeCategory,
        difficulty: activeDifficulty,
        search: searchQuery,
        page: currentPage,
        ...newParams,
      };

      Object.keys(params).forEach(
        (key) => params[key] == null && delete params[key]
      );

      if (
        newParams.category !== undefined ||
        newParams.difficulty !== undefined ||
        newParams.search !== undefined
      ) {
        delete params.page;
      }

      setSearchParams(params);
    },
    [activeCategory, activeDifficulty, searchQuery, currentPage, setSearchParams]
  );

  /* ================================
     Debounced Search
  ================================ */
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== searchQuery) {
        updateParams({ search: searchInput });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput, searchQuery, updateParams]);

  /* ================================
     Fetch Taxonomies
  ================================ */
  useEffect(() => {

  Promise.all([
    fetch("http://meliorahub.local/wp-json/wp/v2/categories?per_page=100"),
    fetch("http://meliorahub.local/wp-json/wp/v2/difficulty?per_page=100")
  ])

  .then(async ([catRes, diffRes]) => {

    const catData = await catRes.json();

    // sort categories by popularity
    const sorted = catData
    .filter(cat => cat.count > 0)
    .sort((a,b)=>b.count-a.count)
    .slice(0,10);

    setCategories(sorted);

    setDifficulties(await diffRes.json());

  })

  .catch(()=>{});

  },[]);

  /* ================================
     Fetch Roadmaps
  ================================ */
  useEffect(() => {
    const controller = new AbortController();

    async function fetchRoadmaps() {
      try {
        setError(null);

        let url =
          `http://meliorahub.local/wp-json/wp/v2/roadmaps?_embed&per_page=9&page=${currentPage}`;

        if (activeCategory) url += `&categories=${activeCategory}`;
        if (activeDifficulty) url += `&difficulty=${activeDifficulty}`;
        if (searchQuery) url += `&search=${searchQuery}`;

        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) throw new Error("Failed to fetch roadmaps");

        const total = res.headers.get("X-WP-TotalPages");
        setTotalPages(parseInt(total) || 1);

        const data = await res.json();
        setRoadmaps(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      }
    }

    fetchRoadmaps();

    return () => controller.abort();
  }, [activeCategory, activeDifficulty, searchQuery, currentPage]);

  /* ================================
     Scroll To Top
  ================================ */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [activeCategory, activeDifficulty, searchQuery, currentPage]);

  const isLoading = !roadmaps.length && !error;

  if (isLoading) {
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
    return <div className="page">Error: {error}</div>;
  }

  return (
    <div className="page">

      {/* HERO */}
      <div className="hero">

  <div className="hero-glow"></div>

  <h1 className="hero-title">
    Master Tech Skills Through Roadmaps
  </h1>

  <p className="hero-subtitle">
    Explore structured learning paths for developers on Meliora Hub.
  </p>

  <input
    type="text"
    className="hero-search"
    placeholder="Search skills, roadmaps..."
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
  />

</div>

{/* CONTINUE LEARNING */}

{(() => {

const pathData = {
frontend: {
name: "Frontend Developer",
steps: ["HTML","CSS","JavaScript","Git","React","Next.js"]
},
backend: {
name: "Backend Developer",
steps: ["Internet","Linux","Node.js","Databases","APIs","System Design"]
},
devops: {
name: "DevOps Engineer",
steps: ["Linux","Networking","Docker","Kubernetes","CI/CD","Cloud"]
},
ai: {
name: "AI Engineer",
steps: ["Python","Math","Machine Learning","Deep Learning","LLMs"]
}
};

const startedPaths = Object.entries(pathData)
.map(([slug,data]) => {

  const completed =
    JSON.parse(localStorage.getItem(slug) || "[]");

  const progress =
    Math.round((completed.length / data.steps.length) * 100);

  return {
    slug,
    name:data.name,
    progress,
    started:completed.length > 0
  };

})
.filter(p => p.started);

if(startedPaths.length === 0) return null;

return (

<div className="continue-section">

  <h2 className="section-title">Continue Learning</h2>

  <div className="continue-grid">

    {startedPaths.sort((a,b)=>b.progress-a.progress).map(path => (
      <Link
        key={path.slug}
        to={`/path/${path.slug}`}
        className="continue-card"
      >

        <div className="continue-top">

          <h3>{path.name}</h3>

          <span className="continue-percent">
            {path.progress}%
          </span>

        </div>

        <div className="continue-progress-bar">

          <div
            className="continue-progress-fill"
            style={{width:`${path.progress}%`}}
          />

        </div>

      </Link>

    ))}

  </div>

</div>

);

})()}


      {/* LEARNING PATHS */}

<div className="paths-section">

  <h2 className="section-title">🚀 Learning Paths</h2>

  <div className="paths-grid">

    <Link to="/path/frontend" className="path-card">
      <h3>Frontend Developer</h3>
      <p>HTML → CSS → JavaScript → React → Next.js</p>
    </Link>

    <Link to="/path/backend" className="path-card">
      <h3>Backend Developer</h3>
      <p>Internet → Linux → Node.js → Databases → APIs</p>
    </Link>
  
    <Link to="/path/devops" className="path-card">
      <h3>DevOps Engineer</h3>
      <p>Linux → Networking → Docker → Kubernetes → Cloud</p>
    </Link>

    <Link to="/path/ai" className="path-card">
      <h3>AI Engineer</h3>
      <p>Python → Math → Machine Learning → Deep Learning → LLMs</p>
    </Link>

  </div>

</div>

      {/* CATEGORY FILTER */}

<h2 className="section-title">Browse by Category</h2>

<div className="category-grid">

  <button
    className={`filter-btn ${!activeCategory ? "active" : ""}`}
    onClick={() => updateParams({ category: null })}
  >
    All
  </button>

  {categories.map((cat) => {
    const cleanName = cat.name.replace(/&amp;/g, "&");

    return (
      <button
        key={cat.id}
        onClick={() => updateParams({ category: cat.id })}
        className={`filter-btn ${activeCategory == cat.id ? "active" : ""}`}
      >
        {cleanName}
      </button>
    );
  })}

</div>

     {/* DIFFICULTY FILTER */}

<div className="filters">

  <button
    className={`filter-btn ${!activeDifficulty ? "active" : ""}`}
    onClick={() => updateParams({ difficulty: null })}
  >
    All Levels
  </button>

  {difficulties.map((diff) => (

    <button
      key={diff.id}
      onClick={() => updateParams({ difficulty: diff.id })}
      className={`filter-btn ${activeDifficulty == diff.id ? "active" : ""}`}
    >
      {decodeHTML(diff.name)}
    </button>

  ))}

</div>

      {/* ROADMAP GRID */}
      {roadmaps.length === 0 ? (
        <div className="empty-state">No roadmaps found.</div>
      ) : (
        <div className="grid">
          {roadmaps.map((roadmap) => {
            const image =
              roadmap._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

            return (
              <Link
                key={roadmap.id}
                to={`/roadmap/${roadmap.id}`}
                style={{ textDecoration: "none" }}
              >
                <div className="card">

                  {image && (
                    <div className="card-image-wrapper">
                      <img
                        src={image}
                        alt={roadmap.title.rendered}
                        className="card-image"
                      />
                      <div className="card-overlay" />
                    </div>
                  )}

                  <div className="card-content">
                    <h2
                      className="card-title"
                      dangerouslySetInnerHTML={{
                        __html: roadmap.title.rendered,
                      }}
                    />
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage <= 1}
            onClick={() => updateParams({ page: currentPage - 1 })}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => updateParams({ page: currentPage + 1 })}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}

export default Home;