<?php

// resetpassword API

if (isset($_POST['data'])) 
{  

	$FieldsArray = explode('&&&&',$_POST['data']);
	$em = $FieldsArray[0];
	$sq = "'";
	$comma = ",";
	
	include 'include/db.conf.php';
	include 'include/license_key.class.php';
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

	$sql = "SELECT * FROM USERS WHERE email_addr = " . $sq . $em . $sq;

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
		$jsondata = ['status' => $status, 'body' => $statusMsg, 'sql' => $sql];
		header('Content-type: application/json');
		exit(json_encode($jsondata));
	}
	
	// if we've gotten this far, then a row was found. Assemble the email and send it.
	
	$key = new license_key();
	$key->keylen = 16;
	$key->formatstr = "4444";
	$key->software = "pp";
	$newkey = $key->codeGenerate("user");
	
	// link expires exactly 24 hours from now
	$expires = new DateTime(date("Y-m-d H:i:s"));
	$expires->add(new DateInterval('P1D'));
	$expiresStr = $expires->format('Y-m-d H:i:s');

	
	// Insert a password change request row in the database
	
	$sql2 = "INSERT INTO PW_CH_RQ (email_addr,rq_key,expires) VALUES (" . $sq . $em . $sq . $comma . $sq . $newkey . $sq . $comma . $sq . $expiresStr . $sq . ")";
	if ($conn->query($sql2) === TRUE) {
	// Row successfully added
	} else {
		// SQL insert error, set JSON message and get out
		$status = "Error";
		$statusMsg = "There was a SQL error inserting the PW_CH_RQ row.";
		$jsondata = ['status' => $status, 'body' => $statusMsg, 'sql' => $sql2, 'dbSays' => $conn->error];
		header('Content-type: application/json');
		exit(json_encode($jsondata));
	}
	
	// Format and send email to user	
	// Change willcate.com domain below before moving to prod. server
	$linkurl = "http://willcate.com/projectpro/resetpassword.php?emailaddr=" . $em . "&token=" . $newkey;
	$emailBody = "A password change request was submitted for ProjEx/ProjectPro user " . $em . "... please click or paste the link below to complete this action:\n\n";
	$emailBody .= $linkurl . "\n\n";
	$emailBody .= "This link will expire in 24 hours. If you did not make this request, please ignore this message.\n\n";
	$emailBody .= "Thanks,\n\n-- the ProjectPro team.";
	
	$subject = 'ProjectPro Password Change Request';
	$headers = 'From: support@projectprohub.com' . "\r\n" .
    			'Reply-To: support@projectprohub.com' . "\r\n" .
    			'X-Mailer: PHP/' . phpversion();
	mail($em, $subject, $emailBody, $headers);
    
	$status = "Success";
	$statusMsg = "Email sent.";
	  
	$conn->close();
  
} else {
      $status = "Error";
      $statusMsg = "POST data not found.";
}

$jsondata = ['status' => $status, 'body' => $statusMsg];
header('Content-type: application/json');
exit(json_encode($jsondata));

?>
