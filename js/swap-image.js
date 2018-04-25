$(".pagination img").click(function(){															 
    var id = $(this).attr("id");
    $(this).parent().addClass('active').siblings().removeClass('active');
    if ($(".fade" + id).attr("src") !== $(this).attr("src")) {
        $(".fade" + id).css('display','none').attr("src",$(this).attr("src")).fadeIn(700);
        $(".fade" + id).parent().attr("href",$(this).attr("src"));
        return false;
    }
})