/////////////////////////////////////////////////////////
// Skend effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform lowp float pixelWidth;
uniform lowp float pixelHeight;
uniform lowp float Skend;

void main(void)
{	
	mediump vec2 tex = vTex;

	tex.y -= (pixelHeight*Skend)*pow(tex.x,2.0);
		
	gl_FragColor = texture2D(samplerFront,tex);
}