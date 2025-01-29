/////////////////////////////////////////////////////////
// Scale effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform lowp float pixelWidth;
uniform lowp float pixelHeight;
uniform mediump float width;
uniform mediump float height;

void main(void)
{	
	mediump vec2 tex = vTex;

	tex.x /= width;
	tex.y /= height;
		
	gl_FragColor = texture2D(samplerFront,tex);
}