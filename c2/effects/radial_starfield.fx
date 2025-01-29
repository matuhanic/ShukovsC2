/////////////////////////////////////////////////////////
// Radial Starfield Pixel Shader
// By Anata
/////////////////////////////////////////////////////////

precision mediump float;

#define PI 3.1415926535897932384626433832795

// Increase pass count for a denser effect
#define PASS_COUNT 4

uniform float fBrightness;

// Number of angular segments
uniform float fSteps; //121.0;

float fParticleSize = 0.005;
float fParticleLength = 0.1;

// Min and Max star position radius. Min must be present to prevent stars too near camera
uniform float fMinDist;
uniform float fMaxDist;

// Min & Max Density
uniform float fRepeatMin;
uniform float fRepeatMax;

// fog density
uniform float fDepthFade;

float Random(float x)
{
	return fract(sin(x * 123.456) * 23.4567 + sin(x * 345.678) * 45.6789 + sin(x * 456.789) * 56.789);
}

uniform float seconds;
uniform float pixelWidth;
uniform float pixelHeight;
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

mediump vec2 resolution = vec2(1.0 / pixelWidth, 1.0 / pixelHeight);


vec3 GetParticleColour( const in vec3 vParticlePos, const in float fParticleSize, const in vec3 vRayDir )
{
	vec2 vNormDir = normalize(vRayDir.xy);
	float d1 = dot(vParticlePos.xy, vNormDir.xy) / length(vRayDir.xy);
	vec3 vClosest2d = vRayDir * d1;

	vec3 vClampedPos = vParticlePos;

	vClampedPos.z = clamp(vClosest2d.z, vParticlePos.z - fParticleLength, vParticlePos.z + fParticleLength);

	float d = dot(vClampedPos, vRayDir);

	vec3 vClosestPos = vRayDir * d;

	vec3 vDeltaPos = vClampedPos - vClosestPos;

	float fClosestDist = length(vDeltaPos) / fParticleSize;

	float fShade = 	clamp(1.0 - fClosestDist, 0.0, 1.0);

	fShade = fShade * exp2(-d * fDepthFade) * fBrightness;

	return vec3(fShade);
}

vec3 GetParticlePos( const in vec3 vRayDir, const in float fZPos, const in float fSeed )
{
	float fAngle = atan(vRayDir.x, vRayDir.y);
	float fAngleFraction = fract(fAngle / (3.14 * 2.0));

	float fSegment = floor(fAngleFraction * fSteps + fSeed) + 0.5 - fSeed;
	float fParticleAngle = fSegment / fSteps * (3.14 * 2.0);

	float fSegmentPos = fSegment / fSteps;
	float fRadius = fMinDist + Random(fSegmentPos + fSeed) * (fMaxDist - fMinDist);

	float tunnelZ = vRayDir.z / length(vRayDir.xy / fRadius);

	tunnelZ += fZPos;

	float fRepeat = fRepeatMin + Random(fSegmentPos + 0.1 + fSeed) * (fRepeatMax - fRepeatMin);

	float fParticleZ = (ceil(tunnelZ / fRepeat) - 0.5) * fRepeat - fZPos;

	return vec3( sin(fParticleAngle) * fRadius, cos(fParticleAngle) * fRadius, fParticleZ );
}

vec3 Starfield( const in vec3 vRayDir, const in float fZPos, const in float fSeed )
{
	vec3 vParticlePos = GetParticlePos(vRayDir, fZPos, fSeed);

	return GetParticleColour(vParticlePos, fParticleSize, vRayDir);
}


void main() {
	vec4 front = texture2D(samplerFront, vTex);

	vec2 vScreenUV = gl_FragCoord.xy / resolution.xy;

	vec2 vScreenPos = vScreenUV * 2.0 - 1.0;
	vScreenPos.x *= resolution.x / resolution.y;

	vec3 vRayDir = normalize(vec3(vScreenPos, 1.0));

	vec3 vEuler = vec3(0.5 + sin(seconds * 0.2) * 0.125, 0.5 + sin(seconds * 0.1) * 0.125, seconds * 0.1 + sin(seconds * 0.3) * 0.5);

	float fShade = 0.0;

	float a = 0.2;
	float b = 10.0;
	float c = 1.0;
	float fZPos = 5.0 + seconds * c +  a * b;
	float fSpeed = c + a * b * cos(a * seconds);

	fParticleLength = 0.25 * fSpeed / 60.0;

	float fSeed = 0.0;

	vec3 vResult = mix(vec3(0.005, 0.0, 0.01), vec3(0.01, 0.005, 0.0), vRayDir.y * 0.5 + 0.5);

	for(int i=0; i<PASS_COUNT; i++)
	{
		vResult += Starfield(vRayDir, fZPos, fSeed);
		fSeed += 1.234;
	}

	gl_FragColor = vec4(sqrt(vResult),1.0);
}
