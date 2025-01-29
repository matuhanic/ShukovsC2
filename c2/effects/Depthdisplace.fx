/////////////////////////////////////////////////////////
// Depthdisplace effect
//chrisbrobs..modification the original CC effect by david clarke.

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
uniform mediump float intensity;
uniform mediump float XdisplaceAmount;
uniform mediump float YdisplaceAmount;


void main(void)
{	
	lowp vec4 front = texture2D(samplerFront, vTex);

     mediump vec2 position = vTex;


	mediump float diffx = (0.5 - front.r);	
	mediump float diffy = (0.5 - front.g);

	
	mediump float Xshift = (intensity * (pixelWidth/2.0));
	mediump float Yshift = (intensity * (pixelHeight/2.0));  

 	position.x += diffx * Xshift * XdisplaceAmount * front.a;
	position.y += diffy * Yshift * YdisplaceAmount * front.a;

       
	gl_FragColor = texture2D(samplerBack, mix(destStart, destEnd, position.xy));

}


