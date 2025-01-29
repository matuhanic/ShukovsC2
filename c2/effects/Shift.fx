/////////////////////////////////////////////////////////
// Shift effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform lowp float pixelWidth;
uniform lowp float pixelHeight;
uniform mediump float xshift;
uniform mediump float yshift;

void main(void)
{	
	mediump vec2 tex = vTex;
	
	tex.x -= (pixelWidth*xshift);
	tex.y -= (pixelHeight*yshift);
		
	gl_FragColor = texture2D(samplerFront,tex);
}