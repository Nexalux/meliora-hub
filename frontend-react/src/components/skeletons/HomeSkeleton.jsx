import SkeletonCard from "./SkeletonCard";
import "../../styles/components/skeleton.css";

function HomeSkeleton() {
    return (
        <>

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

                    <div className="skeleton skeleton__filter-title" />

                    <div className="category-grid">

                        {Array.from({ length: 6 }).map((_, index) => (

                            <div
                                key={index}
                                className="skeleton skeleton__filter"
                            />

                        ))}

                    </div>

                </div>

                <div className="filter-group">

                    <div className="skeleton skeleton__filter-title" />

                    <div className="filters">

                        {Array.from({ length: 3 }).map((_, index) => (

                            <div
                                key={index}
                                className="skeleton skeleton__filter"
                            />

                        ))}

                    </div>

                </div>

            </section>

            <div className="results-bar">

                <div className="skeleton skeleton__results" />

            </div>

            <div className="grid">

                {Array.from({ length: 9 }).map((_, index) => (

                    <SkeletonCard key={index} />

                ))}

            </div>

        </>
    );
}

export default HomeSkeleton;