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
			//$('.sidenav').animate({width: '+=20%'},'slow');
		//$(this).animate({width: '=250px'}, 'slow');
		//$('.sidenav-items').show('slow');
		
	});

	
	//$(this).animate({width: '=250px'}, 'slow');
		//$('.sidenav-items').show('slow');
})