$(document).ready(function(){

	//hide sidenav items initially
	var isClose = true;

	$('.sidenav').on('click', function(){
		if (isClose === true){
			$('.sidenav').animate({width: '+=250px'}, 'fast');
			$('.main-container').animate({marginLeft: '+=250px'}, 'slow');
			$('.sidenav-items').show('slow');			
			isClose = false;
		} else if (isClose === false){
			$('.sidenav').animate({width: '-=250px'}, 'fast');
			$('.main-container').animate({marginLeft: '-=250px'}, 'slow');
			$('.sidenav-items').hide('slow');	
			isClose = true;
		}
			//$('.sidenav').animate({width: '+=20%'},'slow');
		//$(this).animate({width: '=250px'}, 'slow');
		//$('.sidenav-items').show('slow');
		
	});

	
	//$(this).animate({width: '=250px'}, 'slow');
		//$('.sidenav-items').show('slow');
})