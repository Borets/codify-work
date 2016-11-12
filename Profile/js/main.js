document.getElementById('SubmitButton').addEventListener("click", FormSubmit)


var error_list = document.getElementById("error_message")
var close = document.getElementsByClassName("close")[0];
var modal = document.getElementById('profile_modal');

var gender_value = ""
var first_name = ""
var last_name = ""
var email = ""
var phone = ""
var bio = ""
var question = ""
var secret = ""



//Function responsible for submitting my form
function FormSubmit () {
	ClearErrorList()
//Check if any of the fields are missing infomration 
	if (CheckFirstName() && CheckLastName() && CheckGender() && CheckEmail() && CheckPhone() && CheckQuestion() && CheckBio() && CheckSecret()) {
		console.log ("Success")
		DisplayProfile()
	} else { console.log ("Errors")
			error_list.style.display = "inline" }
	}

function CheckFirstName (){
	first_name = document.getElementById("first_name").value
	if (first_name == "") {
		ErrorMessage("First name can't be left blank")
		return false 
	} else {
		return true
	}
}

function CheckLastName (){
	last_name = document.getElementById("last_name").value
	if (last_name == "") {
		ErrorMessage("Last name can't be left blank")
		return false 
	} else {
		return true
	}
}

function CheckGender (){
	gender = document.getElementsByName("gender")
	for (var i = 0; i < gender.length; i++){
		if (gender[i].checked) {
			gender_value = gender[i].value
			return true
		} else { 
			ErrorMessage("Please select your gender")
			return false }
	}
}

function CheckEmail () {

	email = document.getElementById("email_address").value
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
	phone = document.getElementById("phone_number").value
	if (phone == "") {
		ErrorMessage("Please provide a valid phone number")
		return false 

	} else {
		return true
	}

}

function CheckBio (){
	bio = document.getElementById("bio").value
	if (bio == "") {
		ErrorMessage("Bio cannot be left blank")
		return false 
	} else {
		return true
	}
}

function CheckQuestion (){
	
	var question_object = document.getElementById("SecretQuestion")
	question = question_object.options[question_object.selectedIndex].text
	console.log(question)
	if (question == "-- Select a question --") {
		ErrorMessage("Select a secret Question")
		return false 
	} else {
		return true
	}
}

function CheckSecret (){
	secret = document.getElementById("SecretAnswer").value
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


//Work in progress below, trying to append text from the form to profile

function DisplayProfile(){

	var WelcomeMsg = document.getElementById("profile_welcome")
	var GenderMsg = document.getElementById("profile_gender")
	var EmailMsg = document.getElementById("profile_email")
	var PhoneMsg = document.getElementById("profile_phone")
	var BioMsg = document.getElementById("profile_bio")
	var QuestionMsg = document.getElementById("profile_question")
	var AnswerMsg = document.getElementById("profile_answer")

	
	WelcomeMsg.innerHTML = first_name + " " + last_name
//Need to figure out how to obtain gender value from the group of radio boxes
	GenderMsg.innerHTML = gender_value
	EmailMsg.innerHTML =  email
	PhoneMsg.innerHTML = phone
	BioMsg.innerHTML =  bio
	QuestionMsg.innerHTML = question
	AnswerMsg.innerHTML = secret

	document.getElementById("profile_modal").style.display = "block"


}

//Closing the modal
close.onclick = function() {
    modal.style.display = "none";
}
//Clicking outside of the modal closes it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


