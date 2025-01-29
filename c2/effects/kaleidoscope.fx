precision mediump float;

uniform mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform float seconds;
uniform float pixelWidth;
uniform float pixelHeight;

uniform float speed;

float iGlobalTime = seconds;
vec2 iResolution = vec2(1./pixelWidth, 1./pixelHeight);

void main(void)
{
	vec2 uv = -1. + 2. * gl_FragCoord.xy / iResolution.xy;
	float a = iGlobalTime * speed / 10.;
	for (float i = 1.; i < 8.; i += 1.) 
	{
		uv = vec2(sin(a)*uv.y - cos(a)*uv.x, sin(a)*uv.x + cos(a)*uv.y);
		uv = abs(fract(uv/2.) - .5) * 2.;
	}
	gl_FragColor = texture2D(samplerFront, abs(fract(uv) - .5)*2.);
}