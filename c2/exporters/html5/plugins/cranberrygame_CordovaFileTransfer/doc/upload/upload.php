<?php
	//client: <input type="file" name="uploadfile" />
	echo "uploadfile name: " . $_FILES["uploadfile"]["name"] . "<br>";
	echo "uploadfile type: " . $_FILES["uploadfile"]["type"] . "<br>";
	echo "uploadfile size: " . ($_FILES["uploadfile"]["size"]) . " Byte<br>";
	echo "uploadfile tmp_name: " . $_FILES["uploadfile"]["tmp_name"] . "<br>";
	
	move_uploaded_file($_FILES["uploadfile"]["tmp_name"], $_FILES["uploadfile"]["name"]);
?>
