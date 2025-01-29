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
	var id = 1600;
	AddCondition(id, cf_trigger, "On loaded", "Babylon Sound", "Is sound fully loaded", "Is sound fully loaded", "IsSoundLoaded");
	id++;
	AddCondition(id, cf_trigger, "On ended", "Babylon Sound", "Is sound ended", "Is sound fully loaded", "IsSoundEnded");
	id++;
	AddCondition(id, cf_none, "Is playing", "Babylon Sound", "Is sound ended", "Is sound fully loaded", "IsSoundPlaying");
	id++;
	//////////////////////////////////////////
	//////////////////////////////////////////
	//////////////A C T I O N S///////////////
	//////////////////////////////////////////
	//////////////////////////////////////////
	var id = 1700;
	AddObjectParam("Mesh", "The mesh to be detached to");
	AddAction(id, af_none, "Attach to mesh", "Babylon Sound", "Attach to mesh {0}.", "Attach to mesh", "AttachToMesh");
	id++;
	AddAction(id, af_none, "Dettach to mesh", "Babylon Sound", "Dettach to mesh {0}.", "Dettach to mesh", "DetachMesh");
	id++;
	AddAction(id, af_none, "Play", "Babylon Sound", "Play sound.", "Play sound", "Play");
	id++;
	AddAction(id, af_none, "Stop", "Babylon Sound", "Stop sound.", "Stop sound", "Stop");
	id++;
	AddAction(id, af_none, "Pause", "Babylon Sound", "Pause sound.", "Pause sound", "Pause");
	id++;
	AddAction(id, af_none, "Destroy", "Babylon Sound", "Dispose sound.", "Dispose sound", "Destroy");
	id++;
	AddNumberParam("Volume", "", initial_string = "1");
	AddAction(id, af_none, "Set volume", "Babylon Sound", "Set sound volume to <b>{0}</b>.", "Set sound volume", "SetVolume");
	id++;
	AddNumberParam("X", "", initial_string = "0");
	AddNumberParam("Y", "", initial_string = "0");
	AddNumberParam("Z", "", initial_string = "0");
	AddAction(id, af_none, "Set position", "Babylon Sound", "Set sound position to <b>{0},{1},{2}</b>.", "Set sound position", "SetPosition");
	id++;
	AddNumberParam("Rate", "", initial_string = "1");
	AddAction(id, af_none, "Set playback rate", "Babylon Sound", "Set sound playback rate to <b>{0}</b>.", "Set sound playback rate", "SetPlaybackRate");
	id++;
	AddNumberParam("X axis", "", initial_string = "1");
	AddNumberParam("Y axis", "", initial_string = "0");
	AddNumberParam("Z axis", "", initial_string = "0");
	AddAction(id, af_none, "Set local direction", "Babylon Sound", "Set sound local direction to <b>{0},{1},{2}</b>.", "Set sound local direction", "SetLocalDir");
	id++;
	AddNumberParam("X angle in degrees", "", initial_string = "90");
	AddNumberParam("Y angle in degrees", "", initial_string = "180");
	AddNumberParam("Z angle in degrees", "", initial_string = "0");
	AddAction(id, af_none, "Set directionnal cone", "Babylon Sound", "Set sound directionnal cone to <b>{0},{1},{2}</b>.", "Set sound directionnal cone", "SetDirCone");
	id++;
	//////////////////////////////////////////
	//////////////////////////////////////////
	/////////E X P R E S S I O N S////////////
	//////////////////////////////////////////
	//////////////////////////////////////////
	var id = 1800;
}

function getMethods(obj) {
	var methods = [];
	for (var m in obj) {
		if (obj.hasOwnProperty(m)) {
			methods.push(m);
		}
	}
	return (methods.join(","));
}

function getFunctions(obj) {
	var funcs = [];
	for (var m in obj) {
		if (typeof obj[m] == "function") {
			funcs.push(m);
		}
	}
	return (funcs.join(","));
}
