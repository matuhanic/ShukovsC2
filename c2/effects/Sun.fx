/////////////////////////////////////////////
//Sun effect
//chrisbrobs...converted from glsl sandbox

precision mediump float;
varying lowp vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float pixelWidth;
uniform lowp float pixelHeight;
vec2 iresolution = vec2( 1./pixelWidth, 1./pixelHeight);
uniform float BLADECOUNT;
uniform float BRIGHTNESS;
uniform float XPOS;
uniform float YPOS;
uniform float BIAS;
uniform float SHARPNESS;
uniform float SCALE;

void main( void )
{

  vec2 tex = vTex;
  
  vec2 position = (tex-vec2(XPOS,YPOS))/SCALE;
  
//ratio correction
  position.x *= iresolution.x / iresolution.y;
  
  vec3 color = vec3(0.);
	
float ct,st;
   ct *= 0.2;
   st *= 0.2;

float blade = clamp(pow(sin(atan(position.y + ct,position.x + st)*BLADECOUNT)+BIAS, SHARPNESS), 0.0, 1.0);
	
  color += (vec3(0.96, 0.74, 0.80) * 1.0 / distance(vec2(0.0), position + vec2(st, ct)) * 0.10); //.075
  color += vec3(0.96, 0.90, 0.80) * min(1.0, blade *0.7) * (1.0 / distance(vec2(0.0, 0.0), position)*0.075);

  vec4 render = vec4(color, 1.0 );

  lowp vec4 front = texture2D(samplerFront, vTex);


//screen blend the sun with image
  render.rgb = 1.0 - ((1.0 - render.rgb) * (1.0 - front.rgb * render.a));

  gl_FragColor = (render*BRIGHTNESS)*front.a;
	
}


//OTHER COLORS

//default colors
  //color += (vec3(0.96, 0.74, 0.80)
  //color += vec3(0.96, 0.90, 0.80)

//blue moon
  //color += (vec3(0.70, 0.74, 0.80) 
  //color += vec3(0.96, 0.79, 0.80)

//bright blue
  //color += (vec3(0.64, 0.74, 0.80)
  //color += (vec3(0.66, 0.80, 0.90)

//red/orange
  //color += (vec3(0.96, 0.74, 0.64)
  //color += vec3(0.96, 0.90, 0.80)


 
//removed from original, produces a 2 color sky gradient behind the sun. 
//color = mix(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), (position.y + 1.0) * 0.5);