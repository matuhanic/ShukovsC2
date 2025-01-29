///////////////////////////////////////////////
//denoise effect
//chrisbrobs.straight conversion of 'denoise.js effect'
//https://github.com/evanw/glfx.js'.

precision mediump float;
uniform sampler2D samplerFront;
uniform float exponent;
uniform float pixelWidth;
uniform float pixelHeight;
varying vec2 vTex;

void main()
{
  
 vec2 texSize =vec2(1.0/pixelWidth,1.0/pixelHeight);
 vec4 center = texture2D(samplerFront, vTex);

 vec4 color = vec4(0.0);
  float total = 0.0;
  for (float x = -4.0; x <= 4.0; x += 1.0) {
  for (float y = -4.0; y <= 4.0; y += 1.0) {

 vec4 sample = texture2D(samplerFront, vTex + vec2(x, y) / texSize);
  float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));
  weight = pow(weight, exponent);
  color += sample * weight;
  total += weight;
}
}
   gl_FragColor = color / total;
}
