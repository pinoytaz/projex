<?php
	
// projects API
	
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
        
        $sql = sprintf('SELECT proj_id projectId, proj_name projectName FROM PROJECTS p '.
                       'INNER JOIN COMPANIES c ON '.
                       'p.comp_number = c.comp_number INNER JOIN USERS u ON '.
                       'c.admin_email = u.acct_email '.
                       'WHERE u.email_addr = "%s"', $conn->real_escape_string($email));

        if ($result = $conn->query($sql)) {
            $status = "Success";
          $rows=[];
            while($row = $result->fetch_assoc()){
              array_push($rows,$row);
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
