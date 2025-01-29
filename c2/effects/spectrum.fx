/// Spectrum Beam From Shadetoy 
/// Gigatron the magnificient Gls attempt !
///  
/// 
 
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
uniform mediump float select_fx;
uniform mediump float speed;
uniform mediump float amplitude;
float time=seconds;



void main(void)
{
	vec2 uv=(1.*vTex);
	
	
	float xCol = (uv.x - (seconds * speed)) * amplitude;
	xCol = mod(xCol, 3.0);
	vec3 horColour = vec3(0.25, 0.25, 0.25);
	
	if (xCol < 1.0) {
		
		horColour.r += 1.0 - xCol;
		horColour.g += xCol;
	}
	else if (xCol < 2.0) {
		
		xCol -= 1.0;
		horColour.g += 1.0 - xCol;
		horColour.b += xCol;
	}
	else {
		
		xCol -= 2.0;
		horColour.b += 1.0 - xCol;
		horColour.r += xCol;
	}
	
	//background lines
	float backValue = 1.0;
	float aspect = resolution.x / resolution.y;
	if (mod(uv.y * 100.0, 1.0) > 0.75 || mod(uv.x * 100.0 * aspect, 1.0) > 0.75) {
		
		backValue = 1.15;	
	}
	
	vec3 backLines  = vec3(backValue);
	
	//main beam
	uv = (2.0 * uv) - 1.0;
	float beamWidth = abs(1.0 / (30.0 * uv.y));
	vec3 horBeam = vec3(beamWidth);
	vec4 color = vec4(0.0,0.0,0.0,1.0);
	color = vec4(((backLines * horBeam) * horColour), 1.0);

		
	gl_FragColor = color;

}

