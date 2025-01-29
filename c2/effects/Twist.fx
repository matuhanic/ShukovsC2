/////////////////////////////////////////////////////////
// Scroll effect
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float seconds;

uniform lowp float twists;
uniform lowp float time;
uniform lowp float shadow;

void main(void)
{	
	mediump vec2 tex = vTex;
	
	lowp float ratio = sin((mod(seconds,time)/time+tex.x)*twists*6.28318530718);
	
	tex.y -= 0.5-ratio/2.0;
	
	tex.y /= ratio;
	lowp vec4 front = texture2D(samplerFront, tex);
	if (ratio < 0.0) front.rgb *= shadow;
		
	gl_FragColor = front;
}