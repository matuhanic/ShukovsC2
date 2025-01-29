/////////////////////////////////////////////////////////
// Dots effect
//
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float pixelWidth;
uniform lowp float pixelHeight;

uniform mediump float dotsx;
uniform mediump float dotsy;

precision lowp float;

void main(void)
{
	lowp vec4 front = texture2D(samplerFront, vTex);

	if (mod((vTex.x/pixelWidth),dotsx) > 1.0 || mod((vTex.y/pixelHeight),dotsy) > 1.0){
		discard;
		}
	
	gl_FragColor = front;
}