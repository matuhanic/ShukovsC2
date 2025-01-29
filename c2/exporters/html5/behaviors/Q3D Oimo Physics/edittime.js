function GetBehaviorSettings()
{
	return {
		"name":			"Q3D\nOimo Physics",			// as appears in 'add behavior' dialog, can be changed as long as "id" stays the same
		"id":			"Q3DOimo",			// this is used to identify this behavior and is saved to the project; never change it
		"version":		"2.4",
		"description":	"Simulate realistic object physics, powered by Oimo.js.",
		"author":		"Quazi",
		"help url":		"",
		"category":		"Q3D",			// Prefer to re-use existing categories, but you can set anything here
		"flags":		0						// uncomment lines to enable flags...
						| bf_onlyone			// can only be added once to an object, e.g. solid
		,"dependency": "Oimo.js;" // oimo physics engine, faster/easier but less features, perfect for a js game though. 
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
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>, and {my} for the current behavior icon & name
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
AddCondition(0, 0, "Is sleeping", "", "Is {my} sleeping", "True if the physics object has become inactive and is no longer requiring processing.", "IsSleeping");

AddComboParamOption("X velocity");
AddComboParamOption("Y velocity")
AddComboParamOption("Z velocity")
AddComboParamOption("Overall velocity");
AddComboParam("Which", "Choose whether to compare the velocity on an axis, or the overall velocity.");
AddCmpParam("Comparison", "Choose how to compare the velocity.");
AddNumberParam("Value", "Choose the number to compare the velocity to.");
AddCondition(1, 0, "Compare velocity", "", "{my} {0} {1} {2}", "Compare the current velocity of the physics object.", "CompareVelocity");

AddCmpParam("Comparison", "Choose how to compare the angular velocity.");
AddNumberParam("Value", "Choose the number to compare the angular velocity to, in degrees per second.");
AddCondition(2, 0, "Compare angular velocity", "", "{my} angular velocity {0} {1}", "Compare the current angular velocity of the physics object.", "CompareAngularVelocity");

AddCmpParam("Comparison", "Choose how to compare the mass.");
AddNumberParam("Value", "Choose the number to compare the mass to.");
AddCondition(3, 0, "Compare mass", "", "{my} mass {0} {1}", "Compare the current mass of the physics object.", "CompareMass");

AddCondition(4, 0, "Is enabled", "", "Is {my} enabled", "Test if the behavior is currently enabled.", "IsEnabled");

AddCondition(5, 0, "Is in contact w/ anything", "", "Is {my} in contact with anything", "Test if the body is currently contacting any another objects, may not always work, since it requires objects to be forced together", "IsInContact");

AddObjectParam("Object", "The object to test for contact with.");
AddCondition(6, cf_deprecated, "Is in contact w/ object", "", "Is {my} in contact with {0}", "Test if the body is currently contacting any specific object (with the oimo physics behaviour), may not always work, since it requires objects to be forced together", "ContactObj");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddNumberParam("Force X", "The X force to apply.");
AddNumberParam("Force Y", "The Y force to apply.");
AddNumberParam("Force Z", "The Z force to apply.");
AddAction(0, af_none, "Apply force", "Forces", "Apply {my} force (<i>{0}</i>, <i>{1}</i>, <i>{2}</i>)", "Apply a force on the object.", "ApplyForce");

AddNumberParam("Force", "The force to apply.");
AddNumberParam("X", "The X co-ordinate to apply the force towards.");
AddNumberParam("Y", "The Y co-ordinate to apply the force towards.");
AddNumberParam("Z", "The Z co-ordinate to apply the force towards.");
AddAction(1, af_none, "Apply force towards position", "Forces", "Apply {my} force {0} toward (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Apply a force on the object towards a position in the scene.", "ApplyForceToward");

// angles don't really make sense in 3D, make a towards direction instead.
AddNumberParam("Force", "The force to apply.");
AddNumberParam("Angle", "The angle, in degrees, to apply the force towards.");
AddAnyTypeParam("Image point", "The name or number of the image point to apply the force at, or 0 for object's origin.");
AddAction(2, af_deprecated, "Apply force at angle", "Forces", "Apply {my} force {0} at angle {1} at image point {2}", "Apply a force on the object in a particular direction.", "ApplyForceAtAngle");

AddNumberParam("Impulse X", "The X impulse to apply.");
AddNumberParam("Implulse Y", "The Y impulse to apply.");
AddNumberParam("Implulse Z", "The Z impulse to apply.");
AddAction(3, af_none, "Apply impulse", "Forces", "Apply {my} impulse (<i>{0}</i>, <i>{1}</i>, <i>{2}</i>)", "Apply an impulse to the object, as if it were suddenly struck.", "ApplyImpulse");

AddNumberParam("Impulse", "The impulse to apply.");
AddNumberParam("X", "The X co-ordinate to apply the impulse towards.");
AddNumberParam("Y", "The Y co-ordinate to apply the impulse towards.");
AddNumberParam("Z", "The Z co-ordinate to apply the impulse towards.");
AddAction(4, af_none, "Apply impulse towards position", "Forces", "Apply {my} impulse {0} toward (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Apply an impulse on the object as if it were suddenly struck towards a position in the scene.", "ApplyImpulseToward");

// angles don't make sense in 3D
AddNumberParam("Impulse", "The impulse to apply.");
AddNumberParam("Angle", "The angle, in degrees, to apply the impulse at.");
AddAnyTypeParam("Image point", "The name or number of the image point to apply the impulse at, or 0 for object's origin.");
AddAction(5, af_deprecated, "Apply impulse at angle", "Forces", "Apply {my} impulse {0} at angle {1} at image point {2}", "Apply an impulse on the object as if it were suddenly struck at an angle.", "ApplyImpulseAtAngle");

// need to specify an axis to torque around
AddNumberParam("Torque", "The magnitude of the torque to apply to the object.");
AddNumberParam("axis X", "The X component of the axis to apply the torque around, automatically normalized.");
AddNumberParam("axis Y", "The Y component of the axis to apply the torque around, automatically normalized.");
AddNumberParam("axis Z", "The Z component of the axis to apply the torque around, automatically normalized.");
AddAction(6, af_none, "Apply axial torque", "Torque", "Apply {my} torque {0} around axis (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Apply a torque (i.e. couple moment) around a specified 3D axis.", "ApplyTorqueAxial");

// doesn't really make sense to have angles in 3D
AddNumberParam("Torque", "The magnitude of the torque to apply.");
AddNumberParam("Angle", "The angle, in degrees, to apply torque towards.");
AddAction(7, af_deprecated, "Apply torque towards angle", "Torque", "Apply {my} torque {0} toward angle {1}", "Apply a torque towards an angle.", "ApplyTorqueToAngle");

// not really going to work the same way, should i torque so as to slerp +Z towards the position?, what kind of constraints on the torque?
AddNumberParam("Torque", "The magnitude of the torque to apply.");
AddNumberParam("X", "The X co-ordinate in the scene to apply torque towards.");
AddNumberParam("Y", "The Y co-ordinate in the scene to apply torque towards.");
AddNumberParam("Z", "The Z co-ordinate in the scene to apply torque towards.");
AddAction(8, af_none, "Apply torque towards position", "Torque", "Apply {my} torque {0} toward (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Apply a torque towards a position in the scene (uses cross product of a given position with object +Z axis, to try and torque +Z towards the position).", "ApplyTorqueToPosition");

// need to specify an axis to set the angular velocity towards, unless this just scales the current angular velocity
AddNumberParam("X component", "The X component of the angular velocity to set, in degrees per second.");
AddNumberParam("Y component", "The Y component of the angular velocity to set, in degrees per second.");
AddNumberParam("Z component", "The Z component of the angular velocity to set, in degrees per second.");
AddAction(9, af_none, "Set angular velocity", "Torque", "Set {my} angular velocity to (<i>{0}</i>, <i>{1}</i>, <i>{2}</i>)", "Set the rate the object rotates at in XYZ components.", "SetAngularVelocityXYZ");

AddAnyTypeParam("This image point", "Name or number of image point on this object to attach joint to.");
AddObjectParam("Object", "The object to attach to.");
AddAnyTypeParam("That image point", "Name or number of image point on other object to attach joint to.");
AddNumberParam("Damping ratio", "The joint damping ratio, from 0 (no damping) to 1 (critical damping)");
AddNumberParam("Spring frequency", "The mass-spring-damper frequency, in Hertz.");
AddAction(10, af_deprecated, "Create distance joint", "Joints", "Create {my} distance joint from image point {0} to {1} image point {2}, damping ratio {3}, frequency {4}", "Force this and another object to stay a fixed distance apart, as if connected by a pole.", "CreateDistanceJoint");

AddAnyTypeParam("This image point", "Name or number of image point on this object to hinge object to.");
AddObjectParam("Object", "The object to attach.");
AddAction(11, af_deprecated, "Create revolute joint", "Joints", "Create {my} revolute joint at image point {0} to {1}", "Hinge another object to a point on this object.", "CreateRevoluteJoint");

// need xyz
AddNumberParam("X gravity", "The X component of the gravitation acceleration to set.","0");
AddNumberParam("Y gravity", "The Y component of the gravitation acceleration to set.","9.8");
AddNumberParam("Z gravity", "The Z component of the gravitation acceleration to set.","0");
AddAction(12, af_none, "Set world gravity XYZ", "Global settings", "Set {my} world gravity to (<i>{0}</i>, <i>{1}</i>, <i>{2}</i>)", "Set the force of gravity on all objects in the world.", "SetWorldGravityXYZ");

AddComboParamOption("Fixed");
AddComboParamOption("Framerate independent");
AddComboParam("Mode", "The stepping mode.  'Fixed' guarantees same results every time but is not framerate independent; 'framerate independent' adjusts to the framerate but may give different results each time.");
AddAction(13, af_none, "Set stepping mode", "Global settings", "Set {my} world stepping mode to <b>{0}</b>", "Set the way the physics engine steps the simulation.", "SetSteppingMode");

AddNumberParam("Iterations", "Iterations for the world-step solver.  Lower is fast and inaccurate, higher is slow and accurate.", "8");
AddAction(14, af_none, "Set stepping iterations", "Global settings", "Set {my} world-step to {0} iterations per tick update", "Set the performance/accuracy trade-off.", "SetIterations");

AddNumberParam("X component", "The X component of the velocity to set, in pixels per second.");
AddNumberParam("Y component", "The Y component of the velocity to set, in pixels per second.");
AddNumberParam("Z component", "The Z component of the velocity to set, in pixels per second.");
AddAction(15, af_none, "Set velocity", "Forces", "Set {my} velocity to (<i>{0}</i>, <i>{1}</i>, <i>{2}</i>)", "Set the current motion of the physics object.", "SetVelocity");

// need to rebuild shapes possibly / might have to change oimo*****************
AddNumberParam("Density", "The new object density.  Only has effect when 'Immovable' is 'No'.", "1.0");
AddAction(16, af_none, "Set density", "Object settings", "Set {my} density to <b>{0}</b>", "Set the density of the physics object, overwrites individual shape settings.", "SetDensity");

AddNumberParam("Friction", "The new object friction coefficient, between 0 and 1.", "0.5");
AddAction(17, af_none, "Set friction", "Object settings", "Set {my} friction coefficient to <b>{0}</b>", "Set the friction coefficient, overwrites individual shape settings.", "SetFriction");

AddNumberParam("Elasticity", "The new object elasticity (restitution or 'bounciness') coefficient, between 0 and 1.", "0.2");
AddAction(18, af_none, "Set elasticity", "Object settings", "Set {my} elasticity to <b>{0}</b>", "Set the elasticity ('bounciness') coefficient, overwrites individual shape settings.", "SetElasticity");
//********************************************************

AddNumberParam("Linear damping", "The new object linear damping, between 0 and 1.", "0");
AddAction(19, af_none, "Set linear damping", "Object settings", "Set {my} linear damping to <b>{0}</b>", "Set the coefficient to slow down motion over time.", "SetLinearDamping");

AddNumberParam("Angular damping", "The new object angular damping, between 0 and 1.", "0.01");
AddAction(20, af_none, "Set angular damping", "Object settings", "Set {my} angular damping to <b>{0}</b>", "Set the coefficient to slow down rotations over time.", "SetAngularDamping");

AddComboParamOption("Movable");
AddComboParamOption("Immovable");
AddComboParam("Setting", "Set whether the object has infinite mass (immovable).");
AddAction(21, af_none, "Set immovable", "Object settings", "Set {my} <b>{0}</b>", "Set whether the object is immovable or not (frozen in place)", "SetImmovable");

AddAnyTypeParam("This image point", "Name or number of image point on this object to hinge object to.");
AddObjectParam("Object", "The object to attach.");
AddNumberParam("Lower angle", "The lower angle of rotation allowed, in degrees.");
AddNumberParam("Upper angle", "The upper angle of rotation allowed, in degrees.");
AddAction(22, af_deprecated, "Create limited revolute joint", "Joints", "Create {my} limited revolute joint at image point {0} to {1}, from {2} to {3} degrees", "Hinge another object to a point on this object and limit the range of rotation.", "CreateLimitedRevoluteJoint");

// is this possible with oimo? might need to modify code
//AddObjectParam("Object", "Choose another object type with the Physics behavior to enable or disable collisions for.");
AddComboParamOption("Disable");
AddComboParamOption("Enable");
AddComboParam("State", "Enable or disable collisions with the given object type.");
AddAction(23, af_deprecated, "Enable/disable collisions", "Global settings", "{1} {my} collisions with {0}", "Enable or disable collisions with another object using the Physics behavior.", "EnableCollisions");

// working
AddComboParamOption("Don't prevent rotations");
AddComboParamOption("Prevent rotations");
AddComboParam("Setting", "Set whether to prevent the object rotating when hit.");
AddAction(24, af_none, "Set prevent rotation", "Object settings", "Set {my} <b>{0}</b>", "Set whether to prevent the object rotating when hit.", "SetPreventRotate");

// not even a feature of oimo
AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Bullet", "Set whether to use bullet mode for enhanced collision detection on fast-moving objects.");
AddAction(25, af_deprecated, "Set bullet", "Object settings", "Set {my} bullet mode <b>{0}</b>", "Set whether to use enhanced collision detection for fast-moving objects.", "SetBullet");

AddAction(26, af_none, "Remove all joints", "Joints", "Remove all {my} joints", "Remove all joints created to or from this object.", "RemoveAllJoints");

// working
AddComboParamOption("disabled");
AddComboParamOption("enabled");
AddComboParam("Mode", "Choose whether to enable or disable the behavior.");
AddAction(27, af_none, "Set enabled", "Object settings", "Set {my} {0}", "Enable or disable the behavior.", "SetEnabled");

AddNumberParam("Force", "The force to apply.");
AddNumberParam("X", "The X co-ordinate to apply the force towards.");
AddNumberParam("Y", "The Y co-ordinate to apply the force towards.");
AddNumberParam("Z", "The Z co-ordinate to apply the force towards.");
AddNumberParam("exponent (k)", "The exponent to scale distance with, e.g. 1/R^2 would be k = -2, and would act like a gravitational force, while R^1 would be k = 1, and would act like a linear spring force.", "1");
AddAction(28, af_none, "Apply R^k force towards position", "Forces", "Apply {my} (R^{4}) * force {0} toward (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Apply a force which scales proportional to a 'distance' (R) power of (k) on the object towards a position in the scene. 1/R^2 would be k = -2, and would act like a gravitational force, while R^1 would be k = 1, and would act like a linear spring force.", "ApplyForceRkToward");

AddNumberParam("Impulse", "The impulse to apply.");
AddNumberParam("X", "The X co-ordinate to apply the impulse towards.");
AddNumberParam("Y", "The Y co-ordinate to apply the impulse towards.");
AddNumberParam("Z", "The Z co-ordinate to apply the impulse towards.");
AddNumberParam("exponent (k)", "The exponent to scale distance with, e.g. 1/R^2 would be k = -2, and would act like a gravitational 'impulse', while R^1 would be k = 1, and would act like a linear spring 'impulse'.", "1");
AddAction(29, af_none, "Apply R^k impulse towards position", "Forces", "Apply {my} (R^{4}) * impulse {0} toward (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Apply a impulse which scales proportional to a 'distance' (R) power of (k) on the object towards a position in the scene.", "ApplyImpulseRkToward");

AddNumberParam("Force", "The force to apply.");
AddNumberParam("X", "The X direction to apply the force in (auto normalized).");
AddNumberParam("Y", "The Y direction to apply the force in (auto normalized).");
AddNumberParam("Z", "The Z direction to apply the force in (auto normalized).");
AddAction(30, af_none, "Apply force in direction", "Forces", "Apply {my} force {0} in direction (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Apply a force in a direction", "ApplyForceInDir");

AddNumberParam("Impulse", "The impulse to apply.");
AddNumberParam("X", "The X direction to apply the impulse in (auto normalized).");
AddNumberParam("Y", "The Y direction to apply the impulse in (auto normalized).");
AddNumberParam("Z", "The Z direction to apply the impulse in (auto normalized).");
AddAction(31, af_none, "Apply impulse in direction", "Forces", "Apply {my} impulse {0} in direction (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Apply a impulse in a direction", "ApplyImpulseInDir");

AddNumberParam("Force X", "The X force to apply.");
AddNumberParam("Force Y", "The Y force to apply.");
AddNumberParam("Force Z", "The Z force to apply.");
AddNumberParam("Offset X", "The X offset to apply force at.");
AddNumberParam("Offset Y", "The Y offset to apply force at.");
AddNumberParam("Offset Z", "The Z offset to apply force at.");
AddAction(32, af_none, "Apply force (offset)", "Forces (offset)", "Apply {my} force (<i>{0}</i>, <i>{1}</i>, <i>{2}</i>) at offset (<i>{3}</i>, <i>{4}</i>, <i>{5}</i>)", "Apply a force on the object at a positional offset.", "OffsetApplyForce");

AddNumberParam("Force X", "The X force to apply.");
AddNumberParam("Force Y", "The Y force to apply.");
AddNumberParam("Force Z", "The Z force to apply.");
AddNumberParam("World X", "The X position to apply force at.");
AddNumberParam("World Y", "The Y position to apply force at.");
AddNumberParam("World Z", "The Z position to apply force at.");
AddAction(33, af_none, "Apply force (world)", "Forces (world position)", "Apply {my} force (<i>{0}</i>, <i>{1}</i>, <i>{2}</i>) at world position (<i>{3}</i>, <i>{4}</i>, <i>{5}</i>)", "Apply a force on the object at a world position.", "WorldApplyForce");

AddNumberParam("Impulse X", "The X impulse to apply.");
AddNumberParam("Impulse Y", "The Y impulse to apply.");
AddNumberParam("Impulse Z", "The Z impulse to apply.");
AddNumberParam("Offset X", "The X offset to apply impulse at.");
AddNumberParam("Offset Y", "The Y offset to apply impulse at.");
AddNumberParam("Offset Z", "The Z offset to apply impulse at.");
AddAction(34, af_none, "Apply impulse (offset)", "Forces (offset)", "Apply {my} impulse (<i>{0}</i>, <i>{1}</i>, <i>{2}</i>) at offset (<i>{3}</i>, <i>{4}</i>, <i>{5}</i>)", "Apply a impulse on the object at a positional offset.", "OffsetApplyImpulse");

AddNumberParam("Impulse X", "The X impulse to apply.");
AddNumberParam("Impulse Y", "The Y impulse to apply.");
AddNumberParam("Impulse Z", "The Z impulse to apply.");
AddNumberParam("World X", "The X position to apply impulse at.");
AddNumberParam("World Y", "The Y position to apply impulse at.");
AddNumberParam("World Z", "The Z position to apply impulse at.");
AddAction(35, af_none, "Apply impulse (world)", "Forces (world position)", "Apply {my} impulse (<i>{0}</i>, <i>{1}</i>, <i>{2}</i>) at world position (<i>{3}</i>, <i>{4}</i>, <i>{5}</i>)", "Apply a impulse on the object at a world position.", "WorldApplyImpulse");

AddNumberParam("Torque X", "The X component of the torque.");
AddNumberParam("Torque Y", "The Y component of the torque.");
AddNumberParam("Torque Z", "The Z component of the torque.");
AddAction(36, af_none, "Apply XYZ torque", "Torque", "Apply {my} torque as XYZ components (<i>{0}</i>, <i>{1}</i>, <i>{2}</i>)", "Apply a torque (i.e. couple moment) as it's XYZ components.", "ApplyTorqueXYZ");

// not really going to work the same way, should i torque so as to slerp +Z towards the position?, what kind of constraints on the torque?
AddNumberParam("Torque", "The magnitude of the torque to apply.");
AddNumberParam("X", "The X co-ordinate in the scene to apply torque towards.");
AddNumberParam("Y", "The Y co-ordinate in the scene to apply torque towards.");
AddNumberParam("Z", "The Z co-ordinate in the scene to apply torque towards.");
AddNumberParam("exponent (k)", "The exponent of torque-angle scaling, e.g. A^1 would be k = 1, and would act scale the torque by the angular difference between +Z and the position from the object, this means if the object needs to turn 180 degrees, the full torque is applied, but if its 0 degrees, no torque is applied.", "1");
AddAction(37, af_none, "Apply A^k torque towards position", "Torque", "Apply {my} A^{4} torque {0} toward (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Apply a torque towards a position in the scene (uses cross product of a given position with object +Z axis, to try and torque +Z towards the position), with a scaling dependent on how large an angular difference A exists between +Z and the position, to the power of an exponent k.", "ApplyTorqueAkToPosition");

AddComboParamOption("group");
AddComboParamOption("mask");
AddComboParam("what to adjust", "groups defines which collision .");
AddComboParamOption("clear bit");
AddComboParamOption("set bit");
AddComboParamOption("set only bit to");
AddComboParamOption("set every bit and clear specified bit");
AddComboParamOption("set all bits (ignores specified bit)");
AddComboParamOption("clear all bits (ignores specified bit)");
AddComboParam("operation", "Set what to do with the specified bit.");
AddNumberParam("bit", "a bit from 0-31. If you want an object to not collide with objects in a group bit, clear that bit from ''mask'', if you want an object to be a part of a particular group bit, set that bit in group. Group and mask specify 32 bit sets, this Object A only collides with Objects B which have a set bit in group, which is also set in this Object A's its mask.","0");
AddAction(38, af_none, "Adjust collision group/mask bits", "Collisions (advanced)", "{1} {2} in {my} collision {0}", "Enable or disable collisions with other objects using Q3D OIMO physics, by setting mask and group bits. Object A will collide with any Object B which is part of a group bit, if a group bit Object B has set is also set in Object A's mask. By default all mask bits are set so that objects collide with objects in any group, and objects by default only have group bit 0 set. You can set and clear bits from groups, or adjust bits in their mask in advanced ways using this action.", "CollisionsSlotOp");

//AddAnyTypeParam("This image point", "Name or number of image point on this object to hinge object to.");
AddStringParam("Joint name", "A name for the joint, so that it can be referenced later by either object. Using the same name twice will mean only the last created joint with that name can be referenced.","\"DistanceJoint\"");
AddComboParamOption("self collisions disabled");
AddComboParamOption("self collisions enabled");
AddComboParam("Self collisions", "Control whether the jointed objects can collide or not.","0");
AddNumberParam("Damping ratio", "The joint damping ratio, from 0 (no damping) to 1 (critical damping)","0");
AddNumberParam("Spring frequency", "The mass-spring-damper frequency, in Hertz, set to 0 to disable.","0");
AddNumberParam("min.", "Minimum allowable distance.");
AddNumberParam("max.", "Maximum allowable distance.");
AddNumberParam("X position on A", "X position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Y position on A", "Y position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Z position on A", "Z position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddObjectParam("Object B", "The Object B to attach to Object A with this joint (Object A is the object calling this action).");
AddNumberParam("X position on B", "X position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Y position on B", "Y position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Z position on B", "Z position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddAction(39, af_none, "Create Limited-Distance joint", "Joints", "Create {my} Limited-Distance joint <b>{0}</b>, <i>{1}</i>, damp : ({2}), freq : ({3}), min : ({4}), max : ({5}), at ({6},{7},{8}) on self and ({10},{11},{12}) on {9}.", "Joint that limits the distance two points on two objects can separate.", "CreateLimitedDistanceJoint");

AddStringParam("Joint name", "A name for the joint, so that it can be referenced later by either object. Using the same name twice will mean only the last created joint with that name can be referenced.","\"HingeJoint\"");
AddComboParamOption("self collisions disabled");
AddComboParamOption("self collisions enabled");
AddComboParam("Self collisions", "Control whether the jointed objects can collide or not.","0");
AddNumberParam("Damping ratio", "The joint damping ratio, from 0 (no damping) to 1 (critical damping)","0");
AddNumberParam("Spring frequency", "The mass-spring-damper frequency, in Hertz, set to 0 to disable.","0");
AddNumberParam("min.", "Minimum allowable angle (degrees) , goes from -180 to 180, but operating near the edges will lead to snapping effects in the joint.");
AddNumberParam("max.", "Maximum allowable (degrees) , goes from -180 to 180, but operating near the edges will lead to snapping effects in the joint.");
AddNumberParam("X position on A", "X position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Y position on A", "Y position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Z position on A", "Z position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis X for A", "X component of the hinge axis for object A (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis Y for A", "Y component of the hinge axis for object A (local coords, normalized so that 1 unit is equal to one world space unit).","1");
AddNumberParam("hinge axis Z for A", "Z component of the hinge axis for object A (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddObjectParam("Object B", "The Object B to attach to Object A with this joint (Object A is the object calling this action).");
AddNumberParam("X position on B", "X position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Y position on B", "Y position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Z position on B", "Z position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis X for B", "X component of the hinge axis for object B (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis Y for B", "Y component of the hinge axis for object B (local coords, normalized so that 1 unit is equal to one world space unit).","1");
AddNumberParam("hinge axis Z for B", "Z component of the hinge axis for object B (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddAction(40, af_none, "Create Limited-Hinge joint", "Joints", "Create {my} Limited-Hinge joint <b>{0}</b>, <i>{1}</i>, damp : ({2}), freq : ({3}), min : ({4} deg.), max : ({5} deg.), at ({6},{7},{8}) with axis ({9},{10},{11}) on self and ({13},{14},{15}) with axis ({16},{17},{18}) on {12}.", "Joint that limits the angle between objects in 1 DOF (Degree Of Freedom).", "CreateLimitedHingeJoint");

AddStringParam("Joint name", "A name for the joint, so that it can be referenced later by either object. Using the same name twice will mean only the last created joint with that name can be referenced.","\"BallSocketJoint\"");
AddComboParamOption("self collisions disabled");
AddComboParamOption("self collisions enabled");
AddComboParam("Self collisions", "Control whether the jointed objects can collide or not.","0");
AddNumberParam("X position on A", "X position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Y position on A", "Y position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Z position on A", "Z position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddObjectParam("Object B", "The Object B to attach to Object A with this joint (Object A is the object calling this action).");
AddNumberParam("X position on B", "X position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Y position on B", "Y position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Z position on B", "Z position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddAction(41, af_none, "Create Ball & Socket joint", "Joints", "Create {my} Ball & Socket joint <b>{0}</b>, <i>{1}</i>, at ({2},{3},{4}) on self and ({6},{7},{8}) on {5}.", "Joint that limits objects to only rotate with respect to each other, like the ball and socket on an action figures arms.", "CreateBallAndSocketJoint");

AddStringParam("Joint name", "A name for the joint, so that it can be referenced later by either object. Using the same name twice will mean only the last created joint with that name can be referenced.","\"HingeJoint\"");
AddComboParamOption("self collisions disabled");
AddComboParamOption("self collisions enabled");
AddComboParam("Self collisions", "Control whether the jointed objects can collide or not.","0");
AddNumberParam("min.", "Minimum allowable distance to separate along axis");
AddNumberParam("max.", "Maximum allowable distance to separate along axis");
AddNumberParam("X position on A", "X position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Y position on A", "Y position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Z position on A", "Z position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis X for A", "X component of the hinge axis for object A (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis Y for A", "Y component of the hinge axis for object A (local coords, normalized so that 1 unit is equal to one world space unit).","1");
AddNumberParam("hinge axis Z for A", "Z component of the hinge axis for object A (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddObjectParam("Object B", "The Object B to attach to Object A with this joint (Object A is the object calling this action).");
AddNumberParam("X position on B", "X position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Y position on B", "Y position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Z position on B", "Z position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis X for B", "X component of the hinge axis for object B (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis Y for B", "Y component of the hinge axis for object B (local coords, normalized so that 1 unit is equal to one world space unit).","1");
AddNumberParam("hinge axis Z for B", "Z component of the hinge axis for object B (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddAction(42, af_none, "Create Prismatic joint", "Joints", "Create {my} Prismatic joint <b>{0}</b>, <i>{1}</i>, min : ({2}), max : ({3}), at ({4},{5},{6}) with axis ({7},{8},{9}) on self and ({11},{12},{13}) with axis ({14},{15},{16}) on {10}.", "Prismatic joint that permits objects to slide along a single axis by a limited (or unlimited) amount without relative rotation.", "CreatePrismaticJoint");

AddStringParam("Joint name", "A name for the joint, so that it can be referenced later by either object. Using the same name twice will mean only the last created joint with that name can be referenced.","\"HingeJoint\"");
AddComboParamOption("self collisions disabled");
AddComboParamOption("self collisions enabled");
AddComboParam("Self collisions", "Control whether the jointed objects can collide or not.","0");
AddNumberParam("min.", "Minimum allowable distance to separate along axis");
AddNumberParam("max.", "Maximum allowable distance to separate along axis");
AddNumberParam("X position on A", "X position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Y position on A", "Y position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Z position on A", "Z position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis X for A", "X component of the hinge axis for object A (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis Y for A", "Y component of the hinge axis for object A (local coords, normalized so that 1 unit is equal to one world space unit).","1");
AddNumberParam("hinge axis Z for A", "Z component of the hinge axis for object A (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddObjectParam("Object B", "The Object B to attach to Object A with this joint (Object A is the object calling this action).");
AddNumberParam("X position on B", "X position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Y position on B", "Y position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Z position on B", "Z position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis X for B", "X component of the hinge axis for object B (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis Y for B", "Y component of the hinge axis for object B (local coords, normalized so that 1 unit is equal to one world space unit).","1");
AddNumberParam("hinge axis Z for B", "Z component of the hinge axis for object B (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddAction(43, af_none, "Create Slider joint", "Joints", "Create {my} Slider joint <b>{0}</b>, <i>{1}</i>, min : ({2}), max : ({3}), at ({4},{5},{6}) with axis ({7},{8},{9}) on self and ({11},{12},{13}) with axis ({14},{15},{16}) on {10}.", "Slider joint that permits objects to slide along a single axis by a limited (or unlimited) amount with relative rotation only around that axis.", "CreateSliderJoint");

AddStringParam("Joint name", "A name for the joint, so that it can be referenced later by either object. Using the same name twice will mean only the last created joint with that name can be referenced.","\"HingeJoint\"");
AddComboParamOption("self collisions disabled");
AddComboParamOption("self collisions enabled");
AddComboParam("Self collisions", "Control whether the jointed objects can collide or not.","0");
AddNumberParam("Damping ratio", "The joint damping ratio, from 0 (no damping) to 1 (critical damping)","0");
AddNumberParam("Spring frequency", "The mass-spring-damper frequency, in Hertz, set to 0 to disable.","0");
AddNumberParam("min.", "Minimum allowable angle (degrees) , goes from -180 to 180, but operating near the edges will lead to snapping effects in the joint.","1");
AddNumberParam("max.", "Maximum allowable (degrees) , goes from -180 to 180, but operating near the edges will lead to snapping effects in the joint.","0");
AddNumberParam("X position on A", "X position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Y position on A", "Y position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Z position on A", "Z position of the joint attachment on object A (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis X for A", "X component of the hinge axis for object A (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis Y for A", "Y component of the hinge axis for object A (local coords, normalized so that 1 unit is equal to one world space unit).","1");
AddNumberParam("hinge axis Z for A", "Z component of the hinge axis for object A (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddObjectParam("Object B", "The Object B to attach to Object A with this joint (Object A is the object calling this action).");
AddNumberParam("X position on B", "X position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Y position on B", "Y position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("Z position on B", "Z position of the joint attachment on object B (local axis, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis X for B", "X component of the hinge axis for object B (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddNumberParam("hinge axis Y for B", "Y component of the hinge axis for object B (local coords, normalized so that 1 unit is equal to one world space unit).","1");
AddNumberParam("hinge axis Z for B", "Z component of the hinge axis for object B (local coords, normalized so that 1 unit is equal to one world space unit).","0");
AddAction(44, af_none, "Create Wheel joint", "Joints", "Create {my} Wheel joint <b>{0}</b>, <i>{1}</i>, damp : ({2}), freq : ({3}), min : ({4} deg.), max : ({5} deg.), at ({6},{7},{8}) with axis ({9},{10},{11}) on self and ({13},{14},{15}) with axis ({16},{17},{18}) on {12}.", "A wheel joint allows for relative rotation between two rigid bodies along two axes, the wheel joint also allows for relative translation for the suspension.", "CreateWheelJoint");

AddStringParam("Joint name", "Name of the joint to remove. Note that if you created two joints with the same name, only the current joint will be removed","\"Joint\"");
AddAction(45, af_none, "Remove joint", "Joints", "Remove {my} last created joint named <b>{0}</b>", "Remove the last joint created using a specified name", "RemoveJoint");

AddStringParam("Shape name", "Name of the shape to add, used for referencing to it to reposition / scale / rotate","\"BoxShape\"");
AddNumberParam("X Size", "Width of the box shape.","100");
AddNumberParam("Y Size", "Height of the box shape.","100");
AddNumberParam("Z Size", "Depth of the box shape.","100");
AddAction(46, af_none, "Add Box shape", "Collider Shapes", "Add {my} box shaped collider named <b>{0}</b>, with dimensions ({1},{2},{3})", "Adds a box shape to the physics collider, properties can be changed using it's name", "ShapesAddBox");

AddStringParam("Shape name", "Name of the shape to add, used for referencing to it to reposition / scale / rotate","\"SphereShape\"");
AddNumberParam("Radius", "Radius of the sphere shape.","50");
AddAction(47, af_none, "Add Sphere shape", "Collider Shapes", "Add {my} sphere shaped collider named <b>{0}</b>, with radius ({1})", "Adds a sphere shape to the physics collider, properties can be changed using it's name", "ShapesAddSphere");

AddStringParam("Shape name", "Name of the shape to add, used for referencing to it to reposition / scale / rotate","\"CylinderShape\"");
AddNumberParam("Radius", "Radius of the cylinder shape.","50");
AddNumberParam("Y Size", "Height of the cylinder shape.","100");
AddAction(48, af_none, "Add Cylinder shape", "Collider Shapes", "Add {my} cylinder shaped collider named <b>{0}</b>, with radius ({1}) and height ({2})", "Adds a cylinder shape to the physics collider, properties can be changed using it's name", "ShapesAddCylinder");

AddStringParam("Shape name", "Name of the shape to modify","\"ShapeName\"");
AddNumberParam("X position", "X position relative to object center.","0");
AddNumberParam("Y position", "Y position relative to object center.","0");
AddNumberParam("Z position", "Z position relative to object center.","0");
AddAction(49, af_none, "Set shape position (relative)", "Collider Shapes", "Set {my} (relative) position of shape named : <b>{0}</b> to ({1},{2},{3})", "Change the relative positioning of a collider shape to the physics body center", "ShapesSetRelPos");

AddStringParam("Shape name", "Name of the shape to modify","\"ShapeName\"");
AddNumberParam("X rotation", "X rotation in degrees, using Euler angles relative to objects orientation.","0");
AddNumberParam("Y rotation", "Y rotation in degrees, using Euler angles relative to objects orientation.","0");
AddNumberParam("Z rotation", "Z rotation in degrees, using Euler angles relative to objects orientation.","0");
AddAction(50, af_none, "Set shape rotation (rel./Euler)", "Collider Shapes", "Set {my} (relative) rotation of shape named : <b>{0}</b> to Euler angles : ({1},{2},{3})", "Change the relative rotation of a collider shape to the physics body orientation in euler angles.", "ShapesSetRelRotE");

AddStringParam("Shape name", "Name of the shape to modify","\"ShapeName\"");
AddNumberParam("Row 1 : m00", "","1");
AddNumberParam("m01", "","0");
AddNumberParam("m02", "","0");
AddNumberParam("Row 2 : m10", "","0");
AddNumberParam("m11", "","1");
AddNumberParam("m12", "","0");
AddNumberParam("Row 3 : m20", "","0");
AddNumberParam("m21", "","0");
AddNumberParam("m22", "","1");
AddAction(51, af_none, "Set shape rotation (rel./Mat3x3)", "Collider Shapes", "Set {my} (relative) rotation of shape named : <b>{0}</b> to 3x3 Matrix ({1},{2},{3}) , ({4},{5},{6}) , ({7},{8},{9}).", "Change the relative rotation of a collider shape to the physics body orientation using a 3x3 Matrix.", "ShapesSetRelRotM");

AddStringParam("Shape name", "Name of the shape to modify","\"ShapeName\"");
AddNumberParam("X size", "X size controls : box width / sphere diameter / cylinder diameter.","100");
AddNumberParam("Y size", "Y size controls : box height / cylinder height.","100");
AddNumberParam("Z size", "Z size controls : box depth","100");
AddAction(52, af_none, "Set shape size", "Collider Shapes", "Set {my} size of shape named : <b>{0}</b> to dimensions ({1},{2},{3})", "Change the scale of a collider shape, effects depend on shape type, with some param's being purposeless for shapes with fewer dimensions (i.e. sphere only has a radius).", "ShapesSetSize");

AddStringParam("Shape name", "Name of the shape to modify","\"ShapeName\"");
AddNumberParam("Density", "The new shape density.", "1.0");
AddAction(53, af_none, "Set shape density", "Collider Shapes", "Set {my} density of shape named : <b>{0}</b> to ({1})", "Change the density of a named collider shape (note that main 'set density' action overwrites the individual settings of all shapes).", "ShapesSetDensity");

AddStringParam("Shape name", "Name of the shape to modify","\"ShapeName\"");
AddNumberParam("Friction", "The new shape's friction coefficient, between 0 and 1.", "0.5");
AddAction(54, af_none, "Set shape friction", "Collider Shapes", "Set {my} friction of shape named : <b>{0}</b> to ({1})", "Change the friction coefficient of a named collider shape (note that main 'set friction' action overwrites the individual settings of all shapes).", "ShapesSetFriction");

AddStringParam("Shape name", "Name of the shape to modify","\"ShapeName\"");
AddNumberParam("Elasticity", "The new object elasticity (restitution or 'bounciness') coefficient, between 0 and 1.", "0.2");
AddAction(55, af_none, "Set shape elasticity", "Collider Shapes", "Set {my} elasticity of shape named : <b>{0}</b> to ({1})", "Change the elasticity of a named collider shape (note that main 'set elasticity' action overwrites the individual settings of all shapes).", "ShapesSetElasticity");

AddStringParam("Shape name", "Name of the shape to modify","\"ShapeName\"");
AddComboParamOption("group");
AddComboParamOption("mask");
AddComboParam("what to adjust", "groups defines which collision .");
AddComboParamOption("clear bit");
AddComboParamOption("set bit");
AddComboParamOption("set only bit to");
AddComboParamOption("set every bit and clear specified bit");
AddComboParamOption("set all bits (ignores specified bit)");
AddComboParamOption("clear all bits (ignores specified bit)");
AddComboParam("operation", "Set what to do with the specified bit.");
AddNumberParam("bit", "a bit from 0-31. If you want an object to not collide with objects in a group bit, clear that bit from ''mask'', if you want an object to be a part of a particular group bit, set that bit in group. Group and mask specify 32 bit sets, this Object A only collides with Objects B which have a set bit in group, which is also set in this Object A's its mask.","0");
AddAction(56, af_none, "Set shape collision group/mask bits", "Collider Shapes", "{1} {2} in {my} collision {0}", "Enable or disable collisions with other objects using Q3D OIMO physics, by setting mask and group bits. Object A will collide with any Object B which is part of a group bit, if a group bit Object B has set is also set in Object A's mask. By default all mask bits are set so that objects collide with objects in any group, and objects by default only have group bit 0 set. You can set and clear bits from groups, or adjust bits in their mask in advanced ways using this action.", "ShapesCollisionsSlotOp");

AddStringParam("Shape name", "Name of the shape to remove","\"ShapeName\"");
AddAction(57, af_none, "Remove shape", "Collider Shapes", "Remove {my} shape named : <b>{0}</b>", "Remove a previously added collider shape, using it's name. If you've overwritten the name this will only remove the most recent object with that name.", "ShapesRemove");

AddNumberParam("Allowable penetration", "The new allowable penetration", "0.005");
AddAction(58, af_none, "Set allowable penetration", "Object settings", "Set {my} allowable penetration to <b>{0}</b>", "Set the allowable penetration of the object in collisions", "SetAllowablePen");

AddNumberParam("Compliance", "The new push-out compliance", "0.5");
AddAction(59, af_none, "Set push-out compliance", "Object settings", "Set {my} push-out compliance to <b>{0}</b>", "Set the push-out compliance of this object.", "SetCompliance");

AddNumberParam("Stickiness", "The new stickiness.", "0");
AddAction(60, af_none, "Set stickiness", "Object settings", "Set {my} stickiness to <b>{0}</b>", "Set the stickiness coefficient of the object.", "SetStickiness");

AddAction(61, af_none, "Alert shape info", "Collider Shapes", "Alert with collider shape names / info.", "Special action used for debugging the current shapes in the collider", "AlertShapeInfo");

// need versions of above functions for offset forces / impulses that cause torques.


////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel
AddExpression(0,	ef_return_number,		"Get velocity X",	"",	"velX",	"The X component of the object's current velocity, in pixels per second.");
AddExpression(1,	ef_return_number,		"Get velocity Y",	"",	"velY",	"The Y component of the object's current velocity, in pixels per second.");
AddExpression(2,	ef_return_number,		"Get velocity Z",	"",	"velZ",	"The Z component of the object's current velocity, in pixels per second.");
AddExpression(3,	ef_return_number,		"Get angular velocity X",	"",	"angvelX",	"The object's current angular velocity, in degrees per second.");
AddExpression(4,	ef_return_number,		"Get angular velocity Y",	"",	"angvelY",	"The object's current angular velocity, in degrees per second.");
AddExpression(5,	ef_return_number,		"Get angular velocity Z",	"",	"angvelZ",	"The object's current angular velocity, in degrees per second.");

AddExpression(6,	ef_return_number,		"Get mass",			"",	"Mass",			"The object's physics mass, which is its collision area multiplied by its density.");
AddExpression(7,	ef_return_number,		"Get center of mass X", "", "comX", "The X co-ordinate of the object's center of mass.");
AddExpression(8,	ef_return_number,		"Get center of mass Y", "", "comY", "The Y co-ordinate of the object's center of mass.");
AddExpression(9,	ef_return_number,		"Get center of mass Z", "", "comZ", "The Z co-ordinate of the object's center of mass.");

AddExpression(10,	ef_return_number,		"Get density",			"Object settings",	"density",			"The current density of the physics object.");
AddExpression(11,	ef_return_number,		"Get friction",			"Object settings",	"friction",			"The current friction of the physics object.");
AddExpression(12,	ef_return_number,		"Get elasticity",		"Object settings",	"elasticity",		"The current elasticity ('bounciness') of the physics object.");
AddExpression(13,	ef_return_number,		"Get linear damping",	"Object settings",	"linearDamping",	"The current linear damping coefficient.");
AddExpression(14,	ef_return_number,		"Get angular damping",	"Object settings",	"angularDamping",	"The current angular damping coefficient.");

AddNumberParam("from 0 to 8");
AddExpression(15,	ef_return_number,		"Get an element of the intertial tensor (3x3 matrix, value from 0-8 specifies which element to get)", "", "Tensor", "get an element of the inertial tensor.");

AddNumberParam("from 0 to 8");
AddExpression(16,	ef_return_number,		"Get an element of the inverse intertial tensor (3x3 matrix, value from 0-8 specifies which element to get)", "", "invTensor", "get an element of the inverse inertial tensor.");

AddExpression(17,	ef_return_number,		"Get inverse mass",			"",	"invMass",			"The object's inverse physics mass, which is its collision area multiplied by its density over 1.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)

var property_list = [
	new cr.Property(ept_combo, 		"Immovable",		"No",						"Enable to make object have infinite mass.  Ideal for scenery.", "No|Yes"),
	new cr.Property(ept_combo,		"Physics body",	"Use Collider Shape",	"How the object collides in the physics simulation, may not align exactly with collider if collider doesn't match object bounding box 1:1:1.", "Use Collider Shape|Box|Sphere|Cylinder|Capsule"),
	new cr.Property(ept_combo,		"Prevent rotation",	"No",						"Prevent the object rotating when hit.", "No|Yes"),
	new cr.Property(ept_float,		"Density",			1,							"The object density, if 'immovable' is 'no'."),
	new cr.Property(ept_float,		"Friction",			0.5,						"The object friction coefficient, between 0 and 1 (may not be working properly in this version)."),
	new cr.Property(ept_float,		"Elasticity",		0.2,						"The object elasticity (restitution or 'bounciness') coefficient, between 0 and 1."),
	new cr.Property(ept_float,		"Linear damping",	0.0,						"Coefficient to slow down motion over time, between 0 and 1."),
	new cr.Property(ept_float,		"Angular damping",	0.01,						"Coefficient to slow down rotations over time, between 0 and 1."),
	new cr.Property(ept_combo, "Initial state", "Enabled", "Whether to initially have the behavior enabled or disabled.", "Disabled|Enabled"),
	new cr.Property(ept_combo, "Debug body", "Enabled", "Option to show a debug body at runtime (works only during preview, not export).", "Disabled|Enabled"),
	new cr.Property(ept_combo, "Allow Sleep ?", "Yes", "Choose whether or not you want to allow the object to sleep if it hasn't moved after some time.", "No|Yes"),
	new cr.Property(ept_float,		"Allowable penetration",			0.005,							"Controls how much penetration this object will allow in solving, larger values helps stabilize objects that 'jitter' and won't relax, particularly in stacking"),
	new cr.Property(ept_float,		"Push-out compliance",			0.5,							"Controls how compliant this object is while being pushed out of a penetration, smaller values means the push-out will be more stable but will take more iterations to approach its final state"),
	new cr.Property(ept_float,		"Stickiness",			0,							"Controls how much of a constant 'sticky' impulse is created when a contact is formed. values scale heavily so something like 1 will mean the objects pull together with a constant impulse of 1N*s if they come in contact. Values around 0.1-0.5 work well.")
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

// Class representing an individual instance of the behavior in the IDE
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
		
	// any other properties here, e.g...
	// this.myValue = 0;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
