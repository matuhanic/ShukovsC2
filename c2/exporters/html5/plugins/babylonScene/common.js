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
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also , <i></i>
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
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also , <i></i>
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
	var id = 1000;
	AddCondition(id, cf_trigger, "Is ready", "Babylon Scene", "Is scene loaded", "Is scene loaded", "IsSceneReady");
	id++;
	//////////////////////////////////////////
	//////////////////////////////////////////
	//////////////A C T I O N S///////////////
	//////////////////////////////////////////
	//////////////////////////////////////////
	var id = 1100;
	AddStringParam("Filename", "The file name of the scene", initial_string = "\"scene.babylon\"");
	AddAction(id, af_none, "Load", "Babylon Scene", "Load scene file ({0}).", "Load scene", "SceneLoad");
	id++;
	AddObjectParam("Camera", "The camera to be set to the active one");
	AddAction(id, af_none, "Set active camera", "Babylon Cameras", "Set camera ({0}) as the active camera.", "Set active camera", "SceneSetCam");
	id++;
	AddObjectParam("Camera", "The camera to be attached");
	AddAction(id, af_none, "Attach camera controls", "Babylon Camera", "Attach camera ({0}) controls.", "Attach the camera controllers.", "AttachCamControl");
	id++;
	AddObjectParam("Camera", "The camera to be detached");
	AddAction(id, af_none, "Detach camera controls", "Babylon Camera", "Detach camera ({0}) controls.", "Detach the camera controllers.", "DetachCamControl");
	id++;
	AddNumberParam("X", "", initial_string = "0");
	AddNumberParam("Y", "", initial_string = "-0.9");
	AddNumberParam("Z", "", initial_string = "0");
	AddAction(id, af_none, "Set native gravity", "Babylon General", "Set scene native engine gravity to {0},{1},{2}.", "Set scene native gravity.", "SceneSetGravity");
	id++;
	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("State", "", "Disabled");
	AddAction(id, af_none, "Set collisions state", "Babylon Collisions", "Set scene collisions state to {0}.", "Set scene collisions state.", "SceneSetCollisions");
	id++;
	AddComboParamOption("CannonJS");
	AddComboParamOption("OimoJS");
	AddComboParam("Engine", "", "CannonJS");
	AddNumberParam("X", "", initial_string = "0");
	AddNumberParam("Y", "", initial_string = "-9.81");
	AddNumberParam("Z", "", initial_string = "0");
	AddAction(id, af_none, "Enable physics engine", "Babylon Physics", "Set scene physics engine to {0} with gravity {1},{2},{3}.", "Enable physics engine.", "SceneEnablePhys");
	id++;
	AddAction(id, af_none, "Disable physics engine", "Babylon Physics", "Disable scene physics engine.", "Disable physics engine.", "SceneDisablePhys");
	id++;
	AddAction(id, af_none, "Destoy", "Babylon General", "Destroy the scene and free some memory.", "Destroy the scene.", "SceneDestroy");
	id++;
	AddNumberParam("X", "X component of the gravity.", initial_string = "0");
	AddNumberParam("Y", "Y component of the gravity.", initial_string = "-0.9");
	AddNumberParam("Z", "Z component of the gravity.", initial_string = "0");
	AddAction(id, af_none, "Set physics engine gravity", "Babylon Physics", "Set the physics engine gravity to <b>({0},{1},{2})</b>.", "Defines the physics engine gravity.", "SceneSetEngineGravity");
	id++;
	AddNumberParam("Timestep", "The timestep.", initial_string = "1/20");
	AddAction(id, af_none, "Set physics engine gravity timestep", "Babylon Physics", "Set scene gravity timestep to <b>({0})</b>.", "Set the scene physics timestep ", "SceneSetTimestep");
	id++;
	
	AddAction(id, af_none, "Dispose physics engine", "Babylon Physics", "Dispos this scene's physics.", "Dispose scene physics engine", "DisposePhysics");
	id++;

	AddNumberParam("R", "Red color.", initial_string = "255");
	AddNumberParam("G", "Green color.", initial_string = "255");
	AddNumberParam("B", "Blue color.", initial_string = "255");
	AddAction(id, af_none, "Set ambient color", "Babylon Color", "Set ambient color to <b>{0},{1},{2}</b>.", "Set ambient color", "SetAmbientColor");
	id++;

	AddNumberParam("R", "Red color.", initial_string = "255");
	AddNumberParam("G", "Green color.", initial_string = "255");
	AddNumberParam("B", "Blue color.", initial_string = "255");
	AddAction(id, af_none, "Set clear color", "Babylon Color", "Set clear color to <b>{0},{1},{2}</b>.", "Set clear color", "SetClearColor");
	id++;

	AddNumberParam("R", "Red color.", initial_string = "255");
	AddNumberParam("G", "Green color.", initial_string = "255");
	AddNumberParam("B", "Blue color.", initial_string = "255");
	AddAction(id, af_none, "Set fog color", "Babylon Color", "Set fog color to <b>{0},{1},{2}</b>.", "Set fog color", "SetFogColor");
	id++;

	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("State", "", "Disabled");
	AddAction(id, af_none, "Set fog state", "Babylon States", "Set fog state to <b>{0}</b>.", "Set fog state", "SetFogState");
	id++;

	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("State", "", "Disabled");
	AddAction(id, af_none, "Set flares state", "Babylon States", "Set flares state to <b>{0}</b>.", "Set flares state", "SetFlaresState");
	id++;

	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("State", "", "Disabled");
	AddAction(id, af_none, "Set lights state", "Babylon States", "Set lights state to <b>{0}</b>.", "Set lights state", "SetLightsState");
	id++;

	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("State", "", "Disabled");
	AddAction(id, af_none, "Set particles state", "Babylon States", "Set particles state to <b>{0}</b>.", "Set particles state", "SetParticlesState");
	id++;

	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("State", "", "Disabled");
	AddAction(id, af_none, "Set shadows state", "Babylon States", "Set shadows state to <b>{0}</b>.", "Set shadows state", "SetShadowsState");
	id++;

	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("State", "", "Disabled");
	AddAction(id, af_none, "Set skeletons state", "Babylon States", "Set skeletons state to <b>{0}</b>.", "Set skeletons state", "SetSkeletonsState");
	id++;

	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("State", "", "Disabled");
	AddAction(id, af_none, "Set textures state", "Babylon States", "Set textures state to <b>{0}</b>.", "Set textures state", "SetTexturesState");
	id++;

	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("State", "", "Disabled");
	AddAction(id, af_none, "Set audio state", "Babylon States", "Set audio state to <b>{0}</b>.", "Set audio state", "SetAudioState");
	id++;

	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("State", "", "Disabled");
	AddAction(id, af_none, "Set wireframe rendering state", "Babylon States", "Set wireframe rendering state to <b>{0}</b>.", "Set wireframe rendering state", "SetWireframeState");
	id++;

	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("State", "", "Disabled");
	AddAction(id, af_none, "Set boundingbox rendering state", "Babylon States", "Set boundingbox rendering state to <b>{0}</b>.", "Set boundingbox rendering state", "SetBBoxState");
	id++;

	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("State", "", "Disabled");
	AddAction(id, af_none, "Set pointscloud rendering state", "Babylon States", "Set pointscloud rendering state to <b>{0}</b>.", "Set pointscloud rendering state", "SetPointsClState");
	id++;

	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("State", "", "Disabled");
	AddAction(id, af_none, "Set system to right handed", "Babylon States", "Set righthanded system state to <b>{0}</b>.", "Set hand system state", "UseRightHanded");
	id++;

	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("State", "", "Disabled");
	AddAction(id, af_none, "Set delayed textures loading state", "Babylon States", "Set delayed textures loading state to <b>{0}</b>.", "Set delayed textures loading state", "UseDelayedLoading");
	id++;

	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("State", "", "Disabled");
	AddAction(id, af_none, "Set depth buffer state", "Babylon States", "Set depth buffer state to <b>{0}</b>.", "Set depth buffer state", "DepthBuffer");
	id++;

	AddNumberParam("Scaling", "Scaling value.", initial_string = "1");
	AddAction(id, af_none, "Set hardware scaling", "Babylon General", "Set harware scaling value to <b>{0}</b>.", "Set harware scaling value", "SetHardwScaling");
	id++;
	AddAction(id, af_none, "Show debug", "Babylon Debug", "Show debug layer.", "", "ShowDebug");
	id++;	
	
	AddAction(id, af_none, "Hide debug", "Babylon Debug", "Hide debug layer.", "", "HideDebug");
	id++;

	//////////////////////////////////////////
	//////////////////////////////////////////
	/////////E X P R E S S I O N S////////////
	//////////////////////////////////////////
	//////////////////////////////////////////
	var id = 1200;
	AddExpression(id, ef_return_number, "Cursor pointer X", "Babylon Mouse", "PointerX", "Returns the X of the scene pointer");
	id++;
	AddExpression(id, ef_return_number, "Cursor pointer Y", "Babylon Mouse", "PointerY", "Returns the Y of the scene pointer");
	id++;
	AddExpression(id, ef_return_string, "Mesh under pointer", "Babylon Mouse", "MeshUnderPointer", "Returns the mesh under the pointer");
	id++;
	AddExpression(id, ef_return_number, "Picked X", "Babylon Picking", "ScenePickedX", "Returns the X pick of the scene");
	id++;
	AddExpression(id, ef_return_number, "Picked Y", "Babylon Picking", "ScenePickedY", "Returns the Y pick of the scene");
	id++;
	AddExpression(id, ef_return_number, "Picked Z", "Babylon Picking", "ScenePickedZ", "Returns the Z pick of the scene");
	id++;
	AddExpression(id, ef_return_number, "Loading progress", "Babylon Loading", "SceneLoadingProgress", "Returns the loading progress");
	id++;
	AddExpression(id, ef_return_number, "Total progress", "Babylon Loading", "SceneLoadingTotal", "Returns the total progress");
	id++;
	AddExpression(id, ef_return_any, "X Axis vector", "Babylon Matrix", "SceneAxisX", "Returns the x axis vector");
	id++;
	AddExpression(id, ef_return_any, "Y Axis vector", "Babylon Matrix", "SceneAxisY", "Returns the y axis vector");
	id++;
	AddExpression(id, ef_return_any, "Z Axis vector", "Babylon Matrix", "SceneAxisZ", "Returns the z axis vector");
	id++;
	AddExpression(id, ef_return_any, "Local space", "Babylon Matrix", "SceneLocalSpace", "Returns the local space vector");
	id++;
	AddExpression(id, ef_return_any, "World space", "Babylon Matrix", "SceneWorldSpace", "Returns the world space vector");
	id++;
	AddNumberParam("Origin X", "X origin of raycast.", initial_string = "0");
	AddNumberParam("Origin Y", "Y origin of raycast.", initial_string = "0");
	AddNumberParam("Origin Z", "Z origin of raycast.", initial_string = "0");
	AddNumberParam("Axis X", "X axis direction of raycast.", initial_string = "0");
	AddNumberParam("Axis Y", "Y axis direction of raycast.", initial_string = "-1");
	AddNumberParam("Axis Z", "Z axis direction of raycast.", initial_string = "0");
	AddExpression(id, ef_return_number, "Raycast X contact", "Babylon Raycast", "SceneRaycastedXPoint", "Returns the x position of the contact point of the ray.");
	id++;
	AddNumberParam("Origin X", "X origin of raycast.", initial_string = "0");
	AddNumberParam("Origin Y", "Y origin of raycast.", initial_string = "0");
	AddNumberParam("Origin Z", "Z origin of raycast.", initial_string = "0");
	AddNumberParam("Axis X", "X axis direction of raycast.", initial_string = "0");
	AddNumberParam("Axis Y", "Y axis direction of raycast.", initial_string = "-1");
	AddNumberParam("Axis Z", "Z axis direction of raycast.", initial_string = "0");
	AddExpression(id, ef_return_number, "Raycast Y contact", "Babylon Raycast", "SceneRaycastedYPoint", "Returns the y position of the contact point of the ray.");
	id++;
	AddNumberParam("Origin X", "X origin of raycast.", initial_string = "0");
	AddNumberParam("Origin Y", "Y origin of raycast.", initial_string = "0");
	AddNumberParam("Origin Z", "Z origin of raycast.", initial_string = "0");
	AddNumberParam("Axis X", "X axis direction of raycast.", initial_string = "0");
	AddNumberParam("Axis Y", "Y axis direction of raycast.", initial_string = "-1");
	AddNumberParam("Axis Z", "Z axis direction of raycast.", initial_string = "0");
	AddExpression(id, ef_return_number, "Raycast Z contact", "Babylon Raycast", "SceneRaycastedZPoint", "Returns the z position of the contact point of the ray.");
	id++;
	AddNumberParam("Origin X", "X origin of raycast.", initial_string = "0");
	AddNumberParam("Origin Y", "Y origin of raycast.", initial_string = "0");
	AddNumberParam("Origin Z", "Z origin of raycast.", initial_string = "0");
	AddNumberParam("Axis X", "X axis direction of raycast.", initial_string = "0");
	AddNumberParam("Axis Y", "Y axis direction of raycast.", initial_string = "-1");
	AddNumberParam("Axis Z", "Z axis direction of raycast.", initial_string = "0");
	AddExpression(id, ef_return_string, "Raycast contacted mesh", "Babylon Raycast", "SceneRaycastedMesh", "Returns the name of the mesh that intersected with the ray.");
	id++;

	AddExpression(id, ef_return_number, "Frames per second", "Babylon General", "FPS", "Returns the frames per second.");
	id++;

	AddExpression(id, ef_return_number, "Render width", "Babylon General", "RenderWidth", "Returns the render width.");
	id++;

	AddExpression(id, ef_return_number, "Render height", "Babylon General", "RenderHeight", "Returns the render height.");
	id++;
		
	AddExpression(id, ef_return_string, "WebGl info", "Babylon General", "WebGlInfo", "Returns the webgl info.");
	id++;

	AddExpression(id, ef_return_number, "Meshes count", "Babylon Count", "MeshesCount", "Returns the number of meshes in the scene.");
	id++;

	AddExpression(id, ef_return_number, "Lights count", "Babylon Count", "LightsCount", "Returns the number of lights in the scene.");
	id++;

	AddExpression(id, ef_return_number, "Cameras count", "Babylon Count", "CamerasCount", "Returns the number of cameras in the scene.");
	id++;
		
	AddExpression(id, ef_return_number, "Animations count", "Babylon Count", "AnimationsCount", "Returns the number of animations in the scene.");
	id++;

	AddExpression(id, ef_return_string, "Active camera", "Babylon General", "ActiveCamera", "Returns the current active camera.");
	id++;
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
