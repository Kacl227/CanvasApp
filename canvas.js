var latestPoint = [];
var drawing = [];
var c;
var ctx;
var c2;
var ctx2;
var mode = null;
var draw = false;

function setUp(){
	c = document.getElementById("myc");
	ctx = c.getContext("2d");
	ctx.canvas.width = window.innerWidth * .8;
	ctx.canvas.height = window.innerHeight * .8;
	c2 = document.getElementById("myc2");
	ctx2 = c2.getContext("2d");
	ctx2.canvas.width = window.innerWidth * .8;
	ctx2.canvas.height = window.innerHeight * .8;
}

function displayCoords(event){
	var rect = c.getBoundingClientRect();
	document.getElementById("test").innerHTML = "Coords: " + (event.clientX - rect.left)
	+ " " + (event.clientY - rect.top );
	
	if ( draw ) {
		putCoords(event);
	}
}

function putCoords(event) {
	var rect = c.getBoundingClientRect();
	if ( draw )
		latestPoint.push([event.clientX - rect.left, event.clientY - rect.top]);
	else if ( event.type == "mousedown" )
		draw = true;
	switch(mode) {
		case "line":
			Line();
			break;
		case "circle":
			Circle();
			break;
		case "freedraw":
			FreeDraw();
			break;
		default:
			break;
	}
}

function Line() {
	if ( mode != "line" ){
		mode = "line";
	} else if ( latestPoint.length == 2 ){
		ctx2.clearRect( 0, 0, c2.width, c2.height );
		ctx2.beginPath();
		ctx2.moveTo(latestPoint[0][0], latestPoint[0][1]);
		ctx2.lineTo(latestPoint[1][0], latestPoint[1][1]);
		ctx2.stroke();
		latestPoint.pop();
	}
}

function turnOff() {
		latestPoint = [];
		draw = false;
		ctx.drawImage(c2, 0, 0);
		ctx2.clearRect( 0,0, c.width, c.height );
}

//Where a user clicks will be the radius of the circle.
	//added to latestPoint via mousedown
///As the user drags their mouse outwards or inwards, they will see the circle scale accordingly
	//on mousemove, clear previous rendering of circle and redraw for new selection
//The final position of the circle is where the user releases
	//on mouseup, draw to original canvas
function Circle() {
	if ( mode != "circle" ){
		mode = "circle";
	} else if ( latestPoint.length == 2){
		ctx2.clearRect( 0, 0, c2.width, c2.height );
		ctx2.beginPath();
		var radius = Math.sqrt( Math.pow( latestPoint[0][0] - latestPoint[1][0] ,2 )
		+ Math.pow( latestPoint[0][1] - latestPoint[1][1] ,2 ) );
		ctx2.arc( latestPoint[0][0], latestPoint[0][1], radius, 0, 2*Math.PI, true);
		ctx2.stroke();
		latestPoint.pop();
	}
}
function FreeDraw() {
  ctx.lineJoin = "round";
	if ( mode != "freedraw" ){
		mode = "freedraw";
	} else if (draw) {
		var len = latestPoint.length;
		if ( len == 1 ){
			ctx.beginPath();
			ctx.moveTo(latestPoint[0][0], latestPoint[0][1]);
		} else if ( len > 1 ){
		//draw line from each point in array to next point in array
			ctx.lineTo(latestPoint[len - 1][0], latestPoint[len - 1][1]);
			ctx.stroke();
			ctx.moveTo(latestPoint[len -1][0], latestPoint[len - 1][1]);
		}
	}
}
