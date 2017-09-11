angular.module('ngSearchResults',[])
.directive('searchResults',function(){
	return {
		restrict: 'A',
		templateUrl: 'scripts/views/SearchResults.html'
	};
});