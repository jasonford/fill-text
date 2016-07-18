//  Testing approach:
//
//  generate basic tests from all combinations of test attributes
//
//  for each test variation:
//    create text node
//    create div
//    insert text node into div
//    place div in DOM
//    ensure text is properly sized

var tests = [{
    "text": "b",
    "dimensions": [
        496,
        780
    ],
    "font": "sans-serif",
    "alignment": "right"
},{
    "text": "mls h",
    "dimensions": [
        95,
        828
    ],
    "font": "Arial",
    "alignment": "top"
}];

function randomInt(start, end) {
  return Math.floor(start + (end-start)*Math.random());
}

var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
function randomWord(length) {
  var word = '';
  for (var i=0; i<length; i++) {
    word += alphabet[randomInt(0,alphabet.length-1)];
  }
  return word;
}

function randomWords(length) {
  var words = [];
  for (var i=0; i<length; i++) {
    words.push(randomWord(randomInt(1, 10)));
  }
  return words.join(" ");
}

function generateTestConfig() {
  return {
    text : randomWords(randomInt(1,10)),
    dimensions : [randomInt(1,1000), randomInt(1,1000)],
    font : [
        'Times New Roman',
        'Arial',
        'monospace',
        'sans-serif',
        'serif'
      ][randomInt(0,4)],
    alignment : [
        'top',
        'right',
        'left',
        'bottom',
        'topleft',
        'topright',
        'bottomleft',
        'bottomright',
        ''
      ][randomInt(0, 7)]
  }
}

runTests();

function runTests() {
  var testConfig = tests.shift() || generateTestConfig();
  run(testConfig, runTests);
}

function run(test, done) {
  var textNode = document.createTextNode(test.text);
  var container = document.createElement('div');
  var padding = 5;
  style(container, {
    'font-family' : test.font,
    'text-align'   : test.textAlign,
    'display'     : 'inline-block',
    'width'       : test.dimensions[0] + 'px',
    'height'      : test.dimensions[1] + 'px',
    'margin'      : '8px',
    'padding'     : padding + 'px'
  });
  container.appendChild(textNode);
  document.body.appendChild(container);
  fillText(container, test.alignment);

  //  test centering after container has been fit
  //  fillText uses requestAnimationFrame for first fit, so will
  //  add the check to an animation frame after first fit
  requestAnimationFrame(function () {
    var inner = container.firstChild.firstChild.getBoundingClientRect();
    var outer = container.firstChild.getBoundingClientRect();
    var wrapper = container.getBoundingClientRect();

    var innerLeft = Math.round(inner.left-outer.left);
    var innerRight = Math.round(outer.right-inner.right);
    var innerTop = Math.round(inner.top-outer.top);
    var innerBottom = Math.round(outer.bottom-inner.bottom);

    //  ensure inner is inside of outer
    var innerContained = true;
    if (innerLeft < -0.1) {
      innerContained = false;
    }
    if (innerRight < -0.1) {
      innerContained = false;
    }
    if (innerTop < -0.1) {
      innerContained = false;
    }
    if (innerBottom < -0.1) {
      innerContained = false;
    }

    //  ensure alignment is as expected
    var aligned = true;
    if (/top/.test(test.alignment) && Math.round(innerTop) !=0) {
      aligned = false;
    }
    if (/left/.test(test.alignment) && innerLeft != 0) {
      aligned = false;
    }
    if (/right/.test(test.alignment) && innerRight != 0) {
      aligned = false;
    }
    if (/bottom/.test(test.alignment) && innerBottom != 0) {
      aligned = false;
    }
    if (test.alignment == '' && (innerTop != innerBottom || innerLeft != innerRight)) {
      aligned = false;
    }

    //  calculate extra space left
    var extraSpace = Math.min(outer.width - inner.width, outer.height - inner.height);

    // ensure spacer inside of container is respecting padding
    var outerLeft = Math.round(outer.left-wrapper.left);
    var outerRight = Math.round(wrapper.right-outer.right);
    var outerTop = Math.round(outer.top-wrapper.top);
    var outerBottom = Math.round(wrapper.bottom-outer.bottom);
    var paddingRespected = outerLeft == padding && outerRight == padding && outerTop == 5 && outerBottom == 5;


    //  ensure inner is within tolerance
    if (aligned && innerContained && extraSpace >= 0 && extraSpace < outer.width*0.1 && paddingRespected) {
      document.body.removeChild(container);
      done();
    }
    else {
      console.log('failed test');
      console.log(JSON.stringify(test, null, 4), 'not aligned/contained', inner, outer,
        outerLeft, outerRight, outerTop, outerBottom);
      done();
    }
  });
}

function style(element, styles) {
  for (var field in styles) {
    element.style[field] = styles[field];
  }
}

function copy(o) {
  var c = {};
  for (var f in o) {c[f] = o[f];}
  return c;
}






