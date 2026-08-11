# Meliora Hub frontend

React frontend for Meliora Hub, built with Vite and backed by the WordPress
REST API in `backend-wordpress/meliora-core`.

## Local development

1. Copy `.env.example` to `.env.local` and adjust the WordPress REST URL if
   necessary.
2. Install dependencies with `npm install`.
3. Start the frontend with `npm run dev`.

## Quality checks

Run these before committing or deploying:

```powershell
npm run lint
npm test
npm run build
npm audit
```

## Production deployment

Set `VITE_WP_REST_URL` to the public WordPress REST root before building:

```text
VITE_WP_REST_URL=https://api.example.com/wp-json
```

Then run `npm run build` and deploy the contents of `dist`.

Client-side routes must fall back to `index.html`. The included `public/.htaccess`
provides that fallback when the built frontend is served by Apache. For Nginx,
use `try_files $uri $uri/ /index.html;`. Hosting platforms such as Vercel or
Netlify need the equivalent rewrite rule.

If the frontend and WordPress use different origins, add the frontend origin
to `MH_ALLOWED_ORIGINS` in WordPress as documented in
`backend-wordpress/README.md`.
