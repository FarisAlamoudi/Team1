<?php

	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$userName = $inData["userName"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Users WHERE userName=?");
		$stmt->bind_param("s", $userName);
		$stmt->execute();
		$result = $stmt->get_result();
		
		if ($result->num_rows > 0)
		{
			http_response_code(409);
			returnWithError("Username Taken");
		}
		else
		{
			$stmt = $conn->prepare("INSERT INTO Users (firstName,lastName,userName,password) VALUES(?,?,?,?)");
			$stmt->bind_param("ssss", $firstName, $lastName, $userName, $password);
			$stmt->execute();
			$stmt->close();
			$conn->close();
			http_response_code(200);
			returnWithError("");
		}
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	
	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>
