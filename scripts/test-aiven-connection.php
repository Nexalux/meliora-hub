<?php

declare(strict_types=1);

$requiredVariables = [
    'MH_DB_HOST',
    'MH_DB_PORT',
    'MH_DB_NAME',
    'MH_DB_USER',
    'MH_DB_PASSWORD',
    'MH_DB_CA',
];

foreach ($requiredVariables as $variable) {
    if (getenv($variable) === false || getenv($variable) === '') {
        fwrite(STDERR, "Missing required environment variable: {$variable}\n");
        exit(1);
    }
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $database = mysqli_init();

    mysqli_options($database, MYSQLI_OPT_CONNECT_TIMEOUT, 10);
    mysqli_options($database, MYSQLI_OPT_SSL_VERIFY_SERVER_CERT, true);
    mysqli_ssl_set(
        $database,
        null,
        null,
        (string) getenv('MH_DB_CA'),
        null,
        null
    );

    mysqli_real_connect(
        $database,
        (string) getenv('MH_DB_HOST'),
        (string) getenv('MH_DB_USER'),
        (string) getenv('MH_DB_PASSWORD'),
        (string) getenv('MH_DB_NAME'),
        (int) getenv('MH_DB_PORT'),
        null,
        MYSQLI_CLIENT_SSL
    );

    $result = mysqli_query($database, 'SELECT 1 AS connection_ok');
    $row = mysqli_fetch_assoc($result);

    if (($row['connection_ok'] ?? null) !== '1') {
        throw new RuntimeException('Unexpected database response.');
    }

    mysqli_close($database);
    fwrite(STDOUT, "aiven_tls_connection=passed\n");
} catch (Throwable $error) {
    fwrite(STDERR, "Aiven connection failed: {$error->getMessage()}\n");
    exit(1);
}
