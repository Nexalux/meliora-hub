import { Link } from "react-router-dom";
import { FaBookmark } from "react-icons/fa6";

import "../../styles/components/empty-bookmarks.css";

function EmptyBookmarks() {
    return (
        <section className="empty-bookmarks">

           <div className="empty-bookmarks__icon-wrapper">
    <FaBookmark className="empty-bookmarks__icon" />
</div>

            <h2 className="empty-bookmarks__title">
                No bookmarks yet
            </h2>

            <p className="empty-bookmarks__description">
                Save roadmaps you want to revisit and build your own
                learning library.
            </p>

            <Link
                to="/"
                className="empty-bookmarks__button"
            >
                Browse Roadmaps
            </Link>

        </section>
    );
}

export default EmptyBookmarks;