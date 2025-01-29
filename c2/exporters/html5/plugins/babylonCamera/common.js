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
	var id = 2200;

	AddObjectParam("Mesh target", "The target mesh");
	AddCondition(id, cf_trigger, "On collide with", "Babylon Events", "On camera collision with mesh {0}", "On collision with mesh", "CamOnCollide");
	id++;

	AddCondition(id, cf_trigger, "On ready", "Babylon Events", "On camera ready", "On camera ready", "CamOnReady");
	id++;

	//////////////////////////////////////////
	//////////////////////////////////////////
	/////////////A C T I O N S////////////////
	//////////////////////////////////////////
	//////////////////////////////////////////
	var id = 2300;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("Gravity state", "Set state", "True");
	AddAction(id, af_none, "Apply gravity", "Babylon Physics", "Set camera gravity state to <b>{0}</b>.", "Set the camera gravity state.", "CamApplyGravity");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("Collision checking", "Set state", "True");
	AddAction(id, af_none, "Set check collision state", "Babylon Collisions", "Set camera collision checking state to <b>{0}</b>.", "Set the camera collision checking state.", "CamCheckColl");
	id++;

	AddComboParamOption("BlacknWhite");
	AddComboParamOption("Blur");
	AddComboParamOption("Sepia");
	AddComboParamOption("Fxaa");
	AddComboParamOption("Refraction");
	AddComboParamOption("ColorCorrection");
	AddComboParam("Effect", "Choose an effect to attach", "BlacknWhite");
	AddNumberParam("Blur X", "Blur X.", initial_string = "1");
	AddNumberParam("Blur Y", "Blur Y.", initial_string = "0");
	AddNumberParam("Blur Width", "Blur Width.", initial_string = "0.25");
	AddNumberParam("Blur Height", "Blur Height.", initial_string = "0.25");
	AddNumberParam("Depth", "Depth level.", initial_string = "0.5");
	AddNumberParam("ColorLevel", "Color level.", initial_string = "0.5");
	AddNumberParam("Ration", "Ration.", initial_string = "1");
	AddStringParam("Refraction or ColCorrection map", "The refraction or color correction map filename ( depends on which you chose), dont forget to import the image first.", initial_string = "\"map.jpg\"");
	AddNumberParam("Level of insertion", "The level in which this effect is inserted.", initial_string = "0");
	AddAction(id, af_deprecated, "Attach postprocess", "Babylon Rendering", "Attach postproccess <b>{0}</b> to camera.", "Attach postproccess effect to camera.", "CamAttachPost");
	id++;

	AddNumberParam("X", "X rotation.", initial_string = "1");
	AddNumberParam("Y", "Y rotation.", initial_string = "0");
	AddNumberParam("Z", "Z rotation.", initial_string = "0");
	AddAction(id, af_none, "Rotate with ease", "Babylon Movement", "Rotate camera with ease <b>{0},{1},{2}</b>.", "Rotate the camera with ease out.", "CamRotateEase");
	id++;

	AddNumberParam("X", "X translation.", initial_string = "1");
	AddNumberParam("Y", "Y translation.", initial_string = "0");
	AddNumberParam("Z", "Z translation.", initial_string = "0");
	AddAction(id, af_none, "Translate with ease", "Babylon Movement", "Translate camera with ease <b>{0},{1},{2}</b>.", "Translate the camera with ease out.", "CamTranslateEase");
	id++;

	AddNumberParam("X", "X ellipsoid.", initial_string = "1");
	AddNumberParam("Y", "Y ellipsoid.", initial_string = "10");
	AddNumberParam("Z", "Z ellipsoid.", initial_string = "1");
	AddAction(id, af_none, "Set collision ellipsoid", "Babylon Collisions", "Set camera ellipsoid to <b>{0},{1},{2}</b>", "Set camera collision ellipsoid", "CameraEllipsoid");
	id++;

	AddNumberParam("Fov", "Field of view.", initial_string = "0.4");
	AddAction(id, af_none, "Set fov", "Babylon General", "Set camera field of view to <b>{0}</b>", "Set camera field of view", "CameraSetFov");
	id++;

	AddComboParamOption("Horizontal");
	AddComboParamOption("Vertical");
	AddComboParam("Fov Mode", "Choose an effect to attach", "Horizontal");
	AddAction(id, af_none, "Set fov mode", "Babylon General", "Set camera field of view mode to <b>{0}</b>", "Set camera field of view", "CameraSetFov");
	id++;

	AddKeybParam("Up key", "Set the up key equivalent");
	AddKeybParam("Down key", "Set the down key equivalent");
	AddKeybParam("Left key", "Set the left key equivalent");
	AddKeybParam("Right key", "Set the right key equivalent");
	AddAction(id, af_none, "Set controls", "Babylon Controls", "Set camera keyboard controls to  <b>{0},{1},{2},{3}</b>", "Set camera controls", "CameraSetContr");
	id++;

	AddAction(id, af_none, "Clear controls", "Babylon Controls", "Clear camera keyboard controls.", "Clear camera controls", "CameraClearContr");
	id++;

	AddObjectParam("Mesh target", "The target mesh");
	AddAction(id, af_none, "Set locked target", "Babylon Target", "Set camera locked target to {0}.", "Set camera target", "CameraSetTarg");
	id++;

	AddNumberParam("Speed", "Movement speed.", initial_string = "1");
	AddAction(id, af_none, "Set Speed", "Babylon General", "Set camera movement speed to <b>{0}</b> .", "Set camera speed", "CameraSetSpeed");
	id++;

	AddNumberParam("X", "X target.", initial_string = "0");
	AddNumberParam("Y", "Y target.", initial_string = "0");
	AddNumberParam("Z", "Z target.", initial_string = "0");
	AddAction(id, af_none, "Look at", "Babylon Matrix", "Set camera target to <b>{0},{1},{2}</b> .", "Set camera target", "CameraSetPosTarg");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("Allow upside", "Set state", "True");
	AddAction(id, af_none, "Set allow upside down", "Babylon Matrix", "Set camera allow upside down to <b>{0}</b> .", "Set camera allow upside down", "CameraSetUpside");
	id++;

	AddNumberParam("X sensiblity", "X sensibility.", initial_string = "0.5");
	AddAction(id, af_none, "Set X sensibility", "Babylon General", "Set camera X sensibility to <b>{0}</b> .", "Set camera X sensibility", "CameraSetXSensi");
	id++;

	AddNumberParam("Y sensiblity", "Y sensibility.", initial_string = "0.5");
	AddAction(id, af_none, "Set Y sensibility", "Babylon General", "Set camera Y sensibility to <b>{0}</b> .", "Set camera Y sensibility", "CameraSetYSensi");
	id++;

	AddNumberParam("Beta angle", "Beta.", initial_string = "0.5");
	AddAction(id, af_none, "Set beta", "Babylon General", "Set camera beta angle to <b>{0}</b> .", "Set camera beta angle", "CameraSetBeta");
	id++;

	AddNumberParam("Alpha angle", "Alpha.", initial_string = "0.5");
	AddAction(id, af_none, "Set alpha", "Babylon General", "Set camera alpha angle to <b>{0}</b> .", "Set camera alpha angle", "CameraSetAlpha");
	id++;

	AddNumberParam("Radius", "Radius.", initial_string = "0.5");
	AddAction(id, af_none, "Set radius", "Babylon General", "Set camera radius to <b>{0}</b> .", "Set camera radius", "CameraSetRadius");
	id++;

	AddNumberParam("Wheel precision", "Wheel precision.", initial_string = "0.5");
	AddAction(id, af_none, "Set wheel precision", "Babylon General", "Set camera wheel precision to <b>{0}</b> .", "Set camera wheel precision", "CameraSetWheelPrec");
	id++;

	AddNumberParam("Zoom on factor", "Zoom on factor.", initial_string = "0.5");
	AddAction(id, af_none, "Set zoom on factor", "Babylon General", "Set camera zoom on factor to <b>{0}</b> .", "Set camera zoom on factor", "CameraSetZoomFact");
	id++;

	AddNumberParam("X coll", "X collision radius.", initial_string = "1.5");
	AddNumberParam("Y coll", "Y collision radius.", initial_string = "3.5");
	AddNumberParam("Z coll", "Z collision radius.", initial_string = "1.5");
	AddAction(id, af_none, "Set collision radius", "Babylon Collisions", "Set camera collision radius to <b>{0},{1},{2}</b> .", "Set camera collision radius", "CameraSetCollRad");
	id++;

	AddNumberParam("Acceleration", "Acceleration.", initial_string = "0.5");
	AddAction(id, af_none, "Set acceleration", "Babylon Movement", "Set camera acceleration to <b>{0}</b> .", "Set camera acceleration", "CameraSetAccel");
	id++;

	AddNumberParam("Max speed", "Max speed.", initial_string = "0.5");
	AddAction(id, af_none, "Set max speed", "Babylon Movement", "Set camera max speed to <b>{0}</b> .", "Set camera max speed", "CameraSetMaxSpeed");
	id++;

	AddObjectParam("Mesh target", "The target mesh");
	AddAction(id, af_none, "Set mesh target", "Babylon Target", "Set camera mesh target to {0} .", "Set follow camera target", "CameraSetTarFMesh");
	id++;

	AddNumberParam("Height offset", "Height offset.", initial_string = "10");
	AddAction(id, af_none, "Set height offset", "Babylon General", "Set camera height offset to <b>{0}</b> .", "Set camera height offset", "CameraSetHeiOff");
	id++;

	AddComboParamOption("On collision");
	AddComboParamOption("On ready");
	AddComboParam("Event", "Choose an event", "On collision");
	AddAction(id, af_none, "Register camera event", "Babylon Events", "Register camera event <b>{0}</b>.", "Register camera event", "CamRegisterEvent");
	id++;

	AddNumberParam("X pos", "X.", initial_string = "0");
	AddNumberParam("Y pos", "Y.", initial_string = "0");
	AddNumberParam("Z pos", "Z.", initial_string = "0");
	AddNumberParam("Alpha angle", "Alpha angle.", initial_string = "1");
	AddNumberParam("Beta angle", "Beta angle.", initial_string = "2");
	AddNumberParam("Radius", "Radius.", initial_string = "100");
	AddAction(id, af_deprecated, "Create ArcRotate Camera", "Babylon New Camera", "Create an ArcRotate camera  at <b>({0},{1},{2})</b>.", "Create an ArcRotate camera.", "CamCreateArctRot");
	id++;

	AddNumberParam("X pos", "X.", initial_string = "0");
	AddNumberParam("Y pos", "Y.", initial_string = "0");
	AddNumberParam("Z pos", "Z.", initial_string = "0");
	AddAction(id, af_deprecated, "Create Free Camera", "Babylon New Camera", "Create a free camera  at <b>({0},{1},{2})</b>.", "Create a free camera.", "CamCreateFree");
	id++;

	AddNumberParam("X pos", "X.", initial_string = "0");
	AddNumberParam("Y pos", "Y.", initial_string = "0");
	AddNumberParam("Z pos", "Z.", initial_string = "0");
	AddStringParam("Mesh target", "The target mesh name  as in your 3D editor", initial_string = "\"Box001\"");
	AddAction(id, af_deprecated, "Create Follow Camera", "Babylon New Camera", "Create a follow camera  at <b>({0},{1},{2})</b> follow target {3}.", "Create a follow camera.", "CamCreateFollow");
	id++;

	AddStringParam("Mesh target", "The target mesh name  as in your 3D editor", initial_string = "\"Box001\"");
	AddAction(id, af_deprecated, "Zoom on mesh", "Babylon Camera", "Zoom on mesh <b>{0}</b>", "Zoom on mesh.", "CameraZoomOn");
	id++;

	AddNumberParam("Panning sensibility", ".", initial_string = "1");
	AddAction(id, af_none, "Set panning sensibility", "Babylon General", "Set camera panning sensibility to <b>{0}</b> .", "Set camera panning sensibility", "CamPanningSensibilty");
	id++;

	AddNumberParam("Pinch precision", ".", initial_string = "1");
	AddAction(id, af_none, "Set pinch precision", "Babylon General", "Set camera pinch precision to <b>{0}</b> .", "Set camera pinch precision", "CamPinchPrec");
	id++;
	AddNumberParam("Inertia", ".", initial_string = "1");
	AddAction(id, af_none, "Set inertia", "Babylon General", "Set camera inertia (brake) to <b>{0}</b> .", "Set camera inertia", "CamInertia");
	id++;
	AddNumberParam("Offset", ".", initial_string = "1");
	AddAction(id, af_none, "Set rotation offset", "Babylon General", "Set camera rotation offset to <b>{0}</b> .", "Set camera rotation offset", "CamRotationOffset");
	id++;
	AddNumberParam("X", ".", initial_string = "0");
	AddNumberParam("Y", ".", initial_string = "0");
	AddNumberParam("Z", ".", initial_string = "0");
	AddAction(id, af_none, "Set target offset", "Babylon Target", "Set camera target offset to <b>{0},{1},{2}</b> .", "Set camera target offset", "CamTargetOffset");
	id++;

	AddNumberParam("X", "X position.", initial_string = "0");
	AddNumberParam("Y", "Y position.", initial_string = "0");
	AddNumberParam("Z", "Z position.", initial_string = "0");
	AddAction(id, af_none, "Set position", "Babylon Matrix", "Set camera position to <b>({0},{1},{2})</b>.", "Set camera position", "CameraSetPosition");
	id++;

	AddNumberParam("X", "X rotation.", initial_string = "0");
	AddNumberParam("Y", "Y rotation.", initial_string = "0");
	AddNumberParam("Z", "Z rotation.", initial_string = "0");
	AddAction(id, af_none, "Set rotation", "Babylon Matrix", "Set camera rotation to <b>({0},{1},{2})</b>.", "Set camera rotation", "CameraSetRotation");
	id++;

	AddNumberParam("X", "X scaling.", initial_string = "0");
	AddNumberParam("Y", "Y scaling.", initial_string = "0");
	AddNumberParam("Z", "Z scaling.", initial_string = "0");
	AddAction(id, af_none, "Set scaling", "Babylon Matrix", "Set camera scaling to <b>({0},{1},{2})</b>.", "Set camera scaling", "CameraSetScaling");
	id++;

	AddNumberParam("X", "X position.", initial_string = "0");
	AddNumberParam("Y", "Y position.", initial_string = "0");
	AddNumberParam("Z", "Z position.", initial_string = "0");
	AddAction(id, af_none, "Translate by", "Babylon Matrix", "Translate camera by <b>({0},{1},{2})</b>.", "Translate camera", "TranslateCameraBy");
	id++;

	AddNumberParam("X", "X rotation.", initial_string = "0");
	AddNumberParam("Y", "Y rotation.", initial_string = "0");
	AddNumberParam("Z", "Z rotation.", initial_string = "0");
	AddAction(id, af_none, "Rotate by", "Babylon Matrix", "Rotate camera by <b>({0},{1},{2})</b>.", "Set camera rotation", "RotateCameraBy");
	id++;

	AddNumberParam("X", "X scaling.", initial_string = "0");
	AddNumberParam("Y", "Y scaling.", initial_string = "0");
	AddNumberParam("Z", "Z scaling.", initial_string = "0");
	AddAction(id, af_none, "Scale by", "Babylon Matrix", "Scale camera by <b>({0},{1},{2})</b>.", "Set camera scaling", "ScaleCameraBy");
	id++;
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Enabled", "Enable or disable", "True");
	AddAction(id, af_none, "Set animations state", "Babylon Animations", "Set animations state to <b>({0})</b>.", "Set the animationsEnabled state.", "CameraSetAnimState");
	id++;

	AddStringParam("Animation name", "The entity name as in your 3D editor", initial_string = "\"anim001\"");
	AddNumberParam("Start", "Start frame.", initial_string = "0");
	AddNumberParam("End", "End frame.", initial_string = "10");
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Loop", "Enable or disable", "True");
	AddNumberParam("Speed ration", "The speed of the anim.", initial_string = "1");
	AddAction(id, af_none, "Begin animation", "Babylon Animations", "Begin animation <b>({0})</b> from frame <b>({1})</b> to <b>({2})</b>, set loop to <b>({3})</b> and speed to <b>({4})</b>.", "Begin animation.", "CameraBeginAnim");
	id++;

	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddStringParam("The parameter", "The parameter member, ex: position.x", initial_string = "\"position.y\"");
	AddStringParam("The start", "The start frame followed by the value, ex: 0,10 ", initial_string = "\"0,10\"");
	AddStringParam("The middle", "The middle frame  followed by the value, ex: 20,30", initial_string = "\"10,20\"");
	AddStringParam("The end", "The end frame followed by the value, ex: 40,50", initial_string = "\"40,100\"");
	AddNumberParam("FPS", "The frames per second.", initial_string = "30");
	AddAction(id, af_none, "Create animation", "Babylon Animations", "Create animation named <b>({0})</b> : parameter <b>({1})</b>, Start:<b>({2})</b> Mid:<b>({3})</b> End:<b>({4})</b> FPS:<b>({5})</b>  .", "Create animation.", "CameraCreateAnim");
	id++;

	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddAction(id, af_none, "Stop animation", "Babylon Animations", "Stops animation named <b>({0})</b>.", "Stop animation.", "CameraStopAnim");
	id++;

	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddAction(id, af_none, "Pause animation", "Babylon Animations", "Pauses animation named <b>({0})</b>.", "Stop animation.", "CameraPauseAnim");
	id++;

	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddAction(id, af_none, "Restart animation", "Babylon Animations", "Restarts animation named <b>({0})</b>.", "Restarts animation.", "CameraRestartAnim");
	id++;

	AddComboParamOption("Mesh");
	AddComboParamOption("Light");
	AddComboParamOption("Camera");
	AddComboParam("Parent Type", "Choose which type is the parent", "Mesh");
	AddObjectParam("Parent", "The parent");
	AddAction(id, af_none, "Set parent", "Babylon Parenting", "Set camera parent to {1}.", "Set the camera parent.", "CameraSetParent");

	id++;
	AddNumberParam("Visiblity", "Visiblity value.", initial_string = "1");
	AddAction(id, af_none, "Set visibility", "Babylon Rendering", "Set camera visibility <b>{0}</b>.", "Set camera visibility", "CameraVisiblity");

	id++;
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set enabled state", "Babylon State", "Set camera enabled state to <b>({0})</b>.", "Set camera enabled", "CameraSetEnabled");
	id++;

	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");
	AddAction(id, af_deprecated, "Rotate around local X", "Babylon Matrix", "Rotate camera by <b>({0})</b> around local X axis.", "Rotate camera around X local", "RotateCameraXLocal");
	id++;

	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");
	AddAction(id, af_deprecated, "Rotate around local Y", "Babylon Matrix", "Rotate camera by <b>({0})</b> around local Y axis.", "Rotate camera around Y local", "RotateCameraYLocal");
	id++;

	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");
	AddAction(id, af_deprecated, "Rotate around local Z", "Babylon Matrix", "Rotate camera by <b>({0})</b> around local Z axis.", "Rotate camera around Z local", "RotateCameraZLocal");
	id++;

	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");
	AddAction(id, af_deprecated, "Rotate around world X", "Babylon Matrix", "Rotate camera by <b>({0})</b> around world X axis.", "Rotate camera around X world", "RotateCameraXWorld");
	id++;

	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");
	AddAction(id, af_deprecated, "Rotate around world Y", "Babylon Matrix", "Rotate camera by <b>({0})</b> around world Y axis.", "Rotate camera around Y world", "RotateCameraYWorld");
	id++;

	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");
	AddAction(id, af_deprecated, "Rotate around world Z", "Babylon Matrix", "Rotate camera by <b>({0})</b> around world Z axis.", "Rotate camera around Z world", "RotateCameraZWorld");
	id++;

	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");
	AddAction(id, af_deprecated, "Translate around local X", "Babylon Matrix", "Translate camera by <b>({0})</b> around local X axis.", "Translate camera around X local", "TranslateCameraXLocal");
	id++;

	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");
	AddAction(id, af_deprecated, "Translate around local Y", "Babylon Matrix", "Translate camera by <b>({0})</b> around local Y axis.", "Translate camera around Y local", "TranslateCameraYLocal");
	id++;

	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");
	AddAction(id, af_deprecated, "Translate around local Z", "Babylon Matrix", "Translate camera by <b>({0})</b> around local Z axis.", "Translate camera around Z local", "TranslateCameraZLocal");
	id++;

	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");
	AddAction(id, af_deprecated, "Translate around world X", "Babylon Matrix", "Translate camera by <b>({0})</b> around world X axis.", "Translate camera around X world", "TranslateCameraXWorld");
	id++;

	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");
	AddAction(id, af_deprecated, "Translate around world Y", "Babylon Matrix", "Translate camera by <b>({0})</b> around world Y axis.", "Translate camera around Y world", "TranslateCameraYWorld");
	id++;

	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");
	AddAction(id, af_deprecated, "Translate around world Z", "Babylon Matrix", "Translate camera by <b>({0})</b> around world Z axis.", "Translate camera around Z world", "TranslateCameraZWorld");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "State", "True");
	AddAction(id, af_none, "Set pickable", "Babylon Picking", "Set camera pickable to <b>({0})</b>.", "Set camera pickable", "CameraSetPickable");
	id++;

	AddAction(id, af_none, "Destroy", "Babylon General", "Destroy camera.", "Destroy camera", "CameraDestroy");
	
