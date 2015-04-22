var c = document.getElementById("c");
var ctx = c.getContext('2d');
  
var MAX_ZOOM_OUT = 4;
var MAX_ITERATIONS = 50; //Set this higher for more complex edges

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
    
    Math.sqrt(this.r*this.r + this.i*this.i);
}
        
function updateZoombox(centerX, centerY) {
              
    var scalFact = document.getElementById("range").value;

    var newRange = currentRange * Math.pow(2,-scalFact);


    if (newRange > MAX_ZOOM_OUT) { newRange = MAX_ZOOM_OUT;}
            
    var pixRange = Math.floor(c.width * (newRange/currentRange));
        //console.log(pixRange);
        var pX = centerX - pixRange/2;
        var pY = centerY - pixRange/2;
    
    //Draw rectangle
        ctx.beginPath();
        ctx.rect(pX,pY, pixRange, pixRange);
        ctx.stroke();
        ctx.closePath();
}

//MAIN FUNCTION --> DRAW MANDLEBROT uses DOM to create additional canvas behind the zoomSelector
window.onload = function() {
    drawMandlebrot(MAX_ITERATIONS);
}
document.getElementById("drawM").onclick = function() {
    drawMandlebrot(MAX_ITERATIONS);
};

function expandM(real,imaginary){
    return -1;
}
function drawMandlebrot(max_depth){
    if (!mCanvas) {
        var mCanvas = document.getElementById("mandlebrot");
        var mCtx = mCanvas.getContext("2d");
        
        var mImageD = mCtx.getImageData(0,0,c.width,c.height);
        
    }
    //update rX and iY and current range based on the current bouding box configuration  
    var scalFact = document.getElementById("range").value;

    var newRange = currentRange * Math.pow(2,-scalFact);


    if (newRange > MAX_ZOOM_OUT) { newRange = MAX_ZOOM_OUT;}

    currentRange = newRange;
    
    rX = (rX - currentRange/2) + ((pxCenterX - c.offsetLeft)/c.width)*currentRange;
    iY = (currentRange/2 -iY) - ((pxCenterY - c.offsetTop)/c.height)*currentRange;   
 
    
    for(var i = 0; i < mImageD.data.length; i += 4){
        var pic = i/4;
        var picX = pic % mCanvas.width;
        var picY = (pic - picX)/mCanvas.width;
        
        var pR = (rX - currentRange/2) + ((picX - mCanvas.offsetLeft)/mCanvas.width)*currentRange;
        var pi = (currentRange/2 - iY) - ((picY - mCanvas.offsetTop)/mCanvas.innerHeight)*currentRange;
            
        var esc_val = expandM(pR,pi);
        
        if (esc_val < 1) {
            
            //set these according to mapped calculation
            mImageD.data[i] = 0;
            mImageD.data[i+1] = 0;
            mImageD.data[i+2] = 0;
            
        } else {
            mImageD.data[i] = 255;
            mImageD.data[i+1] = 255;
            mImageD.data[i+2] = 255;
        }
    }
}
