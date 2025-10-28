<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "database.php";
session_start();

// Include PHPMailer classes manually
require __DIR__ . '/../../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if (!isset($_POST['user_email']) || !isset($_POST['user_password'])) {
    echo json_encode(["success" => false, "message" => "Email and password are required."]);
    exit;
}

$email = trim($_POST['user_email']);
$password = trim($_POST['user_password']);

// Fetch user
$stmt = $con->prepare("SELECT user_id, user_password, two_factor_code, two_factor_expires_at, email_verified FROM users WHERE user_email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Email not registered."]);
    exit;
}


$row = $result->fetch_assoc();

if ($row['email_verified'] == 0) {
    echo json_encode([
        "success" => false,
        "email_verified" => false,
        "message" => "Please verify your email before logging in."
    ]);
    $stmt->close();
    $con->close();
    exit;
}


// Verify password
if (!password_verify($password, $row['user_password'])) {
    echo json_encode(["success" => false, "message" => "Incorrect password."]);
    exit;
}


// Generate 2FA code only if it doesn't exist or expired
$current_time = date("Y-m-d H:i:s");
if (empty($row['two_factor_code']) || $row['two_factor_expires_at'] < $current_time) {
    $twoFA = rand(100000, 999999); // 6-digit code
    $expires = date("Y-m-d H:i:s", strtotime("+5 minutes")); // code valid 5 minutes

    $update = $con->prepare("UPDATE users SET two_factor_code = ?, two_factor_expires_at = ? WHERE user_id = ?");
    $update->bind_param("ssi", $twoFA, $expires, $row['user_id']);
    $update->execute();
    $update->close();

    // Send code via PHPMailer
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'ngwenya1305@gmail.com';  // replace with your Gmail
        $mail->Password = 'ghsr bssh ztza ulid';     // Gmail App Password
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('no-reply@crtvshots.com', 'CRTV Shots');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'Your 2FA Verification Code';
        $mail->Body = "Your verification code is: <b>$twoFA</b>. It expires in 5 minutes.";

        $mail->send();
        // Code sent successfully
    } catch (Exception $e) {
        error_log("Mailer Error: " . $mail->ErrorInfo);
    }
}

// Set session
//$_SESSION['user_id'] = $row['user_id'];

echo json_encode([
    "success" => true,
    "two_fa" => true,
    "message" => "2FA verification required."
]);

$stmt->close();
$con->close();
?>
