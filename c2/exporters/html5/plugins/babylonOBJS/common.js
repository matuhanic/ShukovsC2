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

	AddObjectParam("Parent mesh name", "The parent mesh name");
	AddCondition(id, cf_none, "Is child off", "Babylon Mesh", "Is mesh child of {0}", "Is child off", "IsChildOff");
	id++;

	AddCondition(id, cf_none, "Is disposed", "Babylon General", "Is mesh was disposed", "Is mesh was disposed", "IsDisposed");
	id++;

	AddNumberParam("a", "A point of the plane.", initial_string = "0");
	AddNumberParam("b", "B point of the plane.", initial_string = "1");
	AddNumberParam("c", "C point of the plane.", initial_string = "0");
	AddNumberParam("d", "D point of the plane.", initial_string = "10");
	AddCondition(id, cf_none, "Is in frustum", "Babylon General", "Is mesh is in frustum plane <b>{0},{1},{2},{3}</b>", "Is mesh in frustum", "IsInFrustum");
	id++;



	AddCondition(id, cf_none, "Is mesh blocked", "Babylon General", "Is mesh blocked", "Is mesh blocked", "MeshIsBlocked");
	id++;

	AddObjectParam("Target mesh name", "The target mesh name");
	AddCondition(id, cf_none, "Intersects with mesh", "Babylon Collisions", "Is mesh intersecting with mesh {0}", "Is mesh intersecting with mesh", "IntersWithMesh");
	id++;

	AddNumberParam("X", "X point.", initial_string = "0");
	AddNumberParam("Y", "Y point.", initial_string = "0");
	AddNumberParam("Z", "Z point.", initial_string = "0");
	AddCondition(id, cf_none, "Intersects with point", "Babylon Collisions", "Is mesh intersecting with point <b>{0},{1},{2}</b>", "Is mesh intersecting with point", "IntersWithPoint");
	id++;

	AddCondition(id, cf_none, "Is mesh ready", "Babylon General", "Is mesh ready", "Is mesh ready", "MeshIsReady");
	id++;
	AddCondition(id, cf_none, "Is picked", "Babylon Picking", "Is this mesh picked by the cursor", "Is mesh this picked", "IsPicked");
	id++;
	AddObjectParam("Target mesh", "The target mesh");
	AddCondition(id, cf_deprecated, "On collide with", "Babylon Events", "On mesh collision with mesh {0}", "On collision with mesh", "MeshOnCollide");
	id++;		
	
	AddCondition(id, cf_trigger, "On ready", "Babylon Events", "On mesh ready", "On mesh ready", "MeshOnReady");
	id++;
	//////////////////////////////////////////
	//////////////////////////////////////////
	//////////////A C T I O N S///////////////
	//////////////////////////////////////////
	//////////////////////////////////////////
	var id = 1700;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set fog enabled", "Babylon Rendering", "Set mesh fog enabled state to <b>({0})</b>.", "Set mesh fog enabled", "MeshSetFogEnabled");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set collisions enabled", "Babylon Collisions", "Set mesh collisions enabled state to <b>({0})</b>.", "Set mesh collisions enabled", "MeshCheckColl");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set facing forward", "Babylon Rendering", "Set mesh facing forward state to <b>({0})</b>.", "Set mesh facing forward", "MeshSetFacingForward");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Use bones", "Babylon Bones", "Set mesh use bones state to <b>({0})</b>.", "Set mesh use bones state", "MeshUseBones");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set infinite distance", "Babylon Rendering", "Set mesh infinite distance state to <b>({0})</b>.", "Set mesh infinite distance state", "MeshInfinDist");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set receive shadow", "Babylon Rendering", "Set mesh receive shadow state to <b>({0})</b>.", "Set mesh receive shadow state", "MeshReceiveShadow");
	id++;

	AddObjectParam("LOD mesh name", "The LOD mesh");
	AddNumberParam("Distance", "Set LOD after at distance.", initial_string = "1000");
	AddAction(id, af_none, "Add LOD level", "Babylon Rendering", "Add mesh {0} as LOD level after a distance of <b>({1})</b>.", "Add LOD to mesh", "MeshAddLOD");
	id++;

	AddStringParam("Filename", "The displacement image filename", initial_string = "\"diplac.png\"");
	AddNumberParam("Min height", "Minimum height value.", initial_string = "-0.7");
	AddNumberParam("Max height", "Maximum height value.", initial_string = "0");
	AddAction(id, af_deprecated, "Apply displacement", "Babylon Rendering", "Apply displacement map <b>{0}</b> to  mesh with min height of <b>{1}</b> and max height of  <b>{2}</b>", "Apply displacement map to mesh", "MeshDisplMap");
	id++;

	AddObjectParam("Mesh name", "The mesh wich has the bone");
	AddStringParam("Bone name", "The bone name", initial_string = "\"Head\"");
	AddAction(id, af_none, "Attach to bone", "Babylon Bones", "Attach mesh to bone <b>{1}</b> of mesh {0}", "Attach mesh to bone", "MeshAttachToBone");
	id++;

	AddAction(id, af_none, "Set flatshaded", "Babylon Rendering", "Set mesh flatshaded", "Set mesh flatshaded", "MeshSetFlatShaded");
	id++;

	AddAction(id, af_none, "Detach from bone", "Babylon Bones", "Detach mesh from its bone", "Detach mesh from bone", "MeshDetachFromBone");
	id++;

	AddNumberParam("R", "Red value.", initial_string = "255");
	AddNumberParam("G", "Green value.", initial_string = "0");
	AddNumberParam("B", "Blue value.", initial_string = "0");
	AddAction(id, af_none, "Set edge color", "Babylon Rendering", "Set mesh edges color to <b>{0},{1},{2}</b>", "Set mesh edges color", "MeshEdgeColor");
	id++;

	AddNumberParam("Edge width", "Edge width value.", initial_string = "0.3");
	AddAction(id, af_none, "Set edge width", "Babylon Rendering", "Set mesh edges width to <b>{0}</b>", "Set mesh edges width", "MeshEdgeWidth");
	id++;

	AddNumberParam("X", "X ellipsoid.", initial_string = "1");
	AddNumberParam("Y", "Y ellipsoid.", initial_string = "10");
	AddNumberParam("Z", "Z ellipsoid.", initial_string = "1");
	AddAction(id, af_none, "Set collision ellipsoid", "Babylon Collisions", "Set mesh ellipsoid to <b>{0},{1},{2}</b>", "Set mesh collision ellipsoid", "MeshEllipsoid");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set edge rendering", "Babylon Rendering", "Set mesh edge rendering state to <b>({0})</b>.", "Set mesh edge rendering", "MeshSetEdgeRend");
	id++;

	AddAction(id, af_none, "Flip faces", "Babylon Rendering", "Flip faces of mesh.", "Flip mesh faces", "MeshFlipFaces");
	id++;

	AddNumberParam("X", "X factor.", initial_string = "0");
	AddNumberParam("Y", "Y factor.", initial_string = "0");
	AddNumberParam("Z", "Z factor.", initial_string = "0");
	AddAction(id, af_none, "Translate locally", "Babylon Matrix", "Translate mesh locally by <b>{0},{1},{2}</b> .", "Translate mesh locally ", "MeshTranslLocaly");
	id++;

	AddNumberParam("X", "X position.", initial_string = "0");
	AddNumberParam("Y", "Y position.", initial_string = "0");
	AddNumberParam("Z", "Z position.", initial_string = "0");
	AddAction(id, af_none, "Look at", "Babylon Matrix", "Set mesh look at <b>{0},{1},{2}</b>.", "Set mesh lookat", "MeshLookAt");
	id++;

	AddNumberParam("X", "X position.", initial_string = "0");
	AddNumberParam("Y", "Y position.", initial_string = "0");
	AddNumberParam("Z", "Z position.", initial_string = "0");
	AddAction(id, af_none, "Move with collision", "Babylon Collisions", "Move mesh with collisions by <b>{0},{1},{2}</b>.", "Move mesh with collision", "MeshMoveColl");
	id++;

	AddStringParam("Clone name", "The clone name to be assigned", initial_string = "\"Box002\"");
	AddNumberParam("X", "X position.", initial_string = "0");
	AddNumberParam("Y", "Y position.", initial_string = "0");
	AddNumberParam("Z", "Z position.", initial_string = "0");
	AddAction(id, af_none, "Clone mesh", "Babylon New Mesh", "Clone this mesh to a new mesh name <b>({0})</b>, put at <b>{1},{2},{3}</b>.", "Clone mesh", "MeshClone");
	id++;

	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Preserve Y position", "Prevent the mesh from moving up and down", "False");
	AddAction(id, af_none, "Put at cursor position", "Babylon Matrix", "Put mesh at cursor position.", "Puts the mesh at the cursor position", "MeshPutAtCursor");
	id++;

	AddNumberParam("Starting index", "", initial_string = "0");
	AddNumberParam("Ending index", "", initial_string = "3");
	AddNumberParam("X", "", initial_string = "1.5");
	AddNumberParam("Y", "", initial_string = "0");
	AddNumberParam("Z", "", initial_string = "0");
	AddAction(id, af_deprecated, "Morph vertices", "Babylon Matrix", "Morph this mesh from vertex <b>({0})</b> to <b>({1})</b>, morph by <b>({2},{3},{4})</b>.", "Morph mesh by translating vertices", "MeshMorphVertices");
	id++;

	AddNumberParam("X", "X position.", initial_string = "0");
	AddNumberParam("Y", "Y position.", initial_string = "0");
	AddNumberParam("Z", "Z position.", initial_string = "0");
	AddAction(id, af_none, "Set position", "Babylon Matrix", "Set mesh position to <b>({0},{1},{2})</b>.", "Set mesh position", "MeshSetPosition");
	id++;

	AddNumberParam("X", "X rotation.", initial_string = "0");
	AddNumberParam("Y", "Y rotation.", initial_string = "0");
	AddNumberParam("Z", "Z rotation.", initial_string = "0");
	AddAction(id, af_none, "Set rotation", "Babylon Matrix", "Set mesh rotation to <b>({0},{1},{2})</b>.", "Set mesh rotation", "MeshSetRotation");
	id++;

	AddNumberParam("X", "X scaling.", initial_string = "0");
	AddNumberParam("Y", "Y scaling.", initial_string = "0");
	AddNumberParam("Z", "Z scaling.", initial_string = "0");
	AddAction(id, af_none, "Set scaling", "Babylon Matrix", "Set mesh scaling to <b>({0},{1},{2})</b>.", "Set mesh scaling", "MeshSetScaling");
	id++;

	AddNumberParam("X", "X position.", initial_string = "0");
	AddNumberParam("Y", "Y position.", initial_string = "0");
	AddNumberParam("Z", "Z position.", initial_string = "0");
	AddAction(id, af_none, "Translate by", "Babylon Matrix", "Translate mesh by <b>({0},{1},{2})</b>.", "Translate mesh", "TranslateMeshBy");
	id++;

	AddNumberParam("X", "X rotation.", initial_string = "0");
	AddNumberParam("Y", "Y rotation.", initial_string = "0");
	AddNumberParam("Z", "Z rotation.", initial_string = "0");
	AddAction(id, af_none, "Rotate by", "Babylon Matrix", "Rotate mesh by <b>({0},{1},{2})</b>.", "Set mesh rotation", "RotateMeshBy");
	id++;

	AddNumberParam("X", "X scaling.", initial_string = "0");
	AddNumberParam("Y", "Y scaling.", initial_string = "0");
	AddNumberParam("Z", "Z scaling.", initial_string = "0");
	AddAction(id, af_none, "Scale by", "Babylon Matrix", "Scale mesh by <b>({0},{1},{2})</b>.", "Set mesh scaling", "ScaleMeshBy");
	id++;
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Enabled", "Enable or disable", "True");
	AddAction(id, af_none, "Set animations state", "Babylon Animations", "Set animations state to <b>({0})</b>.", "Set the animationsEnabled state.", "MeshSetAnimState");
	id++;

	AddStringParam("Animation name", "The entity name", initial_string = "\"anim001\"");
	AddNumberParam("Start", "Start frame.", initial_string = "0");
	AddNumberParam("End", "End frame.", initial_string = "10");
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Loop", "Enable or disable", "True");
	AddNumberParam("Speed ration", "The speed of the anim.", initial_string = "1");
	AddAction(id, af_none, "Begin animation", "Babylon Animations", "Begin animation <b>({0})</b> from frame <b>({1})</b> to <b>({2})</b>, set loop to <b>({3})</b> and speed to <b>({4})</b>.", "Begin animation.", "MeshBeginAnim");
	id++;

	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddStringParam("The parameter", "The parameter member, ex: position.x", initial_string = "\"position.y\"");
	AddStringParam("The start", "The start frame followed by the value, ex: 0,10 ", initial_string = "\"0,10\"");
	AddStringParam("The middle", "The middle frame  followed by the value, ex: 20,30", initial_string = "\"10,20\"");
	AddStringParam("The end", "The end frame followed by the value, ex: 40,50", initial_string = "\"40,100\"");
	AddNumberParam("FPS", "The frames per second.", initial_string = "30");
	AddAction(id, af_none, "Create animation", "Babylon Animations", "Create animation named <b>({0})</b> : parameter <b>({1})</b>, Start:<b>({2})</b> Mid:<b>({3})</b> End:<b>({4})</b> FPS:<b>({5})</b>  .", "Create animation.", "MeshCreateAnim");
	id++;

	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddAction(id, af_none, "Stop animation", "Babylon Animations", "Stops animation named <b>({0})</b>.", "Stop animation.", "MeshStopAnim");
	id++;

	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddAction(id, af_none, "Pause animation", "Babylon Animations", "Pauses animation named <b>({0})</b>.", "Stop animation.", "MeshPauseAnim");
	id++;

	AddStringParam("Animation name", "The animation name", initial_string = "\"anim001\"");
	AddAction(id, af_none, "Restart animation", "Babylon Animations", "Restarts animation named <b>({0})</b>.", "Restarts animation.", "MeshRestartAnim");
	id++;

	AddComboParamOption("Mesh");
	AddComboParamOption("Light");
	AddComboParamOption("Camera");
	AddComboParam("Parent Type", "Choose which type is the parent", "Mesh");
	AddObjectParam("Parent", "The parent");
	AddAction(id, af_none, "Set parent", "Babylon Parenting", "Set mesh parent to {1}.", "Set the mesh parent.", "MeshSetParent");

	id++;
	AddNumberParam("Visiblity", "Visiblity value.", initial_string = "1");
	AddAction(id, af_none, "Set visibility", "Babylon Rendering", "Set mesh visibility <b>{0}</b>.", "Set mesh visibility", "MeshVisiblity");

	id++;
	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set enabled state", "Babylon General", "Set mesh enabled state to <b>({0})</b>.", "Set mesh enabled", "MeshSetEnabled");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "State", "True");
	AddAction(id, af_none, "Set pickable", "Babylon Pickable", "Set mesh pickable to <b>({0})</b>.", "Set mesh pickable", "MeshSetPickable");
	id++;

	AddAction(id, af_none, "Destroy", "Babylon General", "Destroy mesh.", "Destroy mesh", "MeshDestroy");
	id++;
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("State", "State", "True");
	AddAction(id, af_none, "Blocker", "Babylon Lensflare", "Set this mesh blocks lensflare state to <b>({0})</b>.", "Block lensflare", "MeshBlockLens");
	id++;

	AddNumberParam("Frame", "the anim frame.", initial_string = "0");
	AddAction(id, af_deprecated, "Set texture frame", "Babylon Material", "Set this mesh material texture frame to <b>({0})</b>.", "Set mesh texture frame", "MeshSetTextuFrame");
	id++;

	AddNumberParam("U", "", initial_string = "1");
	AddNumberParam("V", "", initial_string = "1");
	AddAction(id, af_none, "Set texture uv scale", "Babylon Material", "Set this mesh material texture UV scale to <b>({0},{1})</b>.", "Set mesh texture uv scale", "MeshSetTextuUVScale");
	id++;

	AddNumberParam("U", "", initial_string = "0");
	AddNumberParam("V", "", initial_string = "0");
	AddAction(id, af_none, "Set texture uv offset", "Babylon Material", "Set this mesh material texture UV offset to <b>({0},{1})</b>.", "Set mesh texture uv offset", "MeshSetTextuUVOffset");
	id++;

	AddNumberParam("Alpha", "Alpha value.", initial_string = "0");
	AddAction(id, af_none, "Set alpha", "Babylon Material", "Set material alpha value to <b>({0})</b>.", "Set the material alpha.", "MatSetAlpha");
	id++;

	AddNumberParam("Alpha mode", "Alpha mode value.", initial_string = "0");
	AddAction(id, af_none, "Set alpha mode", "Babylon Material", "Set material alpha mode value to <b>({0})</b>.", "Set the material alpha mode.", "MatSetAlphaMode");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("State", "Set state", "True");
	AddAction(id, af_none, "Set backface culling", "Babylon Material", "Set material backface culling value to <b>({0})</b>.", "Set the material backface culling.", "MatSetBackFaceCulling");
	id++;

	AddNumberParam("Fill mode", "Fill mode value.", initial_string = "0");
	AddAction(id, af_none, "Set fill mode", "Babylon Material", "Set material fill mode to <b>({0})</b>.", "Set the material fill mode.", "MatSetFillMode");
	id++;

	AddNumberParam("Side orientation", "Side orientation value.", initial_string = "0");
	AddAction(id, af_none, "Set side orientation", "Babylon Material", "Set material sideorientation mode to <b>({0})</b>.", "Set the material sideorientation mode.", "MatSetSideOrient");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("Fog state", "Set state", "True");
	AddAction(id, af_none, "Set fog state", "Babylon Material", "Set material fog state to <b>({0})</b>.", "Set the material fog state.", "MatSetFogState");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("Alpha diffuse state", "Set state", "True");
	AddAction(id, af_none, "Set diffuse alpha state", "Babylon Material", "Set material alpha from diffuse state to <b>({0})</b>.", "Set the material alpha from diffuse.", "MatSetAlphaFromDif");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("Lightning state", "Set state", "True");
	AddAction(id, af_none, "Set lightning state", "Babylon Material", "Set material light state to <b>({0})</b>.", "Set the material light state.", "MatSetLightState");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("Parallax state", "Set state", "True");
	AddAction(id, af_none, "Set parallax state", "Babylon Material", "Set material light state to <b>({0})</b>.", "Set the material light state.", "MatSetParallState");
	id++;

	AddComboParamOption("True");
	AddComboParamOption("False");
	AddComboParam("Parallax occlusion state", "Set state", "True");
	AddAction(id, af_none, "Set parallax occlusion state", "Babylon Material", "Set material light state to <b>({0})</b>.", "Set the material light state.", "MatSetOccluState");
	id++;

	AddNumberParam("R", "Red color.", initial_string = "255");
	AddNumberParam("G", "Green color.", initial_string = "0");
	AddNumberParam("B", "Blue color.", initial_string = "0");
	AddAction(id, af_none, "Set ambient color", "Babylon Material", "Set material ambient color to <b>({0},{1},{2})</b>.", "Set the material ambient color.", "MatSetAmbColor");
	id++;

	AddNumberParam("R", "Red color.", initial_string = "255");
	AddNumberParam("G", "Green color.", initial_string = "0");
	AddNumberParam("B", "Blue color.", initial_string = "0");
	AddAction(id, af_none, "Set specular color", "Babylon Material", "Set material specular color to <b>({0},{1},{2})</b>.", "Set the material specular color.", "MatSetSpecuColor");
	id++;

	AddNumberParam("R", "Red color.", initial_string = "255");
	AddNumberParam("G", "Green color.", initial_string = "0");
	AddNumberParam("B", "Blue color.", initial_string = "0");
	AddAction(id, af_none, "Set diffuse color", "Babylon Material", "Set material diffuse color to <b>({0},{1},{2})</b>.", "Set the material diffuse color.", "MatSetDifColor");
	id++;

	AddNumberParam("R", "Red color.", initial_string = "255");
	AddNumberParam("G", "Green color.", initial_string = "0");
	AddNumberParam("B", "Blue color.", initial_string = "0");
	AddAction(id, af_none, "Set emissive color", "Babylon Material", "Set material emissive color to <b>({0},{1},{2})</b>.", "Set the material emissive color.", "MatSetEmiColor");
	id++;

	AddStringParam("Filename", "The ambient texture filename", initial_string = "\"ambie.png\"");
	AddAction(id, af_none, "Set ambient texture", "Babylon Material", "Set material ambient texture to <b>({0})</b>.", "Set the material ambient texture.", "MatSetAmbTexture");
	id++;

	AddStringParam("Filename", "The bump texture filename", initial_string = "\"bump.png\"");
	AddAction(id, af_none, "Set bump texture", "Babylon Material", "Set material bump texture to <b>({0})</b>.", "Set the material bump texture.", "MatSetBumpTexture");
	id++;

	AddStringParam("Filename", "The diffuse texture filename", initial_string = "\"diffuse.png\"");
	AddAction(id, af_none, "Set diffuse texture", "Babylon Material", "Set material diffuse texture to <b>({0})</b>.", "Set the material diffuse texture.", "MatSetDifTexture");
	id++;

	AddStringParam("Filename", "The emissive texture filename", initial_string = "\"emissive.png\"");
	AddAction(id, af_none, "Set emissive texture", "Babylon Material", "Set material emissive texture to <b>({0})</b>.", "Set the material emissive texture.", "MatSetEmiTexture");
	id++;

	AddStringParam("Filename", "The lightmap texture filename", initial_string = "\"lightmap.png\"");
	AddAction(id, af_none, "Set lightmap texture", "Babylon Material", "Set material lightmap texture to <b>({0})</b>.", "Set the material lightmap texture.", "MatSetLightmapTexture");
	id++;

	AddComboParamOption("Image");
	AddComboParamOption("Realtime");
	AddComboParam("Realtime or image", "Realtime reflection or image reflection", "Image");
	AddStringParam("[Image] prefix", "The reflection texture filename without extension", initial_string = "\"skybox\"");
	AddStringParam("[Realtime] plane", "The reflection plane (a,b,c,d).", initial_string = "\"0,-1,0,-10\"");
	AddObjectParam("[Realtime] render list", "The meshes that should be reflected.");
	AddNumberParam("[Realtime-Image] level", "Reflection level.", initial_string = "0.5");
	AddAction(id, af_none, "Set reflection texture", "Babylon Material", "Set material reflection type to <b>({0})</b>.", "Set the material reflection texture.", "MatSetRefleTexture");
	id++;

	AddStringParam("Filename", "The refraction texture filename", initial_string = "\"refract.png\"");
	AddAction(id, af_none, "Set refraction texture", "Babylon Material", "Set material refraction texture to <b>({0})</b>.", "Set the material refraction texture.", "MatSetRefraTexture");
	id++;

	AddNumberParam("Specular", "Specular value.", initial_string = "0.4");
	AddAction(id, af_none, "Set specular power", "Babylon Material", "Set material specular power to <b>({0})</b>.", "Set the material specular power.", "MatSetSpecuPower");
	id++;

	AddNumberParam("Scale bias", "Scale bias value.", initial_string = "0.4");
	AddAction(id, af_none, "Set parallax scale", "Babylon Material", "Set material parallax scale to <b>({0})</b>.", "Set the material parallax scale.", "MatSetParallScale");
	id++;

	AddNumberParam("Roughness", "Roughness value.", initial_string = "0.4");
	AddAction(id, af_none, "Set roughness", "Babylon Material", "Set material roughness to <b>({0})</b>.", "Set the material roughness.", "MatSetRoughness");
	id++;

	AddStringParam("Material", "The material to be assigned", initial_string = "\"Material\"");
	AddAction(id, af_none, "Set mesh material", "Babylon Material", "Assign material <b>({0})</b> to this mesh.", "Set mesh material.", "MatSetMesh");
	id++;
	AddComboParamOption("On collision");
	AddComboParamOption("On ready");
	AddComboParam("Event", "Choose an event", "On collision");
	AddAction(id, af_deprecated, "Register mesh event", "Babylon Events", "Register mesh event <b>{0}</b>.", "Register mesh event", "MeshRegisterEvent");
	id++;	
	//////////////////////////////////////////
	//////////////////////////////////////////
	/////////E X P R E S S I O N S////////////
	//////////////////////////////////////////
	//////////////////////////////////////////
	var id = 1800;
	AddExpression(id, ef_return_number, "Center X", "Babylon Matrix", "CenterX", "Returns the X center velocity of the mesh");
	id++;

	AddExpression(id, ef_return_number, "Center Y", "Babylon Matrix", "CenterY", "Returns the Y center velocity of the mesh");
	id++;

	AddExpression(id, ef_return_number, "Center Z", "Babylon Matrix", "CenterZ", "Returns the Z center velocity of the mesh");
	id++;

	AddExpression(id, ef_return_number, "Total vertices", "Babylon Matrix", "TotalVertices", "Returns the total number of verts");
	id++;

	AddStringParam("\"Camera001\"");
	AddExpression(id, ef_return_number, "Distance to camera", "Babylon Cameras", "DistanceToCam", "Returns the distance between this and the camera");
	id++;

	AddExpression(id, ef_return_number, "PositionX", "Babylon Matrix", "MeshPosX", "Returns the X position of the mesh");
	id++;

	AddExpression(id, ef_return_number, "PositionY", "Babylon Matrix", "MeshPosY", "Returns the Y position of the mesh");
	id++;

	AddExpression(id, ef_return_number, "PositionZ", "Babylon Matrix", "MeshPosZ", "Returns the Z position of the mesh");
	id++;

	AddExpression(id, ef_return_number, "AbsolutePositionX", "Babylon Matrix", "MeshAbsoPosX", "Returns the X absolute position of the mesh");
	id++;

	AddExpression(id, ef_return_number, "AbsolutePositionY", "Babylon Matrix", "MeshAbsoPosY", "Returns the Y absolute position of the mesh");
	id++;

	AddExpression(id, ef_return_number, "AbsolutePositionZ", "Babylon Matrix", "MeshAbsoPosZ", "Returns the Z absolute position of the mesh");
	id++;

	AddExpression(id, ef_return_number, "RotationX", "Babylon Matrix", "MeshRotX", "Returns the X rotation of the mesh");
	id++;

	AddExpression(id, ef_return_number, "RotationY", "Babylon Matrix", "MeshRotY", "Returns the Y rotation of the mesh");
	id++;

	AddExpression(id, ef_return_number, "RotationZ", "Babylon Matrix", "MeshRotZ", "Returns the Z rotation of the mesh");
	id++;

	AddExpression(id, ef_return_number, "ScalingX", "Babylon Matrix", "MeshScaleX", "Returns the X scaling of the mesh");
	id++;

	AddExpression(id, ef_return_number, "ScalingY", "Babylon Matrix", "MeshScaleY", "Returns the Y scaling of the mesh");
	id++;

	AddExpression(id, ef_return_number, "ScalingZ", "Babylon Matrix", "MeshScaleZ", "Returns the Z scaling of the mesh");
	id++;

	AddExpression(id, ef_return_number, "MeshPickedX", "Babylon Picking", "MeshPickedX", "Returns the X pick of the mesh");
	id++;

	AddExpression(id, ef_return_number, "MeshPickedY", "Babylon Picking", "MeshPickedY", "Returns the Y pick of the mesh");
	id++;

	AddStringParam("\"Anim001\"");
	AddExpression(id, ef_return_number, "MeshCurrentFrame", "Babylon Animations", "MeshCurrentFrame", "Returns the current animation frame of the mesh");

	id++;
	AddExpression(id, ef_return_string, "Mesh Name", "Babylon General", "Name", "Returns the mesh name");

	id++;
	AddExpression(id, ef_return_number, "Mesh Scene UID", "Babylon General", "SceneUID", "Returns the mesh scene UID");

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
