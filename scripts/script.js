/*	Global variables
	@ player is the instance of the embedded twitch player
	@ isClose is the boolean used to check navbar status
	@ generatedFeaturedGames is an array containing all the names of
	the featured games generated. This array is checked before generating
	a list of featured games to prevent duplication. This also means that
	you can only generate one list per game, else you have to refresh
*/
var player;
var generatedFeaturedGames = [];
var isClose = true;

$(document).ready(function(){
	console.log(generatedFeaturedGames[0]);
	//nav bar items
	$('.show-nav-button').on('click', function(){
		if (isClose === true){
			openNav('.streamer-row');
			//$('.sidenav').animate({width: '+=250px'}, 'fast');
			//$('.main-container').animate({marginLeft: '+=250px'}, 'slow');
			//$('.search-streamer').show();
			///$('.streamer-menu').contents().show();
			//show list of streamers
			//$('.streamer-row').show(200);
			//$('.streamer-row').contents().show(600);
			//isClose = false;
		} else if (isClose === false){
			//$('.sidenav').animate({width: '-=250px'}, 'fast');
			//$('.main-container').animate({marginLeft: '-=250px'}, 'slow');
			//$('.search-streamer').hide();
			//$('.streamer-menu').contents().hide();
			clearNav();
			closeNav();
			//isClose = true;
		}
	});

	//load Twitch javascript sdk to perform authentication /login your users for additional permissions
	//Twitch.init({clientId: 'i0bm039u6j4dr1ifl1t3v2s16srrhq'}, function(error,status){
		//the sdk is now loaded
	//	console.log('Twitch javacript sdk now loaded');
	//});

	//add event handlder for the viewMoreDetails button in the sidenav
	$('.sidenav-item-container').on('click', '.streamer-more-info', function(){
		//if hidden then unhide
		if ($(this).closest('.result').next('.streamer-details').css("display") == "none"){
			//go up the parent (streamer-row) => next sibling (streamer-details) => select all children and itself 
			$(this).closest('.result').next('.streamer-details').contents().addBack().show(400);
			//switch to up
			$(this).children().removeClass('fa-chevron-down').addClass('fa-chevron-up');
			//else if display is block then hide
		} else if ($(this).closest('.result').next('.streamer-details').css("display") == "block"){
			$(this).closest('.result').next('.streamer-details').contents().addBack().hide(400);
			//switch to up
			$(this).children().removeClass('fa-chevron-up').addClass('fa-chevron-down');
		}
	});


	/*  @ Event handlder for Status Menu Buttons
		@ Calls the filterStreamers function which filters
		the result on the sidebar depending parameter
		@ Passes a string name of the class name
	*/
	$('.menu-online').on('click', function(){
		filterStreamers('.online');
	});

	$('.menu-offline').on('click', function(){
		filterStreamers('.offline');
	});

	$('.menu-all').on('click', function(){
		filterStreamers('.streamer-row');
	});


	/*  Event handler for search bar
		@Calls search streamer function to check for matching streamers
		@searchParams is the current value of the search bar
	*/
	$('.search-streamer').on('keyup',function(){
		var searchParams = $(this).val();
		searchStreamer(searchParams);
	});

	/*	Event Listener for featured games
		@ If game is already found in generatedFeaturedGames
		array then don't make the api call and just display
		@ Else call getFeaturedGameStreamers to fetch the information
		from twitch.tv servers
		@ exists is a boolean value which tells if the game exists
		to prevent doing the conditional statement inside the loop
		- initially false
	*/
	$('.featured-games').on('click', '.featured-game-link', function(){
		var game = $(this).children('.featured-game-name').html();
		var exists = false;

		for (var i=0; i<=generatedFeaturedGames.length; i++){
			//console.log("array: " +generatedFeaturedGames[i]);
			if (game == generatedFeaturedGames[i]){
				console.log('game already exisit');
				exists = true;
			}
		}

		if (exists === true){
			clearNav();
			//remove non-alphanumeric characters to make a valid class
			var classStatus = game.replace(/\W/g, "-");
			if (isClose === true){
				openNav('.'+classStatus);	
			} else if (isClose === false){
				$('.'+classStatus).show(200);
				$('.'+classStatus).contents().show(600);
			}
		} else if (exists === false){
			getFeaturedGameStreamers(game);
		}
	});


	var myChannels = ["WagamamaTV", "ODPixel", "Starladder1", "ESL_SC2", "dotastarladder_en", "EternaLEnVyy", "BeyondtheSummit_ES", "Freecodecamp", "OgamingSC2", "cretetion", "comster404"];
	var game = ["Dota 2"];
	
	getDefaultChannels(myChannels);
	createPlayer();
	getFeaturedGames();


})//close document ready

