$(function(){
    if(parent.velocity_displays){
        var time = (parent.velocity_displays.time * 0.9)* 1000;
        var start = new Date().getTime();
        var updatePosition = function(){
            var frac = new Date().getTime() - start;
            var percentage = frac/time;
            var content_height = $('body').height();
            var window_height = $(window).height();
            window.scrollTo(0, percentage * (content_height - window_height));
            setTimeout(updatePosition, 50);
        };
        updatePosition();
    };
});
