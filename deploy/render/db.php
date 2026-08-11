<?php

/**
 * WordPress database drop-in that enforces CA-verified TLS for Aiven MySQL.
 */

class Meliora_TLS_WPDB extends wpdb
{
    public function db_connect($allow_bail = true)
    {
        $this->is_mysql = true;
        mysqli_report(MYSQLI_REPORT_OFF);

        $this->dbh = mysqli_init();
        $host = $this->dbhost;
        $port = null;
        $socket = null;
        $is_ipv6 = false;
        $host_data = $this->parse_db_host($this->dbhost);

        if ($host_data) {
            [$host, $port, $socket, $is_ipv6] = $host_data;
        }

        if ($is_ipv6 && extension_loaded('mysqlnd')) {
            $host = "[{$host}]";
        }

        $ca_path = getenv('AIVEN_DB_CA') ?: '/etc/secrets/aiven-ca.pem';
        mysqli_options($this->dbh, MYSQLI_OPT_CONNECT_TIMEOUT, 15);
        mysqli_options($this->dbh, MYSQLI_OPT_SSL_VERIFY_SERVER_CERT, true);
        mysqli_ssl_set($this->dbh, null, null, $ca_path, null, null);

        $client_flags = defined('MYSQL_CLIENT_FLAGS') ? MYSQL_CLIENT_FLAGS : 0;
        $client_flags |= MYSQLI_CLIENT_SSL;

        if (WP_DEBUG) {
            mysqli_real_connect(
                $this->dbh,
                $host,
                $this->dbuser,
                $this->dbpassword,
                null,
                $port,
                $socket,
                $client_flags
            );
        } else {
            @mysqli_real_connect(
                $this->dbh,
                $host,
                $this->dbuser,
                $this->dbpassword,
                null,
                $port,
                $socket,
                $client_flags
            );
        }

        if ($this->dbh->connect_errno) {
            $this->dbh = null;
        }

        if (!$this->dbh && $allow_bail) {
            wp_load_translations_early();

            if (file_exists(WP_CONTENT_DIR . '/db-error.php')) {
                require_once WP_CONTENT_DIR . '/db-error.php';
                die();
            }

            $message = '<h1>' . __('Error establishing a database connection') . "</h1>\n";
            $message .= '<p>' . sprintf(
                __('The application could not establish a secure connection to its database host at %s.'),
                '<code>' . htmlspecialchars($this->dbhost, ENT_QUOTES) . '</code>'
            ) . "</p>\n";
            $this->bail($message, 'db_connect_fail');

            return false;
        }

        if ($this->dbh) {
            if (!$this->has_connected) {
                $this->init_charset();
            }

            $this->has_connected = true;
            $this->set_charset($this->dbh);
            $this->ready = true;
            $this->set_sql_mode();
            $this->select($this->dbname, $this->dbh);

            return true;
        }

        return false;
    }
}

global $wpdb;

$wpdb = new Meliora_TLS_WPDB(DB_USER, DB_PASSWORD, DB_NAME, DB_HOST);
