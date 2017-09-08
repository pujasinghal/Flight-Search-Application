var app= angular.module('flightModule',['rzModule']);

app.controller('FlightCtrl',['$scope',function ($scope) {
	// body...

	$scope.slider = {
	  min: 0,
	  max: 10000,
	  options: {
	    floor: 0,
	    ceil: 10000,
	    step: 1000,
    	showTicks: true
	  }
	};	

}]);