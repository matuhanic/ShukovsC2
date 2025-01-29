/// Raster FX
/// Gigatron the magnificient Gls attempt !
///  
// 
#ifdef GL_ES
precision highp float;
#endif
#extension GL_OES_standard_derivatives : enable

uniform highp sampler2D samplerFront;
varying vec2 vTex;
	
uniform highp float seconds;
uniform highp float date;
uniform highp float pixelWidth;
uniform highp float pixelHeight;
 vec2 resolution = vec2( 1./pixelWidth, 1./pixelHeight);
uniform highp float scale_x;
uniform highp float scale_y;


uniform highp float red_raster_size;
uniform highp float green_raster_size;
uniform highp float blue_raster_size;
uniform highp float speed;
uniform highp float allsize;	
 
uniform highp float amp;
uniform highp float freq; 
uniform highp float  red_raster_on;
uniform highp float  green_raster_on;
uniform highp float  blue_raster_on;

void main()
{
     
    	vec2 pos=(0.6*vTex);
	    
		
    //
    float slide = 1.0 - seconds * speed;
    
	float xx = (red_raster_size+allsize) - abs((pos.y - .3) * amp - sin((pos.x - slide) * freq));
	float xz = (green_raster_size+allsize) - abs((pos.y - .3) * amp - sin((pos.x - 2.4 - slide * 1.9) * freq));
    float xr = (blue_raster_size+allsize) - abs((pos.y - .3) * amp - sin((pos.x- 1.0 - slide * -.5) * freq));
   
   
	vec4 color = vec4(0.0,0.0,0.0,1.0);
	
	if (red_raster_on>0.){color.r = xx;}
	else
	{
		color.r = 0.0;
	}
	if (green_raster_on>0.){color.g = xr;}
	else 
	{
		color.g = 0.0; 
	}
		
    if (blue_raster_on>0.){color.b = xz;}
	else
	{
		color.b = 0.0;
	}
    gl_FragColor=color;
    
}


