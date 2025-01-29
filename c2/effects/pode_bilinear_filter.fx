// Original Shader work http://www.gamerendering.com/2008/10/05/bilinear-interpolation/
// Modifications by Jean-Philippe Deblonde
precision highp float;

uniform float textureSizeWidth; //width of the texture
uniform float textureSizeHeight; //height of the texture
uniform float texelSizeX; //width of one texel 
uniform float texelSizeY; //height of one texel 

varying mediump vec2 vTex;
uniform sampler2D samplerFront;

vec4 tex2DBiLinear( sampler2D textureSampler_i, vec2 texCoord_i )
{
    vec4 p0q0 = texture2D(textureSampler_i, texCoord_i);
    vec4 p1q0 = texture2D(textureSampler_i, texCoord_i + vec2(texelSizeX, 0));

    vec4 p0q1 = texture2D(textureSampler_i, texCoord_i + vec2(0, texelSizeY));
    vec4 p1q1 = texture2D(textureSampler_i, texCoord_i + vec2(texelSizeX , texelSizeY));

    float a = fract( texCoord_i.x * textureSizeWidth ); // Get Interpolation factor for X direction.
					// Fraction near to valid data.

    vec4 pInterp_q0 = mix( p0q0, p1q0, a ); // Interpolates top row in X direction.
    vec4 pInterp_q1 = mix( p0q1, p1q1, a ); // Interpolates bottom row in X direction.

    float b = fract( texCoord_i.y * textureSizeHeight );// Get Interpolation factor for Y direction.
    return mix( pInterp_q0, pInterp_q1, b ); // Interpolate in Y direction.
}
void main() { 

	gl_FragColor = tex2DBiLinear(samplerFront,vTex);
}