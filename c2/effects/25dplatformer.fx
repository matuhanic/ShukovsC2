// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// a perspective correct triangle rasterizer, in a shader!! :D
//  usefull to create 2.5d platform game !
// Adapted by gigatron fo C2/users // have fun !
precision mediump float;

uniform float textureSizeWidth; //width of the texture
uniform float textureSizeHeight; //height of the texture
uniform float texelSizeX; //width of one texel 
uniform float texelSizeY; //height of one texel 
uniform mediump float seconds;
uniform mediump float pixelWidth;
uniform mediump float pixelHeight;
 
uniform float rot_x;
uniform float rot_y;
uniform float rot_z;
uniform float trx,try,rlx,rly;
uniform float zoom;
uniform float intensity,x_face,y_face,z_face,all_faces;
// axis rotationAxisAngle
uniform float x_axis,y_axis,z_axis,axis_ang;

uniform float debug;

uniform float w,h,d,llx,lly,llz; 
uniform float lightdp_on;
varying mediump vec2 vTex;
uniform sampler2D samplerFront;
uniform sampler2D samplerBack;
vec2 iResolution = vec2( 1.0/pixelWidth, 1.0/pixelHeight);



mat4 setRotation( float x, float y, float z )
{
    float a = sin(x); float b = cos(x); 
    float c = sin(y); float d = cos(y); 
    float e = sin(z); float f = cos(z); 

    float ac = a*c;
    float bc = b*c;

    return mat4( d*f,      d*e,       -c, 0.0,
                 ac*f-b*e, ac*e+b*f, a*d, 0.0,
                 bc*f+a*e, bc*e-a*f, b*d, 0.0,
                 0.0,      0.0,      0.0, 1.0 );
}
//-----------------------------------------------------------------------------------------
// iq again 
mat4 RotationAxisAngle( vec3 v, float angle )
{
    float s = sin( angle );
    float c = cos( angle );
    float ic = 1.0 - c;

    return mat4( v.x*v.x*ic + c,     v.y*v.x*ic - s*v.z, v.z*v.x*ic + s*v.y, 0.0,
                 v.x*v.y*ic + s*v.z, v.y*v.y*ic + c,     v.z*v.y*ic - s*v.x, 0.0,
                 v.x*v.z*ic - s*v.y, v.y*v.z*ic + s*v.x, v.z*v.z*ic + c,     0.0,
			     0.0,                0.0,                0.0,                1.0 );
}



mat4 setTranslation( float x, float y, float z )
{
    return mat4( 1.0, 0.0, 0.0, 0.0,
				 0.0, 1.0, 0.0, 0.0,
				 rlx, rly, 1.0, 0.0,
				 x,     y,   z, 1.0 );
}

struct Triangle
{
    vec3 a; vec2 aUV;
    vec3 b; vec2 bUV;
    vec3 c; vec2 cUV;
    vec3 n;
};


Triangle triangles[12];

