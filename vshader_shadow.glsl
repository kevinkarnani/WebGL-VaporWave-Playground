#version 300 es
in vec4 aPosition;
uniform mat4 modelMatrix;
uniform mat4 cameraMatrix;
uniform mat4 projMatrix;
out vec4 pos;
void main() {
   gl_Position = projMatrix * cameraMatrix * modelMatrix * aPosition;
   pos = gl_Position;
}