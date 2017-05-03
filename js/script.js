function init(){
	fullPage();
	caseLinkEventListener();
}

function fullPage(){
	$('#fullpage').fullpage({
		navigation: true,
		navigationPosition: 'left'
	});
}

function caseLinkEventListener(){
	$(".section").each(function(){
		var caseLink = $(this).find('.case-link');
		caseLink.on('click', animateCaseLink);
	});
}

function animateCaseLink(event){
	event.preventDefault();
	var rectangle = $(this).parent().find('.rectangle');
	rectangle.animate({
		right: "0",
	}, 'ease-in-out');
	rectangle.animate({
		top: "0",
		height: "100vh",
	}, function(){
		$(".contact-info, .left").fadeOut();
	});
	rectangle.animate({
		width: "100vw",
	}, function(){
		window.location = $(this).parent().find('.case-link').attr('href');
	});
}

$(document).ready(init);