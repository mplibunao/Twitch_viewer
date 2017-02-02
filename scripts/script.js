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

	checkChannelStatus();


})

var checkChannelStatus = function(){
	$.ajax({
		type: "GET",
		url: "https://api.twitch.tv/kraken/streams/ESL_SC2",
		headers: {
			'Client-ID': 'i0bm039u6j4dr1ifl1t3v2s16srrhq'
		},
		success: function(json){
			console.log(json);
		}
	})
}