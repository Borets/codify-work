google.maps.event.addDomListener(window, 'load', initialize)
var api_key = "5a600371-9f1f-4817-a187-7e056376e8b3"
var api_key2 = "15493565-011a-420c-a45a-c5222df2efed"
var proximity = 0.05

var StopArray = []
var userlat
var userlng
var map 
var StopArrayNear = []
var NearestBusesDeparture = []
var ExpectedNearbyArrivals = []
// var ExpectedNearbyArrivals = [{
// 	lines: {
// 		"00" : {
// 			"inbound": [1,2,3,4,5],
// 			"outbound": [6,7,8,9,10]
// 		},

// 	}

// }]


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



//Pull Expected Arrival Times for each of the stops nearby and add the to the main Object

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
	        GetBusStops(map,userlat,userlng)

	      }, function() {
	        handleLocationError(true, infoWindow, map.getCenter());
	      });
	    } else {
	      // Browser doesn't support Geolocation
	      handleLocationError(false, infoWindow, map.getCenter());
	    }
}


//Extracts location points from a json file and creates an array with values and distances
function GetBusStops(map,userlat,userlng) {


	$.ajax({
	url: 'https://borets.github.io/codify-work/NearbyArrivals/data/stops.json',
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
				distance: CalculateDistance(lat, lng, userlat, userlng),
				ExpectedBusses: ''

			})

		}
		//once the Array is complete we will sort it by distance (closest first)
		SortArrayByDistance()
		//Displays nearest stops   
		DisplayNearestStops(proximity)

		
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

//Function determines which bus stops nearby are close enough to the user and displays them
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
			var distance = StopArray[i].distance

			//In the future you would pass more variables
			AddMarker(position)


			//Pulls Expected Arrival Times for each of the stops nearby
			GetBusesForEachStop(StopID, i)

		}
	}

	
}
//Function gets arrival times for each of the specified stops
function GetBusesForEachStop(StopID,ID) {

	$.ajax({
	url: 'https://api.511.org/transit/StopMonitoring?api_key=5a600371-9f1f-4817-a187-7e056376e8b3&agency=sf-muni&stopCode='+StopID,
	type: 'GET',
	async: false,
	dataType: "jsonp",

	success: function(data){
		var main = data.ServiceDelivery.StopMonitoringDelivery.MonitoredStopVisit
		var length_main = main.length

		var TempBusArray = []
		for (i=0; i < length_main; i++){ 
			
			var TempBusArray2 = []

			var BusNumber = main[i].MonitoredVehicleJourney.LineRef
			var DepartureTime = main[i].MonitoredVehicleJourney.MonitoredCall.AimedDepartureTime
			var Direction = main[i].MonitoredVehicleJourney.DirectionRef

			TempBusArray.push({BusNumber: BusNumber, DepartureTime: DepartureTime, Direction: Direction})
			TempBusArray2.push({BusNumber: BusNumber, DepartureTime: DepartureTime, Direction: Direction})
			SaveToBusListArray(TempBusArray2,ID)

		}
		
		StopArray[ID].ExpectedBusses = TempBusArray
		DisplayTimes()

		console.log(StopArray[ID])

		},
		

	error: function(error){
		console.log("Error Reading the list of lines for the stop");
	}

	});


}
//Organizes Bus Arrivals based on the bus number

function SaveToBusListArray (TempBusArray,ID) { 
	var BNumber = TempBusArray[0].BusNumber
	var DepartureTime = TempBusArray[0].DepartureTime
	var Direction = TempBusArray[0].Direction
	var idLocator = ContainsBus(ExpectedNearbyArrivals, BNumber, Direction)

	if ( idLocator > -1) {

		ExpectedNearbyArrivals[idLocator].Departures.push(DepartureTime)

	} else {
		ExpectedNearbyArrivals.push({BusNumber: BNumber, Direction: Direction, Departures: [DepartureTime] })
	}
}


//Checks if the bus is included in the array
function ContainsBus(array, bus, direction) {
	for (var i = 0; i < array.length; i++) {
		if (array.length == 0) {
			return -1
		} else {
			if (array[i].BusNumber == bus && array[i].Direction == direction) {
        		return i
   			} 
		}

	} return -1

}


function DisplayTimes() {

	var BusQuantity = ExpectedNearbyArrivals.length 
	var SidePanel = document.getElementById('StopList')
	console
	for (var i = 0; i < BusQuantity; i++){ 
		
		var div = document.createElement('div')
		div.className = 'BusType'

		var Bus = ExpectedNearbyArrivals[i].BusNumber
		var Dir = ExpectedNearbyArrivals[i].Direction
		var Departures = ExpectedNearbyArrivals[i].Departures

		div.innerHTML = "<H2>"+Bus+"</H2> <H4>"+Dir+"</H4"
		SidePanel.appendChild(div);

		for (var x = 0; x < Departures.length; x++){
			
			var div2 = document.createElement('div')
			div2.innerHTML = Convert_to_minutes(ExpectedNearbyArrivals[i].Departures[x])
			div2.className = 'BusTime'
			SidePanel.appendChild(div2)
		}

	}

}

function Convert_to_minutes(time) {
var Busdate = new Date(time);
var UserDate = new Date();
var diffMs = (Busdate - UserDate)
var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
return diffMins

}










// THIS SHIT HERE NEEDS TO BE DEBUGGED !!!! 
// function DisplayArrivals(prx) {

// 	for (var i = 0; i < StopArray.length; i++) {

// 		console.log("THE I IS = "+i )
		
// 		if (StopArray[i].distance < prx) {

// 			console.log ("ExpectedBusses Object " + StopArray[i].ExpectedBusses)

// 			for (var y = 0; y < StopArray[i].ExpectedBusses.length; y++){
				
// 				console.log ("ExpectedBusses length " + StopArray[i].ExpectedBusses.length)				
// 				console.log(StopArray[i].ExpectedBusses[y])

// 				var BusArrivalObject = StopArray[i].ExpectedBusses[y]
// 				var BusNumber = BusArrivalObject.BusNumber

// 				console.log (BusArrivalObject)
// 				console.log (BusNumber)

// 					if (ContainsLine(ExpectedNearbyArrivals,BusNumber) == true ) {

// 						if (BusNumber.Direction == 'Inboud'){
// 								ExpectedNearbyArrivals.line[BusNumber].Inboud.push(BusArrivalObject.DepartureTime)
// 							}

// 						if (BusNumber.Direction == 'Outbound'){
// 								ExpectedNearbyArrivals.line[BusNumber].Outbound.push(BusArrivalObject.DepartureTime)
// 							}

// 					} else {

// 						ExpectedNearbyArrivals.push({
// 							lines: {
// 								BusNumber : {
// 									Direction: [BusArrivalObject.DepartureTime]
									
// 								}

// 							}							

// 						})


// 					}

// 				}

// 			} 

// 		}

	
// }



