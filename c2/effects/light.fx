/* 

 gigatron for C2 
 V1.0 initial release 
 */
  
#ifdef GL_ES
precision mediump float;
#endif

uniform mediump sampler2D samplerBack;
uniform mediump sampler2D samplerFront;
varying mediump vec2 vTex;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;
uniform mediump float seconds;
uniform mediump float date;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
 

vec3 iResolution = vec3( 1./pixelWidth, 1./pixelHeight,1./pixelWidth+1./pixelHeight);

uniform float speed,p1,p2,p3,rr,gg,bb;

#define T texture2D(samplerFront,.5+(p.xy*=.99))
void main()
{
	vec3 p=gl_FragCoord.xyz/iResolution-0.5;  // ires vec3 .. with Z !
	

   vec3 o=T.rbb;
   
	for (float i=0.;i<64.;i++) // 64 iteration  
	p.z+=pow(max(0.,p1-length(T.rb))/*rg */,2.)*exp(-i*.1);
	gl_FragColor=vec4(o*o+p.z,1)*3.0;
}
