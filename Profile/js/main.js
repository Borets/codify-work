document.getElementById('SubmitButton').addEventListener("click", FormSubmit)

var error_list = document.getElementById("error_list")


//Function responsible for submitting my form
function FormSubmit () {
	ClearErrorList()
//Check if any of the fields are missing infomration 
	if (CheckFirstName() && CheckLastName() && CheckGender() && CheckEmail() && CheckPhone() && CheckBio() && CheckSecret()) {
		console.log ("Success")
	} else { console.log ("Errors")
			error_list.style.visibility = "visible" }
	}

function CheckFirstName (){
	var first_name = document.getElementById("first_name").value
	if (first_name == "") {
		ErrorMessage("First name can't be blank")
		return false 
	} else {
		return true
	}
}

function CheckLastName (){
	var last_name = document.getElementById("last_name").value
	if (last_name == "") {
		ErrorMessage("Last name can't be blank")
		return false 
	} else {
		return true
	}
}

function CheckGender (){
	var gender = document.getElementsByName("gender")
	for (var i = 0; i < gender.length; i++){
		if (gender[i].checked) {
			return true
		} else { 
			ErrorMessage("Please select your gender")
			return false }
	}
}

function CheckEmail () {

	var email = document.getElementById("email_address").value
	if (email == "") {
		ErrorMessage("Email can't be blank")
		return false 
	} else {
		//Check if its complient with a regular expression
		var regex = /^[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,5}$/
		if (regex.test(email)) {
			return true

		} else { 
			ErrorMessage("Please enter a valid email")	
			return false 
				
		}
	}
}

function CheckPhone (){
	var phone = document.getElementById("phone_number").value
	if (phone == "") {
		ErrorMessage("Please provide a valid phone number")
		return false 

	} else {
		return true
	}

}

function CheckBio (){
	var bio = document.getElementById("bio").value
	if (bio == "") {
		ErrorMessage("Bio cannot be left blank")
		return false 
	} else {
		return true
	}
}


function CheckSecret (){
	var secret = document.getElementById("SecretAnswer").value
	if (secret == "") {
		ErrorMessage("Please provide an answer to the secret question")
		return false 
	} else {
		return true
	}

}
//append new errors to the lits
function ErrorMessage(message){
	var error_entry = document.createElement("li")
	error_entry.appendChild(document.createTextNode(message))
	error_list.appendChild(error_entry)
}
//Create messages every time the button is submitted 

function ClearErrorList(){
	error_list.innerHTML="";

}