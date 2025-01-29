// Fire by TylerGlaiel on Shadertoy
// https://www.shadertoy.com/view/4slXz2
// Ported to C2 by Matriax

// Additional variables
// Added the option to enable/disable each flame individualy and a final blend.


// Set precision for Float
precision mediump float;

// Things i don't know but are necessary
varying mediump vec2 vTex;
uniform sampler2D samplerFront;




// At the end not nedded
/*
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
vec2 iResolution = vec2( 1.0/pixelWidth, 1.0/pixelHeight);
*/


// Parameters to C2 pass
uniform mediump float seconds;

uniform mediump float flameA; // For Enable/Disable
uniform mediump float flameB; // For Enable/Disable
uniform mediump float blendBack; // General Contrast

uniform mediump float fireSize; // Fire Size
uniform mediump float flameSize; // Flame size (Vertical)
uniform mediump float flameSizeH; // Flame size (Horizontal)
uniform mediump float flameSizeV; // Flame Color Size

uniform mediump float flamesP; // Flames position
uniform mediump float generalI; // General Intensity
uniform mediump float flameI; // Flame Intensity
uniform mediump float flameContr; // Flame Contrast
uniform mediump float flameColorR; // Flame Red values
uniform mediump float flameColorG; // Flame Green values
uniform mediump float flameColorB; // Flame Blue values

uniform mediump float generalColorR; // General Red values
uniform mediump float generalColorG; // General Green values
uniform mediump float generalColorB; // General Blue values

uniform mediump float fireSPD; // Fire Speed
uniform mediump float fireWaveF1; // Wave Effect Form
uniform mediump float fireWaveF2; // Wave Effect Form
uniform mediump float fireWaveM1; // Wave Effect Movement 1
uniform mediump float fireWaveM2; // Wave Effect Movement 2
uniform mediump float fireWaveHn; // Number of horizontal waves

uniform mediump float fireYpos; // Y Positon
uniform mediump float flameForm; // Flames form









// SIMPLE FLAMES *********************************************************************************

float triangle(float t){
		
	//return (fract(t)-flamesP) * sign(fract(t / 2.0)-.9);
  return (fract(t)-.5) * sign(fract(t)-.5);  
}


// p1 -> (t-.5(¿gradient color?)*2.0(lightflame)*vec3(0(Red), 1.2(Green?), 1(Blue)));
  vec3 grad(float t){
	vec3 p1 = max(vec3(0), (t-flameI)*flameContr*vec3(flameColorR, flameColorG, flameColorB));
	vec3 p2 = max(vec3(0), (t+generalI)*1.3*vec3(generalColorR, generalColorG, generalColorB));
	// 0.8 0.2 0

	return (p1*flameA)+(p2*flameB); //
}

// Warp effect
vec2 warp(vec2 uv){
	uv.x += (sin(uv.x/10.0-seconds*fireSPD + uv.y*(-10.0) * (sin(uv.x*fireWaveF1 + seconds*fireWaveM1)*fireWaveM2+fireWaveHn))+1.0)*fireWaveF2;
 
  uv.y = 1.0 - uv.y; // Flip Image horizontal
	return uv;
}



void main(void)
{
	vec2 uv = warp(fireSize*(vTex));

	//uv.y = 1.0 - uv.y; // Flip Image vertical
	//uv.x = 1.0 - uv.x; // Flip Image horizontal
	
	/*
	 //vec2 uv = 2. * fragCoord.xy / iResolution.xy - 1.;
	vec2 uv =(1.*vTex);
	*/
	
	
	float t = uv.x * flameSize;
	float Tt = triangle(t);
	
	
	float v  = -((uv.y-fireYpos)*2.0 - pow(Tt, flameForm)*sin(t+sin(seconds)*-2.0))* ((sin(t*5.0+seconds)+flameSizeV) * flameSizeH + .8);
	gl_FragColor = (vec4(grad(v*0.8), 1.0))*blendBack;
}
// SIMPLE FLAMES *********************************************************************************



