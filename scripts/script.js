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

	var myChannels = ["Starladder1", "dotastarladder_en", "EternaLEnVyy", "BeyondtheSummit_ES", "Freecodecamp", "brunofin", "comster404"];
	//checkChannelStatus(myChannels[2]);
	//checkChannelStatus(myChannels[5]); //null / Twitch account does not exist or Streamer has closed their account
	//checkChannelStatus(myChannels[4]); //offline
	var game = ["Dota 2"]
	
	for (var i=0; i<myChannels.length; i++){
		getChannelInfo(myChannels[i]);
	}

	/*
	myChannels.forEach(function(channel){
		getChannelInfo(channel).then(function(result){
			console.log("Result: "+ result.jqXHR);
		}, function(error){
			console.log("Error", error);
		})
	});
	*/
	//fetchChannelList(myChannels);
	//fetchChannelList(myChannels.join(','));

})

/*
var getChannelInfo = function(channel){
	var url = "https://api.twitch.tv/kraken/streams/" + channel;
	return ChannelInfo = new Promise(resolve, reject){
		var apiResults = $.ajax({
			url: url,
			type: "GET",
			dataType: "jsonp",
			headers: {
				'Client-ID': 'i0bm039u6j4dr1ifl1t3v2s16srrhq'
			},
			suceess: function(json){
				resolve(json);
			}
		});
	}.
}*/

$.ajaxSetup({
  headers : {
    'Client-ID': 'i0bm039u6j4dr1ifl1t3v2s16srrhq'
  }
});

var getChannelInfo = function(channel){
	var url = "https://api.twitch.tv/kraken/streams/" + channel;
	return new Promise(resolve, reject){
		$.getJSON(url, function(json){
		resolve(json);
		});
	}

} 





var fetchChannelList = function(channels){
	var url = "https://api.twitch.tv/kraken/streams/";
	$.ajax({
		url: url,
		data: {
			"channel": channels,
			"stream_type": "all"
		},
		headers: {
			'Client-ID': 'i0bm039u6j4dr1ifl1t3v2s16srrhq'
		},
		success: function(json){
			console.log(json);
		}
	});
}