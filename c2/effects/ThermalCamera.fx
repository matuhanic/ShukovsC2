/////////////////////////////////////////////////////////
// ThermalCamera effect
// chrisbrobs2015

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
//uniform mediump vec2 destStart;
//uniform mediump vec2 destEnd

void main(void)
{
  
    lowp vec4 front = texture2D(samplerFront, vTex);
	
  
    lowp float gray = front.r * 0.299 + front.g * 0.587 + front.b * 0.114;
	
/////////////////////////////////////////////////////////////
// Output colors for heat based on lum intensity,
// For HOT to COLD, typical ranges are:
// >0.8        red         - (1.0, 0.0, 0.0)   rgb (255,0,0)
// 0.7 to 0.8  orange      - (1.0, 0.5, 0.0)   rgb (255,165,0)
// 0.6 to 0.7  yellow      - (1.0, 1.0, 0.0)   rgb (255,255,0)
// 0.5 to 0.6  light green - (0.5, 1.0, 0.5)   rgb (144,238,144)
// 0.3 to 0.5  dark green  - (0.0, 0.5, 0.0)   rgb (0,100,0)
// 0.1 to 0.3  light blue  - (0.5, 0.5, 1.0)   rgb (173,216,230)
// < 0.1       dark blue   - (0.0, 0.0, 0.5)   rgb (0,0,139)
///////////////////////////////////////////////////////////////

  if (gray > 0.90)
	gl_FragColor = vec4(1.0, 0.0, 0.0, front.a);
		     
  else if (gray > 0.80)
      gl_FragColor = vec4(1.0, 0.5, 0.0, front.a);
		       
  else if (gray > 0.60)
	gl_FragColor = vec4(1.0, 1.0, 0.0, front.a);
		      
  else if (gray > 0.50)
      gl_FragColor = vec4(0.5, 1.0, 0.5, front.a);
		      
  else if (gray > 0.40)
      gl_FragColor = vec4(0.0, 0.5, 0.0, front.a);
		      
  else if (gray > 0.30)
	gl_FragColor = vec4(0.5, 0.5, 1.0, front.a);	      	      
		       
  else
	gl_FragColor = vec4(0.0 ,0.0 , 0.5, front.a)*front.a;
	   
		                 
}
