

var colors = [

            // final palette [bg color, fill color]

            //["ED9B00", "E9D8A6"],
            // ** real gold
            ["E9D8A6", "ED9B00"],

            // **pink 2 beautiful light
            ["fff0f3", "ffb3c1"],
            //["fff0f3", "ff9eb0"],

            // **teal 1 beautiful
            //["d4f1f2", "77d1d4"],

            // **blue sand cool
            //["e9d8a6", "94d2bd"],

            // * green/teal
            //["d9ed92", "52b69a"],

            // *dark teal 1
            //["bbe2d5", "0a9396"],

            // **pink 3
            //["ffccd5", "ff8fa3"],

            // **gold
            //["fff0bd", "fdcb6e"],

            // * teal green 1
            //["b9e769", "0db39e"],

            // **blue 3 nice
            ["caf0f8", "48cae4"],
];

var paletteIndex;
var whichShape;
let resolution = 720.0;
let matchStroke;
let perRingRandomness;
let outlineGroup;

function rb(a, b) {
    return a + (b - a) * fxrand();
}

function randomColor() {
  let r2 = int(rb(0, colors[paletteIndex].length));
  return ('#' + colors[paletteIndex][r2]);
}

function getBgColor() {
  return ('#' + colors[paletteIndex][0]);
}

function getFillColor() {
  return ('#' + colors[paletteIndex][1]);
}

// all the state that needs to be set/initialized before calling setup for the first time
function init() {
    fxrand = sfc32(...hashes);
    paletteIndex = Math.floor(rb(0, colors.length));
    whichShape = (Math.floor(rb(0, 3))) + 1;
    if (whichShape === 1) {
        perRingRandomness = true;
    } else {
        perRingRandomness = od(0.5);
    }
    matchStroke = false;
    outlineGroup = true;
}

init();

const gr = (1+Math.sqrt(5.0))/2;

