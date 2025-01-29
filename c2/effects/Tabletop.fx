/////////////////////////////////////////////////////////
// Tabletop effect
varying lowp vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform lowp float pixelWidth;
uniform lowp float pixelHeight;
uniform lowp float width;
uniform lowp float height;

void main(void)
{	
	lowp vec2 tex = vTex;
	
	lowp float ratio = (1.0-width)*tex.y;

	tex.x -= ratio/2.0;
	tex.x /= (1.0-ratio);
	
	tex.y /= height;
		
	gl_FragColor = texture2D(samplerFront,tex);
}