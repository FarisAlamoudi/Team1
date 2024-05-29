const urlBase = 'http://cosmiccontacts.net/LAMPAPI';
const extension = 'php';

let ID = 0;
let USER = "";

// temp solution to ID issues
function storeID(ID)
{
    localStorage.setItem('storedID', ID);
}
function getStoredID()
{
    return localStorage.getItem('storedID');
}

// need better ID solution
function login()
{
    document.getElementById('loginResult').innerHTML = "";

    let userName = document.getElementById("loginName").value.trim();
    let password = document.getElementById("loginPassword").value.trim();
    var hash = md5(password);
    ID = 0;
    let jsonPayload = JSON.stringify({userName:userName,password:hash});
    let url = urlBase + '/Login.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function()
    {
        if (this.readyState === 4)
        {
            if (this.status === 200)
            {
                let response = JSON.parse(xhr.responseText);
                ID = response.userId;
                USER = response.userName;
                storeID(ID);
                // console.log(ID) == correct ID
                // console.log(USER) == correct USER
                saveCookie();
                window.location.href = "contacts.html";
            }
            else if (this.status === 401)
            {
                document.getElementById("loginResult").innerHTML = "Incorrect Username or Password";
            }
            else
            {
                document.getElementById("loginResult").innerHTML = "Error: " + xhr.status;
            }
        }
    };
    xhr.send(jsonPayload);
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "ID=" + ID + ",USER=" + USER + ";expires=" + date.toGMTString();
}

function readCookie()
{
	ID = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if(tokens[0] == "USER")
		{
			USER = tokens[1];
		}
		else if(tokens[0] == "ID")
		{
			ID = parseInt(tokens[1].trim());
		}
	}

	if(ID < 0)
	{
		window.location.href = "index.html";
	}
	else
	{
        document.getElementById("userName").innerHTML = "USER: " + USER;
	}
}

// needs REGEX hints (might be html job)
function register()
{
    document.getElementById('registerResult').innerHTML = "";
    document.getElementById("firstNameError").innerHTML = "";
    document.getElementById("lastNameError").innerHTML = "";
    document.getElementById("userNameError").innerHTML = "";
    document.getElementById("passwordError").innerHTML = "";

    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let userName = document.getElementById("userName").value.trim();
    let password = document.getElementById("password").value.trim();
    var hash = md5(password);
    var validity = true;
    
    if (firstName == "")
    {
        document.getElementById("firstNameError").innerHTML = "Invalid First Name";
        validity = false;
    }
    if (lastName == "")
    {
        document.getElementById("lastNameError").innerHTML = "Invalid Last Name";
        validity = false;
    }
    
    var regex = /^(?=.*\d)(?=.*[a-zA-Z]).{4,16}$/;
    if (regex.test(userName) == false)
    {
        document.getElementById("userNameError").innerHTML = "Invalid User Name";
        validity = false;
    }

    var regex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{4,16}$/;
    if (regex.test(password) == false)
        {
        document.getElementById("passwordError").innerHTML = "Invalid Password";
        validity = false;
    }

    if (!validity)
    {
        document.getElementById("registerResult").innerHTML = "INVALID";
        return;
    }

    let jsonPayload = JSON.stringify({firstName:firstName,lastName:lastName,userName:userName,password:hash});
    let url = urlBase + '/Register.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function()
    {
        if (this.readyState === 4) 
        {
            if (this.status === 200)
            {
                document.getElementById("registerResult").innerHTML = "User added";
                window.location.href="index.html";
            }
            else if (this.status == 409)
            {
                document.getElementById("registerResult").innerHTML = "Username Taken";
            }
            else
            {
                document.getElementById("registerResult").innerHTML = "Error: " + xhr.status;
            }
        }
    };
    xhr.send(jsonPayload);
}

