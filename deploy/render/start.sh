#!/usr/bin/env bash
set -Eeuo pipefail

required_variables=(AIVEN_DB_HOST AIVEN_DB_PORT)

for variable_name in "${required_variables[@]}"; do
    if [[ -z "${!variable_name:-}" ]]; then
        echo "Missing required environment variable: ${variable_name}" >&2
        exit 1
    fi
done

if [[ ! -r /etc/secrets/aiven-ca.pem ]]; then
    echo "Missing Render secret file: /etc/secrets/aiven-ca.pem" >&2
    exit 1
fi

runtime_ca_path="/tmp/aiven-ca.pem"
install -m 0644 /etc/secrets/aiven-ca.pem "${runtime_ca_path}"
export AIVEN_DB_CA="${runtime_ca_path}"

render_port="${PORT:-10000}"

sed -ri "s/Listen 80/Listen ${render_port}/" /etc/apache2/ports.conf
sed -ri "s/<VirtualHost \*:80>/<VirtualHost *:${render_port}>/" /etc/apache2/sites-available/000-default.conf

exec docker-entrypoint.sh "$@"
