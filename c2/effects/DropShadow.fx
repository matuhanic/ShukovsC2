/////////////////////////////////////////////////////////
// Drop shadow effect
//
varying lowp vec2 vTex;
uniform lowp sampler2D samplerFront;

precision lowp float;
uniform lowp float pixelWidth;
uniform lowp float pixelHeight;

uniform lowp float xoffset;
uniform lowp float yoffset;
uniform lowp float opacity;

void main(void)
{	
	vec4 front = texture2D(samplerFront, vTex);
	
    lowp float A = texture2D(samplerFront, vTex + vec2(-xoffset*pixelWidth, yoffset*pixelHeight)).a;
	
	gl_FragColor = vec4(front.rgb,front.a+A*opacity);
}