function setup() {

  var h = window.innerHeight;
  var w = h;

  // flip it if window is narrow width
  if (window.innerWidth < w) {
    w = window.innerWidth;
    h = h;
  }

  createCanvas(w, h);

  //var smalldim =  Math.floor(Math.min(w, h));
  //console.log('small dim: ' + smalldim);
  //  I ve had to fuss with that on other projects too. Basically limit the canvas size slightly by a modulo of window size.
  // I tend to work in proportions, so dividing by 2, 4, 10, etc.

  let block = h/3;

  let bgColor = getBgColor();
  background(bgColor);
  //console.log('bg color: ' + bgColor);

  let fillColor = randomColor();
  while (fillColor === bgColor) {
    fillColor = randomColor();
  }
  fill(fillColor);
  //console.log('fill color: ' + fillColor);

  if (matchStroke) {
    stroke(fillColor);
  } else {
    stroke('#000000');
  }
  strokeWeight(block/200);

  //noStroke();

  
  // pick a radius
  //let radius = wc([block/2, 0.5, block/3, 0.5]);

  // : pick a point where the center of the cirle will be

  let centery = h / 2;

  let centerx = w/2;
  //let centerx = wc([w/2, 0.34, w/6, 0.33, 5*w/6, 0.33]);
  //circle(centerx, centery, radius*2);

  if (whichShape === 3) {
    centery += centery/7;
  }

  //fill(randomColor());
  angleMode(RADIANS);

  //console.log('w = ' + w);
  //console.log('h = ' + h);

  let radius = block/1.25;
  let space = radius / 15;
  let base = radius / 2;

  // TODO: return
  let rows = pick([4,5,6,7,8,9]);//,10,11]);
  //let rows = 1;
  //console.log('num rows : ' + rows);

  /*

                color palette
                # rings aka number of layers
                outline style = none/group/every subdivision
                # complete rings (no skips)

  */



  let fillp;
  let sliceOpts;
  let numSlices;
  if (!perRingRandomness) {
      fillp = pick([.5, .65, .75, .85]);
      sliceOpts = [57,67,77,87,97];//.slice(0, r+2);
      //sliceOpts = [4,5,6,7,8];
      //sliceOpts = [47];
      numSlices = pick(sliceOpts);

      //console.log('prr = ' + perRingRandomness);
  }

  let num360s = 0;
  for (let r = 1; r <= rows; r++) {
      let skippedAny = false;
      //fill(randomColor());

      if (perRingRandomness) {
          fillp = pick([.5, .65, .75, .85]);
          // TODO: return back to all opts
          sliceOpts = [3,4,5,17,27,37,47,57,67,77,87,97];//.slice(0, r+2);
          // diff slices look better on diff shapes. 12 is good on triangles!
          //sliceOpts = [12];
          //sliceOpts = [3];
          numSlices = pick(sliceOpts);
          //console.log('slice opts: ' + sliceOpts);
      }
      //console.log('num slices: ' + numSlices);

      //let r = 19;
      let rad = base + r*space;
      rad = base + r*space;
      if (whichShape === 1) {
        rad = base/1.25 + r*space;
      } else if (whichShape === 2) {
        rad = base/2 + r*space;
      } else if (whichShape === 3) {
        rad = base/4 + r*space;
      }

      let numExtraRectsArr = [];
      for (let i = 0; i < numSlices; i++) {
        numExtraRectsArr.push(i);
      }

      shuffleArray(numExtraRectsArr);
      let numExtraRects = numExtraRectsArr.pop();

      //console.log('num extra arcs: ' + numExtraRects);

      let startingPositions = [];
      for (let i  = 1; i <= (numSlices-1); i++) {
        startingPositions.push(i);
      }

      let choices = [];
      for (let i = 0; i < numExtraRects; i++) {
        //console.log(startingPositions);
        shuffleArray(startingPositions);
        let chosen = startingPositions.pop();
        choices.push(chosen);
        //console.log('chosen = ' + chosen);
        //console.log(startingPositions);
      }


      // choices are a list of places to start new arcs. we start an arc at 0, then goes as far as 1st element, new arc to go as far as 2nd element, etc, until we are at 2pi

      // final arc :)
      choices.push(numSlices);

      // sort numerically
      choices.sort(function(a, b) {
        return a - b;
      });

      //console.log('choices: ' + choices);

      let drawYesOrNo = [];
      let prev = 0;
      for (let i = 0; i < choices.length; i++) {

        let next = choices[i];

        let startAngle = prev*(2*Math.PI/numSlices);
        let endAngle;

        // final arc
        if (i === (choices.length - 1)) {
          endAngle = next*(2*Math.PI/numSlices);
        } else {
          endAngle = next*(2*Math.PI/numSlices);// - Math.PI/64.0;
        }

        // .25 .5 .75 .95 1 all cool
        if (od(fillp)) {
            if (!outlineGroup) {
                if (whichShape === 1) {
                    drawArc(startAngle, endAngle, rad, rad + radius/20, centerx, centery);
                } else if (whichShape === 2) {
                    drawSquare(startAngle, endAngle, rad, rad + radius/20, centerx, centery);
                    //drawSquare(.1*Math.PI, 1.1*Math.PI/4, rad, rad + radius/20, centerx, centery);
                } else {
                    drawTri(startAngle, endAngle, rad, rad + radius/20, centerx, centery);
                }
                //drawArc(7.5*Math.PI/4, 7.9*Math.PI/4, rad, rad + radius/20, centerx, centery);
                let innerSquareDim = 2*rad;
                let outerSquareDim = 2*(rad + radius / 20);
                //noFill();
                //rect(centerx - innerSquareDim / 2, centery - innerSquareDim / 2, innerSquareDim, innerSquareDim);
                //rect(centerx - outerSquareDim / 2, centery - outerSquareDim / 2, outerSquareDim, outerSquareDim);
                //rect(centerx, centery, radius/20, outerSquareDim);
                //fill(getFillColor());
            }
            drawYesOrNo.push(true);
        } else {
            skippedAny = true;
            drawYesOrNo.push(false);
        }

        prev = next;

      }



      let startedAtZero = false;
      let endedAtZero = false;
      let bandaidStartAngle = 0;
      let bandaidEndAngle = 0;
      if (outlineGroup) {
          let startAngle = 0;
          prev = 0;
          for (let i = 0; i < choices.length; i++) {

            let next = choices[i];

            let previousWasSkip;
            if (i === 0) {
                previousWasSkip = true;
            } else if (drawYesOrNo[i-1] === false) {
                previousWasSkip = true;
            }

            if (previousWasSkip) {
                startAngle = prev*(2*Math.PI/numSlices);
            }

            // if current is draw, and next is skip or end, draw the arc from previously saved startAngle to current end angle
            if (drawYesOrNo[i] && ((i === (choices.length - 1)) || (!drawYesOrNo[i+1]))) {
                // draw arc
                let endAngle = next*(2*Math.PI/numSlices);

                if (whichShape === 1) {
                    drawArc(startAngle, endAngle, rad, rad + radius/20, centerx, centery);
                } else if (whichShape === 2) {
                    drawSquare(startAngle, endAngle, rad, rad + radius/20, centerx, centery);
                } else {
                    drawTri(startAngle, endAngle, rad, rad + radius/20, centerx, centery);
                    //drawTri(5*Math.PI/4, 6*Math.PI/4, rad, rad + radius/20, centerx, centery);
                }

                if (startAngle === 0) {
                    startedAtZero = true;
                    bandaidEndAngle = endAngle;
                }

                if (Math.abs(endAngle - Math.PI*2) < .00001) {
                    //console.log('(end at 0) start angle: ' + startAngle);
                    //console.log('(end at 0) end angle: ' + endAngle);
                    endedAtZero = true;
                    bandaidStartAngle = startAngle;
                }
            }

            prev = next;

          }
      }

      // started arc at 0? ended arc at 2pi? then fix the line :)
      if (startedAtZero && endedAtZero && bandaidStartAngle != 0) {
        //console.log('r = ' + r + ' started at 0: ' + startedAtZero + ' ended at 0: ' + endedAtZero);
        //console.log('bandaid start = ' + bandaidStartAngle + ' bandaid end = ' + bandaidEndAngle);
        //noStroke();
        if (whichShape === 1) {
            drawArc(bandaidStartAngle - Math.PI*2, bandaidEndAngle, rad, rad + radius/20, centerx, centery);
        } else if (whichShape === 2) {
            drawSquare(bandaidStartAngle, bandaidEndAngle, rad, rad + radius/20, centerx, centery);
            //console.log('bandaid square no minus. works??? :)');
        } else {
            // TODO: return
            drawTri(bandaidStartAngle, bandaidEndAngle, rad, rad + radius/20, centerx, centery);
        }
        //stroke(strokeColor);
      }

      // finished this ring, on to the next
      if (!skippedAny) {
        num360s++;
      }
  }

  let chosenPalette;
  if (paletteIndex === 0) {
    chosenPalette = 'Gold';
  } else if (paletteIndex === 1) {
    chosenPalette = 'Pink';
  } else if (paletteIndex === 2) {
    chosenPalette = 'Blue';
  } else {
    chosenPalette = 'Unknown';
  }

  let chosenShape;
  if (whichShape === 1) {
    chosenShape = 'Circle';
  }
  else if (whichShape === 2) {
    chosenShape = 'Square';
  }
  else if (whichShape === 3) {
    chosenShape = 'Triangle';
  } else {
    chosenShape = 'Unknown';
  }

  let chosenOutline;
  if (outlineGroup) {
    chosenOutline = 'Group';
  } else if (matchStroke) {
    chosenOutline = 'None';
  } else {
    chosenOutline = 'All';
  }

  options = {
  'Color': chosenPalette,
  'Shape': chosenShape,
  '# of Layers': rows,
  //'Per Layer Randomness': perRingRandomness,
  //'Outline Style': chosenOutline,
  '# of 360s': num360s
  }

  //console.log(options);

  window.$fxhashFeatures = {
    ...options
  }



}

