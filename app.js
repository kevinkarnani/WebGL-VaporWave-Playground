var canvas;
var gl;
var sun;
var flashlight;
var globalCamera;
var skybox;
var objects = [];

var useFlashlight = false;
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
         break;
      case 38: // Forward arrow
         forwardAmt = 0.01;
         break;
      case 40: // Backward arrow
         forwardAmt = -0.01;
         break;
      case 39: // Right arrow
         rightAmt = 0.01;
         break;
      case 37: // Left arrow
         rightAmt = -0.01;
         break;
      case 90: // z key
         if (event.shiftKey) {
            rollAmt = 0.5; // Counterclockwise
         } else {
            rollAmt = -0.5; // Clockwise
         }
         break;
      case 88: // x key
         if (event.shiftKey) {
            pitchAmt = -0.5; // Up
         } else {
            pitchAmt = 0.5; // Down
         }
         break;
      case 67: // c key
         if (event.shiftKey) {
            yawAmt = 0.5; // Counterclockwise
         } else {
            yawAmt = -0.5; // Clockwise
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
   sun = new Light();
   sun.setLocation(0,1,0);
   sun.setAmbient(1.0, 1.0, 1.0);
   flashlight = new Light();
   flashlight.setType(1);
   flashlight.setAmbient(1.0, 1.0, 1.0);
   var plane = new Plane(5);
   objects.push(plane);
   var sphere = new Sphere(4);
   sphere.setSize(0.15,0.15,0.15);
   sphere.setLocation(-0.2,0.15,0);
   objects.push(sphere);
   var cube = new Cube();
   cube.setSize(0.1,0.1,0.1);
   cube.setLocation(0.2,0.1,0);
   objects.push(cube);
   skybox = new Skybox();
   render();
};

function render() {
   setTimeout(function() {
      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
      requestAnimationFrame(render);
      globalCamera.moveForward(forwardAmt);
      globalCamera.moveRight(rightAmt);
      globalCamera.roll(rollAmt);
      globalCamera.pitch(pitchAmt);
      globalCamera.yaw(yawAmt);
      var pos = globalCamera.getPosition();
      flashlight.setLocation(pos[0], pos[1], pos[2]);
      var dir = globalCamera.getDirection();
      flashlight.setDirection(dir[0], dir[1], dir[2]);
      var cameraMat = globalCamera.getCameraMatrix();
      var projMat = globalCamera.getProjectionMatrix();
      gl.disable(gl.DEPTH_TEST);
      skybox.draw(globalCamera, projMat);
      gl.enable(gl.DEPTH_TEST);
	  objects.forEach(o => o.draw(cameraMat, projMat));
      gl.cullFace(gl.BACK);
   }, 10);
};
