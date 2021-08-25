class Statue extends OBJLoader { 
   constructor(){
      super("models/statue.obj", "textures/pinkmarble.jpg");
	  this.initialRot = Math.random() * 360;
	  this.setYRotation(this.initialRot);
	  this.rot = 0;
	  this.pickable = true;
   }
   draw(camera, projection) {
	  if (this.picked) {
		  this.rot += 1;
		  this.setYRotation(this.initialRot + this.rot);
		  if (this.rot === 360) {
			this.rot = 0;
			this.picked = false;
		  }
	  }
	  super.draw(camera, projection);
   }
}
