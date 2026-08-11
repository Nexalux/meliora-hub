import {
    FaRegBookmark,
    FaBookmark,
} from "react-icons/fa6";
import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useBookmarks } from "../../contexts/BookmarkContext";
import { useAuth } from "../../contexts/AuthContext";

import "../../styles/components/bookmark-button.css";

function BookmarkButton({ roadmapId }) {

    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const {
        loading,
        isSaving,
        isBookmarked,
        toggleBookmark,
    } = useBookmarks();

    const bookmarked =
        user && isBookmarked(roadmapId);

    const saving =
        isSaving(roadmapId);

    async function handleClick(e) {

        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            navigate("/login", {
                state: {
                    from: `${location.pathname}${location.search}${location.hash}`,
                },
            });
            return;
        }

        if (saving) return;

        try {

            await toggleBookmark(roadmapId);

        }

        catch (error) {

            console.error(error);

        }

    }

    return (

        <button
            className={`bookmark-button ${
                bookmarked
                    ? "bookmark-button--active"
                    : ""
            }`}
            onClick={handleClick}
            disabled={loading || saving}
            aria-label={
                !user
                    ? "Log in to bookmark this roadmap"
                    : bookmarked
                    ? "Remove bookmark"
                    : "Add bookmark"
            }
            aria-pressed={Boolean(bookmarked)}
            title={
                !user
                    ? "Log in to bookmark"
                    : bookmarked
                    ? "Remove Bookmark"
                    : "Add Bookmark"
            }
        >

            {bookmarked

              ? <FaBookmark />
              : <FaRegBookmark />
              }

        </button>

    );

}

export default BookmarkButton;
