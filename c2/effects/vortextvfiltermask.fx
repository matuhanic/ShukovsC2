/*
*
* vortextvfiltermask.fx
* Use this file to create a awesome old tv effect.
*
* Version 1.1
*
* Developed by Vortex Game Studios LTDA ME. (http://www.vortexstudios.com)
* Authors:		Alexandre Ribeiro de Sa (@themonkeytail)
*
*
* LOG:
* 1.1 - Now you can disable the scanline if need (just set as 0)
*		Solved pixel distorion on the borders
* 1.0 - First build
*/

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;
uniform mediump float seconds;

uniform lowp float saturation;
uniform lowp float chromaticAberration;

uniform lowp float tubeNoise;
uniform lowp float tubeStatic;

uniform	mediump float tubeScanline;
uniform	mediump float tubeScanlineMagnetude;
uniform lowp float tubeDistortion;
uniform lowp float tubeReflex;

mediump vec2 TubeDistortion( mediump vec2 inUV ) {
	lowp float minSize = tubeDistortion * 0.098;
	lowp float maxSize = 1.0 - (minSize);

	mediump vec2 outUV = inUV;
	outUV *= (maxSize - minSize);
	outUV += minSize;

	lowp vec2 cc = outUV - 0.5;
	lowp float dt = dot(cc, cc)*tubeDistortion;
	return outUV + cc*(1.0 + dt)*dt;
}

void main(void)
{
	// Tube distortion
	mediump vec2 frontUV = TubeDistortion(vTex);

	if( frontUV.x < 0.0 || frontUV.x > 1.0 || frontUV.y < 0.0 || frontUV.y > 1.0 ) {
		gl_FragColor = vec4(0.0,0.0,0.0,1.0);
	} else {
		// Noise
		mediump float seconds_mod = mod(seconds, 10.0);
		
		mediump vec3 noise = vec3(fract(sin(dot(vTex.xy, vec2(12.9898,78.233)) + seconds_mod) * 43758.5453),
								  fract(sin(dot(vTex.yx, vec2(12.9898,-78.233)) + seconds_mod) * 43758.5453),
								  fract(sin(dot(vTex.xy, vec2(-12.9898,-78.233)) + seconds_mod) * 43758.5453)) * tubeNoise;

		lowp float staticNoise = fract(sin(dot(vTex.yy, vec2(0.5,0.5)) + seconds_mod) * 43758.5453) * tubeStatic;
		staticNoise -= staticNoise/2.0;

		// Front
		lowp vec4 front = texture2D(samplerFront, frontUV);
		front.b = front.b*staticNoise;

		mediump vec2 backUV = TubeDistortion(mix(destStart, destEnd, vTex + vec2(front.b,0.0)));
		lowp vec4 back = texture2D(samplerBack, backUV);
		back.r = texture2D(samplerBack, TubeDistortion(mix(destStart, destEnd, vTex  + vec2(chromaticAberration*0.1,0.0) + vec2(front.b,0.0)))).r;
		back.b = texture2D(samplerBack, TubeDistortion(mix(destStart, destEnd, vTex  - vec2(chromaticAberration*0.1,0.0) + vec2(front.b,0.0)))).b;

		// Scanline
		mediump float scanLine = 1.0;
		if( tubeScanline > 0.0 && tubeScanlineMagnetude != 0.0 ) {
			scanLine = abs(sin(frontUV.y*(tubeScanline*2.0)));
			scanLine *= tubeScanlineMagnetude;
			scanLine += 1.0-tubeScanlineMagnetude;
		}

		// Mix everythig
		gl_FragColor.rgb = ((noise + back.rgb) * scanLine + (front.g * tubeReflex)) * front.r ;
		gl_FragColor.a = front.a;
		
		// Saturation
		lowp float gray = gl_FragColor.r * 0.2126 + gl_FragColor.g * 0.7152 + gl_FragColor.b * 0.0722;
		gl_FragColor = mix(gl_FragColor, vec4(gray, gray, gray, 1.0), saturation);
	}
}
