class Skybox { 
   constructor(){
      this.numVertices = 36;

      this.vPositions = [];
      this.build();

      //  Load shaders and initialize attribute buffers
      this.program = initShaders( gl, "/vshader_skybox.glsl", "/fshader_skybox.glsl" );
      gl.useProgram( this.program );
      this.textureUnit = gl.getUniformLocation(this.program, "textureUnit");
      this.modelMatrix = mat4();
      this.sizeMatrix = mat4();
      this.locationMatrix = mat4();
      this.rotationZMatrix = mat4();
      this.rotationYMatrix = mat4();
      this.rotationXMatrix = mat4();
      this.modelMatrixID = gl.getUniformLocation(this.program, "modelMatrix");
      this.cameraMatrixID = gl.getUniformLocation(this.program, "cameraMatrix");
      this.projectionMatrixID = gl.getUniformLocation(this.program, "projMatrix");

      this.vID = gl.createBuffer();
      gl.bindBuffer( gl.ARRAY_BUFFER, this.vID );
      gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vPositions), gl.STATIC_DRAW );
      this.aPosition = gl.getAttribLocation(this.program, "aPosition" );

      this.textureID = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.textureID);
      gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

      var self = this;
      var image1 = new Image();
      image1.onload = function(){
         gl.bindTexture(gl.TEXTURE_CUBE_MAP, self.textureID);
         gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image1);
      };
      image1.src = "textures/up.jpg";
      var image2 = new Image();
      image2.onload = function(){
         gl.bindTexture(gl.TEXTURE_CUBE_MAP, self.textureID);
         gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image2);
      };
      image2.src = "textures/down.jpg";
      var image3 = new Image();
      image3.onload = function(){
         gl.bindTexture(gl.TEXTURE_CUBE_MAP, self.textureID);
         gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image3);
      };
      image3.src = "textures/back.jpg";
      var image4 = new Image();
      image4.onload = function(){
         gl.bindTexture(gl.TEXTURE_CUBE_MAP, self.textureID);
         gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image4);
      };
      image4.src = "textures/left.jpg";
      var image5 = new Image();
      image5.onload = function(){
         gl.bindTexture(gl.TEXTURE_CUBE_MAP, self.textureID);
         gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image5);
      };
      image5.src = "textures/front.jpg";
      var image6 = new Image();
      image6.onload = function(){
         gl.bindTexture(gl.TEXTURE_CUBE_MAP, self.textureID);
         gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image6);
      };
      image6.src = "textures/right.jpg";
   }
   build() {
      var vertices = [
         vec3(-1,-1,1),
         vec3(-1,1,1),
         vec3(1,1,1),
         vec3(1,-1,1),
         vec3(-1,-1,-1),
         vec3(-1,1,-1),
         vec3(1,1,-1),
         vec3(1,-1,-1),
      ];
      var indices = [
         0,3,2,
         0,2,1,
         2,3,7,
         2,7,6,
         0,4,7,
         0,7,3,
         1,2,6,
         1,6,5,
         4,5,6,
         4,6,7,
         0,1,5,
         0,5,4
      ];
      for (var i=0; i<indices.length; i+=3) {
         this.triangle(vertices[indices[i]], vertices[indices[i+1]], vertices[indices[i+2]]);
      }
   }
   triangle(a,b,c) {
      this.vPositions.push(vec4(a[0],a[1],a[2],1.0));
      this.vPositions.push(vec4(b[0],b[1],b[2],1.0));
      this.vPositions.push(vec4(c[0],c[1],c[2],1.0));
   }
   draw(camera, projection) {
      var c = lookAt(vec3(0,0,0), subtract(vec3(0,0,0), camera.n), camera.v);
      gl.useProgram( this.program );

      //point the attributes to the buffer
      gl.bindBuffer( gl.ARRAY_BUFFER, this.vID );
      gl.vertexAttribPointer( this.aPosition, 4, gl.FLOAT, false, 0, 0 );
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.textureID);
      gl.uniform1i(this.textureUnit, 0);

      gl.uniformMatrix4fv(this.modelMatrixID, false, flatten(this.modelMatrix));
      gl.uniformMatrix4fv(this.cameraMatrixID, false, flatten(c));
      gl.uniformMatrix4fv(this.projectionMatrixID, false, flatten(projection));

      //enable and draw!
      gl.enableVertexAttribArray(this.aPosition);
      gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
      gl.disableVertexAttribArray(this.aPosition);
   }
}
