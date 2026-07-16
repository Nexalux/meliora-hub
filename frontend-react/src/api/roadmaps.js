const API_URL = "http://localhost:8080/meliorahub/wp-json/meliora/v1";

/*
|--------------------------------------------------------------------------
| Get All Roadmaps
|--------------------------------------------------------------------------
*/

export async function getRoadmaps() {
    const response = await fetch(`${API_URL}/roadmaps`);

    if (!response.ok) {
        throw new Error("Failed to fetch roadmaps.");
    }

    return await response.json();
}

/*
|--------------------------------------------------------------------------
| Get Single Roadmap
|--------------------------------------------------------------------------
*/

export async function getRoadmap(id) {
    const response = await fetch(`${API_URL}/roadmaps/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch roadmap.");
    }

    return await response.json();
}

export default API_URL;