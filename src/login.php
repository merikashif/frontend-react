<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "parcheggio_brescia");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "error" => "Errore connessione DB: " . $conn->connect_error
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password)) {
    echo json_encode([
        "success" => false,
        "error" => "Dati mancanti"
    ]);
    exit;
}

$email = $conn->real_escape_string($data->email);
$password = $conn->real_escape_string($data->password);

$sql = "SELECT * FROM utenti WHERE email='$email' AND password='$password'";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();

    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $user["id"],
            "nome" => $user["nome"],
            "ruolo" => $user["ruolo"]
        ]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => "Credenziali errate"
    ]);
}
?>