
//ROLLOVER
smartRollover()
function smartRollover() {
	if(document.getElementsByTagName) {
		var images = document.getElementsByTagName("img");

		for(var i=0; i < images.length; i++) {
			if(images[i].src.match("_off."))
			{
				images[i].onmouseover = function() {
					this.setAttribute("src", this.getAttribute("src").replace("_off.", "_on."));
				}
				images[i].onmouseout = function() {
					this.setAttribute("src", this.getAttribute("src").replace("_on.", "_off."));
				}
			}
		}
	}
}

if(window.addEventListener) {
	window.addEventListener("load", smartRollover, false);
}
else if(window.attachEvent) {
	window.attachEvent("onload", smartRollover);
}

$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

//accordion_box
$(function() {   
    $(function(){  
        $(".ac_title").click(function(){
            $(this).toggleClass("open").next(".ac_con").slideToggle();    
        });
    });
    $(".menu").click(function () {
       $('.navsub').slideToggle();
    });
});

$(".navmenu li").hover(
    function(){
        $(this).find(".arcording").stop().slideDown();
    },
    function(){
        $(this).find(".arcording").stop().slideUp();
    }
);


(function ($) {
    $(document).ready(function () {
      var f = $('#footer').height();
        var pageup = $('.to_top');
        var pageup_show_yn = 1;
        var pageup_state = 2;
        var d_h;
        $(window).scroll(function () {
            if ($(window).scrollTop() > 300) {
                if (pageup_show_yn != 1) {
                    pageup.clearQueue().stop().animate({ 'opacity': '1' }, 500);
                    pageup_show_yn = 1;
                }
            }
            else {
                if (pageup_show_yn != 0) {
                    pageup.clearQueue().stop().animate({ 'opacity': '0' }, 500);
                    pageup_show_yn = 0;
                }
            }

            var t_d_h = d_h - $(window).height();
            if ($(window).scrollTop() > t_d_h) {
                var t_v = $(window).scrollTop() - t_d_h;
                $('.page_top_cont').css('bottom', t_v + 'px');
                pageup_state = 1;
            }
            else {
                if (pageup_state != 0) {
                    $('.page_top_cont').css('bottom', '20px');
                    pageup_state = 0;
                }
            }
        });

        setTimeout(function () {
            pageup_show_yn = 2;
            d_h = $(document).height() - 200;
            $(window).scroll();
        }, 500);
    });
})(jQuery);

/*====[ POPUP REGIS]*/
function regisselect(e) {
    $('.popbidding').slideFadeToggle(function () {
        e.removeClass('selected');
    });
}
$(function () {
    $('#bidding').on('click', function () {
        if ($(this).hasClass('selected')) {
            deselect($(this));
        } else {
            $(this).addClass('selected');
            $('.popbidding').slideFadeToggle();
        }
        return false;
    });
    $('.close_bidding').on('click', function () {
        regisselect($('#bidding'));
        return false;
    });
});

/*====[ POPUP COMPLETION]*/
function complselect(e) {
    $('.popcompl').slideFadeToggle(function () {
        e.removeClass('selected');
    });
}
$(function () {
    $('#compl').on('click', function () {
        if ($(this).hasClass('selected')) {
            deselect($(this));
        } else {
            $(this).addClass('selected');
            $('.popcompl').slideFadeToggle();
        }
        return false;
    });
    $('.close_compl').on('click', function () {
        complselect($('#compl'));
        return false;
    });
});

/*====[ POPUP Change bid amount]*/
function changeselect(e) {
    $('.popchange').slideFadeToggle(function () {
        e.removeClass('selected');
    });
}
$(function () {
    $('#change').on('click', function () {
        if ($(this).hasClass('selected')) {
            deselect($(this));
        } else {
            $(this).addClass('selected');
            $('.popchange').slideFadeToggle();
        }
        return false;
    });
    $('.close_change').on('click', function () {
        changeselect($('#change'));
        return false;
    });
});

$.fn.slideFadeToggle = function (easing, callback) {
    return this.animate({
        opacity: 'toggle',
        height: 'toggle'
    }, 'fast', easing, callback);
};
