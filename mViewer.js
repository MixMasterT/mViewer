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
   newCenR = e.pageX - c.offsetLeft;
   newCenI = e.pageY - c.offsetTop;

   upDateZoomBox(newCenR,newCenI);
}

function upDateZoomBox(XcenR,YcenI) {
   var scalFact = range.value;

   var newRange = currentRange * Math.pow(2,-scalFact);

   if (newRange > MAX_ZOOM_OUT) { newRange = MAX_ZOOM_OUT;}

   var pxRange = Math.floor(c.width * (newRange/currentRange));

   var pX = XcenR - pxRange/2;
   var pY = YcenI - pxRange/2;

   ctx.clearRect(0,0,c.width,c.height);
   if (seeGrid) {
      drawGrid();
   }

   ctx.beginPath();
   ctx.rect(pX,pY,pxRange,pxRange);
   ctx.strokeStyle="black";
   ctx.stroke();
   cts.closePath();
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
   ctx.strokeText((cenR - currentRange/2),c.width/4-14,12);
   ctx.strokeText(cenR,c.width/2+8,12);
   ctx.strokeText((cenR + currentRange/2),3*c.width/4+8,12);

   var upperQuart = (cenI + currentRange/2).toString() + "i";
   var middle = (cenI).toString() + "i";
   var LowerQuart = (cenI - currentRange/2).toString() + "i";
   ctx.strokeText(upperQuart,c.width-12,c.height/4-8);
   ctx.strokeText(middle,c.width-12,c.height/2-8);
   ctx.strokeText(LowerQuart,c.width-18,c.height*3/4);

}

var range = document.getElementById("range");
range.oninput = function() {
   document.getElementById("scale").innerHTML = "Zoom factor = " + document.getElementById("range").value;
   upDateZoomBox(newCenR,newCenI);
}
