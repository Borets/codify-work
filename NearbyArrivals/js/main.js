google.maps.event.addDomListener(window, 'load', initialize)
var api_key = "5a600371-9f1f-4817-a187-7e056376e8b3"


function initialize(){
	var mapProp = {
		center: new google.maps.LatLng(37.773972, -122.431297),
		zoom: 12,
		disableDefaultUI: true,
		mapTypeId: 'terrain'
	}	
	GetStops(); 
	var map = new google.maps.Map(document.getElementById("MainMap"), mapProp)
	var marker = new google.maps.Marker({position:mapProp.center})
	
	marker.setMap(map)
	
	google.maps.event.addListener(marker, 'click', function (){
		map.setZoom(14)
		map.setCenter(marker.getPosition())
	})

}


function GetStops() {

	// $.getJSON(" http://api.511.org/transit/stopPlaces?api_key=5a600371-9f1f-4817-a187-7e056376e8b3&operator_id=SFMTA", function(json) {
 //    	console.log(json); // this will show the info it in firebug console
		
	// });

	$.ajax({
	url: 'https://api.511.org/transit/stopPlaces?api_key=5a600371-9f1f-4817-a187-7e056376e8b3&operator_id=SFMTA',
	dataType: "jsonp",
	type: 'GET',

	success: function(data){
		console.log(data);
	}

	});

}



