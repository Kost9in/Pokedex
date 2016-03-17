'use strict';

$(function() {

	$(window).on('scroll', function() {
		if($(window).width() > 1020) {
			var d = $(window).scrollTop() - $('.list').offset().top;
			if(d > 0) {
				var d2 = ($('.list').offset().top + $('.list').outerHeight()) - ($(window).scrollTop() + $('.container .info').outerHeight());
				if(d2 > 0) $('.container .info').css('top', (d + 20) + 'px');
				else $('.container .info').css('top', ($('.list').outerHeight() - $('.container .info').outerHeight()) + 'px');
			}
			else $('.container .info').css('top', 0);
		}
	});
});

function loader(status) {
	if(status) $('.loader').fadeIn(300);
	else $('.loader').fadeOut(300);
}

function open_info(status) {
	if(status) {
		if($(window).width() <= 1020) {
			var d = $('.list').outerHeight() - $(window).scrollTop() - $('.container .info').outerHeight() - 10;
			if(d > 0) {
				var d2 = $(window).scrollTop() - $('.list').offset().top + 10;
				if(d2 < 0) d2 = 0;
				$('.container .info').css('top', (d2) + 'px');
			}
			else $('.container .info').css('top', ($('.list').outerHeight() - $('.container .info').outerHeight()) + 'px');
		}
		$('.container, .fade').addClass('open');
	}
	else $('.container, .fade').removeClass('open');
}