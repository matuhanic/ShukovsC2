function GetPluginSettings()
{
	return {
		"name":			"Q3D\nModel",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"Q3Dobj",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"2.4",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Instance object to be used with Q3D Master",
		"author":		"Quazi",
		"help url":		"http://threejs.org/",
		"category":		"Q3D",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	true,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
						| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
						| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// example	
			
//AddNumberParam("Number", "Enter a number to test if positive.");

AddObjectParam("Object", "Object to test collision with");
AddCondition(0, cf_none, "Is overlapping Q3D object", "Collisions", "Overlaps {0}", "Test for overlap with another Q3D object", "IsOverlapping");

AddObjectParam("Object", "Select the object to test for overlap with.");
AddNumberParam("Offset X", "The amount to offset the X co-ordinate in parent axis units before checking for a collision.");
AddNumberParam("Offset Y", "The amount to offset the Y co-ordinate in parent axis units before checking for a collision.");
AddNumberParam("Offset Z", "The amount to offset the Z co-ordinate in parent axis units before checking for a collision.");
AddCondition(1, 0, "Is overlap. at offset (parent)", "Collisions", "Is overlapping {0} at <i>parent</i> offset (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Test if the object is overlapping another Q3D object at an offset position in parents coordinates.", "IsOverlappingOffsetParent");

AddObjectParam("Object", "Select the object to test for overlap with.");
AddNumberParam("Direction X", "The X component local direction to offset in.");
AddNumberParam("Direction Y", "The Y component local direction to offset in.");
AddNumberParam("Direction Z", "The Z component local direction to offset in.");
AddNumberParam("Offset amount", "The amount to offset along specified local direction.");
AddCondition(2, 0, "Is overlap. at offset (local)", "Collisions", "Is overlapping {0} offset by (<i>{4}</i>) in <i>local</i> direction (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Test if the object is overlapping another Q3D object at an offset position in local coordinates.", "IsOverlappingOffsetLocal");

AddObjectParam("Object", "Select the object to test for overlap with.");
AddNumberParam("Offset X", "The amount to offset the X co-ordinate in world axis units before checking for a collision.");
AddNumberParam("Offset Y", "The amount to offset the Y co-ordinate in world axis units before checking for a collision.");
AddNumberParam("Offset Z", "The amount to offset the Z co-ordinate in world axis units before checking for a collision.");
//AddNumberParam("Offset amount", "The amount to offset along specified world direction.");
AddCondition(3, cf_none, "Is overlap. at offset (world)", "Collisions", "Is overlapping {0} at <i>world</i> offset (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Test if the object is overlapping another Q3D object at an offset position in world coordinates.", "IsOverlappingOffsetWorld");

AddCondition(4, 0, "Collisions enabled", "Collisions", "Collisions enabled", "True if the object's collisions are enabled and will fire collision events.", "IsCollisionEnabled");

AddObjectParam("Object", "Select the Q3D object to test for a collision with.");
AddCondition(5, cf_fake_trigger | cf_static, "On collision with another object", "Collisions", "On collision with {0}", "Triggered when the object collides with another Q3D object.", "OnCollision");

/////////////////////////////////////////// animation conditions

AddAnimationParam("Animation", "Enter the name of the animation to check if playing.")
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParam("Map", "Choose which map's texture animation to compare", 0);
AddCondition(6, 0, "Tex. anim. is playing", "Textures", "Is <b>{1}</b> texture animation {0} playing", "Test which of the object's map's texture animations is currently playing.", "IsAnimPlaying");

AddCmpParam("Comparison", "How to compare the current animation frame number (0-based).");
AddNumberParam("Number", "The animation frame number to compare to (0-based).");
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParam("Map", "Choose which map's texture animation to compare", 0);
AddCondition(7, 0, "Compare tex. frame", "Textures", "<b>{2}</b> texture animation frame {0} {1}", "Test which animation frame of a selected map's texture animation is currently showing.", "CompareFrame");

AddAnimationParam("Animation", "Enter the name of the animation that has finished.")
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParam("Map", "Choose which map's texture animation to compare", 0);
AddCondition(8, cf_trigger, "On tex. anim. finished", "Textures", "On <b>{1}</b> texture animation {0} finished", "Triggered when a specific map's specific texture animation has finished.", "OnAnimFinished");

AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParam("Map", "Choose which map's texture animation to compare", 0);
AddCondition(9, cf_trigger, "On any tex. anim. finished", "Textures", "On any <b>{0}</b> texture animation finished", "Triggered when any texture animation has finished playing for a selected map.", "OnAnyAnimFinished");

AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParam("Map", "Choose which map's texture animation to compare", 0);
AddCondition(10, cf_trigger, "On tex. frame changed", "Textures", "On <b>{0}</b> texture frame changed", "Triggered when a map's current texture animation frame changes.", "OnFrameChanged");

AddCmpParam("Comparison", "How to compare the current animation speed.");
AddNumberParam("Number", "The animation speed to compare to.");
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParam("Map", "Choose which map's texture animation to compare", 0);
AddCondition(11, 0, "Compare tex. anim. speed", "Textures", "<b>{2}</b> texture animation speed {0} {1}", "Compare the current map's texture animation speed.", "CompareAnimSpeed");

AddCondition(151, cf_trigger, "On model created", "Misc", "On model created", "Triggered when an objects model loads in (may be after object is created if it is still loading).", "OnModelCreated");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

/////////////////////////////////////////////////////////////// MATERIALS INCOMPLETE



////////////////////////////////////////

AddNumberParam("Normal scale X", "X scaling of the normal map", initial_string = "1")
AddNumberParam("Normal scale Y", "Y scaling of the normal map", initial_string = "1")
AddAction(74, af_none, "Set normal scale", "Material", "Set normal scale to ({0},{1})", "Set the normal map scaling (x,y) for the material.", "MaterialsSetMeshPhongNormalMapScale");

AddNumberParam("Bump scale", "Scaling of the bumb map", initial_string = "1")
AddAction(76, af_none, "Set bump scale", "Material", "Set bump scale to ({0})", "Set the bump map scaling for the material", "MaterialsSetMeshPhongBumpMapScale");

AddNumberParam("Specular", "Specular of this material, how ''shiny'' it is and the color of that shiny (uses 'hex' color notation)", initial_string = "rgb(128,128,128)")
AddAction(102, af_none, "Set color specular", "Material", "Set specular color to {0}", "Set the specular color value of the material", "MaterialsSetSpecular");

AddNumberParam("Shininess", "How shiny the specular highlight is.", initial_string = "30")
AddAction(103, af_none, "Set shininess", "Material", "Set shininess to ({0})", "Set the shininess value of the material", "MaterialsSetShininess");

AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Metal", "Treats the lighting differently, like 'metal' when set to yes.", initial_string = "0")
AddAction(104, af_none, "Set metal", "Material", "Set metal to <b>{0}</b>", "Setting which determines how direct light reflects off the material", "MaterialsSetMetal");

AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Transparency", "Choose whether this material has transparency on/off.", initial_string = "0");
AddNumberParam("Opacity", "Opacity of the material if transparency is on ( value from 0 to 1 )", initial_string = "1")
AddAction(83, af_none, "Set opacity", "Material", "Set material opacity to ({1}) with transparency {0}", "Set the opacity of a material (Transparency must be enabled first, if it looks weird try adjusting depth settings)", "MaterialsSetOpacity"); ////////////////////// LAST THING WORKED ON

AddComboParamOption("No Blending");
AddComboParamOption("Normal Blending");
AddComboParamOption("Additive Blending");
AddComboParamOption("Subtractive Blending");
AddComboParamOption("Multiply Blending");
AddComboParamOption("Custom Blending");
AddComboParam("Blend Mode", "Choose the blend mode of the material, the properties below control custom blending if is set", initial_string = "1");
AddComboParamOption("Source Alpha Factor");
AddComboParamOption("1 - Source Alpha Factor");
AddComboParamOption("Destination Alpha Factor");
AddComboParamOption("1 - Destination Alpha Factor");
AddComboParamOption("0 Factor");
AddComboParamOption("1 Factor");
AddComboParamOption("Destination Color Factor");
AddComboParamOption("1 - Destination Color Factor");
AddComboParamOption("Source Alpha Saturate Factor");
AddComboParam("C.Blend Source", "Choose the blend source of the material if custom blending", initial_string = "0");
AddComboParamOption("Source Alpha Factor");
AddComboParamOption("1 - Source Alpha Factor");
AddComboParamOption("Destination Alpha Factor");
AddComboParamOption("1 - Destination Alpha Factor");
AddComboParamOption("0 Factor");
AddComboParamOption("1 Factor");
AddComboParamOption("Source Color Factor");
AddComboParamOption("1 - Source Color Factor");
AddComboParam("C.Blend Destination", "Choose the blend destination of the material if custom blending", initial_string = "1");
AddComboParamOption("Add Equation");
AddComboParamOption("Subtract Equation");
AddComboParamOption("Reverse Subtract Equation");
AddComboParam("C.Blend Equation", "Choose the blend equation of the material if custom blending", initial_string = "0");
AddAction(84, af_none, "Blending", "Material", "Set material blending mode to <b>{0}</b>", "Set the blending mode of the material, Transparency must be enabled or no blending occurs", "MaterialsSetBlending");

AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Depth Test", "Choose whether this material has depth testing on/off when being rendered", initial_string = "1");
AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Depth Write", "Choose whether this material has any effect on the depth buffer", initial_string = "1");
AddAction(85, af_none, "Depth settings", "Material", "<b>MATERIALS</b> Set material depth testing {0} and depth writing {1}", "Set the the depth testing and depth writing properties of the material", "MaterialsDepthSettings");

AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Polygon offset", "Choose whether this material has polygon offset enabled", initial_string = "0");
AddNumberParam("Offset factor", "If polygon offset is enabled, the offset factor controlling it", initial_string = "0")
AddNumberParam("Offset units", "If polygon offset is enabled, the offset units controlling it", initial_string = "0")
AddAction(86, af_none, "Polygon offset", "Material", "Set material polygon offset {0} with factor {1} and units {2}", "Set the polygon offset of a material, helps prevent z-fighting if its a problem", "MaterialsPolygonOffset");

// these two weren't really having any effect in webgl renderer, so they're deprecated

AddNumberParam("Alpha", "Value to alpha test against", initial_string = "0")
AddAction(87, af_deprecated, "Set alpha test", "Material", "Set material alpha test value to {0}", "Set the alpha test value for a material", "MaterialsAlphaTest");

AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Overdraw", "Choose whether this material draws polygons slightly bigger", initial_string = "0");
AddAction(88, af_deprecated, "Set overdraw", "Material", "Set material overdraw {0}", "Control whether a material draws polygons slightly bigger to fix gaps", "MaterialsOverdraw");

// kinda pointless to have visibility toggled in two places, so deprecate for this.

AddComboParamOption("Front");
AddComboParamOption("Back");
AddComboParamOption("Front & Back");
AddComboParam("Side", "Choose which side of geometry this material renders (based on normals)", initial_string = "0");
AddAction(90, af_none, "Set draw side", "Material", "Set material draw side to {0}", "Control which side of the geometry a material renders", "MaterialsDrawSide");

AddAction(91, af_deprecated, "Update material", "Material", "Update material", "Flag the material for an update", "MaterialsUpdate");

AddNumberParam("Color", "Color of this material (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddAction(93, af_none, "Set color diffuse", "Material", "Set material color to {0}", "Set the color value of a material, if it has the property", "MaterialsSetColor");

AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Wireframe", "Choose whether this material renders as wireframe.", initial_string = "0")
AddAction(94, af_none, "Set wireframe", "Material", "Set material wireframe to {0}", "Set whether the material is wireframe or not, if it has the property", "MaterialsSetWireframe");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("None");
AddComboParamOption("Vertex");
AddComboParamOption("Face");
AddComboParam("Vertex color", "Choose the type of 'vertex coloring' for this material.", initial_string = "0")
AddAction(96, af_deprecated, "Set vertex colors", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} to set vertex colors using {1}", "Set the type of vertex coloring the material uses, if it has the property", "MaterialsSetVertexColors");

AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Fog", "Choose whether this material is affected by global fog settings", initial_string = "1")
AddAction(97, af_none, "Set fog", "Material", "Set material fog effects {0}", "Set whether the material is affected by global fog settings, if it has the property", "MaterialsSetFog");

AddComboParamOption("Multiply");
AddComboParamOption("Mix");
AddComboParamOption("Add");
AddComboParam("Combine", "Choose the combine mode for the surface color and environment map, if there is one", initial_string = "0");
AddNumberParam("Env. Amount", "Reflectivity / Refractivity of this material if an environment map is specified, a value from [0,1] indicating how much the material is opaque [0], or reflect/refract-ive [1]", initial_string = "0.25");
AddNumberParam("Refract. Ratio", "Refraction ration of the env.map if using cube refraction mapping", initial_string = "0.98");
AddAction(99, af_none, "Env. settings", "Material", "Set material combine mode to {0}, with relectivity/refractivity {1} and refraction ratio {2}", "Set the various settings for environment map effects, if it has the properties", "MaterialsEnvSettings");

AddNumberParam("Ambient", "Ambient color of this material, which is multiplied by the color of ambient light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddAction(100, af_deprecated, "Set color ambient", "Material", "Set material ambient color to {0}", "Set the ambient color value of a material, if it has the property", "MaterialsSetAmbient");

AddNumberParam("Emissive", "Emmisive of this material, essentially the color without any lights (uses 'hex' color notation)", initial_string = "rgb(0,0,0)")
AddAction(101, af_none, "Set color emissive", "Material", "Set material emissive color to {0}", "Set the emissive color value of a material, if it has the property", "MaterialsSetEmissive");

////////////////////////////////////////////////////////////
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParam("Map", "Choose which map's texture animation to affect", 0);
AddAction(130, 0, "Stop texture anim.",	"Texture frames",	"Stop <b>{0}</b> texture animation ",	"Stop the selected map's texture animation from playing.", "StopAnim");

AddComboParamOption("current frame");
AddComboParamOption("beginning");
AddComboParam("From", "Choose whether to resume or rewind the animation back to the first frame.");
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParam("Map", "Choose which map's texture animation to affect", 0);
AddAction(131, 0, "Start texture anim.",	"Texture frames",	"Start <b>{1}</b> texture animation from {0}",	"Start the selected map's texture animation, if it was stopped.", "StartAnim");

AddAnimationParam("Animation", "The name of the animation to set.");
AddComboParamOption("current frame");
AddComboParamOption("beginning");
AddComboParam("From", "Choose whether to play from the same frame number or rewind the animation back to the first frame.", 1);
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParam("Map", "Choose which map's texture animation to affect", 0);
AddAction(132, 0, "Set texture anim.", "Texture frames", "Set <b>{2}</b> texture animation to <b>{0}</b> (play from {1})", "Set the selected map's texture animation", "SetAnim");

AddNumberParam("Frame number", "The animation frame number to set (0-based).");
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParam("Map", "Choose which map's texture animation to affect", 0);
AddAction(133, 0, "Set texture anim. frame", "Texture frames", "Set <b>{1}</b> texture animation frame to <b>{0}</b>", "Set the selected map's texture animation frame number.", "SetAnimFrame");

AddNumberParam("Speed", "The new animation speed, in animation frames per second.");
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParam("Map", "Choose which map's texture animation to affect", 0);
AddAction(134, 0, "Set texture anim. speed", "Texture frames", "Set <b>{1}</b> texture animation speed to <b>{0}</b>", "Set the selected map's texture animation speed.", "SetAnimSpeed");

///////////////////////////////////////

AddComboParamOption("█ NO CHANGE █");
AddComboParamOption("Clamp To Edge");
AddComboParamOption("Repeat");
AddComboParamOption("Mirrored Repeat");
AddComboParam("Wrap S", "Choose how texture wraps in U direction", "0");
AddComboParamOption("█ NO CHANGE █");
AddComboParamOption("Clamp To Edge");
AddComboParamOption("Repeat");
AddComboParamOption("Mirrored Repeat");
AddComboParam("Wrap T", "Choose how texture wraps in V direction", "0");
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParamOption("Everything");
AddComboParam("Map", "Choose which map's texture animation to affect", 0);
AddComboParamOption("all frames");
AddComboParamOption("current frame");
AddComboParam("Modify", "Choose what to affect", 0);
AddAction(135, af_none, "Set ST wrap", "Texture properties", "Set <b>{2}</b> {3} wrap S to ({0}) and wrap T to ({1}).", "Set the ST wrap properties of current frame's texture for a selected map (ST = UV directions)", "TexturesSetWrap");

AddNumberParam("Repeat U", "How many times the texture repeats in the U direction", initial_string = "1");
AddNumberParam("Repeat V", "How many times the texture repeats in the V direction", initial_string = "1");
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParamOption("Everything");
AddComboParam("Map", "Choose which map's texture animation to affect", 0);
AddComboParamOption("all frames");
AddComboParamOption("current frame");
AddComboParam("Modify", "Choose what to affect", 0);
AddAction(136, af_none, "Set UV repeat", "Texture properties", "Set <b>{2}</b> {3} UV repeat to ({0},{1}).", "Set the UV repeat property of the current frame's texture for a selected map", "TexturesSetRepeat");

AddNumberParam("Offset U", "Amount a single repetition of the texture is offset from the beginning (0 is none, 1 is by a complete tile) in the U direction", initial_string = "0");
AddNumberParam("Offset V", "Amount a single repetition of the texture is offset from the beginning (0 is none, 1 is by a complete tile) in the V direction", initial_string = "0");
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParamOption("Everything");
AddComboParam("Map", "Choose which map's texture animation to affect", 0);
AddComboParamOption("all frames");
AddComboParamOption("current frame");
AddComboParam("Modify", "Choose what to affect", 0);
AddAction(137, af_none, "Set UV offset", "Texture properties", "Set <b>{2}</b> {3} UV offset to ({0},{1}).", "Set the UV offset property of the current frame's texture for a selected map", "TexturesSetOffset");

AddComboParamOption("On");
AddComboParamOption("Off");
AddComboParam("Flip Y", "Choose whether this texture is flipped in the Y direction.", "0");
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParamOption("Everything");
AddComboParam("Map", "Choose which map's texture animation to affect", 0);
AddComboParamOption("all frames");
AddComboParamOption("current frame");
AddComboParam("Modify", "Choose what to affect", 0);
AddAction(138, af_none, "Set Flip Y", "Texture properties", "Set <b>{1}</b> {2} flip Y {0}.", "Set whether the image of the current frame's texture for a selected map is flipped in the Y direction", "TexturesSetFlipY");

AddComboParamOption("On");
AddComboParamOption("Off");
AddComboParam("Mipmaps", "Choose whether this texture generates mipmaps.", "0");
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParamOption("Everything");
AddComboParam("Map", "Choose which map's texture animation to affect", 0);
AddComboParamOption("all frames");
AddComboParamOption("current frame");
AddComboParam("Modify", "Choose what to affect", 0);
AddAction(139, af_none, "Generate mipmaps?", "Texture properties", "Set <b>{1}</b> {2} to generate mipmaps {0}.", "Set whether the current frame's texture for a given map generates associated mipmaps", "TexturesSetGenerateMipMaps");

AddComboParamOption("█ NO CHANGE █");
AddComboParamOption("Linear");
AddComboParamOption("Nearest");
AddComboParam("Mag Filter", "Choose the magnification filtering mode", "0");
AddComboParamOption("█ NO CHANGE █");
AddComboParamOption("Linear MipMap Linear");
AddComboParamOption("Nearest");
AddComboParamOption("Nearest MipMap Nearest");
AddComboParamOption("Nearest MipMap Linear");
AddComboParamOption("Linear");
AddComboParamOption("Linear MipMap Nearest");
AddComboParam("Min Filter", "Choose the minification filtering mode", "0");
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParamOption("Everything");
AddComboParam("Map", "Choose which map's texture animation to affect", 0);
AddComboParamOption("all frames");
AddComboParamOption("current frame");
AddComboParam("Modify", "Choose what to affect", 0);
AddAction(140, af_none, "Set Filtering", "Texture properties", "Set <b>{2}</b> {3} mag filter to {0}, min filter to {1}", "Set the current frame's texture minification and magnification filtering modes for a selected map.", "TexturesSetFiltering");

AddNumberParam("Anisotropy", "Anisotropy value, higher values give less blurryness than just a mipmap alone, but cost more texture samples. power of 2 value recommended", initial_string = "1");
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParamOption("Everything");
AddComboParam("Map", "Choose which map's texture animation to affect", 0);
AddComboParamOption("all frames");
AddComboParamOption("current frame");
AddComboParam("Modify", "Choose what to affect", 0);
AddAction(141, af_none, "Set Anisotropy", "Texture properties", "Set <b>{1}</b> {2} anisotropy to {0}", "Set the current frame's texture's anisotropy for a selected map.", "TexturesSetAnisotropy");

AddStringParam("Texture", "Name of a texture loaded/created using the Q3D master plugin.", initial_string = "\"Texture\"");
AddComboParamOption("Diffuse Map");
AddComboParamOption("Specular Map");
AddComboParamOption("Light Map");
AddComboParamOption("Env Map");
AddComboParamOption("Normal Map");
AddComboParamOption("Bump Map");
AddComboParam("Map", "Choose which map's texture animation to affect", 0);
AddAction(142, af_none, "Texture from Q3D", "x Advanced x stuff x", "Set <b>{1}</b> texture to {0}", "Set the current texture of a selected map to one loaded/created using the Q3D master plug-in. Animation should be stopped or it will change with the next frame", "TexturesAdvancedSwap");

////////////////////////////////////////

AddComboParamOption("On (filled)");
AddComboParamOption("On (wire)");
AddComboParamOption("Off");
AddComboParam("Debug", "Choose whether or not to show the Collision Grid Debug (will only appear if you have conditions which use it)", 2);
AddNumberParam("Cell x size", "Integer value representing the X size the collision grid cells", initial_string = "1000");
AddNumberParam("Cell y size", "Integer value representing the Y size the collision grid cells", initial_string = "1000");
AddNumberParam("Cell z size", "Integer value representing the Z size the collision grid cells", initial_string = "1000");
AddAction(146, af_deprecated, "Coll. grid settings", "Collisions", "Set collision grid dimensions to <i>({1},{2},{3})</i> and turn debug <b>{0}</b>", "Make changes to the collision grid used to accelerate collision queries for this object type", "CollGridSettings");

AddNumberParam("Material Index", "Index of the material (starts at 0).", initial_string = "0");
AddAction(150, af_none, "Select model material", "x Advanced x stuff x", "Select model material <b>{0}</b>.", "Allow the actions used for modifying materials to effect a material loaded with the model / material file. Depending on whether or not unique material is specified, effect will be per instance or per model. Setting uniforms that don't exist will cause errors. Indexes are generated so trial and error may be necessary.", "SelectModelMaterial");

//None|Sphere|AABB|Box|Ellipsoid
AddComboParamOption("None");
AddComboParamOption("Sphere");
AddComboParamOption("AABB");
AddComboParamOption("Box");
//AddComboParamOption("Ellipsoid");
AddComboParam("Collider", "Type of collider to use for this object in collision tests", 0);
AddAction(151, af_none, "Change collider type", "Collisions", "Change collider type to <b>{0}</b>", "Changes the type of collider this object uses", "ChangeCollider");

AddStringParam("Model name", "Name of the model file to load (must be a valid filetype added to the projects files).", initial_string = "\"MyObj.obj\"");
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Autoload", "Choose whether the model is automatically loaded if it hasn't been loaded yet, otherwise you'll have to load it manually, and a callback will be fired when it is loaded to update the model", 0);
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Keep Mat. Settings", "For a small performance cost, save the material properties and update the new object's material with whichever properties match", 0);
AddAction(152, af_none, "Change model", "x Advanced x stuff x", "Change model to <b>{0}</b>, Autoload : <i>{1}</i>, Keep Mat. Settings : <i>{2}</i>.", "Change model to a specified file-name, if object hasn't been loaded will do so", "ChangeModel");

AddStringParam("Morph name", "Name of the morph target to use (name : in .js file)", initial_string = "\"Morph1\"");
AddNumberParam("Influence", "Value from 0 to 1 defining the influence from 0 (none) to 1 (full) of the named target, higher values overshoot target but cna be used.", initial_string = "0");
AddAction(153, af_none, "Change morph influence", "Morph targets", "Change morph target <i>{0}</i> influence to <i>({1})</i>.", "Choose a named morph target from a .js file using a string, and set the influence", "MorphInf");

AddComboParamOption("Phong");
AddComboParamOption("Lambert");
AddComboParamOption("Basic");
AddComboParamOption("Normal");
AddComboParamOption("Depth");
AddComboParam("Type", "Choose which material type to change to (may cause a pause as shaders are rebuilt), note that all the values are reset.", 0);
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Keep Mat. Settings", "For a small performance cost, save the material properties and update the new object's material with whichever properties match", 0);
AddAction(154, af_none, "Change material type", "Material", "Change material type to <b>{0}</b>, Keep Mat. Settings : <i>{1}</i>.", "Change material type", "ChangeMaterialType");

AddStringParam("Shader file", "URL of a .qfx shader file", initial_string = "\"Shader.qfx\"");
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Keep Mat. Settings", "For a small performance cost, save the material properties and update the new object's material with whichever properties match", 0);
AddAction(155, af_none, "Set material to shader", "Shader", "Change material to shader <b>{0}</b>, Keep Mat. Settings : <i>{1}</i>.", "Change material to a shader.", "ChangeToShader");

AddStringParam("Uniform Name", "Name of the uniform to modify", initial_string = "\"Uniform\"");
AddNumberParam("Number", "Change the number value of a uniform of type int or float", initial_string = "0");
AddAction(156, af_none, "Set uniform (number)", "Shader", "Change shader uniform (number) <b>{0}</b> to <i>({1})</i>.", "Change a shader uniform which has a single number value.", "setUniformNum");

AddStringParam("Uniform Name", "Name of the uniform to modify", initial_string = "\"Uniform\"");
AddNumberParam("x", "Change the x component of a vec2 uniform", initial_string = "0");
AddNumberParam("y", "Change the y component of a vec2 uniform", initial_string = "0");
AddAction(157, af_none, "Set uniform (vec2)", "Shader", "Change shader uniform (vec2) <b>{0}</b> to <i>({1},{2})</i>.", "Change a shader uniform which has a vec2 value (x,y).", "setUniformVec2");

AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Keep Mat. Settings", "For a small performance cost, save the material properties and update the new object's material with whichever properties match", 0);
AddAction(158, af_none, "Use model materials", "Material", "Use <b>model materials</b>, Keep Mat. Settings : <i>{0}</i>.", "Use the materials defined with the model file, if they exist.", "changeToModelMats");

AddComboParamOption("Default");
AddComboParamOption("Flat");
AddComboParam("Shading", "Default uses whatever normals are defined in the model file, Flat ignores them and makes the model look faceted.", 0);
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Keep Mat. Settings", "For a small performance cost, save the material properties and update the new object's material with whichever properties match", 0);
AddAction(159, af_none, "Set shading", "Material", "Set shading to <b>{0}</b>, Keep Mat. Settings : <i>{1}</i>.", "Change the model shading type", "changeShading");

AddComboParamOption("Default");
AddComboParamOption("None");
AddComboParam("Morph Normals", "Default uses morph normals defined in the file/ generated if there were none, and none does not use morph normals at all (allows for more concurrent morph influences)", 0);
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Keep Mat. Settings", "For a small performance cost, save the material properties and update the new object's material with whichever properties match", 0);
AddAction(160, af_none, "Morph normals", "Morph targets", "Set morph normals to <b>{0}</b>, Keep Mat. Settings : <i>{1}</i>.", "Chose how / if morph normals are used", "changeMorphNormals");

AddStringParam("Uniform Name", "Name of the uniform to modify", initial_string = "\"Uniform\"");
AddNumberParam("x", "Change the x component of a vec3 uniform", initial_string = "0");
AddNumberParam("y", "Change the y component of a vec3 uniform", initial_string = "0");
AddNumberParam("z", "Change the z component of a vec3 uniform", initial_string = "0");
AddAction(161, af_none, "Set uniform (vec3)", "Shader", "Change shader uniform (vec3) <b>{0}</b> to <i>({1},{2},{3})</i>.", "Change a shader uniform which has a vec3 value (x,y,z).", "setUniformVec3");

AddStringParam("Uniform Name", "Name of the uniform to modify", initial_string = "\"Uniform\"");
AddNumberParam("x", "Change the x component of a vec4 uniform", initial_string = "0");
AddNumberParam("y", "Change the y component of a vec4 uniform", initial_string = "0");
AddNumberParam("z", "Change the z component of a vec4 uniform", initial_string = "0");
AddNumberParam("w", "Change the w component of a vec4 uniform", initial_string = "0");
AddAction(162, af_none, "Set uniform (vec4)", "Shader", "Change shader uniform (vec4) <b>{0}</b> to <i>({1},{2},{3},{4})</i>.", "Change a shader uniform which has a vec4 value (x,y,z,w).", "setUniformVec4");

AddStringParam("Uniform Name", "Name of the uniform to modify", initial_string = "\"Uniform\"");
AddNumberParam("color", "Change the value of a color type uniform (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddAction(163, af_none, "Set uniform (color)", "Shader", "Change shader uniform (color) <b>{0}</b> to <i>({1})</i>.", "Change a shader uniform which is a hex color type.", "setUniformColor");

AddStringParam("Uniform Name", "Name of the uniform to modify", initial_string = "\"Uniform\"");
AddNumberParam("Row 0 (0,0)", "Value of matrix entry Xx", initial_string = "1")
AddNumberParam("(1,0)", "Value of matrix entry Xy", initial_string = "0")
AddNumberParam("(2,0)", "Value of matrix entry Xz", initial_string = "0")
AddNumberParam("Row 1 (0,1)", "Value of matrix entry Yx", initial_string = "0")
AddNumberParam("(1,1)", "Value of matrix entry Yy", initial_string = "1")
AddNumberParam("(2,1)", "Value of matrix entry Yz", initial_string = "0")
AddNumberParam("Row 2 (0,2)", "Value of matrix entry Zx", initial_string = "0")
AddNumberParam("(1,2)", "Value of matrix entry Zy", initial_string = "0")
AddNumberParam("(2,2)", "Value of matrix entry Zz", initial_string = "1")
AddAction(164, af_none, "Set uniform (mat3)", "Shader", "Change shader uniform (mat3) <b>{0}</b> to <i><b>[Rows]</b> : [{1},{2},{3}] , [{4},{5},{6}] , [{7},{8},{9}]</i>.", "Change a shader uniform which has a 3x3 matrix value.", "setUniformMat3");

AddStringParam("Uniform Name", "Name of the uniform to modify", initial_string = "\"Uniform\"");
AddNumberParam("Row 0 (0,0)", "Value of matrix entry Xx", initial_string = "1")
AddNumberParam("(1,0)", "Value of matrix entry Xy", initial_string = "0")
AddNumberParam("(2,0)", "Value of matrix entry Xz", initial_string = "0")
AddNumberParam("(3,0)", "Value of matrix entry Xw", initial_string = "0")
AddNumberParam("Row 1 (0,1)", "Value of matrix entry Yx", initial_string = "0")
AddNumberParam("(1,1)", "Value of matrix entry Yy", initial_string = "1")
AddNumberParam("(2,1)", "Value of matrix entry Yz", initial_string = "0")
AddNumberParam("(3,1)", "Value of matrix entry Yw", initial_string = "0")
AddNumberParam("Row 2 (0,2)", "Value of matrix entry Zx", initial_string = "0")
AddNumberParam("(1,2)", "Value of matrix entry Zy", initial_string = "0")
AddNumberParam("(2,2)", "Value of matrix entry Zz", initial_string = "1")
AddNumberParam("(3,2)", "Value of matrix entry Zw", initial_string = "0")
AddNumberParam("Row 3 (0,3)", "Value of matrix entry Wx", initial_string = "0")
AddNumberParam("(1,3)", "Value of matrix entry Wy", initial_string = "0")
AddNumberParam("(2,3)", "Value of matrix entry Wz", initial_string = "0")
AddNumberParam("(3,3)", "Value of matrix entry Ww", initial_string = "1")
AddAction(165, af_none, "Set uniform (mat4)", "Shader", "Change shader uniform (mat4) <b>{0}</b> to <i><b>[Rows]</b> : [{1},{2},{3},{4}] , [{5},{6},{7},{8}] , [{9},{10},{11},{12}] , [{13},{14},{15},{16}]</i>.", "Change a shader uniform which has a 4x4 matrix value.", "setUniformMat4");

AddStringParam("Uniform Name", "Name of the uniform to modify", initial_string = "\"Uniform\"");
AddStringParam("Texture name", "Choose a named texture created with Q3D Master", initial_string = "\"Texture\"");
AddAction(166, af_none, "Set uniform (texture)", "Shader", "Change shader uniform (texture) <b>{0}</b> to named texture : <i>{1}</i>.", "Change a shader uniform which is a texture type (cube or 2D).", "setUniformTexture");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example
//______________________________________________________________________________________________

AddExpression(33, ef_return_number, "Env. amount", "Material", "EnvAmount", "Return the environment mapping amount of the current material");

AddExpression(34, ef_return_number, "Refract. ratio", "Material", "RefractRatio", "Return the refraction ratio of the current material");

AddExpression(35, ef_return_number, "Polygon offset factor", "Material", "pOffsetFactor", "Return the polygon offset factor of the current material");

AddExpression(36, ef_return_number, "Polygon offset units", "Material", "pOffsetUnits", "Return the polygon offset units of the current material");

//AddExpression(37, ef_return_number, "Alpha test", "Material", "AlphaTest", "Return the alpha test value of the current material");

AddExpression(38, ef_return_number, "Bump scale", "Material", "BumpScale", "Return the bump scale of the current material");

//AddExpression(39, ef_return_number, "Ambient color", "Material", "Ambient", "Return the hex value ambient color of the current material");

AddExpression(40, ef_return_number, "Diffuse color", "Material", "Diffuse", "Return the hex value diffuse color of the current material");

AddExpression(41, ef_return_number, "Emissive color", "Material", "Emissive", "Return the hex value emissive color of the current material");

AddExpression(42, ef_return_number, "Specular color", "Material", "Specular", "Return the hex value specular color of the current material");

AddExpression(43, ef_return_number, "Normal scale x", "Material", "NormalScaleX", "Return the x component of the normal scale of the current material");
AddExpression(44, ef_return_number, "Normal scale y", "Material", "NormalScaleY", "Return the y component of the normal scale of the current material");

AddExpression(45, ef_return_number, "Opacity", "Material", "Opacity", "Return the opacity value of the current material (0 to 1 based rather than 0 to 100)");

AddExpression(46, ef_return_number, "Shininess", "Material", "Shininess", "Return the shininess value of the current material");

//______________________________________________________________________________________________

AddStringParam("\"DiffuseMap\"")		// a string
AddExpression(47, ef_return_number, "Animation Frame", "Texture animations", "TexAnimationFrame", "Return the current animation frame of a current map's texture animation (needs a string like ''DiffuseMap'' as a param to select which map's texture animation to choose)");

AddStringParam("\"DiffuseMap\"")		// a string
AddExpression(48, ef_return_number, "Animation Frame Count", "Texture animations", "TexAnimationFrameCount", "Return the number of animation frames in a current map's texture animation (needs a string like ''DiffuseMap'' as a param to select which map's texture animation to choose)");

AddStringParam("\"DiffuseMap\"")		// a string
AddExpression(49, ef_return_string, "Animation Name", "Texture animations", "TexAnimationName", "Return the name of a current map's texture animation (needs a string like ''DiffuseMap'' as a param to select which map's texture animation to choose)");

//______________________________________________________________________________________________

AddStringParam("\"DiffuseMap\"")		// a string
AddExpression(50, ef_return_number, "Anisotropy", "Texture properties", "TexAnisotropy", "Return the Anisotropy of a current map's texture animation texture frame (needs a string like ''DiffuseMap'' as a param to select which map's texture animation to choose)");

AddStringParam("\"DiffuseMap\"")		// a string
AddExpression(51, ef_return_number, "Offset U", "Texture properties", "TexOffsetU", "Return the U offset of a current map's texture animation texture frame (needs a string like ''DiffuseMap'' as a param to select which map's texture animation to choose)");

AddStringParam("\"DiffuseMap\"")		// a string
AddExpression(52, ef_return_number, "Offset V", "Texture properties", "TexOffsetV", "Return the V offset of a current map's texture animation texture frame (needs a string like ''DiffuseMap'' as a param to select which map's texture animation to choose)");

AddStringParam("\"DiffuseMap\"")		// a string
AddExpression(53, ef_return_number, "Repeat U", "Texture properties", "TexRepeatU", "Return the repeat U value of a current map's texture animation texture frame (needs a string like ''DiffuseMap'' as a param to select which map's texture animation to choose)");

AddStringParam("\"DiffuseMap\"")		// a string
AddExpression(54, ef_return_number, "Repeat V", "Texture properties", "TexRepeatV", "Return the repeat V value of a current map's texture animation texture frame (needs a string like ''DiffuseMap'' as a param to select which map's texture animation to choose)");

//_____________________________________________________________________________________________


//_____________________________________________________________________________________________

AddExpression(58, ef_return_string, "Model File", "Model", "modelName", "Return the filename of the objects model");

AddStringParam("\"Morph1\"")
AddExpression(59, ef_return_number, "Morph Influence", "Morph targets", "MorphInf", "Return the influence value applied to a particular named morph target (invalid names return 0)");


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////					EDITTIME COMMON ACE								  //////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	

populateCommonACE();

ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
	
	new cr.Property(ept_section, "General Properties", "",	"General properties affecting things like initial position, scale, rotation, and visibility."),
		new cr.Property(ept_combo,	"Initial Visibility",	"Visible",	"Choose whether the object is visible when the layout starts.", "Visible|Invisible"),
		new cr.Property(ept_float, 	"Z Position",		0,		"Z position of the 3D object, positive direction goes 'into' the screen"),
		new cr.Property(ept_text, 	"Rotation Order",		"ZYX",		"Euler angles rotation order."),
		new cr.Property(ept_float, 	"Rotation X",		0,		"Rotation amount around the local object X axis (red) in degrees (roll)"),
		new cr.Property(ept_float, 	"Rotation Y",		0,		"Rotation amount around the local object Y axis (green) in degrees (pitch)"),
		new cr.Property(ept_float, 	"Z Size",		100,		"Z Scaling of the 3D object"),
	
	new cr.Property(ept_section, "Debug properties", "",	"Properties to help with debugging the 3D object in the editor and at runtime."),
		new cr.Property(ept_combo, 	"Editor Rep.",		"Wire",		"Representation of collider debug in editor and runtime","Wire|Shaded|Textured|LayoutIcon"),
		new cr.Property(ept_combo, 	"B.Box Debug",		"On",		"Show the bounding box and axis helper at runtime","On|Off"),
		new cr.Property(ept_combo, 	"Collider Debug",		"On",		"Show a representation of the collision geometry at runtime (smooth surfaces are only approximated by geometry).","On|Off"),
	
	new cr.Property(ept_section, "Model properties", "",	"Properties affecting which model to use, and how to scale and position that model."),
		new cr.Property(ept_combo,  "Use Model",		"No",		"If you want the object to use a loaded model using a filename specified below, choose yes. Make sure it's a valid name/file or bugs might appear in export","Yes|No"),
		new cr.Property(ept_text,		"Model Filename",	"MyObj.obj",	"The URL/filename of the model to use if ''use model'' is set to yes."),
		new cr.Property(ept_combo,  "Model Auto Load",		"Yes",		"Choose yes if you want the filename specified to automatically be loaded in when the first object with it is created","Yes|No"),
		new cr.Property(ept_combo,  "Model Placement",		"Center",		"Choose how the model is positioned relative to the bounding box","Center|Unaltered"),
		new cr.Property(ept_combo,  "Model Fit",		"Fit",		"Choose how the model is scaled on import if at all to fit the bounding box","Fit|Fit X|Fit Y|Fit Z|Unaltered"),
		new cr.Property(ept_float, 	"Model Offset X",		0,		" X offset factor"),
		new cr.Property(ept_float, 	"Model Offset Y",		0,		" Y offset factor"),
		new cr.Property(ept_float, 	"Model Offset Z",		0,		" Z offset factor"),
		new cr.Property(ept_float, 	"Model Rotation X",		0,		" X rotation (XYZ order rotation)"),
		new cr.Property(ept_float, 	"Model Rotation Y",		0,		" Y rotation (XYZ order rotation)"),
		new cr.Property(ept_float, 	"Model Rotation Z",		0,		" Z rotation (XYZ order rotation)"),
		new cr.Property(ept_float, 	"Model Scale X",		1,		" X scale"),
		new cr.Property(ept_float, 	"Model Scale Y",		1,	    " Y scale"),
		new cr.Property(ept_float, 	"Model Scale Z",		1,		" Z scale"),
	
	new cr.Property(ept_section, "Collision properties", "",	"Properties affecting collision detection and the collider body."),
		new cr.Property(ept_combo, 	"Collider Type",		"Box",		"Type of collider to use when collision testing this object","None|Sphere|AABB|Box"),
		new cr.Property(ept_combo,  "Collider Fit",		"B.Box",		"Choose what the collider is fit to.","B.Box|Model"),
		new cr.Property(ept_float, 	"Collider Offset X",		0,		" X offset factor"),
		new cr.Property(ept_float, 	"Collider Offset Y",		0,		" Y offset factor"),
		new cr.Property(ept_float, 	"Collider Offset Z",		0,		" Z offset factor"),
		new cr.Property(ept_float, 	"Collider Rotation X",		0,		" X rotation (XYZ order rotation)"),
		new cr.Property(ept_float, 	"Collider Rotation Y",		0,		" Y rotation (XYZ order rotation)"),
		new cr.Property(ept_float, 	"Collider Rotation Z",		0,		" Z rotation (XYZ order rotation)"),
		new cr.Property(ept_float, 	"Collider Scale X",		1,		" X scale"),
		new cr.Property(ept_float, 	"Collider Scale Y",		1,		" Y scale"),
		new cr.Property(ept_float, 	"Collider Scale Z",		1,		" Z scale"),
	
	new cr.Property(ept_section, "Material properties", "",	"Properties affecting materials / material importing."),
		new cr.Property(ept_combo, 	"Transparent",		"No",		"Give the renderer instructions to render this object's material with transparency.","Yes|No"),
		new cr.Property(ept_combo, 	"Model Materials",		"No",		"If set to No, overrides loaded materials/textures with a \"Material Type\" and animation frame based textures, if set to Yes, creates the model with the materials / textures specified in / with the model & material file","Yes|No"),
		new cr.Property(ept_combo, 	"Unique Material",		"Yes",		"Setting which determines if the material's color/texture etc. is shared between all instances, disable to improve performance if all instances are alike.","Yes|No"),
		new cr.Property(ept_combo, 	"Unique Textures",		"No",		"This feature only works if Unique Material is enabled. Setting to ''Yes'' means that texture properties like UV offset, Repeat, etc. can be changed per instance rather than globally, at the cost of memory and performance.","Yes|No"),
		new cr.Property(ept_combo, 	"Light Map UVs",		"Primary set",		"Choose the UV's to use for this objects LightMap if it has one.","Primary set|Secondary set"),
		new cr.Property(ept_combo, 	"Material Type",		"Phong",		"Choose the type of material to create for this object, note that not all materials support all features.","Phong|Lambert|Basic|Normal|Depth|Shader"),
		new cr.Property(ept_text,		"Shader", "",	"The URL/name of the .qfx GLSL shader to use if Material Type is \"Shader\"."),
		
	new cr.Property(ept_section, "Lighting properties", "",	"Properties affecting lighting / shadows."),
		new cr.Property(ept_combo, 	"Shadows",		"Off",		"Determine how shadow mapping is handled for this instance.","Off|Cast|Receive|Cast & Receive"),
		new cr.Property(ept_combo, 	"Shading",		"Default",		"Determine how lighting affects the objects","Default|Flat"),
		new cr.Property(ept_combo, 	"Morph Normals",		"Default",		"Choose how to handle morph target normals. Default will choose either generated morph normals if the model file has none, or whatever is defined in the json model.","Default|None")
		
	//new cr.Property(ept_section, "Morph targets", "",	"Properties affecting lighting / shadows."),
		//new cr.Property(ept_combo, 	"Morph targets",		"Off",		"If the model has morph targets, use this to allow for their animation","On|Off")
	
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
	
	// texture crap
	this.just_inserted = false;
	this.texture_loaded = false;
	this.last_imgsize = new cr.vector2(0, 0);
	this.last_texture = null;
	this.last_texture_id = "";
	
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(100, 100));
	
	this.just_inserted = true;
};

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{

    if (property_name === "Model Filename")
	{
        			BalloonTipLastProperty("Reminder",
								   "Ensure the model file is added to the construct files folder, and is a valid .js or .obj model.",
								   bti_info);
    };

}

/*var str = ""
var key
for (key in window) {str = str+key+" , "};
alert(str);*/

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
	if(this.properties["Editor Rep."] == "Textured"){
		this.last_texture = this.instance.GetTexture(0,"DiffuseMap");
		this.last_texture_id = this.last_texture.GetID();
	
		renderer.LoadTexture(this.last_texture);
		this.texture_loaded = true;
	}else if(this.properties["Editor Rep."] == "LayoutIcon"){
		this.last_texture = this.instance.GetTexture(0,"LayoutIcon");
		this.last_texture_id = this.last_texture.GetID();
	
		renderer.LoadTexture(this.last_texture);
		this.texture_loaded = true;
	}

	
	//this.instance.SetHotspot(this.last_texture.GetHotspot());
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
	if(this.properties["Editor Rep."] == "Textured"){
		var texture = this.instance.GetTexture(0,"DiffuseMap");
		var texture_id = texture.GetID();
	}else if(this.properties["Editor Rep."] == "LayoutIcon"){
		var texture = this.instance.GetTexture(0,"LayoutIcon");
		var texture_id = texture.GetID();
	}

	if (this.last_texture_id !== "" && this.last_texture_id !== texture_id)
	{
		// Texture has changed: unload old and reload new.
		if (this.last_texture)
			renderer.ReleaseTexture(this.last_texture);
			
		renderer.LoadTexture(texture);
		//this.instance.SetHotspot(texture.GetHotspot());
	}
	
	this.last_texture = texture;
	this.last_texture_id = texture_id;
	
	//renderer.SetTexture(texture);
	if(this.properties["Editor Rep."] == "Textured" || this.properties["Editor Rep."] == "LayoutIcon"){
		var imgsize = texture.GetImageSize();

		
		// First draw after insert: use size of texture.
		// Done after SetTexture so the file is loaded and dimensions known, preventing
		// the file being loaded twice.
		if (this.just_inserted)
		{
			this.just_inserted = false;
			//this.instance.SetSize(imgsize);
			
			//RefreshPropertyGrid();		// show new size
		}
		// If not just inserted and the sprite texture has been edited and changed size, scale the texture accordingly.
		else if ((imgsize.x !== this.last_imgsize.x || imgsize.y !== this.last_imgsize.y)
			&& (this.last_imgsize.x !== 0 && this.last_imgsize.y !== 0))
		{
			var sz = new cr.vector2(imgsize.x / this.last_imgsize.x, imgsize.y / this.last_imgsize.y);
			var instsize = this.instance.GetSize();
			
			//sz.mul(instsize.x, instsize.y);
			//this.instance.SetSize(sz);
			//this.instance.SetHotspot(texture.GetHotspot());
			
			//RefreshPropertyGrid();		// show new size
		}

		this.last_imgsize = imgsize;
	};
	
	/*if (renderer.SupportsFullSmoothEdges())
	{
		// Get the object size and texture size
		var objsize = this.instance.GetSize();
		var texsize = texture.GetImageSize();
		
		// Calculate pixels per texel, then get a quad padded with a texel padding
		var pxtex = new cr.vector2(objsize.x / texsize.x, objsize.y / texsize.y);
		var q = this.instance.GetBoundingQuad(new cr.vector2(pxtex.x, pxtex.y));
		
		// Calculate the size of a texel in texture coordinates, then calculate texture coordinates
		// for the texel padded quad
		var tex = new cr.vector2(1.0 / texsize.x, 1.0 / texsize.y);
		var uv = new cr.rect(-tex.x, -tex.y, 1.0 + tex.x, 1.0 + tex.y);
		
		// Render a quad with a half-texel padding for smooth edges
		//renderer.Quad(q, this.instance.GetOpacity(), uv);
		var SMETest = true;
	}
	else
	{
	
		var SMETest = false;
		// Fall back to half-smoothed or jagged edges, depending on what the renderer supports
		//renderer.Quad(this.instance.GetBoundingQuad(), this.properties["Opacity"]);
	};*/

	/////////////////////////////////////////////// 3D drawing
	
	/*var rotate = function(arr,amount) {
    
	};*/
	
    //var q=this.instance.GetBoundingQuad();
	//renderer.Fill(q, cr.RGB(230,230,230));
	//renderer.Outline(q, cr.RGB(0,0,0));
	
	var q= this.instance.GetSize();
	var quad = this.instance.GetBoundingQuad();
	
	var xpos = (quad.tlx+quad.trx+quad.blx+quad.brx)/4;
	var ypos = (quad.tly+quad.try_+quad.bly+quad.bry)/4;  // i don't know how to get the position of the object... its not in the sdk
	
	var xtemp;
	var ytemp;
	var ztemp;
	
	var zsize = this.properties["Z Size"];
	var zpos = this.properties["Z Position"];
	
	q.x	 *=this.properties["Collider Scale X"];
	q.y	 *=this.properties["Collider Scale Y"];
	zsize*=this.properties["Collider Scale Z"];
	
	var xrot = this.properties["Rotation X"]*(Math.PI/180);
	var yrot = this.properties["Rotation Y"]*(Math.PI/180);
	var zrot = cr.angleTo(quad.tlx, quad.tly, quad.trx, quad.try_);  //this.properties["Rotation Z"]*(Math.PI/180);this.instance.getAngle()*(Math.PI/180); // get angle seems to be new, not gonna use it.
	
	var rcos;
	var rsin;
	
	var verts = [];
	var faces = [];
	
	var hsegs = 6;
	var csegs = 12;
	
	if(this.properties["Collider Fit"] == "B.Box"){
	var maxExtent = Math.max(Math.abs(q.x),Math.abs(q.y),Math.abs(zsize));
	}
	else maxExtent = Math.sqrt(q.x*q.x+q.y*q.y+zsize*zsize);
	
	var XmaxExtent = 0;
	var YmaxExtent = 0;
	
	var outlineCol = cr.RGB(0,0,0);
	
	if(this.properties["Collider Type"] == "Box"||this.properties["Collider Type"] == "AABB"){
		var verts = [[q.x/2,q.y/2,zsize/2],[q.x/-2,q.y/2,zsize/2],[q.x/-2,q.y/-2,zsize/2],[q.x/2,q.y/-2,zsize/2]   ,   [q.x/2,q.y/2,zsize/-2],[q.x/-2,q.y/2,zsize/-2],[q.x/-2,q.y/-2,zsize/-2],[q.x/2,q.y/-2,zsize/-2]]; // list of vertices of object
		var faces = [[3,2,1,0],[4,5,6,7],[5,4,0,1],[3,0,4,7],[2,6,5,1],[2,3,7,6]];
	};
	if(this.properties["Collider Type"] == "Ellipsoid"||this.properties["Collider Type"] == "Sphere"&& (this.properties["Editor Rep."] == "Shaded" || this.properties["Editor Rep."] == "Textured")){
	
		var xrad = q.x;
		var yrad = q.y;
		var zrad = zsize;
		
		if(this.properties["Collider Type"] == "Sphere"){
		xrad = maxExtent;
		yrad = maxExtent;
		zrad = maxExtent;
		
		outlineCol = cr.RGB(240,240,240);
		}
	
		for (var z = -1*hsegs+1; z <= hsegs-1 ; z++) {
		
		ztemp = Math.cos((z/hsegs)*Math.PI/2);
		xtemp = Math.sin((z/hsegs)*Math.PI/2);
		
		for (var i = 0; i < csegs ; i++) {
		
		rcos = Math.cos((i/csegs)*(2*Math.PI));
		rsin = Math.sin((i/csegs)*(2*Math.PI));
		
		//verts[(z+hsegs)*csegs+i] = [rcos*ztemp*q.x/2,rsin*ztemp*q.y/2,xtemp*zsize/2]
		//verts.push([rcos*ztemp*q.x/2,rsin*ztemp*q.y/2,xtemp*zsize/2]);
		verts.push([rcos*ztemp*xrad/2,xtemp*yrad/-2,rsin*ztemp*zrad/2]);
		//alert(verts[(z+10)*20+i])
		
		};
		};
		
		//verts.push([0,0,zsize/2]);
		//verts.push([0,0,zsize/-2]);
		verts.push([0,yrad/-2,0]);
		verts.push([0,yrad/2,0]);
		
		for (var z = -1*hsegs+1; z <= hsegs-2 ; z++) {
		for (var i = 0; i < csegs ; i++) {
		
		//faces[(z+hsegs-1)*csegs+i] = [(z+hsegs)*csegs+i,(z+hsegs+1)*csegs+i,(z+hsegs+1)*csegs+((i+1)%csegs),(z+hsegs)*csegs+((i+1)%csegs)];//[(z+10)*20+i,(z+10)*20+((i+1)%20),(z+10+1)*20+((i+1)%20),(z+10+1)*20+i];
		faces.push([(z+hsegs-1)*csegs+i,(z+hsegs-1+1)*csegs+i,(z+hsegs-1+1)*csegs+((i+1)%csegs),(z+hsegs-1)*csegs+((i+1)%csegs)]);
		//alert((z+10)*20+i);
		
		};
		};
		
		for (var i = 0; i < csegs ; i++) {
		
		faces.push([i,(i+1)%csegs,verts.length-1,verts.length-1]);
		//faces.push([(hsegs*2-2)*csegs+i,(hsegs*2-2)*csegs+(i+1)%csegs,verts.length-2,verts.length-2]);
		faces.push([(hsegs*2-2)*csegs+i,verts.length-2,verts.length-2,(hsegs*2-2)*csegs+(i+1)%csegs]);
		
		};
		
		//faces[0] = [0,1,21,20];
		//alert(faces[0]);

		//verts = [[q.x/2,q.y/2,0],[q.x/-2,q.y/2,0],[q.x/-2,q.y/-2,0],[q.x/2,q.y/-2,0]]
		//faces = [[0,1,2,3]];
	
	};
	

	
	/*faces[0][5] = cr.RGB(200,200,255);
	faces[1][5] = cr.RGB(200,200,255);
	faces[2][5] = cr.RGB(200,255,200);
	faces[5][5] = cr.RGB(200,255,200);
	faces[3][5] = cr.RGB(255,200,200);
	faces[4][5] = cr.RGB(255,200,200);*/
	
	var mtx = [[1,0,0],[0,1,0],[0,0,1]]; // initial matrix
	
	//alert(mtx[0][0]);
	
	//var mtxt = [[],[],[]]; // temp matrix?
	var xsto;
	var ysto;
	//var zsto;
	
	var rotfunc = function(c){
		if(c==="X"){
			
			// X rotation
		
			rcos = Math.cos(xrot);
			rsin = Math.sin(xrot);
			
			for (var i = 0; i <= 2 ; i++) { 
			
			xsto = mtx[i][1]*rcos - mtx[i][2]*rsin
			ysto = mtx[i][1]*rsin + mtx[i][2]*rcos
			
			mtx[i][1] = xsto;
			mtx[i][2] = ysto;
			
			};
		};
		
		if(c==="Y"){
			
			// Y rotation
		
			rcos = Math.cos(yrot*-1); // needs this to work properly with rotations in actual runtime
			rsin = Math.sin(yrot*-1);
			
			for (var i = 0; i <= 2 ; i++) { 
			
			xsto = mtx[i][0]*rcos - mtx[i][2]*rsin
			ysto = mtx[i][0]*rsin + mtx[i][2]*rcos
			
			mtx[i][0] = xsto;
			mtx[i][2] = ysto;
		
			};
		};
		
		if(c==="Z"){
				
			// Z rotation
		
			rcos = Math.cos(zrot);
			rsin = Math.sin(zrot);
			
			for (var i = 0; i <= 2 ; i++) { 
			
			xsto = mtx[i][0]*rcos - mtx[i][1]*rsin
			ysto = mtx[i][0]*rsin + mtx[i][1]*rcos
			
			mtx[i][0] = xsto;
			mtx[i][1] = ysto;
			
			};
		};
	};
	
	/*// XYZ order rotation? calculate transform matrix about origin then shift by position
	
		// X rotation
	
		rcos = Math.cos(xrot);
		rsin = Math.sin(xrot);
		
		for (var i = 0; i <= 2 ; i++) { 
		
		xsto = mtx[i][1]*rcos - mtx[i][2]*rsin
		ysto = mtx[i][1]*rsin + mtx[i][2]*rcos
		
		mtx[i][1] = xsto;
		mtx[i][2] = ysto;
		
		};
	
		// Y rotation
	
		rcos = Math.cos(yrot);
		rsin = Math.sin(yrot);
		
		for (var i = 0; i <= 2 ; i++) { 
		
		xsto = mtx[i][0]*rcos - mtx[i][2]*rsin
		ysto = mtx[i][0]*rsin + mtx[i][2]*rcos
		
		mtx[i][0] = xsto;
		mtx[i][2] = ysto;
		
		};
		
		// Z rotation
	
		rcos = Math.cos(zrot);
		rsin = Math.sin(zrot);
		
		for (var i = 0; i <= 2 ; i++) { 
		
		xsto = mtx[i][0]*rcos - mtx[i][1]*rsin
		ysto = mtx[i][0]*rsin + mtx[i][1]*rcos
		
		mtx[i][0] = xsto;
		mtx[i][1] = ysto;
		
		};
		
	/////////////////////////////////////////*/
	
	rotfunc(this.properties["Rotation Order"].charAt(2));
	rotfunc(this.properties["Rotation Order"].charAt(1));
	rotfunc(this.properties["Rotation Order"].charAt(0));
	
	/////////////////////////////////////////

	//renderer.Outline(quad, cr.RGB(128,128,128));
	
	for (var i = 0; i < verts.length ; i++) { 
	
	xsto = verts[i][0]*mtx[0][0]+verts[i][1]*mtx[1][0]+verts[i][2]*mtx[2][0]
	ysto = verts[i][0]*mtx[0][1]+verts[i][1]*mtx[1][1]+verts[i][2]*mtx[2][1]
	
	XmaxExtent = Math.max(XmaxExtent,xsto);
	YmaxExtent = Math.max(YmaxExtent,ysto);
	
	verts[i][2] = verts[i][0]*mtx[0][2]+verts[i][1]*mtx[1][2]+verts[i][2]*mtx[2][2]+zpos;
	verts[i][0] = xsto+xpos;
	verts[i][1] = ysto+ypos;
	
	};
	
	//draw circle
	
	xsto = new cr.vector2(20,0);
	ysto = new cr.vector2(20,0);

	rcos = Math.cos((Math.PI/4.5))
	rsin = Math.sin((Math.PI/4.5))
	
	for (var i = 0; i < 9 ; i++) {
	
	xsto.x = ysto.x*rcos - ysto.y*rsin;
	xsto.y = ysto.x*rsin + ysto.y*rcos;
	
	renderer.Line(new cr.vector2(xpos+xsto.x,ypos+xsto.y), new cr.vector2(xpos+ysto.x,ypos+ysto.y), cr.RGB(200,200,200));
	
	ysto = new cr.vector2(xsto.x,xsto.y);
		
	};
	
	renderer.Outline(quad, cr.RGB(200,200,200));
	
	//Project everything (LOOKS CONFUSING IN WIREFRAME)
	/*
	for (var i = 0; i <= 7 ; i++) {
	
	verts[i][0] += verts[i][2]*0.1
	verts[i][1] += verts[i][2]*0.1
	
	};
	
	for (var i = 0; i <= 2 ; i++) {
	
	mtx[i][0] += mtx[i][2]*0.1
	mtx[i][1] += mtx[i][2]*0.1
	
	};
	
	xpos += zpos*0.1;
	ypos += zpos*0.1;
	*/
	
	
	//renderer.Line(new cr.vector2(xpos,ypos), new cr.vector2(xpos+(mtx[1][0])*50,ypos+(mtx[1][1])*50), mtx[1][3]);
	//renderer.Line(new cr.vector2(xpos,ypos), new cr.vector2(xpos+(mtx[2][0])*50,ypos+(mtx[2][1])*50), mtx[2][3]);
	
	// Draw/Sort Faces for colliders
	
	for (var k = 0; k < faces.length ; k++) {
	
	faces[k][4] = [0,0,0];
	faces[k][6] = [0,0,0];
	
	faces[k][6][0] = (verts[ faces[k][0] ][1]-verts[ faces[k][1] ][1])*(verts[ faces[k][3] ][2]-verts[ faces[k][1] ][2])-(verts[ faces[k][0] ][2]-verts[ faces[k][1] ][2])*(verts[ faces[k][3] ][1]-verts[ faces[k][1] ][1]);
	faces[k][6][1] = (verts[ faces[k][0] ][2]-verts[ faces[k][1] ][2])*(verts[ faces[k][3] ][0]-verts[ faces[k][1] ][0])-(verts[ faces[k][0] ][0]-verts[ faces[k][1] ][0])*(verts[ faces[k][3] ][2]-verts[ faces[k][1] ][2]);
	faces[k][6][2] = (verts[ faces[k][0] ][0]-verts[ faces[k][1] ][0])*(verts[ faces[k][3] ][1]-verts[ faces[k][1] ][1])-(verts[ faces[k][0] ][1]-verts[ faces[k][1] ][1])*(verts[ faces[k][3] ][0]-verts[ faces[k][1] ][0]);//calculate normal z to determine which direction its facing
	//faces[k][5] = cr.RGB(100+(k/5)*100,100+(k/5)*100,100+(k/5)*100);
	
	//faces[k][4][0] = (verts[ faces[k][0] ][0]+verts[ faces[k][1] ][0]+verts[ faces[k][2] ][0]+verts[ faces[k][3] ][0])/4;
	//faces[k][4][1] = (verts[ faces[k][0] ][1]+verts[ faces[k][1] ][1]+verts[ faces[k][2] ][1]+verts[ faces[k][3] ][1])/4;
	faces[k][4][2] = (verts[ faces[k][0] ][2]+verts[ faces[k][1] ][2]+verts[ faces[k][2] ][2]+verts[ faces[k][3] ][2])/4;
	
	};
	
	faces.sort(function(a, b){ return a[4][2]-b[4][2]});
	
	if(this.properties["Collider Type"] == "AABB"){
	
	var AABB = new cr.quad;
	
	AABB.tlx = xpos-XmaxExtent;
	AABB.trx = xpos+XmaxExtent;
	AABB.blx = xpos-XmaxExtent;
	AABB.brx = xpos+XmaxExtent;
	
	AABB.tly = ypos-YmaxExtent;
	AABB.try_ = ypos-YmaxExtent;
	AABB.bly = ypos+YmaxExtent;
	AABB.bry = ypos+YmaxExtent;	
	if(this.properties["Editor Rep."] == "Shaded"||this.properties["Editor Rep."] == "Textured") renderer.Fill(AABB,cr.RGB(120,120,120));
	if(this.properties["Editor Rep."] == "Textured"){
			renderer.SetTexture(texture);
			renderer.Quad(AABB, 0.5);
	}
	renderer.Outline(AABB,cr.RGB(0,0,0));
	
	};
	
	if( this.properties["Editor Rep."] == "LayoutIcon"){
	renderer.SetTexture(texture);
	renderer.Quad(this.instance.GetBoundingQuad(), 1);
	}
	
	var fq = new cr.quad;
	var light = [1,1,1];
	ztemp = 1/Math.sqrt(light[0]*light[0]+light[1]*light[1]+light[2]*light[2]);
	light = [light[0]*ztemp,light[1]*ztemp,light[2]*ztemp];
	
	for (var k = 0; k < faces.length ; k++) {
	
	if(faces[k][6][2]<0){
	
	fq.tlx = verts[faces[k][0]][0]
	fq.tly = verts[faces[k][0]][1]
	
	fq.trx = verts[faces[k][1]][0]
	fq.try_ = verts[faces[k][1]][1]
	
	fq.brx = verts[faces[k][2]][0]
	fq.bry = verts[faces[k][2]][1]
		
	fq.blx = verts[faces[k][3]][0]
	fq.bly = verts[faces[k][3]][1]
	
	if(this.properties["Editor Rep."] == "Shaded"||this.properties["Editor Rep."] == "Textured"){
	ztemp = 1/Math.sqrt(faces[k][6][0]*faces[k][6][0]+faces[k][6][1]*faces[k][6][1]+faces[k][6][2]*faces[k][6][2]);
	
	faces[k][6] = [faces[k][6][0]*ztemp,faces[k][6][1]*ztemp,faces[k][6][2]*ztemp];
	
	faces[k][5] = 	Math.pow(Math.max(((faces[k][6][0]*light[0]+faces[k][6][1]*light[1]+faces[k][6][2]*light[2])-1)/-2),4)*190+40
	
	renderer.Fill(fq,cr.RGB(faces[k][5],faces[k][5],faces[k][5]));
	if( this.properties["Editor Rep."] == "Textured"){
		renderer.SetTexture(texture);
		renderer.Quad(fq,0.5);
	}
	}
	else renderer.Outline(fq,cr.RGB(0,0,0));
	
	};
	
	};
	
	
	/*if(this.properties["Collider Type"] == "Box"){
		
		//first face
		
		renderer.Line(new cr.vector2(verts[0][0],verts[0][1]), new cr.vector2(verts[1][0],verts[1][1]), cr.RGB(0,0,0));
		renderer.Line(new cr.vector2(verts[2][0],verts[2][1]), new cr.vector2(verts[1][0],verts[1][1]), cr.RGB(0,0,0));
		renderer.Line(new cr.vector2(verts[2][0],verts[2][1]), new cr.vector2(verts[3][0],verts[3][1]), cr.RGB(0,0,0));
		renderer.Line(new cr.vector2(verts[0][0],verts[0][1]), new cr.vector2(verts[3][0],verts[3][1]), cr.RGB(0,0,0));
		
		//second face
		
		renderer.Line(new cr.vector2(verts[4][0],verts[4][1]), new cr.vector2(verts[5][0],verts[5][1]), cr.RGB(0,0,0));
		renderer.Line(new cr.vector2(verts[6][0],verts[6][1]), new cr.vector2(verts[5][0],verts[5][1]), cr.RGB(0,0,0));
		renderer.Line(new cr.vector2(verts[6][0],verts[6][1]), new cr.vector2(verts[7][0],verts[7][1]), cr.RGB(0,0,0));
		renderer.Line(new cr.vector2(verts[4][0],verts[4][1]), new cr.vector2(verts[7][0],verts[7][1]), cr.RGB(0,0,0));
		
		//side edges
		
		renderer.Line(new cr.vector2(verts[4][0],verts[4][1]), new cr.vector2(verts[0][0],verts[0][1]), cr.RGB(0,0,0));
		renderer.Line(new cr.vector2(verts[5][0],verts[5][1]), new cr.vector2(verts[1][0],verts[1][1]), cr.RGB(0,0,0));
		renderer.Line(new cr.vector2(verts[6][0],verts[6][1]), new cr.vector2(verts[2][0],verts[2][1]), cr.RGB(0,0,0));
		renderer.Line(new cr.vector2(verts[7][0],verts[7][1]), new cr.vector2(verts[3][0],verts[3][1]), cr.RGB(0,0,0));
		
	};*/
	
	if(this.properties["Collider Type"] == "Sphere"){
		
		/*xtemp = xpos+mtx[2][0]*-(zsize/2)
		ytemp = ypos+mtx[2][1]*-(zsize/2)
		
		for (var k = 1; k < 6 ; k++) {
		
			xtemp += (mtx[2][0]/6)*zsize
			ytemp += (mtx[2][1]/6)*zsize
			ztemp = Math.cos((-0.5+(k/6))*Math.PI)
		
			for (var i = 0; i <= 20 ; i++) {
			
			rcos = Math.cos(i*(Math.PI/10))
			rsin = Math.sin(i*(Math.PI/10))
			
			xsto.x = rcos*ztemp*q.x/2
			xsto.y = rsin*ztemp*q.y/2
			
			xsto = new cr.vector2(xsto.x*mtx[0][0]+xsto.y*mtx[1][0],xsto.x*mtx[0][1]+xsto.y*mtx[1][1]);
			
			if(i >0) renderer.Line(new cr.vector2(xtemp+xsto.x,ytemp+xsto.y), new cr.vector2(xtemp+ysto.x,ytemp+ysto.y), cr.RGB(0,0,0));
			
			ysto = new cr.vector2(xsto.x,xsto.y);
				
			};
		
		};
		
		xtemp = xpos+mtx[0][0]*-(q.x/2)
		ytemp = ypos+mtx[0][1]*-(q.x/2)
		
		for (var k = 1; k < 6 ; k++) {
		
			xtemp += (mtx[0][0]/6)*q.x
			ytemp += (mtx[0][1]/6)*q.x
			ztemp = Math.cos((-0.5+(k/6))*Math.PI)
		
			for (var i = 0; i <= 20 ; i++) {
			
			rcos = Math.cos(i*(Math.PI/10))
			rsin = Math.sin(i*(Math.PI/10))
			
			xsto.x = rcos*ztemp*zsize/2
			xsto.y = rsin*ztemp*q.y/2
			
			xsto = new cr.vector2(xsto.x*mtx[2][0]+xsto.y*mtx[1][0],xsto.x*mtx[2][1]+xsto.y*mtx[1][1]);
			
			if(i >0) renderer.Line(new cr.vector2(xtemp+xsto.x,ytemp+xsto.y), new cr.vector2(xtemp+ysto.x,ytemp+ysto.y), cr.RGB(0,0,0));
			
			ysto = new cr.vector2(xsto.x,xsto.y);
				
			};
		
		};*/
		
		for (var i = 0; i <= 20 ; i++) {
			
			rcos = Math.cos(i*(Math.PI/10))
			rsin = Math.sin(i*(Math.PI/10))
			
			xsto.x = rcos*maxExtent/2
			xsto.y = rsin*maxExtent/2
			
			xsto = new cr.vector2(xsto.x*mtx[0][0]+xsto.y*mtx[1][0],xsto.x*mtx[0][1]+xsto.y*mtx[1][1]);
			xtemp = rcos*mtx[0][2]+ rsin*mtx[1][2]
			ztemp = (xtemp+ytemp)
			
			if(i >0 && ztemp <= 0) renderer.Line(new cr.vector2(xpos+xsto.x,ypos+xsto.y), new cr.vector2(xpos+ysto.x,ypos+ysto.y), outlineCol);
			
			ysto = new cr.vector2(xsto.x,xsto.y);
			ytemp = xtemp;
				
			};
			
		for (var i = 0; i <= 20 ; i++) {
			
			rcos = Math.cos(i*(Math.PI/10))
			rsin = Math.sin(i*(Math.PI/10))
			
			xsto.x = rcos*maxExtent/2
			xsto.y = rsin*maxExtent/2
			
			xsto = new cr.vector2(xsto.x*mtx[2][0]+xsto.y*mtx[1][0],xsto.x*mtx[2][1]+xsto.y*mtx[1][1]);
			xtemp = rcos*mtx[2][2]+ rsin*mtx[1][2]
			ztemp = (xtemp+ytemp)
			
			if(i >0 && ztemp <= 0) renderer.Line(new cr.vector2(xpos+xsto.x,ypos+xsto.y), new cr.vector2(xpos+ysto.x,ypos+ysto.y), outlineCol);
			
			ysto = new cr.vector2(xsto.x,xsto.y);
			ytemp = xtemp;
				
			};
			
		for (var i = 0; i <= 20 ; i++) {
			
			rcos = Math.cos(i*(Math.PI/10))
			rsin = Math.sin(i*(Math.PI/10))
			
			xsto.x = rcos*maxExtent/2
			xsto.y = rsin*maxExtent/2
			
			xsto = new cr.vector2(xsto.x*mtx[2][0]+xsto.y*mtx[0][0],xsto.x*mtx[2][1]+xsto.y*mtx[0][1]);
			xtemp = rcos*mtx[2][2]+ rsin*mtx[0][2]
			ztemp = (xtemp+ytemp)
			
			if(i >0 && ztemp <= 0) renderer.Line(new cr.vector2(xpos+xsto.x,ypos+xsto.y), new cr.vector2(xpos+ysto.x,ypos+ysto.y), outlineCol);
			
			ysto = new cr.vector2(xsto.x,xsto.y);
			ytemp = xtemp;
				
			};
		
		// draw main ring
		if(this.properties["Editor Rep."] == "Wire" || this.properties["Editor Rep."] == "LayoutIcon"){
		for (var i = 0; i <= 20 ; i++) {
			
			rcos = Math.cos(i*(Math.PI/10))
			rsin = Math.sin(i*(Math.PI/10))
			
			xsto.x = rcos*maxExtent/2
			xsto.y = rsin*maxExtent/2
			
			//xsto = new cr.vector2(xsto.x*mtx[2][0]+xsto.y*mtx[0][0],xsto.x*mtx[2][1]+xsto.y*mtx[0][1]);
			//xtemp = rcos*mtx[2][2]+ rsin*mtx[0][2]
			//ztemp = (xtemp+ytemp)
			
			if(i >0) renderer.Line(new cr.vector2(xpos+xsto.x,ypos+xsto.y), new cr.vector2(xpos+ysto.x,ypos+ysto.y), cr.RGB(0,0,0));
			
			ysto = new cr.vector2(xsto.x,xsto.y);
			ytemp = xtemp;
				
			};
			
	};
	
	};
	
	/*if(this.properties["Collider Type"] == "AABB"){
	
	var AABB = new cr.quad;
	
	AABB.tlx = xpos-XmaxExtent;
	AABB.trx = xpos+XmaxExtent;
	AABB.blx = xpos-XmaxExtent;
	AABB.brx = xpos+XmaxExtent;
	
	AABB.tly = ypos-YmaxExtent;
	AABB.try_ = ypos-YmaxExtent;
	AABB.bly = ypos+YmaxExtent;
	AABB.bry = ypos+YmaxExtent;	
	
	renderer.Outline(AABB,cr.RGB(0,0,0));
	
	};*/
	
	//triad
	
	mtx[0][3] = cr.RGB(255,0,0);
	mtx[1][3] = cr.RGB(0,205,0);
	mtx[2][3] = cr.RGB(0,0,255);
	
	// sort by z value so lower arms show below higher ones (or else confusing)
	var fq = new cr.quad; 
	
	mtx.sort(function(a, b){ return b[2]-a[2]});
	for (var i = 0; i <= 2 ; i++) {
	renderer.Line(new cr.vector2(xpos,ypos), new cr.vector2(xpos+(mtx[i][0])*50,ypos+(mtx[i][1])*50), mtx[i][3]);
	
	var scale = ((mtx[i][2]*-1+3)/3)*5
	
	fq.tlx = xpos+mtx[i][0]*50 -scale;
	fq.tly = ypos+mtx[i][1]*50 -scale;
	
	fq.trx = xpos+mtx[i][0]*50 +scale;
	fq.try_ = ypos+mtx[i][1]*50 -scale;
	
	fq.brx = xpos+mtx[i][0]*50 +scale;
	fq.bry = ypos+mtx[i][1]*50 +scale;
	
	fq.blx = xpos+mtx[i][0]*50 -scale;
	fq.bly = ypos+mtx[i][1]*50 +scale;
	
	renderer.Fill(fq,mtx[i][3]);
	};		

}

IDEInstance.prototype.OnDoubleClicked = function()
{
	this.instance.EditTexture();
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.texture_loaded = false;
	renderer.ReleaseTexture(this.last_texture);
}

IDEInstance.prototype.OnTextureEdited = function ()
{
	if(this.properties["Editor Rep."] == "Textured"){
		var texture = this.instance.GetTexture(0,"DiffuseMap");
	}else if(this.properties["Editor Rep."] == "LayoutIcon"){
		var texture = this.instance.GetTexture(0,"LayoutIcon");
	}
	//this.instance.SetHotspot(texture.GetHotspot());
	
	if(this.properties["Editor Rep."] == "Textured" || this.properties["Editor Rep."] == "LayoutIcon"){
		var imgsize = texture.GetImageSize();

		
		// If sprite texture has been edited and changed size, scale the texture accordingly.
		if ((imgsize.x !== this.last_imgsize.x || imgsize.y !== this.last_imgsize.y)
			&& (this.last_imgsize.x !== 0 && this.last_imgsize.y !== 0))
		{
			var sz = new cr.vector2(imgsize.x / this.last_imgsize.x, imgsize.y / this.last_imgsize.y);
			var instsize = this.instance.GetSize();
			
			//sz.mul(instsize.x, instsize.y);
			//this.instance.SetSize(sz);
			
			this.last_imgsize = imgsize;
		}
	};
}