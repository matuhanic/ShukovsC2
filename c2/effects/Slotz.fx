////////////////////////////////////
//Slotz effect
//chrisbrobs2016. 3Reel slotz.

precision mediump float;
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float pixelWidth;
uniform lowp float pixelHeight;
uniform float seconds;
float time = seconds;


uniform float reelOneSpeed;
uniform float reelTwoSpeed;
uniform float reelThreeSpeed;

uniform float reelOneYoffset;    //Yposition 0 to 6
uniform float reelTwoYoffset;    //Yposition 0 to 6
uniform float reelThreeYoffset;  //Yposition 0 to 6

void main()
{

  vec4 front = texture2D(samplerFront, vTex);
  mediump vec2 p = vTex + vec2(0.0,0.0);


///////////// REEL 1
 
    if (p.x < 0.33 )     
     p.y = mod(p.y-(pixelHeight*(reelOneYoffset/1.0)),1.0);
     

  
///////////// REEL 2 
  
    else if (p.x < 0.66 )
       p.y = mod(p.y-(pixelHeight*(reelTwoYoffset/1.0)),1.0);
       
 
 //////////////REEL 3
  	
    else
     p.y = mod(p.y-(pixelHeight*(reelThreeYoffset/1.0)),1.0);


    		
  gl_FragColor = texture2D(samplerFront, p)*front.a;
}  
