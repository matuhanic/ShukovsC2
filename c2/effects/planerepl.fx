/////////////////////////////////////////////////////////
// Plane Replace
// Replaces plane red with red, green or blue.
// Does the same for each plane.
//
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float rsource;
uniform mediump float gsource;
uniform mediump float bsource;

void main(void)
{
	lowp vec4 front = texture2D(samplerFront, vTex);
	lowp vec4 destina=front;
	
	if (abs(rsource-1.0)<0.2) {
		destina.r = front.r;
	} else if (abs(rsource-2.0)<0.2) {
		destina.r=front.g;
	} else if (abs(rsource-3.0)<0.2) {
		destina.r=front.b;
	}
	if (abs(gsource-1.0)<0.2){
		destina.g = front.r;
	} else if (abs(gsource-2.0)<0.2) {
		destina.g=front.g;
	} else if (abs(gsource-3.0)<0.2) {
		destina.g=front.b;
	}
	if (abs(bsource-1.0)<0.2) {
		destina.b = front.r;
	} else if (abs(bsource-2.0)<0.2) {
		destina.b=front.g;
	} else if (abs(bsource-3.0)<0.2) {
		destina.b=front.b;
	}
	gl_FragColor = destina;
}
