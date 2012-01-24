(function(){
    window.addEventListener("message", function(event){
        var time = (event.data.time * 0.9)* 1000;
        var start = new Date().getTime() + ((event.data.time * 0.05) * 1000);
        var updatePosition = function(){
            var frac = Math.max(new Date().getTime() - start, 0);
            var percentage = frac/time;
            var content_height = $('body').height();
            var window_height = $(window).height();
            window.scrollTo(0, percentage * (content_height - window_height));
            setTimeout(updatePosition, 50);
        };
        $(function(){
            updatePosition();
        })
    });
})();
