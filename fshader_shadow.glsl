#version 300 es
precision mediump float;

in vec4 pos;
out vec4 fColor;
uniform float maxDepth;
void main() {
    fColor = vec4(pos.z, pos.z, pos.z, 1);
    fColor.xyz /= maxDepth; //convert to be in range [0,1]
}