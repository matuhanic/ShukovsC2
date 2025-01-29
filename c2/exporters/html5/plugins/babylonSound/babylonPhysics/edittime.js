function GetBehaviorSettings()
{
	return {
		"name":			"Physics",
		"id":			"babylonPhysics",
		"version":		"1.0",
		"description":	"Add physics to this mesh.",
		"author":		"X3M",
		"help url":		"",
		"category":		"Babylon Mesh",
		"flags":		0						// uncomment lines to enable flags...
						| bf_onlyone			// can only be added once to an object, e.g. solid
	};
};

														//////////////////////////////////////////
														//////////////////////////////////////////
														//////////C O N D I T I O N S/////////////
														//////////////////////////////////////////
														//////////////////////////////////////////
	var id = 1300;
	AddCondition(id, cf_trigger, "On collide", "", "On {my} collide", "Triggered when the mesh collided with the target.", "OnCollide");
	
														//////////////////////////////////////////
														//////////////////////////////////////////
														//////////////A C T I O N S///////////////
														//////////////////////////////////////////
														//////////////////////////////////////////
	var id = 1400;

	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddNumberParam("X impulse", "X component of the vector.", initial_string = "0");
	AddNumberParam("Y impulse", "Y component of the vector.", initial_string = "0");
	AddNumberParam("Z impulse", "Z component of the vector.", initial_string = "0");
	AddNumberParam("X point", "X component of the vector.", initial_string = "0");
	AddNumberParam("Y point", "Y component of the vector.", initial_string = "0");
	AddNumberParam("Z point", "Z component of the vector.", initial_string = "0");
	AddAction(id, af_none, "Apply impulse", "", "{my}: Apply impulse to mesh with impulse: <b>({1},{2},{3})</b> at point: <b>({4},{5},{6})</b> .", "Applies impulse to the mesh", "MeshAppImpu");
	id++;
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddNumberParam("X force", "X component of the vector.", initial_string = "0");
	AddNumberParam("Y force", "Y component of the vector.", initial_string = "0");
	AddNumberParam("Z force", "Z component of the vector.", initial_string = "0");
	AddNumberParam("X point", "X component of the vector.", initial_string = "0");
	AddNumberParam("Y point", "Y component of the vector.", initial_string = "0");
	AddNumberParam("Z point", "Z component of the vector.", initial_string = "0");
	AddAction(id, af_none, "Apply force", "", "{my}: Apply force to mesh with force: <b>({1},{2},{3})</b> at point:<b>({4},{5},{6})</b> .", "Applies force to the mesh", "MeshAppForc");
	id++;
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddNumberParam("X velocity", "X component of the vector.", initial_string = "0");
	AddNumberParam("Y velocity", "Y component of the vector.", initial_string = "0");
	AddNumberParam("Z velocity", "Z component of the vector.", initial_string = "0");
	AddAction(id, af_none, "Apply linear velocity", "", "{my}: Apply linear velocity to mesh with vector: <b>({1},{2},{3})</b>.", "Applies linear velocity to the mesh", "MeshAppLiVel");
	id++;
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddNumberParam("X velocity", "X component of the vector.", initial_string = "0");
	AddNumberParam("Y velocity", "Y component of the vector.", initial_string = "0");
	AddNumberParam("Z velocity", "Z component of the vector.", initial_string = "0");
	AddAction(id, af_none, "Apply angular velocity", "", "{my}: Apply angular velocity to mesh with vector: <b>({1},{2},{3})</b>.", "Applies angular velocity to the mesh", "MeshAppAngVel");
	id++;	
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddObjectParam("Mesh name", "The target mesh name");
	AddNumberParam("Length", "", initial_string = "8");
	AddNumberParam("Stifness", "", initial_string = "1");
	AddNumberParam("Damping", "", initial_string = "0.3");
	AddAction(id, af_none, "Add spring joint", "", "{my}: Add spring joint with mesh {1} set length to <b>({2})</b>,stifness to <b>({3})</b> and damping to <b>({4})</b>.", "Adds a spring joint between the two meshes", "MeshAddSpringJoint");
	id++;	
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddObjectParam("Mesh name", "The target mesh name");
	AddNumberParam("Max distance", "", initial_string = "8");
	AddAction(id, af_none, "Add distance joint", "", "{my}: Add distance joint with mesh {1} set max distance to <b>({2})</b>.", "Adds a distance joint between the two meshes", "MeshAddDistJoint");
	id++;
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");	
	AddObjectParam("Mesh name", "The target mesh name");
	AddStringParam("Main pivot", "This mesh's pivot", initial_string = "\"0,5,0\"");
	AddStringParam("Main axis", "This mesh's axis", initial_string = "\"0,0,0\"");
	AddStringParam("Connected pivot", "The target mesh's pivot", initial_string = "\"0,0,0\"");
	AddStringParam("Connected axis", "The target mesh's axis", initial_string = "\"0,1,0\"");
	AddNumberParam("Max force", "", initial_string = "1");
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Collide meshes", "", "False");
	AddAction(id, af_none, "Add hinge joint", "", "{my}: Add hinge joint with mesh {1} set main pivot to <b>({2})</b> and main axis to <b>({3})</b>, set collision to <b>({7})</b>.", "Adds a hinge joint between the two meshes", "MeshAddHingeJoint");
	id++;	
	

	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddObjectParam("Mesh name", "The target mesh name");
	AddStringParam("Main pivot", "This mesh's pivot", initial_string = "\"0,5,0\"");
	AddStringParam("Main axis", "This mesh's axis", initial_string = "\"0,0,0\"");
	AddStringParam("Connected pivot", "The target mesh's pivot", initial_string = "\"0,0,0\"");
	AddStringParam("Connected axis", "The target mesh's axis", initial_string = "\"0,1,0\"");
	AddNumberParam("Max force", "", initial_string = "1");
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Collide meshes", "", "False");
	AddAction(id, af_none, "Add lock joint", "", "{my}: Add lock joint with mesh {1} set main pivot to <b>({2})</b> and main axis to <b>({3})</b>, set collision to <b>({7})</b>.", "Adds a lock joint between the two meshes", "MeshAddLockJoint");
	id++;
	
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddNumberParam("Mass", "The mass.", initial_string = "1");
	AddAction(id, af_none, "Set mass", "", "{my}: Set mesh mass to : <b>({1})</b>.", "Set angular mesh mass", "MeshSetMass");
	id++;
	
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddAction(id, af_none, "Sleep", "", "Make mesh sleep.", "{my}: Makes the mesh physics sleep", "MeshSleep");
	id++;
	
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddAction(id, af_none, "Wakeup", "", "Make mesh wakeup.", "{my}: Makes the mesh physics wakeup", "MeshWakeup");
	id++;
	
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddAction(id, af_none, "Force update", "", "Force mesh physics update.", "{my}: Force regeneration of this mesh physics body", "MeshForceUpd");
	id++;	
	
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddObjectParam("Mesh", "The target mesh");
	AddStringParam("Main pivot", "This mesh's pivot", initial_string = "\"0,5,0\"");
	AddStringParam("Main axis", "This mesh's axis", initial_string = "\"0,0,0\"");
	AddStringParam("Connected pivot", "The target mesh's pivot", initial_string = "\"0,0,0\"");
	AddStringParam("Connected axis", "The target mesh's axis", initial_string = "\"0,1,0\"");
	AddNumberParam("Max force", "", initial_string = "1");
	AddComboParamOption("False");
	AddComboParamOption("True");
	AddComboParam("Collide meshes", "", "False");
	AddAction(id, af_none, "Add point to point joint", "", "{my}: Add point to point joint with mesh {1} set main pivot to <b>({2})</b> and main axis to <b>({3})</b>, set collision to <b>({7})</b>.", "Adds a point to point joint between the two meshes", "MeshAddPTPJoint");
	id++;

	AddObjectParam("Mesh", "The target mesh");
	AddAction(id, af_none, "Register collision event", "", "Register collision event.", "{my}: Register collision event with mesh {0}", "RegisterColli");
	id++;	
	
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddNumberParam("X pos", "", initial_string = "0");
	AddNumberParam("Y pos", "", initial_string = "0");
	AddNumberParam("Z pos", "", initial_string = "0");
	AddNumberParam("Strength", "", initial_string = "50");
	AddAction(id, af_none, "Apply impulse towards position", "", "{my}: Apply impulse to mesh towards position: <b>({1},{2},{3})</b> with force: <b>({4})</b> .", "", "MeshAppImpuTowardsPos");
	id++;	
	
	AddAction(id, af_none, "Set as raycast chassis", "", "{my}: Set this impostor as a raycast vehicle chassis .", "", "SetAsRaycastChassis");
	id++;

															//////////////////////////////////////////
															//////////////////////////////////////////
															/////////E X P R E S S I O N S////////////
															//////////////////////////////////////////
															//////////////////////////////////////////
	var id = 1500;
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddExpression(id, ef_return_number, "Mass", "", "Mass", "Returns the mass of the mesh");
	id++;
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddExpression(id, ef_return_number, "Friction", "", "Friction", "Returns the friction of the mesh");
	id++;
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddExpression(id, ef_return_number, "Restitution", "", "Restitution", "Returns the restitution of the mesh");
	id++;
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddExpression(id, ef_return_number, "Angular Velocity X", "", "AngularVelX", "Returns the X angular velocity of the mesh");
	id++;
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddExpression(id, ef_return_number, "Angular Velocity Y", "", "AngularVelY", "Returns the Y angular velocity of the mesh");
	id++;
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddExpression(id, ef_return_number, "Angular Velocity Z", "", "AngularVelZ", "Returns the Z angular velocity of the mesh");
	id++;
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddExpression(id, ef_return_number, "Linear Velocity X", "", "LinearVelX", "Returns the X linear velocity of the mesh");
	id++;
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddExpression(id, ef_return_number, "Linear Velocity Y", "", "LinearVelY", "Returns the Y linear velocity of the mesh");
	id++;
	AddNumberParam("[MeshArray] Index", "The index of the mesh in the array if this is a MeshArray, leave -1 to apply to all meshes.", initial_string = "-1");
	AddExpression(id, ef_return_number, "Linear Velocity Z", "", "LinearVelZ", "Returns the Z linear velocity of the mesh");
	id++; 

	
ACESDone();

// Property grid properties for this plugin
var property_list = [	
		new cr.Property(ept_combo, 	"Collider",		"Box",		"Choose a collider shape for this mesh.","Box|Sphere|Plane|Cylinder|Mesh|Heightmap"),
		new cr.Property(ept_float, 	"Mass",		1.0,		"The mass of the mesh in Kg."),
		new cr.Property(ept_float, 	"Friction",		0.6,		"The friction force of the mesh when in contact."),
		new cr.Property(ept_float, 	"Restitution",		0.4,		"The bounciness of the mesh.")
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
