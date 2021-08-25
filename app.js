var canvas;
var gl;
var sun;
var flashlight;
var globalCamera;
var carCamera;
var skybox;
var car;
var camera;
var objects = [];

var useCarCamera = false;
var rollAmt = 0;
var pitchAmt = 0;
var yawAmt = 0;
var forwardAmt = 0;
var rightAmt = 0;
var xclip = 0;
var yclip = 0;

function mousedownHandler(event) {
	// Implementing picking
	xclip = 2 * (event.clientX/canvas.width) - 1.0;
	yclip = 1.0 - 2 * (event.clientY/canvas.height);
	var pfront = vec4(xclip, yclip, -1, 1);
	var pcam = mult(inverse(camera.getProjectionMatrix()), pfront);
	pcam[2] = -1;
	pcam[3] = 0;
	var pworld = mult(inverse(camera.getCameraMatrix()), pcam);
	var point = normalize(vec3(pworld[0], pworld[1], pworld[2]));
	var min_t = null;
	var min_object = null;
	objects.forEach(o => {
		var t = o.testCollision(point);
		if (t !== null && (min_t === null || t < min_t)) {
			min_t = t;
			min_object = o;
		}
	});
	if (min_object !== null) {
		min_object.onPick();
	}
}

function keydownHandler(event) {
   if (!event.metaKey) {
      switch (event.keyCode) {
         case 83: // s key
		    var dolphin = new Dolphin();
	        dolphin.setSize(0.01, 0.01, 0.01);
	        objects.push(dolphin);
            break;
         case 32: // Space key
         useCarCamera = !useCarCamera;
         if (useCarCamera) {
            camera = carCamera;
         }
         else {
            camera = globalCamera;
         }
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
   window.addEventListener("mousedown", mousedownHandler);
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
   camera = globalCamera;
   carCamera = new CarCamera();
   sun = new Light();
   sun.setLocation(0,0,10);
   sun.setAmbient(0.5, 0.5, 0.5);
   //sun.turnOff();
   flashlight = new Light();
   flashlight.setType(1);
   flashlight.setAmbient(1.0, 1.0, 1.0);
   var plane = new Plane(5);
   plane.setSize(10,1,10);
   objects.push(plane);
   //var sphere = new Sphere(4);
   //sphere.setSize(0.15,0.15,0.15);
   //sphere.setLocation(-0.5,0.15,0);
   //objects.push(sphere);
   //var cube = new Cube();
   //cube.setSize(0.1,0.1,0.1);
   //cube.setLocation(0.5,0.1,0);
   //objects.push(cube);
   car = new OBJLoader("models/cybertruck.obj", "textures/metal.jpg");
   car.setSize(0.001, 0.001, 0.001);
   car.setLocation(0,0.05,0);
   objects.push(car);
   for (var i = 0; i < 2; i++) {
	   var statue = new Statue();
	   var scale = Math.random()*(0.01 - 0.001) + 0.001;
	   statue.setSize(scale, scale, scale);
	   statue.setLocation(Math.random()*10 - 5, 0, Math.random()*10 - 5);
	   objects.push(statue);
   }
   for (var i = 0; i < 25; i++) {
	  var mountains;
      mountains = new Mountains(1);
      mountains.setSize(Math.random()*0.5 + 0.5, 1, Math.random()*0.5 + 0.5);
      mountains.setLocation(Math.random() + 9, -0.01, Math.random() * 20 - 10);
	  objects.push(mountains);
	  mountains = new Mountains(1);
      mountains.setSize(Math.random()*0.5 + 0.5, 1, Math.random()*0.5 + 0.5);
	  mountains.setLocation(Math.random() - 9, -0.01, Math.random() * 20 - 10);
	  objects.push(mountains);
	  mountains = new Mountains(1);
      mountains.setSize(Math.random()*0.5 + 0.5, 1, Math.random()*0.5 + 0.5);
	  mountains.setLocation(Math.random() * 20 - 10, -0.01, Math.random() + 9);
	  objects.push(mountains);
	  mountains = new Mountains(1);
      mountains.setSize(Math.random()*0.5 + 0.5, 1, Math.random()*0.5 + 0.5);
	  mountains.setLocation(Math.random() * 20 - 10, -0.01, Math.random() - 9);
      objects.push(mountains);
   }
   for (var i = 0; i < 5; i++) {
	   var dolphin = new Dolphin();
	   dolphin.setSize(0.01, 0.01, 0.01);
	   objects.push(dolphin);
   }
   var fiji = new Fiji();
   fiji.setSize(0.002, 0.002, 0.002);
   objects.push(fiji);
   skybox = new Skybox();
   render();
};

function render() {
   setTimeout(function() {
      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
      requestAnimationFrame(render);
      camera.update(forwardAmt, rightAmt, rollAmt, pitchAmt, yawAmt);
      var pos = camera.getPosition();
      flashlight.setLocation(pos[0], pos[1], pos[2]);
      var dir = camera.getDirection();
	  var dir2 = carCamera.getDirection();
	  flashlight.setDirection(dir2[0], 0, dir2[2]);
	  flashlight.setLocation(...car.getLocation());
	  if (useCarCamera) {
		car.setLocation(...add(car.getLocation(), mult(vec3(forwardAmt*0.1, 0, forwardAmt*0.1), dir)));
		car.updateRotationsDelta(0, -rightAmt*2, 0);
		var cameraRad = car.yrot * (2*Math.PI/360);
		camera.setPosition(...add(car.getLocation(), vec3(0.25 * Math.sin(cameraRad), 0.25, 0.25 * Math.cos(cameraRad))));
		camera.setAt(...add(car.getLocation(), vec3(0, 0.25, 0)));
		//camera.setAt(...car.getLocation());
	  }
      var cameraMat = camera.getCameraMatrix();
      var projMat = camera.getProjectionMatrix();
      gl.disable(gl.DEPTH_TEST);
      skybox.draw(camera, projMat);
      gl.enable(gl.DEPTH_TEST);
	  objects = objects.filter(o => !(o.canDelete));
	  objects.forEach(o => o.draw(cameraMat, projMat));
      gl.cullFace(gl.BACK);
   }, 10);
};
