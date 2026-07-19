const API_BASE =
  "http://localhost:8080/meliorahub/wp-json/meliora/v1";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/*
|--------------------------------------------------------------------------
| Get Bookmarks
|--------------------------------------------------------------------------
*/

export async function getBookmarks() {
  const response = await fetch(
    `${API_BASE}/bookmarks`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch bookmarks."
    );
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Get Bookmarked Roadmaps
|--------------------------------------------------------------------------
*/

export async function getBookmarkedRoadmaps() {
  const response = await fetch(
    `${API_BASE}/bookmarks/roadmaps`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch bookmarked roadmaps."
    );
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Add Bookmark
|--------------------------------------------------------------------------
*/

export async function addBookmark(roadmapId) {
  const response = await fetch(
    `${API_BASE}/bookmarks`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        roadmap_id: roadmapId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to add bookmark."
    );
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Remove Bookmark
|--------------------------------------------------------------------------
*/

export async function removeBookmark(roadmapId) {
  const response = await fetch(
    `${API_BASE}/bookmarks/${roadmapId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to remove bookmark."
    );
  }

  return data;
}