angular.module('services',[])
.factory('GetArtists', ['$rootScope', '$cacheFactory', '$timeout','$window', '$http', function($rootScope, $cacheFactory, $timeout, $window, $http){
	function GetArtistsService(options)
	{
		if(options==undefined)
		{
			this.SuggestArtists();
		}
		else if(options.query!==undefined)
		{
			return false;
		}
	}

	GetArtistsService.prototype.SuggestArtists = function(query)
	{
		//still need to account for artist not in 9001 results?
		var request = [
			{
				"type":"/music/artist",
				"name":null,
				"limit":9001
			}
		];
		var url = 'https://www.googleapis.com/freebase/v1/mqlread/?query='+encodeURIComponent(JSON.stringify(request));		
		this.AllArtistsPromise = $http.get(url);
	}

	


	return GetArtistsService;
}])

.factory('GetArtistInfo', ['$rootScope', '$cacheFactory', '$timeout','$window', '$http', function($rootScope, $cacheFactory, $timeout, $window, $http){

	function GetArtistInfoService(options)
	{
		if(options.artist==undefined)
		{
			return false;
		}

		this.Artist = options.artist;
		this.GetArtistInfo();
	}


	GetArtistInfoService.prototype.GetArtistInfo = function()
	{
		var request = [
			{
			  "type": "/music/artist",
			  "name": this.Artist,
			  "genre": [],
			  "album": [{
			    "name": null,
			    "releases": [{
			      "track": [{
			        "name": null,
			        "length": null
			      }]
			    }]
			  }]
			}
		];

		var url = 'https://www.googleapis.com/freebase/v1/mqlread/?query='+encodeURIComponent(JSON.stringify(request));
		this.ArtistInfoPromise = $http.get(url);

	}

	return GetArtistInfoService;

}])

.factory('Question', ['$rootScope', '$cacheFactory', '$timeout','$window', '$http', function($rootScope, $cacheFactory, $timeout, $window, $http){

		function QuestionService(options) 
		{
			this.types = {
				track: [
					"name",
					"num"
				],
				album: [
					"track_num",
					"length"
				]
			};

			if(options.data==undefined)
			{
				return false;
			}

			this.data = options.data;
			// this.MakeQuestion();


		}

		QuestionService.prototype.MakeQuestion = function()
		{
			var type = this.getRandomType();
			this.questStr = "";
			this.correct = "";
			var wrong = [];
			this.answers = [];
			var name = this.data.name;
			if(type.type=="album")
			{
				console.log("album");
				console.log(type.ask);
				console.log(this.data);
				
				var totalLength = this.data.length;
				var interval = this.data.length/8;

				if(type.ask=="length")
				{
					this.questStr = "How long is the album "+name+"?";
					this.correct = this.formatTime(totalLength);
					// console.log(correct);
					wrong.push(  this.formatTime(totalLength-interval) );
					var start = totalLength + interval;
					wrong.push(this.formatTime(start));
					for(var i = 0; i<2; i++)
					{
						var toPush = this.formatTime(start+=interval);
						// console.log(toPush);
						wrong.push(toPush);
					}

					this.answers = this.shuffleArray(wrong.concat(this.correct));
					// console.log(answers)
				}
				else if(type.ask =="track_num")
				{
					var usedTracks = [];
					var checks = [];
					var tracksNum = this.data.tracks.length;
					if(tracksNum<5)
					{
						return false;
					}
					this.questStr = "How many tracks does the album "+this.data.name+" have?";
					this.correct = tracksNum;
					checks.push(this.correct);
					// this.wrong = [tracksNum+1,tracksNum+2];
					// checks = this.wrong.concat(this.correct);
					
					for(var z=0; z<4; z++)
					{
						var test = false;
						while(!test)
						{
							var rand = this.getRandomTrackNumber();

							if(checks.indexOf(rand)===-1)
							{
								checks.push(rand);
								test = true;
							}
							else
							{
								continue;
							}
						}
					}
					this.answers = checks;
				}


			}
			else if(type.type=="track")
			{
				console.log("track");
				console.log(type.ask);
				var tracksNum = this.data.tracks.length;
				console.log(tracksNum);
				if(tracksNum<5)
				{
					return false;
				}

				var track = this.getRandomTrack();
				console.log(track);

				if(type.ask=="name")
				{
					// return false;
					this.questStr = "Which track is number "+track.position+" on the album "+name+" ?";
					this.correct = track.name;
					var checks = [this.correct];
					
					for(var i=0;i<4;i++)
					{
						var test = false;
						while(!test)
						{
							var res = this.getRandomTrack();
							// console.log(res);
							// if(res.position<4)
							// {
							// 	return false;
							// }

							if(checks.indexOf(res.name)===-1)
							{
								checks.push(res.name);
								test = true;
							}
							else
							{
								continue;
							}
						}
					}
					
					this.answers = checks;
				}

				if(type.ask=="num")
				{
					this.questStr = "Which track is "+track.name+" on the album "+name+" ?";
					this.correct = track.position;
					var checks = [this.correct];
					
					for(var i=0;i<4;i++)
					{
						var test = false;
						while(!test)
						{
							var res = this.getRandomTrack();
							console.log(res);
							// if(res.position<4)
							// {
							// 	return false;
							// }

							if(checks.indexOf(res.position)===-1)
							{
								checks.push(res.position);
								test = true;
							}
							else
							{
								continue;
							}
						}
					}
					
					for(var g in checks)
					{
						this.answers.push(checks[g]);
					}
				}
			}
		}

		QuestionService.prototype.getRandomType = function()
		{
			var i = 0;
			for(var z in this.types)
			{
				i++;
			}
			
			var randomTypeNum =  Math.floor((Math.random() * i)+0);

			var type = "";
			var x = 0;

			for(var d in this.types)
			{
				if(x==randomTypeNum)
				{
					type = d;
					types=this.types[d];
					break;
				}
				else
				{
					x++;
				}
			}

			var v = types.length
			var randomTypesNum = Math.floor((Math.random() * v)+0);

			return {
				type: type, 
				ask: types[randomTypesNum]
			};
			
		}

		QuestionService.prototype.getRandomTrackNumber = function()
		{
			return Math.floor((Math.random()*this.data.tracks.length)+1);
		}

		QuestionService.prototype.getRandomTrack = function() 
		{
			var num = this.data.tracks.length;
			var index = Math.floor(Math.random()*num);
			var theTrack = this.data.tracks[index];
			theTrack.position = index+1;
			return theTrack;
		}

		QuestionService.prototype.shuffleArray = function(array)
		{
			//stackoverflow:
			//http://stackoverflow.com/a/12646864/1091665
		    for (var i = array.length - 1; i > 0; i--) {
		        var j = Math.floor(Math.random() * (i + 1));
		        var temp = array[i];
		        array[i] = array[j];
		        array[j] = temp;
		    }
		    return array;
		}

		QuestionService.prototype.formatTime = function(time)
		{
				var minutes = Math.floor(parseInt( time / 60 ));
				var seconds = time % 60;
				var str = minutes +":"+Math.floor(seconds);
				
				return str;
				
		}

		return QuestionService;
}])

