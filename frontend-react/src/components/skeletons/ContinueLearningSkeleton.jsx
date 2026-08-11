import "../../styles/components/skeleton.css";
import "../../styles/components/continue-learning-card.css";

function ContinueLearningSkeleton() {
    return (
        <article className="continue-card">

            {/* Header */}

            <div className="continue-learning-skeleton__header">

                <div
                    className="
                        skeleton
                        continue-learning-skeleton__title
                    "
                />

                <div
                    className="
                        skeleton
                        skeleton--circle
                        continue-learning-skeleton__percentage
                    "
                />

            </div>

            {/* Progress */}

            <div
                className="
                    skeleton
                    continue-learning-skeleton__progress
                "
            />

            {/* Up Next Card */}

            <div
                className="
                    skeleton
                    continue-learning-skeleton__next
                "
            />

            {/* Button */}

            <div
                className="
                    skeleton
                    continue-learning-skeleton__button
                "
            />

        </article>
    );
}

export default ContinueLearningSkeleton;