<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION["foods"])) {
    $_SESSION["foods"] = [];
}

$action = $_GET['action'] ?? $_POST['action'] ?? "";

/* ───────── GET ───────── */
if ($action == "get") {
    echo json_encode($_SESSION["foods"]);
}

/* ───────── ADD ───────── */
if ($action == "add") {

    $food = [
        "id" => uniqid(),
        "food_name" => $_POST['name'],
        "calories" => $_POST['cal'],
        "protein" => $_POST['pro'],
        "carbs" => $_POST['car'],
        "fat" => $_POST['fat']
    ];

    $_SESSION["foods"][] = $food;

    echo json_encode(["status" => "added"]);
}

/* ───────── DELETE ───────── */
if ($action == "delete") {

    $id = $_GET['id'];

    $_SESSION["foods"] = array_filter($_SESSION["foods"], function($f) use ($id) {
        return $f["id"] != $id;
    });

    $_SESSION["foods"] = array_values($_SESSION["foods"]);

    echo json_encode(["status" => "deleted"]);
}

/* ───────── CLEAR ───────── */
if ($action == "clear") {
    $_SESSION["foods"] = [];
    echo json_encode(["status" => "cleared"]);
}
?>