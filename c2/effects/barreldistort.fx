/////////////////////////////////////////////////////////
// barreldistort effect
// chrisbrobs (BradLarson bulge effect mod)

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float offsetX;
uniform mediump float offsetY;
uniform mediump float radius;
uniform mediump float scale;

void main(void)
{
	mediump vec2 tex = vTex;
      mediump float dist = distance(vec2(offsetX, offsetY), vTex);
      tex -= vec2(offsetX, offsetY);

	if (dist < radius)
	{
		mediump float percent = 1.0 - ((radius - dist) / radius) * scale;
		percent = percent * percent;

		tex = tex * percent;
	}
	
       tex += vec2(offsetX, offsetY);

	gl_FragColor = texture2D(samplerFront, tex);
}
