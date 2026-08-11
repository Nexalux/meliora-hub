import api from "./client";

/*
|--------------------------------------------------------------------------
| Get Dashboard Data
|--------------------------------------------------------------------------
*/

export function getDashboardData(options = {}) {
  return api.get("/dashboard", options);
}
