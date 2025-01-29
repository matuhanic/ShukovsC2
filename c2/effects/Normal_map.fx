/////////////////////////////////////////////////////////
//Normal_map effect
//chrisbrobs2017
//texture to Normal map converter

precision mediump float;
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
uniform float intensity;
//quick guide to intensity....default value = 100..or negative values to flip red and green.

                
void main(void)
{
   
   vec4 front = texture2D(samplerFront, vTex);
   vec2 pos = vTex;
   
   vec3 rc = vec3(1.0,0.0,0.0);
   vec3 gc = vec3(0.0,1.0,0.0);
;
   float dx =  pixelWidth;
   float dy =  pixelHeight;
   float dxx = pixelWidth*(intensity/2.0);
   float dyy = pixelHeight*(intensity/2.0);
   
   
 //red channel
    vec3 colorR = vec3(0.5);
    colorR -= texture2D(samplerFront, pos -  vec2(- dxx, -dyy)).rgb * 2.0;
    colorR += texture2D(samplerFront, pos - vec2(dxx,- dyy)).rgb * 2.0;
    colorR = vec3((colorR.r + colorR.g + colorR.b) / 3.0)*rc;
       
 //green channel 
    vec3 colorG = vec3(0.5);   
    colorG -= texture2D(samplerFront, pos +  vec2(- dxx, -dyy)).rgb * 2.0;
    colorG += texture2D(samplerFront, pos -  vec2(dxx,- dyy)).rgb * 2.0;
    colorG = vec3((colorG.r + colorG.g + colorG.b) / 3.0)*gc;
     
 //blue channel  
    float bottLeft = texture2D(samplerFront, vTex + vec2(-dx, dy)).r;
    float topRight = texture2D(samplerFront, vTex + vec2(dx, -dy)).r;
    float topLeft = texture2D(samplerFront, vTex + vec2(-dx, -dy)).r;
    float bottRight = texture2D(samplerFront, vTex + vec2(dx, dy)).r;
    float left = texture2D(samplerFront, vTex + vec2(-dx, 0.0)).r;
    float right = texture2D(samplerFront, vTex + vec2(dx, 0.0)).r;
    float bott = texture2D(samplerFront, vTex + vec2(0.0, dy)).r;
    float top = texture2D(samplerFront, vTex + vec2(0.0, -dy)).r;
    float h = -topLeft - 2.0 * top - topRight + bottLeft + 2.0 * bott + bottRight;
    float v = -bottLeft - 2.0 * left - topLeft+ bottRight + 2.0 * right + topRight;
        
    float mag = 1.0-(length(vec2(h, v)))* 0.1;   
    float a = (front.a);
    vec4 colorB = (vec4(vec3(mag)*a,a)*vec4(0.0,0.0,1.0,1.0));

    vec4 outcolor = (vec4(vec3(colorR),1.0) + vec4(vec3(colorG),1.0)+ vec4(vec3(colorB),1.0));

   
    gl_FragColor =  outcolor*front.a;


}
