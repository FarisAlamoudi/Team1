<?php

	$inData = getRequestInfo();

	$newFirstName = $inData["firstName"];
	$newLastName = $inData["lastName"];
	$newPhoneNumber = $inData["phoneNumber"];
	$newEmailAddress = $inData["emailAddress"];
	$updateId = $inData["updateId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, PhoneNumber=?, EmailAddress=? WHERE ID=?");
		$stmt->bind_param("ssssii", $newFirstName, $newLastName, $newPhoneNumber, $newEmailAddress, $updateId, $userId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>
