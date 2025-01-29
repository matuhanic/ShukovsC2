////////////////////////////////////
//GradientPlus effect
//2 color blended gradient/chrisbrobs2015

precision mediump float;
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform lowp float color1R;
uniform lowp float color1G;
uniform lowp float color1B;

uniform lowp float color2R;
uniform lowp float color2G;
uniform lowp float color2B;

uniform lowp float direction;


void main() {

 vec4 front = texture2D(samplerFront, vTex);
 mediump vec2 position = vTex;


 vec4 color1 = vec4(color1R,color1G,color1B,1.0);    //top
 vec4 color2 = vec4(color2R,color2G,color2B,1.0);    //bottom


   if (direction > 2.0)  //halfdiagnol for skys      
       gl_FragColor = vec4(mix(color1, color2,(((position.x*0.2)+position.y))))*front.a;

   else if (direction > 1.0)   //diagnol      
       gl_FragColor = vec4(mix(color1, color2,(((position.x)+position.y))))*front.a;

   else if (direction > 0.0)   //vertical    
       gl_FragColor = vec4(mix(color1, color2,(position.x)))*front.a;

     else                     //horizontal
        gl_FragColor = vec4(mix(color1, color2,(position.y)))*front.a;
  
}

// The 'half diagnol' direction creates a better looking 'skys gradient effect'
// as opposed to the normal horizontal gradient.