<?php

// API getpurchaseimage

include 'include/db.conf.php';

if (isset($_POST['data'])) {

	$purch_id = $_POST['data'];
	$img      = "";

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	
	// Check connection
	if ($conn->connect_error) {
	
		$status = "Error";
		$statusMsg = "Connection failed: " . $conn->connect_error;
		
	} else {

		$sql = "SELECT jpeg_data FROM PURCHASES WHERE purchase_id = '" . $purch_id . "'";

		if ($result = $conn->query($sql)) {
		
			$status = "Success";
			$statusMsg = "SQL successfully executed by database";
			
			if ($result->num_rows === 0) {
			
				// purchase not found
				$status = "Error";
				$statusMsg = "No purchase found with that ID";

			} else {
			
				// purchase found
				$status = "Success";
				$statusMsg = "Following is the image payload, base64 encoded:";
				$resultArray = $result->fetch_assoc();
				$tempImg = $resultArray['jpeg_data'];
				$img = base64_encode(Hex2Bin($tempImg));
			
			}
		
		} else {
		
			$status = "Error";
			$statusMsg = "SQL error. Database says: " . $sql . "<br>" . $conn->error;
		}

		$conn->close();
  
	}

} else {

      $status = "Error";
      $statusMsg = "POST data not found.";
}

$jsondata = ['status' => $status, 'detail' => $statusMsg, 'img' => $img];
header('Content-type: application/json');
exit(json_encode($jsondata));

?>