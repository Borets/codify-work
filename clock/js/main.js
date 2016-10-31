
var usa_time = document.getElementById("main-clock");
var moscow_time = document.getElementById("time-Moscow");
var berlin_time = document.getElementById("time-Berlin");
var tokyo_time = document.getElementById("time-Tokyo");


function UpdateClock () {

	usa_time.innerHTML = GetTime(5);
	moscow_time.innerHTML = GetTime(3);
	berlin_time.innerHTML = GetTime(1);
	tokyo_time.innerHTML = GetTime(9);
}


function Start(){
	UpdateClock()
	setInterval(UpdateClock,1000);
}

function GetTime (TimeZone) {
	var today = new Date()
	var hours = today.getUTCHours() + TimeZone; 
	var minutes = today.getUTCMinutes()
	var seconds = today.getUTCSeconds()

	if (hours > 12) {hours = hours - 12 }
	if (hours == 0) {hours = 12}
	if (minutes < 10) {minutes = "0" + minutes;}
	if (seconds < 10) {seconds = "0" + seconds;}

	var TimeScring = hours + ":" + minutes + ":" + seconds
	return TimeScring; 
}