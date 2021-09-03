var canvas;
var gl;
var sun;
var flashlight;
var globalCamera;
var carCamera;
var skybox;
var car;
var camera;
var cylinder;
var base;
var pyramid;
var ps;
var objects = [];
var shadowFrameBuffer;
var shadowRenderBuffer;

var sdtSize = 1024;
var maxDepth = 100.0;
var useCarCamera = false;
var rollAmt = 0;
var pitchAmt = 0;
var yawAmt = 0;
var forwardAmt = 0;
var rightAmt = 0;
var xclip = 0;
var yclip = 0;
var sunAngle = 0;

function mousedownHandler(event) {
    // Implementing picking
    xclip = 2 * (event.clientX / canvas.width) - 1.0;
    yclip = 1.0 - 2 * (event.clientY / canvas.height);
    var pfront = vec4(xclip, yclip, -1, 1);
    var pcam = mult(inverse(camera.getProjectionMatrix()), pfront);
    pcam[2] = -1;
    pcam[3] = 0;
    var pworld = mult(inverse(camera.getCameraMatrix()), pcam);
    var point = normalize(vec3(pworld[0], pworld[1], pworld[2]));
    var min_t = null;
    var min_object = null;
    objects.forEach((o) => {
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
                } else {
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

window.onload = function init() {
    window.addEventListener("keydown", keydownHandler);
    window.addEventListener("keyup", keyupHandler);
    window.addEventListener("mousedown", mousedownHandler);
    canvas = document.getElementById("gl-canvas");
    // preserveDrawingBuffer allows for this to work on Chrome
    // Otherwise, the render buffer can get cleared between calls to draw()
    gl = canvas.getContext("webgl2", {
        preserveDrawingBuffer: true
    });
    if (!gl) {
        alert("WebGL 2.0 isn't available");
    }

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.polygonOffset(1, 1);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


    globalCamera = new Camera();
    globalCamera.moveForward(8);
    globalCamera.moveRight(3);
    globalCamera.yaw(180);
    camera = globalCamera;
    camera.updateCamMatrix();
    carCamera = new CarCamera();
    sun = new Light();
    sun.setLocation(0, 5, 20);
    sun.setAmbient(0.7, 0.7, 0.7);
    flashlight = new Light();
    flashlight.setType(1);
    flashlight.setAmbient(1.0, 1.0, 1.0);
    var plane = new Plane(5);
    plane.setSize(10, 1, 10);
    objects.push(plane);
    for (var i = 0; i < 3; i++) {
        base = new Cube();
        base.setSize(2.35 - 0.05 * i, 0.05, 2.35 * 2 - 0.05 * i);
        base.setLocation(0.5 + 0.5 * 4, 0.05 * (i + 1), 0 + 0.5 * 8.5);
        objects.push(base);
    }
    for (var i = 0; i < 9; i++) {
        // top left to top right
        cylinder = new Cylinder();
        cylinder.setSize(0.2, 2.4, 0.2);
        cylinder.setLocation(0.5 + 0.5 * i, 1.4, 0);
        //cylinder.translate()
        objects.push(cylinder);
        // bottom right to bottom left
        cylinder = new Cylinder();
        cylinder.setSize(0.2, 2.4, 0.2);
        cylinder.setLocation(0.5 + 0.5 * i, 1.4, 8.5);
        objects.push(cylinder);
    }

    for (var i = 0; i < 17; i++) {
        // top right to bottom right
        cylinder = new Cylinder();
        cylinder.setSize(0.2, 2.4, 0.2);
        cylinder.setLocation(4.5, 1.4, 0 + 0.5 * i);
        objects.push(cylinder);
        // top left to bottom left
        cylinder = new Cylinder();
        cylinder.setSize(0.2, 2.4, 0.2);
        cylinder.setLocation(0.5, 1.4, 0 + 0.5 * i);
        objects.push(cylinder);
    }

    pyramid = new Pyramid();
    pyramid.setLocation(0.5 + 0.5 * 4, 2.6, 0 + 0.5 * 8.5);
    pyramid.setSize(2.35, 1.5, 2.35 * 2);
    objects.push(pyramid);

    var statue = new Statue();
    statue.setLocation(0.5 + 0.5 * 4, 0.05 * 4, 0 + 0.5 * 8.5);
    statue.setSize(0.008, 0.008, 0.008);
    objects.push(statue);

    car = new OBJLoader("models/cybertruck.obj", "textures/metal.jpg");
    car.setSize(0.001, 0.001, 0.001);
    car.setLocation(0, 0.05, 0);
    car.reflect = true;
    var cameraRad = car.yrot * ((2 * Math.PI) / 360);
    carCamera.setPosition(
        ...add(
            car.getLocation(),
            vec3(-0.25 * Math.sin(cameraRad), 0.25, -0.25 * Math.cos(cameraRad))
        )
    );
    carCamera.setAt(...add(car.getLocation(), vec3(0, 0.25, 0)));
    objects.push(car);
    for (var i = 0; i < 25; i++) {
        var mountains;
        mountains = new Mountains(1);
        mountains.setSize(
            Math.random() * 0.5 + 0.5,
            1,
            Math.random() * 0.5 + 0.5
        );
        mountains.setLocation(
            Math.random() + 9,
            -0.01,
            Math.random() * 20 - 10
        );
        objects.push(mountains);
        mountains = new Mountains(1);
        mountains.setSize(
            Math.random() * 0.5 + 0.5,
            1,
            Math.random() * 0.5 + 0.5
        );
        mountains.setLocation(
            Math.random() - 9,
            -0.01,
            Math.random() * 20 - 10
        );
        objects.push(mountains);
        mountains = new Mountains(1);
        mountains.setSize(
            Math.random() * 0.5 + 0.5,
            1,
            Math.random() * 0.5 + 0.5
        );
        mountains.setLocation(
            Math.random() * 20 - 10,
            -0.01,
            Math.random() + 9
        );
        objects.push(mountains);
        mountains = new Mountains(1);
        mountains.setSize(
            Math.random() * 0.5 + 0.5,
            1,
            Math.random() * 0.5 + 0.5
        );
        mountains.setLocation(
            Math.random() * 20 - 10,
            -0.01,
            Math.random() - 9
        );
        objects.push(mountains);
    }
    for (var i = 0; i < 5; i++) {
        var dolphin = new Dolphin();
        dolphin.setSize(0.01, 0.01, 0.01);
        objects.push(dolphin);
    }
    for (var i = 0; i < 10; i++) {
        var fiji = new Fiji();
        objects.push(fiji);
    }
    for (var i = 0; i < 10; i++) {
        var palm = new Palm();
        palm.setSize(0.3, 0.3, 0.3);
        palm.setLocation(Math.random() * -5, 0, Math.random() * 10 - 5);
        objects.push(palm);
    }
    for (var i = 0; i < 10; i++) {
        var palm = new Palm();
        palm.setSize(0.3, 0.3, 0.3);
        palm.setLocation(Math.random() * 5 + 5, 0, Math.random() * 10 - 5);
        objects.push(palm);
    }
    for (var i = 0; i < 10; i++) {
        var palm = new Palm();
        palm.setSize(0.3, 0.3, 0.3);
        palm.setLocation(Math.random() * 5, 0, Math.random() * -5);
        objects.push(palm);
    }
    ps = new ParticleSystem();
    skybox = new Skybox();
    shadowFrameBuffer = gl.createFramebuffer();
    shadowFrameBuffer.width = sdtSize;
    shadowFrameBuffer.height = sdtSize;
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFrameBuffer);
    shadowRenderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, shadowRenderBuffer);
    gl.renderbufferStorage(
        gl.RENDERBUFFER,
        gl.DEPTH_COMPONENT16,
        sdtSize,
        sdtSize
    );
    gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.DEPTH_ATTACHMENT,
        gl.RENDERBUFFER,
        shadowRenderBuffer
    );
    sun.depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, sun.depthTexture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        sdtSize,
        sdtSize,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
    );
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); //restore to window frame/depth buffer
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    render();
};

