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
														//////////C O N D I T I O N S/////////////
														//////////////////////////////////////////
														//////////////////////////////////////////
	var id = 3400;

														//////////////////////////////////////////
														//////////////////////////////////////////
														//////////////A C T I O N S///////////////
														//////////////////////////////////////////
														//////////////////////////////////////////
	var id = 3500;	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddStringParam("Filename", "The texture filename", initial_string = "\"flare.png\"");
	AddAction(id, af_none, "Set texture", "Babylon Particle", "Set particle system particles texture to <b>({1})</b>.", "Set particles texture", "ParticleSetTex");	
	id++;		
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("X", "", initial_string = "-1");
	AddNumberParam("Y", "", initial_string = "0");
	AddNumberParam("Z", "", initial_string = "0");
	AddAction(id, af_none, "Set start offset", "Babylon Particle", "Set particle system starting offset to <b>({1},{2},{3})</b>.", "Set particles starting offset", "ParticleSetStartOffs");	
	id++;		
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("X", "", initial_string = "1");
	AddNumberParam("Y", "", initial_string = "0");
	AddNumberParam("Z", "", initial_string = "0");
	AddAction(id, af_none, "Set ending offset", "Babylon Particle", "Set particle system endinging offset to <b>({1},{2},{3})</b>.", "Set particles endinging offset", "ParticleSetEndOffs");	
	id++;		
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("R", "", initial_string = "255");
	AddNumberParam("G", "", initial_string = "0");
	AddNumberParam("B", "", initial_string = "0");
	AddAction(id, af_none, "Set start color", "Babylon Particle", "Set particle system start color to <b>({1},{2},{3})</b>.", "Set particles start color", "ParticleSetStartColor");	
	id++;		
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("R", "", initial_string = "0");
	AddNumberParam("G", "", initial_string = "255");
	AddNumberParam("B", "", initial_string = "0");
	AddAction(id, af_none, "Set mid color", "Babylon Particle", "Set particle system mid color to <b>({1},{2},{3})</b>.", "Set particles mid color", "ParticleSetMidColor");	
	id++;	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("R", "", initial_string = "0");
	AddNumberParam("G", "", initial_string = "0");
	AddNumberParam("B", "", initial_string = "255");
	AddAction(id, af_none, "Set end color", "Babylon Particle", "Set particle system end color to <b>({1},{2},{3})</b>.", "Set particles end color", "ParticleSetEndColor");	
	id++;		
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("Min lifetime in seconds", "", initial_string = "0.3");
	AddAction(id, af_none, "Set minimum lifetime", "Babylon Particle", "Set particle system minimum lifetime to <b>({1})</b>.", "Set particles min lifetime", "ParticleSetMinLife");	
	id++;	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("Max lifetime in seconds", "", initial_string = "1.5");
	AddAction(id, af_none, "Set maximum lifetime", "Babylon Particle", "Set particle system maximum lifetime to <b>({1})</b>.", "Set particles max lifetime", "ParticleSetMaxLife");	
	id++;		
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("Min size", "", initial_string = "0.1");
	AddAction(id, af_none, "Set minimum size", "Babylon Particle", "Set particle system minimum size to <b>({1})</b>.", "Set particles min size", "ParticleSetMinSize");	
	id++;	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("Max size", "", initial_string = "0.5");
	AddAction(id, af_none, "Set maximum size", "Babylon Particle", "Set particle system maximum size to <b>({1})</b>.", "Set particles max size", "ParticleSetMaxSize");	
	id++;		
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("Emit rate", "", initial_string = "1500");
	AddAction(id, af_none, "Set emit rate", "Babylon Particle", "Set particle system emit rate to <b>({1})</b>.", "Set particles emit rate", "ParticleSetEmitRate");	
	id++;	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("X", "", initial_string = "-7");
	AddNumberParam("Y", "", initial_string = "8");
	AddNumberParam("Z", "", initial_string = "3");
	AddAction(id, af_none, "Set direction A", "Babylon Particle", "Set particle system direction to <b>({1},{2},{3})</b>.", "Set particles direction A", "ParticleSetDirectA");	
	id++;	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("X", "", initial_string = "7");
	AddNumberParam("Y", "", initial_string = "8");
	AddNumberParam("Z", "", initial_string = "-3");
	AddAction(id, af_none, "Set direction B", "Babylon Particle", "Set particle system direction to <b>({1},{2},{3})</b>.", "Set particles direction B", "ParticleSetDirectB");	
	id++;
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("Min angular speed in degrees", "", initial_string = "0");
	AddAction(id, af_none, "Set min angular speed", "Babylon Particle", "Set particle system min angular speed to <b>({1})</b>.", "Set particles min angular speed", "ParticleSetMinAngSpeed");	
	id++;	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("Max angular speed in degrees", "", initial_string = "0");
	AddAction(id, af_none, "Set max angular speed", "Babylon Particle", "Set particle system max angular speed to <b>({1})</b>.", "Set particles max angular speed", "ParticleSetMaxAngSpeed");	
	id++;		
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("Min power", "", initial_string = "1");
	AddAction(id, af_none, "Set min power", "Babylon Particle", "Set particle system min power to <b>({1})</b>.", "Set particles min power", "ParticleSetMinPower");	
	id++;	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("Max power", "", initial_string = "3");
	AddAction(id, af_none, "Set max power", "Babylon Particle", "Set particle system max power to <b>({1})</b>.", "Set particles max power", "ParticleSetMaxPower");	
	id++;		
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("Update speed", "", initial_string = "0.005");
	AddAction(id, af_none, "Set update speed", "Babylon Particle", "Set particle system update speed to <b>({1})</b>.", "Set particles update speed", "ParticleSetUpdateSpeed");	
	id++;	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddAction(id, af_none, "Start", "Babylon Particle", "Start particle system.", "Start particle system", "ParticleStart");	
	id++;		
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddAction(id, af_none, "Stop", "Babylon Particle", "Stop particle system.", "Stop particle system", "ParticleStop");	
	id++;	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("X", "", initial_string = "0");
	AddNumberParam("Y", "", initial_string = "-9.81");
	AddNumberParam("Z", "", initial_string = "0");
	AddAction(id, af_none, "Set gravity", "Babylon Particle", "Set particle system gravity to <b>({1},{2},{3})</b>.", "Set particles gravity", "ParticleSetGravity");	
	id++;
														//////////////////////////////////////////
														//////////////////////////////////////////
														/////////E X P R E S S I O N S////////////
														//////////////////////////////////////////
														//////////////////////////////////////////													
	var id = 3600;
											
}

