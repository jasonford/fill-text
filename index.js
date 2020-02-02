var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

function curCSS( elem, name, computed ) {
    var width, minWidth, maxWidth, ret,
        style = elem.style;

    computed = computed || getStyles( elem );

    // Support: IE <=9 only
    // getPropertyValue is only needed for .css('filter') (#12537)
    if ( computed ) {
        ret = computed.getPropertyValue( name ) || computed[ name ];
/*
        if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
            ret = jQuery.style( elem, name );
        }
*/
        // A tribute to the "awesome hack by Dean Edwards"
        // Android Browser returns percentage for some values,
        // but width seems to be reliably pixels.
        // This is against the CSSOM draft spec:
        // https://drafts.csswg.org/cssom/#resolved-values
        if ( /*!support.pixelMarginRight()*/ false && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

            // Remember the original values
            width = style.width;
            minWidth = style.minWidth;
            maxWidth = style.maxWidth;

            // Put in the new values to get a computed value out
            style.minWidth = style.maxWidth = style.width = ret;
            ret = computed.width;

            // Revert the changed values
            style.width = width;
            style.minWidth = minWidth;
            style.maxWidth = maxWidth;
        }
    }

    return ret !== undefined ?

        // Support: IE <=9 - 11 only
        // IE returns zIndex value as an integer.
        ret + "" :
        ret;
}

function css( elem, name, extra, styles ) {
    var val, num, hooks,
        origName = jQuery.camelCase( name );

    // Make sure that we're working with the right name
    name = jQuery.cssProps[ origName ] ||
        ( jQuery.cssProps[ origName ] = /*vendorPropName( origName ) ||*/ origName );

    // Try prefixed name followed by the unprefixed name
    hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    // If a hook was provided get the computed value from there
    if ( hooks && "get" in hooks ) {
        val = hooks.get( elem, true, extra );
    }

    // Otherwise, if a way to get the computed value exists, use that
    if ( val === undefined ) {
        val = curCSS( elem, name, styles );
    }

    // Convert "normal" to computed value
    if ( val === "normal" && name in cssNormalTransform ) {
        val = cssNormalTransform[ name ];
    }

    // Make numeric if forced or a qualifier was provided and val looks numeric
    if ( extra === "" || extra ) {
        num = parseFloat( val );
        return extra === true || isFinite( num ) ? num || 0 : val;
    }
    return val;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
    var i = extra === ( isBorderBox ? "border" : "content" ) ?

        // If we already have the right measurement, avoid augmentation
        4 :

        // Otherwise initialize for horizontal or vertical properties
        name === "width" ? 1 : 0,

        val = 0;

    for ( ; i < 4; i += 2 ) {

        // Both box models exclude margin, so add it if we want it
        if ( extra === "margin" ) {
            val += css( elem, extra + cssExpand[ i ], true, styles );
        }

        if ( isBorderBox ) {

            // border-box includes padding, so remove it if we want content
            if ( extra === "content" ) {
                val -= css( elem, "padding" + cssExpand[ i ], true, styles );
            }

            // At this point, extra isn't border nor margin, so remove border
            if ( extra !== "margin" ) {
                val -= css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
            }
        } else {

            // At this point, extra isn't content, so add padding
            val += css( elem, "padding" + cssExpand[ i ], true, styles );

            // At this point, extra isn't content nor padding, so add border
            if ( extra !== "padding" ) {
                val += css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
            }
        }
    }

    return val;
}


function getWidthOrHeight( elem, name, extra ) {

    // Start with offset property, which is equivalent to the border-box value
    var val,
        valueIsBorderBox = true,
        styles = window.getComputedStyle( elem ),
        isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

    // Support: IE <=11 only
    // Running getBoundingClientRect on a disconnected node
    // in IE throws an error.
    if ( elem.getClientRects().length ) {
        val = elem.getBoundingClientRect()[ name ];
    }

    // Some non-html elements return undefined for offsetWidth, so check for null/undefined
    // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
    // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
    if ( val <= 0 || val == null ) {

        // Fall back to computed then uncomputed css if necessary
        val = curCSS( elem, name, styles );
        if ( val < 0 || val == null ) {
            val = elem.style[ name ];
        }

        // Computed unit is not pixels. Stop here and return.
        if ( rnumnonpx.test( val ) ) {
            return val;
        }

        // Check for style in case a browser which returns unreliable values
        // for getComputedStyle silently falls back to the reliable elem.style
        valueIsBorderBox = isBorderBox &&
            ( /*support.boxSizingReliable()*/ true || val === elem.style[ name ] );

        // Normalize "", auto, and prepare for extra
        val = parseFloat( val ) || 0;
    }

    // Use the active box-sizing model to add/subtract irrelevant styles
    return ( val +
        augmentWidthOrHeight(
            elem,
            name,
            extra || ( isBorderBox ? "border" : "content" ),
            valueIsBorderBox,
            styles
        )
    );
}

function fillText(element, alignment) {
    function style(el, styles) {
        for (var field in styles) {
            el.style[field] = styles[field];
        }
    }

    function width(el) {
        return getWidthOrHeight(el, 'width', 'content');
    }

    function height(el) {
        return getWidthOrHeight(el, 'height', 'content');
    }

    function setWidth(el, width) {
        el.style.width = width;
    }

    function setHeight(el, height) {
        el.style.height = height;
    }

    var children = element.childNodes;

    var sizer;

    function fit() {

        //  edge cases that would cause infinite loops below
        if (element.textContent.trim() == '') return;
        if (!document.contains(element)) return;

        var text_element = document.createElement('div');
        style(text_element, {
            position : 'relative',
            display : 'inline-block'
        });
        
        //  remove sizer if already exists
        if (sizer) element.removeChild(sizer);
        children.forEach(function (child) {
          text_element.appendChild(child);
        });
        sizer = document.createElement('div');
        sizer.appendChild(text_element);

        sizer.style.fontSize = '12px';

        element.appendChild(sizer);

        var text_aspect_ratio = width(text_element) / height(text_element);
        var aspect_ratio = width(element) / height(element);
        if (text_aspect_ratio > aspect_ratio) {
            setWidth(sizer, width(text_element));
            setHeight(sizer, width(text_element) / aspect_ratio);
        }
        else {
            setHeight(sizer, height(text_element));
            setWidth(sizer, height(text_element) * aspect_ratio);
        }
        var w = width(sizer);
        var h = height(sizer);
        var scaleFactor = 0.9;
        while (true) {
            w *= scaleFactor;
            h *= scaleFactor;
            setWidth(sizer, w);
            setHeight(sizer, h);
            if (width(sizer) < width(text_element)|| height(sizer) < height(text_element)) {
                setWidth(sizer, w/scaleFactor);
                setHeight(sizer, h/scaleFactor);
                break;
            }
        }
        //    the sizer is now closest aspect ratio as its parent's
        var scale = Math.min(width(element)/width(sizer), height(element)/height(sizer));
        style(sizer, {
            'webkitTransformOrigin': '0% 0%',
            'mozTransformOrigin': '0% 0%',
            'msTransformOrigin': '0% 0%',
            'oTransformOrigin': '0% 0%',
            'transformOrigin': '0% 0%',
            'transform' : 'scale(' + scale + ', ' + scale + ')'
        });

        var top = (height(sizer) - height(text_element))/2/scale;
        var left = (width(sizer) - width(text_element))/2/scale;
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

        style(text_element, {
            position: 'absolute',
            top : top,
            left : left,
            right : right,
            bottom : bottom
        });
        style(element, {opacity : 1});
    }
    fit();
}