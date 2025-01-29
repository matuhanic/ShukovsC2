/////////////////////////////////////////////////////////
//DirectionBlur effect
//chrisbrobs2015

precision mediump float;
varying mediump vec2 vTex;
uniform mediump sampler2D samplerFront;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
         
uniform  float Angle;         //blur Angle in degrees 0 to 360, default 0.
uniform  float BlurAmount;   // Strength -24...0...+24, default 0 (no blur)

void main(void)
{

 vec4 front = texture2D(samplerFront, vTex);   

   float rad = Angle * 0.0174533;   
   float xOffset = cos(rad);
   float yOffset = sin(rad);
   
   vec2 tex = vTex;
   
   float Strength = ((BlurAmount /24.0)*0.01); //Raised to 24(same as bounding box extra) 
   mediump float HalfPixW = pixelWidth / 4.0;  //same method C2'S gaussian blur uses.
   mediump float HalfPixH = pixelHeight / 4.0; //but divided by 4.
    
  vec4 sum = vec4(0.0);   
    
  sum += texture2D(samplerFront, vTex + vec2(HalfPixW -(Strength*1.0)* xOffset, HalfPixH -(Strength*1.0)* yOffset))*0.15 ;
  sum += texture2D(samplerFront, vTex + vec2(HalfPixW -(Strength*2.0)* xOffset, HalfPixH -(Strength*2.0)* yOffset))*0.12 ;
  sum += texture2D(samplerFront, vTex + vec2(HalfPixW -(Strength*3.0)* xOffset, HalfPixH -(Strength*3.0)* yOffset))*0.09 ;
  sum += texture2D(samplerFront, vTex + vec2(HalfPixW -(Strength*4.0)* xOffset, HalfPixH -(Strength*4.0)* yOffset))*0.05 ;
  sum += texture2D(samplerFront, vTex )*0.18;  
  sum += texture2D(samplerFront, vTex + vec2(HalfPixW -(Strength*0.5)* xOffset, HalfPixH -(Strength*0.5)* yOffset))*0.05 ;
  sum += texture2D(samplerFront, vTex + vec2(HalfPixW -(Strength*1.5)* xOffset, HalfPixH -(Strength*1.5)* yOffset))*0.09 ;
  sum += texture2D(samplerFront, vTex + vec2(HalfPixW -(Strength*2.5)* xOffset, HalfPixH -(Strength*2.5)* yOffset))*0.12 ;
  sum += texture2D(samplerFront, vTex + vec2(HalfPixW -(Strength*3.5)* xOffset, HalfPixH -(Strength*3.5)* yOffset))*0.15 ;

 
 gl_FragColor = mix(front, sum, 1.0);

}
//todo - factor in aspect ratio?
// blend the transitions better
