<?php
	header("Access-Control-Allow-Origin: http://www.cosmiccontacts.net");
	header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Authorization");
	
	// Handle preflight requests
	if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
		http_response_code(200);
		exit();
	}

	$inData = getRequestInfo();

	$userName = $inData["userName"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Users WHERE (userName=? AND password=?)");
		$stmt->bind_param("ss", $userName, $password);
		$stmt->execute();
		$result = $stmt->get_result();

		if($row = $result->fetch_assoc())
		{
			http_response_code(200);
			returnWithInfo($row['ID'], $row['userName']);
		}
		else
		{
			http_response_code(401);
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
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
		$retValue = '{"userId":0,"userName":"","error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($userId, $userName)
	{
		$retValue = '{"userId":' . $userId . ',"userName":"' . $userName . '"}';
		sendResultInfoAsJson($retValue);
	}

?>
