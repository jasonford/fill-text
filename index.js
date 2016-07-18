function fillText(element, alignment) {

    var text = $(element).contents();

    var sizer;

    function fit() {

        if (text.text().trim() == '') return;
        if (!$.contains(document, element)) return;
        text.detach();
        var text_element = $('<div>');
        text_element.css({
            position : 'relative',
            display : 'inline-block'
        });
        
        if (sizer) sizer.remove();
        text_element.append(text);
        sizer = $('<div class="sizer">');
        sizer.append(text_element);
        sizer[0].style.fontSize = '12px';
        $(element).append(sizer);
        var text_aspect_ratio = $(text_element).width() / $(text_element).height();
        var aspect_ratio = $(element).width() / $(element).height();
        if (text_aspect_ratio > aspect_ratio) {
            $(sizer).width($(text_element).width());
            $(sizer).height($(text_element).width() / aspect_ratio);
        }
        else {
            $(sizer).height($(text_element).height());
            $(sizer).width($(text_element).height() * aspect_ratio);
        }
        var w = sizer.width();
        var h = sizer.height();
        var scaleFactor = 0.9;
        while (true) {
            w *= scaleFactor;
            h *= scaleFactor;
            sizer.width(w);
            sizer.height(h);
            if (sizer.width() < text_element.width() || sizer.height() < text_element.height()) {
                sizer.width(w/scaleFactor);
                sizer.height(h/scaleFactor);
                break;
            }
        }
        //    the sizer is now closest aspect ratio as its parent's
        var scale = $(element).width() / sizer.width();
        text_aspect_ratio = text_element.width() / text_element.height();
        sizer.css({
            'webkitTransformOrigin': '0% 0%',
            'mozTransformOrigin': '0% 0%',
            'msTransformOrigin': '0% 0%',
            'oTransformOrigin': '0% 0%',
            'transformOrigin': '0% 0%',
            'transform' : 'scale(' + scale + ', ' + scale + ')'
        });

        var top = (sizer.height() - text_element.height())/2/scale;
        var left = (sizer.width() - text_element.width())/2/scale;
        var right = 'auto';
        var bottom = 'auto';
        
        if (/right/.test(alignment)) {
          right = 0;
          left = 'auto';
        }
        else if (/left/.test(alignment)) {
          left = 0;
        }
        
        if (/top/.test(alignment)) {
          top = 0;
        }
        else if (/bottom/.test(alignment)) {
          bottom = 0;
          top = 'auto';
        }

        text_element.css({
            position: 'absolute',
            top : top,
            left : left,
            right : right,
            bottom : bottom
        });
        $(element).css({opacity : 1});
    }
    var mostRecentFrame = requestAnimationFrame(fit);
    $(element).on('elementresize', function () {
      var frame = requestAnimationFrame(function () {
        if (frame === mostRecentFrame) fit();
      });
      mostRecentFrame = frame;
    });
}