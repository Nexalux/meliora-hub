<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$connection = @fsockopen('127.0.0.1', 3306, $errorCode, $errorMessage, 2.0);

if ($connection === false) {
    http_response_code(503);
    echo json_encode(['status' => 'unavailable']);
    exit;
}

fclose($connection);
http_response_code(200);
echo json_encode(['status' => 'ok']);
