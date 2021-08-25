class Dolphin extends OBJLoader { 
   constructor(){
      super("models/dolphin.obj", "textures/water.jpg");
	  this.y = Math.random() * 5;
	  this.x = Math.random()*20 - 10;
	  this.z = Math.random()*20 - 10;
	  this.initialRot = Math.random() * 360;
	  this.setXRotation(this.initialRot);
	  this.rot = 0;
	  this.pickable = true;
	  this.setLocation(this.x, this.y, this.z);
   }
   draw(camera, projection) {
	   if (this.picked) {
	  this.y -= 0.01;
	  this.rot += 1;
	  this.setLocation(this.x, this.y, this.z);
	  this.setXRotation(this.initialRot + this.rot);
	  if (this.y < 0) {
		  this.canDelete = true;
	  }
	   }
	   super.draw(camera, projection);
   }
}
