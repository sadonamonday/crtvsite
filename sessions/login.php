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

// Check if vendor/autoload.php exists
$autoloadPath = __DIR__ . '/../vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    error_log("Composer autoload not found at: $autoloadPath");
    echo json_encode(["success" => false, "message" => "Server configuration error: Composer dependencies not installed"]);
    exit;
}

try {
    require $autoloadPath;
} catch (Error $e) {
    error_log("Autoloader error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Server configuration error: Autoloader failed"]);
    exit;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Get PDO connection
try {
    $db = getDBConnection();
} catch (Exception $e) {
    error_log("Database connection error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// Validate input
if (empty($_POST['user_email']) || empty($_POST['user_password'])) {
    echo json_encode(["success" => false, "message" => "Email and password are required."]);
    exit;
}

$email = trim($_POST['user_email']);
$password = trim($_POST['user_password']);

try {
    // Fetch user with is_admin field
    $stmt = $db->prepare("SELECT user_id, user_password, two_factor_code, two_factor_expires_at, email_verified, user_firstname, is_admin 
                          FROM users WHERE user_email = ?");
    $stmt->execute([$email]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo json_encode(["success" => false, "message" => "Email not registered."]);
        exit;
    }

    if ($row['email_verified'] == 0) {
        echo json_encode([
            "success" => false,
            "email_verified" => false,
            "message" => "Please verify your email before logging in."
        ]);
        exit;
    }

    // Verify password
    if (!password_verify($password, $row['user_password'])) {
        echo json_encode(["success" => false, "message" => "Incorrect password."]);
        exit;
    }

    // Store user info temporarily in session for 2FA verification
    $_SESSION['pending_user_id'] = $row['user_id'];
    $_SESSION['pending_is_admin'] = $row['is_admin'] ?? 0;
    $_SESSION['pending_user_email'] = $email;

    // Generate new 2FA code if missing or expired
    $current_time = date("Y-m-d H:i:s");
    $sendEmail = false;

    if (empty($row['two_factor_code']) || $row['two_factor_expires_at'] < $current_time) {
        $twoFA = rand(100000, 999999);
        $expires = date("Y-m-d H:i:s", strtotime("+5 minutes"));

        $update = $db->prepare("UPDATE users SET two_factor_code = ?, two_factor_expires_at = ? WHERE user_id = ?");
        $update->execute([$twoFA, $expires, $row['user_id']]);

        $sendEmail = true;
    } else {
        $twoFA = $row['two_factor_code'];
    }

    // Send 2FA email if needed
    if ($sendEmail) {
        $mail = new PHPMailer(true);
        try {
            $mail->isMail();
            $mail->setFrom('crtvshots@crtvshotss.atwebpages.com', 'CRTV Shots');
            $mail->addAddress($email);
            $mail->isHTML(true);
            $mail->Subject = 'Your 2FA Verification Code';
            $mail->Body = "Hello {$row['user_firstname']},<br><br>Your 2FA verification code is: <b>$twoFA</b>.<br>It expires in 5 minutes.";
            $mail->AltBody = "Your 2FA verification code is: $twoFA. It expires in 5 minutes.";

            $mail->send();
        } catch (Exception $e) {
            error_log("2FA Mail Error: " . $mail->ErrorInfo);
            echo json_encode(["success" => false, "message" => "Failed to send 2FA email."]);
            exit;
        }
    }

    // 2FA required response
    echo json_encode([
        "success" => true,
        "two_fa" => true,
        "message" => "2FA verification required.",
        "user_firstname" => $row['user_firstname']
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>
