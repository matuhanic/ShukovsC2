//////////////////////////////
//frostedglass effect
//chrisbrobs,ported from http:coding-experiments.blogspot.co.uk/2010/06/frosted-glass.html

precision mediump float;
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;


float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(92.,80.)))+
                 // cos(dot(co.xy ,vec2(41.,62.))) * (randomscale/1;
                 cos(dot(co.xy ,vec2(41.,62.))) * 4.1);   
}

void main()
{
	vec4 front = texture2D(samplerFront,vTex);
	
	vec2 tex = vTex;
	
      vec2 rnd = vec2(rand(tex.xy),rand(tex.xy));
      

  gl_FragColor =  texture2D(samplerFront, tex + rnd *0.05)*front.a;

}
