// These constants effect perfomance and where the view goes when reset
// MAX_ZOOM_OUT reflects the total range in r  and i values
var MAX_ZOOM_OUT = 4; //Set this lower for a closer starting zoom
var MAX_ITERATIONS = 20; //Set this higher for more complex edges

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

}

document.getElementById("resetRange").onclick = function() {
   currentRange = MAX_ZOOM_OUT;
   cenR = 0;
   cenI = 0;

   newCenR = 0;
   newCenI = 0;

   eraseReplace();
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
