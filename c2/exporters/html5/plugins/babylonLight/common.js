// Scripts in this file are included in both the IDE and runtime, so you only
// need to write scripts common to both once.

// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddStringParam(label, description)									// a button to click and pick an object type
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
	var id = 3100;		

															//////////////////////////////////////////
															//////////////////////////////////////////
															/////////////A C T I O N S////////////////
															//////////////////////////////////////////
															//////////////////////////////////////////
	var id = 3200;
		
	AddNumberParam("R", "Red.", initial_string = "255");
	AddNumberParam("G", "Green.", initial_string = "0");
	AddNumberParam("B", "Blue.", initial_string = "0");
	AddAction(id, af_none, "Set diffuse color", "Babylon Colors", "Set diffuse color of light to <b>({0},{1},{2})</b>.", "Set light diffuse color.", "LightSetDiff");
	id++;	
		
	AddNumberParam("Intensity", "", initial_string = "0.8");
	AddAction(id, af_none, "Set intensity", "Babylon Powers", "Set intensity of light to <b>({0})</b>.", "Set light intensity.", "LightSetIntensity");
	id++;	
		
	AddNumberParam("Mode", "", initial_string = "0");
	AddAction(id, af_none, "Set lightmap mode", "Babylon States", "Set lightmap mode of light to <b>({0})</b>.", "Set light map mode.", "LightSetLightMMode");
	id++;	
		
	AddNumberParam("Radius", "", initial_string = "20");
	AddAction(id, af_none, "Set light radius", "Babylon Powers", "Set radius of light to <b>({0})</b>.", "Set light radius.", "LightSetLightRadius");
	id++;	
		
	AddNumberParam("Range", "", initial_string = "20");
	AddAction(id, af_none, "Set light range", "Babylon Powers", "Set range of light to <b>({0})</b>.", "Set light range.", "LightSetLightRange");
	id++;		
		
	AddNumberParam("Exponent", "", initial_string = "20");
	AddAction(id, af_none, "Set light exponent", "Babylon Powers", "Set exponent of light to <b>({0})</b>.", "Set light exponent.", "LightSetLightExponent");
	id++;	
		
	AddNumberParam("Angle", "", initial_string = "20");
	AddAction(id, af_none, "Set light angle", "Babylon General", "Set angle of light to <b>({0})</b>.", "Set light angle.", "LightSetLightAngle");
	id++;	
	
	AddNumberParam("R", "", initial_string = "255");
	AddNumberParam("G", "", initial_string = "0");
	AddNumberParam("B", "", initial_string = "0");
	AddAction(id, af_none, "Set ground color", "Babylon Colors", "Set hemispheric light ground color to <b>({0},{1},{2})</b>.", "Set hemispheric light ground color.", "SetGroundColor");
	id++;	
	
	AddNumberParam("X", "X position.", initial_string = "0");
	AddNumberParam("Y", "Y position.", initial_string = "0");	
	AddNumberParam("Z", "Z position.", initial_string = "0");
	AddAction(id, af_none, "Set position", "Babylon Matrix", "Set light position to <b>({0},{1},{2})</b>.", "Set light position", "LightSetPosition");
	id++;
	
	AddNumberParam("X", "X rotation.", initial_string = "0");
	AddNumberParam("Y", "Y rotation.", initial_string = "0");	
	AddNumberParam("Z", "Z rotation.", initial_string = "0");
	AddAction(id, af_none, "Set rotation", "Babylon Matrix", "Set light rotation to <b>({0},{1},{2})</b>.", "Set light rotation", "LightSetRotation");
	id++;
	
	AddNumberParam("X", "X scaling.", initial_string = "0");
	AddNumberParam("Y", "Y scaling.", initial_string = "0");	
	AddNumberParam("Z", "Z scaling.", initial_string = "0");
	AddAction(id, af_none, "Set scaling", "Babylon Matrix", "Set light scaling to <b>({0},{1},{2})</b>.", "Set light scaling", "LightSetScaling");
	id++;
	
	AddNumberParam("X", "X position.", initial_string = "0");
	AddNumberParam("Y", "Y position.", initial_string = "0");	
	AddNumberParam("Z", "Z position.", initial_string = "0");
	AddAction(id, af_none, "Translate by", "Babylon Matrix", "Translate light by <b>({0},{1},{2})</b>.", "Translate light", "TranslateLightBy");
	id++;
	
	AddNumberParam("X", "X rotation.", initial_string = "0");
	AddNumberParam("Y", "Y rotation.", initial_string = "0");	
	AddNumberParam("Z", "Z rotation.", initial_string = "0");
	AddAction(id, af_none, "Rotate by", "Babylon Matrix", "Rotate light by <b>({0},{1},{2})</b>.", "Set light rotation", "RotateLightBy");
	id++;
	
	AddNumberParam("X", "X scaling.", initial_string = "0");
	AddNumberParam("Y", "Y scaling.", initial_string = "0");	
	AddNumberParam("Z", "Z scaling.", initial_string = "0");
	AddAction(id, af_none, "Scale by", "Babylon Matrix", "Scale light by <b>({0},{1},{2})</b>.", "Set light scaling", "ScaleLightBy");
	id++;
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Enabled", "Enable or disable", "True");
	AddAction(id, af_none, "Set animations state", "Babylon Animations", "Set animations state to <b>({0})</b>.", "Set the animationsEnabled state.", "LightSetAnimState");
	id++;
	
	
	AddStringParam("Animation name", "The entity name as in your 3D editor", initial_string = "\"anim001\"");
	AddNumberParam("Start", "Start frame.", initial_string = "0");
	AddNumberParam("End", "End frame.", initial_string = "10");
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Loop", "Enable or disable", "True");
	AddNumberParam("Speed ration", "The speed of the anim.", initial_string = "1");
	AddAction(id, af_none, "Begin animation", "Babylon Animations", "Begin animation <b>({0})</b> from frame <b>({1})</b> to <b>({2})</b>, set loop to <b>({3})</b> and speed to <b>({4})</b>.", "Begin animation.", "LightBeginAnim");
	id++;


	
	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddStringParam("The parameter", "The parameter member, ex: position.x", initial_string = "\"position.y\"");
	AddStringParam("The start", "The start frame followed by the value, ex: 0,10 ", initial_string = "\"0,10\"");
	AddStringParam("The middle", "The middle frame  followed by the value, ex: 20,30", initial_string = "\"10,20\"");
	AddStringParam("The end", "The end frame followed by the value, ex: 40,50", initial_string = "\"40,100\"");
	AddNumberParam("FPS", "The frames per second.", initial_string = "30");
	AddAction(id, af_none, "Create animation", "Babylon Animations", "Create animation named <b>({0})</b> : parameter <b>({1})</b>, Start:<b>({2})</b> Mid:<b>({3})</b> End:<b>({4})</b> FPS:<b>({5})</b>  .", "Create animation.", "LightCreateAnim");
	id++;
	
	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddAction(id, af_none, "Stop animation", "Babylon Animations", "Stops animation named <b>({0})</b>.", "Stop animation.", "LightStopAnim");
	id++;
	
	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddAction(id, af_none, "Pause animation", "Babylon Animations", "Pauses animation named <b>({0})</b>.", "Stop animation.", "LightPauseAnim");
	id++;
	
	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddAction(id, af_none, "Restart animation", "Babylon Animations", "Restarts animation named <b>({0})</b>.", "Restarts animation.", "LightRestartAnim");
	id++;

	AddComboParamOption("Mesh");
	AddComboParamOption("Light");
	AddComboParamOption("Light");
	AddComboParam("Parent Type", "Choose which type is the parent", "Mesh");
	AddObjectParam("Parent", "The parent");
	AddAction(id, af_none, "Set parent", "Babylon Parenting", "Set light parent to {1}.", "Set the light parent.", "LightSetParent");
	
	id++;
	AddNumberParam("Visiblity", "Visiblity value.", initial_string = "1");
	AddAction(id, af_none, "Set visibility", "Babylon General", "Set light visibility <b>{0}</b>.", "Set light visibility", "LightVisiblity");
	
	id++;
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set enabled state", "Babylon States", "Set light enabled state to <b>({0})</b>.", "Set light enabled", "LightSetEnabled");
	id++;
	
	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");
	AddAction(id, af_deprecated, "Rotate around local X", "Babylon Matrix", "Rotate light by <b>({0})</b> around local X axis.", "Rotate light around X local", "RotateLightXLocal");
	id++;                                                                                  
	                                                                                       
	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");                   
	AddAction(id, af_deprecated, "Rotate around local Y", "Babylon Matrix", "Rotate light by <b>({0})</b> around local Y axis.", "Rotate light around Y local", "RotateLightYLocal");
	id++;                                                                                   
	                                                                                        
	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");                    
	AddAction(id, af_deprecated, "Rotate around local Z", "Babylon Matrix", "Rotate light by <b>({0})</b> around local Z axis.", "Rotate light around Z local", "RotateLightZLocal");
	id++;                                                                                   
	                                                                                        
	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");                    
	AddAction(id, af_deprecated, "Rotate around world X", "Babylon Matrix", "Rotate light by <b>({0})</b> around world X axis.", "Rotate light around X world", "RotateLightXWorld");
	id++;                                                                                    
	                                                                                         
	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");                     
	AddAction(id, af_deprecated, "Rotate around world Y", "Babylon Matrix", "Rotate light by <b>({0})</b> around world Y axis.", "Rotate light around Y world", "RotateLightYWorld");
	id++;                                                                                    
	                                                                                         
	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");                     
	AddAction(id, af_deprecated, "Rotate around world Z", "Babylon Matrix", "Rotate light by <b>({0})</b> around world Z axis.", "Rotate light around Z world", "RotateLightZWorld");
	id++;
	
	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");
	AddAction(id, af_deprecated, "Translate on local X", "Babylon Matrix", "Translate light by <b>({0})</b> on local X axis.", "Translate light on X local", "TranslateLightXLocal");
	id++;                                                                                          
	                                                                                               
	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");                     
	AddAction(id, af_deprecated, "Translate on local Y", "Babylon Matrix", "Translate light by <b>({0})</b> on local Y axis.", "Translate light on Y local", "TranslateLightYLocal");
	id++;                                                                                         
	                                                                                              
	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");                    
	AddAction(id, af_deprecated, "Translate on local Z", "Babylon Matrix", "Translate light by <b>({0})</b> on local Z axis.", "Translate light on Z local", "TranslateLightZLocal");
	id++;                                                                                         
	                                                                                              
	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");                    
	AddAction(id, af_deprecated, "Translate around world X", "Babylon Matrix", "Translate light by <b>({0})</b> around world X axis.", "Translate light around X world", "TranslateLightXWorld");
	id++;                                                                                       
	                                                                                            
	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");                  
	AddAction(id, af_deprecated, "Translate around world Y", "Babylon Matrix", "Translate light by <b>({0})</b> around world Y axis.", "Translate light around Y world", "TranslateLightYWorld");
	id++;                                                                                          
	                                                                                               
	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");                     
	AddAction(id, af_deprecated, "Translate around world Z", "Babylon Matrix", "Translate light by <b>({0})</b> around world Z axis.", "Translate light around Z world", "TranslateLightZWorld");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "State", "True");	
	AddAction(id, af_none, "Set pickable", "Babylon General", "Set light pickable to <b>({0})</b>.", "Set light pickable", "LightSetPickable");
	id++;	
		
	AddAction(id, af_none, "Destroy", "Babylon Light", "Destroy General.", "Destroy light", "LightDestroy");
	id++;

	AddNumberParam("X", "X factor.", initial_string = "0");
	AddNumberParam("Y", "Y factor.", initial_string = "0");
	AddNumberParam("Z", "Z factor.", initial_string = "0");
	AddAction(id, af_none, "Translate locally", "Babylon Matrix", "Translate light locally by <b>{0},{1},{2}</b> .", "Translate light locally ", "LightTranslLocaly");
	id++;
	
	
	
															//////////////////////////////////////////
															//////////////////////////////////////////
															/////////E X P R E S S I O N S////////////
															//////////////////////////////////////////
															//////////////////////////////////////////	
	var id = 3300;
	
	AddExpression(id, ef_return_string, "Light Name", "Babylon General", "Name", "Returns the light name");
	
	id++;
	AddExpression(id, ef_return_number, "Light Scene UID", "Babylon General", "SceneUID", "Returns the light scene UID");
												
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