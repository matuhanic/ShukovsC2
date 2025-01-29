function GetPluginSettings()
{
	return {
		"name":			"Q3D\nMaster",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"Quazi3D",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"2.4",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Create and control 3D graphics, do not create more than one at a time.",
		"author":		"Quazi @ Davioware.com",
		"help url":		"http://threejs.org/",
		"category":		"Q3D",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
						| pf_position_aces		// compare/set/get x, y...
						| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
						| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
						| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
						| pf_effects			// allow WebGL shader effects to be added
				   //   | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
		,"dependency": "three.min.js;OBJLoader.js;Q3D.collisionSystem.js;Q3D.migrate.js;Q3D.commonACE.js;Q3D.qfxLoader.js;" // Q3D necessities
		+"WebGLDeferredRenderer.js;ShaderDeferred.js;CopyShader.js;FXAAShader.js;EffectComposer.js;RenderPass.js;ShaderPass.js;MaskPass.js;" // deferred renderer stuff
		+"Q3D.SkinnedMesh.js"

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

AddNumberParam("id", "Object id of the parent to loop through the children of (self.idScene will loop through the scene's children, i.e. all objects with scene as parent)", initial_string = "self.idScene")
AddComboParamOption("Recursive");
AddComboParamOption("Not Recursive");
AddComboParam("Mode", "'Recursive' loops through children of children, 'Not Recursive' only loops through children", "0");
AddComboParamOption("Pick Parent");
AddComboParamOption("Don't Pick Parent");
AddComboParam("Mode", "'Recursive' loops through children of children, 'Not Recursive' only loops through children", "1");			
AddCondition(0, cf_not_invertible|cf_looping, "For Each child", "   SYSTEM  ██████", "For Each child of ({0}). <b>{1}</b> & <b>{2}.</b>", "Loop through every child of a 3D object, except that parent object. the id of the current object being iterated over is given by self.idPicked", "ForEachObject");

AddNumberParam("id", "Object id of the object to test ray against (self.idScene with recursive will loop through all objects in the scene, i.e. all objects with scene as parent, the more objects you test the slower the test is)", initial_string = "self.idScene")
AddComboParamOption("Recursively");
AddComboParamOption("Alone");
AddComboParam("Mode", "'Recursive' tests picking ray against children this condition becomes a loop in that case, returning the intersections in order of occurrence, 'Alone' only tests a single object", "0");
AddStringParam("Camera", "Name of the camera to use for projection (''Default'' is the default camera)", initial_string = "\"Default\"")
AddNumberParam("X", "X coordinate to convert to projected ray (must be in normalized deviced coordinates (NDC) for the view area, that means x left to right from [-1,1] and y bottom to top from [-1,1])", initial_string = "0")
AddNumberParam("Y", "Y coordinate to convert to projected ray (must be in normalized deviced coordinates (NDC) for the view area, that means x left to right from [-1,1] and y bottom to top from [-1,1])", initial_string = "0")
AddNumberParam("Precision", "Precision of cast ray", initial_string = "1")
AddCondition(1, cf_not_invertible|cf_looping, "Project Coordinates", "   RAYCASTING  ██████", "Test object ({0}) {1} for intersections with projected NDC position ({3},{4}) using <b>camera</b> {2}.", "Give 2D coordinates and cast a ray from those coordinates using a camera, loop through all intersecting objects, giving info through expression vals", "ProjectCoords");

//AddStringParam("", "" , initial_string = "")		// a string
//AddCondition(1, cf_not_invertible|cf_looping, "mycnd", "SYSTEM", "{0} is positive", "Loop through every 3D object in the scene", "MyCondition");

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
AddStringParam("Message", "Enter a string to alert.");
AddAction(0, af_deprecated, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");

//AddStringParam("Scene", "Enter a scene name");
//AddStringParam("Camera", "Enter a camera name");
AddAction(1, af_none, "Render", "   SYSTEM  ██████", "<b>SYSTEM</b> RENDER", "Triggers render, only use this if you have [frame skip ratio = 0] and want to manually trigger rendering", "Render");

AddNumberParam("X resolution", "Value in pixels.", initial_string = "0")
AddNumberParam("Y resolution", "Value in pixels.", initial_string = "0")
AddAction(2, af_none, "Set resolution", "   SYSTEM  ██████", "<b>SYSTEM</b> Set resolution (x,y) to ({0},{1}).", "Sets the resolution of the rendering area.", "SetResXY");

AddAction(3, af_none, "Perspective mode", " CAMERAS  ██████", "<b>CAMERAS</b> Set camera to perspective mode.", "Switches the camera to perspective mode.", "SetCamPerspective");

AddAction(4, af_none, "Orthographic mode", " CAMERAS  ██████", "<b>CAMERAS</b> Set camera to orthographic mode.", "Switches the camera to orthographic mode.", "SetCamOrthographic");

AddNumberParam("Field of view", "Value in degrees, only used for perspective camera.", initial_string = "70")
AddNumberParam("Width", "Camera frustum width in x-axis units.", initial_string = "self.width")
AddNumberParam("Height", "Camera frustum height in y-axis units.", initial_string = "self.height")
AddNumberParam("Near plane", "Camera frustum near plane distance in z-axis units.", initial_string = "0.1")
AddNumberParam("Far plane", "Camera frustum far plane distance in z-axis units.", initial_string = "10000")
AddAction(5, af_none, "Frustum settings", " CAMERAS  ██████", "<b>CAMERAS</b> Set camera frustum to ({0},{1},{2},{3},{4}).", "Sets camera's frustum", "SetCamFrustum");

AddNumberParam("X", "X position of camera in x-axis units.", initial_string = "0")
AddNumberParam("Y", "Y position of camera in y-axis units.", initial_string = "0")
AddNumberParam("Z", "Z position of camera in z-axis units.", initial_string = "0")
AddAction(6, af_none, "Set camera position", " CAMERAS / POSITION", "<b>CAMERAS / POSITION</b> Set camera position to ({0},{1},{2}).", "Sets camera's (x,y,z) position", "SetCamPosition");

AddNumberParam("X", "X position for camera to look at in x-axis units.", initial_string = "0")
AddNumberParam("Y", "Y position for camera to look at in y-axis units.", initial_string = "0")
AddNumberParam("Z", "Z position for camera to look at in z-axis units.", initial_string = "0")
AddAction(7, af_none, "Look towards position", " CAMERAS / ROTATION", "<b>CAMERAS / ROTATION</b> Set camera to look towards ({0},{1},{2}).", "Make the camera look towards a point in space.", "SetCamLook");

AddNumberParam("X", "X component for camera up vector in x-axis units. (make sure (x,y,z) vector is unit length for proper behaviour)", initial_string = "0")
AddNumberParam("Y", "Y component for camera up vector in y-axis units. (make sure (x,y,z) vector is unit length for proper behaviour)", initial_string = "0")
AddNumberParam("Z", "Z component for camera up vector in z-axis units. (make sure (x,y,z) vector is unit length for proper behaviour)", initial_string = "1")
AddAction(8, af_none, "Set 'up' vector", " CAMERAS / ROTATION", "<b>CAMERAS / ROTATION</b> Set camera up vector to ({0},{1},{2}).", "Use to ensure 'Look towards position' knows what to use for up.", "SetCamUp");

AddStringParam("Name", "Name associated with this geometry", initial_string = "\"Cube\"")
AddNumberParam("Width", "Cube X size", initial_string = "1")
AddNumberParam("Height", "Cube Y size", initial_string = "1")
AddNumberParam("Depth", "Cube Z size", initial_string = "1")
AddNumberParam("Width segs", "Cube X segments (1 is fastest)", initial_string = "1")
AddNumberParam("Height segs", "Cube Y segments (1 is fastest)", initial_string = "1")
AddNumberParam("Depth segs", "Cube Z segments (1 is fastest)", initial_string = "1")
AddAction(9, af_none, "Cube", " GEOMETRY  ██████", "<b>█ GEOMETRY</b> Set geometry {0} to <b>cube</b> geometry with dimensions ({1},{2},{3}), segs ({4},{5},{6}).", "Sets a named value to store a cube shaped geometry with specified parameters.", "GeomCreateCube");

AddStringParam("Name", "Name of this object", initial_string = "\"Object\"")
AddStringParam("Geomety", "Geometry to use for this object", initial_string = "\"Geometry\"")
AddStringParam("Material", "Material to use for this object", initial_string = "\"Material\"")
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Clone Material", "This option controls how the material is applied, Cloning the material makes it unique to the object, while not doing it leaves it shared, which is faster but means uniforms (color, opacity, etc.) are shared too (good if they should be)", "0");
AddAction(10, af_none, "Create from geometry", " OBJECTS / CREATE", "<b>█ OBJECTS / CREATE</b> Create object:{0}, with geometry: {1}, and material: {2}. Clone material: <b>{3}</b>.", "Creates a 3D object with specified name, geometry, and material in the scene", "ObjCreate");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddNumberParam("X", "X position in x-axis units.", initial_string = "0")
AddNumberParam("Y", "Y position in y-axis units.", initial_string = "0")
AddNumberParam("Z", "Z position in z-axis units.", initial_string = "0")
AddAction(11, af_none, "Set object position", " OBJECTS / POSITION", "<b>OBJECTS / POSITION</b> Set object {0} position to ({1},{2},{3}).", "Set the position of an object.", "ObjSetPos");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddStringParam("Order", "Rotation order of the euler angles (written as any string ''XYZ'',''YXZ'' etc. which is a combination of X, Y and Z)", initial_string = "\"XYZ\"")
AddNumberParam("X", "X rotation in degrees.", initial_string = "0")
AddNumberParam("Y", "Y rotation in degrees.", initial_string = "0")
AddNumberParam("Z", "Z rotation in degrees.", initial_string = "0")
AddAction(12, af_none, "Rotation from euler angles", " OBJECTS / ROTATION", "<b>OBJECTS / ROTATION</b> Set object {0} rotation in {1} order to Euler angles ({2},{3},{4}).", "Set the rotation of an object using specified euler angles.", "ObjSetRot");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddNumberParam("X", "X position for object to look at in x-axis units.", initial_string = "0")
AddNumberParam("Y", "Y position for object to look at in y-axis units.", initial_string = "0")
AddNumberParam("Z", "Z position for object to look at in z-axis units.", initial_string = "0")
AddAction(13, af_none, "Look towards position", " OBJECTS / ROTATION", "<b>OBJECTS / ROTATION</b> Set object {0} to look towards ({1},{2},{3}).", "Make the object look towards a point in space.", "ObjLookAt");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddNumberParam("X", "X component of vector to move along.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to move along.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to move along.", initial_string = "0")
AddNumberParam("Distance", "Amount to move along given vector in units.", initial_string = "0")
AddAction(14, af_none, "Move along local vector", " OBJECTS / POSITION", "<b>OBJECTS / POSITION</b> Move object {0} along <b>local</b> vector ({1},{2},{3}) by ({4}) units.", "Move the object along a given local space vector by a given amount", "ObjMoveAxisLocal");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddNumberParam("X", "X component of vector to rotate around.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to rotate around.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to rotate around.", initial_string = "0")
AddNumberParam("Angle", "Amount to rotate around given vector in degrees.", initial_string = "0")
AddAction(15, af_none, "Rotate around local vector", " OBJECTS / ROTATION", "<b> OBJECTS / ROTATION</b> rotate object {0} around <b>local</b> vector ({1},{2},{3}) by ({4}) degrees.", "Rotate the object around a given local space vector by a given amount", "ObjRotAxisLocal");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddNumberParam("X", "X component of up vector.", initial_string = "0")
AddNumberParam("Y", "Y component of up vector.", initial_string = "0")
AddNumberParam("Z", "Z component of up vector.", initial_string = "1")
AddAction(16, af_none, "Set 'up' vector", " OBJECTS / ROTATION", "<b>OBJECTS / ROTATION</b> Set object {0} up vector to ({1},{2},{3}).", "Use to ensure 'Look towards position' knows what to use for up.", "ObjSetUpVec");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddNumberParam("X", "X component of vector to move along.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to move along.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to move along.", initial_string = "0")
AddNumberParam("Distance", "Amount to move along given vector in units.", initial_string = "0")
AddAction(17, af_deprecated, "Move along world vector", " OBJECTS / POSITION", "<b>OBJECTS / POSITION</b> Move object {0} along <b>world</b> vector ({1},{2},{3}) by ({4}) units.", "Move the object along a given world space vector by a given amount", "ObjMoveAxis");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddNumberParam("X", "X component of vector to rotate around.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to rotate around.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to rotate around.", initial_string = "0")
AddNumberParam("Angle", "Amount to rotate around given vector in degrees.", initial_string = "0")
AddAction(18, af_none, "Rotate around world vector", " OBJECTS / ROTATION", "<b>OBJECTS / ROTATION</b> rotate object {0} around <b>world</b> vector ({1},{2},{3}) by ({4}) degrees.", "Rotate the object around a given world space vector by a given amount", "ObjRotAxis");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddNumberParam("X", "X component of axis.", initial_string = "1")
AddNumberParam("Y", "Y component of axis.", initial_string = "0")
AddNumberParam("Z", "Z component of axis.", initial_string = "0")
AddNumberParam("Angle", "Angle to rotate around given axis in degrees.", initial_string = "0")
AddAction(19, af_none, "Rotation from axis-angle", " OBJECTS / ROTATION", "<b>OBJECTS / ROTATION</b> Set object {0} rotation from axis ({1},{2},{3}) and angle ({4}).", "Set the rotation of an object in axis-angle representation.", "ObjSetRotAxisAngle");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddNumberParam("X", "X scale (1 is unscaled, 2 is twice as big, etc.)", initial_string = "1")
AddNumberParam("Y", "Y scale (1 is unscaled, 2 is twice as big, etc.)", initial_string = "1")
AddNumberParam("Z", "Z scale (1 is unscaled, 2 is twice as big, etc.)", initial_string = "1")
AddAction(20, af_none, "Set object scale", " OBJECTS  ██████", "<b>OBJECTS</b> Set object {0} scale to ({1},{2},{3}).", "Sets the X,Y,Z scaling of the object.", "ObjSetScale");

///////// deprecated because not working when it should???

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddNumberParam("Depth", "uses this to determine the render order of multiple override depth sorting objects", initial_string = "0")
AddAction(21, af_deprecated, "Override depth sorting", "Objects", "<b>OBJECT</b> Set object {0} to overide depth sorting with depth value ({1}).", "makes this object render without using the Z buffer", "ObjSetOverrideDepth");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddAction(22, af_deprecated, "Use depth sorting", "Objects", "<b>OBJECT</b> Set object {0} to use depth sorting.", "makes this object render using the Z buffer (on by default, can only be off if override depth sorting was used).", "ObjSetUseDepth");

////////////////////////////////////////////////////////////////////////////////////////////

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddComboParamOption("Visible");
AddComboParamOption("Invisible");
AddComboParam("Visibility", "Set whether the object is visbile or invisible.", "0");
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Affect Children", "Choose whether this sets the property for solely the object, or for its children as well.", "0");
AddAction(23, af_none, "Set object visibility", " OBJECTS  ██████", "<b>OBJECTS</b> Set object {0} to <b>{1}</b>.", "sets if this object is visible/invisible.", "ObjSetVisible");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddComboParamOption("Don't cast shadows");
AddComboParamOption("Cast shadows");
AddComboParam("Shadows", "Set whether the object casts a shadow.", "1");
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Affect Children", "Choose whether this sets the property for solely the object, or for its children as well.", "0");
AddAction(24, af_none, "Set object shadow casting", " OBJECTS [ SHADOWS ]           Shared materials between objects share these states", "<b>OBJECTS [ SHADOWS ]</b> <b>{1}</b> for object {0}.", "sets if this object casts a shadow (slow) default is no.", "ObjSetCastShadow");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddComboParamOption("Don't receive shadows");
AddComboParamOption("Receive shadows");
AddComboParam("Shadows", "Set whether the object receives a shadow.", "1");
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Affect Children", "Choose whether this sets the property for solely the object, or for its children as well.", "0");
AddAction(25, af_none, "Set object shadow receiving", " OBJECTS [ SHADOWS ]           Shared materials between objects share these states", "<b>OBJECTS [ SHADOWS ]</b> <b>{1}</b> for object {0}.", "sets if this object receives a shadow (slow) default is no.", "ObjSetReceiveShadow");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddComboParamOption("Frustum culled");
AddComboParamOption("Not frustum culled");
AddComboParam("Culling", "Set whether the object is frustum culled.", "0");
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Affect Children", "Choose whether this sets the property for solely the object, or for its children as well.", "0");
AddAction(26, af_none, "Set object frustum culling", " OBJECTS  ██████", "<b>OBJECTS</b> <b>{1}</b> for object {0}.", "sets if this object is frustum culled when rendering, default is yes.", "ObjSetFrustumCulled");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddComboParamOption("Auto update");
AddComboParamOption("Don't auto update");
AddComboParam("Update", "Set whether the object's matrix is auto updated every frame.", "0");
AddAction(27, af_none, "Matrix update mode", " OBJECTS / MATRIX", "<b>OBJECTS / MATRIX</b> <b>{1}</b> matrix for object {0}.", "sets if this objects matrix is auto updated, which is slowdown in static objects that wont change", "ObjSetMatrixAutoUpdate");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddAction(28, af_none, "Update object matrix", " OBJECTS / MATRIX", "<b>OBJECTS / MATRIX</b> <b>Update matrix</b> of object {0} with rotation / scale / position.", "Updates the object matrix if 'Don't auto update' is enabled with rotation / scale / position settings.", "ObjSetMatrixUpdate");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddStringParam("Variable", "Name of the value", initial_string = "\"MyValue\"")
AddAnyTypeParam("Value", "String or number" , initial_string = "0")
AddAction(29, af_none, "Set object variable", " OBJECTS / VARIABLES", "<b>OBJECTS / VARIABLES</b> Set object {0} variable <i>{1}</i> to ({2})", "Set the value of a variable of an object (automatically creates non-existant values, case sensitive).", "ObjSetVariable");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
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
AddAction(30, af_none, "Set object matrix", " OBJECTS / MATRIX", "<b>OBJECTS / MATRIX</b> Set object {0} matrix to [{1},{2},{3},{4}] , [{5},{6},{7},{8}] , [{9},{10},{11},{12}] , [{13},{14},{15},{16}]", "Advanced feature to manually set up the matrix", "ObjSetMatrix");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddAction(31, af_deprecated, "Update world matrix", " OBJECTS / MATRIX", "<b>OBJECTS / MATRIX</b> <b>Update world matrix</b> of object {0}.", "Updates the object world matrix at end of frame if 'Don't auto update' is enabled (Advanced)", "ObjSetMatrixWorldUpdate");

AddStringParam("Name", "Name associated with this geometry", initial_string = "\"Circle\"")
AddNumberParam("Radius", "radius of circle", initial_string = "1")
AddNumberParam("Segments", "Number of segments (triangles)", initial_string = "8")
AddNumberParam("Start angle", "Start angle for first segment (degrees)", initial_string = "0")
AddNumberParam("Arc size", "The central angle, often called theta, of the circular sector (degrees)", initial_string = "360")
AddAction(32, af_none, "Circle", " GEOMETRY  ██████", "<b>█ GEOMETRY</b> Set geometry {0} to <b>circle</b> geometry with radius ({1}) and {2} segments, Start Angle ({3}), and Arc size ({4})", "Sets a named value to store a circle shaped geometry with specified parameters.", "GeomCreateCircle");

AddStringParam("Name", "Name associated with this geometry", initial_string = "\"Cylinder\"")
AddNumberParam("Top radius", "Radius of the cylinder at the top", initial_string = "1")
AddNumberParam("Bot radius", "Radius of the cylinder at the bottom", initial_string = "1")
AddNumberParam("Height", "Height of the cylinder.", initial_string = "1")
AddNumberParam("R segments", "Number of segmented faces around the circumference of the cylinder.", initial_string = "8")
AddNumberParam("H segments", "Number of rows of faces along the height of the cylinder", initial_string = "1")
AddComboParamOption("Closed ends");
AddComboParamOption("Open ends");
AddComboParam("Ends", "Set if the ends of the cylinder are open or capped", "0");
AddAction(33, af_none, "Cylinder", " GEOMETRY  ██████", "<b>█ GEOMETRY</b> Set geometry {0} to <b>cylinder</b> geometry with radii ({1}) & ({2}), height ({3}), ({4}) radius segments, ({5}) height segments, and <b>{6}</b>", "Sets a named value to store a cylinder shaped geometry with specified parameters.", "GeomCreateCylinder");

AddStringParam("Name", "Name associated with this geometry", initial_string = "\"Icosa\"")
AddNumberParam("Radius", "radius of icosahedron", initial_string = "1")
AddNumberParam("Detail", " Setting this to a value greater than 0 adds more vertices making it no longer an icosahedron.", initial_string = "0")
AddAction(34, af_none, "Icosahedron", " GEOMETRY  ██████", "<b>█ GEOMETRY</b> Set geometry {0} to <b>icosahedron</b> geometry with radius ({1}) and detail ({2}).", "Sets a named value to store a icosahedron shaped geometry with specified parameters.", "GeomCreateIcosa");

AddStringParam("Name", "Name associated with this geometry", initial_string = "\"Octa\"")
AddNumberParam("Radius", "radius of octahedron", initial_string = "1")
AddNumberParam("Detail", " Setting this to a value greater than 0 adds more vertices making it no longer an octahedron.", initial_string = "0")
AddAction(35, af_none, "Octahedron", " GEOMETRY  ██████", "<b>█ GEOMETRY</b> Set geometry {0} to <b>octahedron</b> geometry with radius ({1}) and detail ({2}).", "Sets a named value to store a octahedron shaped geometry with specified parameters.", "GeomCreateOcta");

AddStringParam("Name", "Name associated with this geometry", initial_string = "\"Plane\"")
AddNumberParam("Width", "Width of the plane", initial_string = "1")
AddNumberParam("Height", "Height of the plane", initial_string = "1")
AddNumberParam("Width segs", "Width segments", initial_string = "1")
AddNumberParam("Height segs", "Height segments", initial_string = "1")
AddAction(36, af_none, "Plane", " GEOMETRY  ██████", "<b>█ GEOMETRY</b> Set geometry {0} to <b>plane</b> geometry size ({1},{2}) and segments ({3},{4}).", "Sets a named value to store a plane shaped geometry with specified parameters.", "GeomCreatePlane");

AddStringParam("Name", "Name associated with this geometry", initial_string = "\"Ring\"")
AddNumberParam("Inner radius", "Radius of the hole", initial_string = "1")
AddNumberParam("Outer radius", "Radius of the outside", initial_string = "2")
AddNumberParam("θ Segments", "Number of segments (triangles)", initial_string = "8")
AddNumberParam("φ Segments", "Number of segments (triangles)", initial_string = "8")
AddNumberParam("Start angle", "Start angle for theta for first segment (degrees)", initial_string = "0")
AddNumberParam("Arc size", "The central angle, often called theta, of the circular sector (degrees)", initial_string = "360")
AddAction(37, af_none, "Ring", " GEOMETRY  ██████", "<b>█ GEOMETRY</b> Set geometry {0} to <b>ring</b> geometry with radii ({1}) & ({2}), radius segments ({3},{4}), start angle ({5}) and arc size ({6}).", "Sets a named value to store a ring shaped geometry with specified parameters.", "GeomCreateRing");

AddStringParam("Name", "Name associated with this geometry", initial_string = "\"Sphere\"")
AddNumberParam("Radius", "Radius of the hole", initial_string = "1")
AddNumberParam("Width segs", "Width segments", initial_string = "8")
AddNumberParam("Height segs", "Height segments", initial_string = "6")
AddNumberParam("φ Start angle", "Specify horizontal starting angle (degrees)", initial_string = "0")
AddNumberParam("φ Arc size", "Specify horizontal sweep angle size (degrees)", initial_string = "360")
AddNumberParam("θ Start angle", "Specify horizontal starting angle (degrees)", initial_string = "0")
AddNumberParam("θ Arc size", "Specify horizontal sweep angle size (degrees)", initial_string = "180")
AddAction(38, af_none, "Sphere", " GEOMETRY  ██████", "<b>█ GEOMETRY</b> Set geometry {0} to <b>sphere</b> geometry with radius ({1}), segments ({2},{3}), start angles ({4},{6}) and arc size ({5},{7}).", "Sets a named value to store a sphere shaped geometry with specified parameters.", "GeomCreateSphere");

AddStringParam("Name", "Name associated with this geometry", initial_string = "\"Tetra\"")
AddNumberParam("Radius", "radius of tetrahedron", initial_string = "1")
AddNumberParam("Detail", " Setting this to a value greater than 0 adds more vertices making it no longer an tetrahedron.", initial_string = "0")
AddAction(39, af_none, "Tetrahedron", " GEOMETRY  ██████", "<b>█ GEOMETRY</b> Set geometry {0} to <b>tetrahedron</b> geometry with radius ({1}) and detail ({2}).", "Sets a named value to store a tetrahedron shaped geometry with specified parameters.", "GeomCreateTetra");

AddStringParam("Name", "Name associated with this geometry", initial_string = "\"Text\"")
AddStringParam("Text", "Text to make 3D", initial_string = "\"You're Johnson!\"")
AddNumberParam("Size", " Float. Size of the text. ", initial_string = "1")
AddNumberParam("Height", " Thickness to extrude text. ", initial_string = "1")
AddNumberParam("Curve segs", " Float. Size of the text. ", initial_string = "10")
AddStringParam("Font", "Font to use (Must be loaded)", initial_string = "\"Arial\"")
AddComboParamOption("Normal");
AddComboParamOption("Italics");
AddComboParamOption("Bold");
AddComboParamOption("Bold and italics");
AddComboParam("Style", "Set font style", "0");
AddComboParamOption("Unbeveled");
AddComboParamOption("Beveled");
AddComboParam("Bevel", "Set bevel type", "0");
AddNumberParam("Bev Thickness", " How deep into text bevel goes", initial_string = "1")
AddNumberParam("Bevel size", " How far from text outline is bevel", initial_string = "1")
AddAction(40, af_deprecated, "Text", " GEOMETRY  ██████", "<b>█ GEOMETRY</b> Set geometry {0} to  <b>({7} {6}) text</b> geometry with string ({1}), font {5}, size ({2}), height ({3}), segs ({4}).", "Sets a named value to store a text shaped geometry with specified parameters.", "GeomCreateText");

AddStringParam("Name", "Name associated with this geometry", initial_string = "\"Torus\"")
AddNumberParam("Radius", "Radius of the torus", initial_string = "3")
AddNumberParam("Tube diam", "Diameter of the tube", initial_string = "1")
AddNumberParam("Radius segs", "Number of segments that make the large radius", initial_string = "8")
AddNumberParam("Tube segs", "Number of segments in tube circle", initial_string = "6")
AddNumberParam("Arc", "Central angle (degrees)", initial_string = "360")
AddAction(41, af_none, "Torus", " GEOMETRY  ██████", "<b>█ GEOMETRY</b> Set geometry {0} to <b>torus</b> geometry with radius ({1}), tube diameter ({2}), segments ({3},{4}) and arc size ({5}).", "Sets a named value to store a torus shaped geometry with specified parameters.", "GeomCreateTorus");

AddStringParam("Name", "Name associated with this geometry", initial_string = "\"Knot\"")
AddNumberParam("Radius", "Radius of the torus knot", initial_string = "3")
AddNumberParam("Tube diam", "Diameter of the tube", initial_string = "1")
AddNumberParam("Radius segs", "Number of segments that make the large radius", initial_string = "64")
AddNumberParam("Tube segs", "Number of segments in tube circle", initial_string = "8")
AddNumberParam("p", "Torus knot p value", initial_string = "2")
AddNumberParam("q", "Torus knot q value", initial_string = "3")
AddNumberParam("Height", "Torus knot height scale", initial_string = "1")
AddAction(42, af_none, "Torus knot", " GEOMETRY  ██████", "<b>█ GEOMETRY</b> Set geometry {0} to <b>torus knot</b> geometry with radius ({1}), tube diameter ({2}), segments ({3},{4}) and (p,q) ({5},{6}) and height scale ({7}).", "Sets a named value to store a torus knot shaped geometry with specified parameters.", "GeomCreateKnot");

AddStringParam("URL", "URL of  ''font.js'' to load", initial_string = "\"http://mrdoob.github.com/three.js/examples/fonts/helvetiker_regular.typeface.js\"")
AddAction(43, af_deprecated, "Include font.js", "Fonts", "Load font from URL <i>{0}</i>", "Needed for font geometry to work properly", "FontInclude");

AddNumberParam("id parent", "unique 3D object id of the parent (object to add child to)", initial_string = "self.idScene")
AddNumberParam("id child", "unique 3D object id of the child (object to add to parent and remove from current parent)", initial_string = "self.idLast")
AddAction(44, af_none, "Change object parent", " OBJECTS / GROUPS", "<b>OBJECTS / GROUPS</b> make object {1} child of object {0}.", "Changes the parent of an object, any transformations to the parent effect the child, the child has local position/rotation", "ObjChangeParent");

AddNumberParam("id", "unique 3D object id of the object to remove", initial_string = "self.idLast")
AddAction(45, af_none, "Destroy object", " OBJECTS  ██████", "<b>OBJECTS</b> <b>Destroy</b> object {0}.", "Deletes the object", "ObjDelete");

AddStringParam("Name", "Name associated with this light", initial_string = "\"AmbL\"")
AddNumberParam("Color", "Color of this light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddAction(46, af_deprecated, "Create amb. light", " LIGHTS / AMBIENT", "<b>█ LIGHTS / AMBIENT</b> Create <b>ambient</b> light object {0}, with color ({1}).", "Creates an ambient light with various settings, manipulated by object actions using its id", "AmbLightCreate");

AddStringParam("Name", "Name associated with this light", initial_string = "\"DirL\"")
AddNumberParam("Color", "Color of this light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddNumberParam("Intensity", "Intensity of this light", initial_string = "1")
AddNumberParam("Target X", "direction points at targets (X,Y,Z)", initial_string = "0")
AddNumberParam("Target Y", "direction points at targets (X,Y,Z)", initial_string = "0")
AddNumberParam("Target Z", "direction points at targets (X,Y,Z)", initial_string = "0")
AddComboParamOption("Don't cast shadows");
AddComboParamOption("Cast shadows");
AddComboParam("Shadow", "Choose whether this light casts shadows or not (difficult to make look right/slow)", initial_string = "0")
AddComboParamOption("Light+shadows");
AddComboParamOption("Only shadows");
AddComboParam("Shadow", "Choose whether this light shows only shadows or also contributes lighting", initial_string = "0")
AddNumberParam("Near", "The near clipping plane of the shadow camera for this light", initial_string = "50")
AddNumberParam("Far", "The far clipping plane of the shadow camera for this light", initial_string = "5000")
AddNumberParam("Left", "The left clipping plane of the shadow camera for this light", initial_string = "-500")
AddNumberParam("Right", "The far clipping plane of the shadow camera for this light", initial_string = "500")
AddNumberParam("Top", "The top clipping plane of the shadow camera for this light", initial_string = "500")
AddNumberParam("Bottom", "The bottom clipping plane of the shadow camera for this light", initial_string = "-500")
AddComboParamOption("Don't show");
AddComboParamOption("Show");
AddComboParam("Debug", "Choose whether to show or hide the debug frustum of the shadow camera", initial_string = "0")
AddNumberParam("Dark.", "The shadow darkness (from 0 to 1)", initial_string = "0.5")
AddNumberParam("Bias", "Shadow map bias", initial_string = "0")
AddNumberParam("M. width", "The shadow map width (pixels)", initial_string = "512")
AddNumberParam("M. height", "The shadow map height (pixels)", initial_string = "512")
AddAction(47, af_deprecated, "Create dir. light", " LIGHTS / DIRECTIONAL", "<b>█ LIGHTS / DIRECTIONAL</b> Create <b>directional</b> light object {0}, with color ({1}) and intensity ({2}).", "Creates a directional light with various settings", "DirLightCreate");

AddStringParam("Name", "Name associated with this light", initial_string = "\"HemL\"")
AddNumberParam("S. Color", "Sky color of this light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddNumberParam("G. Color", "Ground color of this light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddNumberParam("Intensity", "Intensity of this light", initial_string = "1")
AddComboParamOption("Don't show");
AddComboParamOption("Show");
AddComboParam("Debug", "Choose whether to show or hide the debug helper", initial_string = "0")
AddAction(48, af_deprecated, "Create hem. light", " LIGHTS / HEMISPHERE", "<b>█ LIGHTS / HEMISPHERE</b> Create <b>hemisphere</b> light object {0}, with sky color ({1}), ground color ({2}), and intensity ({3}).", "Creates a hemisphere light with various settings, manipulated by object actions using its id", "HemLightCreate");

AddStringParam("Name", "Name associated with this light", initial_string = "\"PointL\"")
AddNumberParam("Color", "Color of this light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddNumberParam("Intensity", "Intensity of this light", initial_string = "1")
AddNumberParam("Distance", "If non-zero, light will attenuate linearly from maximum intensity at light position down to zero at distance", initial_string = "0")
AddComboParamOption("Don't show");
AddComboParamOption("Show");
AddComboParam("Debug", "Choose whether to show or hide the debug helper", initial_string = "0")
AddAction(49, af_deprecated, "Create p. light", " LIGHTS / POINT", "<b>█ LIGHTS / POINT</b> Create <b>point</b> light object {0}, with color ({1}), intensity ({2}), and falloff distance ({3}).", "Creates a point light with various settings, manipulated by object actions using its id", "PLightCreate");

AddStringParam("Name", "Name associated with this light", initial_string = "\"SpotL\"")
AddNumberParam("Color", "Color of this light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddNumberParam("Intensity", "Intensity of this light", initial_string = "1")
AddNumberParam("Distance", "If non-zero, light will attenuate linearly from maximum intensity at light position down to zero at distance", initial_string = "0")
AddNumberParam("Angle", "Maximum extent of the spotlight, in degrees, from its direction. Should be no more than 180.", initial_string = "60")
AddNumberParam("Exponent", "Rapidity of the falloff of light from its target direction.", initial_string = "10")
AddNumberParam("Target X", "Spotlight focus points at targets (X,Y,Z)", initial_string = "0")
AddNumberParam("Target Y", "Spotlight focus points at targets (X,Y,Z)", initial_string = "0")
AddNumberParam("Target Z", "Spotlight focus points at targets (X,Y,Z)", initial_string = "0")
AddComboParamOption("Don't cast shadows");
AddComboParamOption("Cast shadows");
AddComboParam("Shadow", "Choose whether this light casts shadows or not (difficult to make look right/slow)", initial_string = "0")
AddComboParamOption("Light+shadows");
AddComboParamOption("Only shadows");
AddComboParam("Shadow", "Choose whether this light shows only shadows or also contributes lighting", initial_string = "0")
AddNumberParam("Near", "The near clipping plane of the shadow camera for this light", initial_string = "50")
AddNumberParam("Far", "The far clipping plane of the shadow camera for this light", initial_string = "5000")
AddNumberParam("FOV", "The FOV of the shadow camera for this light", initial_string = "50")
AddComboParamOption("Don't show");
AddComboParamOption("Show");
AddComboParam("Debug", "Choose whether to show or hide the debug frustum of the shadow camera", initial_string = "0")
AddNumberParam("Dark.", "The shadow darkness (from 0 to 1)", initial_string = "0.5")
AddNumberParam("Bias", "Shadow map bias", initial_string = "0")
AddNumberParam("M. width", "The shadow map width (pixels)", initial_string = "512")
AddNumberParam("M. height", "The shadow map height (pixels)", initial_string = "512")
AddAction(50, af_deprecated, "Create s. light", " LIGHTS /  SPOT", "<b>█ LIGHTS / SPOT</b> Create <b>spot</b> light object {0}, with color ({1}), intensity ({2}), falloff distance ({3}), angle ({4}), and exponent ({5}) etc.", "Creates a point light with various settings, manipulated by object actions using its id", "SLightCreate");

AddNumberParam("id", "unique 3D object id of the light to affect", initial_string = "self.idLast")
AddNumberParam("Color", "Color of this light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddAction(51, af_deprecated, "Set light color", " LIGHTS  ██████  [number limited by max lights property, set position/rotation like any object]", "<b>LIGHTS</b> Set light object {0} primary color to ({1}).", "All light types have a primary color which can be changed through this action using their object id.", "LightSetColor");

AddNumberParam("id", "unique 3D object id of the light to affect", initial_string = "self.idLast")
AddNumberParam("Intensity", "Intensity of this light", initial_string = "1")
AddAction(52, af_deprecated, "Set light intensity", " LIGHTS  ██████  [number limited by max lights property, set position/rotation like any object]", "<b>LIGHTS</b> Set light object {0} intensity to ({1}).", "Most light types have an intensity which can be changed through this action using their object id.", "LightSetIntensity");

AddNumberParam("id", "unique 3D object id of the light to affect", initial_string = "self.idLast")
AddNumberParam("Distance", "If non-zero, light will attenuate linearly from maximum intensity at light position down to zero at distance", initial_string = "0")
AddAction(53, af_deprecated, "Set light distance", " LIGHTS  ██████  [number limited by max lights property, set position/rotation like any object]", "<b>LIGHTS</b> Set light object {0} falloff distance to ({1}).", "Some light types have a falloff distance which can be changed through this action using their object id.", "LightSetDistance");

AddNumberParam("id", "unique 3D object id of the light to affect", initial_string = "self.idLast")
AddNumberParam("Target X", "Spotlight focus points at targets (X,Y,Z)", initial_string = "0")
AddNumberParam("Target Y", "Spotlight focus points at targets (X,Y,Z)", initial_string = "0")
AddNumberParam("Target Z", "Spotlight focus points at targets (X,Y,Z)", initial_string = "0")
AddAction(54, af_deprecated, "Set target", " LIGHTS  ██████  [number limited by max lights property, set position/rotation like any object]", "<b>LIGHTS</b> Set light object {0} target position to ({1},{2},{3}).", "Some light types have a target that they point towards which can be changed through this action using their object id.", "LightSetTarget");

AddNumberParam("id", "unique 3D object id of the light to affect", initial_string = "self.idLast")
AddComboParamOption("Don't cast shadows");
AddComboParamOption("Cast shadows");
AddComboParam("Shadow", "Choose whether this light casts shadows or not (difficult to make look right/slow, only works for spot and directional)", initial_string = "0")
AddAction(55, af_deprecated, "Set shadow on/off", " LIGHTS [ SHADOWS ]", "<b>LIGHTS [ SHADOWS ]</b> Set light object {0} to ({1}).", "Only works for spot/directional lights, doesn't work properly/at all if set after object has been initialized (first render)", "LightSetShadow");

AddNumberParam("id", "unique 3D object id of the light to affect", initial_string = "self.idLast")
AddComboParamOption("Light+shadows");
AddComboParamOption("Only shadows");
AddComboParam("Shadow", "Choose whether this light shows only shadows or also contributes lighting", initial_string = "0")
AddAction(56, af_deprecated, "Set 'shadow only'", " LIGHTS [ SHADOWS ]", "<b>LIGHTS [ SHADOWS ]</b> Set light object {0} to ({1}).", "Only works for spot/directional lights", "LightSetOnlyShadow");

AddNumberParam("id", "unique 3D object id of the light to affect", initial_string = "self.idLast")
AddNumberParam("Dark.", "The shadow darkness (from 0 to 1)", initial_string = "0.5")
AddAction(57, af_deprecated, "Shadow darkness", " LIGHTS [ SHADOWS ]", "<b>LIGHTS [ SHADOWS ]</b> Set light object {0} to have shadow darkness ({1}).", "Only works for spot/directional lights", "LightSetShadowDark");

AddNumberParam("id", "unique 3D object id of the light to affect", initial_string = "self.idLast")
AddNumberParam("Bias", "Shadow map bias", initial_string = "0")
AddAction(58, af_deprecated, "Shadow bias", " LIGHTS [ SHADOWS ]", "<b>LIGHTS [ SHADOWS ]</b> Set light object {0} to have shadow bias ({1}).", "Only works for spot/directional lights", "LightSetShadowBias");

AddNumberParam("id", "unique 3D object id of the light to affect", initial_string = "self.idLast")
AddNumberParam("M. width", "The shadow map width (pixels)", initial_string = "512")
AddNumberParam("M. height", "The shadow map height (pixels)", initial_string = "512")
AddAction(59, af_deprecated, "Shadow map size", " LIGHTS [ SHADOWS ]", "<b>LIGHTS [ SHADOWS ]</b> Set light object {0} to have shadow map size ({1},{2}).", "Only works for spot/directional lights", "LightSetShadowMapSize");

AddNumberParam("id", "unique 3D object id of the hemisphere light to affect", initial_string = "self.idLast")
AddNumberParam("S. Color", "Sky color of this light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddNumberParam("G. Color", "Ground color of this light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddNumberParam("Intensity", "Intensity of this light", initial_string = "1")
AddAction(60, af_deprecated, "Hemi. light settings", " LIGHTS / HEMISPHERE", "<b>LIGHTS / HEMISPHERE</b> Set light object {0} to have sky color ({1}), ground color ({2}), and intensity ({3}).", "Change settings of hemisphere lights", "HemLightSettings");

AddNumberParam("id", "unique 3D object id of the hemisphere light to affect", initial_string = "self.idLast")
AddNumberParam("Color", "Color of this light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddNumberParam("Intensity", "Intensity of this light", initial_string = "1")
AddNumberParam("Distance", "If non-zero, light will attenuate linearly from maximum intensity at light position down to zero at distance", initial_string = "0")
AddNumberParam("Angle", "Maximum extent of the spotlight, in degrees, from its direction. Should be no more than 180.", initial_string = "60")
AddNumberParam("Exponent", "Rapidity of the falloff of light from its target direction.", initial_string = "10")
AddAction(61, af_deprecated, "Spot light settings", " LIGHTS /  SPOT", "<b>LIGHT / SPOT</b> Set light object {0} to have color ({1}), intensity ({2}), falloff distance ({3}), angle ({4}), and exponent ({5}).", "Change main settings of spot lights", "SLightSettings");

AddStringParam("Name", "Name of this sprite", initial_string = "\"Sprite\"")
AddStringParam("Material", "Material to use for this sprite (Must be a 'sprite material')", initial_string = "\"Sprite Material\"")
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Clone Material", "This option controls how the material is applied, Cloning the material makes it unique to the object, while not doing it leaves it shared, which is faster but means uniforms (color, opacity, etc.) are shared too (good if they should be)", "0");
AddAction(62, af_deprecated, "Create sprite", " OBJECTS / SPRITES", "<b>█ OBJECTS / SPRITES</b> Create sprite {0}, with material: {1}. Clone material: <b>{2}</b>.", "Creates a sprite/billboard with specified name and sprite material in the scene", "SpriteCreate");

/////////////////////////////////////////////////////////////// MATERIALS INCOMPLETE


AddStringParam("Name", "Name of this Material", initial_string = "\"Basic\"")
AddNumberParam("Color", "Color of this material (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Wireframe", "Choose whether this material renders as wireframe.", initial_string = "0")
AddComboParamOption("Smooth");
AddComboParamOption("Flat");
AddComboParamOption("None");
AddComboParam("Shading", "Choose the type of shading for this material (will affect how env. map reflects/refracts).", initial_string = "0")
/*AddComboParamOption("None");
AddComboParamOption("Vertex");
AddComboParamOption("Face");
AddComboParam("Vertex color", "Choose the type of 'vertex coloring' for this material.", initial_string = "0")
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Fog", "Choose whether this material is affected by global fog settings", initial_string = "1")*/
AddStringParam("Diffuse Map", "Diffuse texture associated with this material, setting it to a false name sets it to nothing", initial_string = "\"Texture\"")
AddStringParam("Light Map", "Light map associated with this material (will only work if geometry has a second set of uv's), setting it to a false name sets it to nothing", initial_string = "\"Light Texture\"")
AddStringParam("Spec. Map", "Specular map associated with this material (modulates reflection using env. map), setting it to a false name sets it to nothing", initial_string = "\"Specular Texture\"")
AddStringParam("Enviro. Map", "Environment map associated with this material, (must be of a proper mapping mode) setting it to a false name sets it to nothing", initial_string = "\"Environment Texture\"")
AddComboParamOption("Multiply");
AddComboParamOption("Mix");
AddComboParamOption("Add");
AddComboParam("Combine", "Choose the combine mode for the surface color and environment map, if there is one", initial_string = "0")
AddNumberParam("Env. Amount", "Reflectivity / Refractivity of this material if an environment map is specified, a value from [0,1] indicating how much the material is opaque [0], or reflect/refract-ive [1]", initial_string = "0.25")
AddNumberParam("Refract. Ratio", "Refraction ration of the env.map if using cube refraction mapping", initial_string = "0.98")
/*AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Skinning", "Choose whether this material uses skinning.", initial_string = "0")
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Morph T.", "Choose whether this material uses morph targets.", initial_string = "0")*/
AddAction(63, af_none, "Create new Basic", " MATERIALS / MESH-BASIC", "<b>••• MATERIALS / MESH-BASIC</b> Create mesh basic material {0}.", "creates a new named basic material that can be applied to geometry when creating a 3D object", "MaterialsCreateMeshBasic");


////////////////////////////////////////

AddStringParam("File name", "Name of the .obj file to load.", initial_string = "\"MyObj.obj\"")
AddAction(64, af_none, "Load model", "  LOAD  ██████", "<b>LOAD</b> Load .obj or .js model file {0}.", "Loads a .obj / .js file that you have included in the project files, so that you can use it (this takes time)", "LoadFileObj");

AddStringParam("Name", "Name of this object", initial_string = "\"Object\"")
AddStringParam("File name", "Name of the model file to use (Must be loaded first)", initial_string = "\"MyObj.obj\"")
AddStringParam("Material", "Material to use for this object (use a blank name if you want to use the materials loaded by the JSON loader)", initial_string = "\"Material\"")
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Clone Material", "This option controls how the material is applied, Cloning the material makes it unique to the object, while not doing it leaves it shared, which is faster but means uniforms (color, opacity, etc.) are shared too (good if they should be)", "0");
AddAction(65, af_none, "Create from model", " OBJECTS / CREATE", "<b>█ OBJECTS / CREATE</b> Create object {0} using model file {1} and material {2}. Clone material: <b>{3}</b>.", "Creates an object using a previously loaded model (the model must be finished loading)", "CreateObjFromFilename");

AddStringParam("File name", "Name of the image file to load.", initial_string = "\"MyImg.png\"")
AddAction(66, af_none, "Load image", "  LOAD  ██████", "<b>LOAD</b> Load image file {0}.", "<b>LOAD / TEXTURES</b> Loads an image file that you have included in the project files, so that you can use it as a texture (this takes time)", "LoadFileImage");

AddStringParam("Name", "Name of this texture", initial_string = "\"Texture\"")
AddStringParam("File name", "Name of the image file to use (Must be loaded first)", initial_string = "\"MyImg.png\"")
AddAction(67, af_none, "Texture from image", " TEXTURES / CREATE", "<b>••• TEXTURES / CREATE</b> Create texture {0} using image file {1}", "Creates a texture using a previously loaded image (the image must be finished loaded)", "CreateTexFromFilename");

AddStringParam("Name", "Name of this texture", initial_string = "\"Texture\"")
AddStringParam("File +x", "Name of the image file to use (Must be loaded first)", initial_string = "\"MyImg.png\"")
AddStringParam("File -x", "Name of the image file to use (Must be loaded first)", initial_string = "\"MyImg.png\"")
AddStringParam("File +y", "Name of the image file to use (Must be loaded first)", initial_string = "\"MyImg.png\"")
AddStringParam("File -y", "Name of the image file to use (Must be loaded first)", initial_string = "\"MyImg.png\"")
AddStringParam("File +z", "Name of the image file to use (Must be loaded first)", initial_string = "\"MyImg.png\"")
AddStringParam("File -z", "Name of the image file to use (Must be loaded first)", initial_string = "\"MyImg.png\"")
AddComboParamOption("Cube reflection");
AddComboParamOption("Cube refraction");
AddComboParam("Mapping", "Choose the mapping mode for this texture (for reflection or refraction)", initial_string = "0")
AddAction(68, af_none, "Cube Map from images", " TEXTURES / CREATE", "<b>••• TEXTURES / CREATE</b> Create Cube Map {0} using image files {1},{2},{3},{4},{5},{6} and {7} mapping", "Creates a cube map for relection/refraction maps using previously loaded images (the image must be finished loaded)", "CreateCubeTexFromFilename");

AddStringParam("Name", "Name of this Material", initial_string = "\"Depth\"")
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Wireframe", "Choose whether this material renders as wireframe.", initial_string = "0")
AddAction(69, af_none, "Create new Depth", " MATERIALS / MESH-DEPTH", "<b>••• MATERIALS / MESH-DEPTH</b> Create mesh depth material {0}.", "creates a new named depth material that can be applied to geometry when creating a 3D object, uses near (white) and far plane (black)", "MaterialsCreateMeshDepth");

AddStringParam("Name", "Name of this Material", initial_string = "\"Normal\"")
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Wireframe", "Choose whether this material renders as wireframe.", initial_string = "0")
AddComboParamOption("Smooth");
AddComboParamOption("Flat");
AddComboParamOption("None");
AddComboParam("Shading", "Choose the type of shading for this material (will affect how env. map reflects/refracts).", initial_string = "0")
/*AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Morph T.", "Choose whether this material uses morph targets.", initial_string = "0")*/
AddAction(70, af_none, "Create new Normal", " MATERIALS / MESH-NORMAL", "<b>••• MATERIALS / MESH-NORMAL</b> Create mesh normal material {0}.", "creates a new named normal material that can be applied to geometry when creating a 3D object, color based on normal", "MaterialsCreateMeshNormal");

AddStringParam("Name", "Name of this Material", initial_string = "\"Lambert\"")
AddNumberParam("Color", "Color of this material (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddNumberParam("Ambient", "Ambient color of this material, which is multiplied by the color of ambient light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddNumberParam("Emissive", "Emmisive of this material, essentially the color without any lights (uses 'hex' color notation)", initial_string = "rgb(0,0,0)")
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Wireframe", "Choose whether this material renders as wireframe.", initial_string = "0")
AddComboParamOption("Smooth");
AddComboParamOption("Flat");
AddComboParamOption("None");
AddComboParam("Shading", "Choose the type of shading for this material (will affect how env. map reflects/refracts).", initial_string = "0")
/*AddComboParamOption("None");
AddComboParamOption("Vertex");
AddComboParamOption("Face");
AddComboParam("Vertex color", "Choose the type of 'vertex coloring' for this material.", initial_string = "0")
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Fog", "Choose whether this material is affected by global fog settings", initial_string = "1")*/
AddStringParam("Diffuse Map", "Diffuse texture associated with this material, setting it to a false name sets it to nothing", initial_string = "\"Texture\"")
AddStringParam("Light Map", "Light map associated with this material (will only work if geometry has a second set of uv's), setting it to a false name sets it to nothing", initial_string = "\"Light Texture\"");
AddStringParam("Spec. Map", "Specular map associated with this material setting it to a false name sets it to nothing", initial_string = "\"Specular Texture\"");
AddStringParam("Enviro. Map", "Environment map associated with this material, (must be of a proper mapping mode) setting it to a false name sets it to nothing", initial_string = "\"Environment Texture\"");
AddComboParamOption("Multiply");
AddComboParamOption("Mix");
AddComboParamOption("Add");
AddComboParam("Combine", "Choose the combine mode for the surface color and environment map, if there is one", initial_string = "0");
AddNumberParam("Env. Amount", "Reflectivity / Refractivity of this material if an environment map is specified, a value from [0,1] indicating how much the material is opaque [0], or reflect/refract-ive [1]", initial_string = "0.25");
AddNumberParam("Refract. Ratio", "Refraction ration of the env.map if using cube refraction mapping", initial_string = "0.98");
/*AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Skinning", "Choose whether this material uses skinning.", initial_string = "0");
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Morph T.", "Choose whether this material uses morph targets.", initial_string = "0");
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Morph normals", "Choose whether this material morphs normals", initial_string = "0");
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Wrap around", "Choose whether this material uses wrap around.", initial_string = "0");
AddNumberParam("Wrap RGB x", "Wrap rgb vector x", initial_string = "1");
AddNumberParam("Wrap RGB y", "Wrap rgb vector y", initial_string = "1");
AddNumberParam("Wrap RGB z", "Wrap rgb vector z", initial_string = "1");*/
AddAction(71, af_none, "Create new Lambert", " MATERIALS / MESH-LAMBERT", "<b>••• MATERIALS / MESH-LAMBERT</b> Create mesh lambert material {0}.", "creates a new named lambert material that can be applied to geometry when creating a 3D object", "MaterialsCreateMeshLambert");

AddStringParam("Name", "Name of this Material", initial_string = "\"Phong\"")
AddNumberParam("Color", "Color of this material (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddNumberParam("Ambient", "Ambient color of this material, which is multiplied by the color of ambient light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddNumberParam("Emissive", "Emmisive of this material, essentially the color without any lights (uses 'hex' color notation)", initial_string = "rgb(0,0,0)")
AddNumberParam("Specular", "Specular of this material, how ''shiny'' it is and the color of that shiny (uses 'hex' color notation)", initial_string = "rgb(128,128,128)")
AddNumberParam("Shininess", "How shiny the specular highlight is.", initial_string = "30")
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Wireframe", "Choose whether this material renders as wireframe.", initial_string = "0")
AddComboParamOption("Smooth");
AddComboParamOption("Flat");
AddComboParamOption("None");
AddComboParam("Shading", "Choose the type of shading for this material (will affect how env. map reflects/refracts).", initial_string = "0")
/*AddComboParamOption("None");
AddComboParamOption("Vertex");
AddComboParamOption("Face");
AddComboParam("Vertex color", "Choose the type of 'vertex coloring' for this material.", initial_string = "0")
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Fog", "Choose whether this material is affected by global fog settings", initial_string = "1")*/
AddStringParam("Diffuse Map", "Diffuse texture associated with this material, setting it to a false name sets it to nothing", initial_string = "\"Texture\"")
AddStringParam("Light Map", "Light map associated with this material (will only work if geometry has a second set of uv's), setting it to a false name sets it to nothing", initial_string = "\"Light Texture\"");
AddStringParam("Spec. Map", "Specular map associated with this material setting it to a false name sets it to nothing", initial_string = "\"Specular Texture\"");
AddStringParam("Enviro. Map", "Environment map associated with this material, (must be of a proper mapping mode) setting it to a false name sets it to nothing", initial_string = "\"Environment Texture\"");
AddComboParamOption("Multiply");
AddComboParamOption("Mix");
AddComboParamOption("Add");
AddComboParam("Combine", "Choose the combine mode for the surface color and environment map, if there is one", initial_string = "0");
AddNumberParam("Env. Amount", "Reflectivity / Refractivity of this material if an environment map is specified, a value from [0,1] indicating how much the material is opaque [0], or reflect/refract-ive [1]", initial_string = "0.25");
AddNumberParam("Refract. Ratio", "Refraction ration of the env.map if using cube refraction mapping", initial_string = "0.98");
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Metal", "Treats the lighting differently, like metal when set to yes.", initial_string = "0")
/*AddStringParam("Bump Map", "Bump map associated with this material, setting it to a false name sets it to nothing", initial_string = "\"Bump Texture\"");
AddNumberParam("Bump scale", "Scaling of the bumb map", initial_string = "1")
AddStringParam("Normal Map", "Normal map associated with this material, setting it to a false name sets it to nothing", initial_string = "\"Normal Texture\"");
AddNumberParam("Normal scale X", "X scaling of the normal map", initial_string = "1")
AddNumberParam("Normal scale Y", "Y scaling of the normal map", initial_string = "1")*/
/*AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Skinning", "Choose whether this material uses skinning.", initial_string = "0");
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Morph T.", "Choose whether this material uses morph targets.", initial_string = "0");
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Morph normals", "Choose whether this material morphs normals", initial_string = "0");
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Wrap around", "Choose whether this material uses wrap around.", initial_string = "0");
AddNumberParam("Wrap RGB x", "Wrap rgb vector x", initial_string = "1");
AddNumberParam("Wrap RGB y", "Wrap rgb vector y", initial_string = "1");
AddNumberParam("Wrap RGB z", "Wrap rgb vector z", initial_string = "1");*/
AddAction(72, af_none, "Create new Phong", " MATERIALS / MESH-PHONG", "<b>••• MATERIALS / MESH-PHONG</b> Create mesh phong material {0}.", "creates a new named phong material that can be applied to geometry when creating a 3D object", "MaterialsCreateMeshPhong");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddStringParam("Normal Map", "Normal map associated with this material, setting it to a false name sets it to nothing", initial_string = "\"Normal Texture\"");
AddAction(73, af_none, "Set Normal Map", " MATERIALS / MESH-PHONG", "<b>MATERIALS / MESH-PHONG</b> Set phong material {0} normal map to {1}", "Set the normal map of a phong material", "MaterialsSetMeshPhongNormalMap");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddNumberParam("Normal scale X", "X scaling of the normal map", initial_string = "1")
AddNumberParam("Normal scale Y", "Y scaling of the normal map", initial_string = "1")
AddAction(74, af_none, "Set Normal Scale", " MATERIALS / MESH-PHONG", "<b>MATERIALS / MESH-PHONG</b> Set phong material {0} normal scale to ({1},{2})", "Set the normal map scaling (x,y) of a phong material", "MaterialsSetMeshPhongNormalMapScale");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddStringParam("Bump Map", "Bump map associated with this material, setting it to a false name sets it to nothing", initial_string = "\"Bump Texture\"");
AddAction(75, af_none, "Set Bump Map", " MATERIALS / MESH-PHONG", "<b>MATERIALS / MESH-PHONG</b> Set phong material {0} bump map to {1}", "Set the bump map of a phong material", "MaterialsSetMeshPhongBumpMap");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddNumberParam("Bump scale", "Scaling of the bumb map", initial_string = "1")
AddAction(76, af_none, "Set Bump Scale", " MATERIALS / MESH-PHONG", "<b>MATERIALS / MESH-PHONG</b> Set phong material {0} bump scale to ({1})", "Set the bump map scaling of a phong material", "MaterialsSetMeshPhongBumpMapScale");


AddComboParamOption("None");
AddComboParamOption("Regular");
AddComboParamOption("Exponential");
AddComboParam("Fog type", "Set fog type", "0");
AddNumberParam("Color", "Color of the fog (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddNumberParam("Near", "Value that regular fog type will begin at. (does nothing for exponential fog)", initial_string = "1")
AddNumberParam("Far", "Value that regular fog type will end at (where nothing will be seen anymore, does nothing for exponential fog)", initial_string = "1000")
AddNumberParam("Density", "Value that controls the density of exponential fog (does nothing for regular fog)", initial_string = "0.00025")
AddAction(77, af_none, "Set fog", "   SYSTEM / SCENE", "<b>SYSTEM / SCENE</b> Set fog to type {0} with color ({1}).", "Set the properties of the scenes fog (or lack of), Changing fog type at runtime is slow, since all materials are rebuilt", "SetFog");

AddNumberParam("Color", "Color of the background", initial_string = "rgb(0,0,0)")
AddNumberParam("Opacity", "Opacity of the background ( value from 0 to 1 )", initial_string = "1")
AddAction(78, af_none, "Set background color", "   SYSTEM / SCENE", "<b>SYSTEM / SCENE</b> Set background color to ({0}) with opacity ({1}).", "Sets the color of the background.", "SetClearColor");

AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Antialias", "Choose whether the renderer uses antialiasing or not", initial_string = "0")
AddAction(79, af_deprecated, "Set Antialias", "   SYSTEM  ██████", "<b>SYSTEM</b> set antialias to {0}.", "Sets whether the renderer uses anti-aliasing or not", "SetAntialias");

AddComboParamOption("Basic");
AddComboParamOption("PCF");
AddComboParamOption("PCF Soft");
AddComboParam("Type", "Define the type of shadow map used", "1");
/*AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Cascade", "Choose whether the shadow map uses cascaded shadow mapping or not", initial_string = "0")*/
AddAction(80, af_none, "Set shadow type", "   SYSTEM  ██████", "<b>SYSTEM</b> Set type to {0}." /* and {1} cascaded shadow maps .*/, "Sets the type of the shadows, you can only change this before the first render", "SetShadowType");

AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Autoupdate", "Choose whether the renderer auto updates shadows or not", initial_string = "1")
AddAction(81, af_none, "AutoUpdate shadows", "   SYSTEM  ██████", "<b>SYSTEM</b> set autoupdate shadows to {0}.", "Sets whether the renderer autoupdates shadows or not (may cause errors if called as shadow maps are being initialized)", "SetAutoupdateShadows");

AddAction(82, af_none, "Update shadows", "   SYSTEM  ██████", "<b>SYSTEM</b> Update shadow map", "Update shadow map if auto update isn't set to yes", "SetUpdateShadows");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Transparency", "Choose whether this material has transparency on/off.", initial_string = "0");
AddNumberParam("Opacity", "Opacity of the material if transparency is on ( value from 0 to 1 )", initial_string = "1")
AddAction(83, af_none, "Set Opacity", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} opacity to ({2}) with transparency {1}", "Set the opacity of a material (Transparency must be enabled first)", "MaterialsSetOpacity"); ////////////////////// LAST THING WORKED ON

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
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
AddAction(84, af_none, "Blending", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} blending mode to {1}", "Set the blending mode of the material, Transparency must be enabled or no blending occurs", "MaterialsSetBlending");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Depth Test", "Choose whether this material has depth testing on/off when being rendered", initial_string = "1");
AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Depth Write", "Choose whether this material has any effect on the depth buffer", initial_string = "1");
AddAction(85, af_none, "Depth settings", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} depth testing {1} and depth writing {2}", "Set the the depth testing and depth writing properties of the material", "MaterialsDepthSettings");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Polygon offset", "Choose whether this material has polygon offset enabled", initial_string = "0");
AddNumberParam("Offset factor", "If polygon offset is enabled, the offset factor controlling it", initial_string = "0")
AddNumberParam("Offset units", "If polygon offset is enabled, the offset units controlling it", initial_string = "0")
AddAction(86, af_none, "Polygon offset", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} polygon offset {1} with factor {2} and units {3}", "Set the polygon offset of a material, helps prevent z-fighting if its a problem", "MaterialsPolygonOffset");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddNumberParam("Alpha", "Value to alpha test against", initial_string = "0")
AddAction(87, af_none, "Set alpha test", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} alpha test value to {1}", "Set the alpha test value for a material", "MaterialsAlphaTest");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Overdraw", "Choose whether this material draws polygons slightly bigger", initial_string = "0");
AddAction(88, af_none, "Set overdraw", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} overdraw {1}", "Control whether a material draws polygons slightly bigger to fix gaps", "MaterialsOverdraw");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("Invisible");
AddComboParamOption("Visible");
AddComboParam("Visible", "Choose whether this material is visible or invisible", initial_string = "1");
AddAction(89, af_none, "Set visible", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} to {1}", "Control whether a material is visible or not", "MaterialsVisible");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("Front");
AddComboParamOption("Back");
AddComboParamOption("Front & Back");
AddComboParam("Side", "Choose which side of geometry this material renders (based on normals)", initial_string = "0");
AddAction(90, af_none, "Set draw side", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} draw side to {1}", "Control which side of the geometry a material renders", "MaterialsDrawSide");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"");
AddAction(91, af_none, "Update material", " MATERIALS  ██████", "<b>MATERIALS</b> Update material {0}", "Flag a material for an update", "MaterialsUpdate");

AddStringParam("Name", "Name of the new material", initial_string = "\"Material Clone\"")
AddStringParam("Source", "Material to clone", initial_string = "\"Original Material\"")
AddAction(92, af_deprecated, "Clone material", " MATERIALS  ██████", "<b>••• MATERIALS</b> Make material {0} a clone of material {1}", "Make a copy from an existing material", "MaterialsClone");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddNumberParam("Color", "Color of this material (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddAction(93, af_none, "Set color diffuse", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} color to {1}", "Set the color value of a material, if it has the property", "MaterialsSetColor");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Wireframe", "Choose whether this material renders as wireframe.", initial_string = "0")
AddAction(94, af_none, "Set wireframe", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} wireframe to {1}", "Set whether the material is wireframe or not, if it has the property", "MaterialsSetWireframe");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("Smooth");
AddComboParamOption("Flat");
AddComboParamOption("None");
AddComboParam("Shading", "Choose the type of shading for this material (will affect how env. map reflects/refracts).", initial_string = "0")    // Don't know why this doesn't work
AddAction(95, af_none, "Set shading", " MATERIALS [ ADVANCED ]       Changing this in certain ways wont work, due to WebGL limitations", "<b>MATERIALS [ ADVANCED ]</b> Set material {0} shading to {1}", "Set the type of shading the material uses, if it has the property", "MaterialsSetShading");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("None");
AddComboParamOption("Vertex");
AddComboParamOption("Face");
AddComboParam("Vertex color", "Choose the type of 'vertex coloring' for this material.", initial_string = "0")
AddAction(96, af_deprecated, "Set vertex colors", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} to set vertex colors using {1}", "Set the type of vertex coloring the material uses, if it has the property", "MaterialsSetVertexColors");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Fog", "Choose whether this material is affected by global fog settings", initial_string = "1")
AddAction(97, af_none, "Set fog", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} fog effects {1}", "Set whether the material is affected by global fog settings, if it has the property", "MaterialsSetFog");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("Diffuse map");
AddComboParamOption("Specular map");
AddComboParamOption("Environment map");
AddComboParamOption("Light map");
AddComboParam("Map", "Choose which map to set (Env maps need a cube texture, light maps need different set of UV's)", initial_string = "0")
AddStringParam("Texture", "Texture to use for above map, setting it to a false name sets it to nothing/null", initial_string = "\"Texture\"")
AddAction(98, af_none, "Set maps", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} {1} to {2}", "Set the various texture maps of a material, if it has the ability to use them", "MaterialsSetMaps");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("Multiply");
AddComboParamOption("Mix");
AddComboParamOption("Add");
AddComboParam("Combine", "Choose the combine mode for the surface color and environment map, if there is one", initial_string = "0");
AddNumberParam("Env. Amount", "Reflectivity / Refractivity of this material if an environment map is specified, a value from [0,1] indicating how much the material is opaque [0], or reflect/refract-ive [1]", initial_string = "0.25");
AddNumberParam("Refract. Ratio", "Refraction ration of the env.map if using cube refraction mapping", initial_string = "0.98");
AddAction(99, af_none, "Env. settings", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} combine mode to {1}, with relectivity/refractivity {2} and refraction ratio {3}", "Set the various settings for environment map effects, if it has the properties", "MaterialsEnvSettings");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddNumberParam("Ambient", "Ambient color of this material, which is multiplied by the color of ambient light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddAction(100, af_none, "Set color ambient", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} ambient color to {1}", "Set the ambient color value of a material, if it has the property", "MaterialsSetAmbient");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddNumberParam("Emissive", "Emmisive of this material, essentially the color without any lights (uses 'hex' color notation)", initial_string = "rgb(0,0,0)")
AddAction(101, af_none, "Set color emissive", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} emissive color to {1}", "Set the emissive color value of a material, if it has the property", "MaterialsSetEmissive");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddNumberParam("Specular", "Specular of this material, how ''shiny'' it is and the color of that shiny (uses 'hex' color notation)", initial_string = "rgb(128,128,128)")
AddAction(102, af_none, "Set color specular", " MATERIALS / MESH-PHONG", "<b>MATERIALS / MESH-PHONG</b> Set phong material {0} specular color to {1}", "Set the specular color value of a phong material", "MaterialsSetSpecular");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddNumberParam("Shininess", "How shiny the specular highlight is.", initial_string = "30")
AddAction(103, af_none, "Set shininess", " MATERIALS / MESH-PHONG", "<b>MATERIALS / MESH-PHONG</b> Set phong material {0} shininess {1}", "Set the shininess value of a phong material", "MaterialsSetShininess");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Metal", "Treats the lighting differently, like metal when set to yes.", initial_string = "0")
AddAction(104, af_none, "Set metal", " MATERIALS / MESH-PHONG", "<b>MATERIALS / MESH-PHONG</b> Set phong material {0} metal to {1}", "Set the metal mode of a phong material", "MaterialsSetMetal");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Skinning", "Choose whether this material uses skinning.", initial_string = "0");
AddAction(105, af_deprecated, "Use skinning?", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} use skinning to {1}", "Set whether the material uses skinning or not, if it has the property", "MaterialsSetSkinning");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Morph T.", "Choose whether this material uses morph targets.", initial_string = "0");
AddAction(106, af_deprecated, "Use morph targets?", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} use morph targets to {1}", "Set whether the material uses morph targets or not, if it has the property", "MaterialsSetMorphTargets");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Morph normals", "Choose whether this material morphs normals", initial_string = "0");
AddAction(107, af_deprecated, "Use morph normals?", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} use morph normals to {1}", "Set whether the material uses morph normals or not, if it has the property", "MaterialsSetMorphNormals");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Wrap around", "Choose whether this material uses wrap around.", initial_string = "0");
AddAction(108, af_deprecated, "Use wrap around?", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} wrap around to {1}", "Set whether the material uses wrap around or not, if it has the property", "MaterialsSetWrapAround");

AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddNumberParam("Wrap R", "Wrap R", initial_string = "1");
AddNumberParam("Wrap G", "Wrap G", initial_string = "1");
AddNumberParam("Wrap B", "Wrap B", initial_string = "1");
AddAction(109, af_deprecated, "Wrap RGB settings", " MATERIALS  ██████", "<b>MATERIALS</b> Set material {0} wrap RGB to ({1},{2},{3})", "Set the wrap values for RGB, if it has the property", "MaterialsSetWrapRGB");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddStringParam("Name", "Name of the Material", initial_string = "\"Material\"")
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Affect Children", "Choose whether this sets the material for solely the object, or for its children as well.", "0");
AddAction(110, af_none, "Set object material", " OBJECTS / MATERIALS", "<b>OBJECTS / MATERIALS</b> Set object ({0}) to have material {1} (Affect Children {2}).", "Set the material of an object, this feature is limited in that some properties like presence of a texture etc. cannot be changed dynamically", "ObjSetMaterial");

AddStringParam("Name", "Name of the Material to use for editing", initial_string = "\"Material\"")
AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddAction(111, af_none, "Reference object material", " MATERIALS [ ADVANCED ]         If you don't know EXACTLY what this does, don't use it.", "<b>MATERIALS [ ADVANCED ]</b> Reference the material of object ({1}) using name {0}.", "Edit the material applied to an object using a named material which references it", "MaterialsObjReference");

AddStringParam("Name", "Name of the texture to affect", initial_string = "\"Texture\"")
AddStringParam("Image", "Name of the image file which has been loaded", initial_string = "\"Image.png\"")
AddAction(112, af_none, "Set image", " TEXTURES  ██████", "<b>TEXTURES</b> Set texture {0} image to {1}.", "Set the image of a named texture (Image must be loaded first, texture must exist)", "TexturesSetImage");

AddStringParam("Name", "Name of the texture to affect", initial_string = "\"Texture\"")
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
AddAction(113, af_none, "Set ST wrap", " TEXTURES  ██████", "<b>TEXTURES</b> Set texture {0} wrap S to ({1}) and wrap T to ({2}).", "Set the ST wrap properties of texture (ST = UV directions)", "TexturesSetWrap");

AddStringParam("Name", "Name of the texture to affect", initial_string = "\"Texture\"")
AddNumberParam("Repeat U", "How many times the texture repeats in the U direction", initial_string = "1");
AddNumberParam("Repeat V", "How many times the texture repeats in the V direction", initial_string = "1");
AddAction(114, af_none, "Set UV repeat", " TEXTURES  ██████", "<b>TEXTURES</b> Set texture {0} UV repeat to ({1},{2}).", "Set the UV repeat property of texture", "TexturesSetRepeat");

AddStringParam("Name", "Name of the texture to affect", initial_string = "\"Texture\"")
AddNumberParam("Offset U", "Amount a single repetition of the texture is offset from the beginning (0 is none, 1 is by a complete tile) in the U direction", initial_string = "0");
AddNumberParam("Offset V", "Amount a single repetition of the texture is offset from the beginning (0 is none, 1 is by a complete tile) in the V direction", initial_string = "0");
AddAction(115, af_none, "Set UV offset", " TEXTURES  ██████", "<b>TEXTURES</b> Set texture {0} UV offset to ({1},{2}).", "Set the UV offset property of texture", "TexturesSetOffset");

AddStringParam("Name", "Name of the texture to affect", initial_string = "\"Texture\"")
AddComboParamOption("On");
AddComboParamOption("Off");
AddComboParam("Flip Y", "Choose whether this texture is flipped in the Y direction.", "0");
AddAction(116, af_none, "Set Flip Y", " TEXTURES  ██████", "<b>TEXTURES</b> Set texture {0} flip Y {1}.", "Set whether the image of this texture is flipped in the Y direction", "TexturesSetFlipY");

AddStringParam("Name", "Name of the texture to affect", initial_string = "\"Texture\"")
AddComboParamOption("On");
AddComboParamOption("Off");
AddComboParam("Mipmaps", "Choose whether this texture generates mipmaps.", "0");
AddAction(117, af_none, "Generate mipmaps?", " TEXTURES  ██████", "<b>TEXTURES</b> Set texture {0} generate mipmaps {1}.", "Set whether this texture generates associated mipmaps", "TexturesSetGenerateMipMaps");

AddStringParam("Name", "Name of the texture to affect", initial_string = "\"Texture\"")
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
AddAction(118, af_none, "Set Filtering", " TEXTURES  ██████", "<b>TEXTURES</b> Set texture {0} mag filter to {1}, min filter to {2}", "Set the texture minification and magnification filtering modes", "TexturesSetFiltering");

AddStringParam("Name", "Name of the texture to affect", initial_string = "\"Texture\"")
AddNumberParam("Anisotropy", "Anisotropy value, higher values give less blurryness than just a mipmap alone, but cost more texture samples. power of 2 value recommended", initial_string = "1");
AddAction(119, af_none, "Set Anisotropy", " TEXTURES  ██████", "<b>TEXTURES</b> Set texture {0} Anisotropy to {1}", "Set the textures anisotropy", "TexturesSetAnisotropy");

AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Shadow Maps", "Choose whether the renderer uses shadow maps or not", initial_string = "0")
AddAction(120, af_none, "Shadow Maps on/off", "   SYSTEM  ██████", "<b>SYSTEM</b> Turn {0} shadow maps.", "Sets whether the renderer uses shadow maps or not", "SetShadowMaps");

AddStringParam("Name", "Name of this object", initial_string = "\"Arrow Helper\"")
AddNumberParam("Length", "Length of arrow", initial_string = "10");
AddNumberParam("Color", "Color of arrow", initial_string = "rgb(255,0,255)");
AddNumberParam("Head Length", "Length of arrowhead", initial_string = "5");
AddNumberParam("Head Width", "Width of arrowhead", initial_string = "5");
AddAction(121, af_deprecated, "Create arrow helper", " OBJECTS [ HELPERS ]", "<b>█ OBJECTS [ HELPERS ]</b> Create <b>arrow</b> helper object {0}.", "Creates a 3D helper object.", "ObjHelperCreateArrow");

AddStringParam("Name", "Name of this object", initial_string = "\"Axis Helper\"")
AddNumberParam("Size", "Length of the helper legs along the xyz axis", initial_string = "1");
AddAction(122, af_none, "Create axis helper", " OBJECTS [ HELPERS ]", "<b>OBJECTS [ HELPERS ]</b> Create <b>axis</b> helper object {0}.", "Creates a 3D helper object.", "ObjHelperCreateAxis");

AddStringParam("Name", "Name of this object", initial_string = "\"Grid Helper\"")
AddNumberParam("Size", "height and width of on half of the square grid plane", initial_string = "10");
AddNumberParam("Step", "distance between adjacent grid lines", initial_string = "1");
AddNumberParam("Color 1", "Color of grid center lines", initial_string = "rgb(128,128,128)");
AddNumberParam("Color 2", "Color of grid", initial_string = "rgb(255,255,255)");
AddAction(123, af_none, "Create grid helper", " OBJECTS [ HELPERS ]", "<b>█ OBJECTS [ HELPERS ]</b> Create <b>grid</b> helper object {0}.", "Creates a 3D helper object.", "ObjHelperCreateGrid");

AddStringParam("Name", "Name of this object", initial_string = "\"Box Helper\"")
AddNumberParam("id", "unique 3D object id of the object to place bounding box around (see expressions)", initial_string = "self.idLast")
AddNumberParam("Color", "Color of box", initial_string = "rgb(255,255,255)");
AddAction(124, af_none, "Create b.box helper", " OBJECTS [ HELPERS ]", "<b>█ OBJECTS [ HELPERS ]</b> Create <b>bounding box</b> helper object {0} around object id ({1}).", "Creates a 3D helper object.", "ObjHelperCreateBox");

AddNumberParam("id", "unique 3D object id of the bounding box", initial_string = "self.idLast")
AddAction(125, af_none, "Update b.box helper", " OBJECTS [ HELPERS ]", "<b>OBJECTS [ HELPERS ]</b> Update <b>bounding box</b> helper with object id ({0}).", "Updates the bounding box of a bounding box 3D helper object.", "ObjHelperUpdateBox");

AddStringParam("Name", "Name of this Sprite Material", initial_string = "\"Sprite Material\"")
AddStringParam("Texture", "Texture to use for material", initial_string = "\"Texture\"")
/*AddNumberParam("U Scale", "Scaling in U direction", initial_string = "1")
AddNumberParam("V Scale", "Scaling in V direction", initial_string = "1")*/
AddNumberParam("Color", "Color of this material (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
/*AddNumberParam("U Offset", "Offset in U direction", initial_string = "0")
AddNumberParam("V Offset", "Offset in V direction", initial_string = "0")*/
AddNumberParam("Rotation", "Rotation of the sprite with this material in degrees", initial_string = "0")
/*AddNumberParam("Align X", "X alignment", initial_string = "0")
AddNumberParam("Align Y", "Y alignment", initial_string = "0")*/
/*AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Size Attenuation", "Choose whether size attenuation is active on this material", initial_string = "0")
AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Screen Coords.", "Choose whether screen coordinates are used", initial_string = "0")
AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Scale by Viewport.", "Choose whether screen coordinates are used", initial_string = "0")*/
AddAction(126, af_deprecated, "New Sprite material", " MATERIALS / SPRITE", "<b>••• MATERIALS / SPRITE</b> Create sprite material {0}.", "Creates a new named material that can be applied to sprite objects", "SpriteMaterial");

AddStringParam("Clone Name", "Name of the clone", initial_string = "\"Cloned Material\"")
AddStringParam("Original Name", "Name of the Material to clone", initial_string = "\"Original Material\"")
AddAction(127, af_none, "Clone existing material", " MATERIALS  ██████", "<b>••• MATERIALS</b> Create material {0} by cloning material {1}.", "Creates a new named material from an existing one", "MaterialsClone");

AddStringParam("Clone Name", "Name of the clone", initial_string = "\"Cloned Object\"")
AddNumberParam("Original id", "unique 3D object id of the object to clone", initial_string = "self.idLast")
AddAction(128, af_none, "Create by cloning", " OBJECTS / CREATE [ ADVANCED ]", "<b>█ OBJECTS / CREATE [ ADVANCED ]</b> Create object {0} by cloning object ({1}).", "Creates an object by cloning another, materials become shared aswell in the process", "CreateObjFromClone");

AddAction(129, af_none, "Update all materials", " MATERIALS [ ADVANCED ]   Update all materials if lights are acting weird, it rebuilds shaders.", "<b>MATERIALS [ ADVANCED ]</b> Update <b>all</b> materials", "Rebuilds every material in the scene", "MaterialsUpdateAll");

AddStringParam("Scene", "Scene to pick (all actions operate on this scene until a different one is selected, ''Default'' is the default scene)", initial_string = "\"Default\"")
AddAction(130, af_none, "Pick Scene", "   SYSTEM / SCENE", "<b>SYSTEM / SCENE</b> Pick <b>scene</b> named <b>{0}</b>.", "Changes the scene to affect with future actions.", "SceneChange");

AddNumberParam("X", "X component of vector to move along.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to move along.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to move along.", initial_string = "0")
AddNumberParam("Distance", "Amount to move along given vector in units.", initial_string = "0")
AddAction(131, af_none, "Move along local vector", " CAMERAS / POSITION", "<b>CAMERAS / POSITION</b> Move <b>camera</b> along <b>local</b> vector ({0},{1},{2}) by ({3}) units.", "Move the camera along a given local space vector by a given amount", "CamMoveAxisLocal");

AddNumberParam("X", "X component of vector to move along.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to move along.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to move along.", initial_string = "0")
AddNumberParam("Distance", "Amount to move along given vector in units.", initial_string = "0")
AddAction(132, af_deprecated, "Move along world vector", " CAMERAS / POSITION", "<b>CAMERAS / POSITION</b> Move <b>camera</b> along <b>world</b> vector ({0},{1},{2}) by ({3}) units.", "Move the camera along a given world space vector by a given amount", "CamMoveAxis");

AddStringParam("Order", "Rotation order of the euler angles (written as any string ''XYZ'',''YXZ'' etc. which is a combination of X, Y and Z)", initial_string = "\"XYZ\"")
AddNumberParam("X", "X rotation in degrees.", initial_string = "0")
AddNumberParam("Y", "Y rotation in degrees.", initial_string = "0")
AddNumberParam("Z", "Z rotation in degrees.", initial_string = "0")
AddAction(133, af_none, "Rotation from euler angles", " CAMERAS / ROTATION", "<b>CAMERAS / ROTATION</b> Set <b>camera</b> rotation in {0} order to Euler angles ({1},{2},{3}).", "Set the rotation of the camera using specified euler angles.", "CamSetRot");

AddNumberParam("X", "X component of vector to rotate around.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to rotate around.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to rotate around.", initial_string = "0")
AddNumberParam("Angle", "Amount to rotate around given vector in degrees.", initial_string = "0")
AddAction(134, af_none, "Rotate around local vector", " CAMERAS / ROTATION", "<b>CAMERAS / ROTATION</b> rotate <b>camera</b> around <b>local</b> vector ({0},{1},{2}) by ({3}) degrees.", "Rotate the camera around a given local space vector by a given amount", "CamRotAxisLocal");

AddNumberParam("X", "X component of vector to rotate around.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to rotate around.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to rotate around.", initial_string = "0")
AddNumberParam("Angle", "Amount to rotate around given vector in degrees.", initial_string = "0")
AddAction(135, af_none, "Rotate around world vector", " CAMERAS / ROTATION", "<b>CAMERAS / ROTATION</b> rotate <b>camera</b> around <b>world</b> vector ({0},{1},{2}) by ({3}) degrees.", "Rotate the object around a given world space vector by a given amount", "CamRotAxis");

AddNumberParam("X", "X component of axis.", initial_string = "1")
AddNumberParam("Y", "Y component of axis.", initial_string = "0")
AddNumberParam("Z", "Z component of axis.", initial_string = "0")
AddNumberParam("Angle", "Angle to rotate around given axis in degrees.", initial_string = "0")
AddAction(136, af_none, "Rotation from axis-angle", " CAMERAS / ROTATION", "<b>CAMERAS / ROTATION</b> Set <b>camera</b> rotation from axis ({0},{1},{2}) and angle ({3}).", "Set the rotation of an object in axis-angle representation.", "CamSetRotAxisAngle");

AddStringParam("Camera", "Camera to pick (all actions operate on this camera until a different one is selected, ''Default'' is the default camera)", initial_string = "\"Default\"")
AddAction(137, af_none, "Pick Camera", " CAMERAS  ██████", "<b>CAMERAS</b> Pick <b>camera</b> named <b>{0}</b>.", "Changes the camera to affect with future actions", "CameraChange");

AddComboParamOption("Enable");
AddComboParamOption("Disable");
AddComboParam("Viewports", "Choose whether multiple viewports are enabled or disabled (useful for making splitscreen etc.), otherwise the default viewport is used", "0");
AddAction(138, af_deprecated, "Enable multiple Viewports", "   SYSTEM / VIEWPORTS [ ADVANCED ]", "<b>SYSTEM / VIEWPORTS [ ADVANCED ]</b> {0} multiple viewport render.", "Choose whether multiple viewports are enabled or disabled (useful for making splitscreen etc.), otherwise the default viewport is used", "ViewportsEnable");

AddStringParam("Name", "Name of the viewport to add / edit (''Default'' is the default viewport)", initial_string = "\"Default\"")
AddStringParam("Scene", "Name of the scene to associate with this viewport for rendering (''Default'' is the default scene)", initial_string = "\"Default\"")
AddStringParam("Camera", "Name of the camera to associate with this viewport for rendering (''Default'' is the default camera)", initial_string = "\"Default\"")
AddNumberParam("Left", "X Position of the left edge of the viewport in the rendering window, given in a coordinate value from 0 to 1, with 0 being the left-most edge, 1 being the right-most edge, 0.5 the middle etc.", initial_string = "0")
AddNumberParam("Right", "X Position of the right edge of the viewport in the rendering window, given in a coordinate value from 0 to 1, with 0 being the left-most edge, 1 being the right-most edge, 0.5 the middle etc.", initial_string = "1")
AddNumberParam("Top", "Y Position of the top edge of the viewport in the rendering window, given in a coordinate value from 0 to 1, with 0 being the bottom-most edge, 1 being the top-most edge, 0.5 the middle etc.", initial_string = "1")
AddNumberParam("Bottom", "Y Position of the bottom edge of the viewport in the rendering window, given in a coordinate value from 0 to 1, with 0 being the bottom-most edge, 1 being the top-most edge, 0.5 the middle etc.", initial_string = "0")
AddNumberParam("Z", "Z ordering value, viewports with higher values render above those with lower ones", initial_string = "0")
/*AddComboParamOption("Enable");
AddComboParamOption("Disable");
AddComboParam("Clear Color Buffer", "Choose whether the color buffer is cleared when this viewport is rendered", "0");*/
AddAction(139, af_deprecated, "Add / Edit Viewport", "   SYSTEM / VIEWPORTS [ ADVANCED ]", "<b>SYSTEM / VIEWPORTS [ ADVANCED ]</b> Add / Edit <b>Viewport</b> named {0}, using scene {1} and camera {2} with edges ({3},{4},{5},{6}) and Z order ({7})", "Creates / Edits a viewport with various settings", "ViewportsAddEdit");

AddStringParam("Name", "Name of the viewport to remove", initial_string = "\"Viewport\"")
AddAction(140, af_deprecated, "Remove Viewport", "   SYSTEM / VIEWPORTS [ ADVANCED ]", "<b>SYSTEM / VIEWPORTS [ ADVANCED ]</b> Remove <b>Viewport</b> named {0}.", "Removes a previously added viewport", "ViewportsRemove");

AddStringParam("Name", "Name of the scene to create/overwrite", initial_string = "\"New Scene\"")
AddAction(141, af_none, "Add Scene", "   SYSTEM / SCENE", "<b>SYSTEM / SCENE</b> Add <b>scene</b> named {0}.", "Adds a new scene which can be selected with ''Pick Scene''.", "SceneAdd");

AddStringParam("Name", "Name of the camera to create/overwrite", initial_string = "\"New Camera\"")
AddAction(142, af_none, "Add Camera", " CAMERAS  ██████", "<b>CAMERAS</b> Add <b>camera</b> named {0}.", "Adds a new camera which can be selected with ''Pick Camera''.", "CameraAdd");

AddStringParam("Name", "Name of the scene to use in rendering if viewports are disabled (they are disabled by default)", initial_string = "\"Default\"")
AddAction(143, af_none, "Scene to render", "   SYSTEM  ██████", "<b>SYSTEM</b> render using <b>scene</b> named <b>{0}</b>.", "If Viewports are disabled (they are by default), this sets the scene to render with", "SetRenderScene");

AddStringParam("Name", "Name of the camera to use in rendering if viewports are disabled (they are disabled by default)", initial_string = "\"Default\"")
AddAction(144, af_none, "Camera to render", "   SYSTEM  ██████", "<b>SYSTEM</b> render using <b>camera</b> named <b>{0}</b>.", "If Viewports are disabled (they are by default), this sets the camera to render with", "SetRenderCamera");

AddStringParam("Texture Name", "Name of the texture", initial_string = "\"Texture\"")
AddStringParam("Camera Name", "Name of the Cube Camera (It's a 3D Object, so self.idLast gets changed to its id when created)", initial_string = "\"Cube Camera\"")
AddNumberParam("Near", "Near clipping distance of the cube camera", initial_string = "0.1")
AddNumberParam("Far", "Far clipping distance of the cube camera", initial_string = "5000")
AddNumberParam("Resolution", "Choose a power of 2 value ideally, as this works best on most hardware", initial_string = "512")
AddComboParamOption("Cube reflection");
AddComboParamOption("Cube refraction");
AddComboParam("Mapping", "Choose the mapping mode for this texture (for reflection or refraction)", initial_string = "0")
AddAction(145, af_none, "Create Cube Camera", " TEXTURES / CUBE CAMERA [ ADVANCED ]", "<b>••• TEXTURES / █ CUBE CAMERA [ ADVANCED ]</b> Create cube map {0} using <b>cube camera</b> {1} with near planes ({2}), far planes ({3}) size ({4}) and {5} mapping", "Creates a cube camera, and then a cube map from that camera", "CubeCamera");

AddNumberParam("id", "unique 3D object id of the cube camera to update", initial_string = "self.idLast")
AddStringParam("Scene", "Name of the scene to render using (''Default'' is the default scene)", initial_string = "\"Default\"")
AddAction(146, af_none, "Update Cube Camera", " TEXTURES / CUBE CAMERA [ ADVANCED ]", "<b>TEXTURES / CUBE CAMERA [ ADVANCED ]</b> Update <b>cube camera</b> with id ({0}) using <b>scene</b> {1}.", " Updates the texture associated with a cube camera by rendering a given scene (slow)", "CubeCameraUpdate");

//DO NOT DELETE WAS IN FIRST VERSION SO NEEDS TO MAINTAIN BACKWARDS COMPAT
AddStringParam("File name", "Name of the three.js JSON model file to load.", initial_string = "\"MyObj.obj\"")
AddAction(147, af_deprecated, "Load JSON model", "  LOAD [ ADVANCED ]", "<b>LOAD [ ADVANCED ]</b> Load JSON model file {0}.", "Loads a three.js JSON model file that you have included in the project files, so that you can use it (this takes time)", "LoadFileJSON");

AddNumberParam("Skip ratio", "A value between 0 and 1. 1 renders 100% of frames, 0.5 renders 50% of frames, 0 renders 0% of frames", initial_string = "1")
AddAction(148, af_none, "Set frame skip", "   SYSTEM  ██████", "<b>SYSTEM</b> set frame skip ratio to <i>({0})</i>.", "Set the rate frames are skipped (if at all)", "SetFrameSkip");

AddObjectParam("Q3D Object", "Select the Q3D Object type you want to modify")
AddComboParamOption("On (filled)");
AddComboParamOption("On (wire)");
AddComboParamOption("Off");
AddComboParam("Debug", "Choose whether or not to show the Collision Grid Debug (will only appear if you have conditions which use it)", 2);
AddNumberParam("Cell x size", "Integer value representing the X size the collision grid cells", initial_string = "1000");
AddNumberParam("Cell y size", "Integer value representing the Y size the collision grid cells", initial_string = "1000");
AddNumberParam("Cell z size", "Integer value representing the Z size the collision grid cells", initial_string = "1000");
AddAction(149, af_none, "Coll. grid settings", "   SYSTEM  ██████", "Set {0} collision grid dimensions to <i>({2},{3},{4})</i> and turn debug <b>{1}</b>", "Make changes to the collision grid used to accelerate collision queries for a selected Q3D object type.", "CollGridSettings");

//Similar to action in official 'user media' object;
AddComboParamOption("PNG");
AddComboParamOption("JPEG");
AddComboParam("Format", "Choose the file format to save the snapshot.  PNG is lossless but JPEG files are smaller.");
AddNumberParam("JPEG quality", "If 'Format' is 'JPEG', the JPEG quality from 0 (worst) to 100 (best).  Ignored for PNG.", "75");
AddAction(150, af_none, "Snapshot", "Q3D Canvas", "Take snapshot ({0}, quality <i>{1}</i>)", "Take a snapshot of the current image on the Q3D canvas.  Use 'SnapshotURL' expression to get result.", "Snapshot");

/*AddStringParam("Name", "Name of the new camera (''Default'' is the default camera)", initial_string = "\"New Camera\"")
AddAction(137, af_none, "Add Camera", " CAMERAS  ██████", "<b>CAMERAS</b> Add <b>camera</b> with name <b>{0}</b>.", "Creates a new camera", "CameraNew");*/

AddStringParam("File name", "Name of the .obj file to load.", initial_string = "\"MyObj.obj\"")
AddAction(151, af_none, "Load .qfx shader", "  LOAD  ██████", "<b>LOAD</b> Load .qfx shader file {0}.", "Loads a .qfx shader file that you have included in the project files, so that you can use it with a Q3D model later (this takes time)", "LoadFileObj");

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

AddNumberParam("id", "id of object")
AddStringParam("\"MyValue\"", "Name of the value.")
AddExpression(1, ef_return_any, "Get object variable value", "Object Variables", "objV", "Return the value stored in an object variable. (undefined objects return ''undefined'')");

AddExpression(2, ef_return_number, "Get id of last created object", "Object Picking", "idLast", "Return the unique 3D object id of the last created object.");

AddStringParam("Object", "Name of the object.")
AddExpression(3, ef_return_number, "Get id by object name", "Object Picking", "id", "Return the unique 3D object id of the first object with the given name. (will only return reference to a single object)");

AddNumberParam("id", "id of object")
AddExpression(4, ef_return_string, "Get name from id", "Object Properties", "objName", "Return the name of the object as a string from its id (not a construct uid, undefined objects return ''undefined'')");

AddExpression(5, ef_return_number, "Get id of the scene", "Object Picking", "idScene", "Return the unique 3D object id of the scene.");

AddNumberParam("id", "id of object")
AddExpression(6, ef_return_number, "Get id of object parent", "Object Picking", "idParent", "Return the unique 3D object id of the objects parent");

AddNumberParam("id", "id of object")
AddExpression(7, ef_return_number, "Get object X", "Object Properties", "objX", "Return the object's X position (child objects postion is given relative to parent in local coords). (undefined objects return 0)");

AddNumberParam("id", "id of object")
AddExpression(8, ef_return_number, "Get object Y", "Object Properties", "objY", "Return the object's Y position (child objects postion is given relative to parent in local coords). (undefined objects return 0)");

AddNumberParam("id", "id of object")
AddExpression(9, ef_return_number, "Get object Z", "Object Properties", "objZ", "Return the object's Z position (child objects postion is given relative to parent in local coords). (undefined objects return 0)");

AddNumberParam("id", "id of object")
AddNumberParam("0", "Value in object matrix's X position")
AddNumberParam("0", "Value in object matrix's Y position")
AddExpression(10, ef_return_number, "Get object Matrix element", "Object Properties", "objM", "Returns the value in position [x,y] of the objects 4x4 model matrix, WILL CAUSE ERROR WITH (x>3 or y>3)");

//AddExpression(11, ef_deprecated, "Get number of loaded items", "Loading", "LoadedItems", "Returns the number of items that have been loaded so far");

AddExpression(12, ef_return_number, "Get load status", "Loading", "LoadStatus", "Returns the status of the load, a 0 if current load has not completed, and a 1 if it has, reset to 0 any time something is loaded.");

//AddExpression(13, ef_deprecated, "Get id of the camera", "Object Picking", "idCamera", "Return the unique 3D object id of the main camera.");

AddExpression(14, ef_return_number, "Get id of the currently picked object", "Object Picking [ FOR EACH CHILD ]", "idPicked", "Return the unique 3D object id of the currently picked object in a loop.");

AddExpression(15, ef_return_string, "Get name of the current scene", "Scenes", "scene", "Returns a string with the name of the current picked scene.");

AddExpression(16, ef_return_number, "Get camera X", "Camera Properties", "camX", "Return the camera's X position");

AddExpression(17, ef_return_number, "Get camera Y", "Camera Properties", "camY", "Return the camera's Y position");

AddExpression(18, ef_return_number, "Get camera Z", "Camera Properties", "camZ", "Return the camera's Z position");

AddNumberParam("id", "id of object")
AddExpression(19, ef_return_number, "Get object X rotation", "Object Properties", "objRotX", "Return the object's euler angles local X axis rotation. (undefined objects return 0)");

AddNumberParam("id", "id of object")
AddExpression(20, ef_return_number, "Get object Y rotation", "Object Properties", "objRotY", "Return the object's euler angles local Y axis rotation. (undefined objects return 0)");

AddNumberParam("id", "id of object")
AddExpression(21, ef_return_number, "Get object Z rotation", "Object Properties", "objRotZ", "Return the object's euler angles local Z axis rotation. (undefined objects return 0)");

AddNumberParam("id", "id of object")
AddExpression(22, ef_return_string, "Get object E.rotation order", "Object Properties", "objRotO", "Return the object's euler angles rotation order as a string. (undefined objects return ''XYZ'')");


AddExpression(23, ef_return_number, "Get camera X rotation", "Camera Properties", "camRotX", "Return the camera's euler angles local X axis rotation.");

AddExpression(24, ef_return_number, "Get camera Y rotation", "Camera Properties", "camRotY", "Return the camera's euler angles local Y axis rotation.");

AddExpression(25, ef_return_number, "Get camera Z rotation", "Camera Properties", "camRotZ", "Return the camera's euler angles local Z axis rotation.");

AddExpression(26, ef_return_string, "Get camera E.rotation order", "Camera Properties", "camRotO", "Return the camera's euler angles rotation order as a string.");

AddExpression(27, ef_return_string, "Get name of the current camera", "Cameras", "cameraName", "Returns a string with the name of the current picked camera.");



AddExpression(28, ef_return_number, "Get ray X origin", "Raycasting", "Ray_originX", "Return the origin x position of the cast ray from a raycasting loop condition.");

AddExpression(29, ef_return_number, "Get ray Y origin", "Raycasting", "Ray_originY", "Return the origin y position of the cast ray from a raycasting loop condition.");

AddExpression(30, ef_return_number, "Get ray Z origin", "Raycasting", "Ray_originZ", "Return the origin z position of the cast ray from a raycasting loop condition.");


AddExpression(31, ef_return_number, "Get id of the current object intersecting the ray", "Raycasting", "Ray_idPicked", "Return the unique 3D object id of the Object the raycaster loop is currently intersecting.");


AddExpression(32, ef_return_number, "Get ray X direction", "Raycasting", "Ray_dirX", "Return the x direction of the cast ray from a raycasting loop condition.");

AddExpression(33, ef_return_number, "Get ray Y direction", "Raycasting", "Ray_dirY", "Return the y direction of the cast ray from a raycasting loop condition.");

AddExpression(34, ef_return_number, "Get ray Z direction", "Raycasting", "Ray_dirZ", "Return the z direction of the cast ray from a raycasting loop condition.");


AddExpression(35, ef_return_number, "Get number of intersections", "Raycasting", "Ray_numObj", "Return the total number of intersections (similar to looplength) from a raycasting loop condition.");


AddExpression(36, ef_return_number, "Get distance to current object", "Raycasting", "Ray_distance", "Return the distance of the current intersection from the rays origin in a raycasting loop condition.");


AddExpression(37, ef_return_number, "Get intersection X position", "Raycasting", "Ray_pointX", "Return the x position of the current intersection with the ray in a raycasting loop condition.");

AddExpression(38, ef_return_number, "Get intersection Y position", "Raycasting", "Ray_pointY", "Return the y position of the current intersection with the ray in a raycasting loop condition.");

AddExpression(39, ef_return_number, "Get intersection Z position", "Raycasting", "Ray_pointZ", "Return the z position of the current intersection with the ray in a raycasting loop condition.");


AddExpression(40, ef_return_number, "Get intersection index", "Raycasting", "Ray_index", "Return the current 0 based index of the intersection (similar to loopindex) from a raycasting loop condition, index of 0 is closest intersection.");

AddNumberParam("id", "id of object")
AddExpression(41, ef_return_number, "Get object world X", "Object Properties", "objXw", "Return the object's world X position. (undefined objects return 0)");

AddNumberParam("id", "id of object")
AddExpression(42, ef_return_number, "Get object world Y", "Object Properties", "objYw", "Return the object's world Y position. (undefined objects return 0)");

AddNumberParam("id", "id of object")
AddExpression(43, ef_return_number, "Get object world Z", "Object Properties", "objZw", "Return the object's world Z position. (undefined objects return 0)");

AddExpression(44, ef_return_number, "Get face normal X", "Raycasting", "Ray_nX", "Return the normal x component of the face the ray is intersecting in raycasting loop condition.");

AddExpression(45, ef_return_number, "Get face normal Y", "Raycasting", "Ray_nY", "Return the normal y component of the face the ray is intersecting in raycasting loop condition.");

AddExpression(46, ef_return_number, "Get face normal Z", "Raycasting", "Ray_nZ", "Return the normal z component of the face the ray is intersecting in raycasting loop condition.");

AddExpression(47, ef_return_any, "Get Test String 1", " Developer Debug", "TestString1", "Returns the value of a test string used in debugging code.");

AddExpression(48, ef_return_number, "Get camera X vector", "Camera Properties", "camVecX", "Return the X component of a forward pointing vector from the camera.");

AddExpression(49, ef_return_number, "Get camera Y vector", "Camera Properties", "camVecY", "Return the Y component of a forward pointing vector from the camera.");

AddExpression(50, ef_return_number, "Get camera Z vector", "Camera Properties", "camVecZ", "Return the Z component of a forward pointing vector from the camera.");

AddExpression(51, ef_return_number, "Get number of loaded items (i.e. if you queued 10 items to load and 7 are complete, you get 7 from this)", "Loading", "LoadedItems", "Returns the number of items that have been loaded in so far");

AddExpression(52, ef_return_number, "Get total of items to load (i.e. if you queued 10 items to load and 7 are complete, you get 10 from this)", "Loading", "LoadTotal", "Returns the number of items that have been queued up for loading");
 
AddExpression(53, ef_return_string, "Get current filename being loaded", "Loading", "LoadingFilename", "Returns the current filename being loaded");
 
 /////////////////////////////////
 
AddExpression(54, ef_return_string, "", "Q3D Canvas", "SnapshotURL", "Return a data URI containing image data from a snapshot taken with the snapshot action. Can be set to a Sprite or Tiled Background.");
 
////////////////////////////////////////
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
	//new cr.Property(ept_integer, 	"My property",		77,		"An example property."),
	new cr.Property(ept_combo,	"Initial visibility",	"Visible",	"Choose whether the object is visible when the layout starts.", "Visible|Invisible"),
	new cr.Property(ept_combo,	"Hotspot",				"Top-left",	"Choose the location of the hot spot in the object, only works properly with 'inside' render mode, other modes give weirdness", "Top-left|Top|Top-right|Left|Center|Right|Bottom-left|Bottom|Bottom-right"),
	new cr.Property(ept_combo,	"Render Mode",	"Infront",	"Choose how the 3D window renders, either in front of the C2 canvas (fastest/easiest), in a box inside construct that can be layered (slow/broken on some browsers), or behind the C2 canvas (requires the layer to be tranparent, and nothing behind c2canvasdiv)", "Infront|Inside|Behind"),
	new cr.Property(ept_combo,	"Scale/Position",				"Autofit",	"Set how the 3D window is positioned and scaled to the C2 canvas size/pos, or as it is in the layout", "Autofit|Positioned"),
	new cr.Property(ept_combo,	"Anti-aliasing",				"Off",	"Enable/Disable antialiasing. Due to current browser limitations this can't be set dynamically at runtime, this may change later on.", "Off|On"),
	new cr.Property(ept_combo,	"Shadow Maps",				"On",	"Enable/Disable ShadowMaps (ShadowMaps are GPU intensive as the scene must be rendered into them)", "Off|On"),
	new cr.Property(ept_combo,	"Renderer",				"WebGL",	"WebGL renderer is the only stable rendererer, you may encounter bugs with experimental deferred." , "WebGL|WebGL Deferred ( EXPERIMENTAL )"),
	new cr.Property(ept_color, "BG Color",	"0,0,0",	"Color of the background"),
	new cr.Property(ept_float, "BG Alpha",	"1",	"Alpha of the background (value from 0 to 1)"),
	new cr.Property(ept_combo,	"Axis Helper",				"On",	"Show a tree legged helper object at the origin that points in the positive xyz directions with a size of 10x10x10", "Off|On"),
	new cr.Property(ept_combo,	"Grid Helper",				"On",	"Show a grid object at the origin on the xy plane with grid steps corresponding to 1 unit each", "Off|On"),
	new cr.Property(ept_combo,	"Camera",				"Orthogonal",	"Choose if the camera is initially orthogonal or perspective", "Orthogonal|Perspective"),
	new cr.Property(ept_combo,	"Spawn Light",				"Yes",	"When set to yes, adds a directional light to the scene on creation", "Yes|No"),
	new cr.Property(ept_float,	"Frame Skip Ratio",	"1",	"Used to control how many frames are rendered. a value of 1 renders 100% of the frames, 0.5 drops 50% the frames, 0 renders 0% of the frames."),
	new cr.Property(ept_combo,	"Resolution",	"Auto",	"Choose how the resolution is set (Auto sets it to the proper window size, Use Size sets it to the height/width of the Q3D Master object)", "Auto|Use Size")
	//new cr.Property(ept_combo,	"Resolution",				"Autofit",	"Set how the resolution of the 3D window is set (autofit uses the game window dimensions, Size uses the width/height)", "Autofit|Size")
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
}

IDEInstance.prototype.OnCreate = function()
{

	switch (this.properties["Hotspot"])
	{
    case "Top-left" :
      this.instance.SetHotspot(new cr.vector2(0, 0));
      break;
    case "Top" :
      this.instance.SetHotspot(new cr.vector2(0.5, 0));
      break;
    case "Top-right" :
      this.instance.SetHotspot(new cr.vector2(1, 0));
      break;
    case "Left" :
      this.instance.SetHotspot(new cr.vector2(0, 0.5));
      break;
    case "Center" :
      this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
      break;
    case "Right" :
      this.instance.SetHotspot(new cr.vector2(1, 0.5));
      break;
    case "Bottom-left" :
      this.instance.SetHotspot(new cr.vector2(0, 1));
      break;
    case "Bottom" :
      this.instance.SetHotspot(new cr.vector2(0.5, 1));
      break;
    case "Bottom-right" :
		  this.instance.SetHotspot(new cr.vector2(1, 1));
      break;
	}
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetPosition(new cr.vector2(0, 0));
	this.instance.SetSize(new cr.vector2(854, 480));
};

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{

    if (property_name === "Hotspot")
	{
        switch (this.properties["Hotspot"])
        {
          case "Top-left" :
            this.instance.SetHotspot(new cr.vector2(0, 0));
          break;
          case "Top" :
            this.instance.SetHotspot(new cr.vector2(0.5, 0));
          break;
          case "Top-right" :
            this.instance.SetHotspot(new cr.vector2(1, 0));
          break;
          case "Left" :
            this.instance.SetHotspot(new cr.vector2(0, 0.5));
          break;
          case "Center" :
            this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
          break;
          case "Right" :
            this.instance.SetHotspot(new cr.vector2(1, 0.5));
          break;
          case "Bottom-left" :
            this.instance.SetHotspot(new cr.vector2(0, 1));
          break;
          case "Bottom" :
            this.instance.SetHotspot(new cr.vector2(0.5, 1));
          break;
          case "Bottom-right" :
            this.instance.SetHotspot(new cr.vector2(1, 1));
          break;
        }
    }

}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
    var q=this.instance.GetBoundingQuad();
	renderer.Fill(q, cr.RGB(230,230,230));
	renderer.Outline(q, cr.RGB(0,0,0));
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}