/* 	id++;
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Mouselock", "State", "True");
	AddAction(id, af_none, "Switch to fullscreen and lock mouse", "Babylon General", "Fullscreen mode with mouse lock set to <b>{0}</b>.", "Fullscreen camera with mouselock", "CameraFullsLock");
	 */
	id++;
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Mouselock", "State", "True");
	AddAction(id, af_none, "Lock mouse", "Babylon General", "Set camera mouse lock to <b>{0}</b>.", "Camera with mouselock", "CameraLock");
	id++;

	AddNumberParam("Distance", "", initial_string = "0"); 
	AddAction(id, af_none, "Set interaxial distance", "Babylon General", "Set camera interaxial distance to <b>{0}</b>.", "Set camera interaxial distance", "CameraInterDist");
	id++;

	AddNumberParam("Min Z", "", initial_string = "0"); 
	AddAction(id, af_none, "Set min Z", "Babylon Drawdistance", "Set camera min Z to <b>{0}</b>.", "Set camera min Z", "CameraMinZ");
	id++;

	AddNumberParam("Max Z", "", initial_string = "100"); 
	AddAction(id, af_none, "Set max Z", "Babylon Drawdistance", "Set camera max Z to <b>{0}</b>.", "Set camera max Z", "CameraMaxZ");
	id++;

	AddNumberParam("X [0-1]", "0 Is top left", initial_string = "0");
	AddNumberParam("Y [0-1]", "0 Is top left", initial_string = "0"); 
	AddNumberParam("Width [0-1]", "1 is 100%", initial_string = "0.5"); 
	AddNumberParam("Height [0-1]", "1 is 100%", initial_string = "0.5");  
	AddAction(id, af_none, "Set viewport", "Babylon Viewport", "Include the camera to a new viewport which is at <b>{0},{1}</b> and has a size of <b>{2},{3}</b>.", "Set camera viewport", "CameraSetViewport");
	id++;

	AddNumberParam("Sensiblity", "", initial_string = "1"); 
	AddAction(id, af_none, "Set touch angular sensiblity", "Babylon TouchCamera", "Set camera finger rotate sensiblity <b>{0}</b>.", "Set finger swipe sensiblity", "TouchAngSens");
	id++;

	AddNumberParam("Sensiblity", "", initial_string = "1"); 
	AddAction(id, af_none, "Set touch move sensiblity", "Babylon TouchCamera", "Set camera finger move sensiblity <b>{0}</b>.", "Set finger swipe sensiblity", "TouchMoveSens");
	id++;
															//////////////////////////////////////////
															//////////////////////////////////////////
															/////////E X P R E S S I O N S////////////
															//////////////////////////////////////////
															//////////////////////////////////////////	
															
	var id = 2400;
	
	AddExpression(id, ef_return_number, "PositionX", "Babylon Matrix", "CamPosX", "Returns the X position of the camera");
	id++;
	
	AddExpression(id, ef_return_number, "PositionY", "Babylon Matrix", "CamPosY", "Returns the Y position of the camera");
	id++;
	
	AddExpression(id, ef_return_number, "PositionZ", "Babylon Matrix", "CamPosZ", "Returns the Z position of the camera");
	id++;
	
	AddExpression(id, ef_return_number, "RotationX", "Babylon Matrix", "CamRotX", "Returns the X rotation of the camera");
	id++;
	
	AddExpression(id, ef_return_number, "RotationY", "Babylon Matrix", "CamRotY", "Returns the Y rotation of the camera");
	id++;
	
	AddExpression(id, ef_return_number, "RotationZ", "Babylon Matrix", "CamRotZ", "Returns the Z rotation of the camera");
	id++;	
	
	AddNumberParam("Distance", "Distance value.", initial_string = "10");
	AddExpression(id, ef_return_number, "FrontX", "Babylon Matrix", "CamFrontX", "Returns the X front of the camera");
	id++;
	
	AddNumberParam("Distance", "Distance value.", initial_string = "10");
	AddExpression(id, ef_return_number, "FrontY", "Babylon Matrix", "CamFrontY", "Returns the Y front of the camera");
	id++;
	
	AddNumberParam("Distance", "Distance value.", initial_string = "10");
	AddExpression(id, ef_return_number, "FrontZ", "Babylon Matrix", "CamFrontZ", "Returns the Z front of the camera");
	id++;
	
	AddExpression(id, ef_return_number, "ScalingX", "Babylon Matrix", "CamScaleX", "Returns the X scaling of the camera");
	id++;
	
	AddExpression(id, ef_return_number, "ScalingY", "Babylon Matrix", "CamScaleY", "Returns the Y scaling of the camera");
	id++;
	
	AddExpression(id, ef_return_number, "ScalingZ", "Babylon Matrix", "CamScaleZ", "Returns the Z scaling of the camera");
	id++;
	
	id++;
	AddExpression(id, ef_return_string, "Camera Name", "Babylon General", "Name", "Returns the camera name");
	
	id++;
	AddExpression(id, ef_return_number, "Camera Scene UID", "Babylon General", "SceneUID", "Returns the camera scene UID");
	
	id++;
	AddExpression(id, ef_return_number, "Field of view", "Babylon General", "FOV", "Returns the camera field of view");
	
	id++;
	AddExpression(id, ef_return_number, "Type", "Babylon General", "Type", "Returns the camera type name");
	
	id++;
	AddNumberParam("AxisX", "", initial_string = "1");
	AddNumberParam("AxisY", "", initial_string = "0");
	AddNumberParam("AxisZ", "", initial_string = "0");
	AddExpression(id, ef_return_number, "Direction X", "Babylon General", "DirectionX", "Returns the camera x direction along the axis");

	id++;
	AddNumberParam("AxisX", "", initial_string = "1");
	AddNumberParam("AxisY", "", initial_string = "0");
	AddNumberParam("AxisZ", "", initial_string = "0");
	AddExpression(id, ef_return_number, "Direction Y", "Babylon General", "DirectionY", "Returns the camera Y direction along the axis");
	
	id++;
	AddNumberParam("AxisX", "", initial_string = "1");
	AddNumberParam("AxisY", "", initial_string = "0");
	AddNumberParam("AxisZ", "", initial_string = "0");
	AddExpression(id, ef_return_number, "Direction Z", "Babylon General", "DirectionZ", "Returns the camera Z direction along the axis");
					
											
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