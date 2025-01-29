// Based on: Fire by Xbe on Shadertoy
// https://www.shadertoy.com/view/XsXSWS
// Ported to C2 by Matriax
// Modified to use as: fire, flames, magma, flares, acid, water, smoke, fog, laser, snow, rain, blast, explosions...



// Set precision for Float
precision mediump float;

// Things i don't know but are necessary
varying mediump vec2 vTex;
uniform sampler2D samplerFront;



// Parameters to C2 pass
uniform mediump float seconds;

uniform mediump float noiseT; //noise total
uniform mediump float fireVP; // Fire vertical propagation

uniform mediump float fireSPD1; // Fire vertical propagation
uniform mediump float fireSPD2; // Fire vertical propagation

uniform mediump float firePOSy; // Fire Position Y
uniform mediump float fireSizeTop; // Fire Size Top
uniform mediump float fireSizeBottom; // Fire Size Bottom

uniform mediump float fireSizeW; // Fire Size Width
uniform mediump float fireSizeH; // Fire Size Height
uniform mediump float fireSizeF; // Fire Size Form

uniform mediump float fireColorR; // 
uniform mediump float fireColorG; //
uniform mediump float fireColorB; //
uniform mediump float fireColorRd; // Red darkness
uniform mediump float fireColorGd; // Green darkness
uniform mediump float fireColorBd; // Blue darkness

uniform mediump float fireContrast; //
uniform mediump float fireIntensity; // 
uniform mediump float fireQ; // Fire Quantity

uniform mediump float fireNoiseV1; // Noise Vertical 1
uniform mediump float fireNoiseV2; // Noise Vertical 2
uniform mediump float fireNoiseH1; // Noise Horizontal 1
uniform mediump float fireNoiseH2; // Noise Horizontal 2

uniform mediump float flameS; // Flames separation

uniform mediump float backgM; // Modify background

uniform mediump float fadeSP; // Fade-out start Position Y
uniform mediump float offsetY; // Fade-out start Position Y

uniform mediump float fadeSPX; // Fade-out start Position Y
uniform mediump float offsetX; // Fade-out start Position Y

uniform mediump float fadeIOSPD; // Fade In-Out Speed

uniform mediump float warpXform ; // 
uniform mediump float warpXspd; // 
uniform mediump float warpXformY; // 
uniform mediump float warpXsize; // 

uniform mediump float warpYform ; // 
uniform mediump float warpYspd; // 
uniform mediump float warpYformX; // 
uniform mediump float warpYsize; // 

uniform mediump float totalOpacity; // 

uniform mediump float triangleFever; //

uniform mediump float deformOpacity; //
uniform mediump float deformX ; //
uniform mediump float deformY; //
uniform mediump float deformRound; //











////////////////////// *********************************************************************************
// Fire Flame shader





// procedural noise from IQ ----------------------------------------------------------------------
vec2 hash( vec2 p )
{
	p = vec2( dot(p,vec2(127.1,311.7)),
			 dot(p,vec2(269.5,183.3)) );
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);

}






// Noise overall effect ----------------------------------------------------------------------
float noise( in vec2 p )
{
	const float K1 = 0.366025404; // (sqrt(3)-1)/2;
	const float K2 = 0.211324865; // (3-sqrt(3))/6;
	
	vec2 i = floor( p + (p.x+p.y)*K1 );
	
	vec2 a = p - i + (i.x+i.y)*K2;
	vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0); // Sees to create fractal textures
	vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2; // Also some fractal
	
	vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), triangleFever ); //  2= Triangles Composition (This is the good one)
	
	vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0))); // 

	return dot( n, vec3(70.0) ); // Noise overall effect
}







// Total Noise that makes the form of the flame ----------------------------------------------------------------------
float fbm(vec2 uv)
{
	float f;
	mat2 m = mat2( fireNoiseV1, fireNoiseV2, fireNoiseH1, fireNoiseH2 ); // Modify the flame effect with some grain or something
	//mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 ); // Modify the flame effect with some grain or something

	f = 0.5000*noise( uv ); uv = m*uv;
	f += 0.2500*noise( uv ); uv = m*uv;
	f += 0.1250*noise( uv ); uv = m*uv;
	f += 0.0625*noise( uv ); uv = m*uv;
	f = fireQ + flameS*f; // 1= Size-quantity / 2=Flames separation/form¿?

	return f;
}








// Warp Effect X/Y -----------------------------------------------------------------------------------------------


vec2 warp(vec2 uv){
//	   uv.x += (sin(uv.x/10.0-seconds*6.0 + uv.y*(-4.0)))/8.0;
   uv.x += (sin(uv.x/warpXform-seconds*warpXspd + uv.y*(warpXformY)))/warpXsize;
//                  warpXform     warpXspd   warpXformY  warpXsize   

   uv.y += (sin(uv.y/warpYform-seconds*warpYspd + uv.x*(warpYformX)))/warpYsize ;
//                  warpYform     warpYspd   warpYformX  warpYsize                   
	                  
  // uv.y += (sin(uv.y/10.0-seconds*6.0 + uv.x*(-4.0)))/8.0;
//                  warpYform     warpYspd   warpYformX  warpYsize  


return uv;
}
// Warp Effect X/Y -----------------------------------------------------------------------------------------------













