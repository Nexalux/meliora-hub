# No-card deployment

Meliora Hub uses three free services:

- Cloudflare Pages for the React frontend.
- Render Free Web Service for WordPress and the REST API.
- Aiven Free MySQL for persistent relational data.

## Aiven

1. Create an Aiven account without adding a payment method.
2. Create a MySQL service with the **Free** plan.
3. Keep the default `defaultdb` database or create a `meliorahub` database.
4. Record the host, port, database name, username, and password.
5. Download the service CA certificate.

Never commit the connection details or CA certificate.

## Render

Create a Blueprint from the repository's `render.yaml`. Use the following
values when Render prompts for environment variables:

- `AIVEN_DB_HOST`: Aiven service host.
- `AIVEN_DB_PORT`: Aiven service port.
- `WORDPRESS_DB_NAME`: Aiven database name.
- `WORDPRESS_DB_USER`: Aiven service username.
- `WORDPRESS_DB_PASSWORD`: Aiven service password.
- `MH_ALLOWED_ORIGINS`: the final Cloudflare Pages origin, with no trailing slash.

The Blueprint already sets `WORDPRESS_TABLE_PREFIX=mh_` to match the existing
local database.

After the Blueprint creates the service, add a Render secret file named
`aiven-ca.pem` containing the Aiven CA certificate. Render exposes it to the
container as `/etc/secrets/aiven-ca.pem`.

The image includes Meliora Core, JWT Authentication for WP-API 1.5.0, and the
project's existing media. Its filesystem is intentionally immutable because
Render's free service discards runtime file changes. Add future plugins and
media to Git and redeploy instead of installing or uploading them in WP Admin.

## Expected free-tier behavior

Render spins the backend down after 15 minutes without inbound traffic. The
first request after that can take approximately one minute while it starts.
The Aiven free database has 1 GB of storage and can be powered off after
extended inactivity with advance notice.
