<?php
header("Content-Type: application/json");

// Set CORS headers for admin operations
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, ['http://localhost:5173', 'https://localhost:5173', 'http://127.0.0.1:5173', 'https://127.0.0.1:5173'])) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/config.php";

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Only POST method is allowed");
    }

    // Handle multipart/form-data for file uploads
    $title = isset($_POST['title']) ? sanitizeInput($_POST['title']) : '';
    $description = isset($_POST['description']) ? sanitizeInput($_POST['description']) : '';
    $price = isset($_POST['price']) ? floatval($_POST['price']) : 0;
    $category = isset($_POST['category']) ? sanitizeInput($_POST['category']) : '';

    // Validate required fields
    if (empty($title) || empty($description) || empty($category)) {
        throw new Exception("Title, description, and category are required");
    }

    // Validate price
    if ($price < 0) {
        throw new Exception("Price must be a positive number");
    }

    // Handle image upload
    $imagePath = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/uploads/';
        
        // Create directory if it doesn't exist
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        $fileType = $_FILES['image']['type'];
        
        if (!in_array($fileType, $allowedTypes)) {
            throw new Exception("Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed.");
        }

        // Generate unique filename
        $extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $filename = uniqid('product_') . '.' . $extension;
        $targetPath = $uploadDir . $filename;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            // Store just the filename in database (matching existing format)
            $imagePath = $filename;
        } else {
            throw new Exception("Failed to upload image");
        }
    }

    // Connect to database
    $db = getDBConnection();

    // Insert product
    $sql = "INSERT INTO products (title, description, price, image, category, created_at) 
            VALUES (:title, :description, :price, :image, :category, NOW())";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':title' => $title,
        ':description' => $description,
        ':price' => $price,
        ':image' => $imagePath,
        ':category' => $category
    ]);

    $productId = $db->lastInsertId();

    echo json_encode([
        "success" => true,
        "message" => "Product added successfully",
        "product_id" => $productId,
        "image_path" => $imagePath
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