function renderShadowMaps() {
	var viewportParams = gl.getParameter(gl.VIEWPORT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFrameBuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, shadowRenderBuffer);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, sun.depthTexture);
	gl.viewport(0, 0, sdtSize, sdtSize);
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        sun.depthTexture,
        0
    );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    ps.updateSystem();
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].shadow) {
            objects[i].drawToShadowMap(perspective(
            90,
            canvas.width / canvas.height,
            0.1,
            100
        ));
        }
    }
	gl.viewport(
            viewportParams[0],
            viewportParams[1],
            viewportParams[2],
            viewportParams[3]
        );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); //return to screens buffers
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	//base.textureID = sun.depthTexture;
	//gl.activeTexture(gl.TEXTURE0);
    //gl.bindTexture(gl.TEXTURE_2D, sun.depthTexture);
}

function render() {
    setTimeout(function () {
        //gl.cullFace(gl.FRONT);
        //sunAngle += .001;
        //sun.setLocation(0, 20 * Math.sin(sunAngle), 20 * Math.cos(sunAngle));
        renderShadowMaps();
        gl.cullFace(gl.BACK);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        requestAnimationFrame(render);
        camera.update(forwardAmt, rightAmt, rollAmt, pitchAmt, yawAmt);
        var dir = camera.getDirection();
        var dir2 = carCamera.getDirection();
        flashlight.setDirection(dir2[0], 0, dir2[2]);
        flashlight.setLocation(...car.getLocation());
        if (useCarCamera) {
            car.setLocation(
                ...add(
                    car.getLocation(),
                    mult(vec3(forwardAmt * 0.5, 0, forwardAmt * 0.5), dir)
                )
            );
            car.updateRotationsDelta(0, -rightAmt * 2, 0);
            var cameraRad = car.yrot * ((2 * Math.PI) / 360);
            camera.setPosition(
                ...add(
                    car.getLocation(),
                    vec3(
                        -0.25 * Math.sin(cameraRad),
                        0.25,
                        -0.25 * Math.cos(cameraRad)
                    )
                )
            );
            camera.setAt(...add(car.getLocation(), vec3(0, 0.25, 0)));
        }
        var cameraMat = camera.getCameraMatrix();
        var projMat = camera.getProjectionMatrix();
        gl.disable(gl.DEPTH_TEST);
        skybox.draw(camera, projMat);
        gl.enable(gl.DEPTH_TEST);
        ps.draw(cameraMat, projMat)
        objects = objects.filter(o => !o.canDelete);
        objects.forEach(o => o.draw(cameraMat, projMat));
        gl.cullFace(gl.BACK);
    }, 10);
}