function drawArc(startAngle, endAngle, radius, endRadius, centerx, centery) {

  //console.log('start angle = ' + startAngle);
  //console.log('end angle = ' + endAngle);

  // 1st point is always fine, 0 angle at the radius
  beginShape();
  for (var angle = startAngle; angle < endAngle; angle+=Math.PI*2/resolution) {
    var x = centerx+(radius)*cos(angle);
    var y = centery+(radius)*sin(angle);

    vertex(x,y);
    //circle(x,y,2);
  }

  // 2nd point
  var x2 = centerx+(radius)*cos(endAngle);
  var y2 = centery+(radius)*sin(endAngle);
  vertex(x2, y2);

  //circle(x2, y2, 10);

  // 3rd point fine, actual and angle
  for (var angle = endAngle; angle > startAngle; angle-=Math.PI*2/resolution) {
    var x = centerx+(endRadius)*cos(angle);
    var y = centery+(endRadius)*sin(angle);

    vertex(x,y);
    //circle(x,y,2);
  }

  // 4th point
  var x4 = centerx+(endRadius)*cos(startAngle);
  var y4 = centery+(endRadius)*sin(startAngle);
  vertex(x4, y4);

  //circle(x4, y4, 10);

  endShape(CLOSE);

}

function drawTri(startAngle, endAngle, radius, endRadius, centerx, centery) {

  //console.log('draw tri debug');
  //console.log('start angle = ' + startAngle);
  //console.log('end angle = ' + endAngle);
  //console.log('radius = ' + radius);
  //console.log('end radius = ' + endRadius);
  //console.log('end draw tri debug');

  let bInner = radius/cos(Math.PI/3);
  let bOuter = endRadius/cos(Math.PI/3);
  let x = radius*tan(Math.PI/3)
  let m1 = (bInner+radius)/x;

  let xOuter  = endRadius*tan(Math.PI/3)
  let m1Outer = (bOuter+endRadius)/xOuter;

  //console.log('x = ' + x);
  //console.log('m1 = ' + m1);
  //console.log('xOuter = ' + xOuter);
  //console.log('m1Outer = ' + m1Outer);
  // y = m1*x + b

  //circle(centerx + x, centery + m1*x - b, 4);
  //circle(centerx + x, centery + m1*x - bInner, 4);


  // 4th point - line that starts the slice
  var x4 = centerx+(endRadius)*cos(startAngle);
  var y4 = centery+(endRadius)*sin(startAngle);

  //circle(x4, y4, 4);

  //var x44 = centerx+(endRadius*4)*cos(startAngle);
  //var y44 = centery+(endRadius*4)*sin(startAngle);
  //line(centerx, centery, x44, y44);

  // 2nd point - line that ends the slice
  var x2 = centerx+(radius)*cos(endAngle);
  var y2 = centery+(radius)*sin(endAngle);

  // where do these 2 lines intersect the inner triangle???
  // what is the equation of the triangle lines in zone 1?

  //line(centerx, centery, x4, y4);
  //line(centerx, centery, x2, y2);

  let xstart1;
  let ystart1;

  let xstart2;
  let ystart2;

  let xend1;
  let yend1;

  let xend2;
  let yend2;

  // debug triangle
  //basicTri(radius, centerx, centery);
  //basicTri(endRadius, centerx, centery);

  // start zone determines calculation of points to start shape
  if (startAngle >= 0 && startAngle < (Math.PI/6)) {
    //console.log('tri: start zone 1');
    let slope4 = (y4-centery) / (x4 - centerx);

    // y = slope4*x
    // y = m1*x + b
    // slope4*x = m1*x + b
    // sleop4*x - m1*x = b
    // x * (slope4 - m1) = b
    // x = b / (slope4 - m1);
    let xint = -bInner / (slope4 - m1);
    let yint = slope4*xint;

    //circle(centerx + xint, centery + yint, 4);

    // old 2nd point
    //let xint2 = (yint - (-bOuter))/m1;

    // TODO: fix cuts
    // y = mx + b for line that is perp to edges of triangle
    // m is 30 degree angle tan(30). solve for b by using xint yint
    let mm = -tan(Math.PI/6);
    let bb = yint - mm*xint;
    //console.log('bb = ' + bb);
    //console.log('mm = ' + mm);

    //let testx = 150;
    //let testy = mm*testx + bb;
    //circle(centerx + testx, centery + testy, 4);

    // mm and bb are correct line - y = mm*x + bb
    // question is just where does this mm bb line intersect the outer triangle line
    // well what is outer triangle line equation???
    // y = mx + b
    //let otestx = 250;
    //let otesty = m1*otestx - bOuter;
    // m1 and bOuter are correct
    //circle(centerx + otestx, centery + otesty, 4);

    // bb is correct y intercept good, continue this line to outer triangle - what is the intersection?
    //line(centerx + 0, centery + bb, centerx + xint, centery + yint);

    let xxint = (-bOuter - bb) / (mm - m1);
    let yyint = m1*xxint - bOuter;
    //console.log('xx int = ' + xxint);
    //circle(centerx + xxint, centery + yyint, 4);

    xstart1 = centerx + xint; 
    ystart1 = centery + yint;

    xstart2 = centerx + xxint; 
    ystart2 = centery + yyint;
    

    // step by step
    // there is a start point where the x4 y4 line hits the inner triangle line
        // need equation of inner triangle line
        // need slop of x4 y4 line, y = mx since b is 0 (line intersects origin)
    // there is a point on the outer triangle that goes from the previous step point to a new point that matches a line that hits the outer triangle line at a 90 degree angle
        // need equation of outer triangle line
        // need equation of the line that hits previous point at 90 degree angle

  }
  else if ((startAngle >= (Math.PI/6) && startAngle < (5*Math.PI/6))) {
    //console.log('tri: start zone 2');

    let slope4 = (y4-centery) / (x4 - centerx);
    let square4xInner = radius / slope4;
    //let square4xOuter = endRadius / slope4;

    xstart2 = centerx + square4xInner;
    ystart2 = centery + endRadius;
    
    xstart1 = centerx + square4xInner;
    ystart1 = centery + radius;

  }
  else if ((startAngle >= (5*Math.PI/6) && startAngle < (3*Math.PI/2))) {
    //console.log('tri: start zone 3');

    let slope4 = (y4-centery) / (x4 - centerx);

    let xint = -bInner / (slope4 - (-1*m1));
    let yint = slope4*xint;

    //let xint2 = (yint - (-bOuter))/(-1*m1);

    let mm = tan(Math.PI/6);
    let bb = yint - mm*xint;

    //let testx = -250;
    //let testy = mm*testx + bb;
    //circle(centerx + testx, centery + testy, 4);

    //line(centerx + 0, centery + bb, centerx + xint, centery + yint);

    let xxint = (-bOuter - bb) / (mm - (-1*m1));
    let yyint = -m1*xxint - bOuter;
    //circle(centerx + xxint, centery + yyint, 4);

    xstart1 = centerx + xint; 
    ystart1 = centery + yint;

    xstart2 = centerx + xxint; 
    ystart2 = centery + yyint;

  }
  else if ((startAngle >= (3*Math.PI/2) && startAngle <= (2*Math.PI))) {
    //console.log('tri: start zone 4');

    let slope4 = (y4-centery) / (x4 - centerx);

    let xint;
    let yint;
    if (slope4 === Infinity || slope4 === -Infinity) {
        //console.log('infin');
        xint = 0;
        yint = -bInner;
    } else {
        xint = -bInner / (slope4 - m1);
        yint = slope4*xint;
    }

    //let xint2 = (yint - (-bOuter))/m1;
    let mm = -tan(Math.PI/6);
    let bb = yint - mm*xint;

    let xxint = (-bOuter - bb) / (mm - m1);
    let yyint = m1*xxint - bOuter;

    xstart1 = centerx + xint; 
    ystart1 = centery + yint;

    xstart2 = centerx + xxint; 
    ystart2 = centery + yyint;
  }

  // debug - start circles
  //circle(xstart1, ystart1, 4);
  //circle(xstart2, ystart2, 4);

  // end zone determines calculation of points to end shape
  if (endAngle >= 0 && endAngle < (Math.PI/6)) {
    //console.log('tri: end zone 1');

    let slope2 = (y2-centery) / (x2 - centerx);

    let xint = -bInner / (slope2 - m1);
    let yint = slope2*xint;

    let mm = -tan(Math.PI/6);
    let bb = yint - mm*xint;

    let xxint = (-bOuter - bb) / (mm - m1);
    let yyint = m1*xxint - bOuter;

    //let xint2 = (yint - (-bOuter))/m1;

    xend1 = centerx + xint; 
    yend1 = centery + yint;

    xend2 = centerx + xxint; 
    yend2 = centery + yyint;

  }
  else if ((endAngle >= (Math.PI/6) && endAngle < (5*Math.PI/6))) {
    //console.log('tri: end zone 2');

    let slope2 = (y2-centery) / (x2 - centerx);
    let square2xInner = radius / slope2;
    //let square2xOuter = endRadius / slope2;

    xend2 = centerx + square2xInner;
    yend2 = centery + endRadius;
    
    xend1 = centerx + square2xInner;
    yend1 = centery + radius;

  }
  else if ((endAngle >= (5*Math.PI/6) && endAngle < (3*Math.PI/2))) {
    //console.log('tri: end zone 3');

    let slope2 = (y2-centery) / (x2 - centerx);

    let xint = -bInner / (slope2 - (-1*m1));
    let yint = slope2*xint;

    //let xint2 = (yint - (-bOuter))/(-1*m1);

    let mm = tan(Math.PI/6);
    let bb = yint - mm*xint;

    let xxint = (-bOuter - bb) / (mm - (-1*m1));
    let yyint = -m1*xxint - bOuter;

    xend1 = centerx + xint; 
    yend1 = centery + yint;

    xend2 = centerx + xxint; 
    yend2 = centery + yyint;

  }
  else if ((endAngle >= (3*Math.PI/2) && endAngle <= (2*Math.PI))) {
    //console.log('tri: end zone 4');

    let slope2 = (y2-centery) / (x2 - centerx);

    let xint;
    let yint;
    if (slope2 === Infinity || slope2 === -Infinity) {
        //console.log('infin');
        xint = 0;
        yint = -bInner;
    } else {
        xint = -bInner / (slope2 - m1);
        yint = slope2*xint;
    }

    //let xint2 = (yint - (-bOuter))/m1;

    let mm = -tan(Math.PI/6);
    let bb = yint - mm*xint;

    let xxint = (-bOuter - bb) / (mm - m1);
    let yyint = m1*xxint - bOuter;

    xend1 = centerx + xint; 
    yend1 = centery + yint;

    xend2 = centerx + xxint; 
    yend2 = centery + yyint;

  }

  // debug - end circles
  //circle(xend1, yend1, 4);
  //circle(xend2, yend2, 4);

  // short way or long way? like how many corners are we covering?
  let shortWay = startAngle < endAngle;

  let outerCorners = getTriCorners(whichTriZone(startAngle), whichTriZone(endAngle), shortWay, centerx, centery, endRadius);
  let innerCorners = getTriCorners(whichTriZone(startAngle), whichTriZone(endAngle), shortWay, centerx, centery, radius);

  //console.log('outer = ' + outerCorners);
  //console.log('inner = ' + innerCorners);

  beginShape();

  // start
  vertex(xstart1, ystart1);
  vertex(xstart2, ystart2);

  // outer corners
  for (let i = 0; i < outerCorners.length; i++) {
    vertex(outerCorners[i][0], outerCorners[i][1]);
  }

  // end
  vertex(xend2, yend2);
  vertex(xend1, yend1);

  // inner corners
  for (let i = innerCorners.length - 1; i >= 0; i--) {
    vertex(innerCorners[i][0], innerCorners[i][1]);
  }

  endShape(CLOSE);

}

