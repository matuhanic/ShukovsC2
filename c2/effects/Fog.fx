/////////////////////////////////////////////////////////
// Fog effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float red;
uniform lowp float green;
uniform lowp float blue;
uniform lowp float blend;

void main(void)
{
	lowp float a = texture2D(samplerFront, vTex).a;
	lowp vec4 front = texture2D(samplerFront, vTex);
	
	gl_FragColor = mix (front, vec4(vec3(red/255.0, green/255.0, blue/255.0) * a, a), blend);
}
