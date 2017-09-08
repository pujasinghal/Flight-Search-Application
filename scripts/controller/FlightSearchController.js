app=angular.module('flightModule',[''])

app.controller('FlightCtrl',['$scope',function ($scope) {
	// body...
	$scope.priceSlider = 150;

	$scope.slider = {
	  min: 100,
	  max: 180,
	  options: {
	    floor: 0,
	    ceil: 10000,
	    step: 1000
	  }
	};	

}]);