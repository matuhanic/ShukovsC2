// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.babylonPin = function (runtime) {
	this.runtime = runtime;
};

(function () {
	var behaviorProto = cr.behaviors.babylonPin.prototype;

	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function (behavior, objtype) {
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};

	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function () { };

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function (type, inst) {
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst; // associated object instance to modify
		this.runtime = type.runtime;
	};

	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function () {
		this.pinObject = null;
		this.pinObjectUid = -1; // for loading
		this.pinAngle = 0;
		this.pinDist = 0;
		this.myStartAngle = 0;
		this.theirStartAngle = 0;
		this.lastKnownAngle = 0;
		this.mode = 0; // 0 = position & angle; 1 = position; 2 = angle; 3 = rope; 4 = bar
		if (this.inst.mytype == "_mesh") {
			this.meshname = this.inst.properties[0];
		}
		else if (this.inst.mytype == "_newmesh") {
			this.meshname = "mesh" + this.inst.uid;
		}

		var self = this;

		// Need to know if pinned object gets destroyed
		if (!this.recycled) {
			this.myDestroyCallback = (function (inst) {
				self.onInstanceDestroyed(inst);
			});
		}

		this.runtime.addDestroyCallback(this.myDestroyCallback);
	};

	behinstProto.saveToJSON = function () {
		return {
			"uid": this.pinObject ? this.pinObject.uid : -1,
			"pa": this.pinAngle,
			"pd": this.pinDist,
			"msa": this.myStartAngle,
			"tsa": this.theirStartAngle,
			"lka": this.lastKnownAngle,
			"m": this.mode
		};
	};

	behinstProto.loadFromJSON = function (o) {
		this.pinObjectUid = o["uid"]; // wait until afterLoad to look up
		this.pinAngle = o["pa"];
		this.pinDist = o["pd"];
		this.myStartAngle = o["msa"];
		this.theirStartAngle = o["tsa"];
		this.lastKnownAngle = o["lka"];
		this.mode = o["m"];
	};

	behinstProto.afterLoad = function () {
		// Look up the pinned object UID now getObjectByUID is available
		if (this.pinObjectUid === -1)
			this.pinObject = null;
		else {
			this.pinObject = this.runtime.getObjectByUID(this.pinObjectUid);
			assert2(this.pinObject, "Failed to find pin object by UID");
		}

		this.pinObjectUid = -1;
	};

	behinstProto.onInstanceDestroyed = function (inst) {
		// Pinned object being destroyed
		if (this.pinObject == inst)
			this.pinObject = null;
	};

	behinstProto.onDestroy = function () {
		this.pinObject = null;
		this.runtime.removeDestroyCallback(this.myDestroyCallback);
	};

	behinstProto.tick = function () {
		// do work in tick2 instead, after events to get latest object position
	};

	behinstProto.tick2 = function () {
		if (this.runtime.scenes[this.inst.properties[1]] && this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname)) {

			
			if (!this.pinObject)
				return;
			
			if(this.pinObject.mytype == "_mesh")
			{
				this.pinObjectName = this.pinObject.properties[0];
			}
			else
			{
				this.pinObjectName = "mesh"+this.pinObject.uid;
			}
			// Instance angle has changed by events/something else
			if (this.lastKnownAngle !== this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).rotation.x)
				this.myStartAngle = cr.clamp_angle(this.myStartAngle + (this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).rotation.x - this.lastKnownAngle));

			var newx = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).position.x;
			var newy = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).position.y;

			if (this.mode === 3 || this.mode === 4) // rope mode or bar mode
			{
				var dist = cr.distanceTo(this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).position.x, this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).position.y, this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.pinObjectName).position.x, this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.pinObjectName).position.y);

				if ((dist > this.pinDist) || (this.mode === 4 && dist < this.pinDist)) {
					var a = cr.angleTo(this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.pinObjectName).position.x, this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.pinObjectName).position.y, this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).position.x, this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).position.y);
					newx = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.pinObjectName).position.x + Math.cos(a) * this.pinDist;
					newy = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.pinObjectName).position.y + Math.sin(a) * this.pinDist;
				}
			} else {
				newx = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.pinObjectName).position.x + Math.cos(this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.pinObjectName).rotation.x + this.pinAngle) * this.pinDist;
				newy = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.pinObjectName).position.y + Math.sin(this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.pinObjectName).rotation.x + this.pinAngle) * this.pinDist;
			}

			var newangle = cr.clamp_angle(this.myStartAngle + (this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.pinObjectName).rotation.x - this.theirStartAngle));
			this.lastKnownAngle = newangle;

			if ((this.mode === 0 || this.mode === 1 || this.mode === 3 || this.mode === 4)
				&& (this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).position.x !== newx || this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).position.y !== newy)) {
				this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).position.x = newx;
				this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).position.y = newy;
				this.inst.set_bbox_changed();
			}

			if ((this.mode === 0 || this.mode === 2) && (this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).rotation.x !== newangle)) {
				this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).rotation.x = newangle;
				this.inst.set_bbox_changed();
			}
		}
	};

	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections) {
		propsections.push({
			"title": this.type.name,
			"properties": [{
				"name": "Is pinned",
				"value": !!this.pinObject,
				"readonly": true
			}, {
				"name": "Pinned UID",
				"value": this.pinObject ? this.pinObject.uid : 0,
				"readonly": true
			}
			]
		});
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() { };

	Cnds.prototype.IsPinned = function () {
		return !!this.pinObject;
	};

	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() { };

	Acts.prototype.Pin = function (obj, mode_) {
		if (!obj)
			return;

		var otherinst = obj.getFirstPicked(this.inst);

		if (!otherinst)
			return;

		this.pinObject = otherinst;

		
		this.pinAngle = cr.angleTo(otherinst.x, otherinst.y, this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).position.x, this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).position.y) - otherinst.angle;
		this.pinDist = cr.distanceTo(otherinst.x, otherinst.y, this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).position.x, this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).position.y);
		this.myStartAngle = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).rotation.x;
		this.lastKnownAngle = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).rotation.x;
		this.theirStartAngle = otherinst.angle;
		this.mode = mode_;
	};

	Acts.prototype.Unpin = function () {
		this.pinObject = null;
	};

	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() { };

	Exps.prototype.PinnedUID = function (ret) {
		ret.set_int(this.pinObject ? this.pinObject.uid : -1);
	};

	behaviorProto.exps = new Exps();

}
	());
