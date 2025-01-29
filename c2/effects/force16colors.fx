// Created by Coldberg
// Original by Gigatron for C2
// Force 16 Colors by AndreYin .//.
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

uniform float BRIGHTNESS;
uniform float COLOR1R;
uniform float COLOR1G;
uniform float COLOR1B;
uniform float COLOR2R;
uniform float COLOR2G;
uniform float COLOR2B;
uniform float COLOR3R;
uniform float COLOR3G;
uniform float COLOR3B;
uniform float COLOR4R;
uniform float COLOR4G;
uniform float COLOR4B;
uniform float COLOR5R;
uniform float COLOR5G;
uniform float COLOR5B;
uniform float COLOR6R;
uniform float COLOR6G;
uniform float COLOR6B;
uniform float COLOR7R;
uniform float COLOR7G;
uniform float COLOR7B;
uniform float COLOR8R;
uniform float COLOR8G;
uniform float COLOR8B;
uniform float COLOR9R;
uniform float COLOR9G;
uniform float COLOR9B;
uniform float COLOR10R;
uniform float COLOR10G;
uniform float COLOR10B;
uniform float COLOR11R;
uniform float COLOR11G;
uniform float COLOR11B;
uniform float COLOR12R;
uniform float COLOR12G;
uniform float COLOR12B;
uniform float COLOR13R;
uniform float COLOR13G;
uniform float COLOR13B;
uniform float COLOR14R;
uniform float COLOR14G;
uniform float COLOR14B;
uniform float COLOR15R;
uniform float COLOR15G;
uniform float COLOR15B;
uniform float COLOR16R;
uniform float COLOR16G;
uniform float COLOR16B;

vec3 find_closest (vec3 ref) {	
	vec3 old = vec3 (100.0*255.0);		
	#define TRY_COLOR(new) old = mix (new, old, step (length (old-ref), length (new-ref)));	
	TRY_COLOR (vec3 (COLOR1R, COLOR1G, COLOR1B));
	TRY_COLOR (vec3 (COLOR2R, COLOR2G, COLOR2B));
	TRY_COLOR (vec3 (COLOR3R, COLOR3G, COLOR3B));
	TRY_COLOR (vec3 (COLOR4R, COLOR4G, COLOR4B));
	TRY_COLOR (vec3 (COLOR5R, COLOR5G, COLOR5B));
	TRY_COLOR (vec3 (COLOR6R, COLOR6G, COLOR6B));
	TRY_COLOR (vec3 (COLOR7R, COLOR7G, COLOR7B));
	TRY_COLOR (vec3 (COLOR8R, COLOR8G, COLOR8B));
	TRY_COLOR (vec3 (COLOR9R, COLOR9G, COLOR9B));
	TRY_COLOR (vec3 (COLOR10R, COLOR10G, COLOR10B));
	TRY_COLOR (vec3 (COLOR11R, COLOR11G, COLOR11B));
	TRY_COLOR (vec3 (COLOR12R, COLOR12G, COLOR12B));
	TRY_COLOR (vec3 (COLOR13R, COLOR13G, COLOR13B));
	TRY_COLOR (vec3 (COLOR14R, COLOR14G, COLOR14B));
	TRY_COLOR (vec3 (COLOR15R, COLOR15G, COLOR15B));
	TRY_COLOR (vec3 (COLOR16R, COLOR16G, COLOR16B));
	return old ;
}

float dither_matrix (float x, float y) {
	return mix(mix(mix(mix(mix(mix(0.0,32.0,step(1.0,y)),mix(8.0,40.0,step(3.0,y)),step(2.0,y)),mix(mix(2.0,34.0,step(5.0,y)),mix(10.0,42.0,step(7.0,y)),step(6.0,y)),step(4.0,y)),mix(mix(mix(48.0,16.0,step(1.0,y)),mix(56.0,24.0,step(3.0,y)),step(2.0,y)),mix(mix(50.0,18.0,step(5.0,y)),mix(58.0,26.0,step(7.0,y)),step(6.0,y)),step(4.0,y)),step(1.0,x)),mix(mix(mix(mix(12.0,44.0,step(1.0,y)),mix(4.0,36.0,step(3.0,y)),step(2.0,y)),mix(mix(14.0,46.0,step(5.0,y)),mix(6.0,38.0,step(7.0,y)),step(6.0,y)),step(4.0,y)),mix(mix(mix(60.0,28.0,step(1.0,y)),mix(52.0,20.0,step(3.0,y)),step(2.0,y)),mix(mix(62.0,30.0,step(5.0,y)),mix(54.0,22.0,step(7.0,y)),step(6.0,y)),step(4.0,y)),step(3.0,x)),step(2.0,x)),mix(mix(mix(mix(mix(3.0,35.0,step(1.0,y)),mix(11.0,43.0,step(3.0,y)),step(2.0,y)),mix(mix(1.0,33.0,step(5.0,y)),mix(9.0,41.0,step(7.0,y)),step(6.0,y)),step(4.0,y)),mix(mix(mix(51.0,19.0,step(1.0,y)),mix(59.0,27.0,step(3.0,y)),step(2.0,y)),mix(mix(49.0,17.0,step(5.0,y)),mix(57.0,25.0,step(7.0,y)),step(6.0,y)),step(4.0,y)),step(5.0,x)),mix(mix(mix(mix(15.0,47.0,step(1.0,y)),mix(7.0,39.0,step(3.0,y)),step(2.0,y)),mix(mix(13.0,45.0,step(5.0,y)),mix(5.0,37.0,step(7.0,y)),step(6.0,y)),step(4.0,y)),mix(mix(mix(63.0,31.0,step(1.0,y)),mix(55.0,23.0,step(3.0,y)),step(2.0,y)),mix(mix(61.0,29.0,step(5.0,y)),mix(53.0,21.0,step(7.0,y)),step(6.0,y)),step(4.0,y)),step(7.0,x)),step(6.0,x)),step(4.0,x));
}

vec3 dither (vec3 color, vec2 uv) {	
	color *= 255.0 * BRIGHTNESS;	
	color = find_closest (clamp (color, 0.0, 255.0));
	return color / 255.0;
}

void main()
{
	
	vec2 uv=(1.*vTex);
	vec3 tc = texture2D(samplerFront, uv).xyz;
	gl_FragColor =  vec4 (dither (tc,gl_FragCoord.xy),1.0);		
}