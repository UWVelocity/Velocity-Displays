(function(){
    var page = function(page){
        page.load = function(loadCallback, finishCallback){
            var iframe = page.iframe = $('<iframe></iframe>');
            iframe.attr('src', page.site);
            iframe.addClass('loading').addClass('content');
            iframe.load(function(){
                iframe.removeClass('loading');
                loadCallback();
                setTimeout(finishCallback, page.time * 1000);
            });
            iframe.appendTo($('body'));
        };
        page.detach = function(){
            page.iframe.remove();
        };
        return page;
    };
    var get_pages = function(i, callback){
        $.getJSON('/pagelist/' + i + '/', function(p_list){
            callback(_.map(p_list, page));
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
    var current_page;
    var enqueue_page = function(){
        next_page(function(page){
            page.load(function(){
                if(current_page){
                    current_page.detach();
                }
                current_page = page;
            }, enqueue_page);
        });
    };
    enqueue_page();
    $(_.delay(_.bind(location.reload, location, true), 1800000))
})();
