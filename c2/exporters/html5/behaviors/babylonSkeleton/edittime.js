function GetBehaviorSettings()
{
	return {
		"name":			"Skeleton",
		"id":			"babylonSkeleton",
		"version":		"1.0",
		"description":	"Add a skeleton to this mesh.",
		"author":		"X3M",
		"help url":		"",
		"category":		"Babylon Mesh",
		"flags":		0						// uncomment lines to enable flags...
						| bf_onlyone			// can only be added once to an object, e.g. solid
	};
};

//////////////////////////////////////////////////////////////
// Conditions
//////////////////////////////////////////////////////////////
// Actions
	var id = 0;
	AddNumberParam("Bone ID", "", initial_string = "0");
	AddNumberParam("X", "X.", initial_string = "0");
	AddNumberParam("Y", "Y.", initial_string = "0");
	AddNumberParam("Z", "Z.", initial_string = "0");
	AddAction(id, af_none, "Rotate bone", "Babylon Bone", "{my}: Rotate bone <b>({0})</b> by <b>({1},{2},{3})</b>.", "Set bone rotation.", "BoneRotate");
	id++;
	AddNumberParam("Bone ID", "", initial_string = "0");
	AddNumberParam("X", "X.", initial_string = "0");
	AddNumberParam("Y", "Y.", initial_string = "0");
	AddNumberParam("Z", "Z.", initial_string = "0");
	AddAction(id, af_none, "Scale bone", "Babylon Bone", "{my}: Scale bone <b>({0})</b> by <b>({1},{2},{3})</b>.", "Set bone scaling.", "BoneScale");
	id++;	
	AddNumberParam("Bone ID", "", initial_string = "0");	
	AddNumberParam("X", "X.", initial_string = "0");
	AddNumberParam("Y", "Y.", initial_string = "0");
	AddNumberParam("Z", "Z.", initial_string = "0");
	AddAction(id, af_none, "Translate bone", "Babylon Bone", "{my}: Translate bone <b>({0})</b> by <b>({1},{2},{3})</b>.", "Set bone position.", "BoneTranslate");
	id++;		
	AddNumberParam("Blending speed", "", initial_string = "0.05");
	AddAction(id, af_none, "Enabled blending", "Babylon Skeleton", "{my}: Enable mesh's skeleton blending with speed <b>({0})</b>.", "Enable mesh skeleton blending.", "SkeletonEnableBlending");
	id++;		
	AddStringParam("Anim name", "The anim name to be assigned", initial_string = "\"Walk\"");	
	AddNumberParam("From frame", "", initial_string = "0");
	AddNumberParam("To frame", "", initial_string = "30");
	AddAction(id, af_none, "Create anim range", "Babylon Skeleton", "{my}: Create animation range named <b>({0})</b>  from <b>({1})</b> to <b>({2})</b>.", "Create anim range.", "SkeletonCreateAnimRange");
	id++;	
	AddStringParam("Anim name", "The animation name", initial_string = "\"Walk\"");	
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Loop", "", "False");
	AddNumberParam("Speed", "", initial_string = "1");
	AddAction(id, af_none, "Begin skeletal animation", "Babylon Skeleton", "{my}: Begin animation named <b>({0})</b> set loop to <b>({1})</b> and speed to <b>({2})</b>.", "Begin animation.", "SkeletonBeginAnimation");
	id++;	
	AddAction(id, af_none, "Stop skeletal animation", "Babylon Skeleton", "{my}: Stop animation.", "Stop anim.", "SkeletonStopAnimation");
	id++;
	AddNumberParam("Bone ID", "", initial_string = "0");
	AddStringParam("Anim name", "The animation name", initial_string = "\"Walk\"");	
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Loop", "", "False");
	AddNumberParam("Speed", "", initial_string = "1");
	AddAction(id, af_none, "Begin bone animation", "Babylon Bone", "{my}: Begin bone <b>({0})</b> animation named <b>({1})</b> set loop to <b>({2})</b> and speed to <b>({3})</b>.", "Begin bone animation.", "BoneBeginAnimation");
	id++;
	AddAction(id, af_none, "Stop bone animation", "Babylon Bone", "{my}: Stop animation.", "Stop bone animation.", "BoneStopAnimation");
	id++;
	AddNumberParam("Animation ID", "", initial_string = "0");
	AddNumberParam("Frame", "", initial_string = "0");
	AddAction(id, af_deprecated, "Go to frame", "Babylon Skeleton", "{my}: Goto frame <b>({1})</b> of animation <b>({0})</b>.", "Go to frame.", "GoToFrame");
	id++;
	
