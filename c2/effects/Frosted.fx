/////////////////////////////////////////////////////////
// Frosted effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform lowp float pixelWidth;
uniform lowp float pixelHeight;
uniform mediump float strength;

// Random function courtesy of ajgryc
highp float rand(highp vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return 0.5-fract(sin(sn) * c);
}

void main(void)
{	
	mediump vec2 tex = vTex;
	
	tex.x += rand(vTex.xy)*pixelWidth*strength;
	tex.y -= rand(vTex.xy+0.1)*pixelHeight*strength;
		
	gl_FragColor = texture2D(samplerFront, tex);
}