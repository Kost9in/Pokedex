'use strict';

var pokemonApp = angular.module('pokemonApp', []);

pokemonApp.controller('mainController', function ($http, $scope) {

	$scope.domain = 'http://pokeapi.co';
	$scope.loaded = $scope.load_info = 0;
	$scope.next = '/api/v1/pokemon/?limit=12';
	$scope.filters = [];
	$scope.pokemons = [];
	$scope.active_filters = [];
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
					var pokemon = response.data.objects[i];
					pokemon.image = getImageId(pokemon.national_id);
					$scope.pokemons.push(pokemon);
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
		if($scope.active_filters.indexOf(type)==-1) $scope.active_filters.push(type);
		else $scope.active_filters.splice($scope.active_filters.indexOf(type), 1);
		open_info(0);
	}

	$scope.open = function(id) {
		if(!$scope.load_info) {
			open_info(1);
			$scope.load_info = 1;
			'http://pokeapi.co{{id}}'
			$http.get($scope.domain + '/api/v1/pokemon/' + id + '/').then(function(response) {
				$scope.info = response.data;
				$scope.info.image = getImageId(response.data.national_id);
				$scope.load_info = 0;
		    }, function(response) {
		    	alert('Произошла ошибка при загрузке покемонов.');
		    });
		}
	}

	$scope.close = function() {
		if(!$scope.load_info) open_info(0);
	}

	$scope.load_filters();

	function getImageId(pokemonId) {
		return (pokemonId < 10) ? '00' + pokemonId :
					(pokemonId < 100) ? '0' + pokemonId : pokemonId;
	}

});

pokemonApp.filter('type', function() {
    return function (items, types) {
    	var result = [];
        if(types.length) {
	        for(var i in items) {
	        	var found = 0;
	        	for(var j in items[i].types) {
	        		var name = items[i].types[j].name;
	        		name = name.substr(0, 1).toUpperCase() + name.substr(1);
	        		if(types.indexOf(name)>-1) found++;
	        	}
	        	if(types.length==found) result.push(items[i]);
	        }
        } else result = items;
        return result;
    }
});