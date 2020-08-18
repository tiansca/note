<?php
    header("Access-Control-Allow-Origin:*");
	header("Content-Type:text/html;charset=utf-8");
	date_default_timezone_set('PRC');
    require('./conn.php');
    $data = [];
    if(isset($_POST['labelArr']) && isset($_POST['user_id'])){
        $labelArr = $_POST['labelArr'];
        $user_id = $_POST['user_id'];
        $sql = "select * from user where user_id = '$user_id'";
        $result = $conn->query($sql);
        $results = array();
        while ($row = $result->fetch_assoc()) {
            $results[] = $row;
        }
        if(count($results) > 0){
            $sql = "UPDATE user SET label_arr = '$labelArr' WHERE user_id = '$user_id'";
        }else{
            $sql = "INSERT INTO user (user_id, label_arr) VALUES ('$user_id', '$labelArr')";
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