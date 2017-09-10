angular.module('fetchService',[])
.factory('GetJsonDataFact', function($http,$q){
	var factObj = {};

	factObj.getData= function() {
		var deferred = $q.defer();
		$http({
			method:'GET',
			url:'json/data.json'
		}).then(function success(resp) {
			deferred.resolve(resp);
		}, function error(message) {
			console.log(message);
			deferred.reject(message);
		});
		return deferred.promise;
	};
	factObj.getOperators= function() {
		var deferred = $q.defer();
		$http({
			method:'GET',
			url:'json/flightData.json'
		}).then(function success(resp) {
			deferred.resolve(resp);
		}, function error(message) {
			console.log(message);
			deferred.reject(message);
		});
		return deferred.promise;
	};	
	factObj.getFlightData= function(searchFilters) {
		var deferred = $q.defer();
		$http({
			method:'GET',
			url:'json/data.json',
			params: searchFilters
		}).then(function success(resp) {
			deferred.resolve(resp);
		}, function error(message) {
			console.log(message);
			deferred.reject(message);
		});
		return deferred.promise;
	};	
	return factObj;
});