/////////////////////////////////////////////////////////
// Dissolve
//
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float threshold;

precision lowp float;

mediump float rand()
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(vTex.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

void main(void)
{
	lowp vec4 front = texture2D(samplerFront, vTex);

	if (rand() < threshold){
	discard;
	}
	
	gl_FragColor = front;
}