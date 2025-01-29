/////////////////////////////////////////////////////////
// RotoScale effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform lowp float angle;
uniform lowp float scale;

void main(void)
{	
	mediump vec2 tex = vTex;
	
	lowp float rX = mod(0.5+mod((cos(radians(angle))*(tex.x-0.5) - sin(radians(angle)) * (tex.y-0.5)),scale)/scale,1.0);
	lowp float rY = mod(0.5+mod((sin(radians(angle))*(tex.x-0.5) + cos(radians(angle)) * (tex.y-0.5)),scale)/scale,1.0);
	
	tex.x = rX;
	tex.y = rY;
		
	gl_FragColor = texture2D(samplerFront,tex);
}