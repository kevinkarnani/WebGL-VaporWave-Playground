class Fiji extends OBJLoader { 
   constructor(){
      super("models/fiji_water_bottle.obj", "textures/fiji.png");
	  this.y = 0;
	  this.x = Math.random()*20 - 10;
	  this.z = Math.random()*20 - 10;
	  this.initialRot = Math.random() * 360;
	  this.setYRotation(this.initialRot);
	  this.rot = 0;
	  this.scale = 0.002;
	  this.scaleRot = 0;
	  this.setSize(this.scale, this.scale, this.scale);
	  this.setLocation(this.x, this.y, this.z);
	  this.pickable = true;
   }
   draw(camera, projection) {
	  this.rot += 1;
	  this.rot %= 360;
	  this.y = 0.5 - 0.5*Math.cos(this.rot * (2*Math.PI/360));
	  this.setLocation(this.x, this.y, this.z);
	  this.setYRotation(this.initialRot + this.rot);
	  if (this.picked) {
		  this.scaleRot += 1;
		  this.scaleRot %= 360;
		  this.scale = 0.002 + 0.002*(Math.sin(this.scaleRot * (2*Math.PI/360)));
		  this.setSize(this.scale, this.scale, this.scale);
		  if (this.scale === 0.002) {
			  this.picked = false;
		  }
	  }
	  super.draw(camera, projection);
   }
}
