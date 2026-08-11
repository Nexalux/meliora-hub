import "../../styles/components/skeleton.css";

function SkeletonCard() {
    return (
        <article className="skeleton-card">

            <div className="skeleton skeleton-card__bookmark" />

            <div className="skeleton-card__content">

                <div className="skeleton skeleton-card__title" />

                <div className="skeleton-card__description">

                    <div className="skeleton skeleton-card__line" />

                    <div
                        className="
                            skeleton
                            skeleton-card__line
                            skeleton-card__line--short
                        "
                    />

                </div>

                <div className="skeleton-card__tags">

                    <div
                        className="
                            skeleton
                            skeleton-card__tag
                            skeleton-card__tag--first
                        "
                    />

                    <div
                        className="
                            skeleton
                            skeleton-card__tag
                            skeleton-card__tag--second
                        "
                    />

                    <div
                        className="
                            skeleton
                            skeleton-card__tag
                            skeleton-card__tag--third
                        "
                    />

                </div>

                <div className="skeleton-card__bottom">

                    <div className="skeleton skeleton-card__bottom-text" />

                    <div className="skeleton skeleton-card__bottom-icon" />

                </div>

            </div>

        </article>
    );
}

export default SkeletonCard;