precision mediump float;

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float seconds;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
uniform mediump float layerScale;

uniform float vtype;
uniform float layer2;
uniform float layer3;
uniform float layer1thickness;
uniform float layer2thickness;
uniform float layer3thickness;
uniform float layer1zoom;
uniform float layer2zoom;
uniform float layer3zoom;
uniform float layer1speed;
uniform float layer2speed;
uniform float layer3speed;
uniform float red;
uniform float green;
uniform float blue;

float iGlobalTime = seconds;
vec2 iResolution = vec2( 1./pixelWidth, 1./pixelHeight);

#define PI 3.14159

vec2 randvec2(in vec2 p)
{
	return fract(vec2(sin(p.x * 591.32 + p.y * 154.077), cos(p.x * 391.32 + p.y * 49.077)));
}

float voronoi(in vec2 x)
{
	vec2 res = vec2(1.0);
	for(int j = -1; j <= 1; j ++)
	{
		for(int i = -1; i <= 1; i ++)
		{
			vec2 r = vec2(i, j) - fract(x) + randvec2(floor(x) + vec2(i, j));
			
			float d;
			if(vtype == 1.0)
				d = max(abs(r.x), abs(r.y));
			else
				d = length(r);
			
			if(d < res.x)
			{
				res.y = res.x;
				res.x = d;
			}
			else if(d < res.y)
			{
				res.y = d;
			}
		}
	}
	return res.y - res.x;
}

void main(void)
{
	float va, vb, vc, v;
	
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	uv = (uv - 0.5) * 2.0;
	uv.x *= iResolution.x / iResolution.y;
	
	va = smoothstep(0.0, layer1thickness, voronoi(uv * layer1zoom + iGlobalTime / layer1speed));
	if(layer2 == 1.0)
		vb = smoothstep(0.0, layer2thickness, voronoi(uv * layer2zoom + iGlobalTime / layer2speed));
	else
		vb = 1.0;
	if(layer3 == 1.0)
		vc = smoothstep(0.0, layer3thickness, voronoi(uv * layer3zoom + iGlobalTime / layer3speed));
	else
		vc = 1.0;
	v = va * vb * vc;

	gl_FragColor = texture2D(samplerFront, vTex) * vec4(vec3(pow(v, 10.0 - red), pow(v, 10.0 - green), pow(v, 10.0 - blue)), 1.0);
}
