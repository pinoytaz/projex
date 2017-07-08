<?php

// API adduser

if (isset($_POST['data'])) 
{  

  $FieldsArray = explode(',',$_POST['data']);
  $em = $FieldsArray[0];
  $pw = password_hash($FieldsArray[1], PASSWORD_DEFAULT);
  $fn = $FieldsArray[2];
  $ln = $FieldsArray[3];
  $ae = $FieldsArray[4];
  $et = $FieldsArray[5];
  $sq = "'";
  $fb = "', '";
  $valuesString = $sq . $em . $fb . $pw . $fb . $fn . $fb . $ln . $fb . $et . $fb . $ae . $sq;
  
  $servername = "216.219.81.80";
  $username = "softcast_px";
  $password = "LobsterTelephone";
  $dbname = "softcast_pp";

  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname);
  // Check connection
  if ($conn->connect_error) {
      $status = "Error";
      $statusMsg = "Connection failed: " . $conn->connect_error;
  } else {

  $sql = "INSERT INTO USERS (email_addr, pw_hash, first_name, last_name, user_type, acct_email)
  VALUES (" . $valuesString . ")";

  if ($conn->query($sql) === TRUE) {
      $status = "Success";
      $statusMsg = "New record created successfully";
  } else {
      $status = "Error";
      $statusMsg = "Database says: " . $sql . "<br>" . $conn->error;
  }

  
  $conn->close();
  
  }

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
