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
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config.php';

try {
    $pdo = getDBConnection();
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

// Input validation
$email = isset($_POST['user_email']) ? trim($_POST['user_email']) : null;
$code  = isset($_POST['two_factor_code']) ? trim($_POST['two_factor_code']) : null;

if (!$email || !$code) {
    echo json_encode(["success" => false, "message" => "Email and 2FA code are required."]);
    exit;
}

try {
    // Fetch user with is_admin field
    $stmt = $pdo->prepare("SELECT user_id, user_firstname, user_email, two_factor_code, two_factor_expires_at, is_admin 
                           FROM users WHERE user_email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["success" => false, "message" => "User not found."]);
        exit;
    }

    $current_time = date("Y-m-d H:i:s");

    // Verify 2FA code
    if ($user['two_factor_code'] === $code && $user['two_factor_expires_at'] >= $current_time) {

        // Clear the 2FA code to prevent reuse
        $update = $pdo->prepare("UPDATE users SET two_factor_code = NULL, two_factor_expires_at = NULL WHERE user_id = ?");
        $update->execute([$user['user_id']]);

        // Set session variables
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['user_email'] = $user['user_email'];
        $_SESSION['user_firstname'] = $user['user_firstname'];
        $_SESSION['is_admin'] = $user['is_admin'] ?? 0;
        $_SESSION['logged_in'] = true;

        // Clear pending session variables
        unset($_SESSION['pending_user_id']);
        unset($_SESSION['pending_is_admin']);
        unset($_SESSION['pending_user_email']);

        echo json_encode([
            "success" => true,
            "message" => "2FA verified successfully.",
            "is_admin" => (int)$_SESSION['is_admin'],
            "user" => [
                "id" => $user['user_id'],
                "email" => $user['user_email'],
                "firstname" => $user['user_firstname']
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid or expired 2FA code."]);
    }

} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Server error, please try again later."]);
    exit;
}
?>
