var c = document.getElementById("c");
var ctx = c.getContext('2d');
  
var MAX_ZOOM_OUT = 4;

var pxCenterX = c.width/2;
var pxCenterY = c.height/2;

//initialize to full view of Mandlebrot centered on [0,0i]
var currentRange = MAX_ZOOM_OUT; 
var rX = 0;
var iY = 0;

document.getElementById("range").oninput = function() {
    document.getElementById("scale").innerHTML = "Zoom factor = " + document.getElementById("range").value;
        //first get rid of the old rectangle
    ctx.clearRect( 0 , 0 , c.width , c.height );
    updateZoombox(pxCenterX,pxCenterY);
}

document.getElementById("c").onmousemove = function(e) {
    // update displayed value for r and i:
    var newR = (rX - currentRange/2) + ((e.pageX - c.offsetLeft)/c.width)*currentRange;
    var newi = (currentRange/2 -iY) - ((e.pageY - c.offsetTop)/c.height)*currentRange;
    document.getElementById("zoomCenter").innerHTML = "Zoom center: r = " + parseFloat(newR).toFixed(3) + " , i = " + parseFloat(newi).toFixed(3)  ;
    
}

document.getElementById("c").onclick = function(e) {    
    // update the center for the Zoom box.
    pxCenterX = e.pageX - c.offsetLeft;
    pxCenterY = e.pageY - c.offsetTop;
    
    
    //then redraw the box
    ctx.clearRect(0,0,c.width,c.height);
    updateZoombox(pxCenterX,pxCenterY);
}
        
function updateZoombox(centerX, centerY) {
              
    var scalFact = document.getElementById("range").value;

    var newRange = currentRange * Math.pow(2,-scalFact);


    if (newRange > MAX_ZOOM_OUT) { newRange = MAX_ZOOM_OUT;}
            
    var pixRange = Math.floor(c.width * (newRange/currentRange));
        console.log(pixRange);
        var pX = centerX - pixRange/2;
        var pY = centerY - pixRange/2;
    
    //Draw rectangle
        ctx.beginPath();
        ctx.rect(pX,pY, pixRange, pixRange);
        ctx.stroke();
        ctx.closePath();
}

//MAIN FUNCTION --> DRAW MANDLEBROT uses DOM to create additional canvas behind the zoomSelector
//document.getElementById("