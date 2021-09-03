#version 300 es
precision mediump float;

in vec3 texCoord;
uniform samplerCube textureUnit;
uniform bool useDistort;
uniform float time;
out vec4 fColor;

vec4 scanLine(float uv, float res, float opacity) {
   float intensity = sin(uv * res * 3.1415 * 2.0);
   intensity = ((0.5 * intensity) + 0.5) * 0.9 + 0.1;
   return vec4(vec3(pow(intensity, opacity)), 1.0);
}

void main() {
   fColor = texture(textureUnit, texCoord);
   fColor.a = 1.0;
   if(useDistort) {
      fColor *= scanLine(gl_FragCoord.x, 4200.0, 0.1);
      fColor *= scanLine(gl_FragCoord.y, 4200.0, 0.1);
      vec2 p = (3.0 * gl_FragCoord.xy - 800.0) / 800.0;
      for(int i = 1; i < 22; i++) {
         vec2 newp = p;
         newp.x += 0.65 / float(i) * sin(float(i) * p.y + time / 20.0 + 0.3 * float(i));
         newp.y += 0.65 / float(i) * sin(float(i) * p.x + time / 10.0 + 0.3 * float(i + 10)) + 15.0;
         p = newp;
      }
      vec3 col = vec3(0.5 * sin(4.0 * p.x) + 0.5, 0.5 * sin(3.0 * p.y) + 0.5, sin(p.x + p.y));
      fColor = mix(fColor, vec4(col, 1.0), 0.1);
      fColor.a = 1.0;
   }

}
