#version 300 es
in vec3 aPosition;
in vec3 aVelocity;

uniform float time;
uniform mat4 modelMatrix;
uniform mat4 cameraMatrix;
uniform mat4 projMatrix;
uniform vec4 uColor;

out vec4 vcolor;

void main() {
    vec3 objectPos = aPosition + aVelocity * time;
    gl_Position = projMatrix * cameraMatrix * modelMatrix * vec4(objectPos, 1);
    vcolor = uColor;
}