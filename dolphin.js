class Dolphin extends OBJLoader { 
   constructor(){
      super("models/dolphin.obj", "textures/water.jpg");
	  this.y = 0
	  this.x = Math.random()*20 - 10;
	  this.z = -10;
	  this.speed = Math.random()*0.1 + 0.05;
	  this.initialRot = Math.random() * 360;
	  this.setXRotation(this.initialRot);
	  this.rot = 0;
	  this.pickable = true;
	  this.setLocation(this.x, this.y, this.z);
   }
   draw(camera, projection) {
	  this.z += this.speed;
	  this.y = (-1.0/20.0) * (this.z * this.z) + 5;
	  this.rot += 5;
	  this.setLocation(this.x, this.y, this.z);
	  this.setXRotation(this.initialRot + this.rot);
	  if (this.z > 10) {
		  this.canDelete = true;
	  }
	   super.draw(camera, projection);
   }
}
