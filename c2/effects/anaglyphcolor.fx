/////////////////////////////////////////////////////////
// anaglyphcolor effect
// color
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;

void main(void)
{
	// Retrieve front and back pixels
	lowp vec4 front = texture2D(samplerFront, vTex);
	lowp vec4 back = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	

      	// Calculate anaglyph amount
            //lowp float gray = front.r * 0.114 + front.g * 0.299 + front.b * 0.587;

      front.r =  (front.r * 1.0) * front.a;
      front.g =  (back.g * 1.0) * front.a;
	front.b =  (back.b * 1.0) * front.a;
      
		
	gl_FragColor = front;
}
