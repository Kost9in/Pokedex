'use strict';

var pokemonApp = angular.module('pokemonApp', []);

pokemonApp.controller('mainController', function ($http, $scope) {

	$scope.domain = 'https://pokeapi.co';
	$scope.loaded = $scope.load_info = $scope.active = 0;
	$scope.next = '/api/v1/pokemon/?limit=12';
	$scope.filters = [];
	$scope.enabled_filters = [];
	$scope.active_filters = [];
	$scope.pokemons = [];
	$scope.info = {};

	$scope.load_filters = function() {
		$http.get($scope.domain + '/api/v1/type/?limit=999').then(function(response) {
			$scope.filters = response.data.objects;
			$scope.load_pokemons();
	    }, function(response) {
	    	alert('Произошла ошибка при загрузке фильтров.');
	    });
	}

	$scope.load_pokemons = function() {
		if($scope.next) {
			$http.get($scope.domain + $scope.next).then(function(response) {
				$scope.next = response.data.meta.next;
				for(var i = 0; i < response.data.objects.length; i++) {
					$scope.pokemons.push(response.data.objects[i]);
					if(response.data.objects[i].types.length) {
						for(var j = 0; j < response.data.objects[i].types.length; j++) {
							let name = response.data.objects[i].types[j].name;
							name = name.substr(0, 1).toUpperCase() + name.substr(1);
							if($scope.enabled_filters.indexOf(name)==-1) $scope.enabled_filters.push(name);
						}
					}
				}
				$scope.loaded = 1;
				loader(0);
		    }, function(response) {
		    	alert('Произошла ошибка при загрузке покемонов.');
		    });
		}
	}

	$scope.more = function() {
		loader(1);
		$scope.load_pokemons();
	}

	$scope.choose_filter = function(type) {
		if($scope.enabled_filters.indexOf(type)>-1) {
			if($scope.active_filters.indexOf(type)==-1) $scope.active_filters.push(type);
			else $scope.active_filters.splice($scope.active_filters.indexOf(type), 1);
			open_info(0);
			$scope.active = 0;
		}
	}

	$scope.open = function(id) {
		if(!$scope.load_info) {
			open_info(1);
			$scope.load_info = 1;
			$scope.active = id;
			$http.get($scope.domain + '/api/v1/pokemon/' + id + '/').then(function(response) {
				$scope.info = response.data;
				$scope.load_info = 0;
		    }, function(response) {
		    	alert('Произошла ошибка при загрузке покемонов.');
		    });
		}
	}

	$scope.close = function() {
		if(!$scope.load_info) {
			open_info(0);
			$scope.active = 0;
		}
	}

	$scope.load_filters();

});

pokemonApp.filter('type', function() {
    return function (items, types) {
    	var result = [];
        if(types.length) {
	        for(var i in items) {
	        	for(var j in items[i].types) {
	        		let name = items[i].types[j].name;
		        	name = name.substr(0, 1).toUpperCase() + name.substr(1);
		        	if(types.indexOf(name)>-1) {
		        		result.push(items[i]);
		        		break;
		        	}
	        	}
	        }
        } else result = items;
        return result;
    }
});
