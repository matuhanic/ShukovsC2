/////////////////////
// anaglyphdubois2 effect
// dubois2
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
	
	front.r = ((front.r * 0.456 + front.g * 0.500 + front.b * 0.176) + (back.r * -0.043 + back.g * -0.088 + back.b * -0.002))* front.a;
	front.g = ((front.r * -0.040 + front.g * -0.038 + front.b * -0.016) + (back.r * 0.378 + back.g * 0.734 + back.b * -0.018))* front.a;
	front.b = ((front.r * -0.015 + front.g * -0.021 + front.b * -0.005) + (back.r * -0.072 + back.g * -0.113 + back.b * 1.266))* front.a;
	
	
       gl_FragColor = vec4(pow(front.rgb, vec3(gamma)), front.a);
      
 }
