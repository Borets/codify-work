
var usa_time = document.getElementById("main-clock");
var moscow_time = document.getElementById("time-Moscow");
var berlin_time = document.getElementById("time-Berlin");
var tokyo_time = document.getElementById("time-Tokyo");


function UpdateClock () {
	var today = new Date()
	var hours = today.getHours()
	var minutes = today.getMinutes()
	var seconds = today.getSeconds()

	if (hours > 12) {hours = hours - 12 }
	if (hours == 0) {hours = 12}
	if (minutes < 10) {minutes = "0" + minutes;}
	if (seconds < 10) {seconds = "0" + seconds;}

	var TimeScring = hours + ":" + minutes + ":" + seconds; 	
	usa_time.innerHTML = TimeScring;
	moscow_time.innerHTML = TimeScring;
	berlin_time.innerHTML = TimeScring;
	tokyo_time.innerHTML = TimeScring;
}


function Start(){
	UpdateClock()
	setInterval(UpdateClock,1000);
}