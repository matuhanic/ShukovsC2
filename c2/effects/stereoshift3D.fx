/////////////////////////////////////////////////////////
// stereoshift3D effect
// chrisbrobs2015

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp float pixelWidth;
uniform lowp float pixelHeight;

uniform lowp float redOffset;          //red channel offset
uniform lowp float greenBlueOffset;    //green/blue channels offset(cyan)
uniform mediump float gamma;           //gamma amount

void main(void)
{
	
	lowp vec4 front = texture2D(samplerFront, vTex);
	

      front.r = (texture2D(samplerFront, vTex + vec2(redOffset * (pixelWidth*1.0), pixelHeight)).r);
      front.g = (texture2D(samplerFront, vTex + vec2(greenBlueOffset * (pixelWidth*1.0), pixelHeight)).g);
      front.b = (texture2D(samplerFront, vTex + vec2(greenBlueOffset * (pixelWidth*1.0), pixelHeight)).b);
  
	gl_FragColor = vec4(pow(front.rgb, vec3(gamma)), front.a);	
	//gl_FragColor = front * front.a * front.a;
}

