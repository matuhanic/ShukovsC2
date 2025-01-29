function GetPluginSettings()
{
	return {
		"name":			"Radio & Checkbox",
		"id":			"RadioCheckButton",
		"version":    	"1.14",
		"description":	"Add a Radio or Checkbox button to your project",
		"author":		"Gregory Georges",
		"help url":		"http://dl.dropbox.com/u/27157668/construct2/help/RadioButton.html",
		"category":		"Form controls",
		"type":			"world",			// in layout
		"rotatable":	false,
		"flags":		pf_size_aces
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

//////////////////////////////////////////////////////////////
// Actions////////////////////////////////////////////////////

//set_tooltip
AddAnyTypeParam("Tooltip:", "Text to display in the tooltip", "\"\"");
AddAction (0, 0, "Change tooltip", "Group of Lines", "Set tooltip text to: {0}", "Set or change the text of the tooltip", "set_tooltip");
//set_text
AddAnyTypeParam("Text of the line:", "Text of the line to change", "\"\"");
AddNumberParam("Set the ID of line:", "Set the ID of line ('0' for the first line", "0");
AddAction (1, 0, "Change text", "Line", "Set the line {1} to: {0}", "Change text of a line", "set_text");
//disabledLine
AddNumberParam("Set the ID of line:", "Set the ID of line ('0' for the first line, or for single type object)", "0");
AddAction (2, 0, "Disable a line", "Line", "Disable the line {0}", "Disable a line", "disabledLine");
//enabledLine
AddNumberParam("Set the ID of line:", "Set the ID of line ('0' for the first line, or for single type object)", "0");
AddAction (3, 0, "Enable a line", "Line", "Enable the line {0}", "Enable a line", "enabledLine");
//enabledInstance 
AddAction (6, 0, "Enable all lines", "Group of Lines", "Enable all lines", "Enable all lines of this instance", "enabledInstance");
//disabledInstance 
AddAction (7, 0, "Disable all lines", "Group of Lines", "Disable all lines", "Disable all lines of this instance", "disabledInstance");
//checkedLine
AddNumberParam("Set the ID of line:", "Set the ID of line ('0' for the first line, or for single type object)", "0");
AddAction (4, 0, "Check a line", "Line", "Check the line {0}", "Check a line", "checkedLine");
//uncheckedLine
AddNumberParam("Set the ID of line:", "Set the ID of line ('0' for the first line, or for single type object)", "0");
AddAction (5, 0, "Uncheck a line", "Line", "Uncheck the line {0}", "Uncheck a line", "uncheckedLine");
//checkedInstance
AddAction (8, 0, "Check all lines (Only for check buttons)", "Group of Lines", "Check all lines", "Check all lines of this instance (only for check buttons)", "checkedInstance");
//uncheckedInstance
AddAction (9, 0, "Uncheck all lines", "Group of Lines", "Uncheck all lines", "Uncheck all lines of this instance", "uncheckedInstance");



//////////////////////////////////////////////////////////////
// Conditions ////////////////////////////////////////////////

//isChecked
AddCondition(0, 0, "is checked?", "General", "Is a line checked ?", "Check if a line is checked", "isChecked");
//isEnabled
AddCondition(1, 0, "is enabled?", "General", "Is a line enabled ?", "Check if a line is enabled", "isEnabled");



//////////////////////////////////////////////////////////////
// Expressions////////////////////////////////////////////////

//getLabel
AddNumberParam(">ID of line (for List Type)<", "Set the ID of line", "0");
AddExpression(0, ef_return_any, "Get text of a line", "General", "getLabel", "Return the text of a line");
//getNumberChecked
AddExpression(1, ef_return_number, "Get total of checked", "General", "getNumberChecked", "Return the total number of line which are checked");
//getIDChecked
AddExpression(2, ef_return_any, "Get ID of radio checked", "General", "getIDChecked", "Return the ID of the actual radio button is checked (only for radio buttons)");



ACESDone();


//////////////////////////////////////////////////////////////
//PROPERTIES//////////////////////////////////////////////////
var property_list = [
new cr.Property(ept_combo, "Type", "Radio Single", "Choose the type of button", "Radio Single|Radio List|Checkbox Single|Checkbox List"),//0
new cr.Property(ept_text, "Text", "", "Set the text of line(s), using separator if needed"), //1
new cr.Property(ept_text, "Separator", "//", "Set the separator that you need to separate lines in Text property"), //2
new cr.Property(ept_text, "Tooltip", "", "Leave blank for no tooltip"),//3
new cr.Property(ept_combo,	"Enabled", "Yes", "Choose whether the radio/checkbox button is enabled or disabled on startup", "No|Yes"),//4
new cr.Property(ept_color, "Font color", cr.RGB(0,0,0), "Choose the color of the font, black as default"),//5
new cr.Property(ept_integer, "z-Index", "1", "Set the z-Index for this instance") //6
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
	return new IDEInstance(instance, this);
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
	
	for (var i = 0; i < property_list.length; i++) //This loop just goes through the property list you defined above and sets the new instance of the object to default values.
		this.properties[property_list[i].name] = property_list[i].initial_value;
	
	this.just_inserted = false;
	this.font = null;
	this.drawingType = " ʘ ";
	this.uiColor = "cr.RGB(0, 0, 0)";
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(200, 22));
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	if (this.properties["Type"] == "Checkbox List" || this.properties["Type"] == "Checkbox Single") 
		{ 
			this.drawingType = " □ ";
		} else {
			this.drawingType = " ʘ ";
		};
		
	if (this.properties["Enabled"]=="No")
		{ 
			this.uiColor = cr.RGB(200, 200, 200);	
		}
	else if (this.properties["Enabled"]=="Yes")
		{
			this.uiColor = cr.RGB(0, 0, 0);
		};
		
	if (this.properties["Type"] == "Checkbox List" || this.properties["Type"] == "Radio List")
		{
			this.instance.SetSize(new cr.vector2(200, 70));
		}
		else if (this.properties["Type"] == "Checkbox Single" || this.properties["Type"] == "Radio Single")
		{
			this.instance.SetSize(new cr.vector2(200, 22));
		};
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
	var arrayRadioButton = new Array(); //créér une nouvelle array
	arrayRadioButton = this.properties["Text"].split(this.properties["Separator"]); //chaque | sera un séparateur, donc un new row sera créé
	

	
	if (!this.font)
		this.font = renderer.CreateFont("Arial", 16, false, false); 
		
	//renderer.SetTexture(null);
	var quad = this.instance.GetBoundingQuad();
	renderer.Fill(quad, cr.RGB(255, 255, 255));
	renderer.Outline(quad, this.uiColor ); 

	cr.quad.prototype.offset.call(quad, 0, 0);						 
	
	if (this.properties["Type"] == "Checkbox List" || this.properties["Type"] == "Radio List")
		{
			this.font.DrawText(this.drawingType+arrayRadioButton[0],
								quad,											
								this.uiColor, 	 
								ha_left);
			cr.quad.prototype.offset.call(quad, 0, 20);	
			this.font.DrawText(this.drawingType+arrayRadioButton[1],							
								quad,												 
								this.uiColor, 	  
								ha_left);
			cr.quad.prototype.offset.call(quad, 0, 20);	
			this.font.DrawText(this.drawingType+arrayRadioButton[2],							
								quad,												 
								this.uiColor, 	  
								ha_left);
			cr.quad.prototype.offset.call(quad, 0, 20);	
			this.font.DrawText(" ... ",							
								quad,												 
								this.uiColor, 	  
								ha_left);
		} 
		else if (this.properties["Type"] == "Checkbox Single" || this.properties["Type"] == "Radio Single")
		{
			this.font.DrawText(this.drawingType+this.properties["Text"],
									quad,											
									this.uiColor, 	 
									ha_left);
		};	
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;
}



