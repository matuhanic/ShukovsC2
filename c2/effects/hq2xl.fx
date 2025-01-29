﻿/////////////////////////////////////////////////////////
// HQ2X Pixel Shader Layout
// By Anata
/////////////////////////////////////////////////////////

precision highp float;

varying vec2 texCoord;
varying highp vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform highp float pixelWidth;
uniform highp float pixelHeight;

uniform highp float WindowsWidth;
uniform highp float WindowsHeight;

const float mx = 0.325;
const float k = -0.250;
const float max_w = 0.25;
const float min_w =-0.05;
const float lum_add = 0.25;

void main()                                            
{
	vec4 front = texture2D(samplerFront, vTex);

	float x = 0.5 * (1.0 / WindowsWidth);
	float y = 0.5 * (1.0 / WindowsHeight);
	
	vec2 dg1 = vec2( x, y);
	vec2 dg2 = vec2(-x, y);
	vec2 dx = vec2(x, 0.0);
	vec2 dy = vec2(0.0, y);

	vec2 fp  = fract(vTex.xy*vec2(WindowsWidth,WindowsHeight));
    vec2 TexCoord_0 = vTex.xy-fp*vec2(0.0009765625, 0.001953125);
	
	highp vec4 TexCoord[6];
	TexCoord[0] = vec4(vTex, 0.0, 0.0);
	TexCoord[1].xy = TexCoord[0].xy - dg1;
	TexCoord[1].zw = TexCoord[0].xy - dy;
	TexCoord[2].xy = TexCoord[0].xy - dg2;
	TexCoord[2].zw = TexCoord[0].xy + dx;
	TexCoord[3].xy = TexCoord[0].xy + dg1;
	TexCoord[3].zw = TexCoord[0].xy + dy;
	TexCoord[4].xy = TexCoord[0].xy + dg2;
	TexCoord[4].zw = TexCoord[0].xy - dx;

	highp vec3 c00 = texture2D(samplerFront, TexCoord[1].xy).xyz; 
	highp vec3 c10 = texture2D(samplerFront, TexCoord[1].zw).xyz; 
	highp vec3 c20 = texture2D(samplerFront, TexCoord[2].xy).xyz; 
	highp vec3 c01 = texture2D(samplerFront, TexCoord[4].zw).xyz; 
	highp vec3 c11 = texture2D(samplerFront, TexCoord[0].xy).xyz; 
	highp vec3 c21 = texture2D(samplerFront, TexCoord[2].zw).xyz; 
	highp vec3 c02 = texture2D(samplerFront, TexCoord[4].xy).xyz; 
	highp vec3 c12 = texture2D(samplerFront, TexCoord[3].zw).xyz; 
	highp vec3 c22 = texture2D(samplerFront, TexCoord[3].xy).xyz; 
	highp vec3 dt = vec3(1.0, 1.0, 1.0);

	float md1 = dot(abs(c00 - c22), dt);
	float md2 = dot(abs(c02 - c20), dt);

	float w1 = dot(abs(c22 - c11), dt) * md2;
	float w2 = dot(abs(c02 - c11), dt) * md1;
	float w3 = dot(abs(c00 - c11), dt) * md2;
	float w4 = dot(abs(c20 - c11), dt) * md1;

	float t1 = w1 + w3;
	float t2 = w2 + w4;
	float ww = max(t1, t2) + 0.0001;

	c11 = (w1 * c00 + w2 * c20 + w3 * c22 + w4 * c02 + ww * c11) / (t1 + t2 + ww);

	float lc1 = k / (0.12 * dot(c10 + c12 + c11, dt) + lum_add);
	float lc2 = k / (0.12 * dot(c01 + c21 + c11, dt) + lum_add);

	w1 = clamp(lc1 * dot(abs(c11 - c10), dt) + mx, min_w, max_w);
	w2 = clamp(lc2 * dot(abs(c11 - c21), dt) + mx, min_w, max_w);
	w3 = clamp(lc1 * dot(abs(c11 - c12), dt) + mx, min_w, max_w);
	w4 = clamp(lc2 * dot(abs(c11 - c01), dt) + mx, min_w, max_w);

	gl_FragColor = vec4(w1 * c10 + w2 * c21 + w3 * c12 + w4 * c01 + (1.0 - w1 - w2 - w3 - w4) * c11, 1.0);
}
