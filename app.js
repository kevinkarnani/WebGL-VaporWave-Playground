var canvas;
var gl;
var sun;
var flashlight;
var globalCamera;
var carCamera;
var skybox;
var car;
var objects = [];

var useCarCamera = false;
var rollAmt = 0;
var pitchAmt = 0;
var yawAmt = 0;
var forwardAmt = 0;
var rightAmt = 0;

function keydownHandler(event) {
   switch (event.keyCode) {
      case 83: // s key
         break;
      case 32: // Space key
	     useCarCamera = !useCarCamera;
         break;
      case 38: // Forward arrow
         forwardAmt = 1;
         break;
      case 40: // Backward arrow
         forwardAmt = -1;
         break;
      case 39: // Right arrow
         rightAmt = 1;
         break;
      case 37: // Left arrow
         rightAmt = -1;
         break;
      case 90: // z key
         if (event.shiftKey) {
            rollAmt = 1; // Counterclockwise
         } else {
            rollAmt = -1; // Clockwise
         }
         break;
      case 88: // x key
         if (event.shiftKey) {
            pitchAmt = -1; // Up
         } else {
            pitchAmt = 1; // Down
         }
         break;
      case 67: // c key
         if (event.shiftKey) {
            yawAmt = 1; // Counterclockwise
         } else {
            yawAmt = -1; // Clockwise
         }
         break;
   }
}

function keyupHandler(event) {
   switch (event.keyCode) {
      case 38: // Forward or backward arrow
      case 40:
         forwardAmt = 0;
         break;
      case 39:
      case 37: // Right or left arrow
         rightAmt = 0;
         break;
      case 90: // z key
         rollAmt = 0;
         break;
      case 88: // x key
         pitchAmt = 0;
         break;
      case 67: // c key
         yawAmt = 0;
         break;
   }
}

window.onload = function init(){
   window.addEventListener("keydown", keydownHandler);
   window.addEventListener("keyup", keyupHandler);
   canvas = document.getElementById( "gl-canvas" );
   // preserveDrawingBuffer allows for this to work on Chrome
   // Otherwise, the render buffer can get cleared between calls to draw()
   gl = canvas.getContext('webgl2', {preserveDrawingBuffer: true});
   if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

   gl.enable( gl.DEPTH_TEST );
   gl.viewport( 0, 0, canvas.width, canvas.height );
   gl.polygonOffset(1,1);
   gl.enable( gl.POLYGON_OFFSET_FILL );
   gl.clearColor( 0.9, 0.9, 0.9, 1.0 );
   gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
   
   globalCamera = new Camera();
   globalCamera.pitch(45);
   carCamera = new CarCamera();
   sun = new Light();
   sun.setLocation(0,1,0);
   sun.setAmbient(1.0, 1.0, 1.0);
   flashlight = new Light();
   flashlight.setType(1);
   flashlight.setAmbient(1.0, 1.0, 1.0);
   flashlight.turnOff();
   var plane = new Plane(5);
   plane.setSize(100,1,100);
   objects.push(plane);
   var sphere = new Sphere(4);
   sphere.setSize(0.15,0.15,0.15);
   sphere.setLocation(-0.5,0.15,0);
   objects.push(sphere);
   var cube = new Cube();
   cube.setSize(0.1,0.1,0.1);
   cube.setLocation(0.5,0.1,0);
   objects.push(cube);
   car = new OBJLoader("models/cybertruck.obj", "textures/metal.jpg");
   car.setSize(0.001, 0.001, 0.001);
   car.setLocation(0,0.05,0);
   objects.push(car);
   var mountains = new Mountains(1);
   mountains.setSize(0.5, 1, 0.5);
   mountains.setLocation(0, -0.01, 2);
   objects.push(mountains);
   skybox = new Skybox();
   render();
};

function render() {
   setTimeout(function() {
      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
      requestAnimationFrame(render);
	  var camera = globalCamera;
	  if (useCarCamera) {
		camera = carCamera;
	  }
      camera.update(forwardAmt, rightAmt, rollAmt, pitchAmt, yawAmt);
      var pos = camera.getPosition();
      flashlight.setLocation(pos[0], pos[1], pos[2]);
      var dir = camera.getDirection();
      flashlight.setDirection(dir[0], dir[1], dir[2]);
	  if (useCarCamera) {
		car.setLocation(...add(car.getLocation(), mult(vec3(forwardAmt*0.1, 0, forwardAmt*0.1), dir)));
		car.updateRotationsDelta(0, -rightAmt, 0);
	    camera.setAt(...car.getLocation());
		var cameraRad = car.yrot * (2*Math.PI/360);
		camera.setPosition(...add(car.getLocation(), vec3(1 * Math.sin(cameraRad), 0.5, 1 * Math.cos(cameraRad))));
	  }
      var cameraMat = camera.getCameraMatrix();
      var projMat = camera.getProjectionMatrix();
      gl.disable(gl.DEPTH_TEST);
      skybox.draw(camera, projMat);
      gl.enable(gl.DEPTH_TEST);
	  objects.forEach(o => o.draw(cameraMat, projMat));
      gl.cullFace(gl.BACK);
   }, 10);
};
