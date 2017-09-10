angular.module('ngAutoComplete',[])
.directive('autoComplete', function(){
	return {
		restrict: 'A',
		link: function(scope,elem,attr) {
	        scope.$watch(
	        	function(){
	        		return scope.cities;
	        }, function() {
				elem.autocomplete({
					source:scope.cities
				});
	        });
      	}
	};
});