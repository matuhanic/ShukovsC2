/////////////////////////////////////////////////////////
// nightvision effect
// chrisbrobs/BradLarson vignette mod
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float scopeStart;
uniform mediump float scopeEnd;
uniform mediump float intensity;

void main(void)
{	
	lowp vec4 front = texture2D(samplerFront, vTex);
	front.rgb /= front.a;
	
      lowp float d = distance(vTex, vec2(0.5, 0.5));
      front.rgb *= smoothstep(scopeEnd, scopeStart, d);
      front.rgb *= front.a;
	
    
    gl_FragColor = front * vec4(0.2, (1.6 * intensity), 0.2, 1.0);
    
}
