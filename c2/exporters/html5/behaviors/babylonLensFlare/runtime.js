// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.babylonLensflare = function (runtime) {
	this.runtime = runtime;
};

(function () {
	var behaviorProto = cr.behaviors.babylonLensflare.prototype;

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

	behinstProto.onCreate = function () {
		if(this.inst.mytype == "_light")
		{
			this.lightname = this.inst.properties[0];
		}
		else (this.inst.mytype == "_newlight")
		{
			this.lightname = "light" + this.inst.uid;
		}
	};

	behinstProto.postCreate = function () {};

	function hex2rgb(hex) {
		return {
			r : hex & 0xff,
			g : (hex >> 8) & 0xff,
			b : (hex >> 16) & 0xff
		};
	}

	function getXYZ(c2xyz, inst) {
		var xyz = c2xyz;
		xyz = xyz.split(",");
		xyz[0] = xyz[0] - (inst.runtime.canvas.width / 2);
		xyz[1] =  - (xyz[1] - (inst.runtime.canvas.height / 2));
		xyz[2] = xyz[2];
		return xyz;
	}

	behinstProto.saveToJSON = function () {};

	behinstProto.loadFromJSON = function (o) {};

	behinstProto.tick = function () {
		if (!this.done) {
			if (this.runtime.scenes[this.inst.properties[1]] && this.runtime.scenes[this.inst.properties[1]].getLightByName(this.lightname)) {
				var light = this.runtime.scenes[this.inst.properties[1]].getLightByName(this.lightname);
				var lensFlareSystem = new BABYLON.LensFlareSystem("lensflare" + this.inst.uid, light, this.runtime.scenes[this.inst.properties[1]]);
				var lensflare1RGB = hex2rgb(this.properties[3]);
				var lensflare2RGB = hex2rgb(this.properties[8]);
				var lensflare3RGB = hex2rgb(this.properties[13]);
				var lensflare4RGB = hex2rgb(this.properties[18]);
				var lensflare5RGB = hex2rgb(this.properties[23]);
				if (this.properties[0] == 1) // Lensflare 1 enabled
				{

					var flare1 = new BABYLON.LensFlare(this.properties[1], this.properties[2], new BABYLON.Color3.FromInts(lensflare1RGB.r, lensflare1RGB.g, lensflare1RGB.b), this.properties[4], lensFlareSystem);
				}
				if (this.properties[5] == 1) // Lensflare 2 enabled
				{

					var flare2 = new BABYLON.LensFlare(this.properties[6], this.properties[7], new BABYLON.Color3.FromInts(lensflare2RGB.r, lensflare2RGB.g, lensflare2RGB.b), this.properties[9], lensFlareSystem);
				}
				if (this.properties[10] == 1) // Lensflare 3 enabled
				{

					var flare3 = new BABYLON.LensFlare(this.properties[11], this.properties[12], new BABYLON.Color3.FromInts(lensflare3RGB.r, lensflare3RGB.g, lensflare3RGB.b), this.properties[14], lensFlareSystem);
				}
				if (this.properties[15] == 1) // Lensflare 4 enabled
				{

					var flare4 = new BABYLON.LensFlare(this.properties[16], this.properties[17], new BABYLON.Color3.FromInts(lensflare4RGB.r, lensflare4RGB.g, lensflare4RGB.b), this.properties[19], lensFlareSystem);
				}
				if (this.properties[20] == 1) // Lensflare 5 enabled
				{

					var flare5 = new BABYLON.LensFlare(this.properties[21], this.properties[22], new BABYLON.Color3.FromInts(lensflare5RGB.r, lensflare5RGB.g, lensflare5RGB.b), this.properties[24], lensFlareSystem);
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

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	behaviorProto.exps = new Exps();

}
	());
