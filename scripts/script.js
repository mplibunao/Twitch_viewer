$(document).ready(function(){

	//hide sidenav items initially
	var isClose = true;

	$('.sidenav').on('click', function(){
		if (isClose === true){
			$('.sidenav').animate({width: '+=250px'}, 'fast');
			$('.main-container').animate({marginLeft: '+=250px'}, 'slow');
			$('.sidenav-items').delay(200).show('fast').css("display", "inline-block");			
			isClose = false;
		} else if (isClose === false){
			$('.sidenav').animate({width: '-=250px'}, 'fast');
			$('.main-container').animate({marginLeft: '-=250px'}, 'slow');
			$('.sidenav-items').hide('fast').css("display", "inline-block");	
			isClose = true;
		}
	});

	//load Twitch javascript sdk to perform authentication /login your users for additional permissions
	//Twitch.init({clientId: 'i0bm039u6j4dr1ifl1t3v2s16srrhq'}, function(error,status){
		//the sdk is now loaded
	//	console.log('Twitch javacript sdk now loaded');
	//});

	var myChannels = ["WagamamaTV", "ODPixel", "Starladder1", "ESL_SC2", "dotastarladder_en", "EternaLEnVyy", "BeyondtheSummit_ES", "Freecodecamp", "brunofin", "comster404", "OgamingSC2", "cretetion"];
	var game = ["Dota 2"];
	
	getDefaultChannels(myChannels);

	//console.log(myChannels[1]);
	//getChannelInfo(myChannels[1]);
	//fetchChannelList(myChannels[1]);

})

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

var getDefaultChannels = function(channelArray){

	channelArray.forEach(function(channel){
		getChannelInfo(channel, function(json){
			console.log(json.status);
			console.log(json);
		});
	});

	/*
	for (var i=0; i<channelArray.length;i++){
		//callback function is called by the success callback of the ajax
		getChannelInfo(channelArray[i], function(json){
			console.log(json.status);
			console.log(i+": "+json);
		});
	}*/
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