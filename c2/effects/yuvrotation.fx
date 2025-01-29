/* Upload from LukasPukenis ST
Yuv Rotation converted by 
 gigatron for C2 
 V1.0 initial release 
 */
  
#ifdef GL_ES
precision mediump float;
#endif
 

uniform mediump sampler2D samplerFront;
varying mediump vec2 vTex;

uniform mediump float seconds;
uniform mediump float date;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
vec2 iResolution = vec2( 1./pixelWidth, 1./pixelHeight);
 
uniform float speed;

const mat3 rgb2yuv_mat = mat3(
  0.2126,    0.7152,   0.0722,
 -0.09991,  -0.33609,  0.436,
  0.615,    -0.55861, -0.05639
);

const mat3 yuv2rgb_mat = mat3(
  1.0,  0.0,      1.28033,
  1.0, -0.21482, -0.38059,
  1.0,  2.12798,  0.0
);

vec3 rgb2yuv(vec3 rgb) {
  return rgb * rgb2yuv_mat;
}

vec3 yuv2rgb(vec3 rgb) {
  return rgb * yuv2rgb_mat;
}

vec2 cartesian2polar(vec2 uv) {
    float r = sqrt(pow(uv.x, 2.0) + pow(uv.y, 2.0));
    float fi = atan(uv.y, uv.x);
    return vec2(r, fi);
}

vec2 polar2cartesian(vec2 uv) {  
  return vec2(uv.x*cos(uv.y), uv.x*sin(uv.y));   
}

vec2 rotate2(vec2 v, float fi) {
  return v*mat2(cos(fi), -sin(fi), sin(fi), cos(fi));
}

// rgb->yuv yuv->polar -> rotate yuv->right
void main()
{
	
	vec2 uv=(vTex);
	vec4 color = texture2D(samplerFront, uv); 
    
    vec3 yuv = rgb2yuv(color.rgb);
       
    vec3 rgb = yuv2rgb(vec3(yuv.x, rotate2(yuv.yz, seconds*speed)));
    color = vec4(rgb, 1.0);
	gl_FragColor = color;
}