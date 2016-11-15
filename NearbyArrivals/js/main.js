google.maps.event.addDomListener(window, 'load', initialize)
var api_key = "5a600371-9f1f-4817-a187-7e056376e8b3"
var StopArray = []
var userlat
var userlng
var map 

function initialize(){
	
	var mapProp = {
	center: new google.maps.LatLng(37.773972, -122.431297),
	zoom: 13,
	disableDefaultUI: true,
	mapTypeId: 'terrain'
	}	

	map = new google.maps.Map(document.getElementById("MainMap"), mapProp)
	
	GetUserLocation(map)
	// google.maps.event.addListener(marker, 'click', function (){
	// 	map.setZoom(14)
	// 	map.setCenter(marker.getPosition())
	// })

}

//Obtains User Location and calls to get stops 
function GetUserLocation(map) {

	var infoWindow = new google.maps.InfoWindow({map: map});

	if (navigator.geolocation) {
	      navigator.geolocation.getCurrentPosition(function(position) {

	      	var userlat = position.coords.latitude
	      	var userlng = position.coords.longitude

	        var pos = {
	          lat: userlat,
	          lng: userlng
	        };

	        infoWindow.setPosition(pos);
	        infoWindow.setContent('Location found.');
	        
	        map.setCenter(pos);
	        map.setZoom(16);
	        //Getting User Stops 
	        GetStops(map,userlat,userlng)

	      }, function() {
	        handleLocationError(true, infoWindow, map.getCenter());
	      });
	    } else {
	      // Browser doesn't support Geolocation
	      handleLocationError(false, infoWindow, map.getCenter());
	    }
}


//Extracts location points from a json file and creates an array with values and distances
function GetStops(map,userlat,userlng) {


	$.ajax({
	url: 'http://localhost:8000/data/stops.json',
	type: 'GET',
	crossOrigin: true,
	dataType: "json",

	success: function(data){
		var StopCount = data.Contents.dataObjects.ScheduledStopPoint.length
		var StopObject = data.Contents.dataObjects.ScheduledStopPoint
	
		for (i=0; i<data.Contents.dataObjects.ScheduledStopPoint.length; i++ ) {

			var lat = StopObject[i].Location.Latitude
			var lng = StopObject[i].Location.Longitude
			var name = StopObject[i].Name
			var id = StopObject[i].id 

			var StopLatLng = new google.maps.LatLng(lat, lng)
			//Adds marker to the map
			// AddMarker(map,StopLatLng)
			
			//Appends an object inside of the array
			StopArray.push({
				lat: lat,
				lng: lng, 
				StopName: name, 
				StopID: id,
				//Requests the distance between two points
				distance: CalculateDistance(lat, lng, userlat, userlng)
			})

		}
		//once the Array is complete we will sort it by distance (closest first)
		SortArrayByDistance()
		//display stops withing 0.5 miles 
		DisplayNearestStops(0.3)

		
	},
	error: function(error){
		console.log("Error Reading the list of Stops");
	}

	});
}





function handleLocationError(browserHasGeolocation, infoWindow, pos) {

    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
  }


function SortArrayByDistance() {
	StopArray.sort(function(a, b) {
    return a.distance - b.distance;
});


}


function AddMarker(position){

	var marker = new google.maps.Marker({
		position: position,
		map: map
	})

}




//Function that calculates distance between two location points on the map. Default unit is set to miles
function CalculateDistance(lat1, lon1, lat2, lon2, unit){

	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	//K = Kilometers
	if (unit=="K") { dist = dist * 1.609344 }
	// Nautical Miles
	if (unit=="N") { dist = dist * 0.8684 }
	return dist

}


function DisplayNearestStops(proximity) {

	console.log (proximity)
	console.log(StopArray.length)

	// proximity needs to be defined in miles since it was used to calculate the the distance
	for (var i = 0; i<StopArray.length; i++) {
		if (StopArray[i].distance < proximity) {
			var Name = StopArray[i].StopName
			var StopID = StopArray[i].StopID
			var lat = StopArray[i].lat
			var lng = StopArray[i].lng
			var position = new google.maps.LatLng(lat, lng)
			AddMarker(position)


		}
	}
}


