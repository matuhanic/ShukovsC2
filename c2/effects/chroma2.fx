/////////////////////////////////////////////////////////
// Chroma 2
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float rsource;
uniform mediump float gsource;
uniform mediump float bsource;
uniform mediump float rdest;
uniform mediump float gdest;
uniform mediump float bdest;
uniform lowp float tolerance;

void main(void)
{
	lowp vec4 front = texture2D(samplerFront, vTex);
	front.rgb /= front.a;
	
	// Calculate distance from source color
	lowp float diff = length(front.rgb - vec3(rsource, gsource, bsource) / 255.0);
	
	if (diff <= tolerance)
	{
		front.a=0.0;
	}
	
	front.rgb *= front.a;
	gl_FragColor = front;
}