/*	Handles opening nav bar
	@ streamType is the name of the class to show
	  for filtering results
	@ Sets isClose to false after opening nav
*/

var openNav = function(streamType){
	$('.sidenav').animate({width: '+=250px'}, 'fast');
	$('.main-container').animate({marginLeft: '+=250px'}, 'slow');
	$('.search-streamer').show();
	$('.streamer-menu').contents().show();
	//class
	$(streamType).show(200);
	$(streamType).contents().show(600);
	isClose = false;
}


/*  Creates an instance of Twitch Player
	@ player var is a global variable so other functions can access it
	@ channel = default channel is empty
	@ volume = 50%
*/
var createPlayer = function(){
	var option = {
		width: 854,
		height: 480,
		channel: ""
	};
	player = new Twitch.Player("player", option);
	player.setVolume(0.5);
	player.pause();
}


/*  Changes the stream in the embedded player
	@ channel = name of the channel you want to switch to
	@ currentChannel = name of the current channel you are streaming
*/
var watch = function(channel){
	var currentChannel = player.getChannel();
	if (channel == currentChannel){
		console.log('You\'re already watching this stream');
	} else{
		player.setChannel(channel);
		player.pause();
	}
}



	/* Handles hiding all elements when closing nav
	@ .result is the main class for all streamers and their details
	@ find all chevron-up icons and converts them to chevron down
*/
var clearNav = function(){
	$('.result').find('.fa-chevron-up').removeClass('fa-chevron-up').addClass('fa-chevron-down');
	$('.result').hide();
}
/*  Handles animation for moving navbar to closed position
	@ Set isClose to true after closing the nav
*/
var closeNav = function(){
	$('.sidenav').animate({width: '-=250px'}, 'fast');
	$('.main-container').animate({marginLeft: '-=250px'}, 'slow');
	$('.search-streamer').hide();
	$('.streamer-menu').contents().hide();
	isClose = true;
}

/*  Searches the side nav for a matching streamer
	@ displayName = String from search bar
	@ Hides all elements then displays all matching elements
	@ streamerName is placeholder variable
	@ all variables are converted to lowercase before comparing
	@ when a match has been found, traverse to the parent element and show that
*/
var searchStreamer = function(displayName){
	var streamerName;
	displayName = displayName.toLowerCase();
	clearNav();
	$('.streamer-name').each(function(index){
		streamerName = $(this).html().toLowerCase();
		if (streamerName.includes(displayName)){
			$(this).closest('.streamer-row').show();
		}
	});

}

/*	Fetch top games in twitch
*/

var getFeaturedGames = function(){
	var url = "https://api.twitch.tv/kraken/games/top";
	var name;
	var poster;
	var viewers;
	$.ajax({
		url: url,
		type: "GET",
		headers: {
			'Accept': 'application/vnd.twitchtv.v3+json',
			'Client-ID': 'i0bm039u6j4dr1ifl1t3v2s16srrhq'
		},
		success: function(json){
			console.log(json);
			for (var i=0; i<json.top.length; i++){
				name = json.top[i].game.name;
				poster = json.top[i].game.box.medium;
				viewers = json.top[i].viewers;
				setFeaturedGames(name, poster, viewers);
			}
		},
		error: function(jqxHR, exception){
			console.log("Exception: "+exception);
			console.log(jqXHR);
		}
	});
}

/* Displays the top games information fetched using twitch api
*/
var setFeaturedGames = function(name, poster, viewers){
	var html = '<div class="featured-games-result">';
	html+= '<a href="#" class="featured-game-link">';
	html+= '<img class="featured-game-box" src="' + poster + '" alt="' + name + '"/>';
	html+= '<p class="featured-game-name">' + name + '</p>';
	html+= '<p class="featured-game-viewers">' + viewers.toLocaleString() + ' viewers</p>';
	html+= '</a>';
	html+= '</div>';

	$('.featured-games').append(html);
}

