// These constants effect perfomance and where the view goes when reset
// MAX_ZOOM_OUT reflects the total range in r  and i values
var MAX_ZOOM_OUT = 4; //Set this lower for a closer starting zoom
var MAX_ITERATIONS = 200; //Set this higher for more complex edges

// These two values represent the origin for the reset view
var cenR = 0;
var cenI = 0;

// These two will be used for centering the zoomBox, and updating cenR and cenI
var newCenR = 0;
var newCenI = 0;

//The code below is for use in the imagery and rendering
var c = document.getElementById("c");
var ctx = c.getContext('2d');

//initialize these values, but they will be dynamic
var currentRange = MAX_ZOOM_OUT;
var zCenterX = c.width/2;
var zCenterY = c.height/2;

var seeGrid = false;
var gridButton = document.getElementById("showGrid");
gridButton.onclick = function() {
   //console.log("gridButton clicked. seeGrid = " + seeGrid);
   if (seeGrid) {
      ctx.clearRect(0,0,c.width,c.height);
      c.alpha = 0.0;
      gridButton.innerHTML = "Show Grid";
      seeGrid = false;
      //console.log("seeGrid = " + seeGrid);
      return;
   }
   if (!seeGrid) {
      c.alpha = 1.0;
      drawGrid();
      gridButton.innerHTML = "Hide Grid";
      seeGrid = true;
      return;
   }

}

//The following three functions adjust the zoomBox center via interaction with the c Canvas:
c.onmousemove = function(e) {
   // update displayed value for r and i:

   var newR = (cenR - currentRange/2) + ((e.pageX - c.offsetLeft)/c.width)*currentRange;
   var newi = (cenI + currentRange/2) - ((e.pageY - c.offsetTop)/c.height)*currentRange;
   document.getElementById("pointerCoords").innerHTML = "Zoom center: r = " + parseFloat(newR).toFixed(3) + " , i = " + parseFloat(newi).toFixed(3);
}
c.onmouseout = function(e) {
   document.getElementById("pointerCoords").innerHTML = "Zoom center: r = " + parseFloat(newCenR).toFixed(3) + " , i = " + parseFloat(newCenI).toFixed(3);
}
c.onclick = function(e) {
   newCenR = (cenR - currentRange/2) + ((e.pageX - c.offsetLeft)/c.width)*currentRange;
   newCenI = (cenI + currentRange/2) - ((e.pageY - c.offsetTop)/c.height)*currentRange;
   //console.log("newCenR = " + newCenR + " and newCenI = " + newCenI);
   upDateZoomBox(newCenR,newCenI);
}

function upDateZoomBox(Rcenter,Icenter) {
   var scalFact = range.value;

   var newRange = currentRange * Math.pow(2,-scalFact);

   if (newRange > MAX_ZOOM_OUT) { newRange = MAX_ZOOM_OUT;}

   var pxRange = Math.floor(c.width * (newRange/currentRange));

   var pX = RtranslateX(Rcenter) - pxRange/2;
   var pY = ItranslateY(Icenter) - pxRange/2;

   eraseReplace();

   ctx.beginPath();
   ctx.rect(pX,pY,pxRange,pxRange);
   ctx.strokeStyle="black";
   ctx.stroke();
   ctx.closePath();
}

function drawGrid() {
   //first begin path so that this will be removable later...
   ctx.beginPath();

   //Next, draw vertical lines
   ctx.moveTo(c.width/4,0);
   ctx.lineTo(c.width/4,c.height);
   ctx.moveTo(c.width/2,0);
   ctx.lineTo(c.width/2,c.height);
   ctx.moveTo(c.width*3/4,0);
   ctx.lineTo(c.width*3/4,c.height);
   ctx.strokeStyle="grey";
   ctx.stroke();

   //Then, horizontal lines
   ctx.moveTo(0,c.height/4);
   ctx.lineTo(c.width,c.height/4);
   ctx.moveTo(0,c.height/2);
   ctx.lineTo(c.width,c.height/2);
   ctx.moveTo(0,c.height*3/4);
   ctx.lineTo(c.width,c.height*3/4);
   ctx.stroke();
   ctx.closePath();

   //finally, add the values
   ctx.font="12px times";
   ctx.strokeText(parseFloat(cenR - currentRange/2).toFixed(3).toString(), c.width/4-c.width/20, 12);
   ctx.strokeText(parseFloat(cenR).toFixed(3).toString(),c.width/2+5,12);
   ctx.strokeText(parseFloat(cenR + currentRange/2).toFixed(3).toString(),3*c.width/4+5,12);

   var upperQuart = parseFloat(cenI + currentRange/2).toFixed(3).toString() + "i";
   var middle = parseFloat(cenI).toFixed(3).toString() + "i";
   var LowerQuart = parseFloat(cenI - currentRange/2).toFixed(3).toString() + "i";
   ctx.strokeText(upperQuart,c.width-(c.width/14),c.height/4-5);
   ctx.strokeText(middle,c.width-(c.width/14),c.height/2-5);
   ctx.strokeText(LowerQuart,c.width-(c.width/12),c.height*3/4-5);

}

