import { useEffect, useMemo, useState } from "react";
import RoadmapCard from "../components/cards/RoadmapCard";
import { getRoadmaps } from "../api/roadmaps";
import ContinueLearning from "../components/home/ContinueLearning";
import HomeSkeleton from "../components/skeletons/HomeSkeleton";
import "../styles/pages/home.css";

function Home() {
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchInput, setSearchInput] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeDifficulty, setActiveDifficulty] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    const perPage = 6;

    useEffect(() => {
        let active = true;
        const controller = new AbortController();

        async function loadRoadmaps() {
            try {
                setLoading(true);
                setError("");

                const data = await getRoadmaps({
                    signal: controller.signal,
                });

                if (active) {
                    setRoadmaps(data);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.message || "Failed to fetch roadmaps"
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadRoadmaps();

        return () => {
            active = false;
            controller.abort();
        };
    }, []);

    const categories = useMemo(() => {
        const unique = new Map();

        roadmaps.forEach((roadmap) => {
            if (roadmap.category) {
                unique.set(
                    roadmap.category.name,
                    roadmap.category.name
                );
            }
        });

        return ["All", ...unique.values()];
    }, [roadmaps]);

    const difficulties = useMemo(() => {
        const unique = new Map();
        const preferredOrder = [
            "Beginner",
            "Intermediate",
            "Advanced",
        ];

        roadmaps.forEach((roadmap) => {
            if (roadmap.difficulty) {
                unique.set(
                    roadmap.difficulty.name,
                    roadmap.difficulty.name
                );
            }
        });

        const availableDifficulties = [...unique.values()];

        availableDifficulties.sort((a, b) => {
            const aIndex = preferredOrder.indexOf(a);
            const bIndex = preferredOrder.indexOf(b);

            if (aIndex === -1 && bIndex === -1) {
                return a.localeCompare(b);
            }

            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;

            return aIndex - bIndex;
        });

        return ["All", ...availableDifficulties];
    }, [roadmaps]);

    const filteredRoadmaps = useMemo(() => {
        return roadmaps.filter((roadmap) => {
            const title = roadmap.title || "";
            const description =
                roadmap.short_description
                    ?.replace(/<[^>]+>/g, "")
                    .replace(/\s+/g, " ")
                    .trim() || "";

            const matchesSearch =
                title
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()) ||
                description
                    .toLowerCase()
                    .includes(searchInput.toLowerCase());

            const matchesCategory =
                activeCategory === "All" ||
                roadmap.category?.name === activeCategory;

            const matchesDifficulty =
                activeDifficulty === "All" ||
                roadmap.difficulty?.name === activeDifficulty;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesDifficulty
            );
        });
    }, [
        roadmaps,
        searchInput,
        activeCategory,
        activeDifficulty,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredRoadmaps.length / perPage)
    );

    const paginatedRoadmaps = useMemo(() => {
        const start = (currentPage - 1) * perPage;

        return filteredRoadmaps.slice(
            start,
            start + perPage
        );
    }, [
        filteredRoadmaps,
        currentPage,
    ]);

    function resetPage() {
        setCurrentPage(1);
    }

    if (error) {
        return (
            <div className="page home-page">
                <div className="empty-state">
                    <h3>Something went wrong</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page home-page">

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
                        Learn modern technologies
                        through carefully structured
                        roadmaps designed for beginners,
                        intermediate learners and
                        professionals.
                    </p>

                    <input
                        type="text"
                        className="hero-search"
                        placeholder="Search roadmaps..."
                        value={searchInput}
                        onChange={(event) => {
                            setSearchInput(event.target.value);
                            resetPage();
                        }}
                    />

                </div>

            </section>

            <ContinueLearning
                roadmaps={roadmaps}
                loading={loading}
            />

            {loading ? (

                <HomeSkeleton />

            ) : (

                <>

                    {/* ================= BROWSE SECTION ================= */}

                    <section className="browse-section">

                        <div className="browse-header">

                            <h2>
                                Browse Roadmaps
                            </h2>

                            <p>
                                Discover structured learning paths based on
                                your interests and experience level.
                            </p>

                        </div>

                        <div className="filter-group">

                            <span className="filter-title">
                                Categories
                            </span>

                            <div className="category-grid">

                                {categories.map((category) => (

                                    <button
                                        key={category}
                                        className={`filter-btn ${
                                            activeCategory === category
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setActiveCategory(category);
                                            resetPage();
                                        }}
                                    >
                                        {category}
                                    </button>

                                ))}

                            </div>

                        </div>
                                                <div className="filter-group">

                            <span className="filter-title">
                                Difficulty
                            </span>

                            <div className="filters">

                                {difficulties.map((difficulty) => (

                                    <button
                                        key={difficulty}
                                        className={`filter-btn ${
                                            activeDifficulty === difficulty
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setActiveDifficulty(difficulty);
                                            resetPage();
                                        }}
                                    >
                                        {difficulty === "All"
                                            ? "All Levels"
                                            : difficulty}
                                    </button>

                                ))}

                            </div>

                        </div>

                    </section>

                    {/* ================= RESULTS ================= */}

                    <div className="results-bar">

                        <p className="results-count">
                            Showing{" "}
                            <strong>
                                {filteredRoadmaps.length}
                            </strong>{" "}
                            {filteredRoadmaps.length === 1
                                ? "Roadmap"
                                : "Roadmaps"}
                        </p>

                    </div>

                    {/* ================= ROADMAP GRID ================= */}

                    {paginatedRoadmaps.length === 0 ? (

                        <div className="empty-state">

                            <h3>
                                No roadmaps found
                            </h3>

                            <p>
                                Try changing your search or filters.
                            </p>

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

                    {/* ================= PAGINATION ================= */}

                    {totalPages > 1 && (

                        <div className="pagination">

                            <button
                                disabled={currentPage <= 1}
                                onClick={() =>
                                    setCurrentPage(
                                        (page) => page - 1
                                    )
                                }
                            >
                                Previous
                            </button>

                            <span>
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                disabled={currentPage >= totalPages}
                                onClick={() =>
                                    setCurrentPage(
                                        (page) => page + 1
                                    )
                                }
                            >
                                Next
                            </button>

                        </div>

                    )}

                </>

            )}

        </div>
    );
}

export default Home;