void main(void)
{

	vec2 uv =(1.*vTex); //	vec2 uv = warp(1.*vTex);




// IF  Warp Speed > 0 -> Activate the Warp controls 
	if(warpXspd>0.0)
	{
	uv = warp(1.*vTex);
	}
// --------------------------------------------------
	
	
	
	
	

	uv.y = 1.0 - uv.y; // Flip Image vertical

	vec2 q = uv;

	q.x *= 1.0; // Number of flames on horizontal
	q.y *= fireVP; // Vertical Y Fire-Flame separation
	float strength = floor(q.x+noiseT); // Total noise in all the flame
	float T3 = max(fireSPD1,fireSPD2*strength)*seconds; // 1=Speed /  2=Speed2
	q.x = mod(q.x,1.0)-0.5; // 1=Separation / 2- Move to right
	q.y -= firePOSy;  // Position Y

	
	
	float n = fbm(strength*q - vec2(0,T3)); // 
	float c = 1. - (fireSizeF) * pow( max( 0.0, length(q*vec2(1.8+q.y/fireSizeTop,fireSizeBottom) ) - n * max( 0., q.y+fireSizeW ) ),1.2 ); //
  //     color    formsize              +Dark              width               top,bottom                  width        width    width






// Flame power on Y
	float c1 = n * c * (fireContrast-pow(fireSizeH*uv.y,fireIntensity)); // Bigger

	c1=clamp(c1,0.0,1.0); //  1=Vertical fade-out¿? / 2=Nothing¿?


  // Color for Bright/Dark tones
     vec3 col = vec3(fireColorR*pow(c1,fireColorRd), fireColorG*pow(c1,fireColorGd), fireColorB*pow(c1,fireColorBd)); // 1=Red 2=Green 3=Blue
     

/*

Invert colors

void main() {
    vec4 color = texture2D(texture, textureCoordinate);
    float inverted = 1.0 - color.r; 
    vec4 inverted_vec = vec4( vec3(inverted), 1.0);
    gl_FragColor = clamp(inverted_vec, 0.0, 1.0);"
};

*/

// col = 1.0 - col; // Invert Object Colors






// Deform the entire shader ------------------------------------------------------------------------------------------------

// 	float lum = 0.5*sin(iGlobalTime+uv.x*4.0) + 1.0 - sqrt(uv.y*.25);
//float deform = 0.2*sin(seconds+uv.x*9.0) + 1.0 - sqrt(uv.y*4.75); // Get a lot of interesting effects

//float deform = 1.0*sin(seconds+uv.x*1.0) + 1.0 - sqrt(uv.y*1.00); // Get a lot of interesting effects (con division gl_FragColor = (((vec4( mix(vec3(backgM),col,a), 1.0))*fadeIO)/lum)/totalOpacity ; 
// float deform = 0.0*sin(seconds+uv.x*0.0) + 1.0 - sqrt(uv.y*0.00);  // Default

//float deform = 0.5*sin(seconds+uv.x*90.0) + 1.2 - sqrt(uv.y*0.75); // Con multiplicacion  se hace la hierva moviendose

//float deform = (1.0*sin(seconds+uv.x*10.0) * sin(seconds+uv.y*10.0))+0.0; + Squre flag code

float deform = (deformOpacity*sin(seconds+uv.x*deformX) * sin(seconds+uv.y*deformY))+deformRound;


//                deformOpacity   deformX               deformY   deformRound
                     
// Deform the entire shader ------------------------------------------------------------------------------------------------	







// Fade In-OUT Speed -> 0=Off -------------------------------------------------
	float fadeIO = ((1.0-(sin(seconds*fadeIOSPD)))/2.0)  ;

// IF WORKING FINALLY !! - If Speed is 0 set to 1.0 instead the 0.5     
	if(fadeIOSPD==0.0)
	{
	fadeIO = 1.0;
	}
// ---------------------------------------------------------------------------




	

	 // float a = c * (1.-pow(uv.x-offsetY,fadeSP)); // 1=1 to more = +Contrast & Lower than 1 interesting effect. 2= Fade Start Position
 
	  float a = c * (1.-pow(uv.y-offsetY,fadeSP)) * (1.-pow(uv.x-offsetX,fadeSPX)) ;
	 // float b = c * (1.-pow(uv.x-1.39,4.855));
	 
//float xFade = c * (1.-pow(uv.x-1.39,4.855));
  // Offset 0 / Star3 | Start=4.855  / Offest X 1.39
  
  
	gl_FragColor = (((vec4( mix(vec3(backgM),col,a), 1.0))*fadeIO)/deform)/totalOpacity ; //  1= Modifies the background / 2=nothing
}


// FLAMES and all *********************************************************************************