function basicTri(radius, centerx, centery) {
  let y = radius/cos(Math.PI/3);
  //console.log('y tri: ' + y);
  let x = radius*tan(Math.PI/3)
  //console.log('x tri: ' + x);

  noFill();
  beginShape();
  vertex(centerx, centery - y);
  vertex(centerx+x, centery + radius);
  vertex(centerx-x, centery + radius);
  endShape(CLOSE);
  fill(getFillColor());

  return y;
}

function drawSquare(startAngle, endAngle, radius, endRadius, centerx, centery) {

  // 2nd point
  var x2 = centerx+(radius)*cos(endAngle);
  var y2 = centery+(radius)*sin(endAngle);

  // 4th point
  var x4 = centerx+(endRadius)*cos(startAngle);
  var y4 = centery+(endRadius)*sin(startAngle);

  let xstart1;
  let ystart1;

  let xstart2;
  let ystart2;

  let xend1;
  let yend1;

  let xend2;
  let yend2;

  // debug square
  //noFill();
  //rect(centerx - radius, centery - radius, 2*radius, 2*radius);
  //rect(centerx - endRadius, centery - endRadius, 2*endRadius, 2*endRadius);
  //fill(getFillColor());

  // start zone determines calculation of points to start shape
  if (startAngle >= 0 && startAngle < (Math.PI/4)) {
    //console.log('start in zone 1');
    //console.log('start angle = ' + startAngle + ' end angle = ' + endAngle);

    let slope4 = (y4-centery) / (x4 - centerx);
    let squarey4Inner = slope4*radius;
    //let squarey4Outer= slope4*endRadius;

    xstart1 = centerx + radius;
    ystart1 = centery + squarey4Inner;

    xstart2 = centerx + endRadius;
    ystart2 = centery + squarey4Inner;
  }
  else if ((startAngle >= (Math.PI/4) && startAngle < (3*Math.PI/4))) {
    //console.log('start in zone 2');

    let slope4 = (y4-centery) / (x4 - centerx);
    let square4xInner = radius / slope4;
    //let square4xOuter = endRadius / slope4;

    xstart1 = centerx + square4xInner; 
    ystart1 = centery + radius;

    xstart2 = centerx + square4xInner; 
    ystart2 = centery + endRadius;

  }
  else if ((startAngle >= (3*Math.PI/4) && startAngle < (5*Math.PI/4))) {
    //console.log('start in zone 3');

    let slope4 = -(y4-centery) / (x4 - centerx);
    let square4yInner = slope4*radius;
    let square4yOuter = slope4*endRadius;

    xstart1 = centerx - radius; 
    ystart1 = centery + square4yInner;

    xstart2 = centerx - endRadius; 
    ystart2 = centery + square4yInner;

  }
  else if ((startAngle >= (5*Math.PI/4) && startAngle < (7*Math.PI/4))) {
    //console.log('start in zone 4');

     let slope4 = (y4-centery) / (x4 - centerx);
     let square4xInner = radius / slope4;
     //let square4xOuter = endRadius / slope4;

     xstart1 = centerx - square4xInner; 
     ystart1 = centery - radius;
     
     xstart2 = centerx - square4xInner; 
     ystart2 = centery - endRadius;

  }
  else if ((startAngle >= (7*Math.PI/4) && startAngle <= (2*Math.PI))) {
    //console.log('start in zone 5');

    let slope4 = (y4-centery) / (x4 - centerx);
    let square4yInner = slope4*radius;
    //let square4yOuter = slope4*endRadius;

    xstart1 = centerx + radius; 
    ystart1 = centery + square4yInner;
    
    xstart2 = centerx + endRadius; 
    ystart2 = centery + square4yInner;

  }

  // debug - start circles
  //circle(xstart1, ystart1, 4);
  //circle(xstart2, ystart2, 4);

  // end zone determines calculation of points to end shape
  if (endAngle >= 0 && endAngle < (Math.PI/4)) {
    //console.log('end in zone 1');

    let slope2 = (y2-centery) / (x2 - centerx);

    let squarey2Inner = slope2*radius;
    //let squarey2Outer= slope2*endRadius;

    xend1 = centerx + radius;
    yend1 = centery + squarey2Inner;

    xend2 = centerx + endRadius;
    yend2 = centery + squarey2Inner;

  }
  else if ((endAngle >= (Math.PI/4) && endAngle < (3*Math.PI/4))) {
    //console.log('end in zone 2');

    let slope2 = (y2-centery) / (x2 - centerx);
    let square2xInner = radius / slope2;
    //let square2xOuter = endRadius / slope2;

    xend2 = centerx + square2xInner;
    yend2 = centery + endRadius;
    
    xend1 = centerx + square2xInner;
    yend1 = centery + radius;

  }
  else if ((endAngle >= (3*Math.PI/4) && endAngle < (5*Math.PI/4))) {
    //console.log('end in zone 3');

    let slope2 = -(y2-centery) / (x2 - centerx);
    let square2yInner = slope2*radius;
    //let square2yOuter = slope2*endRadius;

    xend2 = centerx - endRadius;
    yend2 = centery + square2yInner;

    xend1 = centerx - radius; 
    yend1 = centery + square2yInner;
  }
  else if ((endAngle >= (5*Math.PI/4) && endAngle < (7*Math.PI/4))) {
    //console.log('end in zone 4');


    let slope2 = (y2-centery) / (x2 - centerx);
    let square2xInner = radius / slope2;
    //let square2xOuter = endRadius / slope2;

    xend2 = centerx - square2xInner; 
    yend2 = centery - endRadius;
    xend1 = centerx - square2xInner; 
    yend1 = centery - radius;

  }
  else if ((endAngle >= (7*Math.PI/4) && endAngle <= (2*Math.PI))) {
    //console.log('end in zone 5');

    let slope2 = (y2-centery) / (x2 - centerx);
    let square2yInner = slope2*radius;
    let square2yOuter = slope2*endRadius;

    xend2 = centerx + endRadius; 
    yend2 = centery + square2yInner;
    xend1 = centerx + radius; 
    yend1 = centery + square2yInner;

  }

  // debug - end circles
  //circle(xend1, yend1, 4);
  //circle(xend2, yend2, 4);

  // short way or long way?
  // how many corners are we covering?
  // and which corners? return array of the corners 0 1 2 3 4 

  // TODO: this needs to be more nuanced. for example zone 5 to zone 1.
  let shortWay = startAngle < endAngle;


  // TODO: if start angle < 0, add 2pi then proceed...? lol

  let outerCorners = getCorners(whichZone(startAngle), whichZone(endAngle), shortWay, centerx, centery, endRadius);
  let innerCorners = getCorners(whichZone(startAngle), whichZone(endAngle), shortWay, centerx, centery, radius);

  //console.log('outer = ' + outerCorners);
  //console.log('inner = ' + innerCorners);

  beginShape();

  // start
  vertex(xstart1, ystart1);
  vertex(xstart2, ystart2);

  // outer corners
  for (let i = 0; i < outerCorners.length; i++) {
    vertex(outerCorners[i][0], outerCorners[i][1]);
  }

  // end
  vertex(xend2, yend2);
  vertex(xend1, yend1);

  // inner corners
  for (let i = innerCorners.length - 1; i >= 0; i--) {
    vertex(innerCorners[i][0], innerCorners[i][1]);
  }

  endShape(CLOSE);

}

