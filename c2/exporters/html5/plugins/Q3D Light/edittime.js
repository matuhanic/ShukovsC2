function GetPluginSettings()
{
	return {
		"name":			"Q3D\nLight",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"Q3Dlight",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"2.4",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"A general object for controlling/placing different kinds of lights",
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


AddCondition(0, cf_none, "Is in 'only shadow' mode", "Shadows", "Is in 'only shadow' mode", "Returns true if the light is in only shadow mode", "TestOnlyShadow");

AddComboParamOption("Ambient");
AddComboParamOption("Hemisphere");
AddComboParamOption("Point");
AddComboParamOption("Directional");
AddComboParamOption("Spot");
AddComboParam("Type", "Choose the type to check for.", initial_string = "0")
AddCondition(1, cf_none, "Is type", "Misc", "Is light type : <b>{0}</b>", "Returns true if the light is the selected type", "TestType");

AddCondition(2, cf_none, "Is casting shadows", "Shadows", "Is casting shadows", "Returns true if the light is casting shadows", "TestCastShadow");

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

AddNumberParam("Color", "Color of this light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddAction(0, af_none, "Set light color", "Light properties (general)", "Set light color to ({0}).", "All light types have a primary color which can be changed through this action.", "LightSetColor");

AddNumberParam("Ground color", "ground color of this light (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddAction(1, af_none, "Set light ground color", "Light properties (hemisphere)", "Set hemisphere light ground color to ({0}).", "Hemisphere lights have a sky color and a ground color, set the ground color with this action", "LightSetGroundColor");

AddNumberParam("Intensity", "Intensity of this light", initial_string = "1")
AddAction(2, af_none, "Set light intensity", "Light properties (general)", "Set light intensity to ({0}).", "Most light types have an intensity which can be changed through this action.", "LightSetIntensity");

AddNumberParam("Distance", "If non-zero, light will attenuate linearly from maximum intensity at light position down to zero at distance", initial_string = "0")
AddAction(3, af_none, "Set light distance", "Light properties (general)", "Set light falloff distance to ({0}).", "Some light types have a falloff distance which can be changed through this action.", "LightSetDistance");

AddNumberParam("Angle", "Cone angle of the spot light (should not exceed 180, as this is the maximum possible extent)", initial_string = "90")
AddAction(4, af_none, "Set light angle", "Light properties (spotlight)", "Set spotlight cone angle to ({0}).", "Spot lights have a light cone of a specified angular size which can be changed through this action.", "LightSetAngle");

AddNumberParam("Spot exponent", "Rapidity of the falloff of light from its target direction (affects how soft the edges of the spot are)", initial_string = "10")
AddAction(5, af_none, "Set spot exponent", "Light properties (spotlight)", "Set spotlight exponent to ({0}).", "Adjust the sharpness of the edges of the spotlight spot / cone.", "LightSetExponent");

AddComboParamOption("light + shadows");
AddComboParamOption("only shadows");
AddComboParam("Shadow", "Choose whether this light shows only shadows or also contributes lighting", initial_string = "0")
AddAction(6, af_none, "Set 'shadow only'", "Shadow properties", "Set light shadow mode to <b>({0})</b>.", "Lights that cast shadows can optionally be set to only cast shadows without being computed as lights", "SetOnlyShadow");

AddNumberParam("Darkness", "The shadow darkness (from 0 to 1)", initial_string = "0.5")
AddAction(7, af_none, "Shadow darkness", "Shadow properties", " Set shadow darkness to ({0}).", "Control how dark projected shadows are", "SetShadowDark");

AddNumberParam("Bias", "Shadow map bias, small values have a large effect", initial_string = "0")
AddAction(8, af_none, "Shadow bias", "Shadow properties", "Set shadow bias to ({0}).", "Control the shadow map biasing to prevent shadow acne / alleviate moire patterns / fix artefacts", "SetShadowBias");

AddNumberParam("Map width", "The shadow map width (pixels)", initial_string = "512")
AddNumberParam("Map height", "The shadow map height (pixels)", initial_string = "512")
AddAction(9, af_none, "Shadow map size", "Shadow properties", "Set shadow map size to ({0},{1}).", "If the light is using shadow maps, adjust the texture resolution", "SetShadowMapSize");

AddNumberParam("Angle", "Value in degrees, only used with spotlight shadow camera.", initial_string = "90")
AddNumberParam("Width", "Shadow camera frustum width, only used with directional light shadow camera.", initial_string = "500")
AddNumberParam("Height", "Shadow camera frustum height, only used with directional light shadow camera.", initial_string = "500")
AddNumberParam("Near plane", "Shadow camera frustum near plane distance in z-axis units.", initial_string = "1")
AddNumberParam("Far plane", "Shadow camera frustum far plane distance in z-axis units.", initial_string = "5000")
AddAction(10, af_none, "Set shadow frustum", "Shadow properties", "Set shadow camera frustum to ({0},{1},{2},{3},{4}).", "If the light is using shadow maps, adjust the shadow camera frustum", "SetShadowCamFrustum");


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

AddExpression(0, ef_return_number, "", "Light properties (general)", "color", "Return the hex value color of the light");

AddExpression(1, ef_return_number, "", "Light properties (hemisphere)", "groundColor", "Return the hex value groundColor of a hemisphere light");

AddExpression(2, ef_return_number, "", "Light properties (general)", "intensity", "Return the intensity of the light");

AddExpression(3, ef_return_number, "", "Light properties (general)", "distance", "Return the falloff distance of the light");

AddExpression(4, ef_return_number, "", "Light properties (spotlight)", "coneAngle", "Return the cone angle of a spotlight");

AddExpression(5, ef_return_number, "", "Light properties (spotlight)", "exponent", "Return the spot falloff exponent of a spotlight");

AddExpression(6, ef_return_number, "", "Shadow properties", "darkness", "Return the darkness of the shadows this light is casting");

AddExpression(7, ef_return_number, "", "Shadow properties", "bias", "Return the shadow bias of this light");

AddExpression(8, ef_return_number, "", "Shadow properties", "SMapX", "Return the shadow map x size");

AddExpression(9, ef_return_number, "", "Shadow properties", "SMapY", "Return the shadow map y size");

AddExpression(10, ef_return_number, "", "Shadow camera", "SCamAngle", "Return the shadow camera angular frustum size (spotlight only)");

AddExpression(11, ef_return_number, "", "Shadow camera", "SCamX", "Return the shadow camera frustum x size (directional light only)");

AddExpression(12, ef_return_number, "", "Shadow camera", "SCamY", "Return the shadow camera frustum y size (directional light only)");

AddExpression(13, ef_return_number, "", "Shadow camera", "SCamNear", "Return the shadow camera frustum near distance");

AddExpression(14, ef_return_number, "", "Shadow camera", "SCamFar", "Return the shadow camera frustum far distance");


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
		new cr.Property(ept_float, 	"Z Size",		50,		"Z Scaling of the 3D object"),
	
	new cr.Property(ept_section, "Debug properties", "",	"Properties to help with debugging the 3D object in the editor and at runtime."),
		new cr.Property(ept_combo, 	"Debug",		"On",		"Show a helper at runtime","On|Off"),
		
	new cr.Property(ept_section, "Light properties", "",	"Properties affecting the light."),
		new cr.Property(ept_combo, 	"Type",		"Point",		"Choose what kind of light this will be.","Ambient|Hemisphere|Point|Directional|Spot"),
		new cr.Property(ept_color, 	"Color",		0xFFFFFF,		"Choose the primary color of this light."),
		new cr.Property(ept_float, 	"Intensity",		"1",		"Choose the intensity of the light (does not affect ambient lights)."),
		new cr.Property(ept_float, 	"Falloff Distance",		"0",		"If non-zero, light will attenuate linearly from maximum intensity at light position down to zero at distance. (does not affect ambient / hemisphere / directional lights)."),
		new cr.Property(ept_text, 	"Target",		"0, 0, 0",		"3D position that spot / directional lights point towards."),
	
	new cr.Property(ept_section, "Hemisphere properties", "",	"Unique properties affecting hemisphere lights."),
		new cr.Property(ept_color, 	"Ground Color",		0xFF80FF ,		"Choose the ground color of a hemisphere light if it is the selected type."),
		
	new cr.Property(ept_section, "Spotlight properties", "",	"Unique properties affecting spot lights."),
		new cr.Property(ept_float, 	"Angle",		"90",		"Maximum extent of the spotlight, in degrees, from its direction. Should be no more than 180."),
		new cr.Property(ept_float, 	"Falloff Exponent",		"10",		"Rapidity of the falloff of light from its target direction (affects how soft the edges of the spot are)."),
		
	new cr.Property(ept_section, "Shadow properties", "",	"Properties dealing with light's that can cast shadows (affects directional and spot lights)."),
		new cr.Property(ept_combo, 	"Cast Shadows",		"No",		"If set to Yes, light will cast dynamic shadows. Warning: This is expensive and requires tweaking to get shadows looking right.","Yes|No"),
		new cr.Property(ept_combo, 	"Only Shadows",		"No",		"If set to Yes light will only cast shadows but not contribute any lighting (as if intensity was 0 but cheaper to compute).","Yes|No"),
		new cr.Property(ept_float, 	"Shadow Cam Near",		"1",		"Distance from light defining the near part of the shadow camera frustum / box"),
		new cr.Property(ept_float, 	"Shadow Cam Far",		"5000",		"Distance from light defining the far part of the shadow camera frustum / box"),
		new cr.Property(ept_text, 	"Shadow Cam Size / Angle",		"500, 500",		"Size of the shadow camera box for directional lights / field of view of the shadow camera for spot lights"),
		new cr.Property(ept_float, 	"Shadow Bias",		"0",		"Shadow map biasing to improve the look of shadows if they are drawing strangely (do not modify without reason)"),
		new cr.Property(ept_float, 	"Shadow Darkness",		"0.5",		"Darkness of shadow casted by this light (from 0 to 1)"),
		new cr.Property(ept_text, 	"Shadow Map Size",		"512, 512",		"Shadow map texture width / height in pixels. Larger maps give nicer shadows, at a greater rendering cost"),
		
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
	this.instance.SetSize(new cr.vector2(50, 50));
	
		this.targetx = 0;
		this.targety = 0;
		this.targetz = 0;
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	var i,len;
	var txt,chr;
	var csvi;
	var count;
	var val1,val2,val3
	var regexp;
	
    if (property_name === "Target")
	{
        			/*BalloonTipLastProperty("Reminder",
								   "Ensure the model file is added to the construct files folder, and is a valid .js or .obj model.",
								   bti_info);*/
		// process three values of the target position to ensure they are numbers when modified					   
		txt = this.properties["Target"]
		csvi = [];
		count = 0;
		regexp = /\s+/g
		txt = txt.replace(regexp, '')
		//alert(txt);
		
		for (i = 0, len = txt.length; i < len; i++) {
		chr = txt.charAt(i);
			if(chr === ","){
			csvi.push(i)
			count ++
			};
		
		if(count === 2) break;
		};
		
		if(count === 0){
		val1 = Number(txt);
		val2 = 0;
		val3 = 0;
		}else if(count === 1){
		val1 =  Number(txt.substring(0,csvi[0]));
		val2 =  Number(txt.substring(csvi[0]+1,csvi[1]));
		val3 = 0;
		}else{
		val1 =  Number(txt.substring(0,csvi[0]));
		val2 =  Number(txt.substring(csvi[0]+1,csvi[1]));
		val3 =  Number(txt.substring(csvi[1]+1,len));
		};
		
		if(isNaN(val1)) val1 = 0;
		if(isNaN(val2)) val2 = 0;
		if(isNaN(val3)) val3 = 0;
		
		this.properties["Target"] = val1+", "+val2+", "+val3;
		
		// dump value so draw can use it without having to parse each draw call;
		this.targetx = val1;
		//alert(this.targetx);
		this.targety = val2;
		this.targetz = val3;
		
    }else if(property_name === "Shadow Map Size"){

		txt = this.properties["Shadow Map Size"];
		csvi = [];
		count = 0;
		regexp = /\s+/g
		txt = txt.replace(regexp, '');
		//alert(txt);
		
		for (i = 0, len = txt.length; i < len; i++) {
		chr = txt.charAt(i);
			if(chr === ","){
			csvi.push(i)
			count ++
			};
		
		if(count === 1) break;
		};
		
		if(count === 0){
		val1 = Number(txt);
		val2 = 0;
		val3 = 0;
		}else if(count === 1){
		val1 =  Number(txt.substring(0,csvi[0]));
		val2 =  Number(txt.substring(csvi[0]+1,csvi[1]));
		};
		
		if(isNaN(val1)) val1 = 0;
		if(isNaN(val2)) val2 = 0;
		
		this.properties["Shadow Map Size"] = val1+", "+val2
		
		// dump value so draw can use it without having to parse each draw call;
		this.shadmapx = val1;
		this.shadmapy = val2;

	}else if(property_name === "Type"){
	
		if(this.properties["Type"] === "Directional"){
			this.properties["Shadow Cam Size / Angle"] = "500, 500"
		}else if(this.properties["Type"] === "Spot"){
			this.properties["Shadow Cam Size / Angle"] = ""+this.properties["Angle"] 
		};
	
	}
	
	if(property_name === "Shadow Cam Size / Angle" || property_name === "Type"){
	
		if(this.properties["Type"] === "Directional"){
		
			txt = this.properties["Shadow Cam Size / Angle"];
			csvi = [];
			count = 0;
			regexp = /\s+/g
			txt = txt.replace(regexp, '');
			//alert(txt);
			
			for (i = 0, len = txt.length; i < len; i++) {
			chr = txt.charAt(i);
				if(chr === ","){
				csvi.push(i)
				count ++
				};
			
			if(count === 1) break;
			};
			
			if(count === 0){
			val1 = Number(txt);
			val2 = 0;
			val3 = 0;
			}else if(count === 1){
			val1 =  Number(txt.substring(0,csvi[0]));
			val2 =  Number(txt.substring(csvi[0]+1,csvi[1]));
			};
			
			if(isNaN(val1)) val1 = 0;
			if(isNaN(val2)) val2 = 0;
			
			this.properties["Shadow Cam Size / Angle"] = val1+", "+val2
			
			// dump value so draw can use it without having to parse each draw call;
				this.scfrustx = val1;
				this.scfrusty = val2;
				
		}else if(this.properties["Type"] === "Spot"){
		
			txt = this.properties["Shadow Cam Size / Angle"];
			regexp = /\s+/g
			txt = txt.replace(regexp, '');

			val1 = Number(txt);
			
			if(isNaN(val1)) val1 = 0;
			
			this.properties["Shadow Cam Size / Angle"] = ""+val1
			
			// dump value so draw can use it without having to parse each draw call;
			this.scang = val1;
		
		}else{
		
			//this.properties["ShadowCam Size / Angle"] = 'N / A'
		
		};
	
	};

};

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

var cpr = [0,0,0];
var up = [0,-1,0];
var cross = function (a,b){

cpr[0] = a[1]*b[2] - a[2]*b[1];
cpr[1] = a[2]*b[0] - a[0]*b[2];
cpr[2] = a[0]*b[1] - a[1]*b[0];

/*if(cpr[0] === 0 && cpr[1] === 0 && cpr[2] === [0]){
cpr[0] = a[0];
cpr[1] = a[1];
cpr[2] = a[2];
alert("test");
}*/

};

var linefunc = function(renderer,xpos,ypos){	

		fq = new cr.quad;

		renderer.Line(new cr.vector2(xpos,ypos+1), new cr.vector2(this.targetx,this.targety+1), 0);
		renderer.Line(new cr.vector2(xpos,ypos-1), new cr.vector2(this.targetx,this.targety-1), 0);
		renderer.Line(new cr.vector2(xpos+1,ypos), new cr.vector2(this.targetx+1,this.targety), 0);
		renderer.Line(new cr.vector2(xpos-1,ypos), new cr.vector2(this.targetx-1,this.targety), 0);
		renderer.Line(new cr.vector2(xpos,ypos), new cr.vector2(this.targetx,this.targety), this.properties["Color"]);
		
		fq.tlx = this.targetx;
		fq.tly = this.targety-8;
		
		fq.trx =  this.targetx+8;
		fq.try_ = this.targety;
		
		fq.blx = this.targetx-8;
		fq.bly = this.targety;
		
		fq.brx =  this.targetx;
		fq.bry =  this.targety+8;

		renderer.Fill(fq, cr.RGB(255,255,255));
		renderer.Outline(fq, 0);
		
	
};

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{

	var fq = new cr.quad;
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
	

	

	var maxExtent = Math.max(Math.abs(q.x),Math.abs(q.y),Math.abs(zsize));
	
	var XmaxExtent = 0;
	var YmaxExtent = 0;
	
	//var outlineCol = cr.RGB(0,0,0);
	
	// Make debug object
	
		//var verts = [[q.x/2,q.y/2,zsize/2],[q.x/-2,q.y/2,zsize/2],[q.x/-2,q.y/-2,zsize/2],[q.x/2,q.y/-2,zsize/2]   ,   [q.x/2,q.y/2,zsize/-2],[q.x/-2,q.y/2,zsize/-2],[q.x/-2,q.y/-2,zsize/-2],[q.x/2,q.y/-2,zsize/-2]]; // list of vertices of object
		//var faces = [[3,2,1,0],[4,5,6,7],[5,4,0,1],[3,0,4,7],[2,6,5,1],[2,3,7,6]];
		
		//var verts = [[q.x/2,0,0],[0,0,zsize/2],[q.x/-2,0,0],[0,0,zsize/-2],[0,q.y/2,0],[0,q.y/-2,0]];
		
		if(this.properties["Type"] === "Point"){
			var verts = [[q.x/-2,0,0],[0,0,zsize/-2],[q.x/2,0,0],[0,0,zsize/2],[0,q.y/-2,0],[0,q.y/2,0]];
			var faces = [[0,5,3,3],[3,5,2,2],[2,5,1,1],[1,5,0,0],[0,3,4,4],[3,2,4,4],[2,1,4,4],[1,0,4,4]];
		}else if(this.properties["Type"] === "Ambient"){
		
		var hsegs = 4;
		var csegs = 10;
		var xrad = q.x;
		var yrad = q.y;
		var zrad = zsize;
		
		for (var z = -1*hsegs+1; z <= hsegs-1 ; z++) {
		
			ztemp = Math.cos((z/hsegs)*Math.PI/2);
			xtemp = Math.sin((z/hsegs)*Math.PI/2);
		
			for (var i = 0; i < csegs ; i++) {
			
				rcos = Math.cos((i/csegs)*(2*Math.PI));
				rsin = Math.sin((i/csegs)*(2*Math.PI));
				
				verts.push([rcos*ztemp*xrad/2,xtemp*yrad/-2,rsin*ztemp*zrad/2]);
			
			};
		};
		
		verts.push([0,yrad/-2,0]);
		verts.push([0,yrad/2,0]);
		
		for (var z = -1*hsegs+1; z <= hsegs-2 ; z++) {
			for (var i = 0; i < csegs ; i++) {
			
				faces.push([(z+hsegs-1)*csegs+i,(z+hsegs-1+1)*csegs+i,(z+hsegs-1+1)*csegs+((i+1)%csegs),(z+hsegs-1)*csegs+((i+1)%csegs)]);
			
			};
		};
		
		for (var i = 0; i < csegs ; i++) {
		
			faces.push([i,(i+1)%csegs,verts.length-1,verts.length-1]);
			faces.push([(hsegs*2-2)*csegs+i,verts.length-2,verts.length-2,(hsegs*2-2)*csegs+(i+1)%csegs]);
		
		};
	}else if(this.properties["Type"] === "Hemisphere"){
		
		var hsegs = 2;
		var csegs = 5;
		var xrad = q.x;
		var yrad = q.y;
		var zrad = zsize;
		
		for (var z = -1*hsegs+1; z <= hsegs-1 ; z++) {
		
			ztemp = Math.cos((z/hsegs)*Math.PI/2);
			xtemp = Math.sin((z/hsegs)*Math.PI/2);
		
			for (var i = 0; i < csegs ; i++) {
			
				rcos = Math.cos((i/csegs)*(2*Math.PI));
				rsin = Math.sin((i/csegs)*(2*Math.PI));
				
				//verts.push([rcos*ztemp*xrad/2,xtemp*yrad/-2,rsin*ztemp*zrad/2]);
				verts.push([rcos*ztemp*xrad/-2,rsin*ztemp*yrad/-2,xtemp*zrad/2]);
			
			};
		};
		
		//verts.push([0,yrad/-2,0]);
		//verts.push([0,yrad/2,0]);
		verts.push([0,0,zrad/2]);
		verts.push([0,0,zrad/-2]);

		for (var i = 0; i < csegs ; i++) {
		
			faces.push([i,(i+1)%csegs,verts.length-1,verts.length-1]);
			//faces.push([(hsegs*2-2)*csegs+i,verts.length-2,verts.length-2,(hsegs*2-2)*csegs+(i+1)%csegs]);
		
		};
		
		for (var z = -1*hsegs+1; z <= hsegs-2 ; z++) {
			for (var i = 0; i < csegs ; i++) {
			
				faces.push([(z+hsegs-1)*csegs+i,(z+hsegs-1+1)*csegs+i,(z+hsegs-1+1)*csegs+((i+1)%csegs),(z+hsegs-1)*csegs+((i+1)%csegs)]);
			
			};
		};
		
		for (var i = 0; i < csegs ; i++) {
		
			//faces.push([i,(i+1)%csegs,verts.length-1,verts.length-1]);
			faces.push([(hsegs*2-2)*csegs+i,verts.length-2,verts.length-2,(hsegs*2-2)*csegs+(i+1)%csegs]);
		
		};
		
	}else if(this.properties["Type"] === "Directional"){
		var verts = [[q.x/2,q.y/2,zsize/2],[q.x/-2,q.y/2,zsize/2],[q.x/-2,q.y/-2,zsize/2],[q.x/2,q.y/-2,zsize/2]   ,   [q.x/2,q.y/2,zsize/-2],[q.x/-2,q.y/2,zsize/-2],[q.x/-2,q.y/-2,zsize/-2],[q.x/2,q.y/-2,zsize/-2]]; // list of vertices of object
		var faces = [[3,2,1,0],[4,5,6,7],[5,4,0,1],[3,0,4,7],[2,6,5,1],[2,3,7,6]];
	}else if(this.properties["Type"] === "Spot"){
		
		var hsegs = 2;
		var csegs = 12;
		var xrad = q.x;
		var yrad = q.y;
		var zrad = zsize;
		
		for (var z = -1*(hsegs/2); z <= 1*(hsegs/2) ; z+=2) {
		
			ztemp = 1;//Math.cos((z/hsegs)*Math.PI/2);
			xtemp = z//Math.sin((z/hsegs)*Math.PI/2);

		
			for (var i = 0; i < csegs ; i++) {
			
				rcos = Math.cos((i/csegs)*(2*Math.PI));
				rsin = Math.sin((i/csegs)*(2*Math.PI));
				
				//verts.push([rcos*ztemp*xrad/2,xtemp*yrad/-2,rsin*ztemp*zrad/2]);
				verts.push([rcos*ztemp*xrad/-2,rsin*ztemp*yrad/-2,xtemp*zrad/2]);
			
			};
		};
		
		//verts.push([0,yrad/-2,0]);
		//verts.push([0,yrad/2,0]);
		verts.push([0,0,zrad/2]);
		verts.push([0,0,zrad/-2]);

		for (var i = 0; i < csegs ; i++) {
		
			faces.push([i,(i+1)%csegs,verts.length-1,verts.length-1]);
			//faces.push([(hsegs*2-2)*csegs+i,verts.length-2,verts.length-2,(hsegs*2-2)*csegs+(i+1)%csegs]);
		
		};
		
		//for (var z = -1*(hsegs/2); z <= 1*(hsegs/2) ; z+=2) {
			for (var i = 0; i < csegs ; i++) {
			
				//faces.push([(z+hsegs-1)*csegs+i,(z+hsegs-1+1)*csegs+i,(z+hsegs-1+1)*csegs+((i+1)%csegs),(z+hsegs-1)*csegs+((i+1)%csegs)]);
				faces.push([csegs+i,csegs+(1+i)%csegs,(1+i)%csegs,0+i]);
			
			};
		//};
		
		for (var i = 0; i < csegs ; i++) {
		
			//faces.push([i,(i+1)%csegs,verts.length-1,verts.length-1]);
			faces.push([csegs+i,verts.length-2,verts.length-2,csegs+(i+1)%csegs]);
		
		};
	}

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
	if(this.properties["Type"] === "Hemisphere"){ // unique behaviour to hemisphere lights, just to make it a bit more obvious how they work (THREE.js makes them use their position relative to the origin rather than their z direction);
		this.targetx = 0;
		this.targety = 0;
		this.targetz = 0;	
	}
	
	if(this.properties["Type"] === "Directional" || this.properties["Type"] === "Spot" || this.properties["Type"] === "Hemisphere"){ // look at behaviour, so content in editor matches reality better
	
	xsto = 1/Math.sqrt( (this.targetx - xpos)*(this.targetx - xpos) + (this.targety - ypos)*(this.targety - ypos) + (this.targetz - zpos)*(this.targetz - zpos) ) 
	//xsto = Math.sqrt((this.targetx ));
	//alert(xo);
	
	mtx[2][0] = (this.targetx - xpos)*xsto
	mtx[2][1] = (this.targety - ypos)*xsto
	mtx[2][2] = (this.targetz - zpos)*xsto
	
	ysto = Math.sqrt(mtx[2][0]*mtx[2][0]+mtx[2][1]*mtx[2][1]+mtx[2][2]*mtx[2][2])
	if(ysto === 0 || isNaN(ysto)){// sort of copied from three.js mtx4.lookAt so it behaves same way
	//alert('test');
	mtx[2][0] = 0;
	mtx[2][1] = 0;
	mtx[2][2] = 1;
	};
	
	cross(mtx[2],up);
	
	ysto = Math.sqrt( cpr[0]*cpr[0]+cpr[1]*cpr[1]+cpr[2]*cpr[2] )
	if(ysto === 0 || isNaN(ysto)){ // copied from three.js mtx4.lookAt so it behaves same way
		mtx[2][0] += 0.0001
		cross(mtx[2],up);
		ysto = Math.sqrt( cpr[0]*cpr[0]+cpr[1]*cpr[1]+cpr[2]*cpr[2] )
	}
	
	xsto = 1/ysto
	
	mtx[0][0] = cpr[0]*xsto;
	mtx[0][1] = cpr[1]*xsto;
	mtx[0][2] = cpr[2]*xsto;
	
	cross(mtx[2],mtx[0]);
	
	xsto = 1/Math.sqrt( cpr[0]*cpr[0]+cpr[1]*cpr[1]+cpr[2]*cpr[2] ) 
	
	mtx[1][0] = cpr[0]*xsto;
	mtx[1][1] = cpr[1]*xsto;
	mtx[1][2] = cpr[2]*xsto;
	
	if(this.targetz >= zpos && this.properties["Type"] !== "Hemisphere") linefunc.call(this,renderer,xpos,ypos);
	
	}else{
	
	rotfunc(this.properties["Rotation Order"].charAt(2));
	rotfunc(this.properties["Rotation Order"].charAt(1));
	rotfunc(this.properties["Rotation Order"].charAt(0));
	
	
	};
	
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
	faces[k][5] = k ;//cr.RGB(100+(k/5)*100,100+(k/5)*100,100+(k/5)*100);
	
	//faces[k][4][0] = (verts[ faces[k][0] ][0]+verts[ faces[k][1] ][0]+verts[ faces[k][2] ][0]+verts[ faces[k][3] ][0])/4;
	//faces[k][4][1] = (verts[ faces[k][0] ][1]+verts[ faces[k][1] ][1]+verts[ faces[k][2] ][1]+verts[ faces[k][3] ][1])/4;
	faces[k][4][2] = (verts[ faces[k][0] ][2]+verts[ faces[k][1] ][2]+verts[ faces[k][2] ][2]+verts[ faces[k][3] ][2])/4;
	
	};
	
	faces.sort(function(a, b){ return a[4][2]-b[4][2]});
	
	//var fq = new cr.quad;
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
	if( this.properties["Type"] === "Hemisphere" ){
		if(faces[k][5] < 10) renderer.Fill(fq,this.properties["Color"])
		else renderer.Fill(fq,this.properties["Ground Color"]);
	}else{
		renderer.Fill(fq,this.properties["Color"]);
	};
	
	if( this.properties["Type"] === "Spot" ){
		if(faces[k][5] < faces.length-csegs && faces[k][5] > csegs-1) renderer.Outline(fq,cr.RGB(0,0,0))
		else if(faces[k][5] < csegs )  renderer.Line(new cr.vector2(fq.tlx,fq.tly), new cr.vector2(fq.trx,fq.try_), 0 )
		else if(faces[k][5] > faces.length-csegs-1 )  renderer.Line(new cr.vector2(fq.tlx,fq.tly), new cr.vector2(fq.blx,fq.bly), cr.RGB(0,0,0) )
	}else{
		renderer.Outline(fq,cr.RGB(0,0,0));
	}
	
	};
	
	};

	// make a copy to use later...
	mtxc = [[mtx[0][0],mtx[0][1],mtx[0][2]],[mtx[1][0],mtx[1][1],mtx[1][2]],[mtx[2][0],mtx[2][1],mtx[2][2]]];
	
	//draw circle
	if(this.properties["Debug"] === 'On'){
		if(this.properties["Type"] === 'Point' && this.properties['Falloff Distance'] > 0){
			//alert('test');
			xsto = new cr.vector2(this.properties['Falloff Distance'],0);
			ysto = new cr.vector2(this.properties['Falloff Distance'],0);

			rcos = Math.cos((Math.PI/(30/2)))
			rsin = Math.sin((Math.PI/(30/2)))
			
			for (var i = 0; i < 30 ; i++) {
			
			xsto.x = ysto.x*rcos - ysto.y*rsin;
			xsto.y = ysto.x*rsin + ysto.y*rcos;
			
			if(i%2 === 0) renderer.Line(new cr.vector2(xpos+xsto.x,ypos+xsto.y), new cr.vector2(xpos+ysto.x,ypos+ysto.y), this.properties['Color'])
			else renderer.Line(new cr.vector2(xpos+xsto.x,ypos+xsto.y), new cr.vector2(xpos+ysto.x,ypos+ysto.y), cr.RGB(200,200,200))
			
			ysto = new cr.vector2(xsto.x,xsto.y);
				
			};
		
		}else if(this.properties["Type"] === 'Spot' && this.properties['Falloff Distance'] > 0){
			
			xsto = new cr.vector2(this.properties['Falloff Distance'],0);
			ysto = new cr.vector2(this.properties['Falloff Distance'],0);

			rcos = Math.cos((Math.PI/(30/2)))
			rsin = Math.sin((Math.PI/(30/2)))
			
			for (var i = 0; i < 30 ; i++) {
			
			xsto.x = ysto.x*rcos - ysto.y*rsin;
			xsto.y = ysto.x*rsin + ysto.y*rcos;
			
			if(i%2 === 0) renderer.Line(new cr.vector2(xpos+xsto.x,ypos+xsto.y), new cr.vector2(xpos+ysto.x,ypos+ysto.y), this.properties['Color'])
			else renderer.Line(new cr.vector2(xpos+xsto.x,ypos+xsto.y), new cr.vector2(xpos+ysto.x,ypos+ysto.y), cr.RGB(200,200,200))
			
			ysto = new cr.vector2(xsto.x,xsto.y);
				
			};
			
			// draw cone end
		
			xsto = new cr.vector2(1,0);
			ysto = new cr.vector2(1,0);
			
			xstot = new cr.vector2(0,0);
			ystot = new cr.vector2(0,0);
			
			//var conerad = Math.cos(this.properties['Angle']*0.5*(Math.PI/180))
			var dist = Math.cos(this.properties['Angle']*0.5*(Math.PI/180))*this.properties['Falloff Distance']
			var conerad = Math.tan(this.properties['Angle']*0.5*(Math.PI/180))*dist
			//rcos = Math.cos((Math.PI/(30/2)))
			//rsin = Math.sin((Math.PI/(30/2)))
			
			for (var i = 1, len = 30; i <= len ; i++) {
			
				//xsto.x = ysto.x*rcos - ysto.y*rsin;
				//xsto.y = ysto.x*rsin + ysto.y*rcos;
				
				xsto.x = conerad*Math.cos(((i/len)*Math.PI*2))
				xsto.y = conerad*Math.sin(((i/len)*Math.PI*2))
				
				ysto.x = conerad*Math.cos((((i-1)/len)*Math.PI*2))
				ysto.y = conerad*Math.sin((((i-1)/len)*Math.PI*2))
				
				xstot.x = xsto.x*mtxc[0][0] + xsto.y*mtxc[1][0] + mtxc[2][0]*dist
				xstot.y = xsto.x*mtxc[0][1] + xsto.y*mtxc[1][1] + mtxc[2][1]*dist
				
				ystot.x = ysto.x*mtxc[0][0] + ysto.y*mtxc[1][0] + mtxc[2][0]*dist
				ystot.y = ysto.x*mtxc[0][1] + ysto.y*mtxc[1][1] + mtxc[2][1]*dist
				
				renderer.Line(new cr.vector2(xpos,ypos), new cr.vector2(xpos+ystot.x,ypos+ystot.y), cr.RGB(200,200,200));
				
				if(i%2 === 0) renderer.Line(new cr.vector2(xpos+xstot.x,ypos+xstot.y), new cr.vector2(xpos+ystot.x,ypos+ystot.y), this.properties['Color'])
				else renderer.Line(new cr.vector2(xpos+xstot.x,ypos+xstot.y), new cr.vector2(xpos+ystot.x,ypos+ystot.y), cr.RGB(200,200,200))
				

				
				//ysto = new cr.vector2(xsto.x,xsto.y);
				
			};
		
		}
	};
	
	
	//triad
	
	mtx[0][3] = cr.RGB(255,0,0);
	mtx[1][3] = cr.RGB(0,205,0);
	mtx[2][3] = cr.RGB(0,0,255);
	
	// sort by z value so lower arms show below higher ones (or else confusing)
	if(this.properties["Type"] === 'Directional' || this.properties["Type"] === 'Spot'){
	if(this.targetz < zpos) linefunc.call(this,renderer,xpos,ypos);
	}
	
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