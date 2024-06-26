<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (firstName LIKE ? OR lastName LIKE ? OR phoneNumber LIKE ? OR emailAddress LIKE ?) AND userId=?");
		$search = "%" . $inData["search"] . "%";
		$stmt->bind_param("ssssi", $search, $search, $search, $search, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"firstName" : "' . $row["firstName"]. '", "lastName" : "' . $row["lastName"]. '", "phoneNumber" : "' . $row["phoneNumber"]. '", "emailAddress" : "' . $row["emailAddress"]. '", "userId" : "' . $row["userId"].'", "ID" : "' . $row["ID"]. '"}';
		}
		
		returnWithInfo($searchResults);
		
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
	
	function returnWithInfo($searchResults)
	{
		$retValue = '{"searchResults":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson($retValue);
	}
	
?>
