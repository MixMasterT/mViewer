        
var c = document.getElementById("c");
var ctx = c.getContext('2d');
        
var MAX_ZOOM_OUT = 4;
var currentRange = MAX_ZOOM_OUT; //initialize to full view of Mandlebrot
var pxCenterX = c.width/2;
var pxCenterY = c.height/2;

document.getElementById("range").oninput = function() {
    document.getElementById("scale").innerHTML = "Zoom factor = " + document.getElementById("range").value;
    updateZoombox(pxCenterX,pxCenterY);
}
        
function updateZoombox(centerX, centerY) {
            
    //first get rid of the old rectangle
    ctx.clearRect(0,0,c.width,c.height);
    
    var scalFact = document.getElementById("range").value;

    var newRange = currentRange * Math.pow(2,-scalFact);


    if (newRange > MAX_ZOOM_OUT) { newRange = MAX_ZOOM_OUT;}
            
    var pixRange = Math.floor(c.width * (newRange/currentRange));
        console.log(pixRange);
        var pX = centerX - pixRange/2;
        var pY = centerY - pixRange/2;
        ctx.rect(pX,pY, pixRange, pixRange);
        ctx.stroke();
}