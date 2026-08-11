import { Link } from "react-router-dom";

import "../../styles/components/skeleton.css";
import "../../styles/pages/details.css";

function RoadmapDetailsSkeleton() {
    return (
        <div className="details-page">

            <Link
                to="/"
                className="back-link"
            >
                ← Back to Roadmaps
            </Link>

   {/* ================= HERO ================= */}

<section className="roadmap-hero">

    <div className="roadmap-hero-top">

        <div className="details-skeleton__hero-content">

            <div
                className="
                    skeleton
                    skeleton__title--large
                    details-skeleton__hero-title
                "
            />

            <div className="details-skeleton__description">

                <div className="skeleton skeleton__line" />

                <div
                    className="
                        skeleton
                        skeleton__line
                        skeleton__line--medium
                    "
                />

            </div>

        </div>

        {/* Desktop Bookmark */}

        <div className="desktop-bookmark">

            <div
                className="
                    skeleton
                    skeleton--circle
                    details-skeleton__bookmark
                "
            />

        </div>

    </div>

    <div className="roadmap-badges">

        <div
            className="
                skeleton
                skeleton--pill
                details-skeleton__badge
            "
        />

        <div
            className="
                skeleton
                skeleton--pill
                details-skeleton__badge
                details-skeleton__badge--wide
            "
        />

        {/* Mobile Bookmark */}

        <div className="mobile-bookmark">

            <div
                className="
                    skeleton
                    skeleton--circle
                    details-skeleton__bookmark
                "
            />

        </div>

    </div>

</section>

            {/* ================= PROGRESS ================= */}

            <section className="progress-card details-skeleton__progress-card">

                <div className="progress-header">

                    <div className="details-skeleton__progress-copy">

                        <div
                            className="
                                skeleton
                                skeleton__title
                                details-skeleton__progress-title
                            "
                        />

                        <div
                            className="
                                skeleton
                                skeleton__line
                                skeleton__line--short
                                details-skeleton__progress-subtitle
                            "
                        />

                    </div>

                    <div
                        className="
                            skeleton
                            skeleton--circle
                            details-skeleton__progress-percent
                        "
                    />

                </div>

                <div
                    className="
                        skeleton
                        skeleton--pill
                        details-skeleton__progress-bar
                    "
                />

            </section>

            {/* ================= INFO GRID ================= */}

            <div className="details-grid">

                {Array.from({ length: 2 }).map((_, index) => (

                    <article
                        key={index}
                        className="info-card details-skeleton__info-card"
                    >

                        <div className="info-card-title">

                            <div
                                className="
                                    skeleton
                                    skeleton--circle
                                    details-skeleton__info-icon
                                "
                            />

                            <div
                                className="
                                    skeleton
                                    skeleton__title--small
                                    details-skeleton__info-title
                                "
                            />

                        </div>

                        <div className="details-skeleton__list">

                            <div className="skeleton skeleton__line" />

                            <div className="skeleton skeleton__line" />

                            <div
                                className="
                                    skeleton
                                    skeleton__line
                                    skeleton__line--medium
                                "
                            />

                        </div>

                    </article>

                ))}

            </div>

            {/* ================= OUTCOMES ================= */}

            <article className="info-card details-skeleton__info-card">

                <div className="info-card-title">

                    <div
                        className="
                            skeleton
                            skeleton--circle
                            details-skeleton__info-icon
                        "
                    />

                    <div
                        className="
                            skeleton
                            skeleton__title--small
                            details-skeleton__info-title
                        "
                    />

                </div>

                <div className="details-skeleton__list">

                    <div className="skeleton skeleton__line" />

                    <div className="skeleton skeleton__line" />

                    <div
                        className="
                            skeleton
                            skeleton__line
                            skeleton__line--medium
                        "
                    />

                </div>

            </article>

            {/* ================= SKILLS ================= */}

            <article className="info-card details-skeleton__info-card">

                <div className="info-card-title">

                    <div
                        className="
                            skeleton
                            skeleton--circle
                            details-skeleton__info-icon
                        "
                    />

                    <div
                        className="
                            skeleton
                            skeleton__title--small
                            details-skeleton__info-title
                        "
                    />

                </div>

                <div className="skeleton__tags">

                    {Array.from({ length: 8 }).map((_, index) => (

                        <div
                            key={index}
                            className={`skeleton skeleton__tag ${
                                index % 3 === 1
                                    ? "skeleton__tag--small"
                                    : index % 3 === 2
                                      ? "skeleton__tag--large"
                                      : ""
                            }`}
                        />

                    ))}

                </div>

            </article>

            {/* ================= STEPS ================= */}

            <section className="steps-section details-skeleton__steps">

                <div className="section-heading">

                    <div
                        className="
                            skeleton
                            skeleton__title
                            details-skeleton__steps-title
                        "
                    />

                    <div
                        className="
                            skeleton
                            skeleton__line
                            skeleton__line--medium
                            details-skeleton__steps-subtitle
                        "
                    />

                </div>

                <div className="details-skeleton__step-list">

                    {Array.from({ length: 5 }).map((_, index) => (

                        <article
                            key={index}
                            className="step-card details-skeleton__step-card"
                        >

                            <div className="step-header">

                                <div
                                    className="
                                        skeleton
                                        details-skeleton__checkbox
                                    "
                                />

                                <div
                                    className="
                                        skeleton
                                        skeleton__title--small
                                        details-skeleton__step-title
                                    "
                                />

                            </div>

                            <div className="details-skeleton__step-copy">

                                <div className="skeleton skeleton__line" />

                                <div
                                    className="
                                        skeleton
                                        skeleton__line
                                        skeleton__line--medium
                                    "
                                />

                            </div>

                            <div className="details-skeleton__step-meta">

                                <div
                                    className="
                                        skeleton
                                        skeleton--pill
                                        details-skeleton__meta-item
                                    "
                                />

                                <div
                                    className="
                                        skeleton
                                        skeleton--pill
                                        details-skeleton__meta-item
                                    "
                                />

                            </div>

                        </article>

                    ))}

                </div>

            </section>

        </div>
    );
}

export default RoadmapDetailsSkeleton;