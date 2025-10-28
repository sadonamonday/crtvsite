<?php
include __DIR__ . "/database.php";

if (isset($_GET['token'])) {
    $token = $_GET['token'];

    $stmt = $con->prepare("SELECT user_id, verification_token_expires_at FROM users WHERE verification_token=? AND email_verified=0");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        if (strtotime($row['verification_token_expires_at']) > time()) {
            $update = $con->prepare("UPDATE users SET email_verified=1, verification_token=NULL, verification_token_expires_at=NULL WHERE user_id=?");
            $update->bind_param("i", $row['user_id']);
            $update->execute();
             echo "
                <h3>Email verified successfully.</h3>
                <p><a href='http://localhost:5173/login' style='color: #f41826ff; font-weight: bold; text-decoration: none;'>Login now</a></p>
            ";
        } else {
            echo "<h3>Token expired. Please sign up again.</h3>";
        }
    } else {
        echo "<h3>Invalid or already used token.</h3>";
    }
} else {
    echo "<h3>No token provided.</h3>";
}
?>