function getCorners(startZone, endZone, shortWay, centerx, centery, radius) {

    //console.log('get corners: start zone = ' + startZone);
    //console.log('get corners: end zone = ' + endZone);

/*
        // 4 corners outer
        vertex(centerx + endRadius, centery + endRadius);
        vertex(centerx - endRadius, centery + endRadius);
        vertex(centerx - endRadius, centery - endRadius);
        vertex(centerx + endRadius, centery - endRadius);
        */

    if (startZone === 1) {
        if (endZone === 1) {
            if (shortWay) {
                return [];
            } else {
                return [
                    [centerx + radius, centery + radius],
                    [centerx - radius, centery + radius],
                    [centerx - radius, centery - radius],
                    [centerx + radius, centery - radius]
                    ];
            }
        } else if (endZone === 2) {
            return [[centerx + radius, centery + radius]];
        } else if (endZone === 3) {
            return [
                [centerx + radius, centery + radius],
                [centerx - radius, centery + radius]
                ];
        } else if (endZone === 4) {
            return [
                [centerx + radius, centery + radius],
                [centerx - radius, centery + radius],
                [centerx - radius, centery - radius]
                ];
        } else if (endZone === 5) {
            return [
                [centerx + radius, centery + radius],
                [centerx - radius, centery + radius],
                [centerx - radius, centery - radius],
                [centerx + radius, centery - radius]
                ];
        }
    } else if (startZone === 2) {
        if (endZone === 1) {
            return [
                [centerx - radius, centery + radius],
                [centerx - radius, centery - radius],
                [centerx + radius, centery - radius]
                ];
        } else if (endZone === 2) {
            if (shortWay) {
                return [];
            } else {
                return [
                    [centerx - radius, centery + radius],
                    [centerx - radius, centery - radius],
                    [centerx + radius, centery - radius],
                    [centerx + radius, centery + radius]
                    ];
            }
        } else if (endZone === 3) {
            return [
                [centerx - radius, centery + radius]
                ];
        } else if (endZone === 4) {
                return [
                    [centerx - radius, centery + radius],
                    [centerx - radius, centery - radius]
                    ];
        } else if (endZone === 5) {
                return [
                    [centerx - radius, centery + radius],
                    [centerx - radius, centery - radius],
                    [centerx + radius, centery - radius]
                    ];
        }
    } else if (startZone === 3) {
        if (endZone === 1) {
                return [
                    [centerx - radius, centery - radius],
                    [centerx + radius, centery - radius]
                    ];

        } else if (endZone === 2) {
                return [
                    [centerx - radius, centery - radius],
                    [centerx + radius, centery - radius],
                    [centerx + radius, centery + radius]
                    ];
        } else if (endZone === 3) {
            if (shortWay) {
                return [];
            } else {
                return [
                    [centerx - radius, centery - radius],
                    [centerx + radius, centery - radius],
                    [centerx + radius, centery + radius],
                    [centerx - radius, centery + radius]
                    ];
            }
        } else if (endZone === 4) {
                return [
                    [centerx - radius, centery - radius]
                    ];

        } else if (endZone === 5) {
                return [
                    [centerx - radius, centery - radius],
                    [centerx + radius, centery - radius]
                    ];
        }
    } else if (startZone === 4) {
        if (endZone === 1) {
                return [
                    [centerx + radius, centery - radius]
                    ];
        } else if (endZone === 2) {
                return [
                    [centerx + radius, centery - radius],
                    [centerx + radius, centery + radius]
                    ];
        } else if (endZone === 3) {
                return [
                    [centerx + radius, centery - radius],
                    [centerx + radius, centery + radius],
                    [centerx - radius, centery + radius]
                    ];
        } else if (endZone === 4) {
            if (shortWay) {
                return [];
            } else {
                return [
                    [centerx + radius, centery - radius],
                    [centerx + radius, centery + radius],
                    [centerx - radius, centery + radius],
                    [centerx - radius, centery - radius]
                    ];
            }
        } else if (endZone === 5) {
                return [
                    [centerx + radius, centery - radius]
                    ];
        }
    } else if (startZone === 5) {
        if (endZone === 1) {
                return [];
        } else if (endZone === 2) {
                return [
                    [centerx + radius, centery + radius]
                    ];
        } else if (endZone === 3) {
                return [
                    [centerx + radius, centery + radius],
                    [centerx - radius, centery + radius]
                    ];
        } else if (endZone === 4) {
                return [
                    [centerx + radius, centery + radius],
                    [centerx - radius, centery + radius],
                    [centerx - radius, centery - radius]
                    ];
        } else if (endZone === 5) {
            if (shortWay) {
                return [];
            } else {
                return [
                    [centerx + radius, centery + radius],
                    [centerx - radius, centery + radius],
                    [centerx - radius, centery - radius],
                    [centerx + radius, centery - radius]
                    ];
            }
        }
    }
    return [];
}