/*  Fetches information about live streams
	@ game = name of the game
	@ classStatus - replaces all non-alphanumeric characters with '-' to make it a valid class name
	@ handles animation after appending all information to html
	@ generatedFeaturedGames array is pushed with the name of the game after displaying the streamers
	  this is to prevent from calling the api again when the poster is clicked resulting in duplicate streams
*/
var getFeaturedGameStreamers = function(game){
	var url = "https://api.twitch.tv/kraken/streams/";
	var logo;
	var displayName;
	var url;
	var status;
	var language;
	var viewers;
	var classStatus = game;
	classStatus = classStatus.replace(/\W/g, "-");
	console.log(classStatus);
	$.ajax({
		url: url,
		type: "GET",
		data: {
			"game": game,
			"stream-type": "live"
		},
		headers: {
			'Accept': 'application/vnd.twitchtv.v3+json',
			'Client-ID': 'i0bm039u6j4dr1ifl1t3v2s16srrhq'
		},
		success: function(json){
			console.log(json);
			for (var i=0; i<json.streams.length; i++){
				logo = json.streams[i].channel.logo;
				displayName = json.streams[i].channel.display_name;
				url = json.streams[i].channel.url;
				status =  json.streams[i].channel.status;
				//game = json.streams[i].channel.game; we have game already
				language = json.streams[i].channel.language;
				viewers = json.streams[i].viewers;
				setFeaturedGameNav(logo, displayName, url, status, game, language, viewers, classStatus);

			}
			//after loop set show featured games
			clearNav();
			if (isClose === true){
				openNav('.'+classStatus);	
			} else if (isClose === false){
				$('.'+classStatus).show(200);
				$('.'+classStatus).contents().show(600);
				
			}
			generatedFeaturedGames.push(game);
		},
		error: function(jqXHR, exception){
			console.log("Exception: "+exception);
			console.log(jqXHR);
		}
	});
}

/*	Annoyingly identical to setStreamerNav function except:
	@ removed the class "streamer-row" from the parent div
	@ added featured class in parent div
	@ classStatus is the name of the game
	@ appends it as unhidden
*/
var setFeaturedGameNav = function(logo, displayName, url, status, game, language, viewers, classStatus){
	var htmlJquery;
	var detailsJquery;

	var html = '<div class="row featured result ' + classStatus + '">';
	html+= '<img class="streamer-logo" src="'+ logo +'" alt="' + displayName + '"/>';
	html+= '<a class="sidenav-items streamer-name" href="#" onclick="watch(\'' + displayName +'\')">' + displayName + '</a>';
	html+= '<a href="#" class="streamer-more-info"><i class="fa fa-chevron-down" aria-hidden="true"></i></a>';
	html+= '</div>';

	var details = '<div class="row streamer-details result">';
	details+= '<p class="details-status">' + status + '</p>';
	details+= '<p class="details-game">Game : ' + game + '</p>';
	details+= '<p class="details-language">Language: ' + language + '</p>';
	details+= '<p class="details-viewers">' + viewers + '</p>';
	details+= '<a href="#"><button class="btn btn-block" onclick="watch(\'' + displayName +'\')">Watch</button></a>';
	details+= '<a href="' + url + '" target="_blank"><button class="btn btn-block visit-channel">Visit Channel</button></a>';
	details+= '</div>';
	
	
	htmlJquery = $(html).hide();
	detailsJquery = $(details).hide();
	//append in sidenav container
	$('.sidenav-item-container').append(htmlJquery);
	$('.sidenav-item-container').append(detailsJquery);
}


/*
   Get information about the channel using ajax call
 @ channel is name of the channel
 @ callbackFunction is a function passed to the function
   to be called on success 
*/
var getChannelInfo = function(channels, callbackFunction){
	var url = "https://api.twitch.tv/kraken/streams/"+channels;
	$.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		headers: {
			'Accept': 'application/vnd.twitchtv.v3+json',
			'Client-ID': 'i0bm039u6j4dr1ifl1t3v2s16srrhq'
		},
		success: function(json){
			callbackFunction(json);
		},
		error: function(jqXHR, exception){
			console.log("Exception: "+exception);
			console.log(jqXHR);
		}
	});
}

/*	Gets the channel info of offline streamers
	@ Uses channels api call instead of streams
	@ offline status is passed as viewers parameters since it just displayed as is
	  and because viewers are not a relevant information for offline streamers
	@ classStatus will be used as the class selector for showing and hiding elements
	@ ajax call will catch an error for streamers who don't exist
*/

var getOfflineChannelInfo = function(channel){
	var logo
	var displayName;
	var url;
	var status;
	var game;
	var language;
	var offlineStatus;
	var classStatus;

	var url = "https://api.twitch.tv/kraken/channels/"+channel;
	$.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		headers: {
			'Accept': 'application/vnd.twitchtv.v3+json',
			'Client-ID': 'i0bm039u6j4dr1ifl1t3v2s16srrhq'
		},
		success: function(json){
			logo = json.logo
			displayName = json.display_name;
			url = json.url;
			status = json.status;
			game = json.game;
			language = json.language;
			language = language.toUpperCase();
			offlineStatus = displayName + " is currently offline";
			classStatus = "offline";
			setStreamerNav(logo, displayName, url, status, game, language, offlineStatus, classStatus);
		},
		error: function(jqXHR, exception){
			console.log("Exception: "+exception);
			console.log(jqXHR.responseText);
			if (jqXHR.responseJSON.status == 404){
				//setClosedChannel("media/fi-torso.svg", channel);
				setClosedChannel("media/white-error-256_vix4cw.png", channel);
				console.log("This streamer has either closed his account or does not exist");
			}
		}
	});
}


