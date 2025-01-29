/////////////////////////////////////////////////////////
// Skew effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform lowp float pixelWidth;
uniform lowp float pixelHeight;
uniform mediump float skew;

void main(void)
{	
	mediump vec2 tex = vTex;

	tex.y -= (pixelHeight*skew)*tex.x;
		
	gl_FragColor = texture2D(samplerFront,tex);
}