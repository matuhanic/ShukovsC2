/////////////////////////////////////////////////////////
// anaglyphdubois1 effect
// dubois1
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;
uniform mediump float gamma;

void main(void)
{
	lowp vec4 front = texture2D(samplerFront, vTex);
	lowp vec4 back = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	
	// combine front and back channels
		
	front.r =  ((front.r * 0.437 + front.g * 0.449 + front.b * 0.164)  + (back.r * -0.011 + back.g * -0.032 + back.b * -0.070)) * front.a;
	front.g =  ((front.r * 0.062 + front.g * -0.062 + front.b * -0.024) + (back.r * 0.377 + back.g * 0.761 + back.b * 0.009))* front.a;
	front.b =  ((front.r * 0.048 + front.g * -0.050 + front.b * -0.017) + (back.r * -0.026 + back.g * -0.093 + back.b * 1.234))* front.a;
	
	//render ananaglyph with gamma settings
	
	 gl_FragColor = vec4(pow(front.rgb, vec3(gamma)), front.a);	

}
