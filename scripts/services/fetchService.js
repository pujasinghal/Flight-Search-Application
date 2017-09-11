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
	factObj.getFlightData= function() {
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
	return factObj;
});