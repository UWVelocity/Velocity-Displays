(function(){
    window.velocity_displays = {};
    var page = function(page, index){
        page.load = function(finishCallback){
            var iframe = page.iframe = $('<iframe></iframe>');
            iframe.attr('src', page.site);
            iframe.attr('id', "contentpage" + index);
            iframe.attr('scrolling', "no");
            iframe.addClass('loading').addClass('content');
            iframe.load(function(){
                $('body iframe').not(iframe).remove();
                iframe.removeClass('loading');
                setTimeout(finishCallback, page.time * 1000);
                iframe.prop('contentWindow').postMessage({time: page.time}, "*");
            });
            iframe.appendTo($('body'));
        };
        return page;
    };

    var get_pages = function(i, callback){
        $.getJSON('/pagelist/' + i + '/' + list_arg, function(p_list){
            callback(_.map(p_list, function(p){
                return page(p, i++);
            }));
        });
    };
    var page_stack = [];
    var fetching = false;
    var index = 0;
    var load_pages = function(callback){
        callback = callback || function(){};
        if(fetching === false){
            fetching = [callback];
            get_pages(index, function(pages){
                page_stack.push.apply(page_stack, pages);
                index += pages.length
                var to_call = fetching;
                fetching = false;
                _.each(to_call, function(f){f()});
            });
        } else {
            fetching.push(callback);
        }
    };
    var length_threshold = 5;
    var next_page = function(callback){
        if(page_stack.length){
            if(page_stack.length < length_threshold){
                load_pages();
            }
            callback(page_stack.shift());
        } else {
            load_pages(function(){
                next_page(callback);
            });
        }
    };
    var enqueue_page = function(){
        next_page(function(page){
            page.load(enqueue_page);
        });
    };
    enqueue_page();
    $(_.delay(_.bind(location.reload, location, true), 1800000))
})();
