/* 

 gigatron for C2 
 V1.0 initial release 
 */
  
#ifdef GL_ES
precision mediump float;
#endif

uniform mediump sampler2D samplerBack;
uniform mediump sampler2D samplerFront;
varying mediump vec2 vTex;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;
uniform mediump float seconds;
uniform mediump float date;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
vec2 iResolution = vec2( 1./pixelWidth, 1./pixelHeight);

uniform float speed,p1,p2,p3,xf,yf;

void main()
{
	vec2 uv = vTex ;
    
    vec4 col = vec4(0.0);
    
    for( int i=0; i<32; i++ )
    {
     	// dissolve vec2 offset
		float xx = xf*cos( 1.0*uv.x + 0.05*float(i) + speed*seconds + 1.);
		float yy = yf*cos( 1.0*uv.y + 0.05*float(i) + speed*seconds - 1.);
		
		vec3 fc = texture2D( samplerFront, uv +vec2(xx,yy)).xyz;
	      col.xyz += fc.xyz*fc.xyz*fc.xyz;
    }
    
    col /= p1;
    
	gl_FragColor = vec4( col );
}