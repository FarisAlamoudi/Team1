const urlBase = 'http://cosmiccontacts.net/LAMPAPI';
const extension = 'php';

// WORKS but no md5 password hashing (also maybe add field validation????)
function login()
{
    userId = 0;
    firstName = "";
    lastName = "";

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
    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let userName = document.getElementById("userName").value.trim();
    let password = document.getElementById("password").value.trim();

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

// ???
function showTable()
{
    var x = document.getElementById("addMe");
    var contacts = document.getElementById("contactsTable")
    if (x.style.display === "none") {
        x.style.display = "block";
        contacts.style.display = "none";
    } else {
        x.style.display = "none";
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
        if (this.readyState == 4)
        {
            document.getElementById("registerResult").innerHTML = "Contact added";
        }
    };
    xhr.send(jsonPayload);
}

//
function loadContacts()
{
    let jsonPayload = JSON.stringify({search:"",userId:userId});
    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function ()
    {
        if (this.readyState == 4)
        {
            if (this.status == 200)
            {
                
            }
            let respone = JSON.parse(xhr.responseText);
            let text = "<table border='1'>"
            for (let i = 0; i < response.results.length; i++) {
                ids[i] = respone.results[i].ID
                text += "<tr id='row" + i + "'>"
                text += "<td id='first_Name" + i + "'><span>" + respone.results[i].FirstName + "</span></td>";
                text += "<td id='last_Name" + i + "'><span>" + respone.results[i].LastName + "</span></td>";
                text += "<td id='email" + i + "'><span>" + respone.results[i].EmailAddress + "</span></td>";
                text += "<td id='phone" + i + "'><span>" + respone.results[i].PhoneNumber + "</span></td>";
                text += "<td>" +
                    "<button type='button' id='edit_button" + i + "' class='w3-button w3-circle w3-lime' onclick='edit_row(" + i + ")'>" + "<span class='glyphicon glyphicon-edit'></span>" + "</button>" +
                    "<button type='button' id='save_button" + i + "' value='Save' class='w3-button w3-circle w3-lime' onclick='save_row(" + i + ")' style='display: none'>" + "<span class='glyphicon glyphicon-saved'></span>" + "</button>" +
                    "<button type='button' onclick='delete_row(" + i + ")' class='w3-button w3-circle w3-amber'>" + "<span class='glyphicon glyphicon-trash'></span> " + "</button>" + "</td>";
                text += "<tr/>"
            }
            text += "</table>"
            document.getElementById("tbody").innerHTML = text;
        }
    };
    xhr.send(jsonPayload);
}

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
}

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
}

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
}

function registerIsValid(firstName, lastName, userName, password) {

    var validity = true;

    if (firstName == "") {
        document.getElementById("registerResult").innerHTML = "Invalid First Name";
        validity = false;
    }

    if (lastName == "") {
        document.getElementById("registerResult").innerHTML = "Invalid Last Name";
        validity = false;
    }
    
    var regex = /(?=.*[a-zA-Z])([a-zA-Z0-9]).{6,20}$/;
    if (regex.test(userName) == false) {
        document.getElementById("registerResult").innerHTML = "Invalid User Name";
        validity = false;
    }

    var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{6,22}/;
    if (regex.test(password) == false) {
        document.getElementById("registerResult").innerHTML = "Invalid Password";
        validity = false;
    }

    return validity;
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
