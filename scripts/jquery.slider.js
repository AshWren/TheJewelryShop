; (function($){
console.log("task");
    $.fn.Slider = function (options){
        var defaults = {
            offset: 0,
            current: 0,
            transition: "fade",
            slider: ".slider",
            slide: ".slide",
            pager: ".pager", 
            pagerTag: "a", 
            pagerBuilder: "undefined",
            slideNext: ".next", 
            slidePrev: ".prev",
            activeClass: "active",
        };
        
        options = $.extend(defaults, options);


        //setup
        var elm = $(this),
            pageIndex = 0,
            slideCount = 0;
        var slider = elm.find(options.slider);
        var slides = elm.find(options.slide);
        var pageNext = elm.find(options.slideNext);
        var pagePrev = elm.find(options.slidePrev);
        var pager = elm.find(options.pager);
        var curr = options.current;
        var next = curr;
        
        var sliding = false; //huh?

        //controls
        slides.each(function(index){
            if (typeof options.pagerBuilder !== 'undefined' && $.isFunction(options.pagerBuilder)){
                pager.append(options.pagerBuilder(index));
            }else {
                pager.append('<'+options.pagerTag+'></'+options.pagerTag+'>');
            }
        });

        pager.find(options.pagerTag).first().addClass(options.activeClass);

        pager.on('click', options.pagerTag, function(){
            if($(this).index() != curr) {
                sliderTransition($(this).index());
            }
        });

        pagePrev.on('click', function(){
            if(!sliding) {
                next = curr;
                sliderTransition(--next, false); //huh?
            }
        });
        
        pageNext.on('click', function(){
            if(!sliding){
                next = curr;
                sliderTransition(++next, true);
            }
        });

        if(slides.length<2) {
            pagePrev.hide();
            pageNext.hide();
            pager.hide();
            clearInterval(interval);
        }

        //slides
        function sliderTransition(skip, forward){
            if(!sliding){
                //set next slide
                sliding = true;
                clearInterval(interval);
                if(forward == null){
                    forward = true;
                }
                if(skip != null) {
                    next = skip;
                }else {++next;}
                if(next >=slides.length){
                    next = 0;
                }else if (next < 0) { next = slides.length -1;
                    //what just happened
                }

                //slider setup
                pager.find(options.pagerTag).removeClass(options.activeClass);
                pager.find(options.pagerTag+":nth-child("+ (next + 1) + ")").addClass(options.activeClass);

                if(options.transition == "slide") {
                    var w = slides.eq(curr).width();
                    var h = slides.eq(curr).height();

                    slider.attr('style', 'width' + w + 'px; height:'+ h + 'px; position: relative; overflow: hidden;');

                    slides.attr('style', 'display:none; position:absolute; width: 100%;');

                    slides.eq(curr).css('left', '0px').show();
                    slides.eq(next).css('left', ((forward) ? '' : '-') + (w + options.offset) + 'px').show();

                     slides.eq(curr).transition({ left: ((forward) ? '-' : '') + w + 'px' }, options.duration, 'easeInOutQuad', function () {
                        slides.eq(curr).attr('style', 'position:relative;').hide();
                    });
                        slides.eq(next).transition({ left: '0px' }, options.duration, 'easeInOutQuad', function () {
                        slider.attr('style', 'position:relative;');
                        slides.eq(next).attr('style', 'position:relative; display:block;');
                        curr = next;
                        sliding = false;
                        if (options.auto) { interval = setInterval(function () { sliderTransition(); }, options.delay); }
                    });  
                }else{
                     slider.attr('style', 'height:' + slider.height() + 'px; position:relative; z-index:1;');
                    slides.attr('style', 'display:block; opacity:0; z-index:0; position:absolute; left:0; top:0; right:0; bottom:0;');
                    slides.eq(curr).css('zIndex', '1').css('opacity', '1');
                    slides.eq(next).css('zIndex', '2').css('opacity', '0');
                    
                    if (options.transparent) { slides.eq(curr).transition({ opacity: 0 }, options.duration, 'easeInOutQuad'); }
                    slides.eq(next).transition({ opacity: 1 }, options.duration, 'easeInOutQuad', function () {                    
                        curr = next;
                        sliding = false;
                        slider.attr('style', 'position:relative; z-index:1;');
                        slides.eq(curr).attr('style', 'position:relative; display:block; opacity:1; z-index:2;');
                        if (options.auto) { interval = setInterval(function () { sliderTransition(); }, options.delay); }
                    });
                }
            }
        }
    }
    
});