void createCube( void )
{
    vec3 verts[8];
	
    verts[0] = vec3( -w, -h, -d );//-1.0
    verts[1] = vec3( -w, -h,  d );//1.0
    verts[2] = vec3( -w,  h, -d );
    verts[3] = vec3( -w,  h,  d );
    verts[4] = vec3(  w, -h, -d );
    verts[5] = vec3(  w, -h,  d );
    verts[6] = vec3(  w,  h, -d );
    verts[7] = vec3(  w,  h,  d );


    triangles[0].a = verts[1]; triangles[0].aUV = vec2(0.0,0.0);
    triangles[0].b = verts[5]; triangles[0].bUV = vec2(1.0,0.0);
    triangles[0].c = verts[7]; triangles[0].cUV = vec2(1.0,1.0);
    triangles[0].n = vec3( 0.0, 0.0, 1.0 );
    triangles[1].a = verts[1]; triangles[1].aUV = vec2(0.0,0.0),
    triangles[1].b = verts[7]; triangles[1].bUV = vec2(1.0,1.0),
    triangles[1].c = verts[3]; triangles[1].cUV = vec2(0.0,1.0),
    triangles[1].n = vec3( 0.0, 0.0, 1.0 );

    triangles[2].a = verts[5]; triangles[2].aUV = vec2(0.0,0.0);
    triangles[2].b = verts[4]; triangles[2].bUV = vec2(1.0,0.0);
    triangles[2].c = verts[6]; triangles[2].cUV = vec2(1.0,1.0);
    triangles[2].n = vec3( 1.0, 0.0, 0.0 );
    triangles[3].a = verts[5]; triangles[3].aUV = vec2(0.0,0.0);
    triangles[3].b = verts[6]; triangles[3].bUV = vec2(1.0,1.0);
    triangles[3].c = verts[7]; triangles[3].cUV = vec2(0.0,1.0);
    triangles[3].n = vec3( 1.0, 0.0, 0.0 );

    triangles[4].a = verts[3]; triangles[4].aUV = vec2(0.0,0.0);
    triangles[4].b = verts[7]; triangles[4].bUV = vec2(1.0,0.0);
    triangles[4].c = verts[6];;triangles[4].cUV = vec2(1.0,1.0);
    triangles[4].n = vec3( 0.0, 1.0, 0.0 );
    triangles[5].a = verts[3]; triangles[5].aUV = vec2(0.0,0.0);
    triangles[5].b = verts[6]; triangles[5].bUV = vec2(1.0,1.0);
    triangles[5].c = verts[2]; triangles[5].cUV = vec2(0.0,1.0);
    triangles[5].n = vec3( 0.0, 1.0, 0.0 );

    triangles[6].a = verts[0]; triangles[6].aUV = vec2(1.0,0.0);
    triangles[6].b = verts[6]; triangles[6].bUV = vec2(0.0,1.0);
    triangles[6].c = verts[4]; triangles[6].cUV = vec2(0.0,0.0);
    triangles[6].n = vec3( 0.0, 0.0, -1.0 );
    triangles[7].a = verts[0]; triangles[7].aUV = vec2(1.0,0.0);
    triangles[7].b = verts[2]; triangles[7].bUV = vec2(1.0,1.0);
    triangles[7].c = verts[6]; triangles[7].cUV = vec2(0.0,1.0);
    triangles[7].n = vec3( 0.0, 0.0, -1.0 );

    triangles[8].a = verts[1]; triangles[8].aUV = vec2(1.0,0.0);
    triangles[8].b = verts[2]; triangles[8].bUV = vec2(0.0,1.0);
    triangles[8].c = verts[0]; triangles[8].cUV = vec2(0.0,0.0);
    triangles[8].n = vec3( -1.0, 0.0, 0.0 );
    triangles[9].a = verts[1]; triangles[9].aUV = vec2(1.0,0.0);
    triangles[9].b = verts[3]; triangles[9].bUV = vec2(1.0,1.0);
    triangles[9].c = verts[2]; triangles[9].cUV = vec2(0.0,1.0);
    triangles[9].n = vec3( -1.0, 0.0, 0.0 );

    triangles[10].a = verts[1]; triangles[10].aUV = vec2(0.0,0.0);
    triangles[10].b = verts[0]; triangles[10].bUV = vec2(0.0,1.0);
    triangles[10].c = verts[4]; triangles[10].cUV = vec2(1.0,1.0);
    triangles[10].n = vec3( 0.0, -1.0, 0.0 );
    triangles[11].a = verts[1]; triangles[11].aUV = vec2(0.0,0.0);
    triangles[11].b = verts[4]; triangles[11].bUV = vec2(1.0,1.0);
    triangles[11].c = verts[5]; triangles[11].cUV = vec2(1.0,0.0);
    triangles[11].n = vec3( 0.0, -1.0, 0.0 );
}


float cross( vec2 a, vec2 b )
{
    return a.x*b.y - a.y*b.x;
}

//vec3 lig = normalize( vec3( 0.3,0.7,0.5) );
// light vec3 ..x y..z !
//vec3 lig = normalize( vec3( 0.0,0.0,1.0) );

vec3 lig = vec3( llx,lly,llz) ;



