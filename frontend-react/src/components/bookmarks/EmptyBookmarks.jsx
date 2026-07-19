import { Link } from "react-router-dom";
import { FaBookmark } from "react-icons/fa6";

function EmptyBookmarks() {
  return (
    <section className="empty-bookmarks">

      <div className="empty-icon-wrapper">
        <FaBookmark className="empty-icon" />
      </div>

      <h2>No bookmarks yet</h2>

      <p>
        Save your favorite learning paths to build your personal
        library and continue your journey anytime.
      </p>

      <Link
        to="/"
        className="browse-btn"
      >
        Browse Roadmaps
      </Link>

    </section>
  );
}

export default EmptyBookmarks;