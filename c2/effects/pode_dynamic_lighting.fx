// Original Shader work by Matt Greer : http://www.mattgreer.org/post/4dynamicLightingShadows
// Modifications by Jean-Philippe Deblonde

precision highp float;

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform float lightDirectionX;
uniform float lightDirectionY;
uniform float lightDirectionZ;
uniform float lightColorR;
uniform float lightColorG;
uniform float lightColorB;
  
void main(void) {
  // pull the normal vector out of the texture
  vec4 rawNormal = texture2D(samplerFront, vTex);

  // if the alpha channel is zero, then don't do lighting here
  if(rawNormal.a == 0.0) {
    gl_FragColor = vec4(0, 0, 0, 0);
  } else {
    // translate from 0 to 1 to -.5 to .5
    rawNormal -= 0.5;

    // figure out how much the lighting influences this pixel
	
	///
	vec3 lightDirection;
	vec4 lightColor;
	lightDirection.x = lightDirectionX;
	lightDirection.y = lightDirectionY;
	lightDirection.z = lightDirectionZ;
	lightColor.r = lightColorR;
	lightColor.g = lightColorG;
	lightColor.b = lightColorB;	
	///
    float lightWeight = 
      dot(normalize(rawNormal.xyz), normalize(lightDirection));

    lightWeight = max(lightWeight, 0.0);

	
    // and drop the pixel in
	gl_FragColor.a = (lightColor.r+lightColor.g+lightColor.b)/3.0 * lightWeight;
  }
}