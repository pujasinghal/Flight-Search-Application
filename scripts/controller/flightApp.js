var app= angular.module('flightModule',['rzModule','fetchService','ngAutoComplete','ngSearchResults']);

app.controller('FlightCtrl',['$scope','GetJsonDataFact','$filter',function ($scope,GetJsonDataFact,$filter) {
	var newArr = [];
	$scope.cities = null;
	$scope.returnShow = true;
	$scope.min = 0;
	$scope.max = 10000;
	$scope.oneWayData = [];
	$scope.allFilter1 = [];
	$scope.allFilter2 = [];
	$scope.twoWayData = [];
	$scope.showResults = false;

	GetJsonDataFact.getData().then(function(resp) {
		$scope.allAirports = resp.data.airports;
		$scope.allCities = resp.data.cities;
		$scope.allOperators = resp.data.operators; 
		angular.forEach($scope.allAirports,function(key,value){
			newArr.push(key.label.toUpperCase());
		});		
		}, function(resp) {
			console.log(resp);
	});
	
	$scope.autoComplete = function(fromCity,toCity) {
		if(fromCity) {
		    $scope.cities = newArr.filter(function(e) {
		    	if($scope.searchFromCity !== undefined ) return (e.indexOf($scope.searchFromCity.toUpperCase()) !== -1 && e !== $scope.searchToCity);
		    });			
		}
		else {
		    $scope.cities = newArr.filter(function(e) {
		    	if($scope.searchToCity !== undefined ) return (e.indexOf($scope.searchToCity.toUpperCase()) !== -1 && e !== $scope.searchFromCity);
		    });				
		}
  	};

	$scope.slider = {
	  min: 0,
	  max: 10000,
	  options: {
	    floor: 0,
	    ceil: 10000,
	    step: 1000,
    	showTicks: true,
        onEnd: function() {
            console.log('Apply filters');
            $scope.applyPriceFilter();
        }    	
	  }
	};
	
	$scope.mindate = new Date();
	
	$scope.returnDate = function(input) {
		$scope.returnShow = input;
	};

	$scope.searchFlight = function() {		
		$scope.convertDate = function(input) {
			return $filter('date')(input,"MM-dd-yyyy");
		};

		$scope.formatDate = function(input) {
			var newDate = new Date(input);
			return $filter('date')(newDate,'shortTime');
		};

		$scope.selFromAirport = $filter('filter')($scope.allAirports,{'label': $scope.searchFromCity});
		$scope.selToAirport = $filter('filter')($scope.allAirports,{'label': $scope.searchToCity});

		$scope.selFromCity = $filter('filter')($scope.allCities,{'airportId': $scope.selFromAirport[0].airportId});
		$scope.selToCity = $filter('filter')($scope.allCities,{'airportId': $scope.selToAirport[0].airportId});

		GetJsonDataFact.getFlightData()
		.then(function(resp) {
			$scope.flights = resp.data;
			$scope.filterData();
			$scope.showResults = true;
		}, function(resp) {
			$scope.showResults = false;
			console.log(resp);
		});

		$scope.filterData = function() {
			$scope.allFilter1 = $scope.flights.filter(function(obj) {
				if(obj.depCityId == $scope.selFromCity[0].cityId  
					&& obj.arrCityId == $scope.selToCity[0].cityId 
					&& obj.depDateTime.indexOf($scope.convertDate($scope.depDate.value)) > -1) {

					obj.depCityId = $scope.selFromAirport[0].value
					obj.arrCityId = $scope.selToAirport[0].value;
					obj.depDateTime = $scope.formatDate(obj.depDateTime);					
					obj.arrDateTime = $scope.formatDate(obj.arrDateTime);
					return obj;
				}
			});
			if(!$scope.returnShow) {
				$scope.allFilter2 = $scope.flights.filter(function(obj) {
					if(obj.depCityId == $scope.selToCity[0].cityId 
						&& obj.arrCityId == $scope.selFromCity[0].cityId 
						&& obj.depDateTime.indexOf($scope.convertDate($scope.arrDate.value)) > -1) {

						obj.depCityId = $scope.selToAirport[0].value
						obj.arrCityId = $scope.selFromAirport[0].value;
						obj.depDateTime = $scope.formatDate(obj.depDateTime);	
						obj.arrDateTime = $scope.formatDate(obj.arrDateTime);
						return obj;
					}
				});		
			}
			$scope.oneWayData = $scope.allFilter1;
			$scope.twoWayData = $scope.allFilter2;
			$scope.applyPriceFilter();
		}
	};

	$scope.applyPriceFilter = function() {
		if($scope.allFilter1.length !== 0 ) {
			$scope.oneWayData = $scope.allFilter1.filter(function(obj) {
				if(obj.price >= $scope.slider.min && obj.price <= $scope.slider.max) {
					return obj;
				}
			});			
		}
		if(!$scope.returnShow && $scope.allFilter2.length !== 0) {
			$scope.twoWayData = $scope.allFilter2.filter(function(obj) {
				if(obj.price >= $scope.slider.min && obj.price <= $scope.slider.max) {
					return obj;
				}
			});
		}
		if(($scope.oneWayData.length === 0 && $scope.returnShow) 
			|| ($scope.oneWayData.length === 0 && $scope.twoWayData.length === 0)) {
			$scope.noData = true;
		} else {
			$scope.noData = false;
		}
	};	

}]);