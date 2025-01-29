function GetPluginSettings()
{
	return {
		"name":			"Q3D\nBone",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"Q3DBone",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"2.4",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"For use when using advanced skeletal animations",
		"author":		"Quazi",
		"help url":		"http://threejs.org/",
		"category":		"Q3D",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	true,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
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

AddStringParam("Bone Name", "Name the bone is given in it's model file" , initial_string = "\"\"");
AddCondition(0, 0, "Pick by name", "Bone Stuff", "Pick if bone name is <b>{0}</b>.", "Pick a bone by its name string take from the model file", "PickBoneByName");

AddObjectParam("Model type", "This type must match the type of the desired parent Q3D Model with skeleton which this bone is a child of, or the event wont work.");
AddCondition(1, 0, "Pick skeleton parent", "Bone Stuff", "{my} : Pick parent skeleton Q3D Model {0}", "Picks the Q3D Models associated with the picked bone instances.", "PickSkeleModel");

AddObjectParam("Object", "Object to test collision with");
AddCondition(5000, cf_none, "Is overlapping Q3D object", "Collisions", "Overlaps {0}", "Test for overlap with another Q3D object", "IsOverlapping");

AddObjectParam("Object", "Select the object to test for overlap with.");
AddNumberParam("Offset X", "The amount to offset the X co-ordinate in parent axis units before checking for a collision.");
AddNumberParam("Offset Y", "The amount to offset the Y co-ordinate in parent axis units before checking for a collision.");
AddNumberParam("Offset Z", "The amount to offset the Z co-ordinate in parent axis units before checking for a collision.");
AddCondition(5001, 0, "Is overlap. at offset (parent)", "Collisions", "Is overlapping {0} at <i>parent</i> offset (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Test if the object is overlapping another Q3D object at an offset position in parents coordinates.", "IsOverlappingOffsetParent");

AddObjectParam("Object", "Select the object to test for overlap with.");
AddNumberParam("Direction X", "The X component local direction to offset in.");
AddNumberParam("Direction Y", "The Y component local direction to offset in.");
AddNumberParam("Direction Z", "The Z component local direction to offset in.");
AddNumberParam("Offset amount", "The amount to offset along specified local direction.");
AddCondition(5002, 0, "Is overlap. at offset (local)", "Collisions", "Is overlapping {0} offset by (<i>{4}</i>) in <i>local</i> direction (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Test if the object is overlapping another Q3D object at an offset position in local coordinates.", "IsOverlappingOffsetLocal");

AddObjectParam("Object", "Select the object to test for overlap with.");
AddNumberParam("Offset X", "The amount to offset the X co-ordinate in world axis units before checking for a collision.");
AddNumberParam("Offset Y", "The amount to offset the Y co-ordinate in world axis units before checking for a collision.");
AddNumberParam("Offset Z", "The amount to offset the Z co-ordinate in world axis units before checking for a collision.");
//AddNumberParam("Offset amount", "The amount to offset along specified world direction.");
AddCondition(5003, cf_none, "Is overlap. at offset (world)", "Collisions", "Is overlapping {0} at <i>world</i> offset (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Test if the object is overlapping another Q3D object at an offset position in world coordinates.", "IsOverlappingOffsetWorld");

AddCondition(5004, 0, "Collisions enabled", "Collisions", "Collisions enabled", "True if the object's collisions are enabled and will fire collision events.", "IsCollisionEnabled");

AddObjectParam("Object", "Select the Q3D object to test for a collision with.");
AddCondition(5005, cf_fake_trigger | cf_static, "On collision with another object", "Collisions", "On collision with {0}", "Triggered when the object collides with another Q3D object.", "OnCollision");

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

AddComboParamOption("None");
AddComboParamOption("Sphere");
AddComboParamOption("AABB");
AddComboParamOption("Box");
//AddComboParamOption("Ellipsoid");
AddComboParam("Collider", "Type of collider to use for this object in collision tests", 0);
AddAction(151, af_none, "Change collider type", "Collisions", "Change collider type to <b>{0}</b>", "Changes the type of collider this object uses", "ChangeCollider");

AddNumberParam("Collider scale X", "X scaling of the collider.", initial_string = "1")
AddNumberParam("Collider scale Y", "Y scaling of the collider.", initial_string = "1")
AddNumberParam("Collider scale Z", "Z scaling of the collider.", initial_string = "1")
AddAction(5000, af_none, "Set collider scale", "Collider", "Set collider scale to ({0},{1},{2})", "Set the local scale of the collider.", "ColliderSetScale");

AddNumberParam("Collider offset X", "X offset of the collider.", initial_string = "0")
AddNumberParam("Collider offset Y", "Y offset of the collider.", initial_string = "0")
AddNumberParam("Collider offset Z", "Z offset of the collider.", initial_string = "0")
AddAction(5001, af_none, "Set collider offset", "Collider", "Set collider scale to ({0},{1},{2})", "Set the local positional offset of the collider.", "ColliderSetOffset");

AddNumberParam("Collider rot X", "X rotation of the collider in degrees.", initial_string = "0")
AddNumberParam("Collider rot Y", "Y rotation of the collider in degrees.", initial_string = "0")
AddNumberParam("Collider rot Z", "Z rotation of the collider in degrees.", initial_string = "0")
AddAction(5002, af_none, "Set collider rotation", "Collider", "Set collider rotation to ({0},{1},{2}) degrees", "Set the local rotation of the collider.", "ColliderSetRotation");


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

AddExpression(0, ef_return_string, "Bone Name", "Bone Stuff", "BoneName", "Return the name the bone was given by the skinned model / skeletal animations");

////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////					EDITTIME COMMON ACE								  //////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	

populateCommonACE();

/////////////////////////////////////////
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
	
	new cr.Property(ept_section, "General Properties", "",	"General properties affecting things like initial position, scale, rotation, and visibility."),
		new cr.Property(ept_combo,	"Initial Visibility",	"Visible",	"Choose whether the object is visible when the layout starts.", "Visible|Invisible"),
		new cr.Property(ept_float, 	"Z Position",		0,		"Z position of the 3D object, positive direction goes 'into' the screen"),
		new cr.Property(ept_text, 	"Rotation Order",		"ZYX",		"Euler angles rotation order."),
		new cr.Property(ept_float, 	"Rotation X",		0,		"Rotation amount around the local object X axis (red) in degrees (roll)"),
		new cr.Property(ept_float, 	"Rotation Y",		0,		"Rotation amount around the local object Y axis (green) in degrees (pitch)"),
		new cr.Property(ept_float, 	"Z Size",		100,		"Z Scaling of the 3D object"),
	
	new cr.Property(ept_section, "Debug properties", "",	"Properties to help with debugging the 3D object in the editor and at runtime."),
		new cr.Property(ept_combo, 	"Main Debug",		"On",		"Show the bone and or collider (if it has one) at runtime","On|Off"),
		new cr.Property(ept_combo, 	"Name Debug",		"Off",		"Show the name of the bone from the model file floating at it's world position from the rendered camera in Q3DMaster (slow, uses html elements to render text)","On|Off"),
		
	new cr.Property(ept_section, "Collision properties", "",	"Properties affecting collision detection and the collider body."),
		new cr.Property(ept_combo, 	"Collider Type",		"Box",		"Type of collider to use when collision testing this object","None|Sphere|AABB|Box")
		
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

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(100, 100));
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
	var q= this.instance.GetSize();
	var quad = this.instance.GetBoundingQuad();
	
	var xpos = (quad.tlx+quad.trx+quad.blx+quad.brx)/4;
	var ypos = (quad.tly+quad.try_+quad.bly+quad.bry)/4;  // i don't know how to get the position of the object... its not in the sdk
	
	var xtemp;
	var ytemp;
	var ztemp;
	
	var zsize = this.properties["Z Size"];
	var zpos = this.properties["Z Position"];
	
	var xrot = this.properties["Rotation X"]*(Math.PI/180);
	var yrot = this.properties["Rotation Y"]*(Math.PI/180);
	var zrot = cr.angleTo(quad.tlx, quad.tly, quad.trx, quad.try_);  //this.properties["Rotation Z"]*(Math.PI/180);this.instance.getAngle()*(Math.PI/180); // get angle seems to be new, not gonna use it.
	
	var rcos;
	var rsin;
	
	var verts = [];
	var faces = [];
	
	var hsegs = 6;
	var csegs = 12;
	

	var maxExtent = Math.max(Math.abs(q.x),Math.abs(q.y),Math.abs(zsize));
	
	var XmaxExtent = 0;
	var YmaxExtent = 0;
	
	//var outlineCol = cr.RGB(0,0,0);
	
	// Make debug object
	
		//var verts = [[q.x/2,q.y/2,zsize/2],[q.x/-2,q.y/2,zsize/2],[q.x/-2,q.y/-2,zsize/2],[q.x/2,q.y/-2,zsize/2]   ,   [q.x/2,q.y/2,zsize/-2],[q.x/-2,q.y/2,zsize/-2],[q.x/-2,q.y/-2,zsize/-2],[q.x/2,q.y/-2,zsize/-2]]; // list of vertices of object
		//var faces = [[3,2,1,0],[4,5,6,7],[5,4,0,1],[3,0,4,7],[2,6,5,1],[2,3,7,6]];
		
		var verts = [[q.x/-2,0,0],[0,0,zsize/-2],[q.x/2,0,0],[0,0,zsize/2],[0,q.y/-2,0],[0,q.y/2,0]];
		//var faces = [[0,1,2,3],[1,5,3,4],[2,5,0,4]];
		var faces = [[0,5,3,3],[3,5,2,2],[2,5,1,1],[1,5,0,0],[0,3,4,4],[3,2,4,4],[2,1,4,4],[1,0,4,4]];

	/*faces[0][5] = cr.RGB(200,200,255);
	faces[1][5] = cr.RGB(200,200,255);
	faces[2][5] = cr.RGB(200,255,200);
	faces[5][5] = cr.RGB(200,255,200);
	faces[3][5] = cr.RGB(255,200,200);
	faces[4][5] = cr.RGB(255,200,200);*/
	
	var mtx = [[1,0,0],[0,1,0],[0,0,1]]; // initial matrix
	
	//alert(mtx[0][0]);
	
	//var mtxt = [[],[],[]]; // temp matrix?
	var xsto;
	var ysto;
	//var zsto;
	
	var rotfunc = function(c){
		if(c==="X"){
			
			// X rotation
		
			rcos = Math.cos(xrot);
			rsin = Math.sin(xrot);
			
			for (var i = 0; i <= 2 ; i++) { 
			
			xsto = mtx[i][1]*rcos - mtx[i][2]*rsin
			ysto = mtx[i][1]*rsin + mtx[i][2]*rcos
			
			mtx[i][1] = xsto;
			mtx[i][2] = ysto;
			
			};
		};
		
		if(c==="Y"){
			
			// Y rotation
		
			rcos = Math.cos(yrot*-1); // needs this to work properly with rotations in actual runtime
			rsin = Math.sin(yrot*-1);
			
			for (var i = 0; i <= 2 ; i++) { 
			
			xsto = mtx[i][0]*rcos - mtx[i][2]*rsin
			ysto = mtx[i][0]*rsin + mtx[i][2]*rcos
			
			mtx[i][0] = xsto;
			mtx[i][2] = ysto;
		
			};
		};
		
		if(c==="Z"){
				
			// Z rotation
		
			rcos = Math.cos(zrot);
			rsin = Math.sin(zrot);
			
			for (var i = 0; i <= 2 ; i++) { 
			
			xsto = mtx[i][0]*rcos - mtx[i][1]*rsin
			ysto = mtx[i][0]*rsin + mtx[i][1]*rcos
			
			mtx[i][0] = xsto;
			mtx[i][1] = ysto;
			
			};
		};
	};
	
	/*// XYZ order rotation? calculate transform matrix about origin then shift by position
	
		// X rotation
	
		rcos = Math.cos(xrot);
		rsin = Math.sin(xrot);
		
		for (var i = 0; i <= 2 ; i++) { 
		
		xsto = mtx[i][1]*rcos - mtx[i][2]*rsin
		ysto = mtx[i][1]*rsin + mtx[i][2]*rcos
		
		mtx[i][1] = xsto;
		mtx[i][2] = ysto;
		
		};
	
		// Y rotation
	
		rcos = Math.cos(yrot);
		rsin = Math.sin(yrot);
		
		for (var i = 0; i <= 2 ; i++) { 
		
		xsto = mtx[i][0]*rcos - mtx[i][2]*rsin
		ysto = mtx[i][0]*rsin + mtx[i][2]*rcos
		
		mtx[i][0] = xsto;
		mtx[i][2] = ysto;
		
		};
		
		// Z rotation
	
		rcos = Math.cos(zrot);
		rsin = Math.sin(zrot);
		
		for (var i = 0; i <= 2 ; i++) { 
		
		xsto = mtx[i][0]*rcos - mtx[i][1]*rsin
		ysto = mtx[i][0]*rsin + mtx[i][1]*rcos
		
		mtx[i][0] = xsto;
		mtx[i][1] = ysto;
		
		};
		
	/////////////////////////////////////////*/
	
	rotfunc(this.properties["Rotation Order"].charAt(2));
	rotfunc(this.properties["Rotation Order"].charAt(1));
	rotfunc(this.properties["Rotation Order"].charAt(0));
	
	/////////////////////////////////////////

	//renderer.Outline(quad, cr.RGB(128,128,128));
	
	for (var i = 0; i < verts.length ; i++) { 
	
	xsto = verts[i][0]*mtx[0][0]+verts[i][1]*mtx[1][0]+verts[i][2]*mtx[2][0]
	ysto = verts[i][0]*mtx[0][1]+verts[i][1]*mtx[1][1]+verts[i][2]*mtx[2][1]
	
	XmaxExtent = Math.max(XmaxExtent,xsto);
	YmaxExtent = Math.max(YmaxExtent,ysto);
	
	verts[i][2] = verts[i][0]*mtx[0][2]+verts[i][1]*mtx[1][2]+verts[i][2]*mtx[2][2]+zpos;
	verts[i][0] = xsto+xpos;
	verts[i][1] = ysto+ypos;
	
	};
	
	//draw circle
	
	xsto = new cr.vector2(20,0);
	ysto = new cr.vector2(20,0);

	rcos = Math.cos((Math.PI/4.5))
	rsin = Math.sin((Math.PI/4.5))
	
	for (var i = 0; i < 9 ; i++) {
	
	xsto.x = ysto.x*rcos - ysto.y*rsin;
	xsto.y = ysto.x*rsin + ysto.y*rcos;
	
	renderer.Line(new cr.vector2(xpos+xsto.x,ypos+xsto.y), new cr.vector2(xpos+ysto.x,ypos+ysto.y), cr.RGB(200,200,200));
	
	ysto = new cr.vector2(xsto.x,xsto.y);
		
	};
	
	renderer.Outline(quad, cr.RGB(200,200,200));
	
	//Project everything (LOOKS CONFUSING IN WIREFRAME)
	/*
	for (var i = 0; i <= 7 ; i++) {
	
	verts[i][0] += verts[i][2]*0.1
	verts[i][1] += verts[i][2]*0.1
	
	};
	
	for (var i = 0; i <= 2 ; i++) {
	
	mtx[i][0] += mtx[i][2]*0.1
	mtx[i][1] += mtx[i][2]*0.1
	
	};
	
	xpos += zpos*0.1;
	ypos += zpos*0.1;
	*/
	
	
	//renderer.Line(new cr.vector2(xpos,ypos), new cr.vector2(xpos+(mtx[1][0])*50,ypos+(mtx[1][1])*50), mtx[1][3]);
	//renderer.Line(new cr.vector2(xpos,ypos), new cr.vector2(xpos+(mtx[2][0])*50,ypos+(mtx[2][1])*50), mtx[2][3]);
	
	// Draw/Sort Faces for colliders
	
	for (var k = 0; k < faces.length ; k++) {
	
	faces[k][4] = [0,0,0];
	faces[k][6] = [0,0,0];
	
	faces[k][6][0] = (verts[ faces[k][0] ][1]-verts[ faces[k][1] ][1])*(verts[ faces[k][3] ][2]-verts[ faces[k][1] ][2])-(verts[ faces[k][0] ][2]-verts[ faces[k][1] ][2])*(verts[ faces[k][3] ][1]-verts[ faces[k][1] ][1]);
	faces[k][6][1] = (verts[ faces[k][0] ][2]-verts[ faces[k][1] ][2])*(verts[ faces[k][3] ][0]-verts[ faces[k][1] ][0])-(verts[ faces[k][0] ][0]-verts[ faces[k][1] ][0])*(verts[ faces[k][3] ][2]-verts[ faces[k][1] ][2]);
	faces[k][6][2] = (verts[ faces[k][0] ][0]-verts[ faces[k][1] ][0])*(verts[ faces[k][3] ][1]-verts[ faces[k][1] ][1])-(verts[ faces[k][0] ][1]-verts[ faces[k][1] ][1])*(verts[ faces[k][3] ][0]-verts[ faces[k][1] ][0]);//calculate normal z to determine which direction its facing
	//faces[k][5] = cr.RGB(100+(k/5)*100,100+(k/5)*100,100+(k/5)*100);
	
	//faces[k][4][0] = (verts[ faces[k][0] ][0]+verts[ faces[k][1] ][0]+verts[ faces[k][2] ][0]+verts[ faces[k][3] ][0])/4;
	//faces[k][4][1] = (verts[ faces[k][0] ][1]+verts[ faces[k][1] ][1]+verts[ faces[k][2] ][1]+verts[ faces[k][3] ][1])/4;
	faces[k][4][2] = (verts[ faces[k][0] ][2]+verts[ faces[k][1] ][2]+verts[ faces[k][2] ][2]+verts[ faces[k][3] ][2])/4;
	
	};
	
	faces.sort(function(a, b){ return a[4][2]-b[4][2]});
	
	var fq = new cr.quad;
	var light = [1,1,1];
	ztemp = 1/Math.sqrt(light[0]*light[0]+light[1]*light[1]+light[2]*light[2]);
	light = [light[0]*ztemp,light[1]*ztemp,light[2]*ztemp];
	
	for (var k = 0; k < faces.length ; k++) {
	
	if(faces[k][6][2]<0){
	
	fq.tlx = verts[faces[k][0]][0]
	fq.tly = verts[faces[k][0]][1]
	
	fq.trx = verts[faces[k][1]][0]
	fq.try_ = verts[faces[k][1]][1]
	
	fq.brx = verts[faces[k][2]][0]
	fq.bry = verts[faces[k][2]][1]
		
	fq.blx = verts[faces[k][3]][0]
	fq.bly = verts[faces[k][3]][1]
	
	renderer.Outline(fq,cr.RGB(0,0,0));
	
	};
	
	};
	
	//triad
	
	mtx[0][3] = cr.RGB(255,0,0);
	mtx[1][3] = cr.RGB(0,205,0);
	mtx[2][3] = cr.RGB(0,0,255);
	
	// sort by z value so lower arms show below higher ones (or else confusing)
	var fq = new cr.quad; 
	
	mtx.sort(function(a, b){ return b[2]-a[2]});
	for (var i = 0; i <= 2 ; i++) {
	renderer.Line(new cr.vector2(xpos,ypos), new cr.vector2(xpos+(mtx[i][0])*50,ypos+(mtx[i][1])*50), mtx[i][3]);
	
	var scale = ((mtx[i][2]*-1+3)/3)*5
	
	fq.tlx = xpos+mtx[i][0]*50 -scale;
	fq.tly = ypos+mtx[i][1]*50 -scale;
	
	fq.trx = xpos+mtx[i][0]*50 +scale;
	fq.try_ = ypos+mtx[i][1]*50 -scale;
	
	fq.brx = xpos+mtx[i][0]*50 +scale;
	fq.bry = ypos+mtx[i][1]*50 +scale;
	
	fq.blx = xpos+mtx[i][0]*50 -scale;
	fq.bly = ypos+mtx[i][1]*50 +scale;
	
	renderer.Fill(fq,mtx[i][3]);
	};		
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}