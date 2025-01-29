/////////////////////////////////////////////////////////
// Seamless effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform lowp float pixelWidth;
uniform lowp float pixelHeight;
uniform mediump float xshift;
uniform mediump float yshift;

void main(void)
{	
	mediump vec2 tex = vTex;
	
	tex.x = mod(tex.x-(pixelWidth*xshift),1.0);
	tex.y = mod(tex.y-(pixelHeight*yshift),1.0);
		
	gl_FragColor = texture2D(samplerFront,tex);
}