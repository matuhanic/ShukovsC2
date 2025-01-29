precision mediump float;

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;

// Construct 2 variables
uniform float seconds;
uniform float pixelWidth;
uniform float pixelHeight;

// Define your variables here
uniform float mseX;
uniform float mseY;
uniform float spirals, speed, intensity;
uniform float ARed, AGreen, ABlue;
uniform float BRed, BGreen, BBlue;

// Heroku variables
float time = seconds;
vec2 mouse = vec2(mseX, mseY);
vec2 resolution = vec2(1./pixelWidth, 1./pixelHeight);

const float pi=3.14159265359;
vec3 color;

void main( void ) {
	vec2 pos = ((gl_FragCoord.xy - mouse)/ resolution.xy );
	gl_FragColor = texture2D(samplerFront, vTex);

	float l=length(pos);
	float f=fract((atan(pos.x,pos.y) + fract(-time/speed)*pi + 1.0/ sqrt(l))/pi*spirals)*2.0;
	
	if(f<1.0)
		color=vec3(ARed, AGreen, ABlue);
	else
		color=vec3(BRed, BGreen, BBlue);
	
	f=fract(f-0.5)*2.0-1.0;
	f=clamp(sqrt(-f*f+intensity*f)*sqrt(l), 0.0, 1.0);
	gl_FragColor*=vec4(f*l*color,1.0);
}