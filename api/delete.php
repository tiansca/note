<?php
    header("Access-Control-Allow-Origin:*");
	header("Content-Type:text/html;charset=utf-8");
	date_default_timezone_set('PRC');
    require('./conn.php');
    $timeValue = (time() - 86400 * 20) * 1000;
    $findsql = "DELETE FROM note WHERE status=0 and '$timeValue'>updateTime";
    $result = $conn->query($findsql);
    echo $result;
?>