class Camera {
    constructor() {
        this.camera_matrix = mat4();
        this.eye = vec3(0, 1, 1);
        this.u = vec3(1, 0, 0);
        this.v = vec3(0, 1, 0);
        this.n = vec3(0, 0, 1);
        this.project_matrix = perspective(
            45,
            canvas.width / canvas.height,
            0.1,
            100
        );
    }

    getPosition() {
        return this.eye;
    }

    getDirection() {
        return mult(-1.0, this.n);
    }

    update(forward, right, roll, pitch, yaw) {
        this.moveForward(forward * 0.1);
        this.moveRight(right * 0.1);
        this.roll(roll * 1);
        this.pitch(pitch * 1);
        this.yaw(yaw * 1);
    }

    getCameraMatrix() {
        return this.camera_matrix;
    }

    getProjectionMatrix() {
        return this.project_matrix;
    }

    moveForward(amt) {
        this.eye = add(this.eye, mult(-amt, this.n));
        this.updateCamMatrix();
    }

    moveRight(amt) {
        this.eye = add(this.eye, mult(amt, this.u));
        this.updateCamMatrix();
    }

    // Rotate around u (x) (counterclockwise)
    pitch(amt) {
        var angle = radians(amt);

        var vp = subtract(
            mult(Math.cos(angle), this.v),
            mult(Math.sin(angle), this.n)
        );
        var np = add(
            mult(Math.sin(angle), this.v),
            mult(Math.cos(angle), this.n)
        );

        this.v = normalize(vp);
        this.n = normalize(np);
        this.updateCamMatrix();
    }

    // Rotate around n (z) (counterclockwise)
    roll(amt) {
        var angle = radians(amt);

        var up = subtract(
            mult(Math.cos(angle), this.u),
            mult(Math.sin(angle), this.v)
        );
        var vp = add(
            mult(Math.sin(angle), this.u),
            mult(Math.cos(angle), this.v)
        );

        this.u = normalize(up);
        this.v = normalize(vp);
        this.updateCamMatrix();
    }

    // Rotate around v (y) (counterclockwise)
    yaw(amt) {
        var angle = radians(amt);

        var up = add(
            mult(Math.cos(angle), this.u),
            mult(Math.sin(angle), this.n)
        );
        var np = subtract(
            mult(Math.cos(angle), this.n),
            mult(Math.sin(angle), this.u)
        );

        this.u = normalize(up);
        this.n = normalize(np);
        this.updateCamMatrix();
    }

    updateCamMatrix() {
        this.camera_matrix = lookAt(
            this.eye,
            subtract(this.eye, this.n),
            this.v
        );
    }
}
