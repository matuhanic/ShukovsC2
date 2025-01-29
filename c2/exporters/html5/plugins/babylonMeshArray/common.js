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
	
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddStringParam("Parent mesh name", "The parent mesh name as in your 3D editor", initial_string = "\"Box002\"");
	AddCondition(id, cf_none, "Is child off", "Babylon Parenting", "Is mesh with index <b>{0}</b> child of <b>{1}</b>", "Is child off", "IsChildOff");
	id++;		
	
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddCondition(id, cf_none, "Is disposed", "Babylon General", "Was mesh with index <b>{0}</b> disposed", "Was mesh disposed", "IsDisposed");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddNumberParam("a", "A point of the plane.", initial_string = "0");
	AddNumberParam("b", "B point of the plane.", initial_string = "1");
	AddNumberParam("c", "C point of the plane.", initial_string = "0");
	AddNumberParam("d", "D point of the plane.", initial_string = "10");
	AddCondition(id, cf_none, "Is in frustum", "Babylon General", "Is mesh with index <b>{0}</b> is in frustum plane <b>{1},{2},{3},{4}</b>", "Is mesh in frustum", "IsInFrustum");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddStringParam("Target mesh name", "The collided mesh name as in your 3D editor", initial_string = "\"Box002\"");
	AddCondition(id, cf_trigger, "On collide with", "Babylon Collisions", "On mesh with index <b>{0}</b> collision with mesh <b>{1}</b>", "On collision with mesh", "MeshOnCollide");
	id++;		
	
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddCondition(id, cf_trigger, "On ready", "Babylon General", "On mesh with index <b>{0}</b> ready", "On mesh ready", "MeshOnReady");
	id++;	
	
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddCondition(id, cf_none, "Is mesh blocked", "Babylon General", "Is mesh with index <b>{0}</b> blocked", "Is mesh blocked", "MeshIsBlocked");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddStringParam("Target mesh name", "The target mesh name as in your 3D editor", initial_string = "\"Box002\"");
	AddCondition(id, cf_none, "Intersects with mesh", "Babylon Collisions", "Is mesh with index <b>{0}</b> intersecting with mesh <b>{1}</b>", "Is mesh intersecting with mesh", "IntersWithMesh");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddNumberParam("X", "X point.", initial_string = "0");
	AddNumberParam("Y", "Y point.", initial_string = "0");
	AddNumberParam("Z", "Z point.", initial_string = "0");
	AddCondition(id, cf_none, "Intersects with point", "Babylon Collisions", "Is mesh with index <b>{0}</b> intersecting with point <b>{0},{1},{2}</b>", "Is mesh intersecting with point", "IntersWithPoint");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddCondition(id, cf_none, "Is mesh ready", "Babylon General", "Is mesh with index <b>{0}</b> ready", "Is mesh ready", "MeshIsReady");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddCondition(id, af_none, "Is visible", "Babylon General", "Is mesh with index <b>{0}</b> visible.", "Is mesh visible", "IsVisible");
	id++;


					
															//////////////////////////////////////////
															//////////////////////////////////////////
															//////////////A C T I O N S///////////////
															//////////////////////////////////////////
															//////////////////////////////////////////
	var id = 1700;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set fog enabled", "Babylon General", "Set mesh with index <b>({0})</b> fog enabled state to <b>({1})</b>.", "Set mesh fog enabled", "MeshSetFogEnabled");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set collisions enabled", "Babylon Collisions", "Set mesh with index <b>({0})</b> collisions enabled state to <b>({1})</b>.", "Set mesh collisions enabled", "MeshCheckColl");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set facing forward", "Babylon General", "Set mesh with index <b>({0})</b> facing forward state to <b>({1})</b>.", "Set mesh facing forward", "MeshSetFacingForward");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Use bones", "Babylon Bones", "Set mesh with index <b>({0})</b> use bones state to <b>({1})</b>.", "Set mesh use bones state", "MeshUseBones");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set infinite distance", "Babylon General", "Set mesh with index <b>({0})</b> infinite distance state to <b>({1})</b>.", "Set mesh infinite distance state", "MeshInfinDist");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set receive shadow", "Babylon Rendering", "Set mesh with index <b>({0})</b> receive shadow state to <b>({1})</b>.", "Set mesh receive shadow state", "MeshReceiveShadow");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddStringParam("LOD mesh name", "The LOD mesh name as in your 3D editor", initial_string = "\"Box002\"");
	AddNumberParam("Distance", "Set LOD after at distance.", initial_string = "1000");
	AddAction(id, af_none, "Add LOD level", "Babylon General", "Add mesh <b>({1})</b> as LOD level to mesh with index <b>({0})</b> after a distance of <b>({2})</b>.", "Add LOD to mesh", "MeshAddLOD");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddStringParam("Bone name", "The bone name", initial_string = "\"Head\"");
	AddAction(id, cf_none, "Attach to bone", "Babylon Bones", "Attach mesh with index <b>({0})</b> to bone <b>{1}</b>", "Attach mesh to bone", "MeshAttachToBone");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddAction(id, cf_none, "Set flatshaded", "Babylon Rendering", "Set mesh with index <b>{0}</b> flatshaded", "Set mesh flatshaded", "MeshSetFlatShaded");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddAction(id, cf_none, "Detach from bone", "Babylon Bones", "Detach mesh with index <b>{0}</b> from its bone", "Detach mesh from bone", "MeshDetachFromBone");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("R", "Red value.", initial_string = "255");
	AddNumberParam("G", "Green value.", initial_string = "0");
	AddNumberParam("B", "Blue value.", initial_string = "0");
	AddAction(id, cf_none, "Set edge color", "Babylon Rendering", "Set mesh with index <b>{0}</b> edges color to <b>{1},{2},{3}</b>", "Set mesh edges color", "MeshEdgeColor");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("Edge width", "Edge width value.", initial_string = "0.3");
	AddAction(id, cf_none, "Set edge width", "Babylon Rendering", "Set mesh with index <b>{0}</b> edges width to <b>{1}</b>", "Set mesh edges width", "MeshEdgeWidth");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("X", "X ellipsoid.", initial_string = "1");
	AddNumberParam("Y", "Y ellipsoid.", initial_string = "10");	
	AddNumberParam("Z", "Z ellipsoid.", initial_string = "1");	
	AddAction(id, cf_none, "Set collision ellipsoid", "Babylon Collisions", "Set mesh with index <b>{0}</b> ellipsoid to <b>{1},{2},{3}</b>", "Set mesh collision ellipsoid", "MeshEllipsoid");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set edge rendering", "Babylon Rendering", "Set mesh with index <b>{0}</b> edge rendering state to <b>({1})</b>.", "Set mesh edge rendering", "MeshSetEdgeRend");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddAction(id, af_none, "Flip faces", "Babylon Rendering", "Flip faces of mesh with index <b>{0}</b>.", "Flip mesh faces", "MeshFlipFaces");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("X", "X ellipsoid.", initial_string = "0");
	AddNumberParam("Y", "Y ellipsoid.", initial_string = "0");	
	AddNumberParam("Z", "Z ellipsoid.", initial_string = "0");
	AddAction(id, af_none, "Translate locally", "Babylon Matrix", "Translate mesh with index <b>{0}</b> locally.", "Translate mesh locally", "MeshTranslLocaly");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("X", "X position.", initial_string = "0");
	AddNumberParam("Y", "Y position.", initial_string = "0");	
	AddNumberParam("Z", "Z position.", initial_string = "0");
	AddAction(id, af_none, "Look at", "Babylon Matrix", "Set mesh with index <b>{0}</b> look at <b>{1},{2},{3}</b>.", "Set mesh lookat", "MeshLookAt");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("X", "X position.", initial_string = "0");
	AddNumberParam("Y", "Y position.", initial_string = "0");	
	AddNumberParam("Z", "Z position.", initial_string = "0");
	AddAction(id, af_none, "Move with collision", "Babylon Collisions", "Move mesh with index <b>{0}</b> with velocity <b>{1},{2},{3}</b>.", "Move mesh with collision", "MeshMoveColl");
	
	id++;
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddComboParamOption("On collision");
	AddComboParamOption("On ready");
	AddComboParam("Event", "Choose an event", "On collision");
	AddAction(id, cf_none, "Register mesh event", "Babylon Events", "Register mesh with index <b>{0}</b> event <b>{1}</b>.", "Register mesh event", "MeshRegisterEvent");
	id++;			
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddStringParam("Mesh name", "The mesh name", initial_string = "\"Box001\"");
	AddNumberParam("Starting index", "", initial_string = "0");
	AddNumberParam("Ending index", "", initial_string = "3");
	AddNumberParam("X", "", initial_string = "1.5");
	AddNumberParam("Y", "", initial_string = "0");
	AddNumberParam("Z", "", initial_string = "0");
	AddAction(id, af_none, "Morph vertices", "Babylon General", "Morph mesh with index <b>{0}</b> named <b>({1})</b> from vertex <b>({2})</b> to <b>({3})</b>, morph by <b>({4},{5},{6})</b>.", "Morph mesh by translating vertices", "MeshMorphVertices");
	id++;	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("X", "X position.", initial_string = "0");
	AddNumberParam("Y", "Y position.", initial_string = "0");	
	AddNumberParam("Z", "Z position.", initial_string = "0");
	AddAction(id, af_none, "Set position", "Babylon Matrix", "Set mesh with index <b>{0}</b> position to <b>({1},{2},{3})</b>.", "Set mesh position", "MeshSetPosition");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("X", "X rotation.", initial_string = "0");
	AddNumberParam("Y", "Y rotation.", initial_string = "0");	
	AddNumberParam("Z", "Z rotation.", initial_string = "0");
	AddAction(id, af_none, "Set rotation", "Babylon Matrix", "Set mesh with index <b>{0}</b> rotation to <b>({1},{2},{3})</b>.", "Set mesh rotation", "MeshSetRotation");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("X", "X scaling.", initial_string = "0");
	AddNumberParam("Y", "Y scaling.", initial_string = "0");	
	AddNumberParam("Z", "Z scaling.", initial_string = "0");
	AddAction(id, af_none, "Set scaling", "Babylon Matrix", "Set mesh with index <b>{0}</b> scaling to <b>({1},{2},{3})</b>.", "Set mesh scaling", "MeshSetScaling");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("X", "X position.", initial_string = "0");
	AddNumberParam("Y", "Y position.", initial_string = "0");	
	AddNumberParam("Z", "Z position.", initial_string = "0");
	AddAction(id, af_none, "Translate by", "Babylon Matrix", "Translate mesh with index <b>{0}</b> by <b>({1},{2},{3})</b>.", "Translate mesh", "TranslateMeshBy");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("X", "X rotation.", initial_string = "0");
	AddNumberParam("Y", "Y rotation.", initial_string = "0");	
	AddNumberParam("Z", "Z rotation.", initial_string = "0");
	AddAction(id, af_none, "Rotate by", "Babylon Matrix", "Rotate mesh with index <b>{0}</b> by <b>({1},{2},{3})</b>.", "Set mesh rotation", "RotateMeshBy");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("X", "X scaling.", initial_string = "0");
	AddNumberParam("Y", "Y scaling.", initial_string = "0");	
	AddNumberParam("Z", "Z scaling.", initial_string = "0");
	AddAction(id, af_none, "Scale by", "Babylon Matrix", "Scale mesh with index <b>{0}</b> by <b>({1},{2},{3})</b>.", "Set mesh scaling", "ScaleMeshBy");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddComboParamOption("Disabled");
	AddComboParamOption("Enabled");
	AddComboParam("Enabled", "Enable or disable", "Enabled");
	AddAction(id, af_none, "Set animations state", "Babylon Animations", "Set mesh with index <b>{0}</b> animations state to <b>({1})</b>.", "Set the animationsEnabled state.", "MeshSetAnimState");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddStringParam("Animation name", "The entity name as in your 3D editor", initial_string = "\"anim001\"");
	AddNumberParam("Start", "Start frame.", initial_string = "0");
	AddNumberParam("End", "End frame.", initial_string = "10");
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Loop", "Enable or disable", "True");
	AddNumberParam("Speed ration", "The speed of the anim.", initial_string = "1");
	AddAction(id, af_none, "Begin animation", "Babylon Animations", "Begin mesh with index <b>{0}</b> animation <b>({1})</b> from frame <b>({2})</b> to <b>({3})</b>, set loop to <b>({4})</b> and speed to <b>({5})</b>.", "Begin animation.", "MeshBeginAnim");
	id++;


	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddStringParam("The parameter", "The parameter member, ex: position.x", initial_string = "\"position.y\"");
	AddStringParam("The start", "The start frame followed by the value, ex: 0,10 ", initial_string = "\"0,10\"");
	AddStringParam("The middle", "The middle frame  followed by the value, ex: 20,30", initial_string = "\"10,20\"");
	AddStringParam("The end", "The end frame followed by the value, ex: 40,50", initial_string = "\"40,100\"");
	AddNumberParam("FPS", "The frames per second.", initial_string = "30");
	AddAction(id, af_none, "Create animation", "Babylon Animations", "Create mesh with index <b>{0}</b> animation named <b>({1})</b> : parameter <b>({2})</b>, Start:<b>({3})</b> Mid:<b>({4})</b> End:<b>({5})</b> FPS:<b>({6})</b>  .", "Create animation.", "MeshCreateAnim");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddAction(id, af_none, "Stop animation", "Babylon Animations", "Stops mesh with index <b>{0}</b> animation named <b>({1})</b>.", "Stop animation.", "MeshStopAnim");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddAction(id, af_none, "Pause animation", "Babylon Animations", "Pauses mesh with index <b>{0}</b> animation named <b>({1})</b>.", "Stop animation.", "MeshPauseAnim");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddAction(id, af_none, "Restart animation", "Babylon Animations", "Restarts mesh with index <b>{0}</b> animation named <b>({1})</b>.", "Restarts animation.", "MeshRestartAnim");
	id++;

	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddComboParamOption("Mesh");
	AddComboParamOption("Light");
	AddComboParamOption("Camera");
	AddComboParam("Parent Type", "Choose which type is the parent", "Mesh");
	AddStringParam("Parent name", "The parent name as in your 3D editor", initial_string = "\"Box002\"");
	AddAction(id, af_none, "Set parent", "Babylon Parenting", "Set mesh with index <b>{0}</b> parent to {1} named <b>({2})</b>.", "Set the mesh parent.", "MeshSetParent");
	
	id++;
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("Visiblity", "Visiblity value.", initial_string = "1");
	AddAction(id, af_none, "Set visibility", "Babylon Rendering", "Set mesh with index <b>{0}</b> visibility <b>{1}</b>.", "Set mesh visibility", "MeshVisiblity");
	
	id++;
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set enabled state", "Babylon General", "Set mesh with index <b>{0}</b> enabled state to <b>({1})</b>.", "Set mesh enabled", "MeshSetEnabled");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");
	AddAction(id, af_none, "Rotate around local X", "Babylon Matrix", "Rotate mesh with index <b>{0}</b> by <b>({1})</b> around local X axis.", "Rotate mesh around X local", "RotateMeshXLocal");
	id++;                                                                                  
	 
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");	 
	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");                   
	AddAction(id, af_none, "Rotate around local Y", "Babylon Matrix", "Rotate mesh with index <b>{0}</b> by <b>({1})</b> around local Y axis.", "Rotate mesh around Y local", "RotateMeshYLocal");
	id++;                                                                                   
	      
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");                    
	AddAction(id, af_none, "Rotate around local Z", "Babylon Matrix", "Rotate mesh with index <b>{0}</b> by <b>({1})</b> around local Z axis.", "Rotate mesh around Z local", "RotateMeshZLocal");
	id++;                                                                                   
	     
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");		
	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");                    
	AddAction(id, af_none, "Rotate around world X", "Babylon Matrix", "Rotate mesh with index <b>{0}</b> by <b>({1})</b> around world X axis.", "Rotate mesh around X world", "RotateMeshXWorld");
	id++;                                                                                    
	 
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");	 
	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");                     
	AddAction(id, af_none, "Rotate around world Y", "Babylon Matrix", "Rotate mesh with index <b>{0}</b> by <b>({1})</b> around world Y axis.", "Rotate mesh around Y world", "RotateMeshYWorld");
	id++; 
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");                                                                                         
	AddNumberParam("Angle", "Angle in degrees.", initial_string = "90");                     
	AddAction(id, af_none, "Rotate around world Z", "Babylon Matrix", "Rotate mesh with index <b>{0}</b> by <b>({1})</b> around world Z axis.", "Rotate mesh around Z world", "RotateMeshZWorld");
	id++;
	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");
	AddAction(id, af_none, "Translate around local X", "Babylon Matrix", "Translate mesh with index <b>{0}</b> by <b>({1})</b> around local X axis.", "Translate mesh around X local", "TranslateMeshXLocal");
	id++;                                                                                          
	  
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");	
	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");                     
	AddAction(id, af_none, "Translate around local Y", "Babylon Matrix", "Translate mesh with index <b>{0}</b> by <b>({1})</b> around local Y axis.", "Translate mesh around Y local", "TranslateMeshYLocal");
	id++;                                                                                         
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");                                                                                              
	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");                    
	AddAction(id, af_none, "Translate around local Z", "Babylon Matrix", "Translate mesh with index <b>{0}</b> by <b>({1})</b> around local Z axis.", "Translate mesh around Z local", "TranslateMeshZLocal");
	id++;                                                                                         
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");                                                                                              
	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");                    
	AddAction(id, af_none, "Translate around world X", "Babylon Matrix", "Translate mesh with index <b>{0}</b> by <b>({1})</b> around world X axis.", "Translate mesh around X world", "TranslateMeshXWorld");
	id++;                                                                                       
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");                                                                                            
	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");                  
	AddAction(id, af_none, "Translate around world Y", "Babylon Matrix", "Translate mesh with index <b>{0}</b> by <b>({1})</b> around world Y axis.", "Translate mesh around Y world", "TranslateMeshYWorld");
	id++;                                                                                          
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");                                                                                              
	AddNumberParam("Distance", "Distance in degrees.", initial_string = "90");                     
	AddAction(id, af_none, "Translate around world Z", "Babylon Matrix", "Translate mesh with index <b>{0}</b> by <b>({1})</b> around world Z axis.", "Translate mesh around Z world", "TranslateMeshZWorld");
	id++;
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "State", "True");	
	AddAction(id, af_none, "Set pickable", "Babylon General", "Set mesh with index <b>{0}</b> pickable to <b>({1})</b>.", "Set mesh pickable", "MeshSetPickable");
	id++;	
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");	
	AddAction(id, af_none, "Destroy", "Babylon General", "Destroy mesh with index <b>{0}</b>.", "Destroy mesh", "MeshDestroy");
	id++;
	AddNumberParam("Index", "The mesh index from the array,set to -1 to select all meshes of the array.", initial_string = "-1");
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Visible", "", "True");	
	AddAction(id, af_none, "Set is visible", "Babylon Rendering", "Set mesh with index <b>{0}</b> is visible to <b>({1})</b>.", "Set mesh is visible", "MeshSetIsVisible");
	id++;

					
															//////////////////////////////////////////
															//////////////////////////////////////////
															/////////E X P R E S S I O N S////////////
															//////////////////////////////////////////
															//////////////////////////////////////////
	var id = 1800;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "Center X", "Babylon Matrix", "CenterX", "Returns the X center velocity of the mesh");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "Center Y", "Babylon Matrix", "CenterY", "Returns the Y center velocity of the mesh");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "Center Z", "Babylon Matrix", "CenterZ", "Returns the Z center velocity of the mesh");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "Total vertices", "Babylon General", "TotalVertices", "Returns the total number of verts");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddStringParam("\"Camera001\"");
	AddExpression(id, ef_return_number, "Distance to camera", "Babylon Camera", "DistanceToCam", "Returns the distance between this and the camera");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "PositionX", "Babylon Matrix", "MeshPosX", "Returns the X position of the mesh");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "PositionY", "Babylon Matrix", "MeshPosY", "Returns the Y position of the mesh");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "PositionZ", "Babylon Matrix", "MeshPosZ", "Returns the Z position of the mesh");
	id++;	
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "AbsolutePositionX", "Babylon Matrix", "MeshAbsoPosX", "Returns the X absolute position of the mesh");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "AbsolutePositionY", "Babylon Matrix", "MeshAbsoPosY", "Returns the Y absolute position of the mesh");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "AbsolutePositionZ", "Babylon Matrix", "MeshAbsoPosZ", "Returns the Z absolute position of the mesh");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "RotationX", "Babylon Matrix", "MeshRotX", "Returns the X rotation of the mesh");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "RotationY", "Babylon Matrix", "MeshRotY", "Returns the Y rotation of the mesh");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "RotationZ", "Babylon Matrix", "MeshRotZ", "Returns the Z rotation of the mesh");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "ScalingX", "Babylon Matrix", "MeshScaleX", "Returns the X scaling of the mesh");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "ScalingY", "Babylon Matrix", "MeshScaleY", "Returns the Y scaling of the mesh");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "ScalingZ", "Babylon Matrix", "MeshScaleZ", "Returns the Z scaling of the mesh");
	id++;	
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "MeshPickedX", "Babylon Picking", "MeshPickedX", "Returns the X pick of the mesh");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "MeshPickedY", "Babylon Picking", "MeshPickedY", "Returns the Y pick of the mesh");
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddStringParam("\"Anim001\"");
	AddExpression(id, ef_return_number, "MeshCurrentFrame", "Babylon Animations", "MeshCurrentFrame", "Returns the current animation frame of the mesh");
	
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_string, "Mesh Name", "Babylon General", "Name", "Returns the mesh name");
	
	id++;
	AddNumberParam("Index", "The mesh index from the array.", initial_string = "0");
	AddExpression(id, ef_return_number, "Mesh Scene UID", "Babylon General", "SceneUID", "Returns the mesh scene UID");
	

	
											
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

function leftPad(number, targetLength) {
	var output = number + '';
	while (output.length < targetLength) {
		output = '0' + output;
	}
	return output;
}