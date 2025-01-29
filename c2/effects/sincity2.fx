///////////////////////////////////
//sincity2 effect
//blackwhite film with enhanced reds
//chrisbrobs-inspired by a 'sincity' topic on gamedev formums.

precision mediump float;
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

void main(void)
{
    lowp vec4 front = texture2D(samplerFront, vTex);
    
    
    vec3 grey = vec3(1.0,1.0,1.0)*clamp( mix(0.25, dot(front.rgb, vec3(0.3, 0.3, 0.3)), 1.2), 0.0,1.0);
    
    vec3 red = vec3(front.r, 0.0, 0.0);
    
    lowp float blend = (front.r-(front.g + front.b));
   //lowp float blend = (front.r-(front.g / front.b));
    
    vec3 result = mix(grey, red, smoothstep(-0.125, 0.125, blend));
    
    gl_FragColor = vec4(result, 1.0);
}