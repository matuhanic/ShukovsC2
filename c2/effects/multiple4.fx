/// Multiple FX v1.1
/// Gigatron the magnificient Gls attempt !
/// FX 6-24
///  Multiple effects by Optimus
/// Guest code by AkumaX (rand function)
/// and many others not listed here
 
#ifdef GL_ES
precision mediump float;
#endif
//#extension GL_OES_standard_derivatives : enable

uniform mediump sampler2D samplerFront;
varying mediump vec2 vTex;

uniform mediump float seconds;
uniform mediump float date;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
vec2 resolution = vec2( 1./pixelWidth, 1./pixelHeight);
uniform mediump float scale_x;
uniform mediump float scale_y;
uniform mediump float select_fx;
uniform mediump float speed;
float time=seconds;

const int iters = 256;

const float origin_z = 0.0;
const float plane_z = 4.0;
const float far_z = 64.0;

const float astep = (far_z - plane_z) / float(iters) * 0.025;

const float color_bound = 0.0;
const float upper_bound = 1.0;

const float scale = 32.0;

const float disp = 0.25;



vec3 hash3( float n ) { return fract(sin(vec3(n,n+1.0,n+2.0))*43758.5453123); }
vec4 hash4( float n ) { return fract(sin(vec4(n,n+1.0,n+2.0,n+3.0))*43758.5453123); }

 
vec2 getPosition( float time, vec4 id ) { return vec2(       0.9*sin((speed*(0.75+0.5*id.z))*time+20.0*id.x),        0.75*cos(speed*(0.75+0.5*id.w)*time+20.0*id.y) ); }
vec2 getVelocity( float time, vec4 id ) { return vec2( speed*0.9*cos((speed*(0.75+0.5*id.z))*time+20.0*id.x), -speed*0.75*sin(speed*(0.75+0.5*id.w)*time+20.0*id.y) ); }

// fx1
float cir(float _x, float _y, float s)
{
  float x = _x * float(resolution.x) * 0.02;
  float y = _y * float(resolution.y) * 0.02;
  return pow(((sin(x * 4.28)*0.5+0.5) + sin((x + y) * 8.28)*0.5+0.5) * (sin(y * 6.28)*0.6+0.7), s);
}
// EndFx1
// FX2
vec2 random2(vec2 c) { float j = 4906.0*sin(dot(c,vec2(169.7, 5.8))); vec2 r; r.x = fract(512.0*j); j *= .125; r.y = fract(512.0*j);return r-0.5;}

const float F2 =  0.3660254;
const float G2 = -0.2113249;

float simplex2d(vec2 p){vec2 s = floor(p + (p.x+p.y)*F2),x = p - s - (s.x+s.y)*G2; float e = step(0.0, x.x-x.y); vec2 i1 = vec2(e, 1.0-e),  x1 = x - i1 - G2, x2 = x - 1.0 - 2.0*G2; vec3 w, d; w.x = dot(x, x); w.y = dot(x1, x1); w.z = dot(x2, x2); w = max(0.5 - w, 0.0); d.x = dot(random2(s + 0.0), x); d.y = dot(random2(s +  i1), x1); d.z = dot(random2(s + 1.0), x2); w *= w; w *= w; d *= w; return dot(d, vec3(70.0));}

vec3 rgb2yiq(vec3 color){return color * mat3(0.299,0.587,0.114,0.596,-0.274,-0.321,0.211,-0.523,0.311);}
vec3 yiq2rgb(vec3 color){return color * mat3(1.,0.956,0.621,1,-0.272,-0.647,1.,-1.107,1.705);}

vec3 convertRGB443quant(vec3 color){ vec3 out0 = mod(color,1./16.); out0.b = mod(color.b, 1./8.); return out0;}
vec3 convertRGB443(vec3 color){return color-convertRGB443quant(color);}

vec2 sincos( float x ){return vec2(sin(x), cos(x));}
vec2 rotate2d(vec2 uv, float phi){vec2 t = sincos(phi); return vec2(uv.x*t.y-uv.y*t.x, uv.x*t.x+uv.y*t.y);}
vec3 rotate3d(vec3 p, vec3 v, float phi){ v = normalize(v); vec2 t = sincos(-phi); float s = t.x, c = t.y, x =-v.x, y =-v.y, z =-v.z; mat4 M = mat4(x*x*(1.-c)+c,x*y*(1.-c)-z*s,x*z*(1.-c)+y*s,0.,y*x*(1.-c)+z*s,y*y*(1.-c)+c,y*z*(1.-c)-x*s,0.,z*x*(1.-c)-y*s,z*y*(1.-c)+x*s,z*z*(1.-c)+c,0.,0.,0.,0.,1.);return (vec4(p,1.)*M).xyz;}

