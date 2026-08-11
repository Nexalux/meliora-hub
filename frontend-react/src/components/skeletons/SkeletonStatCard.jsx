import "../../styles/components/skeleton.css";

function SkeletonStatCard() {
    return (
        <article className="stat-card">

            <div className="stat-card__icon">
                <div
                    className="
                        skeleton
                        skeleton--circle
                        skeleton-stat__icon
                    "
                />
            </div>

            <div className="stat-card__content">

                <div
                    className="
                        skeleton
                        skeleton__title--small
                        skeleton-stat__title
                    "
                />

                <div
                    className="
                        skeleton
                        skeleton__title
                        skeleton-stat__value
                    "
                />

                <div
                    className="
                        skeleton
                        skeleton__line
                        skeleton__line--short
                        skeleton-stat__subtitle
                    "
                />

            </div>

        </article>
    );
}

export default SkeletonStatCard;