function logout()
{
    ID = 0;
    USER = "";
    document.cookie = "USER= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

// ???
function showTable()
{
    var addContactForm = document.getElementById("addContactForm");
    var contacts = document.getElementById("contacts");

    if (addContactForm.style.display === "none")
    {
        addContactForm.style.display = "block";
        contacts.style.display = "none";
    }
    else
    {
        addContactForm.style.display = "none";
        contacts.style.display = "block";
    }
}

// needs REGEX hints (might be html job) | need better ID solution
function addContact()
{
    document.getElementById('addResult').innerHTML = "";
    document.getElementById("firstNameError").innerHTML = "";
    document.getElementById("lastNameError").innerHTML = "";
    document.getElementById("phoneNumberError").innerHTML = "";
    document.getElementById("emailAddressError").innerHTML = "";

    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let phoneNumber = document.getElementById("phoneNumber").value.trim();
    let emailAddress = document.getElementById("emailAddress").value.trim();
    let validity = true;

    document.getElementById('addResult').innerHTML = "";

    if (firstName == "")
    {
        document.getElementById("firstNameError").innerHTML = "Invalid First Name";
        validity = false;
    }

    if (lastName == "")
    {
        document.getElementById("lastNameError").innerHTML = "Invalid Last Name";
        validity = false;
    }

    var regex = /^\d{3}-\d{3}-\d{4}$/;
    if (regex.test(phoneNumber) == false)
    {
        document.getElementById("phoneNumberError").innerHTML = "Invalid Phone Number";
        validity = false;
    }

    var regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    if (regex.test(emailAddress) == false)
    {
        document.getElementById("emailAddressError").innerHTML = "Invalid Email Address";
        validity = false;
    }

    if (!validity)
    {
        document.getElementById("addResult").innerHTML = "INVALID";
        return;
    }

    let jsonPayload = JSON.stringify({firstName:firstName,lastName:lastName,phoneNumber:phoneNumber,emailAddress:emailAddress,userId:getStoredID()});
    let url = urlBase + '/AddContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function()
    {
        if (this.readyState == 4)
        {
            document.getElementById("addResult").innerHTML = "Contact added";
            showTable();
        }
    };
    xhr.send(jsonPayload);
}

// ???
function showAddForm()
{
    //Get the addContact Form
    var form = document.getElementById("addContactForm");

    //Set the display property to "block" to show the form
    form.style.display = "block";
}

// ???
function cancelAdd()
{
    // Get the form element
    var form = document.getElementById("addContactForm");

    // Set the display property to "none" to hide the form
    form.style.display = "none";
}

// ???
function searchContacts()
{
    let jsonPayload = JSON.stringify({search:"",userId:getStoredID()});
    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            let response = JSON.parse(xhr.responseText);
            let text = "<table border='1'><thead><tr><th>First Name</th><th>Last Name</th><th>Email Address</th><th>Phone Number</th><th></th></tr></thead><tbody>";
            for (let i = 0; i < response.results.length; i++)
            {
                text += "<tr id='row" + i + "'>";
                text += "<td id='first_Name" + i + "'>" + response.results[i].firstName + "</td>";
                text += "<td id='last_Name" + i + "'>" + response.results[i].lastName + "</td>";
                text += "<td id='email" + i + "'>" + response.results[i].emailAddress + "</td>";
                text += "<td id='phone" + i + "'>" + response.results[i].phoneNumber + "</td>";
                text += "<td>" +
                    "<button type='button' id='edit_button" + i + "' class='w3-button w3-circle w3-lime' onclick='editContact(" + i + ")'>Edit</button>" +
                    "<button type='button' id='save_button" + i + "' value='Save' class='w3-button w3-circle w3-lime' onclick='updateContact(" + i + ")' style='display: none'>Save</button>" +
                    "<button type='button' onclick='deleteContact(" + i + ")' class='w3-button w3-circle w3-amber'>Delete</button></td>";
                text += "</tr>";
            }
            text += "</tbody></table>";
            document.getElementById("tbody").innerHTML = text;
        }
    };
    xhr.send(jsonPayload);
}

// ???
function editContact(contactId)
{
    // Store the id of the contact being edited
    currentContactId = contactId;

    // Get the current contact details
    var firstName = document.getElementById("first_Name" + contactId).innerText;
    var lastName = document.getElementById("last_Name" + contactId).innerText;
    var phoneNumber = document.getElementById("phone" + contactId).innerText;
    var emailAddress = document.getElementById("email" + contactId).innerText;

    // Populate the edit form with the current contact details
    document.getElementById("editFirstName").value = firstName;
    document.getElementById("editLastName").value = lastName;
    document.getElementById("editPhoneNumber").value = phoneNumber;
    document.getElementById("editEmailAddress").value = emailAddress;

    // Show the edit form
    document.getElementById("editContactForm").style.display = "block";
}

// ???
function updateContact()
{
    // Get the new contact details from the form
    var firstName = document.getElementById("editFirstName").value;
    var lastName = document.getElementById("editLastName").value;
    var phoneNumber = document.getElementById("editPhoneNumber").value;
    var emailAddress = document.getElementById("editEmailAddress").value;

    // Update the contact with the new details
    // This would typically involve sending a request to the server
    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200)
            {
                console.log("Contact has been updated");
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }

    // Hide the edit form
    document.getElementById("editContactForm").style.display = "none";
}

// ???
function deleteContact(no) 
{
    var namef_val = document.getElementById("first_Name" + no).innerText;
    var namel_val = document.getElementById("last_Name" + no).innerText;
    nameOne = namef_val.substring(0, namef_val.length);
    nameTwo = namel_val.substring(0, namel_val.length);
    let check = confirm('Confirm deletion of contact: ' + nameOne + ' ' + nameTwo);
    if (check === true)
        {
        document.getElementById("row" + no + "").outerHTML = "";

        let jsonPayload = JSON.stringify({firstName:firstName,lastName:lastName,userId:getStoredID()});
        let url = urlBase + '/DeleteContact.' + extension;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("Contact has been deleted");
                    loadContacts();
                }
            };
            xhr.send(jsonPayload);
    };
}
