import {
  FaRegStar,
  FaStar,
} from "react-icons/fa6";

import { useBookmarks } from "../../contexts/BookmarkContext";
import { useAuth } from "../../contexts/AuthContext";

function BookmarkButton({ roadmapId }) {

  const { user } = useAuth();

  const {
    loading,
    isSaving,
    isBookmarked,
    toggleBookmark,
  } = useBookmarks();

  /*
  |--------------------------------------------------------------------------
  | Hide button for guests
  |--------------------------------------------------------------------------
  */

  if (!user) {
    return null;
  }

  const bookmarked =
    isBookmarked(roadmapId);

  const saving =
    isSaving(roadmapId);

  async function handleClick(e) {

    e.preventDefault();
    e.stopPropagation();

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
      className="bookmark-btn"
      onClick={handleClick}
      disabled={loading || saving}
      title={
        bookmarked
          ? "Remove Bookmark"
          : "Add Bookmark"
      }
    >

      {bookmarked
        ? <FaStar />
        : <FaRegStar />}

    </button>

  );

}

export default BookmarkButton;