angular.module('controllers',[])
.controller('PageController',['$scope','$routeParams', function($scope, $routeParams){
	$scope.source=""
}])
.controller('LandingController', ['$scope','$location', 'GetArtists', function($scope, $location, GetArtists){
	this.Test = "WHAT";
	if($scope.Artists==undefined)
	{
		var ArtistsService = new GetArtists();
		ArtistsService.AllArtistsPromise.then(function(data){
			$scope.Artists = data.data.result;
		});
	}
	
	this.selectArtist = function(artist)
	{
		location.href = '#/quiz/'+this.Artist;
	}


}])
.controller('QuizController', ['$timeout', '$scope','$routeParams','GetArtistInfo', 'Quiz', function($timeout, $scope, $routeParams, GetArtistInfo, Quiz){
	// console.log("run");
	this.input = [];
	this.current = 0;
	this.wrong = 0;
	this.right = 0;

	this.record;

	this.url = "#/quiz/"+encodeURIComponent($routeParams.child);

	this.Artist = decodeURIComponent($routeParams.child);
	var self = this;
	var ArtistInfoService = new GetArtistInfo({
								artist:this.Artist
							});
	ArtistInfoService.ArtistInfoPromise.then(angular.bind(this, function(data){
		// console.log(data);
		$scope.Genre = data.data.result[0].genre[0];
		$scope.Quiz = new Quiz({
					data:data.data.result[0].album
				  });
		console.log($scope.Quiz.Questions);
		

	}));
	

	this.choose = function()
	{
		if(this.record==undefined)
		{
			this.record = [];
		}
		var currentInput = this.input[this.current];
		if(currentInput==undefined)
		{
			return false;
		}
		var currentAnswer = $scope.Quiz.Questions[this.current].correct;
		if(currentInput==currentAnswer)
		{
			this.record.push("yes");
			this.right++;
		}
		else
		{
			this.record.push("no");
			this.wrong++;
		}
		this.current++;
	}

	this.getClass = function(index)
	{

		if(this.record[index]=="yes")
		{
			return "text-success";
		}
		else
		{
			return "text-danger";
		}
	}

	this.reload = function()
	{
		location.reload();
	}
}])
;

