<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$host = (string) (getenv('AIVEN_DB_HOST') ?: '');
$port = (int) (getenv('AIVEN_DB_PORT') ?: 0);
$user = (string) (getenv('WORDPRESS_DB_USER') ?: '');
$password = (string) (getenv('WORDPRESS_DB_PASSWORD') ?: '');
$databaseName = (string) (getenv('WORDPRESS_DB_NAME') ?: '');
$caPath = (string) (getenv('AIVEN_DB_CA') ?: '/etc/secrets/aiven-ca.pem');
$connection = null;

mysqli_report(MYSQLI_REPORT_OFF);

if ($host !== '' && $port > 0 && $user !== '' && $databaseName !== '') {
    $connection = mysqli_init();
    mysqli_options($connection, MYSQLI_OPT_CONNECT_TIMEOUT, 2);
    mysqli_options($connection, MYSQLI_OPT_SSL_VERIFY_SERVER_CERT, true);
    mysqli_ssl_set($connection, null, null, $caPath, null, null);

    $connected = @mysqli_real_connect(
        $connection,
        $host,
        $user,
        $password,
        $databaseName,
        $port,
        null,
        MYSQLI_CLIENT_SSL
    );
} else {
    $connected = false;
}

if (!$connected || mysqli_query($connection, 'SELECT 1') === false) {
    http_response_code(503);
    echo json_encode(['status' => 'unavailable']);
    exit;
}

mysqli_close($connection);
http_response_code(200);
echo json_encode(['status' => 'ok']);
