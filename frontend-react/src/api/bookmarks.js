import api from "./client";

/*
|--------------------------------------------------------------------------
| Get Bookmarks
|--------------------------------------------------------------------------
*/

export function getBookmarks(options = {}) {
  return api.get("/bookmarks", options);
}

/*
|--------------------------------------------------------------------------
| Get Bookmarked Roadmaps
|--------------------------------------------------------------------------
*/

export function getBookmarkedRoadmaps(options = {}) {
  return api.get("/bookmarks/roadmaps", options);
}

/*
|--------------------------------------------------------------------------
| Add Bookmark
|--------------------------------------------------------------------------
*/

export function addBookmark(roadmapId) {
  return api.post("/bookmarks", {
    roadmap_id: roadmapId,
  });
}

/*
|--------------------------------------------------------------------------
| Remove Bookmark
|--------------------------------------------------------------------------
*/

export function removeBookmark(roadmapId) {
  return api.delete(`/bookmarks/${roadmapId}`);
}
