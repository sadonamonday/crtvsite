<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "database.php";
session_start();

if (!isset($_POST['user_email']) || !isset($_POST['two_factor_code'])) {
    echo json_encode(["success" => false, "message" => "Email and code required."]);
    exit;
}

$email = trim($_POST['user_email']);
$code = trim($_POST['two_factor_code']);

$stmt = $con->prepare("SELECT user_id, two_factor_code, two_factor_expires_at FROM users WHERE user_email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found."]);
    exit;
}

$row = $result->fetch_assoc();
$current_time = date("Y-m-d H:i:s");

// Check if code is correct and not expired
if ($row['two_factor_code'] === $code && $row['two_factor_expires_at'] >= $current_time) {
    // ✅ Clear 2FA code so it cannot be reused
    $update = $con->prepare("UPDATE users SET two_factor_code = NULL, two_factor_expires_at = NULL WHERE user_id = ?");
    $update->bind_param("i", $row['user_id']);
    $update->execute();
    $update->close();

    $_SESSION['user_id'] = $row['user_id']; // still logged in
    echo json_encode(["success" => true, "message" => "2FA verified successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid or expired 2FA code."]);
}

$stmt->close();
$con->close();
?>
