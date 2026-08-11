FROM wordpress:php8.3-apache

ARG JWT_AUTH_VERSION=1.5.0

RUN apt-get update \
    && apt-get install --no-install-recommends -y stunnel4 unzip \
    && curl --fail --location --silent --show-error \
        "https://downloads.wordpress.org/plugin/jwt-authentication-for-wp-rest-api.${JWT_AUTH_VERSION}.zip" \
        --output /tmp/jwt-auth.zip \
    && unzip -q /tmp/jwt-auth.zip -d /usr/src/wordpress/wp-content/plugins \
    && rm -f /tmp/jwt-auth.zip \
    && rm -rf /var/lib/apt/lists/*

COPY backend-wordpress/meliora-core/ /usr/src/wordpress/wp-content/plugins/meliora-core/
COPY deploy/render/meliora-loader.php /usr/src/wordpress/wp-content/mu-plugins/meliora-loader.php
COPY deploy/render/uploads/ /usr/src/wordpress/wp-content/uploads/
COPY deploy/render/health.php /usr/src/wordpress/health.php
COPY deploy/render/start.sh /usr/local/bin/meliora-start

RUN chmod 0755 /usr/local/bin/meliora-start \
    && chown -R www-data:www-data /usr/src/wordpress/wp-content

ENTRYPOINT ["/usr/local/bin/meliora-start"]
CMD ["apache2-foreground"]
