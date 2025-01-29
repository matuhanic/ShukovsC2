precision mediump float;

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float seconds;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
uniform mediump float layerScale;

uniform float mseX;
uniform float mseY;
uniform float speed;
uniform float angvel;

float iGlobalTime = seconds;
vec2 iResolution = vec2( 1./pixelWidth, 1./pixelHeight);
vec2 mouse = vec2(mseX, mseY);

#define PI 3.14159
#define E 0.0001

void main(void)
{
	vec2 p = (gl_FragCoord.xy - mouse) / iResolution.xy * vec2(iResolution.x / iResolution.y, 1.0);

	if(mseX == -1.0)
		if (mseY == -1.0)
			p = (2.0 * gl_FragCoord.xy / iResolution.xy - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);

			vec2 t = vec2(2.0 / PI * atan(p.x, p.y), 1.0 / max(length(p), E));
	vec3 c = texture2D(samplerFront, t + vec2(iGlobalTime * angvel, iGlobalTime * speed)).xyz;
	gl_FragColor = vec4(c / t.y, 1.0);
}