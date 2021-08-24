class Mountains extends glObject { 
   constructor(subdivs){
	  super("textures/vaporgrid.png");
	  this.numVertices = (4**(subdivs))*6;

      this.vPositions = [];
      this.vNormals = [];
      this.vTexs = [];
      this.build(subdivs);
	  this.bindVertices();
   }
   build(depth) {
      var a = vec4(-1.0,0.0,1.0,1.0);
      var b = vec4(1.0,0.0,1.0,1.0);
      var c = vec4(1.0,0.0,-1.0,1.0);
      var d = vec4(-1.0,0.0,-1.0,1.0);
	  this.heights = new Map();
      this.divideQuad(a,b,c,d,depth);
   }
   getRandomHeight() {
	   return Math.random() * 2;
   }
   divideQuad(a,b,c,d,depth) {
	  // Set random heights to vertices not on edges of mountains
      if(depth > 0) {
         var v1 = mult(0.5,add(a,b));
         v1[3] = 1.0;
         var v2 = mult(0.5,add(b,c));
         v2[3] = 1.0;
         var v3 = mult(0.5,add(c,d));
         v3[3] = 1.0;
         var v4 = mult(0.5,add(d,a));
         v4[3] = 1.0;
         var v5 = mult(0.5,add(a,c));
         v5[3] = 1.0;

         this.divideQuad(a, v1, v5, v4, depth-1);
         this.divideQuad(v1, b, v2, v5, depth-1);
         this.divideQuad(v2, c, v3, v5, depth-1);
         this.divideQuad(v3, d, v4, v5, depth-1);
      } else {
         this.triangles(a,b,c,d);
      }
   }
   triangles(a,b,c,d) {
      // First triangle
	  if (!this.heights.has(a)) {
		  this.heights.set(a, this.getRandomHeight());
	  }
	  if (!this.heights.has(b)) {
		  this.heights.set(b, this.getRandomHeight());
	  }
	  if (!this.heights.has(c)) {
		  this.heights.set(c, this.getRandomHeight());
	  }
	  if (!this.heights.has(d)) {
		  this.heights.set(d, this.getRandomHeight());
	  }
	  // Get random heights for non-edge vertices
	  if (Math.abs(a[0]) !== 1.0 && Math.abs(a[2]) !== 1.0) {
		a[1] = this.heights.get(a);
	  }
	  if (Math.abs(b[0]) !== 1.0 && Math.abs(b[2]) !== 1.0) {
		b[1] = this.heights.get(b);
	  }
	  if (Math.abs(c[0]) !== 1.0 && Math.abs(c[2]) !== 1.0) {
		c[1] = this.heights.get(c);
	  }
	  if (Math.abs(d[0]) !== 1.0 && Math.abs(d[2]) !== 1.0) {
		d[1] = this.heights.get(d);
	  }
      var a3 = vec3(a[0], a[1], a[2]);
      var b3 = vec3(b[0], b[1], b[2]);
      var c3 = vec3(c[0], c[1], c[2]);
      var d3 = vec3(d[0], d[1], d[2]);
      var N1 = normalize(cross(subtract(b3,a3), subtract(c3,a3)));
      this.vPositions.push(a);
      this.vNormals.push(N1);
      this.vTexs.push(vec2(0.0, 0.0));
      this.vPositions.push(b);
      this.vNormals.push(N1);
      this.vTexs.push(vec2(1.0, 0.0));
      this.vPositions.push(c);
      this.vNormals.push(N1);
      this.vTexs.push(vec2(1.0, 1.0));

      // Second triangle
      var N2 = normalize(cross(subtract(d3,c3), subtract(a3,c3)));
      this.vPositions.push(c);
      this.vNormals.push(N2);
      this.vTexs.push(vec2(0.0, 0.0));
      this.vPositions.push(d);
      this.vNormals.push(N2);
      this.vTexs.push(vec2(1.0, 1.0));
      this.vPositions.push(a);
      this.vNormals.push(N2);
      this.vTexs.push(vec2(0.0, 1.0));
   }
}
