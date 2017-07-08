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
