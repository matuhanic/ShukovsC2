/////////////////////////////////////////////////////////
// Flag effect
varying lowp vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform lowp float pixelHeight;
uniform lowp float red;
uniform lowp float green;
uniform lowp float blue;
uniform lowp float drange;

void main(void)
{   
	lowp vec4 front = texture2D(samplerFront, vTex);
	lowp float gray = front.r * 0.299 + front.g * 0.587 + front.b * 0.114;
	
	if (drange != 1.0) gray -= mod(gray,1.01-drange);
	
    gl_FragColor = vec4(red * gray, green*gray, blue*gray, front.a);
}
	