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

//	AddObjectParam("Parent mesh name", "The parent mesh name");
//	AddCondition(id, cf_none, "Is child off", "Babylon Mesh", "Is mesh child of {0}", "Is child off", "IsChildOff");
//	id++;

	
	//////////////////////////////////////////
	//////////////////////////////////////////
	//////////////A C T I O N S///////////////
	//////////////////////////////////////////
	//////////////////////////////////////////
	var id = 1700;

	AddNumberParam("Width", "", initial_string = "64");
	AddNumberParam("Height", "", initial_string = "64");
	AddAction(id, af_none, "Set cell size", "Babylon Sprite", "Set cell size to <b>{0},{1}</b>.", "Set spritesheet cell size", "SetCellSize");
	id++;
	AddAction(id, af_none, "Dispose", "Babylon Sprite", "Dispose spritesheet.", "Dispose spritesheet", "Dispose");
	id++;
	AddNumberParam("Angle", "", initial_string = "90");
	AddAction(id, af_none, "Set angle", "Babylon Sprite", "Set sprite angle to <b>{0},{1}</b>.", "Set sprite angle", "Angle");
	id++;
	
	AddNumberParam("R", "", initial_string = "255");
	AddNumberParam("G", "", initial_string = "0");
	AddNumberParam("B", "", initial_string = "0");
	AddAction(id, af_none, "Set color", "Babylon Sprite", "Set sprite color to <b>{0},{1},{2}</b>.", "Set sprite color", "SetColor");
	id++;
	AddNumberParam("Width", "", initial_string = "0");
	AddAction(id, af_none, "Set width", "Babylon Sprite", "Set sprite width to <b>{0}</b>.", "Set sprite width", "Width");
	id++;
	AddNumberParam("Height", "", initial_string = "0");
	AddAction(id, af_none, "Set height", "Babylon Sprite", "Set sprite height to <b>{0}</b>.", "Set sprite height", "Height");
	id++;
	AddNumberParam("X","X", initial_string = "0");
	AddNumberParam("Y","Y", initial_string = "0");
	AddNumberParam("Z","Z", initial_string = "0");
	AddAction(id, af_none, "Set position", "Babylon Sprite", "Set sprite position to <b>{0},{1},{2}</b>.", "Set sprite color", "SetPosition");
	id++;
	AddNumberParam("From","", initial_string = "0");
	AddNumberParam("To","", initial_string = "10");
	AddComboParamOption('Disabled');
	AddComboParamOption('Enabled');
	AddComboParam('Loop', 'Set state', 'Disabled');
	AddNumberParam("Delay","", initial_string = "100");
	AddAction(id, af_none, "Play animation", "Babylon Sprite", "Play animation from <b>{0}</b> to <b>{1}</b> set loop <b>{2}</b> and delay of <b>{3}</b>.", "Play animation", "PlayAnimation");
	id++;
	AddAction(id, af_none, "Stop animation", "Babylon Sprite", "Stop animation.", "Stop animation", "StopAnimation");
	id++;
	//////////////////////////////////////////
	//////////////////////////////////////////
	/////////E X P R E S S I O N S////////////
	//////////////////////////////////////////
	//////////////////////////////////////////
	var id = 1800;
//	AddExpression(id, ef_return_number, "Center X", "Babylon Matrix", "CenterX", "Returns the X center velocity of the mesh");
//	id++;

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
