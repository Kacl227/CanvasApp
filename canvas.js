var latestPointX = [];
var latestPointY = [];
var shapes = [];
var c;
var ctx;
var mode = null;
var draw = false;
var color = "black";

class Shape {
	constructor( variation, XCoords, YCoords, shapeColor = "black", thickness = 1 ){
		this.variation = variation;
		this.XCoords = XCoords.slice();
		this.YCoords = YCoords.slice();
		this.color = shapeColor;
	}
	
	setColor( shapeColor ) {
		this.color = shapeColor;
	}
	
	draw() {
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		switch( this.variation ) {
			case "circle":
				var radius = Math.sqrt( Math.pow( this.XCoords[0] - this.XCoords[1], 2 ) + Math.pow( this.YCoords[0] - this.YCoords[1] ,2 ) );
				ctx.arc( this.XCoords[0], this.YCoords[0], radius, 0, 2*Math.PI, true);
				break;
			case "line":
				ctx.moveTo(this.XCoords[0], this.YCoords[0]);
				ctx.lineTo(this.XCoords[1], this.YCoords[1]);
				break;
			case "freeDraw":
				ctx.lineJoin = "round";
				ctx.moveTo(this.XCoords[0], this.YCoords[0]);
				var len = this.XCoords.length;
				for ( var i = 1; i < len; i++ ){
					ctx.lineTo(this.XCoords[i], this.YCoords[i]);
					ctx.moveTo(this.XCoords[i], this.YCoords[i]);
				}
				break;
		}
		ctx.stroke();
	}
}

function setColor( colorX ){
	color = colorX;
}

function setUp(){
	c = document.getElementById("myc");
	ctx = c.getContext("2d");
	ctx.canvas.width = window.innerWidth * .8;
	ctx.canvas.height = window.innerHeight * .8;
}

//Shows coordinates of mouse relative to left corner of canvas
function displayCoords(event){
	var rect = c.getBoundingClientRect();
	document.getElementById("test").innerHTML = "Coords: " + (event.clientX - rect.left)
	+ " " + (event.clientY - rect.top );
	if ( ( mode == "line" || mode == "circle" ) && latestPointX.length == 2 ){
		latestPointX.pop();
		latestPointY.pop();
	}
	if ( draw ) {
		putCoords(event);
	}
}

function putCoords(event) {
	var rect = c.getBoundingClientRect();
	if ( draw ) {
		latestPointX.push( event.clientX - rect.left );
		latestPointY.push( event.clientY - rect.top );
	}
	else if ( event.type == "mousedown" ) {
		draw = true;
	}
	switch(mode) {
		case "line":
			line();
			break;
		case "circle":
			circle();
			break;
		case "freeDraw":
			freeDraw();
			break;
		default:
			break;
	}
}

function line() {
	if ( mode != "line" ){
		mode = "line";
	} else if ( latestPointX.length == 2 ){
		ctx.clearRect( 0, 0, c.width, c.height );
		for ( var i = 0; i < shapes.length; i++ )
			shapes[i].draw();
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.moveTo(latestPointX[0], latestPointY[0]);
		ctx.lineTo(latestPointX[1], latestPointY[1]);
		ctx.stroke();
	}
}

function turnOff() {
		draw = false;
		shapes.push( new Shape( mode, latestPointX, latestPointY, color ));
		latestPointX = [];
		latestPointY = [];
}

//Where a user clicks will be the radius of the circle.
	//added to latestPoint via mousedown
///As the user drags their mouse outwards or inwards, they will see the circle scale accordingly
	//on mousemove, clear previous rendering of circle and redraw for new selection
//The final position of the circle is where the user releases
	//on mouseup, draw to original canvas
function circle() {
	if ( mode != "circle" ){
		mode = "circle";
	} else if ( latestPointX.length == 2){
		ctx.clearRect( 0, 0, c.width, c.height );
		for ( var i = 0; i < shapes.length; i++ )
			shapes[i].draw();
		ctx.beginPath();
		ctx.strokeStyle = color;
		var radius = Math.sqrt( Math.pow( latestPointX[0] - latestPointX[1], 2 )
		+ Math.pow( latestPointY[0] - latestPointY[1] ,2 ) );
		ctx.arc( latestPointX[0], latestPointY[0], radius, 0, 2*Math.PI, true);
		ctx.stroke();
	}
}
function freeDraw() {
  ctx.lineJoin = "round";
	if ( mode != "freeDraw" ){
		mode = "freeDraw";
	} else if (draw) {
		var len = latestPointX.length;
		if ( len == 1 ){
			ctx.beginPath();
			ctx.strokeStyle = color;
			ctx.moveTo(latestPointX[0], latestPointY[0]);
		} else if ( len > 1 ){
		//draw line from each point in array to next point in array
			ctx.lineTo(latestPointX[len - 1], latestPointY[len - 1]);
			ctx.moveTo(latestPointX[len -1], latestPointY[len - 1]);
		}
		ctx.stroke();
	}
}