var range = document.getElementById("range");
range.oninput = function() {
   document.getElementById("scale").innerHTML = "Zoom factor = " + document.getElementById("range").value;
   upDateZoomBox(newCenR,newCenI);
}

//this part will handle zooming, and call the draw_Mandlebrot function
document.getElementById("drawM").onclick = function() {
   //first update the currentRange variable, and cenR / cenI
   currentRange = currentRange * Math.pow(2,-(range.value));

   if (currentRange > MAX_ZOOM_OUT) {currentRange = MAX_ZOOM_OUT;}

   cenR = newCenR;
   cenI = newCenI;

   //call eraseReplace to get rid of of old grid coords and show new ones
   eraseReplace();

   //call draw_Mandlebrot
   draw_Mandlebrot();
}

document.getElementById("resetRange").onclick = function() {
   currentRange = MAX_ZOOM_OUT;
   cenR = 0;
   cenI = 0;

   newCenR = 0;
   newCenI = 0;

   eraseReplace();
}

function draw_Mandlebrot() {
   //first access the canvas, create a context, and image Object
   var mCanvas = document.getElementById("mandlebrot");
   var mCtx = mCanvas.getContext("2d");
   var mImageData = mCtx.getImageData(0,0,mCanvas.width,mCanvas.height);
   var width = mCanvas.width;
   var MaxIncs = MAX_ITERATIONS;

   //then loop through the pixels in the imageObject, and color them based on their number of escape iterations
   //call exapand_M() to calculate how many iterations to escape
   for(var i = 0; i < mImageData.data.length; i += 4) {
      //first, get pixel coords
      var X = (i/4) % width;
      var Y = ((i/4) - X)/width;

      //then get complex coords
      var R = (cenR - currentRange/2) + (X/width)*currentRange;
      var I = (cenI + currentRange/2) - (Y/width)*currentRange;

      //pass complex coords to exapand_M
      var incs_to_escape = exapand_M(R,I,MaxIncs);
      //console.log("At Pixel (" + X + ", " + Y + ")" + " it took " + incs_to_escape + " to escape.")

      //based on the outcome, paint the pixel black or white
      if (incs_to_escape < 0) {
         mImageData.data[i] = 0;
         mImageData.data[i+1] = 0;
         mImageData.data[i+2] = 0;
         mImageData.data[i+3] = 255;
      }
      if (incs_to_escape == 1) {
         mImageData.data[i] = 0;
         mImageData.data[i+1] = 0;
         mImageData.data[i+2] = 0;
         mImageData.data[i+3] = 255;
      }
      if (incs_to_escape > 1 && incs_to_escape <= 20) {
         mImageData.data[i] = 27;
         mImageData.data[i+1] = 44;
         mImageData.data[i+2] = 153;
         mImageData.data[i+3] = 255;
      }
      if (incs_to_escape > 20 && incs_to_escape <= 40) {
         mImageData.data[i] = 50;
         mImageData.data[i+1] = 109;
         mImageData.data[i+2] = 178;
         mImageData.data[i+3] = 255;
      }
      if (incs_to_escape > 40 && incs_to_escape <= 60) {
         mImageData.data[i] = 76;
         mImageData.data[i+1] = 172;
         mImageData.data[i+2] = 191;
         mImageData.data[i+3] = 255;
      }
      if (incs_to_escape > 60 && incs_to_escape <= 80) {
         mImageData.data[i] = 156;
         mImageData.data[i+1] = 255;
         mImageData.data[i+2] = 244;
         mImageData.data[i+3] = 255;
      }
      if (incs_to_escape >= 80) {
         mImageData.data[i] = 255;
         mImageData.data[i+1] = 255;
         mImageData.data[i+2] = 255;
         mImageData.data[i+3] = 255;
      }
   }
   mCtx.putImageData(mImageData,0,0)
}
function exapand_M(real,imaginary,MAX) {
   //returns -1 if point never "escapes", otherwise return number of iterations to escape
   var C = new ComplexNumber(real,imaginary);
   var Z = C.squared();
   var iterations = 1;
   while (iterations < MAX) {
      Zsquared = Z.squared();
      Z = Zsquared.plus(C)
      if (Z.magnitude() > 4) {
           return iterations;
      }
      iterations += 1;
   }
   return -1;
}
// interal functions
function eraseReplace() {
   ctx.clearRect(0,0,c.width,c.height);
   if (seeGrid) {
      drawGrid();
   }
}

//these functions turn complex components into pixel values
function RtranslateX(r) {
   return (r - (cenR - currentRange/2)) * Math.floor(c.width/currentRange);
}
function ItranslateY(i) {
   return (((cenI + currentRange/2) - i) * Math.floor(c.height/currentRange));
}
