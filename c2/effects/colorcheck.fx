/////////////////////////////////////////////////////////
//colorcheck effect
//chrisbrobs2015

precision mediump float;
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float squarecount;
uniform lowp float red;
uniform lowp float green;
uniform lowp float blue;

float checkerboard(vec2 p, float steps) {
  float x = floor(p.x * steps);
  float y = floor(p.y * steps);
  return mod(x + y, 2.);
}

void main() {

   vec4 front = texture2D(samplerFront, vTex);
   
   vec2 p = vTex;
   

  float squarecolor = checkerboard(p,(1.*squarecount));

  //section off the following 3 lines for a 1 black and 1 color effect//

  if (squarecolor < 0.5){
          squarecolor = 0.8;           
       }


  gl_FragColor = vec4(red*squarecolor, green*squarecolor, blue*squarecolor, front.a)*front.a;


}