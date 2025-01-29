// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.skymen_slicedObject = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.skymen_slicedObject.prototype;
		
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		// Load properties
		if (this.inst.skymenSliceBehaviorSliceId) {
			this.sliceID = this.inst.skymenSliceBehaviorSliceId
			this.isMaster = false
			this.master = this.inst.skymenSliceBehaviorMaster
		} else {
			this.sliceID = 0
			this.isMaster = true
			this.master = null
		}
		this.children = []
		this.inst.skymenSliceBehavior = this

		setTimeout(() => {
			if (this.isMaster && this.children.length === 0) {
				for (let i = 0; i < this.inst.cur_animation.frames.length; i++) {
					var child = this.runtime.createInstance(this.inst.type, this.inst.layer)
					if (child.skymenSliceBehavior) {
						child.skymenSliceBehavior.sliceID = i
						child.skymenSliceBehavior.isMaster = false
						child.skymenSliceBehavior.master = this.inst
					} else {
						child.skymenSliceBehaviorSliceId = i
						child.skymenSliceBehaviorMaster = this.inst
					}
					this.children.push[child]
				}
			}
		}, 10);
		
		// object is sealed after this call, so make sure any properties you'll ever need are created, e.g.
		// this.myValue = 0;
	};

	behinstProto.tick2 = function () {
		//Sync frame to slice ID
		if (this.inst.cur_frame != this.sliceID) {
			cr.plugins_.Sprite.prototype.acts.SetAnimFrame.call(this.inst, this.sliceID);
		}
		if (!this.isMaster) {
			var setBboxChanged = false
			//Sync X
			if (this.inst.x != this.master.x) {
				this.inst.x = this.master.x
				setBboxChanged = true
			}
			//Sync Y
			if (this.inst.y != this.master.y - this.sliceID) {
				this.inst.y = this.master.y - this.sliceID
				setBboxChanged = true
			}
			//Sync Angle
			if (this.inst.angle != this.master.angle) {
				this.inst.angle = this.master.angle
				setBboxChanged = true
			}
			//Sync anim
			if (!cr.equals_nocase(this.inst.cur_animation.name, this.master.cur_animation.name)) {
				this.inst.changeAnimName = this.master.cur_animation.name;
				this.inst.changeAnimFrom = 0;
				this.inst.doChangeAnim();
			}
			//SetBboxChanged
			if (setBboxChanged) {
				this.inst.set_bbox_changed()
			}
		}
	}

	behinstProto.tick = function ()
	{
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.IsMaster = function () {
		return this.isMaster
	};
	
	// ... other conditions here ...
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	// ... other actions here ...
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	// the example expression
	Exps.prototype.SliceID = function (ret) {
		ret.set_int(this.sliceID);
	};
	
	// ... other expressions here ...
	
	behaviorProto.exps = new Exps();
	
}());