vec3 pixelShader( in vec3 nor, in vec2 uv, in float z, in vec3 wnor )
{
    float dif = clamp( dot( nor, lig ), 0.0, 1.0 );
   
	float brdf = 0.5+0.8*dif;
	float face_left_right=x_face;
	float face_up_down=y_face;
	float zz_face     =z_face;
	float all_face    =all_faces;
	vec3 mate;
	// light depth on/off
   // brdf *=6.0*exp( -0.5*abs(z) );
   
   if (lightdp_on==1.0) brdf *=6.0*exp( -0.5*abs(z) );
	
	if(face_left_right==1.0)  mate = texture2D( samplerFront, uv ).xyz * abs(wnor.x);
	
	if(face_up_down==1.0)     mate = texture2D( samplerFront, uv ).xyz * abs(wnor.y);//+ 
		                           //  texture2D( samplerFront, uv ).xyz * abs(wnor.y);
	
	if(zz_face==1.0)          mate = texture2D( samplerFront, uv ).xyz * abs(wnor.z);
									 
	if(all_face==1.0)         mate = texture2D( samplerFront, uv ).xyz * abs(wnor.x)+ 
							         texture2D( samplerFront, uv ).xyz * abs(wnor.y)+
								     texture2D( samplerFront, uv ).xyz * abs(wnor.z);								 
									 
	
    vec3 col = brdf*mate*0.4 ;	
	
    return sqrt(col);
}

void main(){
			// option setTranslation( trx, try,2.2 )* à rajouter si besoin !
			mat4 mdv = setTranslation( trx, try,zoom )*
			setRotation( rot_y,rot_x, rot_z)*
			RotationAxisAngle(vec3(y_axis,x_axis,z_axis), axis_ang );
	
			vec2  px=(1.* vTex)-vec2(.5,.5);
			createCube();
			vec3 color =vec3(0.,0.,0.);
			float tmin = 1e10;
			float mindist = -1000000.0;
			//-1000000.0
			// 12
			// simple left Face 8--12
			//        right face 0--4
			for( int i=0; i<12; i++ )
			{
			vec3 ep0 = (mdv * vec4(triangles[i].a,1.0)).xyz;
			vec3 ep1 = (mdv * vec4(triangles[i].b,1.0)).xyz;
			vec3 ep2 = (mdv * vec4(triangles[i].c,1.0)).xyz;
			vec3 nor = (mdv * vec4(triangles[i].n,0.0)).xyz;
			float w0 = 1.0/ep0.z;
			float w1 = 1.0/ep1.z;
			float w2 = 1.0/ep2.z;
			vec2 cp0 = 2.0*ep0.xy * -w0;
			vec2 cp1 = 2.0*ep1.xy * -w1;
			vec2 cp2 = 2.0*ep2.xy * -w2;
			vec2 u0 = triangles[i].aUV * w0;
			vec2 u1 = triangles[i].bUV * w1;
			vec2 u2 = triangles[i].cUV * w2;
			vec3 di = vec3( cross( cp1 - cp0, px - cp0 ),
			cross( cp2 - cp1, px - cp1 ),
			cross( cp0 - cp2, px - cp2 ) );
			if( all(greaterThan(di,vec3(0.0))) )
			{
			vec3 ba = di.yzx / (di.x+di.y+di.z);
			float iz = ba.x*w0 + ba.y*w1 + ba.z*w2;
			vec2  uv = ba.x*u0 + ba.y*u1 + ba.z*u2;
			float z = 1.0/iz;
			uv *= z;
			if( z>mindist )
			{
			mindist = z/2.0;
			color = pixelShader( nor/0.2, uv, z, triangles[i].n*1.5 );
			}
		}
	}
			 // color *= exp( -0.05 );
			 
			
			 if (color.r <0.000001) gl_FragColor = vec4(0,0,0,0.0); else{gl_FragColor =  vec4(color*intensity,1.0)*1.8;}
			 if (color.g <0.000001) gl_FragColor = vec4(0,0,0,0.0); else{gl_FragColor =  vec4(color*intensity,1.0)*1.8;}
			 if (color.b <0.000001) gl_FragColor = vec4(0,0,0,0.0); else{gl_FragColor =  vec4(color*intensity,1.0)*1.8;}
			 
			 if(debug==1.0) gl_FragColor =  vec4(vec3(0.9,0.8,0.2),1.0);
			 
			 
			 
			 // end v1.28//		
}