.factory('Quiz', ['Question', '$rootScope', '$cacheFactory', '$timeout','$window', '$http', function(Question, $rootScope, $cacheFactory, $timeout, $window, $http){

	function QuizService(options) 
	{
		if(options.number!==undefined)
		{
			this.number = options.number;
		}
		else
		{
			this.number=5;
		}
		this.albums = [];
		this.usedalbums = [];
		this.Questions;

		if(options.data==undefined)
		{
			return false;
		}

		this.data = options.data;
		this.parseData();
		this.MakeQuiz();
	}

	QuizService.prototype.parseData = function()
	{
		this.Questions = [];
		if(this.data==undefined)
		{
			return false;
		}

		for(var z in this.data)
		{
			var item = this.data[z];
			var album = {
				name: item.name,
				tracks : [],
				length:0
			}
			for(var d in item.releases[0].track)
			{
				var track = item.releases[0].track[d];
				album.length+=track.length;
				var minutes = Math.floor(track.length/60);
				var seconds = Math.round((track.length - minutes) * 60);
				var length = minutes +":"+seconds;
				album.tracks.push({
					name:track.name,
					length:length.substr(0,length.length-3)
				});
			}
			this.albums.push(album);
		}
		// console.log(this.albums);
	}

	QuizService.prototype.MakeQuiz = function()
	{
		for(var i = 0; i<this.number; i++)
		{
			var randomAlbum = this.getRandomAlbum();
			
			var QuestOb = new Question({
				data: randomAlbum
			});
			var test = false;
			var used = [];
			while(!test)
			{
				var check = QuestOb.MakeQuestion();
				console.log(QuestOb.questStr);
				if(check===false)
				{
					continue;
				}
				else if(used.indexOf(QuestOb.questStr)==!-1)
				{
					console.log("am here");
					continue;
				}
				else
				{
					used.push(QuestOb.questStr);
					test = true;
				}

			}

			
			this.Questions.push({
				questionString:QuestOb.questStr, 
				correct:QuestOb.correct, 
				answers:this.shuffleArray(QuestOb.answers)
			});
		}
		
	}

	QuizService.prototype.getRandomAlbum = function()
	{
		var num = this.albums.length;
		var index = Math.floor((Math.random() * num)+0);

		return this.albums[index];
	}

	QuizService.prototype.formatTime = function(time)
	{
			var minutes = parseInt( time / 60 ) % 60;
			var seconds = time % 60;
			var str = minutes +":"+Math.floor(seconds);
			
			return str;
			
	}

	QuizService.prototype.shuffleArray = function(array)
	{
		//stackoverflow:
		//http://stackoverflow.com/a/12646864/1091665
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	    return array;
	}
	

	return QuizService;
}])
;