function whichZone(startAngle) {
  if (startAngle >= 0 && startAngle < (Math.PI/4)) {
    return 1;
  }
  else if ((startAngle >= (Math.PI/4) && startAngle < (3*Math.PI/4))) {
    return 2;
  }
  else if ((startAngle >= (3*Math.PI/4) && startAngle < (5*Math.PI/4))) {
    return 3;
  }
  else if ((startAngle >= (5*Math.PI/4) && startAngle < (7*Math.PI/4))) {
    return 4;
  }
  else if ((startAngle >= (7*Math.PI/4) && startAngle <= (2*Math.PI))) {
    return 5;
  }
}

function getTriCorners(startZone, endZone, shortWay, centerx, centery, radius) {

  let y = radius/cos(Math.PI/3);
  let x = radius*tan(Math.PI/3)

  //vertex(centerx, centery - y);
  //vertex(centerx+x, centery + radius);
  //vertex(centerx-x, centery + radius);

    if (startZone === 1) {
        if (endZone === 1) {
            if (shortWay) {
                return [];
            } else {
                return [
                [centerx+x, centery+radius],
                [centerx-x, centery+radius],
                [centerx, centery-y]
                ];
            }
        } else if (endZone === 2) {
                return [
                [centerx+x, centery+radius]
                ];

        } else if (endZone === 3) {
                return [
                [centerx+x, centery+radius],
                [centerx-x, centery+radius]
                ];

        } else if (endZone === 4) {
                return [
                [centerx+x, centery+radius],
                [centerx-x, centery+radius],
                [centerx, centery-y]
                ];
        }
    } else if (startZone === 2) {
        if (endZone === 1) {
                return [
                [centerx-x, centery+radius],
                [centerx, centery-y]
                ];
        } else if (endZone === 2) {
            if (shortWay) {
                return [];
            } else {
                return [
                [centerx-x, centery+radius],
                [centerx, centery-y],
                [centerx+x, centery+radius]
                ];
            }
        } else if (endZone === 3) {
                return [
                [centerx-x, centery+radius]
                ];
        } else if (endZone === 4) {
                return [
                [centerx-x, centery+radius],
                [centerx, centery-y]
                ];
        }
    } else if (startZone === 3) {
        if (endZone === 1) {
                return [
                [centerx, centery-y]
                ];
        } else if (endZone === 2) {
                return [
                [centerx, centery-y],
                [centerx+x, centery+radius]
                ];
        } else if (endZone === 3) {
            if (shortWay) {
                return [];
            } else {
                return [
                [centerx, centery-y],
                [centerx+x, centery+radius],
                [centerx-x, centery+radius]
                ];
            }
        } else if (endZone === 4) {
                return [
                [centerx, centery-y]
                ];
        }
    } else if (startZone === 4) {
        if (endZone === 1) {
                return [];
        } else if (endZone === 2) {
                return [
                [centerx+x, centery+radius]
                ];
        } else if (endZone === 3) {
                return [
                [centerx+x, centery+radius],
                [centerx-x, centery+radius]
                ];
        } else if (endZone === 4) {
            if (shortWay) {
                return [];
            } else {
                return [
                [centerx+x, centery+radius],
                [centerx-x, centery+radius],
                [centerx, centery-y]
                ];
            }
        } 
    }
    return [];
}

function whichTriZone(startAngle) {
  if (startAngle >= 0 && startAngle < (Math.PI/6)) {
    return 1;
  }
  else if ((startAngle >= (Math.PI/6) && startAngle < (5*Math.PI/6))) {
    return 2;
  }
  else if ((startAngle >= (5*Math.PI/6) && startAngle < (3*Math.PI/2))) {
    return 3;
  }
  else if ((startAngle >= (3*Math.PI/2) && startAngle <= (2*Math.PI))) {
    return 4;
  }
}

function od(a) {
    return fxrand() <= a
}

function wc(a) {
    const b = fxrand();
    let c = 0;
    for (let e = 0; e < a.length - 1; e += 2) {
        const f = a[e],
            g = a[e + 1];
        if (c += g, b < c) return f
    }
    return a[a.length - 2]
}

function pick(a) {
    let len = a.length;
    return a[int(rb(0, len))];
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(fxrand() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function windowResized() {
    clear();
    init();
    setup();
}
