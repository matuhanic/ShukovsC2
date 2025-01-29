// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.babylonFog = function (runtime) {
	this.runtime = runtime;
};

(function () {
	var behaviorProto = cr.behaviors.babylonFog.prototype;

	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function (behavior, objtype) {
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};

	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function () {};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function (type, inst) {
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst; // associated object instance to modify
		this.runtime = type.runtime;
		this.done = false;
	};

	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function () {};

	behinstProto.postCreate = function () {};

	behinstProto.saveToJSON = function () {};

	behinstProto.loadFromJSON = function (o) {};

	behinstProto.tick = function () {
		if (!this.done) {
			if (this.runtime.scenes[this.inst.properties[19]]) {

				if (this.properties[0] == 1) // Fog enabled
				{
					if (this.properties[1] == 0) {
						this.runtime.scenes[this.inst.properties[19]].fogMode = BABYLON.Scene.FOGMODE_EXP;
					}
					if (this.properties[1] == 1) {
						this.runtime.scenes[this.inst.properties[19]].fogMode = BABYLON.Scene.FOGMODE_EXP2;
					}
					if (this.properties[1] == 2) {
						this.runtime.scenes[this.inst.properties[19]].fogMode = BABYLON.Scene.FOGMODE_LINEAR;
						this.runtime.scenes[this.inst.properties[19]].fogStart = this.properties[3];
						this.runtime.scenes[this.inst.properties[19]].fogEnd = this.properties[4];
					}
					/* if (this.properties[1] == 3) {
						this.runtime.scenes[this.inst.properties[19]].fogMode = BABYLON.Scene.FOGMODE_NONE;
					} */
					var fogColor = hex2rgb(this.properties[2]);
					this.runtime.scenes[this.inst.properties[19]].fogColor = new BABYLON.Color3.FromInts(fogColor.r, fogColor.g, fogColor.b);
					this.runtime.scenes[this.inst.properties[19]].fogDensity = this.properties[5];
				}
				this.done = true;
			}
		}
	}

	behinstProto.doStart = function () {}

	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections) {};

	behinstProto.onDebugValueEdited = function (header, name, value) {};
	/**END-PREVIEWONLY**/

	function getXYZ(c2xyz, inst) {
		var xyz = c2xyz;
		xyz = xyz.split(",");
		xyz[0] = xyz[0] - (inst.runtime.this.canvas.width / 2);
		xyz[1] =  - (xyz[1] - (inst.runtime.this.canvas.height / 2));
		xyz[2] = xyz[2];
		return xyz;
	}

	function hex2rgb(hex) {
		return {
			r: hex & 0xff,
			g: (hex >> 8) & 0xff,
			b: (hex >> 16) & 0xff
		};
	}

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};
	Acts.prototype.FogSetDensity = function (d) {
		this.runtime.scenes[this.inst.properties[19]].fogDensity = d;
	};
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	behaviorProto.exps = new Exps();

}
	());
