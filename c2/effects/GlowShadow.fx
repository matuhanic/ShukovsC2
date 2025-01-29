precision mediump float;

varying vec2 vTex;
uniform sampler2D samplerFront;
uniform float flow;
uniform float opacity;
uniform float X;
uniform float Y;

//uniform mediump float pixelWidth;

void main(void)
{

	float pw = 0.001;
	
	float hpw = pw / 2.0;

	float a = 0.0;

	vec2 DIR = vec2(X, Y);

	for(float i = 1.0; i < 100.0; i ++) {
		float _k = flow/i*opacity/10.0;
		vec2 n = vec2(pw * i + hpw)*DIR;
		a += texture2D(samplerFront, vTex + n).a * _k;
		a += texture2D(samplerFront, vTex - n).a * _k;
		if(i >= flow)
			break;
	}

	vec4 front = texture2D(samplerFront, vTex);

	front.a += mix(front.a, a, 1.0);
	
	gl_FragColor = front;
}