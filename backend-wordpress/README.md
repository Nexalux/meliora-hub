# WordPress backend

`meliora-core` is the canonical, Git-tracked source for the Meliora Hub
WordPress plugin.

Do not make permanent changes directly inside the XAMPP plugin directory.
Edit this repository copy and deploy it locally with:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\sync-wordpress-plugin.ps1
```

The default deployment target is:

```text
D:\xampp\htdocs\meliorahub\wp-content\plugins\meliora-core
```

## Production CORS configuration

When the production frontend and WordPress API use different origins, add an
explicit allowlist to `wp-config.php`:

```php
define('MH_ALLOWED_ORIGINS', [
    'https://app.example.com',
]);
```

No CORS configuration is needed when both are served from the same origin.

## Backend checks

With Apache and MySQL running locally, verify PHP syntax, the roadmap response
shape, and the CORS allowlist with:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test-backend.ps1
```
