/////////////////////////////////////////////////////////
// Cinematic effect
varying lowp vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform lowp float height;

void main(void)
{	
	lowp float PI = 3.14159265358979323846264;
	
	lowp vec2 tex = vTex;
	
	lowp float ratio = 1.0+height*sin(tex.x*PI);
	
	tex.y -= 0.5-ratio/2.0;
	tex.y /= ratio;
		
	gl_FragColor = texture2D(samplerFront,tex);
}