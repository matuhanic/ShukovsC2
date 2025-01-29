/// Star nest FX
/// Gigatron the magnificient Gls attempt !
///  
/// Star Nest by Pablo Román Andrioli
/// Modified a lot.
// This content is under the MIT License.

#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable



uniform vec2 mouse;
uniform mediump sampler2D samplerFront;
varying vec2 vTex;
	
uniform mediump float seconds;
uniform mediump float date;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
vec2 resolution = vec2( 1./pixelWidth, 1./pixelHeight);
uniform mediump float scale_x;
uniform mediump float scale_y;
float time=seconds;
#define iterations 15
#define volsteps 18
uniform mediump float scroll_speed;
uniform mediump float formuparam;
uniform mediump float stepsize;
uniform mediump float zoom;
uniform mediump float tile;
uniform mediump float brightness;
uniform mediump float darkmatter;
uniform mediump float darkmatterfactor;
uniform mediump float distfading;
uniform mediump float saturation;
uniform mediump float contrast;
///// *** Default values ///
// #define formuparam 0.530
// #define stepsize 0.120
// #define zoom   1.00
// #define tile   0.850
 #define speed  0.0001   // 
// #define brightness 0.0015
// #define darkmatter 0.400
// #define distfading 0.760
// #define saturation 1.000
/////////////////////////////


void main(void)
{
	//get coords and direction
	vec2 uv=(1.0*vTex);
	uv.y*=resolution.y/resolution.x;
	vec3 dir=vec3(uv*zoom,1.);
	
	float a2=time*speed+.5;
	float a1=0.0;
	mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	mat2 rot2=rot1;//mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	dir.xz*=rot1;
	dir.xy*=rot2;
	
	//from.x-=time;
	//mouse movement
	vec3 from=vec3(0.,0.,0.);
	from+=vec3(scroll_speed*time,0.1,-2.); // .05*time,-2.);
	//
	//from.x-=mouse.x;
	//from.y-=mouse.y;
	
	from.xz*=rot1;
	from.xy*=rot2;
	
	//volumetric rendering
	float s=.4,fade=.2;
	vec3 v=vec3(0.4);
	for (int r=0; r<volsteps; r++) {
		vec3 p=from+s*dir*.5;
		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) { 
			p=abs(p)/dot(p,p)-formuparam; // the magic formula
			a+=abs(length(p)-pa); // absolute sum of average change
			pa=length(p);
		}
		float dm=max(0.,darkmatter-a*a*darkmatterfactor); //dark matter
		a*=a*a*contrast; // add contrast
		if (r>3) fade*=1.-dm; // dark matter, don't render near
		//v+=vec3(dm,dm*.5,0.);
		v+=fade;
		v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
		fade*=distfading; // distance fading
		s+=stepsize;
	}
	v=mix(vec3(length(v)),v,saturation); //color adjust
	gl_FragColor = vec4(v*.01,1.);	
	
}

