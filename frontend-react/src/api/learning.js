import api from "./client";

/*
|--------------------------------------------------------------------------
| Get All Completed Steps
|--------------------------------------------------------------------------
*/

export function getLearning(options = {}) {
  return api.get("/learning", options);
}

/*
|--------------------------------------------------------------------------
| Get Completed Steps For One Roadmap
|--------------------------------------------------------------------------
*/

export function getRoadmapLearning(roadmapId, options = {}) {
  return api.get(`/learning/roadmaps/${roadmapId}`, options);
}

/*
|--------------------------------------------------------------------------
| Complete Step
|--------------------------------------------------------------------------
*/

export function completeStep(roadmapId, stepUuid) {
  return api.post("/learning", {
    roadmap_id: Number(roadmapId),
    step_uuid: stepUuid,
  });
}

/*
|--------------------------------------------------------------------------
| Uncomplete Step
|--------------------------------------------------------------------------
*/

export function uncompleteStep(stepUuid) {
  return api.delete(`/learning/${stepUuid}`);
}

/*
|--------------------------------------------------------------------------
| Record Roadmap Visit
|--------------------------------------------------------------------------
*/

export function recordRoadmapVisit(roadmapId) {
  return api.post(`/learning/roadmaps/${roadmapId}/visit`);
}
