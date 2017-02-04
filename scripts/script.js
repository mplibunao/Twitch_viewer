//set player as global variable
var player;

$(document).ready(function(){

	//hide sidenav items initially
	var isClose = true;
	//nav bar items
	$('.show-nav-button').on('click', function(){
		if (isClose === true){
			$('.sidenav').animate({width: '+=250px'}, 'fast');
			$('.main-container').animate({marginLeft: '+=250px'}, 'slow');
			$('.search-streamer').show();
			$('.streamer-menu').contents().show();
			//show list of streamers
			$('.streamer-row').show(200);
			$('.streamer-row').contents().show(600);
			isClose = false;
		} else if (isClose === false){
			$('.sidenav').animate({width: '-=250px'}, 'fast');
			$('.main-container').animate({marginLeft: '-=250px'}, 'slow');
			$('.search-streamer').hide();
			$('.streamer-menu').contents().hide();
			closeNav();
			isClose = true;
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
		if ($(this).closest('.streamer-row').next('.streamer-details').css("display") == "none"){
			//go up the parent (streamer-row) => next sibling (streamer-details) => select all children and itself 
			$(this).closest('.streamer-row').next('.streamer-details').contents().addBack().show(400);
			//switch to up
			$(this).children().removeClass('fa-chevron-down').addClass('fa-chevron-up');
			//else if display is block then hide
		} else if ($(this).closest('.streamer-row').next('.streamer-details').css("display") == "block"){
			$(this).closest('.streamer-row').next('.streamer-details').contents().addBack().hide(400);
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


	var myChannels = ["WagamamaTV", "ODPixel", "Starladder1", "ESL_SC2", "dotastarladder_en", "EternaLEnVyy", "BeyondtheSummit_ES", "Freecodecamp", "OgamingSC2", "cretetion", "comster404"];
	var game = ["Dota 2"];
	
	getDefaultChannels(myChannels);
	createPlayer();


})//close document ready

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


/*


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
	@.result is the main class for all streamers and their details
	@find all chevron-up icons and converts them to chevron down
*/
var closeNav = function(){
	$('.result').find('.fa-chevron-up').removeClass('fa-chevron-up').addClass('fa-chevron-down');
	$('.result').hide();
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
	closeNav();
	$('.streamer-name').each(function(index){
		streamerName = $(this).html().toLowerCase();
		if (streamerName.includes(displayName)){
			$(this).closest('.streamer-row').show();
		}
	});

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
			'Client-ID': 'i0bm039u6j4dr1ifl1t3v2s16srrhq'
		},
		success: function(json){
			//console.log(json);
			callbackFunction(json);
		},
		error: function(jqXHR, exception){
			console.log("jqXHR: "+jqXHR +"; exception: "+exception);
		}
	});
}

/* @ Call the getChannelInfo function
   @ Passes an anonymous function as an argument
   which handles success login
   @ Anonymous function takes the result json as
   parameter and passes it to another function to
   put into the page
*/
var getDefaultChannels = function(channelArray){
	var logo;
	var displayName;
	var url;
	var status;
	var game;
	var language;
	var viewers;

	channelArray.forEach(function(channel){
		//call function on success
		getChannelInfo(channel, function(json){
			console.log(json);
			if (json.stream !== null){
				logo = json.stream.channel.logo;
				displayName = json.stream.channel.display_name;
				url = json.stream.channel.url;
				status = json.stream.channel.status;
				game = json.stream.channel.game;
				language = json.stream.channel.broadcaster_language;
				viewers = json.stream.viewers;

				//check for language
				language=language.toUpperCase();

				setStreamerNav(logo, displayName, url, status, game, language, viewers);
			} else{
				//offline
				setOfflineStreamer("media/fi-torso.svg", channel);
				//do something with channel api
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
var setStreamerNav = function(logo, displayName, url, status, game, language, viewers){
	//store the markup in a jquery so you can use jquery like hide
	var htmlJquery;
	var detailsJquery;

	var html = '<div class="row streamer-row result online">';
	html+= '<img class="streamer-logo" src="'+ logo +'" alt="' + displayName + '"/>';
	html+= '<a class="sidenav-items streamer-name" href="#" onclick="watch(\'' + displayName +'\')">' + displayName + '</a>';
	html+= '<a href="#" class="streamer-more-info"><i class="fa fa-chevron-down" aria-hidden="true"></i></a>';
	html+= '</div>';

	var details = '<div class="row streamer-details result">';
	details+= '<p class="details-status">' + status + '</p>';
	details+= '<p class="details-game">Game : ' + game + '</p>';
	details+= '<p class="details-language">Language: ' + language + '</p>';
	details+= '<p class="details-viewers">' + viewers + ' people currently watching!</p>';
	details+= '<a href="#"><button class="btn btn-block" onclick="watch(\'' + displayName +'\')">Watch</button></a>';
	details+= '</div>';

	htmlJquery = $(html).hide();
	detailsJquery = $(details).hide();
	//append in sidenav container
	$('.sidenav-item-container').append(htmlJquery);
	$('.sidenav-item-container').append(detailsJquery);

}

/* Displays the information of offline streamers
   @Takes variables as parameters and puts it inside html
   @htmlJquery and @detailsJquery - are placeholder variables
   so I can convert the html into a jQuery object then pass .hide()
   and be hidden on creation
*/
var setOfflineStreamer = function(logo, displayName){

	var htmlJquery;
	var detailsJquery;

	var html = '<div class="row streamer-row result offline">';
	html+= '<img class="streamer-logo" src="'+ logo +'" alt="' + displayName + '"/>';
	html+= '<a class="sidenav-items streamer-name" href="#">' + displayName + '</a>';
	html+= '<a href="#" class="streamer-more-info"><i class="fa fa-chevron-down" aria-hidden="true"></i></a>';
	html+= '</div>';

	var details = '<div class="row streamer-details result">';
	details+= '<p class="details-status">' + displayName + ' is offline</p>';
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
	closeNav();
	//only show streamer-row with matching class
	$(wildcard).show();
}


var fetchChannelList = function(channels){
	var url = "https://api.twitch.tv/kraken/streams/";
	$.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		data: {
			"channel": channels,
			"stream_type": "all"
		},
		headers: {
			'Accept': 'application/vnd.twitchtv.v3+json',
			'Client-ID': 'i0bm039u6j4dr1ifl1t3v2s16srrhq'
		},
		success: function(json){
			console.log("hi");
			console.log(json);
		},
		error: function(jqXHR, exception){
			console.log("jqXHR: "+jqXHR +"; exception: "+exception);
		}
	});
}