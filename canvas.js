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
		this.numPoints = 0;
	}
	
	getNumPoints(){ return this.numPoints; }
	
	getXCoords(){ return this.XCoords; }
	
	getYCoords(){ return this.YCoords; }
	
	addPoint(event, rect){
		this.XCoords.push( event.clientX - rect.left );
		this.YCoords.push( event.clientY - rect.top );
		this.numPoints++;
	}
	
	removePoint(){
		this.XCoords.pop();
		this.YCoords.pop();
		this.numPoints--;
	}
	
	draw() {
		ctx.strokeStyle = this.color;
		window[this.variation]( this );
	}
}

function getLatest(){
	var len = shapes.length;
	return shapes[len - 1];
}

function setColor( colorS ){
	color = colorS;
}

function setMode( modeS ){
	mode = modeS;
}

function setUp(){
	c = document.getElementById("myc");
	ctx = c.getContext("2d");
	ctx.canvas.width = window.innerWidth * .8;
	ctx.canvas.height = window.innerHeight * .8;
}

function turnOff() {
		draw = false;
}

//Shows coordinates of mouse relative to left corner of canvas
function displayCoords(event){
	var rect = c.getBoundingClientRect();
	document.getElementById("test").innerHTML = "Coords: " + (event.clientX - rect.left)
	+ " " + (event.clientY - rect.top );
	if ( draw ) {
		if ( getLatest() && ( mode == "line" || mode == "circle" ) && getLatest().getNumPoints() == 2 ){
			getLatest().removePoint();
			ctx.clearRect( 0, 0, c.width, c.height );
			for ( var j = 0; j < shapes.length - 1; j++)
				shapes[j].draw();
		}
		putCoords(event);
	}
}

function putCoords(event) {
	if ( mode != null ) {
	var rect = c.getBoundingClientRect();
		ctx.strokeStyle = color;
		if ( event.type == "mousedown" ) {
			draw = true;
			shapes.push( new Shape( mode, [], [], color ));
		}
		getLatest().addPoint(event, rect);
		window[mode]();
	}
}

function line( shp = getLatest()) {
	for ( var i = 0; i < shp.getNumPoints(); i++ ){
		if ( i == 0 ) ctx.beginPath();
		else {
			ctx.moveTo(shp.getXCoords()[0], shp.getYCoords()[0]);
			ctx.lineTo(shp.getXCoords()[1], shp.getYCoords()[1]);
		}
	}
	ctx.stroke();
}

//Where a user clicks will be the radius of the circle.
	//added to latestPoint via mousedown
///As the user drags their mouse outwards or inwards, they will see the circle scale accordingly
	//on mousemove, clear previous rendering of circle and redraw for new selection
//The final position of the circle is where the user releases
	//on mouseup, draw to original canvas
function circle( shp = getLatest() ) {
	for ( var i = 0; i < shp.getNumPoints(); i++ ){
		if ( i == 0 ) ctx.beginPath();
		else {
			var radius = Math.sqrt( Math.pow( shp.getXCoords()[0] - shp.getXCoords()[1], 2 )
			+ Math.pow( shp.getYCoords()[0] - shp.getYCoords()[1] ,2 ) );
			ctx.arc( shp.getXCoords()[0], shp.getYCoords()[0], radius, 0, 2*Math.PI, true);
		}
	}
	ctx.stroke();
}

function freeDraw( shp = getLatest() ) {
  ctx.lineJoin = "round";
	for ( var i = 0; i < shp.getNumPoints(); i++ ){
		if ( i == 0 ){
			ctx.beginPath();
			ctx.moveTo(shp.getXCoords()[0], shp.getYCoords()[0]);
		} else {
		//draw line from each point in array to next point in array
			ctx.lineTo(shp.getXCoords()[i], shp.getYCoords()[i]);
			ctx.moveTo(shp.getXCoords()[i], shp.getYCoords()[i]);
		}
	}
	ctx.stroke();
}
