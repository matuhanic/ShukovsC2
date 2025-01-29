/////////////////////////////////////////////
//lookupfilter effect
//chrisbrobs/converted GPUImageLookupFilter/Brad Larson.

 precision mediump float;
 varying mediump vec2 vTex;             
 uniform lowp sampler2D samplerFront;   //uniform sampler2D inputImageTexture;
 uniform lowp sampler2D samplerBack;    //samplerBack lookup texture
 uniform mediump vec2 destStart;
 uniform mediump vec2 destEnd;
 uniform mediump float pixelWidth;
 uniform mediump float pixelHeight;
 
 uniform float intensity;    // intensity of look up textures
 
 void main()
 {
     vec4 front = texture2D(samplerFront, vTex);
     vec4 back = texture2D(samplerBack, mix(destStart, destEnd, vTex));

     float blueColor = front.b * 63.0;
     
     vec2 quad1;
     quad1.y = floor(floor(blueColor) / 8.0);
     quad1.x = floor(blueColor) - (quad1.y * 8.0);
     
     vec2 quad2;
     quad2.y = floor(ceil(blueColor) / 8.0);
     quad2.x = ceil(blueColor) - (quad2.y * 8.0);
     
     vec2 texPos1;   //vec2 texPos1 = vTex; //vec2 texPos1;
     texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * front.r);
     texPos1.y = (quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * front.g);
     
     vec2 texPos2;   //vec2 texPos2 = vTex; //vec2 texPos2;
     texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * front.r);
     texPos2.y = (quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * front.g);
     

     
    vec4 newColor1 = texture2D(samplerBack, mix(destStart, destEnd, texPos1));
    vec4 newColor2 = texture2D(samplerBack, mix(destStart, destEnd, texPos2));
 
  
    vec4 newColor = mix(newColor1, newColor2, fract(blueColor));
    
     
    gl_FragColor = mix(front, vec4(newColor.rgb, front.w), intensity);

    
 }