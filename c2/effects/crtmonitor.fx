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

uniform float speed,red,green,blue,gx,gy,gintensity;
uniform float mono;

// advanced crt filter
vec2 CRTCurve( vec2 uv )
{
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs( uv.yx ) / vec2( 6.0, 4.0 );
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    return uv;
}

void Vignette( inout vec3 color, vec2 uv )
{    
    float vignette = uv.x * uv.y * ( 1.0 - uv.x ) * ( 1.0 - uv.y );
    vignette = clamp( pow( 16.0 * vignette, 0.3 ), 0.0, 1.0 );
    color *= vignette;
}

void Scanline( inout vec3 color, vec2 uv )
{
    float scanline 	= clamp( 0.95 + 0.05 * cos( 3.14 * ( uv.y + 0.008 * seconds ) *  gy * 1.0 ), 0.0, 1.0 );
    float grid 	= 0.85 + 0.15 * clamp( 1.5 * cos( 3.14 * uv.x * gx * 1.0 ), 0.0, 1.0 );    
    color *= scanline * grid * gintensity;
}
 

void main()
{
 
 	vec3 color = vec3(red,green,blue); 
    vec2 uv    = vTex;
    vec3 tx=texture2D(samplerFront,uv).rgb;
	
	float lum;
    lum = dot(tx.rgb, vec3( 0.50, 0.30, 0.10) );
	if(mono==1.0){tx.rgb = vec3(0, lum,0);}
		
    vec2 crtUV = CRTCurve( uv );
    if ( crtUV.x < 0.0 || crtUV.x > 1.0 || crtUV.y < 0.0 || crtUV.y > 1.0 )
    {
        color = vec3( 0.0, 0.0, 0.0 );
    }
    Vignette( color, crtUV );
    Scanline( color, uv );
     
	gl_FragColor.xyz 	= color*tx;
 
	
   // fragColor.w		= 1.0;
}
