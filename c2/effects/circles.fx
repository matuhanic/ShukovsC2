	precision mediump float;

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float seconds;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
uniform mediump float layerScale;

uniform float mseX;
uniform float mseY;
uniform float distancebetweencircles;
uniform float zoomfactor;
	
void main(void)
{
	mediump vec2 resolution = vec2(pixelWidth, pixelHeight);
	gl_FragColor = texture2D(samplerFront, vTex);
	mediump vec2 mouse = vec2(mseX, mseY);
	
	vec2 uv = (gl_FragCoord.xy - mouse) * 1. / distancebetweencircles / zoomfactor;

	vec2 movingOrigin1 = vec2(sin(seconds*.7),+sin(seconds*1.7));
	float wavePoint1 = sin(distance(movingOrigin1, uv)*distancebetweencircles);
	float blackOrWhite1 = sign(wavePoint1);
	
	vec2 movingOrigin2 = vec2(-cos(seconds*2.0),-sin(seconds*3.0));
	float wavePoint2 = sin(distance(movingOrigin2, uv)*distancebetweencircles);
	float blackOrWhite2 = sign(wavePoint2);
	
	vec2 movingOrigin3 = vec2(cos(seconds*1.7),cos(seconds*0.7));
	float wavePoint3 = sin(distance(movingOrigin3, uv)*distancebetweencircles);
	float blackOrWhite3 = sign(wavePoint3);
	
	vec3 color1 = vec3(1.0, 0.1, 0.1);
	vec3 color2 = vec3(0.1, 1.0, 0.1);
	vec3 color3 = vec3(0.1, 0.1, 1.0);

	float composite1 = blackOrWhite1 * blackOrWhite2;
	float composite2 = blackOrWhite2 * blackOrWhite3;
	float composite3 = blackOrWhite3 * blackOrWhite1;
	
	gl_FragColor *= vec4(max((color1 * composite1), max(color2*composite2, color3*composite3)), 1.0);
}