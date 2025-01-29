/* Upload from LukasPukenis ST
Blur different direction 
 gigatron for C2 
 V1.0 initial release 
 */
  
#ifdef GL_ES
precision mediump float;
#endif
 

uniform mediump sampler2D samplerFront;
varying mediump vec2 vTex;

uniform mediump float seconds;
uniform mediump float date;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
vec2 iResolution = vec2( 1./pixelWidth, 1./pixelHeight);
 
uniform float speed;
uniform float intensity;

const int Samples = 64; //multiple of 2



vec4 DirectionalBlur(in vec2 UV, in vec2 Direction, in float intensity, in sampler2D Texture)
{
    vec4 Color = vec4(0.0);  
       
    
    for (int i=1; i<=Samples/2; i++)
    {
    Color += texture2D(Texture,UV-float(i)*intensity/float(Samples/2)*Direction);
    Color += texture2D(Texture,UV-float(i)*intensity/float(Samples/2)*Direction);
    }
	
    return Color/float(Samples);    
}

void main()
{
	vec2 UV=1.*vTex;
    vec2 Direction = vec2(-sin(seconds*speed),cos(seconds*speed));    
    vec4 Color = DirectionalBlur(UV,normalize(Direction),intensity,samplerFront);
   	gl_FragColor = Color;
}