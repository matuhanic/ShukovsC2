////////////////////////////////////////////////////////////////////
// Erosion & Dilation Filter
// by oppenheimer
////////////////////////////////////////////////////////////////////

precision mediump float;

uniform lowp sampler2D samplerFront;
varying mediump vec2 vTex;
uniform float pixelWidth;
uniform float pixelHeight;

uniform float mode, stepsX, stepsY, pX, pY, intensity;

const int size = 10; //modify sampling kernel if needed

#define between(v,x1,x2) (v> x1 && v<x2)

void main (void)
{if ((mode != 0.0) && (mode != 1.0)) {discard;} //skip if no mode is set
	vec4 value; 

	// if (mode == 0.0) { //erosion
		if (mode == 0.0) value = vec4(1.0); //erosion
		if (mode == 1.0) value = vec4(0.0); //dilation
		for(int i=-size; i<=size; i++) {
			for(int j=-size; j<=size; j++)
			{			
				//kernel limitation
				if ((between(float(i), -stepsX, stepsX)) && (between(float(j), -stepsY, stepsY)))
				{
					vec2 offset = vec2(float(i)*pixelWidth,float(j)*pixelHeight)*vec2(pX,pY);
					vec4 color = texture2D(samplerFront, vTex+offset);
					
					//erosion
					if (mode == 0.0) {
						if(value.r > color.r) value.r = color.r;
						if(value.g > color.g) value.g = color.g;
						if(value.b > color.b) value.b = color.b;					
						if(value.a > color.a) value.a = color.a;
					}
					
					//dilation
					if (mode == 1.0) {
						if(value.r < color.r) value.r = color.r;
						if(value.g < color.g) value.g = color.g;
						if(value.b < color.b) value.b = color.b;					
						if(value.a < color.a) value.a = color.a;
					}
				}
			}
		}

	if (intensity == 1.0) gl_FragColor = value; //just output the value
    
	if (intensity == 0.0) gl_FragColor = texture2D(samplerFront, vTex); //output original
	
	if (between(intensity,0.0, 1.0)){ // mix with original
		lowp vec4 front = texture2D(samplerFront, vTex);
		gl_FragColor = mix(front, value, intensity);
	}
}