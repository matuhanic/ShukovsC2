// Original source obtained from https://www.shadertoy.com/view/Mdf3zr by jmk
precision mediump float;

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float seconds;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;

uniform float EdgeFlag;
uniform float RC;
uniform float GC;
uniform float BC;

float d = sin(seconds * 2.)*0.5 + 1.5;
vec2 resolution = vec2(1./pixelWidth, 1./pixelHeight);

float lookup(vec2 p, float dx, float dy)
{
    vec2 uv = (p.xy + vec2(dx * d, dy * d)) / resolution.xy;
    vec4 c = texture2D(samplerFront, uv);

    return 0.2126*c.r + 0.7152*c.g + 0.0722*c.b;
}

void main(void)
{
    vec2 p = gl_FragCoord.xy;
    
    float gx= 0.0;
    gx += -1.0 * lookup(p, -1.0, -1.0);
    gx += -2.0 * lookup(p,  0.0, -1.0);
    gx += -1.0 * lookup(p,  1.0, -1.0);
    gx +=  1.0 * lookup(p, -1.0,  1.0);
    gx +=  2.0 * lookup(p,  0.0,  1.0);
    gx +=  1.0 * lookup(p,  1.0,  1.0);
    
    float gy = 0.0;
    gy += -1.0 * lookup(p, -1.0, -1.0);
    gy += -2.0 * lookup(p, -1.0,  0.0);
    gy += -1.0 * lookup(p, -1.0,  1.0);
    gy +=  1.0 * lookup(p,  1.0, -1.0);
    gy +=  2.0 * lookup(p,  1.0,  0.0);
    gy +=  1.0 * lookup(p,  1.0,  1.0);
    
    float g = gx*gx + gy*gy;
    
    vec4 col = texture2D(samplerFront, p / resolution.xy);
	if (EdgeFlag == 1.0)
	    col *= vec4(g*RC/255., g*GC/255., g*BC/255., 1.0);
	else
	    col += vec4(g*RC/255., g*GC/255., g*BC/255., 1.0);

    gl_FragColor = col;
}