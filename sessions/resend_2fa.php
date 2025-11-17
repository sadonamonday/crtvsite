<?php
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
require __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
    $db = getDBConnection();
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$email = isset($_POST['user_email']) ? trim($_POST['user_email']) : null;

if (!$email) {
    echo json_encode(["success" => false, "message" => "Email is required."]);
    exit;
}

try {
    // Fetch user
    $stmt = $db->prepare("SELECT user_id, user_firstname FROM users WHERE user_email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["success" => false, "message" => "User not found."]);
        exit;
    }

    // Generate new 2FA code
    $twoFA = rand(100000, 999999);
    $expires = date("Y-m-d H:i:s", strtotime("+5 minutes"));

    $update = $db->prepare("UPDATE users SET two_factor_code = ?, two_factor_expires_at = ? WHERE user_id = ?");
    $update->execute([$twoFA, $expires, $user['user_id']]);

    // Send email
    $mail = new PHPMailer(true);
    $mail->isMail();
    $mail->setFrom('crtvshots@crtvshotss.atwebpages.com', 'CRTV Shots');
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = 'Your New 2FA Verification Code';
    $mail->Body = "Hello {$user['user_firstname']},<br><br>Your new 2FA verification code is: <b>$twoFA</b>.<br>It expires in 5 minutes.";
    $mail->AltBody = "Your new 2FA verification code is: $twoFA. It expires in 5 minutes.";

    $mail->send();

    echo json_encode(["success" => true, "message" => "A new 2FA code has been sent to your email."]);

} catch (Exception $e) {
    error_log("Resend 2FA Error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Failed to resend 2FA code."]);
}
?>
