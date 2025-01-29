// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.babylonSLEShadows = function (runtime) {
	this.runtime = runtime;
};

(function () {
	var behaviorProto = cr.behaviors.babylonSLEShadows.prototype;

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
		this.done = false;
		if (this.inst.mytype == "_light") {
			this.lightname = this.inst.properties[0];
		}
		else {
			this.lightname = "light" + this.inst.uid;
		}
	};

	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function () { };

	behinstProto.postCreate = function () { };

	function hex2rgb(hex) {
		return {
			r: hex & 0xff,
			g: (hex >> 8) & 0xff,
			b: (hex >> 16) & 0xff
		};
	}

	function getXYZ(c2xyz, inst) {
		var xyz = c2xyz;
		xyz = xyz.split(",");
		xyz[0] = xyz[0] - (inst.runtime.canvas.width / 2);
		xyz[1] = - (xyz[1] - (inst.runtime.canvas.height / 2));
		xyz[2] = xyz[2];
		return xyz;
	}

	behinstProto.saveToJSON = function () { };

	behinstProto.loadFromJSON = function (o) { };

	behinstProto.tick = function () {
		if (!this.done) {
			if (this.runtime.scenes[this.inst.properties[1]] && this.runtime.scenes[this.inst.properties[1]].getLightByName(this.lightname)) {
				var scene = this.runtime.scenes[this.inst.properties[1]];
				var light = scene.getLightByName(this.lightname);
				if (light.getShadowGenerator()) {
					light.getShadowGenerator().dispose();
				}

				var shadowGenerator = new BABYLON.ShadowGenerator(this.properties[2], light);
				shadowGenerator.forceBackFacesOnly = this.inst.properties[1];
				shadowGenerator.setDarkness(this.properties[3]);
				shadowGenerator.bias = 0.00005;
				if (this.properties[0] == 0) {
					shadowGenerator.useVarianceShadowMap = true;
				}
				else if (this.properties[0] == 1) {
					shadowGenerator.useBlurVarianceShadowMap = true;
					shadowGenerator.blurBoxOffset = this.properties[4];
					shadowGenerator.blurScale = this.properties[5];
				}
				else {
					shadowGenerator.usePoissonSampling = true;
				}
				shadowGenerator.getShadowMap().renderList = [];
				for (var i = 0; i < scene.meshes.length; i++) {

					shadowGenerator.getShadowMap().renderList.push(scene.meshes[i]);
				}
				this.done = true;
				this.runtime.untickMe(this);
			}
		}
	}

	behinstProto.doStart = function () { }

	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections) { };

	behinstProto.onDebugValueEdited = function (header, name, value) { };
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() { };

	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() { };
	Acts.prototype.PreventMeshCastShad = function (l) {
		var light = this.runtime.scenes[this.inst.properties[1]].getLightByName(this.lightname);
		if (l.getFirstPicked().mytype == "_mesh") {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(l.getFirstPicked().properties[0]);
		}
		else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName("mesh" + l.getFirstPicked().uid);
		}
		light.getShadowGenerator().getShadowMap().renderList.pop(mesh);
	};
	Acts.prototype.AllowMeshCastShad = function (l) {
		var light = this.runtime.scenes[this.inst.properties[1]].getLightByName(this.lightname);

		if (l.is_family) {
			for (var i = 0; i < l.instances.length; i++) {
				if (l.getFirstPicked().mytype == "_mesh") {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(l.instances[i].properties[0]);
				}
				else {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName("mesh" + l.instances[i].uid);
				}
				light.getShadowGenerator().getShadowMap().renderList.push(mesh);


			}
		}
		else {
			if (l.getFirstPicked().mytype == "_mesh") {
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(l.getFirstPicked().properties[0]);
			}
			else {
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName("mesh" + l.getFirstPicked().uid);
			}

			light.getShadowGenerator().getShadowMap().renderList.push(mesh);
		}

	};

	Acts.prototype.SetBias = function (b) {
		var light = this.runtime.scenes[this.inst.properties[1]].getLightByName(this.lightname);
		light.getShadowGenerator().bias = b;
	};
	Acts.prototype.SetBlurOffs = function (b) {
		var light = this.runtime.scenes[this.inst.properties[1]].getLightByName(this.lightname);
		light.getShadowGenerator().blurBoxOffset = b;
	};
	Acts.prototype.SetBlurScale = function (b) {
		var light = this.runtime.scenes[this.inst.properties[1]].getLightByName(this.lightname);
		light.getShadowGenerator().blurScale = b;
	};

	Acts.prototype.SetFilter = function (f) {
		var light = this.runtime.scenes[this.inst.properties[1]].getLightByName(this.lightname);
		light.getShadowGenerator().filter = f;
	};

	Acts.prototype.SetBackface = function (b) {
		var light = this.runtime.scenes[this.inst.properties[1]].getLightByName(this.lightname);
		light.getShadowGenerator().forceBackFacesOnly = b;
	};
	Acts.prototype.SetDarkness = function (d) {
		var light = this.runtime.scenes[this.inst.properties[1]].getLightByName(this.lightname);
		light.getShadowGenerator().setDarkness(d);
	};
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() { };

	behaviorProto.exps = new Exps();

}
	());
