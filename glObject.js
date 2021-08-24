class glObject { 
   constructor(texture_path){
      //  Load shaders and initialize attribute buffers
      this.program = initShaders( gl, "/vshader.glsl", "/fshader.glsl" );
      gl.useProgram( this.program );
      
      this.modelMatrix = mat4();
      this.sizeMatrix = mat4();
      this.locationMatrix = mat4();
      this.rotationZMatrix = mat4();
      this.rotationYMatrix = mat4();
      this.rotationXMatrix = mat4();
      this.modelMatrixID = gl.getUniformLocation(this.program, "modelMatrix");
      this.cameraMatrixID = gl.getUniformLocation(this.program, "cameraMatrix");
      this.projectionMatrixID = gl.getUniformLocation(this.program, "projMatrix");

      this.specular = vec4(0.8, 0.8, 0.8, 1.0);
      this.diffuse = vec4(0.9, 0.9, 0.9, 1.0);
      this.ambient = vec4(0.8, 0.8, 0.8, 1.0);
      this.shininess = 80.0;

      this.useVertex = gl.getUniformLocation(this.program, "useVertex");
      
      this.lightPos1 = gl.getUniformLocation(this.program, "lightPos1");
      this.lightDir1 = gl.getUniformLocation(this.program, "lightDir1");
      this.lightDiff1 = gl.getUniformLocation(this.program, "lightDiffuse1");
      this.lightSpec1 = gl.getUniformLocation(this.program, "lightSpecular1");
      this.lightAmb1 = gl.getUniformLocation(this.program, "lightAmbient1");
      this.lightAlpha1 = gl.getUniformLocation(this.program, "lightAlpha1");
      this.lightCutoffAngle1 = gl.getUniformLocation(this.program, "lightCutoffAngle1");
      this.lightType1 = gl.getUniformLocation(this.program, "lightType1");
      this.lightOff1 = gl.getUniformLocation(this.program, "lightOff1");
  
      this.lightPos2 = gl.getUniformLocation(this.program, "lightPos2");
      this.lightDir2 = gl.getUniformLocation(this.program, "lightDir2");
      this.lightDiff2 = gl.getUniformLocation(this.program, "lightDiffuse2");
      this.lightSpec2 = gl.getUniformLocation(this.program, "lightSpecular2");
      this.lightAmb2 = gl.getUniformLocation(this.program, "lightAmbient2");
      this.lightAlpha2 = gl.getUniformLocation(this.program, "lightAlpha2");
      this.lightCutoffAngle2 = gl.getUniformLocation(this.program, "lightCutoffAngle2");
      this.lightType2 = gl.getUniformLocation(this.program, "lightType2");
      this.lightOff2 = gl.getUniformLocation(this.program, "lightOff2");

      this.matDiff = gl.getUniformLocation(this.program, "matDiffuse");
      this.matSpec = gl.getUniformLocation(this.program, "matSpecular");
      this.matAmb = gl.getUniformLocation(this.program, "matAmbient");
      this.matAlpha = gl.getUniformLocation(this.program, "matAlpha");
      
      this.useTexture = gl.getUniformLocation(this.program, "useTexture");
	  var TEXTURE = new Image();
      var self = this;
      TEXTURE.onload = function() {
         self.textureID = gl.createTexture();
         gl.bindTexture(gl.TEXTURE_2D, self.textureID);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE, TEXTURE);

         gl.generateMipmap(gl.TEXTURE_2D);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      }
      //this.textureUnit = gl.getUniformLocation(this.program, "textureUnit");
      TEXTURE.src = texture_path;
   }
   bindVertices() {
	  this.vID = gl.createBuffer();
      gl.bindBuffer( gl.ARRAY_BUFFER, this.vID );
      gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vPositions), gl.STATIC_DRAW );
      this.aPosition = gl.getAttribLocation(this.program, "aPosition" );

      // Vertex normals
      this.nID = gl.createBuffer();
      gl.bindBuffer( gl.ARRAY_BUFFER, this.nID );
      gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vNormals), gl.STATIC_DRAW );
      this.aNormal = gl.getAttribLocation( this.program, "aNormal" );
	  
	  this.tID = gl.createBuffer();
      gl.bindBuffer( gl.ARRAY_BUFFER, this.tID );
      gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vTexs), gl.STATIC_DRAW );
      this.aTexs = gl.getAttribLocation(this.program, "aTexs");
   }
   assignGouraudNormals() {
      var normalSum = [];
      var counts = [];

      for (var i = 0; i<this.numVertices; i++) {
         normalSum.push(vec3(0,0,0));
         counts.push(0);
      }

      for (var i = 0; i<this.numVertices; i++) {
         var count = 0;
         for (var j = 0; j<this.numVertices; j++) {
            if ((this.vPositions[i][0] == this.vPositions[j][0]) &&
               (this.vPositions[i][1] == this.vPositions[j][1]) &&
               (this.vPositions[i][2] == this.vPositions[j][2])) {
               count++;
               normalSum[i] = add(normalSum[i],this.vNormals[j]);
            }
         }
         counts[i] = count;
      }

      for (var i = 0; i<this.numVertices; i++) {
         this.vNormals[i] = mult(1.0/counts[i],normalSum[i]);
      }
   }
   draw(camera, projection) {
      gl.useProgram( this.program );

      //point the attributes to the buffer
      gl.bindBuffer( gl.ARRAY_BUFFER, this.vID );
      gl.vertexAttribPointer( this.aPosition, 4, gl.FLOAT, false, 0, 0 );
      gl.bindBuffer( gl.ARRAY_BUFFER, this.nID );
      gl.vertexAttribPointer( this.aNormal, 3, gl.FLOAT, false, 0, 0 );
	  gl.bindBuffer(gl.ARRAY_BUFFER, this.tID);
      gl.vertexAttribPointer( this.aTexs, 2, gl.FLOAT, false, 0, 0 );
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.textureID);
      gl.uniform1f(this.useVertex, 0.0);

      //adding in sun and flashlight
      gl.uniform4fv(this.lightPos1, sun.position);
      gl.uniform4fv(this.lightDir1, sun.direction);
      gl.uniform4fv(this.lightDiff1, sun.diffuse);
      gl.uniform4fv(this.lightSpec1, sun.specular);
      gl.uniform4fv(this.lightAmb1, sun.ambient);
      gl.uniform1f(this.lightAlpha1, sun.alpha);
      gl.uniform1f(this.lightCutoffAngle1, sun.cutoffAngle);
      gl.uniform1i(this.lightType1, sun.type);
      gl.uniform1i(this.lightOff1, sun.off);

      gl.uniform4fv(this.lightPos2, flashlight.position);
      gl.uniform4fv(this.lightDir2, flashlight.direction);
      gl.uniform4fv(this.lightDiff2, flashlight.diffuse);
      gl.uniform4fv(this.lightSpec2, flashlight.specular);
      gl.uniform4fv(this.lightAmb2, flashlight.ambient);
      gl.uniform1f(this.lightAlpha2, flashlight.alpha);
      gl.uniform1f(this.lightCutoffAngle2, flashlight.cutoffAngle);
      gl.uniform1i(this.lightType2, flashlight.type);
      gl.uniform1f(this.lightOff2, flashlight.off);

      gl.uniform1f(this.useTexture, 1.0);
      
      //material properties
      gl.uniform4fv(this.matSpec, this.specular);
      gl.uniform4fv(this.matDiff, this.diffuse);
      gl.uniform4fv(this.matAmb, this.ambient);
      gl.uniform1f(this.matAlpha, this.shininess);

      gl.uniformMatrix4fv(this.modelMatrixID, false, flatten(this.modelMatrix));
      gl.uniformMatrix4fv(this.cameraMatrixID, false, flatten(camera));
      gl.uniformMatrix4fv(this.projectionMatrixID, false, flatten(projection));

      //enable and draw!
      gl.enableVertexAttribArray(this.aPosition);
      gl.enableVertexAttribArray(this.aNormal);
	  gl.enableVertexAttribArray(this.aTexs);
      gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
	  gl.disableVertexAttribArray(this.aTexs);
      gl.disableVertexAttribArray(this.aNormal);
      gl.disableVertexAttribArray(this.aPosition);
   }
   updateModelMatrix() {
      var rotationMatrix = mult(this.rotationZMatrix, mult(this.rotationYMatrix, this.rotationXMatrix));
      this.modelMatrix = mult(this.locationMatrix, mult(this.sizeMatrix, rotationMatrix));
   }
   setLocation(x, y, z) {
      this.locationMatrix = translate(x,y,z); 
      this.updateModelMatrix();
   }
   setSize(x, y, z) {
      this.sizeMatrix = scale(x,y,z); 
      this.updateModelMatrix();
   }
   setZRotation(deg) {
      this.rotationZMatrix = rotateZ(deg); 
      this.updateModelMatrix();
   }
   setYRotation(deg) {
      this.rotationYMatrix = rotateY(deg);
      this.updateModelMatrix();
   }
   setXRotation(deg) {
      this.rotationXMatrix = rotateX(deg); 
      this.updateModelMatrix();
   }
}
