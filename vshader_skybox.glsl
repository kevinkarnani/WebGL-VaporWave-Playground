#version 300 es
precision mediump float;

in vec4 aPosition;
out vec3 texCoord;

uniform mat4 modelMatrix;
uniform mat4 cameraMatrix;
uniform mat4 projMatrix;

void main()
{
   texCoord = normalize(aPosition.xyz);
   gl_Position = projMatrix*cameraMatrix*modelMatrix*aPosition;
}

