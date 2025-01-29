///////////////////////////////////////////////////
//NoisePlus effect
//various static and animated noise effects
//chrisbrobs 2015/based on work/tutorials at Pixel Shaders:Toby Schachman.

precision mediump float;
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform float seconds;
float time = seconds;

uniform float noiseLevel;
uniform float animSpeed;

uniform lowp float noiseType;


//generate random values

float random(float p) {
  return fract(sin(p)*10000.);
}

float noise(vec2 p) {
  return random(p.x + p.y*10000.);
}

//    stepNoise

float stepNoise(vec2 p) {         
  return noise(floor(p));        
}


vec2 sw(vec2 p) {return vec2( floor(p.x) , floor(p.y) );}
vec2 se(vec2 p) {return vec2( ceil(p.x)  , floor(p.y) );}
vec2 nw(vec2 p) {return vec2( floor(p.x) , ceil(p.y)  );}
vec2 ne(vec2 p) {return vec2( ceil(p.x)  , ceil(p.y)  );}

//       smoothNoise

float smoothNoise(vec2 p) {              
  vec2 inter = smoothstep(0., 1., fract(p));
  float s = mix(noise(sw(p)), noise(se(p)), inter.x);
  float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
  return mix(s, n, inter.y);
  return noise(nw(p));
}

//       movingNoise

float movingNoise(vec2 p) {
  float total = 0.0;
  total += smoothNoise(p     - (time/animSpeed));  
  total += smoothNoise(p*2.  + (time/animSpeed)) / 2.;
  total += smoothNoise(p*4.  - (time/animSpeed)) / 4.;
  total += smoothNoise(p*8.  + (time/animSpeed)) / 8.;
  total += smoothNoise(p*16. - (time/animSpeed)) / 16.;
  total /= 1. + 1./2. + 1./4. + 1./8. + 1./16.;
  return total;
}


//     nestedNoise

float nestedNoise(vec2 p) {
  float x = movingNoise(p);
  float y = movingNoise(p);
  return movingNoise(p + vec2(x, y));
}

void main(void)
{
     
  vec4 front = texture2D(samplerFront, vTex);  
  
  vec2 p = (vTex * noiseLevel);

   //float type;

    if (noiseType > 3.0)    

       gl_FragColor.rgb = vec3(nestedNoise(p));

     else if (noiseType > 2.0)    

       gl_FragColor.rgb = vec3(movingNoise(p));

     else if (noiseType > 1.0)

     gl_FragColor.rgb = vec3(smoothNoise(p-(time/animSpeed)));
     
     else if (noiseType > 0.0)
     
     gl_FragColor.rgb = vec3(stepNoise(p));

     else

    gl_FragColor.rgb = vec3(noise(p));
    gl_FragColor.a = front.a;

}