float varazslat(vec2 position, float time){
	float color = 0.0;
	float t = 2.*time*speed;
	color += sin(position.x*cos(t/10.0)*20.0 )+cos(position.x*cos(t/15.)*10.0 );
	color += sin(position.y*sin(t/ 5.0)*15.0 )+cos(position.x*sin(t/25.)*20.0 );
	color += sin(position.x*sin(t/10.0)*  .2 )+sin(position.y*sin(t/35.)*10.);
	color *= sin(t/10.)*.5;
	
	return color;
}
// EndFX2
// Fx4
float hash( float n )
{
    return fract(sin(n)*43758.5453);
}
float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);

    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
}

//x3
vec3 noise3( in vec3 x)
{
	return vec3( noise(x+vec3(123.456,.567,.37)),
				noise(x+vec3(.11,47.43,19.17)),
				noise(x) );
}

//http://dept-info.labri.fr/~schlick/DOC/gem2.ps.gz
float bias(float x, float b) {
	return  x/((1./b-2.)*(1.-x)+1.);
}

float gain(float x, float g) {
	float t = (1./g-2.)*(1.-(2.*x));	
	return x<0.5 ? (x/(t+1.)) : (t-x)/(t-1.);
}


mat3 rotation(float angle, vec3 axis)
{
    float s = sin(-angle);
    float c = cos(-angle);
    float oc = 1.0 - c;
	vec3 sa = axis * s;
	vec3 oca = axis * oc;
    return mat3(	
		oca.x * axis + vec3(	c,	-sa.z,	sa.y),
		oca.y * axis + vec3( sa.z,	c,		-sa.x),		
		oca.z * axis + vec3(-sa.y,	sa.x,	c));	
}

vec3 fbm(vec3 x, float H, float L, int oc)
{
	vec3 v = vec3(0);
	float f = 1.;
	for (int i=0; i<10; i++)
	{
		if (i >= oc) break;
		float w = pow(f,-H);
		v += noise3(x)*w;
		x *= L;
		f *= L;
	}
	return v;
}

vec3 smf(vec3 x, float H, float L, int oc, float off)
{
	vec3 v = vec3(1);
	float f = 1.;
	for (int i=0; i<10; i++)
	{
		if (i >= oc) break;
		v *= off + f*(noise3(x)*2.-1.);
		f *= H;
		x *= L;
	}
	return v;	
}

//End Fx4

#define PI 3.1415926535
float calc_this(vec3 p, float disx, float disy, float disz)
{
	float c = sin(sin((p.x + disx) * sin(sin(p.z + disz)) + time) + sin((p.y + disy) * cos(p.z + disz) + 2.0 * time) + sin(3.0*p.z + disz + 3.5 * time) + sin((p.x + disx) + sin(p.y + disy + 2.5 * (p.z + disz - time) + 1.75 * time) - 0.5 * time));
	return c;
}

vec3 get_intersection(vec2 position)
{
	vec3 pos = vec3(position.x * scale, position.y * scale, plane_z);
	vec3 origin = vec3(0.0, 0.0, origin_z);

	vec3 dir = pos - origin;
	vec3 dirstep = normalize(dir) * astep;

	dir = normalize(dir) * plane_z;


	float c;

	for (int i=0; i<iters; i++)
	{
		c = calc_this(dir, 0.0, 0.0, 0.0);

		if (c > color_bound)
		{
			break;
		}

		dir = dir + dirstep;
	}

	return dir;
}

float rand(vec2 vector)
{
    return fract( 43758.5453 * sin( dot(vector, vec2(12.9898, 78.233) ) ) );
}

float get_bump_height(vec2 position)
{
	return sin((sin(position.x * 32.0) + sin(position.y * 24.0) + sin(position.x * 4.0 + sin(position.y * 8.0 + time))) * 4.0) * 0.5 + 0.5;
}

float get_light(vec2 position)
{
	vec2 tex = mod(position * 4.0, 1.0) - vec2(0.5);
	return 0.0005 / pow(length(tex), 4.0);
}

