<?php
    header("Access-Control-Allow-Origin:*");
	header("Content-Type:text/html;charset=utf-8");
	date_default_timezone_set('PRC');
    require('./conn.php');
    require('./get_header.php');
    $user_id = getallheaders()['Userid'];
    $data = [];
    if($user_id){
        $sql = "select * from user where user_id = '$user_id'";
        $result = $conn->query($sql);
        $results = array();
        while ($row = $result->fetch_assoc()) {
            $results[] = $row;
        }
        $data["data"] = $results[0];
        $data['code'] = 0;
        // 判断有无值
//        echo json_encode($results);
        if (count($results) === 0 ) {
            $sql = "INSERT INTO user (user_id) VALUES ('$user_id')";
            if ($conn->query($sql) == TRUE) {
                $data['code'] = 0;
            } else {
                $data['code'] = 1;
            }
//            echo json_encode($data);
        }
    }else{
        $data['code'] = -1;
    }
    echo json_encode($data);
?>