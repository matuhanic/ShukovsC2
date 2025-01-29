/*
"Hue Rotator" by Emmanuel Keller aka Tambako - February 2016
License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
Contact: tamby@tambako.ch
gigatron for C2 
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
uniform mediump float scale_x;
uniform mediump float scale_y;
uniform mediump float select_fx;

uniform float duration,vbl_wait,shp,xx,yy,rr,gg,bb;
 

#define PI 3.1415926

// returns rotation matrix
mat2 rotate(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}


float star(vec2 uv,vec2 p, float npoints, float rmin, float rmax,float size)
{   
    // to polar coords
    float pol_a = atan(p.x, p.y); // -PI to PI
    float pol_r = length(p);
    
    float starAngle = PI * 2.0/npoints; // angle of each point
        
    pol_a = mod(pol_a, starAngle); // make each repetition segment 0->starAngle
        
    if(pol_a>=starAngle/2.0) 
        pol_a = starAngle - pol_a; // reflect segment to go from 0->starAngle/2->0
    
    vec3 maxPt = vec3(rmax, 0.0, 0.0); // tip of the star point
    vec3 minPt = rmin * vec3(cos(starAngle/2.0), sin(starAngle/2.0), 0.0); // min radius point
    
    vec3 maxToMin = minPt - maxPt; // vector from tip to min point
  	vec3 maxToP = size-pol_r * vec3(cos(pol_a), sin(pol_a), 0.0) - maxPt; // vector from tip to P
    
    vec3 cr = cross(maxToMin, maxToP); // negative Z values lie outside star
    
	float starColor = 1.-smoothstep(0.0, 0.001, cr.z);
                      
    return starColor;
    
}

  	float t = min( 3.0, mod(seconds,duration+vbl_wait) / duration);
void main()
{
	vec2 uv =  gl_FragCoord.xy/iResolution.xy *2.-1.;
		vec2 p = uv  ; 
		p.x *= iResolution.x/iResolution.y; 
	    
		vec2 scr =vTex;
	    // p = scr-vec2(0.5,0.5) ;
		p *= rotate(vbl_wait);
		vec3 tx = texture2D(samplerFront,scr).xyz;
	     
    //    p = fract(p);
   
    // 0.2 .4 
    float starColor = star(uv,p  , shp, xx, yy,duration);

    vec3 color = mix(vec3(rr, gg, bb),vec3(tx), starColor);
    
    gl_FragColor = vec4(vec3(color), 1.0);
}
