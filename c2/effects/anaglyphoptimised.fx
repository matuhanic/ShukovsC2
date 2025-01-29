/////////////////////////////////////////////////////////
// anaglyphoptimised effect
// optimised with gamma
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;
uniform mediump float gamma;

void main(void)
{
	// Retrieve front and back pixels
	lowp vec4 front = texture2D(samplerFront, vTex);
	lowp vec4 back = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	
      front.r =  ((front.g * 0.73 + front.b * 0.30) * 1.20) * front.a;      
	front.g =  (back.g * 1.00) * front.a;
	front.b =  (back.b * 1.00) * front.a;
		
	
      gl_FragColor = vec4(pow(front.rgb, vec3(gamma)), front.a);
}
