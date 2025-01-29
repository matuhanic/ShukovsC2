/////////////////////////////////////////////////////////
// Trim effect
//
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float trimw;
uniform mediump float trimh;

precision lowp float;

void main(void)
{
	lowp vec4 front = texture2D(samplerFront, vTex);

	if (vTex.x > trimw || vTex.y > trimh){
		discard;
		}
	
	gl_FragColor = front;
}