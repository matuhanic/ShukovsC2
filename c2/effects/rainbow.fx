precision mediump float;

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform float seconds;
uniform float pixelWidth;
uniform float pixelHeight;
uniform float layerScale;

uniform float mseX;
uniform float mseY;
uniform float plasmaspeed;
uniform float plasmaintensity;

void main( void ) {
	vec2 resolution = vec2(pixelWidth, pixelHeight);
	gl_FragColor = texture2D(samplerFront, vTex);
	vec2 mouse = vec2(mseX, mseY);

    vec2 pos = vec2(gl_FragCoord.xy) * 0.01 + seconds*plasmaspeed;
    float angle = 0.0 + seconds / 100.0;
    vec2 dist1 = vec2(sin(angle), -cos(angle));
    vec2 dist2 = vec2(cos(angle), -sin(angle));
	vec2 dist3 = vec2(sin(angle)*sin(angle), cos(angle)*sin(angle));
    gl_FragColor *= ((sin(dot(pos, dist1)) + 1.9) * vec4(1.0*plasmaintensity, 0.1, 0.1, 1.0)) 
		+ ((-sin(dot(pos, dist2)) + 1.7) * vec4(0.1, 1.0*plasmaintensity, 0.1, 1.0)) + ((-sin(dot(pos, dist3)) + 2.3) * vec4(0.1, 0.1, 1.0*plasmaintensity, 1.0));
}