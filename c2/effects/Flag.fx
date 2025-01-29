/////////////////////////////////////////////////////////
// Flag effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float seconds;

uniform lowp float pixelHeight;
uniform mediump float waves;
uniform mediump float amplitude;
uniform mediump float time;

void main(void)
{   
   mediump vec2 tex = vTex;
   
   tex.y += sin((seconds/(time*0.5)-tex.x)*waves*3.14)*tex.x*amplitude*pixelHeight;
      
   gl_FragColor = texture2D(samplerFront,tex);
}