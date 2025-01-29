precision mediump float;

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

uniform mediump float seconds;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
uniform mediump float layerScale;

uniform float zoom;
uniform float dir1;
uniform float dir2;
uniform float red;
uniform float green;
uniform float blue;

float iGlobalTime = seconds;
vec2 iResolution = vec2( 1./pixelWidth, 1./pixelHeight);

#define PI 3.14159

void main()
{
	vec2 p=(zoom*vTex);

	float j=2.5;

	for(float i=1.;i<2.5;i+=0.5)
	{
		j-=0.5;
		vec2 newp=p;
    		newp.x+=1./i*cos(i*PI*p.y-seconds*dir1)-0.5/j*sin(j*PI*p.x+seconds*dir2);
    		newp.y+=1./i*sin(i*PI*p.x+seconds*dir2)-0.5/j*cos(j*PI*p.y-seconds*dir1);
    		p=newp;
  	}

	vec3 col=vec3(sin(p.x-p.y*red)*.5+.5,sin(p.x*green)*.5+.5,sin(p.y*blue)*.5+.5);
	gl_FragColor=vec4(col*col, 1.0);
}
