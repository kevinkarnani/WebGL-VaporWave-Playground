class Palm extends OBJLoader {
    constructor() {
        super("models/palm.obj", "textures/crystal.jpg");
        this.initialRot = Math.random() * 360;
        this.setYRotation(this.initialRot);
        this.rot = 0;
        this.pickable = true;
    }
}
