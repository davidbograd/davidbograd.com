function init(){
	caseLinkEventListener();
	$('.js-tilt').tilt();
}

function caseLinkEventListener(){
	$(".section").each(function(){
		var caseLink = $(this).find('.case-link');
		caseLink.on('click', animateCaseLink);
	});
}

function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

function animateCaseLink(event){
	var parentDiv = event.target;
	parentDiv = findAncestor(parentDiv, "section");
	parentDiv = parentDiv.getAttribute("id");
	event.preventDefault();
	$('html, body').animate({
        scrollTop: $("#"+parentDiv).offset().top
    }, 300);
	$(".contact-info").addClass("fadeOutUp");
	$(".fixed-case-nav").addClass("fadeOut");
	var rectangle = $(this).parent().find('.rectangle');
	rectangle.animate({
		right: "0",
	}, 'ease-in');
	rectangle.animate({
		top: "0",
		height: "200vh",
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