//////////////////////////////////////////////////////////////
// Expressions
	var id = 20;
	AddStringParam("Bone name", "The bone name", initial_string = "\"Head\"");	
	AddExpression(id, ef_return_string, "Bone id", "Babylon Bone", "BoneID", "Returns the bone id from its name");
	id++;
	AddNumberParam("Bone ID", "", initial_string = "1");	
	AddExpression(id, ef_return_number, "Bone X position", "Babylon Bone", "BoneXPos", "Returns the bone x position");
	id++;
	AddNumberParam("Bone ID", "", initial_string = "1");	
	AddExpression(id, ef_return_number, "Bone Y position", "Babylon Bone", "BoneYPos", "Returns the bone y position");
	id++;
	AddNumberParam("Bone ID", "", initial_string = "1");	
	AddExpression(id, ef_return_number, "Bone Z position", "Babylon Bone", "BoneZPos", "Returns the bone z position");
	id++;
	AddNumberParam("Bone ID", "", initial_string = "1");	
	AddExpression(id, ef_return_number, "Bone absolute X position", "Babylon Bone", "BoneAbsXPos", "Returns the bone absolute x position");
	id++;
	AddNumberParam("Bone ID", "", initial_string = "1");	
	AddExpression(id, ef_return_number, "Bone absolute Y position", "Babylon Bone", "BoneAbsYPos", "Returns the bone absolute y position");
	id++;
	AddNumberParam("Bone ID", "", initial_string = "1");	
	AddExpression(id, ef_return_number, "Bone absolute Z position", "Babylon Bone", "BoneAbsZPos", "Returns the bone absolute z position");
	id++;
	AddNumberParam("Bone ID", "", initial_string = "1");	
	AddExpression(id, ef_return_number, "Bone X rotation", "Babylon Bone", "BoneXRot", "Returns the bone x rotation");
	id++;
	AddNumberParam("Bone ID", "", initial_string = "1");	
	AddExpression(id, ef_return_number, "Bone Y rotation", "Babylon Bone", "BoneYRot", "Returns the bone y rotation");
	id++;
	AddNumberParam("Bone ID", "", initial_string = "1");	
	AddExpression(id, ef_return_number, "Bone Z rotation", "Babylon Bone", "BoneZRot", "Returns the bone z rotation");
	id++;
	AddNumberParam("Bone ID", "", initial_string = "1");	
	AddExpression(id, ef_return_number, "Bone X scale", "Babylon Bone", "BoneXScale", "Returns the bone x scale");
	id++;
	AddNumberParam("Bone ID", "", initial_string = "1");	
	AddExpression(id, ef_return_number, "Bone Y scale", "Babylon Bone", "BoneYScale", "Returns the bone y scale");
	id++;
	AddNumberParam("Bone ID", "", initial_string = "1");	
	AddExpression(id, ef_return_number, "Bone Z scale", "Babylon Bone", "BoneZScale", "Returns the bone z scale");
	id++;
	AddExpression(id, ef_return_number, "Bones count", "Babylon Skeleton", "BonesCount", "Returns the total number of bones the skeleton has");
	id++;
	AddNumberParam("Animation ID", "", initial_string = "0");
	AddExpression(id, ef_return_number, "Current frame", "Babylon Skeleton", "CurrentFrame", "Returns the current frame number of the skeletal animation");
	id++;

ACESDone();

// Property grid properties for this plugin
var property_list = [		
		
	];
	
// Called by IDE when a new behavior type is to be created
function CreateIDEBehaviorType()
{
	return new IDEBehaviorType();
}

// Class representing a behavior type in the IDE
function IDEBehaviorType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new behavior instance of this type is to be created
IDEBehaviorType.prototype.CreateInstance = function(instance)
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
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	
}
