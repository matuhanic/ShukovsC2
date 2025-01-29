function GetPluginSettings() {
	return {
		"name": "3D Sound", // as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id": "babylonNewSound", // this is used to identify this plugin and is saved to the project; never change it
		"version": "1.0", // (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description": "Adds a 3D sound to the scene",
		"author": "X3M",
		"help url": "www.x3mworks.blogspot.com",
		"category": "Babylon3D", // Prefer to re-use existing categories, but you can set anything here
		"type": "world", // either "world" (appears in layout and is drawn), else "object"
		"rotatable": true, // only used when "type" is "world".  Enables an angle property on the object.
		"flags": 0 // uncomment lines to enable flags...
		//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
		//	| pf_texture			// object has a single texture (e.g. tiled background)
		 | pf_position_aces // compare/set/get x, y...
		 | pf_size_aces // compare/set/get width, height...
		 | pf_angle_aces // compare/set/get angle (recommended that "rotatable" be set to true)
		 | pf_appearance_aces // compare/set/get visible, opacity...
		// | pf_tiling // adjusts image editor features to better suit tiled images (e.g. tiled background)
		// | pf_animations // enables the animations system.  See 'Sprite' for usage
		 | pf_zorder_aces // move to top, bottom, layer...
		//  | pf_nosize				// prevent resizing in the editor
		//	| pf_effects			// allow WebGL shader effects to be added
		// | pf_predraw // set for any plugin which draws and is not a sprite (i.e. does not simply draw
		// a single non-tiling image the size of the object) - required for effects to work properly
	,
		"dependency": ""
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
//AddNumberParam("Number", "Enter a number to test if positive.");
//AddCondition(0, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition");

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
populateCommonACE();
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
	new cr.Property(ept_text, "Name", "TheSound", "A name to be assigned to this object, it just serves for identification purposes, the engine won't use it."),
	new cr.Property(ept_integer, "Scene UID", "0", "The scene UID in which this mesh should belong"),
	new cr.Property(ept_combo, "Default controller", "Babylon", "Choose which one will controll the position,size, angle and opacity of the mesh.By choosing Construc2 as controller, the default behaviours of C2 should be appliable to this mesh.", "Babylon|Construct2"),
new cr.Property(ept_section, "Sound properties", "", ""),
	new cr.Property(ept_text, "Filename", "sound.wav", "The name of the file with the extension"),
	new cr.Property(ept_float, "Z position", 0, "The mesh z position."),
	new cr.Property(ept_float, "Volume", 1, "The volume of the sound"),
	new cr.Property(ept_float, "Max distance", 100, "The max distance the sound can reach."),
	new cr.Property(ept_float, "Ref distance", 1, "The ref distance between the sound and its the source."),
	new cr.Property(ept_combo, "Loop", "False", "Set loop state.", "False|True"),
	new cr.Property(ept_combo, "Autoplay", "False", "Set autoplay state.", "False|True"),
	new cr.Property(ept_combo, "Spatial", "True", "Set spatial state.", "False|True"),
	new cr.Property(ept_float, "Rolloff factor", 1, "Fade out duration")
];

// Called by IDE when a new object type is to be createdm
function CreateIDEObjectType() {
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType() {
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function (instance) {
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type) {
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
IDEInstance.prototype.OnInserted = function () {
	this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
	//this.instance.SetPosition(new cr.vector2(0, 0));
	this.instance.SetSize(new cr.vector2(50, 50));

}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function () {
	//this.instance.EditTexture();
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function (property_name) {}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function (renderer) {
	this.font_str = "Arial,-16";
	var font_info = cr.ParseFontString(this.font_str);
	font_info.face_size = 10;
	this.font = renderer.CreateFont("Arial", font_info.face_size, false, false);
	//this.texture = this.instance.GetTexture(0);
	//renderer.LoadTexture(this.texture);
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function (renderer) {
	//this.texture = this.instance.GetTexture(0);
	//var texsize = this.texture.GetImageSize();
	//var tex = new cr.vector2(1.0 / texsize.x, 1.0 / texsize.y);
	//var uv = new cr.rect(-tex.x, -tex.y, 1.0 + tex.x, 1.0 + tex.y);
	var q = this.instance.GetBoundingQuad();
	var x = (q.tlx + q.trx + q.blx + q.brx) / 4;
	var y = (q.tly + q._try + q.bly + q.bry) / 4;
	var width = this.instance.GetSize().x;
	var height = this.instance.GetSize().y;
	// If there is a font present, draw it

	if (this.font != null) {
		//renderer.SetTexture(this.texture);
		renderer.Quad(q, this.instance.GetOpacity());
		this.font.DrawText(this.properties["Name"],
			q,
			cr.RGB(0, 0, 0),
			ha_left,
			1,
			0,
			true,
			0,
			va_top);
		renderer.Outline(q, cr.RGB(128,0,255));
		renderer.Outline(scale(q,1), cr.RGB(128,0,255));
		
		
	}
}

function scale(quad,factor)
{
	quad.tlx -= factor;
	quad.tly -= factor;
	quad.trx += factor;
	quad.try_ -= factor;
	quad.blx -= factor;
	quad.bly += factor;
	quad.brx += factor;
	quad.bry += factor;
	return quad;
}
		/* var vertices = [
			new Vertex(-1.0, -1.0, -1.0), // Front-Bottom-Left
			new Vertex(1.0, -1.0, -1.0), // Front-Bottom-Right
			new Vertex(-1.0, -1.0, 1.0), // Rear-Bottom-Left
			new Vertex(1.0, -1.0, 1.0), // Rear-Bottom-Right
			new Vertex(-1.0, 1.0, -1.0), // Front-Top-Left
			new Vertex(1.0, 1.0, -1.0), // Front-Top-Right
			new Vertex(-1.0, 1.0, 1.0), // Rear-Top-Left
			new Vertex(1.0, 1.0, 1.0) // Rear-Top-Right
		];

		var faces = [
			new Polygon([vertices[0], vertices[1], vertices[5], vertices[4]]), // Front
			new Polygon([vertices[2], vertices[3], vertices[7], vertices[6]]), // Rear
			new Polygon([vertices[0], vertices[1], vertices[3], vertices[2]]), // Bottom
			new Polygon([vertices[4], vertices[5], vertices[7], vertices[6]]), // Top
			new Polygon([vertices[0], vertices[2], vertices[6], vertices[4]]), // Left
			new Polygon([vertices[1], vertices[3], vertices[7], vertices[5]]) // Right
		];
		var rxy = this.properties["XY Rotation"].split(",");
		var a = Math.cos(rxy[0]*Math.PI/180);
		var b = Math.sin(rxy[1]*Math.PI/180);
		var fx = function (vertex) {
			return (vertex.x() * a + vertex.z() * a)* width / 2;
		};
		var fy = function (vertex) {
			return (vertex.y() + vertex.z() * b - vertex.x() * b)* height / 2;
		};

		for (var i = 0; i < faces.length; ++i) {
			drawPolygon(renderer, faces[i], fx, fy);
		} */

function drawPolygon(renderer, polygon, fx, fy) {
	for (var i = 0; i < polygon.count(); ++i) {
		if(i == polygon.count()-1)
		{
			renderer.Line(new cr.vector2(fx(polygon.vertex(i)), -1 * fy(polygon.vertex(i))), new cr.vector2(fx(polygon.vertex(0)), -1 * fy(polygon.vertex(0))), cr.RGB(0, 0, 255));
		}
		else
		{
			renderer.Line(new cr.vector2(fx(polygon.vertex(i)), -1 * fy(polygon.vertex(i))), new cr.vector2(fx(polygon.vertex(i + 1)), -1 * fy(polygon.vertex(i + 1))), cr.RGB(0, 0, 255));
		}
		
	}
}
function Vertex(x, y, z) {
	this.x = function () {
		return x;
	};
	this.y = function () {
		return y;
	};
	this.z = function () {
		return z;
	};
}

function Polygon(vertices) {
	this.count = function () {
		return vertices.length;
	};
	this.vertex = function (i) {
		if (i < 0) {
			throw new Error('Vertex index must be a positive integer')
		}
		if (i >= vertices.length) {
			throw new Error('Vertex index out of bounds');
		}
		return vertices[i];
	};
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function (renderer) {
	//renderer.ReleaseTexture(this.texture);
}
