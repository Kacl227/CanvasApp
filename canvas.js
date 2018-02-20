var latestPoint = [];
var c;
var ctx;
var mode = null;
var draw = false;

function setUp(){
	c = document.getElementById("myc");
	ctx = c.getContext("2d");
	ctx.canvas.width = window.innerWidth * .8;
	ctx.canvas.height = window.innerHeight * .8;
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
	if ( ( event.type == "click" && mode != "freedraw" ) || draw)
		latestPoint.push([event.clientX - rect.left, event.clientY - rect.top]);
	else if ( event.type == "mousedown" && mode == "freedraw" )
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
		latestPoint = [];
	} else if ( latestPoint.length == 2 ){
		ctx.beginPath();
		ctx.moveTo(latestPoint[0][0], latestPoint[0][1]);
		ctx.lineTo(latestPoint[1][0], latestPoint[1][1]);
		ctx.stroke();
		latestPoint = [];
	}
}

function turnOff() {
	if ( mode == "freedraw" ) {
		latestPoint = [];
		draw = false;
	}
}

function Circle() {
	if ( mode != "circle" ){
		mode = "circle";
		latestPoint = [];
	} else if ( latestPoint.length == 2){
		ctx.beginPath();
		var radius = Math.sqrt( Math.pow( latestPoint[0][0] - latestPoint[1][0] ,2 )
		+ Math.pow( latestPoint[0][1] - latestPoint[1][1] ,2 ) );
		ctx.arc( latestPoint[0][0], latestPoint[0][1], radius, 0, 2*Math.PI, true);
		ctx.stroke();
		latestPoint = [];
	}
}
function FreeDraw() {
  ctx.lineJoin = "round";
	if ( mode != "freedraw" ){
		mode = "freedraw";
	} else if (draw) {
		if ( latestPoint.length == 1 ){
			ctx.beginPath();
			ctx.moveTo(latestPoint[0][0], latestPoint[0][1]);
		}
		//draw line from each point in array to next point in array
		for ( var i = 1; i < latestPoint.length; i++ ){
			ctx.moveTo(latestPoint[i-1][0],latestPoint[i-1][1]);
			ctx.lineTo(latestPoint[i][0], latestPoint[i][1]);
			ctx.stroke();
		}
	}
}