/* @ Call the getChannelInfo function
   @ Passes an anonymous function as an argument
   which handles success login
   @ Anonymous function takes the result json as
   parameter and passes it to another function to
   put into the page
   @ classStatus will be used selector class for showing and removing elements
*/
var getDefaultChannels = function(channelArray){
	var logo;
	var displayName;
	var url;
	var status;
	var game;
	var language;
	var viewers;
	var classStatus;

	channelArray.forEach(function(channel){
		//call function on success
		getChannelInfo(channel, function(json){
			if (json.stream !== null){
				logo = json.stream.channel.logo;
				displayName = json.stream.channel.display_name;
				url = json.stream.channel.url;
				status = json.stream.channel.status;
				game = json.stream.channel.game;
				language = json.stream.channel.broadcaster_language;
				viewers = json.stream.viewers;
				viewers = viewers +" people currently watching!";
				classStatus = "online";
				//check for language
				language=language.toUpperCase();
				classStatus = "online";
				setStreamerNav(logo, displayName, url, status, game, language, viewers, classStatus);
			} else{
				//offline
				//do something with channel api
				getOfflineChannelInfo(channel);
			}

		});
	});
}
	
/* Displays the information fetched from twitch to the webpage
   @Takes variables as parameters and puts it inside html
   @htmlJquery and @detailsJquery - are placeholder variables
   so I can convert the html into a jQuery object then pass .hide()
   and be hidden on creation
*/
var setStreamerNav = function(logo, displayName, url, status, game, language, viewers, classStatus){
	//store the markup in a jquery so you can use jquery like hide
	var htmlJquery;
	var detailsJquery;

	var html = '<div class="row streamer-row result ' + classStatus + '">';
	html+= '<img class="streamer-logo" src="'+ logo +'" alt="' + displayName + '"/>';
	html+= '<a class="sidenav-items streamer-name" href="#" onclick="watch(\'' + displayName +'\')">' + displayName + '</a>';
	html+= '<a href="#" class="streamer-more-info"><i class="fa fa-chevron-down" aria-hidden="true"></i></a>';
	html+= '</div>';

	var details = '<div class="row streamer-details result">';
	details+= '<p class="details-status">' + status + '</p>';
	details+= '<p class="details-game">Game : ' + game + '</p>';
	details+= '<p class="details-language">Language: ' + language + '</p>';
	details+= '<p class="details-viewers">' + viewers + '</p>';
	details+= '<a href="#"><button class="btn btn-block" onclick="watch(\'' + displayName +'\')">Watch</button></a>';
	details+= '<a href="' + url + '" target="_blank"><button class="btn btn-block visit-channel">Visit Channel</button></a>';
	details+= '</div>';

	htmlJquery = $(html).hide();
	detailsJquery = $(details).hide();
	//append in sidenav container
	$('.sidenav-item-container').append(htmlJquery);
	$('.sidenav-item-container').append(detailsJquery);

}


/* Displays channels not found
   @Takes variables as parameters and puts it inside html
   @htmlJquery and @detailsJquery - are placeholder variables
   so I can convert the html into a jQuery object then pass .hide()
   and be hidden on creation
*/
var setClosedChannel = function(logo, displayName){

	var htmlJquery;
	var detailsJquery;

	var html = '<div class="row streamer-row result offline">';
	html+= '<img class="streamer-logo" src="'+ logo +'" alt="' + displayName + '"/>';
	html+= '<a class="sidenav-items streamer-name" href="#">' + displayName + '</a>';
	html+= '<a href="#" class="streamer-more-info"><i class="fa fa-chevron-down" aria-hidden="true"></i></a>';
	html+= '</div>';

	var details = '<div class="row streamer-details result">';
	details+= '<p class="details-status">Account does not exist</p>';
	details+= '<p class="details-language">' + displayName +' might have closed his account</p>';
	details+= '</div>';

	htmlJquery = $(html).hide();
	detailsJquery = $(details).hide();

	//append in sidenav container

	setTimeout(function(){
		$('.sidenav-item-container').append(htmlJquery);
		$('.sidenav-item-container').append(detailsJquery);
		console.log('done waiting');
	},1000);
	
}


/* Filter list of streamers in the navbar
@ Wildcard param is the streamer status to display
@ Possible params include @ .online @ .offline @ .streamer-row (all)
@ First hides all streamers and their details
@ Then shows the streamers (not details) with the matching class
*/
var filterStreamers = function(wildcard){
	//hide all elements first
	clearNav();
	//only show streamer-row with matching class
	$(wildcard).show();
}
