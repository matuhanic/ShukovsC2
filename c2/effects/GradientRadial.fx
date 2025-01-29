////////////////////////////////////
//GradientRadial effect
//2 color blended radial gradient/chrisbrobs2015

precision mediump float;
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform lowp float color1R;
uniform lowp float color1G;
uniform lowp float color1B;

uniform lowp float color2R;
uniform lowp float color2G;
uniform lowp float color2B;

uniform lowp float xpos;
uniform lowp float ypos;

void main() {

 vec4 front = texture2D(samplerFront, vTex);
 mediump vec2 position = vTex;

 vec2 p = position - vec2(xpos, ypos);
 
 float radius = (length(p));

 vec4 color1 = vec4(color1R,color1G,color1B,1.0);    //inner
 vec4 color2 = vec4(color2R,color2G,color2B,1.0);    //outer

        
 gl_FragColor = vec4(mix(color1, color2, radius)*front.a);       
  
}

