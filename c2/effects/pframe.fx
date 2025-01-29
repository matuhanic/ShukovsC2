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
vec2 iResolution = vec2( 1./pixelWidth, 1./pixelHeight);

uniform float speed,p1,p2,p3;

float metaline(vec2 p, vec2 o, float thick, vec2 l){
    vec2 po = 2.*p+o;
    return thick / dot(po,vec2(l.x,l.y));
}

void main(){
 
    float zoom=0.5;
    
    vec2 q=vTex;
    
    vec3 tx=texture2D(samplerFront,q).xyz ;
    
  
  float ratio = iResolution.x/iResolution.y;
	vec2 uv = vTex*2.-1.;
	uv.x*=ratio;
	uv*=zoom;
	//uv=vTex*2.-1.0;
   
    float thick=0.3*speed;
    float inv=1.;
	float bottom = metaline(uv,vec2(0.,2.)*zoom, thick, vec2(0.0,1.*inv));
	float top = metaline(uv,vec2(0.,-2.)*zoom, thick, vec2(0.0,-1.*inv));
	float left = metaline(uv,vec2(2.*ratio,0.)*zoom, thick, vec2(1.*inv,0.0));
	float right = metaline(uv,vec2(-2.*ratio,0.)*zoom, thick, vec2(-1.*inv,0.0));
	float rect=bottom+top+left+right;
    
 
 
    float d0 = rect;
    float d = smoothstep(d0-30.,d0+4.,1.);
    float r = mix(1./d, d, p1);
    float g = mix(1./d, d, p2);
    float b = mix(1./d, d, p3);
    vec3 c = vec3(r,g,b);
    
    gl_FragColor.rgb =  c*tx;
}