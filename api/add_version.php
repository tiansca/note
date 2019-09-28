<?php
//    name 用户名
//    password 密码
//    type 1:超级管理员  0：普通用户
//    site_id 如果type为0，绑定工地id

//data 0:成功  -1：缺少参数    -2：用户名已存在  1：插入失败

    header("Access-Control-Allow-Origin:*");
	header("Content-Type:text/html;charset=utf-8");
	date_default_timezone_set('PRC');
    require('./conn.php');
    $data = [];
    if(isset($_POST["version"]) && isset($_POST["link"])){
        $version = $_POST["version"];
        $link = $_POST["link"];

        $sql = "INSERT INTO version (version, link, latest) VALUES ('$version', '$link', 1)";
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