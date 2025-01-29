precision mediump float;
precision lowp int;

varying vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform float seconds;

uniform float Period;
uniform float Step;
uniform float DirN;
uniform float DirS;
uniform float DirE;
uniform float DirW;
uniform float DirNE;
uniform float DirSE;
uniform float DirSW;
uniform float DirNW;

void main(void)
{
	gl_FragColor = texture2D(samplerFront, vTex);
	vec3 v = vec3(1.0, 1.0, 1.0);
	
	if(DirN == 1.0)
		v *= tan(((-gl_FragCoord.y/Period)) - seconds/Step);
	if(DirS == 1.0)
		v *= tan(((gl_FragCoord.y/Period)) - seconds/Step);
	if(DirE == 1.0)
		v *= tan(((-gl_FragCoord.x/Period)) - seconds/Step);
	if(DirW == 1.0)
		v *= tan(((gl_FragCoord.x/Period)) - seconds/Step);
	if(DirNE == 1.0)
		v *= tan(((-gl_FragCoord.x/Period - gl_FragCoord.y/Period)) - seconds/Step);
	if(DirSE == 1.0)
		v *= tan(((-gl_FragCoord.x/Period + gl_FragCoord.y/Period)) - seconds/Step);
	if(DirSW == 1.0)
		v *= tan(((gl_FragCoord.x/Period + gl_FragCoord.y/Period)) - seconds/Step);
	if(DirNW == 1.0)
		v *= tan(((gl_FragCoord.x/Period - gl_FragCoord.y/Period)) - seconds/Step);

	gl_FragColor *= vec4(v,1);
}