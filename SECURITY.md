# Security Policy

## Supported version

Security updates apply to the production version deployed from the `main`
branch.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability. Use GitHub's
private vulnerability reporting feature for this repository, or contact the
repository owner privately through their GitHub profile.

Include the affected route or component, reproduction steps, expected impact,
and any suggested mitigation. Do not access, modify, or retain data belonging
to other users while investigating.

## Secrets

Deployment credentials, database connection details, JWT keys, WordPress salts,
and TLS certificates must remain in the relevant hosting provider's encrypted
secret storage. They must never be committed to this repository.
