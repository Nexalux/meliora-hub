/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import {
  getBookmarks,
  addBookmark as addBookmarkRequest,
  removeBookmark as removeBookmarkRequest,
} from "../api/bookmarks";

const BookmarkContext = createContext(null);

export function BookmarkProvider({ children }) {
  const { user } = useAuth();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingIds, setSavingIds] = useState([]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadBookmarks() {
      if (!user) {
        setBookmarks([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data = await getBookmarks({
          signal: controller.signal,
        });

        if (active) {
          setBookmarks(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to load bookmarks:", error);

        if (active) {
          setBookmarks([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBookmarks();

    return () => {
      active = false;
      controller.abort();
    };
  }, [user]);

  const bookmarkedIds = useMemo(
    () =>
      new Set(
        bookmarks.map((bookmark) =>
          Number(bookmark.roadmap_id)
        )
      ),
    [bookmarks]
  );

  function isBookmarked(roadmapId) {
    return bookmarkedIds.has(Number(roadmapId));
  }

  function isSaving(roadmapId) {
    return savingIds.includes(Number(roadmapId));
  }

  function beginSaving(roadmapId) {
    const id = Number(roadmapId);

    setSavingIds((current) =>
      current.includes(id)
        ? current
        : [...current, id]
    );
  }

  function finishSaving(roadmapId) {
    const id = Number(roadmapId);

    setSavingIds((current) =>
      current.filter((savedId) => savedId !== id)
    );
  }

  async function addBookmark(roadmapId) {
    const id = Number(roadmapId);

    if (!user || isBookmarked(id) || isSaving(id)) {
      return;
    }

    beginSaving(id);

    try {
      await addBookmarkRequest(id);

      setBookmarks((current) => [
        {
          id: `temporary-${id}`,
          roadmap_id: id,
          created_at: new Date().toISOString(),
        },
        ...current,
      ]);
    } finally {
      finishSaving(id);
    }
  }

  async function removeBookmark(roadmapId) {
    const id = Number(roadmapId);

    if (!user || !isBookmarked(id) || isSaving(id)) {
      return;
    }

    beginSaving(id);

    try {
      await removeBookmarkRequest(id);

      setBookmarks((current) =>
        current.filter(
          (bookmark) =>
            Number(bookmark.roadmap_id) !== id
        )
      );
    } finally {
      finishSaving(id);
    }
  }

  async function toggleBookmark(roadmapId) {
    const id = Number(roadmapId);

    if (isBookmarked(id)) {
      await removeBookmark(id);
    } else {
      await addBookmark(id);
    }
  }

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        loading,
        isBookmarked,
        isSaving,
        addBookmark,
        removeBookmark,
        toggleBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);

  if (!context) {
    throw new Error(
      "useBookmarks must be used inside BookmarkProvider."
    );
  }

  return context;
}
