<?php
    header("Access-Control-Allow-Origin:*");
	header("Content-Type:text/html;charset=utf-8");
	date_default_timezone_set('PRC');
    require('./conn.php');
    $data = [];
    if(isset($_POST['safe_password']) && isset($_POST['user_id'])){
        $safe_password = $_POST['safe_password'];
        $user_id = $_POST['user_id'];
        $sql = "select * from user where user_id = '$user_id'";
        $result = $conn->query($sql);
        $results = array();
        while ($row = $result->fetch_assoc()) {
            $results[] = $row;
        }
        if(count($results) > 0){
            $sql = "UPDATE user SET safe_password = '$safe_password' WHERE id = '$user_id'";
        }else{
            $sql = "INSERT INTO user (user_id, safe_password) VALUES ('$user_id', '$safe_password')";
        }
        if ($conn->query($sql) == TRUE) {
            $data['code'] = 0;
        } else {
            $data['code'] = 1;
        }
    }else{
        $data['code'] = -1;
    }
    echo json_encode($data);
?>