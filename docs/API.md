# API reference

Production REST root:

```text
https://meliora-hub-api.onrender.com/wp-json
```

Meliora routes use the `/meliora/v1` namespace. Authenticated requests include
the JWT returned by the token endpoint:

```http
Authorization: Bearer <token>
```

## Public routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/meliora/v1/roadmaps` | List published roadmaps and card metadata |
| `GET` | `/meliora/v1/roadmaps/{id}` | Return the complete structured roadmap |
| `POST` | `/meliora/v1/register` | Register a learner account |
| `POST` | `/jwt-auth/v1/token` | Exchange credentials for a JWT |
| `POST` | `/jwt-auth/v1/token/validate` | Validate the current JWT |

## Authenticated routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/meliora/v1/dashboard` | Return stats, activity, recommendations, and resume data |
| `GET` | `/meliora/v1/bookmarks` | Return bookmarked roadmap IDs |
| `GET` | `/meliora/v1/bookmarks/roadmaps` | Return full bookmarked roadmap cards |
| `POST` | `/meliora/v1/bookmarks` | Bookmark a roadmap |
| `DELETE` | `/meliora/v1/bookmarks/{roadmap_id}` | Remove a roadmap bookmark |
| `GET` | `/meliora/v1/learning` | Return the learner's completion state |
| `GET` | `/meliora/v1/learning/roadmaps/{roadmap_id}` | Return completion for one roadmap |
| `POST` | `/meliora/v1/learning` | Mark a roadmap step complete |
| `DELETE` | `/meliora/v1/learning/{step_uuid}` | Mark a roadmap step incomplete |
| `POST` | `/meliora/v1/learning/roadmaps/{roadmap_id}/visit` | Record a roadmap visit for recent activity |

## Request notes

- Numeric roadmap IDs must be positive integers.
- Step identifiers must be valid version 4 UUIDs.
- Registration fields are sanitized and passwords must meet the backend's
  minimum length.
- Bookmark and step-completion writes are idempotent at the database level
  through unique compound keys.
- Browser origins must be present in the server-side CORS allowlist.

The frontend's shared request client normalizes API errors, adds authorization
headers, supports request cancellation, and clears expired local sessions after
authentication failures.
