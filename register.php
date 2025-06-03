<?php
// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "friends_gallery";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle registration
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT); // Encrypt the password
    $year = $_POST['year'];

    // Insert user into the database
    $sql = "INSERT INTO users (username, password, year) VALUES ('$username', '$password', '$year')";
    if ($conn->query($sql) === TRUE) {
        echo "Registration successful!";
        // Redirect to login page
        header("Location: login.html");
        exit(); // Ensure no further execution after redirect
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
