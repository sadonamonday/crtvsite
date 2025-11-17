<?php
// Configure session for cross-domain cookies
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'None'
]);

session_start();

header("Content-Type: application/json");

// Set CORS headers
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$allowed_origins = [
    'http://localhost:5173',
    'https://localhost:5173',
    'http://127.0.0.1:5173',
    'https://127.0.0.1:5173',
    'https://crtvsite.pages.dev'
];

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: https://crtvsite.pages.dev");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if user is logged in AND is an admin
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true && 
    isset($_SESSION['is_admin']) && $_SESSION['is_admin'] == 1) {
    
    echo json_encode([
        "success" => true,
        "is_admin" => true,
        "user" => [
            "id" => $_SESSION['user_id'],
            "email" => $_SESSION['user_email'] ?? '',
            "firstname" => $_SESSION['user_firstname'] ?? ''
        ]
    ]);
} else {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "is_admin" => false,
        "message" => "Admin access required"
    ]);
}
?>
