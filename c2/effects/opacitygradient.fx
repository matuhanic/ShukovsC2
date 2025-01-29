/////////////////////////////////////////////////////////
// Opacity Gradient effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float pixelWidth;
uniform lowp float pixelHeight;

uniform lowp float opacityx;
uniform lowp float heightx;
uniform lowp float opacityy;
uniform lowp float heighty;

void main(void)
{
	lowp vec4 front = texture2D(samplerFront, vTex);
	mediump float ay = vTex.y*((1 - opacityy) / heighty) + opacityy;
	mediump float ax = vTex.x*((1 - opacityx) / heightx) + opacityx;

	gl_FragColor = front*min(ax*ay,1.0);
}