void main(void)
{

	float scale = 1.0;
	vec2 position=(1.0*vTex);


	vec2 coord = mod(position,1.0);	// coordinate of single effect window (0.0 - 1.0)
	vec2 effect = floor(mod(position,4.0)); // effect number (0-3,0-3)
	//float effect_number = effect.y * 4.0 + effect.x;
	vec2 effect_group = floor(position) * 7.0; // effect group float id
	float effect_number =select_fx;
	float gradient = 0.0;
	vec3 color = vec3(0.0);
 
	float angle = 0.0;
	float radius = 0.0;
	const float pi = 3.141592;
	float fade = 0.0;
 
	float u,v;
	float z;
 
	vec2 centered_coord = coord - vec2(0.5);

	float dist_from_center = length(centered_coord);
	float angle_from_center = atan(centered_coord.y, centered_coord.x);
	
 
	if (effect_number==0.0)
	{
		vec2 uv=position;
	float pi = 3.14;
    float colora = 0.0;
    colora += 0.7*sin(0.5*uv.x + time/5.0);
    colora += 3.0*sin(1.6*uv.y + time/5.0);
    colora += 1.0*sin(10.0*(uv.y * sin(time/2.0) + uv.x * cos(time/5.0)) + time/2.0);
    float cx = uv.x + 0.5*sin(time/2.0);
    float cy = uv.y + 0.5*cos(time/4.0);
    colora += 0.4*sin(sqrt(100.0*cx*cx + 100.0*cy*cy + 1.0) + time*speed);
    colora += 0.9*sin(sqrt(75.0*cx*cx + 25.0*cy*cy + 1.0) + time*speed);
    colora += -1.4*sin(sqrt(256.0*cx*cx + 25.0*cy*cy + 1.0) + time*speed);
    colora += 0.3 * sin(0.5*uv.y + uv.x + sin(time));
    float r = 0.5+0.5*sin(colora * pi);
    float g = 0.5+0.5*sin(colora * pi + 2.0 * pi / 3.0);
    float b = 0.5+0.5*sin(colora + 4.0 * pi / 3.0);
	color = vec3(r*2.,g*2.,b*2.);
	}
	else if (effect_number==1.0)
	{
	 
		vec2 q = position;
		   
	   q.x /= 8.; q.y /= 16.0;

	  float gt = time*speed;
	 
		
	  float t = (gt+157.7) * 0.003;
	  float ir = 0.9 + sin(1.33 + gt * 2.1) * 0.5;
	  float ig = 1.0 + sin(2.14 + gt * 3.7) * 0.5;
	  float ib = 1.1 + sin(4.87 + gt * 1.2) * 0.5;

	  float r1 = cir(t *  1.5  + q.x / 3.54, t *  1.28 - q.y / 2.64, ir);
	  float r2 = cir(t *  3.94 - q.x / 2.54, t *  3.21 + q.y / 4.55, ig);
	  float r3 = cir(t * -2.73 + q.x / 2.82, t *  2.27 + q.y / 1.99, ig);
	  float g1 = cir(t * -3.41 - q.x / 2.84, t * -5.98 - q.y / 2.46, ig);
	  float g2 = cir(t * -2.83 + q.x / 1.23, t *  1.55 + q.y / 1.37, ib);
	  float g3 = cir(t *  1.89 - q.x / 2.62, t * -2.37 - q.y / 1.54, ib);
	  float b1 = cir(t *  4.12 - q.x / 3.21, t * -1.24 + q.y / 1.28, ib);
	  float b2 = cir(t * -2.99 + q.x / 1.54, t *  3.38 - q.y / 2.19, ir);
	  float b3 = cir(t *  1.17 - q.x / 5.23, t *  2.18 + q.y / 3.02, ir);
	  
	  float coef = sin((r1-b2)*g3*10.0) * 1.2 + 0.5;
	  float r = (r1 + r2 * r3) * (g1 - b1*coef);
	  float g = (g1 + g2 * g3) * (b1 - r1*coef);
	  float b = (b1 + b2 * b3) * (r1 - g1*coef);

		// Simulate Amiga's color palette containing no less than 4096 colors (RGB444)
		r = ceil(r * 255.0 / 16.0) * 16.0 / 256.0;
		g = ceil(g * 255.0 / 16.0) * 16.0 / 256.0;
		b = ceil(b * 255.0 / 16.0) * 16.0 / 256.0;
		color = vec3(r, g, b);

  }
	else if (effect_number==2.0)
	{
	vec2 uv = position;//fragCoord.xy / iResolution.xy; 
    uv = (uv-.5)*2.;
   
    vec3 vlsd = vec3(0,1,0);
    vlsd = rotate3d(vlsd, vec3(1.,1.,0.), time*speed);
    vlsd = rotate3d(vlsd, vec3(1.,1.,0.), time*speed);
    vlsd = rotate3d(vlsd, vec3(1.,1.,0.), time*speed);
    
    vec2 
        v0 = .75 * sincos(.3457 * time*speed + .3423) - simplex2d(uv * .917),
        v1 = .75 * sincos(.7435 * time*speed + .4565) - simplex2d(uv * .521), 
        v2 = .75 * sincos(.5345 * time*speed + .3434) - simplex2d(uv * .759);
    
    vec3 colora = vec3(dot(uv-v0, vlsd.xy),dot(uv-v1, vlsd.yz),dot(uv-v2, vlsd.zx));
    
    colora *= .2 + 2.5*vec3(
    	(16.*simplex2d(uv+v0) + 8.*simplex2d((uv+v0)*2.) + 4.*simplex2d((uv+v0)*4.) + 2.*simplex2d((uv+v0)*8.) + simplex2d((v0+uv)*16.))/32.,
        (16.*simplex2d(uv+v1) + 8.*simplex2d((uv+v1)*2.) + 4.*simplex2d((uv+v1)*4.) + 2.*simplex2d((uv+v1)*8.) + simplex2d((v1+uv)*16.))/32.,
        (16.*simplex2d(uv+v2) + 8.*simplex2d((uv+v2)*2.) + 4.*simplex2d((uv+v2)*4.) + 2.*simplex2d((uv+v2)*8.) + simplex2d((v2+uv)*16.))/32.
    );
    
    colora = yiq2rgb(colora);
   
    
    
    colora = vec3(pow(colora.r, 0.45), pow(colora.g, 0.45), pow(colora.b, 0.45));

     color = vec3(colora*2.0);
	}
	
	else if (effect_number==3.0)
	{
		//vec2 p = -1.0 + 2.0 * fragCoord.xy / iResolution.xy;
		vec2 p=position*2.0;
		float x = p.x;
		float y = p.y;
		float mov0 = x+y+cos(sin(time*speed)*2.0)*100.+sin(x/100.)*1000.;
		float mov1 = y / 0.9 +  time*speed;
		float mov2 = x / 0.2;
		float c1 = abs(sin(mov1+time*speed)/2.+mov2/2.-mov1-mov2+time*speed);
		float c2 = abs(sin(c1+sin(mov0/1000.+time*speed)+sin(y/40.+time*speed)+sin((x+y)/100.)*3.));
		float c3 = abs(sin(c2+cos(mov1+mov2+c2)+cos(mov2)+sin(x/1000.)));
		color = vec3(c1*2.,c2*2.,c3*2.);
	}
	else if (effect_number==4.0)
	{
		vec2 uv = position;
	uv.x *= resolution.x / resolution.y;
		
	float slow = time*speed*0.008;
	uv *= 1. + .5*slow*sin(slow*10.);
	
	float ts = time*speed*0.07;
	float change = gain(fract(ts),0.0008)+floor(ts);	//flick to a different view 
						
	vec3 p = vec3(uv*.2,slow+change);					//coordinate + slight change over time
	
	vec3 axis = 4. * fbm(p, 0.5, 2., 8);				//random fbm axis of rotation
	
	vec3 colorVec = 0.5 * 5. * fbm(p*0.3,0.5,2.,7);		//random base color
	p += colorVec;
	
//	float mag = 4e5;	//published, rather garish?
	float mag = 0.75e5; //still clips a bit
//	mag = mag * (1.+sin(2.*3.1415927*ts)*0.75);
	vec3 colorMod = mag * smf(p,0.7,2.,8,.2);			//multifractal saturation
	colorVec += colorMod;
	
	colorVec = rotation(3.*length(axis)+slow*10.,normalize(axis))*colorVec;
	
	colorVec *= 0.05;
			
//	colorVec = colorVec / (1. + length(colorVec));	//tone it all down a bit
	
	colorVec = pow(colorVec,vec3(1./2.2));		//gamma
	color = vec3(colorVec*2.0);
	}
	 
    
 
	color.r *= (sin(effect_group.x) * 0.5 + 0.5);
	color.g *= (sin(effect_group.y) * 0.5 + 0.5);
	color.b *= (sin(effect_group.x * effect_group.y) * 0.5 + 0.5);
 
	gl_FragColor = vec4(color, 1.0 );
}

 
  



