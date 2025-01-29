/// 3d Stars V0.2 !
/// Gigatron the magnificient Gls attempt !
/// code from glsls sandbox  ; C2 adaptation gigatron
/// To do , stars colors r,g,b, and some other stuffs !
 
#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

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
/// END C2 setup glsls ;

uniform mediump float speed;
uniform mediump float clouds_visible;
uniform mediump float center_stars_visible;
uniform mediump float moving_stars_visible;
uniform mediump float asteroids_visible;
uniform mediump float asteroids_intensitiy;
uniform mediump float density;  // 1.0

uniform mediump float red;
uniform mediump float green;
uniform mediump float blue;

uniform mediump float brightness;
// from http://glsl.heroku.com/e#5484.0
vec3 asteroids( vec2 position ) {
	 
	// 256 angle steps
	float angle = atan(position.y,position.x)/(2.*3.14159265359);
	angle -= floor(angle);
	float rad = length(position);
	
	float color = 0.0;
	for (int i = 0; i < 5; i++) {
		float angleFract = fract(angle*256.);
		float angleRnd = floor(angle*256.)+1.;
		float angleRnd1 = fract(angleRnd*fract(angleRnd*.7235)*45.1);
		float angleRnd2 = fract(angleRnd*fract(angleRnd*.82657)*13.724);
		//float t = time+angleRnd1*10.;
		float t = speed*time*angleRnd1*1000.;
		float radDist = sqrt(angleRnd2+float(i));
		
		float adist = radDist/rad*.1;
		float dist = (t*.1+adist);
		dist = abs(fract(dist)-.5);
		
		if (asteroids_visible==1.0)
		{
		color += max(0.,.5-dist*40./adist)*(.5-abs(angleFract-.5))*5./adist/radDist;
		}
		angle = fract(angle+.61);
	}

	return vec3( color )*asteroids_intensitiy; 
}

// from http://glsl.heroku.com/e#5248.0
#define BIAS 0.1
#define SHARPNESS 3.0
vec3 star(vec2 position, float BLADES) {
	
	float blade = clamp(pow(sin(atan(position.y,position.x )*BLADES)+BIAS, SHARPNESS), 0.0, 1.0);
	vec3 color = mix(vec3(-0.34, -0.5, -1.0), vec3(0.0, -0.5, -1.0), (position.y + 1.0) * 0.25);
	float d = 1.0/length(position) * 0.075;
	if (moving_stars_visible==1.0)
	{
			color += vec3(red, green, blue) * d;
			color += vec3(red, green, blue) * min(1.0, blade *0.7)*0.5;
	}
	 
	return color;
}




vec3 star2(vec2 position, float BLADES) {
	float blade = clamp(pow(sin(atan(position.y*2.0,position.x )*BLADES + time*.5)+BIAS, 8.0), 0.0, 1.0);
	vec3 color = mix(vec3(-0.34, -0.5, -0.0), vec3(0.0, -0.5, -0.0), (position.y + 1.0) * 0.25);
	float d = 1.0/length(position) * 0.075;
	// ignore centered Star !
	if(center_stars_visible==1.0)
	{
	
	color += vec3(0.95, 0.65, 0.30) * d;
	color += vec3(0.95, 0.45, 0.30) * min(1.0, blade *0.7)*0.5;
	}
	return max(color.rgb, 0.0)*.5;
}


// Tweaked from http://glsl.heroku.com/e#4982.0
float hash( float n ) { return fract(sin(n)*43758.5453); }

float noise( in vec2 x )
{
	vec2 p = floor(x);
	vec2 f = fract(x);
    	f = f*f*(3.0-2.0*f);
    	float n = p.x + p.y*57.0;
    	float res = mix(mix(hash(n+0.0), hash(n+1.0),f.x), mix(hash(n+57.0), hash(n+58.0),f.x),f.y);
    	return res;
}

vec3 cloud(vec2 p) {
	vec3 f = vec3(0.0);
	if (clouds_visible==1.0)
    {
		f += 0.5000*noise(p*10.0)*vec3(.45, .55, 1.0);
	//	f += 0.2500*noise(p*20.0)*vec3(.85, .45, 1.0);
    //	f += 0.1250*noise(p*40.0)*vec3(1.0, .00, 0.3);
    //	f += 0.0625*noise(p*80.0)*vec3(1.0, 1.0, 1.0);	
		
	}
	return f*.5;
}

//const float SPEED	= 0.003;
const float SCALE	= 80.0;
//const float DENSITY	= 1.0;     // to doo 1.5
//const float BRIGHTNESS	= 3.0; // include bright !

   
float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }

vec3 layer(float i, vec2 pos, float dist, vec2 coord) {
	float a = pow((1.0-dist),100.0);
	float t = i*100.0 + time*i*i;
	float r = coord.x - (t*speed);
	float c = fract(a+coord.y + i*.543);
	vec2  p = vec2(r, c*.5)*SCALE*(4.0/(i*i));
	vec2 uv = fract(p)*2.0-1.0;
	float m = clamp((rand(floor(p))-density/i)*brightness, 0.0, 1.0);
	return  clamp(star(uv*.5, 6.0)*m*dist, 0.0, 1.0);
}


void main(void)
{
	vec2 pos =(0.5-vTex)*  resolution.xy/1.0 ;
	 
	
	 
	
	float dist = length(pos) / resolution.x;
	vec2 coord = vec2(pow(dist, 0.1), atan(pos.x, pos.y) / (3.1415926*2.0));
	
	// Nebulous cloud
	vec3 color = cloud(pos/resolution);
	
	// Background stars
	float a = pow((1.0-dist),20.0);
	float t = time*-.05;
	float r = coord.x - (t*0.005);
	float c = fract(a+coord.y + 0.0*.543);
	vec2  p = vec2(r, c*.5)*4000.0;
	vec2 uv = fract(p)*2.0-1.0;
	float m = clamp((rand(floor(p))-.9)*10.0, 0.0, 1.0);
	color +=  clamp((1.0-length(uv*2.0))*m*dist, 0.0, 1.0);

	color += asteroids(pos/resolution.x);
	
	// Flying stars into black hole
	color += layer(2.0, pos, dist, coord);
	color += layer(3.0, pos, dist, coord);
	color += layer(4.0, pos, dist, coord);
	
	color += star2(pos/resolution, 2.0);
		
	gl_FragColor = vec4(color, 1.0);

}



