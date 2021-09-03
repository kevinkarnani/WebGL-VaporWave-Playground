#version 300 es
in vec3 aPosition;
uniform mat4 modelMatrix;
uniform mat4 cameraMatrix;
uniform mat4 projMatrix;
uniform vec4 uColor;

out vec4 vColor;

void main() {
    vec3 objectPos = aPosition;
    gl_Position = projMatrix * cameraMatrix * modelMatrix * vec4(objectPos, 1);
    vColor = uColor;
    gl_PointSize = 3.0;
}
