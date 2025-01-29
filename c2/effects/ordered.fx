// Written by xTibor / 2013
// The following shader program released into the public domain.
// For more information, visit <http://unlicense.org/>
// Gigatron for C2 .//.
precision highp float;

uniform float textureSizeWidth; //width of the texture
uniform float textureSizeHeight; //height of the texture
uniform float texelSizeX; //width of one texel 
uniform float texelSizeY; //height of one texel 
uniform mediump float seconds;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
varying mediump vec2 vTex;
uniform sampler2D samplerFront;
uniform sampler2D samplerBack;
vec2 iResolution = vec2( 1.0/pixelWidth, 1.0/pixelHeight);
uniform float factor;

void main()
{
	
	vec2 uv=(1.*vTex);
	vec2 lResolution =  vec2(256.*factor, 256.0*factor);//iResolution.xy/2.0 ;256*192
	vec2 lPixel = floor(uv * lResolution);
	vec4 lTextureColour = texture2D(samplerFront, lPixel / lResolution);
	
	int lDitherIndex = int(mod(lPixel.x,4.0)) * 4 + int(mod(lPixel.y, 4.0));
		
	int lI = 0; 
	float lDitherValue = 0.0;	
	     if (lI++ == lDitherIndex) lDitherValue =  1.0;
	else if (lI++ == lDitherIndex) lDitherValue =  9.0;
	else if (lI++ == lDitherIndex) lDitherValue =  3.0;
	else if (lI++ == lDitherIndex) lDitherValue = 11.0;
	else if (lI++ == lDitherIndex) lDitherValue = 13.0;
	else if (lI++ == lDitherIndex) lDitherValue =  5.0;
	else if (lI++ == lDitherIndex) lDitherValue = 15.0;
	else if (lI++ == lDitherIndex) lDitherValue =  7.0;
	else if (lI++ == lDitherIndex) lDitherValue =  4.0;
	else if (lI++ == lDitherIndex) lDitherValue = 12.0;
	else if (lI++ == lDitherIndex) lDitherValue =  2.0;
	else if (lI++ == lDitherIndex) lDitherValue = 10.0;
	else if (lI++ == lDitherIndex) lDitherValue = 16.0;
	else if (lI++ == lDitherIndex) lDitherValue =  8.0;
	else if (lI++ == lDitherIndex) lDitherValue = 14.0;
	else if (lI++ == lDitherIndex) lDitherValue =  6.0;
	lDitherValue /= 16.0;
	//lDitherValue = pow(lDitherValue, clamp(seconds/10.0, 0.0, 2.0));
	
	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	
	if (lDitherValue < lTextureColour.r) gl_FragColor += vec4(1.0, 0.0, 0.0, 1.0);
	if (lDitherValue < lTextureColour.g) gl_FragColor += vec4(0.0, 1.0, 0.0, 1.0);
	if (lDitherValue < lTextureColour.b) gl_FragColor += vec4(0.0, 0.0, 1.0, 1.0);	
}