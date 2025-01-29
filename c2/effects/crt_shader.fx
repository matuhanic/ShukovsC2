/*
***********************************************************************************
    CRT shader

    Original shader by cgwg, Themaister and DOLLS

    This program is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

***********************************************************************************
*/

precision highp float;

varying highp vec2 vTex;

uniform lowp sampler2D samplerFront;
uniform highp float WindowsWidth;
uniform highp float WindowsHeight;

uniform mediump float pixelWidth;
uniform mediump float pixelHeight;

vec2 textureBaseSize = vec2(WindowsWidth, WindowsHeight);
vec2 textureScaledSize = vec2(WindowsWidth*2.0, WindowsHeight*2.0);

#define TEX2D(c) pow(abs(texture2D(samplerFront, (c))), vec4(inputGamma))

// Assume NTSC 2.2 Gamma for linear blending
#define inputGamma 2.2

// Simulate a CRT gamma of 2.5
#define outputGamma 2.5

// Macros.
#define FIX(c) max(abs(c), 1e-5);
#define PI 3.141592653589

uniform mediump float distort;
uniform mediump float border;

vec2 overscan = vec2(0.98, 0.98);

float aspect = pixelHeight / pixelWidth;

uniform mediump float distortion;
uniform mediump float cornersize;
uniform mediump float cornersmooth;

vec4 scanlineWeights(float distance, vec4 color)
{
	vec4 wid = 0.5 + 2.0 * pow(color, vec4(4.0));
	vec4 weights = vec4(distance * 3.333333);                
	return 0.51 * exp(-pow(weights * sqrt(2.0 / wid), wid)) / (0.18 + 0.06 * wid);
}

float corner(vec2 coord)
{
	coord = (coord - vec2(0.5)) * overscan + vec2(0.5);
	coord = min(coord, vec2(1.0)-coord) * aspect;
	vec2 cdist = vec2(cornersize/100.0);
	coord = (cdist - min(coord,cdist));
	float dist = sqrt(dot(coord,coord));
	return clamp((cdist.x-dist)*cornersmooth,0.0, 1.0);
}

vec2 radialDistortion(vec2 coord)
{
		coord *= textureScaledSize / textureBaseSize;
		vec2 cc = coord - 1.0;
		float dist = dot(cc, cc) * (distortion/100.0);                
		return (coord + cc * (1.0 + dist) * dist) * textureBaseSize / textureScaledSize;
}

void main()
{
    vec2 one = 1.0 / textureBaseSize;
    vec2 _xy;
    
    if (distort == 1.0) _xy = radialDistortion(vTex);
    else _xy = vTex;

	// Of all the pixels that are mapped onto the texel we are
	// currently rendering, which pixel are we currently rendering?
	vec2 uv_ratio = fract(_xy * textureBaseSize) - vec2(0.5);

    float cval = corner(_xy);

	// Snap to the center of the underlying texel.                
	_xy = (floor(_xy * textureBaseSize) + vec2(0.5)) / textureBaseSize;

	// Calculate Lanczos scaling coefficients describing the effect
	// of various neighbour texels in a scanline on the current
	// pixel.     
    vec4 coeffs = PI * vec4(1.0 + uv_ratio.x, uv_ratio.x, 1.0 - uv_ratio.x, 2.0 - uv_ratio.x);

	// Prevent division by zero
	coeffs = FIX(coeffs);
	coeffs = 2.0 * sin(coeffs) * sin(coeffs / 2.0) / (coeffs * coeffs);
	
	// Normalize
	coeffs /= dot(coeffs, vec4(1.0));

	// Calculate the effective colour of the current and next
	// scanlines at the horizontal location of the current pixel,
	// using the Lanczos coefficients above.
	vec4 col  = clamp(coeffs.x * TEX2D(_xy + vec2(-one.x, 0.0))   + coeffs.y * TEX2D(_xy)+ coeffs.z * TEX2D(_xy + vec2(one.x, 0.0)) + coeffs.w * TEX2D(_xy + vec2(2.0 * one.x, 0.0)),   0.0, 1.0);
    vec4 col2 = clamp(coeffs.x * TEX2D(_xy + vec2(-one.x, one.y)) + coeffs.y * TEX2D(_xy + vec2(0.0, one.y)) + coeffs.z * TEX2D(_xy + one)+ coeffs.w * TEX2D(_xy + vec2(2.0 * one.x, one.y)), 0.0, 1.0);

	// Calculate the influence of the current and next scanlines on
	// the current pixel.	
    vec4 weights  = scanlineWeights(abs(uv_ratio.y) , col);
    vec4 weights2 = scanlineWeights(1.0 - uv_ratio.y, col2);
	vec3 mul_res  = (col * weights + col2 * weights2).xyz;
	
	// mod_factor is the x-coordinate of the current output pixel.
    float mod_factor = vTex.x * textureScaledSize.x / textureScaledSize.x;
	
	// dot-mask emulation:
	// Output pixels are alternately tinted green and magenta.
    vec3 dotMaskWeights = mix( vec3(1.0, 0.75, 1.0), vec3(0.75, 1.0, 0.75), floor(mod(mod_factor, 2.4)) );
    
    mul_res *= dotMaskWeights;
    
	// Convert the image gamma for display on our output device.
    if (border == 1.0) mul_res = pow(abs(mul_res), vec3(1.0 / (2.0 * inputGamma - outputGamma)))* vec3(cval);
    else mul_res = pow(abs(mul_res), vec3(1.0 / (2.0 * inputGamma - outputGamma)));
    
    gl_FragColor = vec4(mul_res, 1.0);
}
