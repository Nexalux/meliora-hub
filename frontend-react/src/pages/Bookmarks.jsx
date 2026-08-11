import { useEffect, useState } from "react";

import { getBookmarkedRoadmaps } from "../api/bookmarks";
import { useBookmarks } from "../contexts/BookmarkContext";

import BookmarksHeader from "../components/bookmarks/BookmarksHeader";
import EmptyBookmarks from "../components/bookmarks/EmptyBookmarks";
import RoadmapCard from "../components/cards/RoadmapCard";
import BookmarksSkeleton from "../components/skeletons/BookmarksSkeleton";

import "../styles/pages/bookmarks.css";

function Bookmarks() {
    const { bookmarks, loading } = useBookmarks();

    const [roadmaps, setRoadmaps] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        const controller = new AbortController();

        async function loadRoadmaps() {
            if (bookmarks.length === 0) {
                setRoadmaps([]);
                setPageLoading(false);
                return;
            }

            try {
                setError("");
                setPageLoading(true);

                const data = await getBookmarkedRoadmaps({
                    signal: controller.signal,
                });

                if (active) {
                    setRoadmaps(
                        Array.isArray(data)
                            ? data
                            : []
                    );
                }
            } catch (err) {
                console.error(
                    "Failed to load bookmarked roadmaps:",
                    err
                );

                if (active) {
                    setError(
                        err.message ||
                        "Failed to load your bookmarked roadmaps."
                    );

                    setRoadmaps([]);
                }
            } finally {
                if (active) {
                    setPageLoading(false);
                }
            }
        }

        loadRoadmaps();

        return () => {
            active = false;
            controller.abort();
        };
    }, [bookmarks]);

   if (loading || pageLoading) {
    return <BookmarksSkeleton />;
}
    return (
        <div className="bookmarks-page">

            <BookmarksHeader />

            {error ? (
                <div
                    className="empty-state"
                    role="alert"
                >
                    <h3>Something went wrong</h3>
                    <p>{error}</p>
                </div>
            ) : roadmaps.length === 0 ? (
                <EmptyBookmarks />
            ) : (
                <>
                    <div className="results-bar">

                        <p className="results-count">
                            You have {" "}
                            <strong>{roadmaps.length}</strong>{" "}
                            bookmarked{" "}
                            {roadmaps.length === 1
                                ? "roadmap"
                                : "roadmaps"}
                        </p>

                    </div>

                    <div className="grid">

                        {roadmaps.map((bookmark) => (
                            <RoadmapCard
                                key={bookmark.bookmark_id}
                                roadmap={bookmark.roadmap}
                                variant="bookmark"
                            />
                        ))}

                    </div>
                </>
            )}

        </div>
    );
}

export default Bookmarks;
