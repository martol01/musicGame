var bicycleApp=angular.module('bicycleApp');

bicycleApp.service('sharedProperties', function() {
    var fromValue = 'Euston';
    var toValue = 'Holborn';
    
    return {
        getFrom: function() {
            return fromValue;
        },
        setFrom: function(value) {
            fromValue = value;
        },
        getTo: function() {
            return toValue;
        },
        setTo: function(value){
        	toValue = value;
        }
    }
});

bicycleApp.controller('HomeController', function($scope, $timeout, sharedProperties) {
    
    $scope.setEndpoints = function(fromValue, toValue){
      sharedProperties.setFrom(fromValue);
      sharedProperties.setTo(toValue);
    }
});

bicycleApp.controller('RouteController', function($scope, sharedProperties) {
    $scope.fromValue = sharedProperties.getFrom();
    $scope.toValue = sharedProperties.getTo();
    console.log("ROUTE: "+$scope.fromValue +", "+$scope.toValue);

});

bicycleApp.controller('CycleController', function($scope, sharedProperties){
	
var myLatlng = new google.maps.LatLng(51.5248517, -0.1303936);
  var mapOptions = {
    zoom: 14,
    center: myLatlng
  };

  $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  $scope.bikeLayer = new google.maps.BicyclingLayer();
  $scope.bikeLayer.setMap($scope.map);
   
function initialize() {
  
	  var originText =(document.getElementById('originText')); //refer to the origin textbox
	  var destinationText = (document.getElementById('destText')); //refer to the destination textbox
  
	  var defaultBounds = new google.maps.LatLngBounds(
		  new google.maps.LatLng(51.261915, -0.563049),
		  new google.maps.LatLng(51.679368, 0.288391)
		  );
  

  	  if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
		  var geolocation = new google.maps.LatLng(
			  position.coords.latitude, position.coords.longitude);
		  var defaultBounds = new google.maps.LatLngBounds(geolocation,
			  geolocation);
    	});
 	 }

	  var options =  {
		bounds: defaultBounds,
		componentRestrictions: {country: "uk"} 
		};

     var autocompleteOrigin = new google.maps.places.Autocomplete(originText,options);
	 var placeOrigin = "";
	  google.maps.event.addListener(autocompleteOrigin, 'place_changed', function() {
		placeOrigin = autocompleteOrigin.getPlace();
		$scope.origin = new google.maps.LatLng(placeOrigin.geometry.location.lat(),
		 placeOrigin.geometry.location.lng());
	  });
	  var autocompleteDestination = new google.maps.places.Autocomplete(destinationText,options);
	  var placeDestination = "";
	  google.maps.event.addListener(autocompleteDestination, 'place_changed', function() {
		placeDestination = autocompleteDestination.getPlace();
	    $scope.destination = new google.maps.LatLng(placeDestination.geometry.location.lat(),
	     placeDestination.geometry.location.lng());	
	  });
	} 

   initialize();

  $scope.calculateDistances=function(origin, destination){
  	var service = new google.maps.DistanceMatrixService();
     //DistanceMatrix gives data for each pair (origin:destination) 
	service.getDistanceMatrix(
  {
    origins: [origin],
    destinations: [destination],
    travelMode: google.maps.TravelMode.BICYCLING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
  }, callback);

	function callback(response, status) {
  if (status == google.maps.DistanceMatrixStatus.OK) {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;

    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        var element = results[j];
        var distance = element.distance.text;
        var duration = element.duration.text;
        var from = origins[i];
        var to = destinations[j];
        console.log("Distance from "+from +" to "+to+"is: " +distance);
        console.log("Duration for the journey from "+from +" to "+to+" is: " +duration);
      }
    }
  }
}


  }






});


bicycleApp.controller('MainController', function($scope, $http){
  $scope.from="TET";
});
