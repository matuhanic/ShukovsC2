precision mediump float;
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
// Not available in C2
// uniform vec2 srcOriginStart;
// uniform vec2 srcOriginEnd;
// uniform vec2 pixelSize;

uniform mediump float screenResolutionX;
uniform mediump float screenResolutionY;
uniform mediump float iMouseX;
uniform mediump float iMouseY;
uniform mediump float seconds;
uniform mediump float heightOffset;
uniform mediump float timeScale;
uniform mediump float directionX;
uniform mediump float directionY;
uniform mediump float directionZ;
uniform mediump float noiseScaleSet;
uniform mediump float skyColorR;
uniform mediump float skyColorG;
uniform mediump float skyColorB;

vec2 iMouse = vec2(iMouseX, iMouseY);

#define NUM_STEPS 200
#define NUM_NOISE_OCTAVES 4

#define HEIGHT_OFFSET 1.25

#define USE_TEXTURE true
#define WHITE_NOISE_GRID_SIZE 256.0

// from "Hash without Sine" https://www.shadertoy.com/view/4djSRW
#define HASHSCALE1 443.8975
//  1 out, 2 in...
float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

// NOTE: the bilinear interpolation is important! without it, the clouds look blocky.
// You can see this by returning noise00 or by having the texture use the "nearest" filter
float BilinearInterpolateWhiteNoise (vec2 uv)
{
    uv = fract(uv);
    
    vec2 uvPixels = uv * WHITE_NOISE_GRID_SIZE;
    
    vec2 uvFrac = uvPixels - floor(uvPixels);
    
    vec2 uvDiscreteFloor = floor(uvPixels) / WHITE_NOISE_GRID_SIZE;
    vec2 uvDiscreteCeil = ceil(uvPixels) / WHITE_NOISE_GRID_SIZE;
    
    float noise00 = hash12(vec2(uvDiscreteFloor.x, uvDiscreteFloor.y));
    float noise01 = hash12(vec2(uvDiscreteFloor.x, uvDiscreteCeil.y ));
    float noise10 = hash12(vec2(uvDiscreteCeil.x , uvDiscreteFloor.y));
    float noise11 = hash12(vec2(uvDiscreteCeil.x , uvDiscreteCeil.y ));
    
    float noise0_ = mix(noise00, noise01, uvFrac.y);
    float noise1_ = mix(noise10, noise11, uvFrac.y);
    
    float noise = mix(noise0_, noise1_, uvFrac.x);

    return noise;
}

float RandomNumber (in vec3 position)
{
    // NOTE: the ceil here is important interestingly. it makes the clouds look round and puffy instead of whispy in a glitchy way
    vec2 uv = (position.yz+ceil(position.x))/float(NUM_STEPS);

    // Wrap texture (0.0-1.0)
    uv = fract (uv);

    // deNormalize texture before use (srcOriginStart - SrcOriginEnd)
	// Not needed in C2, assumes 0-1 range and no spritesheets
    // uv = (srcOriginEnd-srcOriginStart)*uv + srcOriginStart;

    if (USE_TEXTURE)
    	return texture2D(samplerFront, uv).y;
    else
        return BilinearInterpolateWhiteNoise(uv);
}

void main(void)
{
    // fragColor
    // fragCoord
    // x,y,z is the direction the ray for this pixel travels in.
    // x is into the screen
    // y is the screen's x axis. the left side is -0.8 and the right side value depends on the aspect ratio seems to be be roughly +0.8 for me.
    // z is the screen's y axis (also the up axis). it ranges from -0.8 at the bottom of the screen to 0.2 at the top of the screen
    // NOTE: in tiny clouds, this is a vec4 where the y field is unused. I've made it a vec3 and removed the y field.
    vec2 iResolution = vec2(screenResolutionX,screenResolutionY);
    mediump float iTime = seconds*timeScale;
    vec2 fragCoord = vTex;
    vec4 fragColor;
//    fragCoord.y = srcOriginEnd.y - (fragCoord.y-srcOriginStart.y);
//  C2 assumes 0-1 (when no spritesheets)
    fragCoord.y = 1.0 - fragCoord.y;

    // Normalize fragcoord
	// C2 assumes 0-1 (when no spirtesheets and no way to handle spritesheets in C2?)
    // fragCoord = (fragCoord - srcOriginStart)/(srcOriginEnd-srcOriginStart);

    vec3 direction = vec3(directionX, (fragCoord.x/iResolution.y-directionY), (fragCoord.y/iResolution.y-directionZ));

    // this is a sky blue color
    // NOTE: tiny clouds gets the 0.8 from direction.x
    // skyColor passed in as parameter
    // C2 does not support 'color' parameter type, need to split up uniform to components
    vec3 skyColor = vec3(skyColorR, skyColorG, skyColorB);
    
    // initialize the pixel color to a gradient of sky blue (at top) to white (at bottom)
    vec3 pixelColor = skyColor - direction.z;
    
    // Tiny clouds adds a per pixel value to rayStep that is in [-1,1].
    // I think that gives it some higher frequency noise to make the clouds look a little more detailed.  
    // NOTE: this ray marches back to front so that alpha blending math is easier
    for (int rayStep = 0; rayStep < NUM_STEPS; ++rayStep)
    {
        // NOTE: tiny clouds has position as a vec4 but never uses the y component. I removed it here.
        // position.z is up
        vec3 position = 0.05 * float(NUM_STEPS - rayStep) * direction;
        
        // move the camera on the x and z axis over time
        position.xy+=iTime;

        
        // tiny clouds initializes this to 2.0, but whenever using it divides it by 4. So, just dividing 2 by 4 here.
        // Passed as parameter
        float noiseScale=noiseScaleSet;
        
        // Note: position.z is the height. adding this moves the camera up. tiny clouds uses 1.0
        float signedCloudDistance = position.z + heightOffset;
        
        // Note: each sampling doubles the position but halves the value read there. it's multiple octaves of noise i think?        
        for (int octaveIndex = 0; octaveIndex < NUM_NOISE_OCTAVES; ++octaveIndex)
        {
            position *= 2.0;
            noiseScale *= 2.0;
            signedCloudDistance -= RandomNumber(position) / noiseScale;
        }
        
        // Note: signed cloud distance is also cloud density if negative.
        // the below is equivelant to a lerp between the current pixel color and the color that the cloud is at that location.
        // the lerp amount is controlled by the density time 0.4.
        // The color is reversed so it "looks like" the sky color.
        // Lerping is equivelant to standard alpha blending, so we are just doing alpha compositing.
        if (signedCloudDistance < 0.0)
            pixelColor = pixelColor + (pixelColor - 1.0 - signedCloudDistance * skyColor.zyx)*signedCloudDistance*0.4;
	}
    
    fragColor.rgb = pixelColor;
    fragColor.a = 1.0;
    gl_FragColor = fragColor;
}