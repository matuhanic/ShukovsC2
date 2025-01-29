//Giant Horizontal blur - a GPU-eating 20-sample blur
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform mediump float pixelWidth;

uniform mediump float size;

mediump float halfPixelWidth = pixelWidth / 2.0;
mediump float realSize = pixelWidth * size;

lowp vec4 addBlur( mediump float pos, mediump float alpha) {
	return texture2D(samplerFront, vTex + vec2(pos * realSize, halfPixelWidth)) * alpha;
}

void main(void) {
	lowp vec4 front = texture2D(samplerFront, vTex) * 0.0867265826959637;
	front += addBlur(-10., 0.00816463058748422);
	front += addBlur(-9., 0.0127913835543763);
	front += addBlur(-8., 0.0191149950404317);
	front += addBlur(-7., 0.0272462378692536);
	front += addBlur(-6., 0.0370437192544233);
	front += addBlur(-5., 0.0480394814107598);
	front += addBlur(-4., 0.0594234309266334);
	front += addBlur(-3., 0.0701120751911035);
	front += addBlur(-2., 0.07890483324789);
	front += addBlur(-1., 0.084701300241491);
	front += addBlur(1., 0.084701300241491);
	front += addBlur(2., 0.07890483324789);
	front += addBlur(3., 0.0701120751911035);
	front += addBlur(4., 0.0594234309266334);
	front += addBlur(5., 0.0480394814107598);
	front += addBlur(6., 0.0370437192544233);
	front += addBlur(7., 0.0272462378692536);
	front += addBlur(8., 0.0191149950404317);
	front += addBlur(9., 0.0127913835543763);
	front += addBlur(10., 0.00816463058748422);

	gl_FragColor = front;
}