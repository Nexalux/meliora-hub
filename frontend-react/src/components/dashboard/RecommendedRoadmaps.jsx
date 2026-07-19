import RoadmapCard from "../cards/RoadmapCard";

function RecommendedRoadmaps({ roadmaps = [] }) {
    if (roadmaps.length === 0) {
        return null;
    }

    return (
        <section className="dashboard-section">

            <h2>Recommended For You</h2>

            <div className="recommendation-grid">

                {roadmaps.map((roadmap) => (
                    <RoadmapCard
                        key={roadmap.id}
                        roadmap={roadmap}
                        variant="home"
                    />
                ))}

            </div>

        </section>
    );
}

export default RecommendedRoadmaps;