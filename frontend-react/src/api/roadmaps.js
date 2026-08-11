import api from "./client";

/*
|--------------------------------------------------------------------------
| Get All Roadmaps
|--------------------------------------------------------------------------
*/

export function getRoadmaps(options = {}) {
    return api.get("/roadmaps", options);
}

/*
|--------------------------------------------------------------------------
| Get Single Roadmap
|--------------------------------------------------------------------------
*/

export function getRoadmap(id, options = {}) {
    return api.get(`/roadmaps/${id}`, options);
}
