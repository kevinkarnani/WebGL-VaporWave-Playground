class Fiji extends OBJLoader { 
   constructor(){
      super("models/fiji_water_bottle.obj", "textures/fiji.png");
	  this.y = 0;
	  this.x = Math.random()*20 - 10;
	  this.z = Math.random()*20 - 10;
	  this.initialRot = Math.random() * 360;
	  this.setYRotation(this.initialRot);
	  this.rot = 0;
	  this.setLocation(this.x, this.y, this.z);
   }
   draw(camera, projection) {
	  this.rot += 1;
	  this.rot %= 360;
	  this.y = 0.5 - 0.5*Math.cos(this.rot * (2*Math.PI/360));
	  this.setLocation(this.x, this.y, this.z);
	  this.setYRotation(this.initialRot + this.rot);
	  super.draw(camera, projection);
   }
}
