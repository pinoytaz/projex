<?php
	
// purchase API
	
if (isset($_GET['cmd']) || isset($_POST['cmd']))  {
		
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
    $cmd = $_GET['cmd'];
    $email = urldecode($_GET['email']);
    if($cmd=='list'){
        
        $sql = sprintf('SELECT purchase_id, purchase_data, when_submitted purchaseDate, jpeg_data imageData FROM PURCHASES p '.
                       'WHERE approved=0 and email_addr = "%s"', $conn->real_escape_string($email));

        if ($result = $conn->query($sql)) {
            $status = "Success";
          $rows=[];
            while($row = $result->fetch_assoc()){
              $imageBin = base64_encode(hex2bin($row['imageData']));
              $purch = ['purchase_data'=>$row['purchase_data'],'imageData'=>$imageBin,'purchase_id'=>$row['purchase_id'],'purchaseDate'=>$row['purchaseDate']];
              array_push($rows,$purch);
            }
            $statusMsg = $rows;
            /* free result set */
            $result->free();
        }else{
            // SQL query error, set JSON message and get out
            $status = "Error";
            $statusMsg = "Database says: " . $sql . "<br>" . $conn->error;
            $jsondata = ['status' => $status, 'body' => $statusMsg];
            header('Content-type: application/json');
            exit(json_encode($jsondata));
        }
    }else{
        $status = "Error";
        $statusMsg = "No data.";
    }
    /* close connection */
    $conn->close();
} else {
	$status = "Error";
	$statusMsg = "POST data not found.";
}
	
$jsondata = ['status' => $status, 'body' => $statusMsg];
header('Content-type: application/json');
exit(json_encode($jsondata));
	
?>
