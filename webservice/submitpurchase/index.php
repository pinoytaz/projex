<?php
	
// submitpurchase API
	
if (isset($_POST['email']))  {
		
	include 'include/db.conf.php';

	$email = $_POST['email'];
	$stamp = $_POST['stamp'];
	$purch_data = $_POST['purch_data'];

	$uploadfile = $_FILES['jpeg_file']['tmp_name'];
	// get the image orientation data
	$exif = exif_read_data($uploadfile);
	$ont = $exif['Orientation'];

	// RESAMPLE FILESIZE TO MAX 1000 PX EITHER DIMENSION
	
	// Set a maximum height and width
	$width = 1000;
	$height = 1000;

	// Get new dimensions
	list($width_orig, $height_orig) = getimagesize($uploadfile);

	$ratio_orig = $width_orig/$height_orig;

	if ($width/$height > $ratio_orig) {
		$width = $height*$ratio_orig;
	} else {
		$height = $width/$ratio_orig;
	}

	// Resample
	$image_p = imagecreatetruecolor($width, $height);
	$image = imagecreatefromjpeg($uploadfile);
	imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);
	
	// Correct orientation, if necc.
	
	switch($ont) {
		case 3:
			$image_p = imagerotate($image_p, 180, 0);
			break;
		case 6:
			$image_p = imagerotate($image_p, -90, 0);
			break;
		case 8:
			$image_p = imagerotate($image_p, 90, 0);
			break;
	}

	// Output
	imagejpeg($image_p, 'resizedfile.jpg', 90); // << filename might need to be something more specific
	
	$blob = fopen('resizedfile.jpg', "rb") or die("Unable to open uploaded file!");
	$b_data = fread($blob, filesize($uploadfile));
	fclose($blob);
		
	$sq     = "'";
	$comma  = ",";
	$img    = bin2hex($b_data);
	
	// SAVE TO DATABASE
		
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
	
  	//no registered company send email instead
    $sql = sprintf('SELECT comp_num, acct_email, first_name, last_name FROM USERS u '.
               'WHERE u.email_addr = "%s"', $conn->real_escape_string($email));

    if ($result = $conn->query($sql)) {
        $row = $result->fetch_assoc();
        if($row['comp_num']<1){
          $from = 'Projex Mailer DO NOT REPLY <projex@email.com>';
          $to = $row['acct_email'];
          $subject="Expense from ".$row['first_name']." ".$row['last_name'];
          $message="";
          $message.=$row['first_name']." ".$row['last_name']." has submitted the following purchase from ProjEx mobile application.";
          $message.="[Project Name]  [Payment Type]   [Selected Cost Code]    [Amt]     [Project Name]";
          $message.="<a href='#'>CLICK HERE</a> to customize the way you receive this information";
          $message.="Features available with a FREE account:<br>";
          $message.="<ul><li>Allow or require approval of purchases</li>";
          $message.="<li>Remind field employees to submit purchases</li>";
          $message.="<li>Remind Approvers to approve field purchases</li>";
          $message.="<li>Export expenses as needed in excel or CSV format for importing into your accounting software</li>";
          $message.="<li>Import Project Budgets to match project names & cost codes to those in your accounting software</li>";
          $message.="<li>Enter Payment Types to match those in your accounting software</li>";
          $message.="<li>Add users to ProjEx mobile app</li></ul>";
          $message.=$purch_data;
          
          $headers[] = 'From: '.$from;
          $headers[] = 'Reply-To: ' .$from;
          $headers[] = 'X-Mailer: PHP/' . phpversion();
          $headers[] = 'MIME-Version: 1.0';
          $headers[] = 'Content-type: text/html; charset=iso-8859-1';

          $success= mail($to ,$subject ,$message, implode("\r\n", $headers));
        }
        $result->free();
      
        $status = "Success";
		$statusMsg = "Email sent.";
		$jsondata = ['status' => $status, 'body' => $statusMsg];
		header('Content-type: application/json');
		exit(json_encode($jsondata));
    }
  
	$purch_data = $conn->real_escape_string($purch_data);
	
	$sql = "INSERT INTO PURCHASES (email_addr,when_submitted,purchase_data,jpeg_data) VALUES (" . $sq . $email . $sq . $comma . $sq . $stamp . $sq . $comma . $sq . $purch_data . $sq . $comma . $sq . $img . $sq . ")";
	
	if ($conn->query($sql) === TRUE) {
	
	// Row successfully added
	
		$status = "Success";
		$statusMsg = "Purchase submitted.";
	
	} else {
	
		// SQL insert error, set JSON message and get out
		
		$status = "Error";
		$statusMsg = "There was a SQL error inserting the PURCHASES row.";
		$jsondata = ['status' => $status, 'body' => $statusMsg, 'sql' => $sql2, 'dbSays' => $conn->error];
		header('Content-type: application/json');
		exit(json_encode($jsondata));
	}
	
} else {
	$status = "Error";
	$statusMsg = "POST data not found.";
}

$jsondata = ['status' => $status, 'body' => $statusMsg];
header('Content-type: application/json');
exit(json_encode($jsondata));
	
?>
