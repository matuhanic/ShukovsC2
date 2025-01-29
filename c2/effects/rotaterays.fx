/* 
 rotated rays background by Andrey A. Ugolnik
 based on inigo quilez shader.
 2015
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

uniform float speed;
uniform float dir;
uniform float sfactor;
uniform float textured;
uniform float rays;
uniform float pos_x;
uniform float pos_y;
uniform float sun_radius;
uniform float lred,lgreen,lblue,bred,bgreen,bblue;
 
vec3 linecol = vec3(lred,lgreen,lblue);
vec3 bgcolor = vec3(bred,bgreen,bblue);
//vec3 suncolor=vec3(lred,lgreen,lblue); 
#define PI 3.14159265359

void main()
{

    float smoothness = (1.0) * sfactor;
   	 vec2 p = (-iResolution.xy + 2.0 * gl_FragCoord.xy) / iResolution.y-vec2(pos_x,pos_y);
	
	float f; 
	
	vec2 q = vec2(atan(p.y, p.x), length(p));
	
	f= smoothstep(-smoothness, smoothness, sin(q.x * rays + seconds*speed*dir));
	// center circle integration /gtr
	f*= clamp((length(p+vec2(0, 0)) + sun_radius) *100., 0.0, 1.0);
	
	vec3 col = mix(linecol,bgcolor , f);
	gl_FragColor = vec4(col, 1.0);
		
	
	   

    if(textured==1.0)
    {
    vec4 tc = texture2D(samplerFront, vTex);
    gl_FragColor = mix(tc, vec4(col, 1.0), 0.7);
    }
    
		
		
}

