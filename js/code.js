const urlBase = 'http://cosmiccontacts.net/LAMPAPI';
const extension = 'php';
var currentContactId; //Track Current UserID
let userId = 0;

// WORKS but no md5 password hashing
function login()
{
    document.getElementById('loginResult').innerHTML = "";
    let userName = document.getElementById("loginName").value.trim();
    let password = document.getElementById("loginPassword").value.trim();
    // var hash = md5(password);

    let jsonPayload = JSON.stringify({userName:userName,password:password});
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
                //userId = jsonObject.id;
                let response = JSON.parse(xhr.responseText);
                if (response.id > 0)
                {
                    window.location.href = "contacts.html";
                }
                else
                {
                    document.getElementById("loginResult").innerHTML = "Incorrect Username or Password";
                }
            }
            else if (this.status === 401)
            {
                document.getElementById("loginResult").innerHTML = "No Records Found";
            }
            else
            {
                document.getElementById("loginResult").innerHTML = "Error: " + xhr.status;
            }
        }
    };
    xhr.send(jsonPayload);
}

// WORKS but no md5 password hashing and NO field validation / regex
function register()
{
    document.getElementById('registerResult').innerHTML = "";
    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let userName = document.getElementById("userName").value.trim();
    let password = document.getElementById("password").value.trim();
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
    
    var regex = /(?=.*[a-zA-Z])([a-zA-Z0-9]).{6,20}$/;
    if (regex.test(userName) == false)
    {
        document.getElementById("userNameError").innerHTML = "Invalid User Name";
        validity = false;
    }

    var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{6,22}/;
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

    let jsonPayload = JSON.stringify({firstName:firstName,lastName:lastName,userName:userName,password:password});
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
                //userId = jsonObject.id;
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

// top left button on contacts page returns to login screen
function logout()
{
    userId = 0;
    firstName = "";
    lastName = "";

    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

// 
function showTable() {
    var addContactForm = document.getElementById("addContactForm");
    var contacts = document.getElementById("contacts");

    if (addContactForm.style.display === "none") {
        addContactForm.style.display = "block";
        contacts.style.display = "none";
    } else {
        addContactForm.style.display = "none";
        contacts.style.display = "block";
    }
}


// 
function addContact()
{
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let phoneNumber = document.getElementById("phoneNumber").value;
    let emailAddress = document.getElementById("emailAddress").value;

    let jsonPayload = JSON.stringify({firstName:firstName,lastName:lastName,phoneNumber:phoneNumber,emailAddress:emailAddress,userId:userId});
    let url = urlBase + '/AddContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            document.getElementById("registerResult").innerHTML = "Contact added";
            document.getElementById("addMe").reset();
            loadContacts();
            showTable();
        }
    };
    xhr.send(jsonPayload);
}

function showAddForm() {
    //Get the addContact Form
    var form = document.getElementById("addContactForm");

    //Set the display property to "block" to show the form
    form.style.display = "block";
}

function cancelAdd() {
    // Get the form element
    var form = document.getElementById("addContactForm");

    // Set the display property to "none" to hide the form
    form.style.display = "none";

    // Clear the input fields
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}

//
function loadContacts() {
    let jsonPayload = JSON.stringify({ search: "", userId: userId });
    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhr.responseText);
            let text = "<table border='1'><thead><tr><th>First Name</th><th>Last Name</th><th>Email Address</th><th>Phone Number</th><th></th></tr></thead><tbody>";
            for (let i = 0; i < response.results.length; i++) {
                text += "<tr id='row" + i + "'>";
                text += "<td id='first_Name" + i + "'>" + response.results[i].FirstName + "</td>";
                text += "<td id='last_Name" + i + "'>" + response.results[i].LastName + "</td>";
                text += "<td id='email" + i + "'>" + response.results[i].EmailAddress + "</td>";
                text += "<td id='phone" + i + "'>" + response.results[i].PhoneNumber + "</td>";
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


function editContact(contactId) {
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

function updateContact() {
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
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }

    // Hide the edit form
    document.getElementById("editContactForm").style.display = "none";
}

/* Replaced by editContact
function edit_row(id) {
    document.getElementById("edit_button" + id).style.display = "none";
    document.getElementById("save_button" + id).style.display = "inline-block";

    var firstNameI = document.getElementById("first_Name" + id);
    var lastNameI = document.getElementById("last_Name" + id);
    var email = document.getElementById("email" + id);
    var phone = document.getElementById("phone" + id);

    var namef_data = firstNameI.innerText;
    var namel_data = lastNameI.innerText;
    var email_data = email.innerText;
    var phone_data = phone.innerText;

    firstNameI.innerHTML = "<input type='text' id='namef_text" + id + "' value='" + namef_data + "'>";
    lastNameI.innerHTML = "<input type='text' id='namel_text" + id + "' value='" + namel_data + "'>";
    email.innerHTML = "<input type='text' id='email_text" + id + "' value='" + email_data + "'>";
    phone.innerHTML = "<input type='text' id='phone_text" + id + "' value='" + phone_data + "'>"
}*/

/* Replaced by updateContact
function save_row(no) {
    var namef_val = document.getElementById("namef_text" + no).value;
    var namel_val = document.getElementById("namel_text" + no).value;
    var email_val = document.getElementById("email_text" + no).value;
    var phone_val = document.getElementById("phone_text" + no).value;
    var id_val = ids[no]

    document.getElementById("first_Name" + no).innerHTML = namef_val;
    document.getElementById("last_Name" + no).innerHTML = namel_val;
    document.getElementById("email" + no).innerHTML = email_val;
    document.getElementById("phone" + no).innerHTML = phone_val;

    document.getElementById("edit_button" + no).style.display = "inline-block";
    document.getElementById("save_button" + no).style.display = "none";

    let tmp = {
        phoneNumber: phone_val,
        emailAddress: email_val,
        newFirstName: namef_val,
        newLastName: namel_val,
        id: id_val
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}*/

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

        let jsonPayload = JSON.stringify({firstName:firstName,lastName:lastName,userId:userId});
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

function searchContacts() {
    const content = document.getElementById("searchText");
    const selections = content.value.toUpperCase().split(' ');
    const table = document.getElementById("contacts");
    const tr = table.getElementsByTagName("tr");// Table Row

    for (let i = 0; i < tr.length; i++) {
        const td_fn = tr[i].getElementsByTagName("td")[0];// Table Data: First Name
        const td_ln = tr[i].getElementsByTagName("td")[1];// Table Data: Last Name

        if (td_fn && td_ln) {
            const txtValue_fn = td_fn.textContent || td_fn.innerText;
            const txtValue_ln = td_ln.textContent || td_ln.innerText;
            tr[i].style.display = "none";

            for (selection of selections) {
                if (txtValue_fn.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
                if (txtValue_ln.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
            }
        }
    }
    // Show the table after search
    $('.tables').show();
}


function contactIsValid(firstName, lastName, phoneNumber, emailAddress) {

    var validity = true;

    if (firstName == "") {
        document.getElementById("contactResult").innerHTML = "Invalid First Name";
        validity = false;
    }

    if (lastName == "") {
        document.getElementById("contactResult").innerHTML = "Invalid Last Name";
        validity = false;
    }

    var regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
    if (regex.test(phoneNumber) == false) {
        document.getElementById("contactResult").innerHTML = "Invalid Phone Number";
        validity = false;
    }

    var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (regex.test(emailAddress) == false) {
        document.getElementById("contactResult").innerHTML = "Invalid Email Address";
        validity = false;
    }

    return validity;
}
