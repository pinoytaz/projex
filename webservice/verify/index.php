<?php

// verify API

if (isset($_POST['data'])) 
{  

	$FieldsArray = explode(',',$_POST['data']);
	$em = $FieldsArray[0];
	$pw = $FieldsArray[1];
	$sq = "'";
	 
	include 'include/db.conf.php';


	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	
	// Check connection
	if ($conn->connect_error) {
		// Database connection error, set JSON message and get out
		$status = "Error";
		$statusMsg = "Connection failed: " . $conn->connect_error;
		$jsondata = ['status' => $status, 'body' => $statusMsg];
		header('Content-type: application/json');
		exit(json_encode($jsondata));
	}
	
	// otherwise, continue

	$sql = "SELECT pw_hash FROM USERS WHERE email_addr = " . $sq . $em . $sq;

	if (!$result = $conn->query($sql)) {
		// SQL query error, set JSON message and get out
		$status = "Error";
		$statusMsg = "Database says: " . $sql . "<br>" . $conn->error;
		$jsondata = ['status' => $status, 'body' => $statusMsg];
		header('Content-type: application/json');
		exit(json_encode($jsondata));
	}
	
	if ($result->num_rows === 0) {
		// email addr not found, set JSON message and get out
		$status = "Error";
		$statusMsg = "The email address was not found.";
		$jsondata = ['status' => $status, 'body' => $statusMsg];
		header('Content-type: application/json');
		exit(json_encode($jsondata));
	}
	
	// if we've gotten this far, then a row was found. Password is either right or wrong.
	
	$resultArray = $result->fetch_assoc();
	$hash = $resultArray['pw_hash'];
	
	if (password_verify($pw, $hash)) {
		$status = "Success";
		$statusMsg = "ID and password verified.";
	} else {
		$status = "Error";
		$statusMsg = "The password was incorrect.";	
	}
	  
	$conn->close();
  
} else {
      $status = "Error";
      $statusMsg = "POST data not found.";
}

$jsondata = ['status' => $status, 'body' => $statusMsg];
header('Content-type: application/json');
exit(json_encode($jsondata));

/*
*/

?>
