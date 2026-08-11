<?php

declare(strict_types=1);

if ($argc !== 2) {
    fwrite(STDERR, "Usage: php scripts/import-wordpress-to-aiven.php <dump.sql>\n");
    exit(1);
}

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

$dumpPath = $argv[1];
$tablePrefix = (string) (getenv('MH_DB_PREFIX') ?: 'mh_');

if (!is_file($dumpPath) || !is_readable($dumpPath)) {
    fwrite(STDERR, "SQL dump is not readable: {$dumpPath}\n");
    exit(1);
}

$sql = file_get_contents($dumpPath);

if ($sql === false || trim($sql) === '') {
    fwrite(STDERR, "SQL dump is empty: {$dumpPath}\n");
    exit(1);
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$database = null;
$targetWasEmpty = false;

try {
    $database = mysqli_init();
    mysqli_options($database, MYSQLI_OPT_CONNECT_TIMEOUT, 15);
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

    $escapedPrefix = mysqli_real_escape_string($database, $tablePrefix);
    $existingTables = mysqli_query(
        $database,
        "SELECT TABLE_NAME FROM information_schema.TABLES " .
        "WHERE TABLE_SCHEMA = DATABASE() " .
        "AND LEFT(TABLE_NAME, CHAR_LENGTH('{$escapedPrefix}')) = '{$escapedPrefix}'"
    );

    if (mysqli_num_rows($existingTables) !== 0) {
        throw new RuntimeException(
            "Migration stopped: the target already contains {$tablePrefix} tables."
        );
    }

    $targetWasEmpty = true;
    mysqli_multi_query($database, $sql);

    do {
        $result = mysqli_store_result($database);
        if ($result instanceof mysqli_result) {
            mysqli_free_result($result);
        }
    } while (mysqli_more_results($database) && mysqli_next_result($database));

    $importedTables = mysqli_query(
        $database,
        "SELECT TABLE_NAME FROM information_schema.TABLES " .
        "WHERE TABLE_SCHEMA = DATABASE() " .
        "AND LEFT(TABLE_NAME, CHAR_LENGTH('{$escapedPrefix}')) = '{$escapedPrefix}'"
    );
    $tableCount = mysqli_num_rows($importedTables);

    if ($tableCount === 0) {
        throw new RuntimeException('Migration completed without creating any WordPress tables.');
    }

    fwrite(STDOUT, "wordpress_tables_imported={$tableCount}\n");
    mysqli_close($database);
} catch (Throwable $error) {
    if ($database instanceof mysqli && $targetWasEmpty) {
        try {
            $escapedPrefix = mysqli_real_escape_string($database, $tablePrefix);
            $partialTables = mysqli_query(
                $database,
                "SELECT TABLE_NAME FROM information_schema.TABLES " .
                "WHERE TABLE_SCHEMA = DATABASE() " .
                "AND LEFT(TABLE_NAME, CHAR_LENGTH('{$escapedPrefix}')) = '{$escapedPrefix}'"
            );

            mysqli_query($database, 'SET FOREIGN_KEY_CHECKS = 0');
            while ($row = mysqli_fetch_row($partialTables)) {
                $quotedTable = '`' . str_replace('`', '``', (string) $row[0]) . '`';
                mysqli_query($database, "DROP TABLE IF EXISTS {$quotedTable}");
            }
            mysqli_query($database, 'SET FOREIGN_KEY_CHECKS = 1');
        } catch (Throwable) {
            // Preserve the original migration error.
        }
    }

    fwrite(STDERR, "Aiven import failed: {$error->getMessage()}\n");
    exit(1);
}
