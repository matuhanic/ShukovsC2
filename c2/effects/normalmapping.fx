precision mediump float;

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float seconds;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
uniform mediump float layerScale;

uniform float mseX;
uniform float mseY;
uniform float lightflag;
uniform float lightdepth;
uniform float specularity;

float iGlobalTime = seconds;
vec2 iResolution = vec2( 1./pixelWidth, 1./pixelHeight);
vec2 mouse = vec2(mseX, mseY);

#define PI 3.14159

#define OFFSET_X 1
#define OFFSET_Y 1

vec3 sample(const int x, const int y)
{
	vec2 uv = (gl_FragCoord.xy + vec2(x, y)) / iResolution.xy;
	return texture2D(samplerFront, uv).xyz;
}

vec3 normal(void)
{
	float R = (dot(sample( OFFSET_X, 0), vec3(.2126, .7152, .0722)));
	float L = (dot(sample(-OFFSET_X, 0), vec3(.2126, .7152, .0722)));
	float D = (dot(sample(0,  OFFSET_Y), vec3(.2126, .7152, .0722)));
	float U = (dot(sample(0, -OFFSET_Y), vec3(.2126, .7152, .0722)));
	return normalize(vec3((L - R) * .5, (U - D) * .5, 1. / lightdepth));
}

void main(void)
{
	vec3 n = normal();
		
	vec3 ep = vec3(iResolution.x * .5, (iResolution.y) * .5, 500.);
	vec3 lp = vec3(mouse.xy, 50.);
	vec3 sp = vec3(gl_FragCoord.xy, 0.);
	vec3 c = sample(0, 0) * dot(n, normalize(lp - sp));
	if (lightflag == 1.0)
		c += pow(clamp(dot(normalize(reflect(lp - sp, n)), normalize(sp - ep)), 0., 1.), specularity);

	gl_FragColor = 1.0 * texture2D(samplerFront, vTex) + vec4(c, gl_FragColor.a);
}