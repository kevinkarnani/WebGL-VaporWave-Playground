#version 300 es
in vec3 aPosition;
uniform mat4 modelMatrix;
uniform mat4 cameraMatrix;
out vec4 vColor;

void main() {
    gl_Position = cameraMatrix * modelMatrix * vec4(aPosition, 1.0);
    vColor = vec4(0, 0, 0, 1);
}
