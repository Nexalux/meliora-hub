import SkeletonCard from "./SkeletonCard";

import "../../styles/components/skeleton.css";

function BookmarksSkeleton() {
    return (
        <div className="bookmarks-page">

            <header className="bookmarks-header bookmarks-header--loading">

                <div
                    className="
                        skeleton
                        skeleton__title
                        bookmarks-skeleton__title
                    "
                />

                <div
                    className="
                        skeleton
                        skeleton__line
                        skeleton__line--medium
                        bookmarks-skeleton__text
                    "
                />

            </header>

            <div
                className="
                    skeleton
                    skeleton__line
                    bookmarks-skeleton__results
                "
            />

            <div className="grid">

                {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}

            </div>

        </div>
    );
}

export default BookmarksSkeleton;