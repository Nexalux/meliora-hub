# Database design

Meliora Hub combines standard WordPress content storage with two focused custom
tables for per-user state.

## Roadmap content

A roadmap is a WordPress `roadmap` custom post. Its title and featured image use
standard WordPress fields; structured details, steps, and resources are stored
as post metadata. Categories and difficulty levels use the
`roadmap_category` and `roadmap_difficulty` taxonomies.

```text
Roadmap
├── basic details
├── classification
├── learning outcomes and skills
├── ordered steps
└── curated resources
```

## Bookmarks

`{prefix}bookmarks` stores one row for each saved roadmap.

| Column | Purpose |
| --- | --- |
| `id` | Primary key |
| `user_id` | WordPress user ID |
| `roadmap_id` | Roadmap post ID |
| `created_at` | Bookmark creation time |

The unique key `(user_id, roadmap_id)` prevents duplicates. Separate indexes
support lookups by user and roadmap.

## Learning progress

`{prefix}learning` stores completed roadmap steps.

| Column | Purpose |
| --- | --- |
| `id` | Primary key |
| `user_id` | WordPress user ID |
| `roadmap_id` | Roadmap post ID |
| `step_uuid` | Stable version 4 UUID for the roadmap step |
| `completed_at` | Initial completion time |
| `updated_at` | Last update time |

The unique key `(user_id, step_uuid)` makes completion idempotent. Indexes on
user, roadmap, and step identifiers support dashboard and roadmap queries.

## Installation and upgrades

Activating Meliora Core creates or upgrades both custom tables with WordPress's
`dbDelta`. Production uses the `mh_` table prefix, while local installations may
use any configured WordPress prefix.
