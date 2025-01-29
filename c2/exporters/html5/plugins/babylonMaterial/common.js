// Scripts in this file are included in both the IDE and runtime, so you only
// need to write scripts common to both once.

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
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
//AddStringParam("Message", "Enter a string to alert.");
//AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");
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
//AddExpression(0, ef_return_number, "Leet expression", "My category", "MyExpression", "Return the number 1337.");
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
//AddCondition(0, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition");

populateCommonACE = function () {
															//////////////////////////////////////////
															//////////////////////////////////////////
															/////////C O N D I T I O N S//////////////
															//////////////////////////////////////////
															//////////////////////////////////////////
	var id = 1900;													
															
															//////////////////////////////////////////
															//////////////////////////////////////////
															/////////////A C T I O N S////////////////
															//////////////////////////////////////////
															//////////////////////////////////////////
	var id = 2000;
	
	AddNumberParam("Alpha", "Alpha value.", initial_string = "0");
	AddAction(id, af_none, "Set alpha", "Babylon Alpha", "Set material alpha value to <b>({0})</b>.", "Set the material alpha.", "MatSetAlpha");
	id++;
	
	AddNumberParam("Alpha mode", "Alpha mode value.", initial_string = "0");
	AddAction(id, af_none, "Set alpha mode", "Babylon Alpha", "Set material alpha mode value to <b>({0})</b>.", "Set the material alpha mode.", "MatSetAlphaMode");
	id++;
	
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set backface culling", "Babylon General", "Set material backface culling value to <b>({0})</b>.", "Set the material backface culling.", "MatSetBackFaceCulling");
	id++;
	
	AddNumberParam("Fill mode", "Fill mode value.", initial_string = "0");
	AddAction(id, af_none, "Set fill mode", "Babylon General", "Set material fill mode to <b>({0})</b>.", "Set the material fill mode.", "MatSetFillMode");
	id++;
	
	AddNumberParam("Side orientation", "Side orientation value.", initial_string = "0");
	AddAction(id, af_none, "Set side orientation", "Babylon General", "Set material sideorientation mode to <b>({0})</b>.", "Set the material sideorientation mode.", "MatSetSideOrient");
	id++;
	
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("Fog state", "Set state", "True");
	AddAction(id, af_none, "Set fog state", "Babylon General", "Set material fog state to <b>({0})</b>.", "Set the material fog state.", "MatSetFogState");
	id++;	
	
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("Alpha diffuse state", "Set state", "True");
	AddAction(id, af_none, "Set diffuse alpha state", "Babylon States", "Set material alpha from diffuse state to <b>({0})</b>.", "Set the material alpha from diffuse.", "MatSetAlphaFromDif");
	id++;
	
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("Lightning state", "Set state", "True");
	AddAction(id, af_none, "Set lightning state", "Babylon States", "Set material light state to <b>({0})</b>.", "Set the material light state.", "MatSetLightState");
	id++;
	
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("Parallax state", "Set state", "True");
	AddAction(id, af_none, "Set parallax state", "Babylon States", "Set material light state to <b>({0})</b>.", "Set the material light state.", "MatSetParallState");
	id++;
	
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("Parallax occlusion state", "Set state", "True");
	AddAction(id, af_none, "Set parallax occlusion state", "Babylon States", "Set material light state to <b>({0})</b>.", "Set the material light state.", "MatSetOccluState");
	id++;
	
	AddNumberParam("R", "Red color.", initial_string = "255");
	AddNumberParam("G", "Green color.", initial_string = "0");
	AddNumberParam("B", "Blue color.", initial_string = "0");
	AddAction(id, af_none, "Set ambient color", "Babylon Colors", "Set material ambient color to <b>({0},{1},{2})</b>.", "Set the material ambient color.", "MatSetAmbColor");
	id++;	
	
	AddNumberParam("R", "Red color.", initial_string = "255");
	AddNumberParam("G", "Green color.", initial_string = "0");
	AddNumberParam("B", "Blue color.", initial_string = "0");
	AddAction(id, af_none, "Set specular color", "Babylon Colors", "Set material specular color to <b>({0},{1},{2})</b>.", "Set the material specular color.", "MatSetSpecuColor");
	id++;
	
	AddNumberParam("R", "Red color.", initial_string = "255");
	AddNumberParam("G", "Green color.", initial_string = "0");
	AddNumberParam("B", "Blue color.", initial_string = "0");
	AddAction(id, af_none, "Set diffuse color", "Babylon Colors", "Set material diffuse color to <b>({0},{1},{2})</b>.", "Set the material diffuse color.", "MatSetDifColor");
	id++;
	
	AddNumberParam("R", "Red color.", initial_string = "255");
	AddNumberParam("G", "Green color.", initial_string = "0");
	AddNumberParam("B", "Blue color.", initial_string = "0");
	AddAction(id, af_none, "Set emissive color", "Babylon Colors", "Set material emissive color to <b>({0},{1},{2})</b>.", "Set the material emissive color.", "MatSetEmiColor");
	id++;
	
	AddStringParam("Filename", "The ambient texture filename", initial_string = "\"ambie.png\"");
	AddAction(id, af_none, "Set ambient texture", "Babylon Textures", "Set material ambient texture to <b>({0})</b>.", "Set the material ambient texture.", "MatSetAmbTexture");
	id++;
	
	AddStringParam("Filename", "The bump texture filename", initial_string = "\"bump.png\"");
	AddAction(id, af_none, "Set bump texture", "Babylon Textures", "Set material bump texture to <b>({0})</b>.", "Set the material bump texture.", "MatSetBumpTexture");
	id++;
	
	AddStringParam("Filename", "The diffuse texture filename", initial_string = "\"diffuse.png\"");
	AddAction(id, af_none, "Set diffuse texture", "Babylon Textures", "Set material diffuse texture to <b>({0})</b>.", "Set the material diffuse texture.", "MatSetDifTexture");
	id++;
	
	AddStringParam("Filename", "The emissive texture filename", initial_string = "\"emissive.png\"");
	AddAction(id, af_none, "Set emissive texture", "Babylon Textures", "Set material emissive texture to <b>({0})</b>.", "Set the material emissive texture.", "MatSetEmiTexture");
	id++;
	
	AddStringParam("Filename", "The lightmap texture filename", initial_string = "\"lightmap.png\"");
	AddAction(id, af_none, "Set lightmap texture", "Babylon Textures", "Set material lightmap texture to <b>({0})</b>.", "Set the material lightmap texture.", "MatSetLightmapTexture");
	id++;
	
	AddComboParamOption("Image");
	AddComboParamOption("Realtime");
	AddComboParam("Realtime or image", "Realtime reflection or image reflection", "Image");
	AddStringParam("[Image] prefix", "The reflection texture filename without extension", initial_string = "\"skybox\"");
	AddStringParam("[Realtime] plane", "The reflection plane (a,b,c,d).", initial_string = "\"0,-1,0,-10\"");
	AddObjectParam("[Realtime] render list", "The meshes that should be reflected.");
	AddNumberParam("[Realtime-Image] level", "Reflection level.", initial_string = "0.5");
	AddAction(id, af_none, "Set reflection texture", "Babylon Textures", "Set material reflection type to <b>({0})</b>.", "Set the material reflection texture.", "MatSetRefleTexture");
	id++;
	
	AddStringParam("Filename", "The refraction texture prefix", initial_string = "\"skybox\"");
	AddAction(id, af_none, "Set refraction texture", "Babylon Textures", "Set material refraction texture box to <b>({0})</b>.", "Set the material refraction texture.", "MatSetRefraTexture");
	id++;
	
	AddNumberParam("Specular", "Specular value.", initial_string = "0.4");
	AddAction(id, af_none, "Set specular power", "Babylon Powers", "Set material specular power to <b>({0})</b>.", "Set the material specular power.", "MatSetSpecuPower");
	id++;
	
	AddNumberParam("Scale bias", "Scale bias value.", initial_string = "0.4");
	AddAction(id, af_none, "Set parallax scale", "Babylon Powers", "Set material parallax scale to <b>({0})</b>.", "Set the material parallax scale.", "MatSetParallScale");
	id++;
	
	AddNumberParam("Roughness", "Roughness value.", initial_string = "0.4");
	AddAction(id, af_none, "Set roughness", "Babylon Powers", "Set material roughness to <b>({0})</b>.", "Set the material roughness.", "MatSetRoughness");
	id++;
	AddAction(id, af_none, "Create standard material", "Babylon New Material", "Create a standard material.", "Create standard material.", "MatCreateStandard");
	id++;
	AddAction(id, af_none, "Create PBR material", "Babylon New Material", "Create a physically based rendering material.", "Create PBR material.", "MatCreatePBR");
	id++;
	
	AddNumberParam("R", "Red value.", initial_string = "255");
	AddNumberParam("G", "Green value.", initial_string = "0");
	AddNumberParam("B", "Blue value.", initial_string = "0");
	AddAction(id, af_none, "Set albedo color", "Babylon PBR", "Set PBR material albedo color to <b>({0},{1},{2})</b>.", "Set the PBR material albedo color.", "MatSetAlbColor");
	id++;	
	
	AddNumberParam("R", "Red value.", initial_string = "255");
	AddNumberParam("G", "Green value.", initial_string = "0");
	AddNumberParam("B", "Blue value.", initial_string = "0");
	AddAction(id, af_none, "Set reflectivity color", "Babylon PBR", "Set PBR material reflectivity color to <b>({0},{1},{2})</b>.", "Set the PBR material reflectivity color.", "MatSetRefityColor");
	id++;
	
	AddStringParam("Filename", "The texture filename", initial_string = "\"textur.png\"");
	AddNumberParam("U scale", "U scale.", initial_string = "3");
	AddNumberParam("V scale", "V scale.", initial_string = "3");
	AddAction(id, af_none, "Set albedo texture", "Babylon PBR", "Set PBR material albedo texture to <b>({0})</b> with UVscale <b>({1},{2})</b>.", "Set the PBR material albedo texture.", "MatSetAlbTexture");
	id++;
	
	AddNumberParam("Microsurface", "Microsurface value.", initial_string = "0.4");
	AddAction(id, af_none, "Set micro surface", "Babylon PBR", "Set PBR material micro surface to <b>({0})</b>.", "Set the material micro surface.", "MatSetMicroSur");
	id++;	
	
	AddNumberParam("Direct intensity", "Direct intensity value.", initial_string = "0.4");
	AddAction(id, af_none, "Set direct intensity", "Babylon PBR", "Set PBR material direct intensity to <b>({0})</b>.", "Set the material direct intensity.", "MatSetDirecIntens");
	id++;
	
	AddNumberParam("Env intensity", "Env intensity value.", initial_string = "0.4");
	AddAction(id, af_none, "Set environnement intensity", "Babylon PBR", "Set PBR material environnement  intensity to <b>({0})</b>.", "Set the material environnement  intensity.", "MatSetEnvIntens");
	id++;
	
	AddNumberParam("Camera exposure", "Camera exposure value.", initial_string = "0.6");
	AddAction(id, af_none, "Set camera exposure", "Babylon PBR", "Set material camera exposure to <b>({0})</b>.", "Set the material camera exposure.", "MatSetCamExpo");
	id++;
	
	AddNumberParam("Camera contrast", "Camera contrast value.", initial_string = "0.6");
	AddAction(id, af_none, "Set camera contrast", "Babylon PBR", "Set material camera contrast to <b>({0})</b>.", "Set the material camera contrast.", "MatSetCamContr");
	id++;
	
	AddStringParam("Mesh name", "The mesh name as in your 3D editor", initial_string = "\"Box001\"");	
	AddAction(id, af_none, "Set mesh material", "Babylon General", "Assign this material to mesh <b>{0}</b>.", "Set mesh material.", "MatSetMesh");
	id++;	
	
	AddComboParamOption("Diffuse");
	AddComboParamOption("Bump");
	AddComboParam("Texture type", "", "Diffuse");
	AddNumberParam("U scale", "U scale.", initial_string = "0.6");
	AddNumberParam("V scale", "V scale.", initial_string = "0.6");
	AddAction(id, af_none, "Set material texture UV scale", "Babylon Powers", "Set material texture <b>({0})</b> uv scale to <b>({1},{2})</b>.", "Set material texture uv scale.", "MatSetUV");
	id++;
	AddComboParamOption('Disabled');
	AddComboParamOption('Enabled');
	AddComboParam('State', 'Set state', 'Disabled');
	AddAction(id, af_none, "Use emissive as illumination", "Babylon PBR", "Set the use of emissive map as illumination to <b>({0})</b>.", "Use emissive map as illumination.", "MatUseEmAsIll");
	id++;

	AddComboParamOption('Disabled');
	AddComboParamOption('Enabled');
	AddComboParam('State', 'Set state', 'Disabled');
	AddAction(id, af_none, "Invert normal map X", "Babylon General", "Set normalmap X inversion to <b>({0})</b>.", "", "MatInvertNMX");
	id++;
	AddComboParamOption('Disabled');
	AddComboParamOption('Enabled');
	AddComboParam('State', 'Set state', 'Disabled');
	AddAction(id, af_none, "Invert normal map Y", "Babylon General", "Set normalmap Y inversion to <b>({0})</b>.", "", "MatInvertNMY");
	id++;

	AddStringParam("Filename", "The metallic texture filename", initial_string = "\"metal.png\"");
	AddAction(id, af_none, "Set metallic texture", "Babylon PBR", "Set material metallic texture to <b>({0})</b>.", "Set the material metallic texture.", "MatSetMetallicTexture");
	id++;

	AddComboParamOption('Disabled');
	AddComboParamOption('Enabled');
	AddComboParam('State', 'Set state', 'Disabled');
	AddAction(id, af_none, "Set roughness from metallic alpha", "Babylon PBR", "Set roughness from metallic alpha to <b>({0})</b>.", "", "MatMetalAlphaRough");
	id++;

	AddComboParamOption('Disabled');
	AddComboParamOption('Enabled');
	AddComboParam('State', 'Set state', 'Disabled');
	AddAction(id, af_none, "Set roughness from metallic green", "Babylon PBR", "Set roughness from metallic green to <b>({0})</b>.", "", "MatMetalAGreenRough");
	id++;


	
															//////////////////////////////////////////
															//////////////////////////////////////////
															/////////E X P R E S S I O N S////////////
															//////////////////////////////////////////
															//////////////////////////////////////////	
	var id = 2100;	
	AddExpression(id, ef_return_string, "Material Name", "Babylon General", "Name", "Returns the material name");
	
	id++;
	AddExpression(id, ef_return_number, "Material Scene UID", "Babylon General", "SceneUID", "Returns the material scene UID");
										
}

function getMethods(obj)
{
	var methods = [];
	for (var m in obj) {        
		if (obj.hasOwnProperty(m)) {
			methods.push(m);
		}
	}
	return (methods.join(","));
}

function getFunctions(obj)
{
	var funcs = [];
	for (var m in obj) {        
		if (typeof obj[m] == "function") {
			funcs.push(m);
		}
	}
	return (funcs.join(","));
}