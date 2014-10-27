var app = angular.module('app',[
	'ngRoute',
	'controllers',
	'services',
	'ui.bootstrap'
]);

app.config(['$routeProvider', function($routeProvider) {
$routeProvider
	.when('/', {
		redirectTo: '/home'
	})
	.when('/home', { // we can enable ngAnimate and implement the fix here, but it's a bit laggy
		templateUrl: function($routeParams) {
			return 'views/landing.html';
		},
		controller: "PageController"
	})
	.when('/quiz/:child',{
		templateUrl: function($routeParams) {
			console.log("quizin");
			return 'views/quiz.html';
		},
		controller: "PageController",
		reloadOnSearch: false

	})
	.otherwise({
       	redirectTo: function() {
       		//need to use $location probably
       		window.location = "404.html";
       	}
    });
	// $locationProvider.html5Mode(false);
}]);

app.run(['$rootScope', function($rootScope) {
	
}])
