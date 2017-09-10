var app= angular.module('flightModule',['rzModule','fetchService','ngAutoComplete','ngSearchResults']);

app.controller('FlightCtrl',['$scope','GetJsonDataFact','$filter',function ($scope,GetJsonDataFact,$filter) {
	var newArr = [];
	$scope.cities = null;
	$scope.returnShow = true;

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
	
	// $scope.getDate = function() {
	// 	console.log($filter('date')($scope.depDate.value,"dd-MM-yyyy"));
	// }
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
    	showTicks: true
	  }
	};
	
	$scope.returnDate = function(input) {
		$scope.returnShow = input;
	};

	$scope.searchFlight = function() {
		angular.forEach($scope.allAirports,function(key,value) {
			if(key.label.indexOf($scope.searchFromCity) > -1) {
				$scope.fromAirportId = key.airportId;	
				$scope.fromAirportValue = key.value;
			}
			if(key.label.indexOf($scope.searchToCity) > -1) {
				$scope.toAirportId = key.airportId;	
				$scope.toAirportValue = key.value;			
			}		
		});

		angular.forEach($scope.allCities,function(key,value) {
			if(key.airportId.indexOf($scope.fromAirportId) > -1) {
				$scope.fromCityId = key.cityId;
			}
			if(key.airportId.indexOf($scope.toAirportId) > -1) {
				$scope.toCityId = key.cityId;		
			}		
		});		
		$scope.convertDate = function(date) {
			return $filter('date')(date,"dd-MM-yyyy")
		}
		var searchFilter = null;
		/* OneWay Search*/
		if(returnShow) {
			searchFilter = {
				depCityId:$scope.fromCityId,
				arrCityId:$scope.toCityId,
				depDateTime:$scope.convertDate($scope.depDate.value)
			};
		} else {
			searchFilter = {
				depCityId: $scope.fromCityId || $scope.toCityId ,
				arrCityId :$scope.toCityId || $scope.fromCityId,
				depDateTime: $scope.convertDate($scope.depDate.value),
				arrDateTime: $scope.convertDate($scope.arrDate.value),
			};			

		}		
		GetJsonDataFact.getFlightData(searchFilter)
		.then(function(resp) {
			$scope.allFlights = resp.data[0];
			//var arr = $scope.allAirports;
			
			// angular.forEach(arr,function(key,value) {
			// 	newArr.push(key.label.toUpperCase());
			// });		
		}, function(resp) {
			console.log(resp);
		});						

	};
}]);