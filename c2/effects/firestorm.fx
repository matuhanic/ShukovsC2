precision mediump float;

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform float seconds;
uniform float pixelWidth;
uniform float pixelHeight;
uniform float layerScale;

float rand(vec2 n) 
{
	return fract(cos(dot(n, vec2(13.1435, 5.1345))) * 35673.4560);
}

float noise(vec2 n) 
{
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) 
{
	float total = 0.0, amplitude = 1.0;
	for (int i = 0; i < 4; i++) 
	{
		total += noise(n) * amplitude;
		n += n;
		amplitude *= 0.5;
	}
	return total;
}

void main() 
{
	const vec3 c1 = vec3(0.1, 0.1, 0.1);
	const vec3 c2 = vec3(0.9, 0.0, 0.0);
	const vec3 c3 = vec3(0.1, 0.0, 0.0);
	const vec3 c4 = vec3(0.8, 0.7, 0.0);
	
	vec2 iResolution = vec2(pixelWidth, pixelHeight) * 180000.;
	gl_FragColor = texture2D(samplerFront, vTex);
	
	vec2 p = gl_FragCoord.xy / iResolution.xx;
	float q = fbm(p - seconds * 0.1);
	vec2 r = vec2(fbm(p + q + seconds * 1.0 - p.x - p.y), fbm(p + q - seconds * 1.4));
	vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x);
	gl_FragColor *= vec4(c * cos(gl_FragCoord.y / (iResolution.y * 40.0)), 1.0);
}