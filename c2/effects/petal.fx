precision mediump float;

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform float seconds;
uniform float pixelWidth;
uniform float pixelHeight;
uniform float layerScale;

uniform float mseX;
uniform float mseY;
uniform float petals;
uniform float zoom;
uniform float contrast;

void main( void ) {
	vec2 resolution = vec2(pixelWidth, pixelHeight);
	gl_FragColor = texture2D(samplerFront, vTex);
	vec2 mouse = vec2(mseX, mseY);

	vec2 position = gl_FragCoord.xy/layerScale - mouse;
	float r = length(position) / 100.0;
	float a = atan(position.y, position.x);
	float t = seconds + zoom/(r + 1.0);	
	float light = 30.0*abs(0.05*(sin(t)+sin(seconds+a*petals)));
	vec3 color = vec3(-sin(r*1.0-a-seconds+sin(r+t)), cos(r*2.0+a-seconds+sin(r+t)), cos(r+a*3.0+a+seconds)-sin(r+t));
	gl_FragColor *= vec4((normalize(color)+contrast) * light , 1.0);
}