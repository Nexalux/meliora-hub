import "../../styles/components/skeleton.css";

function SkeletonActivityItem() {
    return (
        <article className="activity-item">

            <div
                className="
                    skeleton
                    skeleton--circle
                    skeleton-activity__icon
                "
            />

            <div className="activity-item__content">

                <div
                    className="
                        skeleton
                        skeleton__title--small
                        skeleton-activity__title
                    "
                />

                <div
                    className="
                        skeleton
                        skeleton__line
                        skeleton__line--medium
                        skeleton-activity__text
                    "
                />

            </div>

            <div
                className="
                    skeleton
                    skeleton__line
                    skeleton-activity__time
                "
            />

        </article>
    );
}

export default SkeletonActivityItem;