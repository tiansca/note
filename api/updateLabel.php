<?php
    header("Access-Control-Allow-Origin:*");
	header("Content-Type:text/html;charset=utf-8");
	date_default_timezone_set('PRC');
    require('./conn.php');
    $data = [];
    require('./get_header.php');
    $user_id = getallheaders()['Userid'];
    if(isset($_POST['labelArr']) && $user_id){
        $labelArr = $_POST['labelArr'];
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