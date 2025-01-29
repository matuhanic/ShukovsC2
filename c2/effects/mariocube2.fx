/* 
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

 
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
 
uniform float speed,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12;

uniform float rot_x;
uniform float rot_y;
uniform float rot_z;
uniform float trx,try;
uniform float zoom;

//  Gigatron France mario cube  2 using iq primitives ;
//  IQ and some other code from ST;
//******************************************************
#define PI 3.14159265358979

const float pi = 3.14159;


mat3 x_rot(float t)
{
    return mat3(1.0, 0.0, 0.0,
                0.0, cos(t), -sin(t),
                0.0, sin(t), cos(t));
}

mat3 y_rot(float t)
{
    return mat3(cos(t), 0.0, -sin(t),
                0.0, 1.0, 0.0,
                sin(t), 0.0, cos(t));
}

mat3 z_rot(float t)
{
    return mat3(cos(t), -sin(t), 0.0,
                sin(t), cos(t), 0.0,
                0.0, 0.0, 1.0);
}

vec3 rotate(vec3 p, float theta)
{
	float c = cos(theta), s = sin(theta);
	return vec3(p.x, p.y * c + p.z * s,
				p.z * c - p.y * s);
}


float sdBox( vec3 p, vec3 b )
{
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) +
    length(max(d,0.0));
}

vec2 map(vec3 p)
{
       
     float b= sdBox(p-vec3( 0.0,0.0, 0.0), vec3( p1, p2,p3) );
    
   
    return vec2(b, b);
}
vec3 normal(vec3 p)
{
    vec3 o = vec3(0.02, 0.00, 0.0);
    return normalize(vec3(map(p+o.xyy).x - map(p-o.xyy).x,
                          map(p+o.yxy).x - map(p-o.yxy).x,
                          map(p+o.yyx).x - map(p-o.yyx).x));
}


float trace(vec3 o, vec3 r)
{
    float t = 0.0;
    for (int i = 0; i < 64; ++i) {
    vec3 p = o + r * t;
    float d = map(p).x;
    t += d;
	}
return t;
}

vec3 tex(vec3 p)
{
   // tx map ! incorrect mapping todo !!!
   // vec3 tw = texture(iChannel0,  vec2(p.y+0.48,  p.z+0.30)).xyz;
  //  vec3 ta = texture(iChannel0,  vec2(p.x+0.45, -p.z+0.30)).xyz;          
   // vec3 tb = texture(iChannel0,  vec2(p.y+0.45, -p.x+0.30)).xyz;
    
	float dx= 1.956521739130435;
    vec3 sn = normal(p);
    vec3 ln = 0.5 + 0.5 * sn;
    vec3 asn = abs(sn);
    float mc = max(asn.x, max(asn.y, asn.z));
    // left p1/1.956
    if (mc == asn.x) {
        return mix(texture2D( samplerFront,-p.zy*vec2(.23,-0.31) -vec2(-.375,-.5) ).xyz, texture2D( samplerFront,p.zy*vec2(0.23,0.31) -vec2(-.875,-0.5) ).xyz, ln.x);
    }	
	
	if (mc == asn.y) {
        return mix(texture2D( samplerFront, p.xz*vec2(0.23,-0.31)-vec2(-0.375,-.165) ).xyz, texture2D( samplerFront, p.xz*vec2(0.23,0.31)-vec2(-.374,-.835) ).xyz, ln.y);
    }
    
    if (mc == asn.z) {
        return mix(texture2D( samplerFront, p.xy*vec2(0.23,0.31)-vec2(-.625,-0.5) ).xyz, texture2D( samplerFront, -p.xy*vec2(0.23,-0.31)-vec2(-.125,-0.5)).xyz, ln.z);
    }
    
    return vec3(0.0);
  	
}

void main()
{
	 
    float tm=seconds;
   
	
	vec2 uv =vTex*2.-1.0;
	
	  
    
    vec3 r = normalize(vec3(uv, zoom));//1.5
	
		
	
	
    vec3 o = vec3(0.0, 0, -3.0);
  
     mat3 xfm = y_rot(rot_y)*x_rot(rot_x)*z_rot(rot_z) ;
      
     o  *= xfm;
     r *= xfm;
    float t = trace(o, r);
    vec3 w = o + r * t;
    vec3 sn = normal(w);
    vec2 fd = map(w);
    vec3 lpos = o-2.8*sin(0.0)  ;// remove  
    vec3 ldel = lpos - w;
    float llen = length(ldel);
    ldel /= llen;
    vec3 refl = reflect(ldel, sn);
    float prod = max(dot(ldel,sn), 1.5)*0.70;
    float spow = max(dot(refl,r), 0.0);
    vec4 diff = vec4(tex(w.xyz),1.0);//0.4
    vec4 spec = vec4(.5);
    float fog = 1.0 / (1.0 + t * t * 0.0 + fd.x * 100.0);
    vec4 fc = vec4((diff * prod  + spec * spow)*fog) ;
    if(r.x > 1.0 || r.y > 1.0 || r.x < 0. || r.y < 0. ){
				gl_FragColor = vec4(0.,0.,0.,0.);
         }
    gl_FragColor = vec4(fc );
 	 
}