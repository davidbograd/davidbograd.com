$(document).ready(function(){

	// hide our element on page load
	$('.element-to-animate').css('opacity', 0);

	$('.element-to-animate').waypoint(function() {
    console.log("here!");
	  $('.element-to-animate').addClass('fadeIn');
	}, { offset: '90%' });




  $('.fadein-auto').css('opacity', 0);

  var fadeIn = function() {
    $('.fadein-auto').addClass('fadeIn');
  };
  fadeIn();



  $('.fadein-300').css('opacity', 0);

  var fivehundred = function() {
    $('.fadein-300').addClass('fadeInLeft');
  };

  setTimeout(function() { fivehundred(); }, 300);


  });
