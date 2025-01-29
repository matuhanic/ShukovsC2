// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.babylonShaderMat = function (runtime) {
	this.runtime = runtime;
};

(function () {
	var behaviorProto = cr.behaviors.babylonShaderMat.prototype;

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
		if (this.inst.mytype == "_mesh") {
			this.meshname = this.inst.properties[0];
		} else {
			this.meshname = "mesh" + this.inst.uid;
		}
	};

	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function () {};

	behinstProto.postCreate = function () {};

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
		xyz[1] =  - (xyz[1] - (inst.runtime.canvas.height / 2));
		xyz[2] = xyz[2];
		return xyz;
	}

	behinstProto.saveToJSON = function () {};

	behinstProto.loadFromJSON = function (o) {};

	behinstProto.tick = function () {
		if (!this.done) {
			if (this.runtime.scenes[this.inst.properties[1]] && this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname)) {
				var scene = this.runtime.scenes[this.inst.properties[1]];
				if (this.properties[0].length > 0 && this.properties[1].length > 0) {
					BABYLON.Effect.ShadersStore["custom" + "beh" + this.inst.uid + "VertexShader"] = this.properties[0];
					BABYLON.Effect.ShadersStore["custom" + "beh" + this.inst.uid + "FragmentShader"] = this.properties[1];
					this.mat = new BABYLON.ShaderMaterial("behshader" + this.inst.uid, scene,
							"custom" + "beh" + this.inst.uid, {
							attributes: this.properties[2].split(","),
							uniforms: this.properties[3].split(",")
						});

					this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname).material = this.mat;
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

	Acts.prototype.SetFloat = function (p, v) {
		this.mat.setFloat(p, v);
	};
	Acts.prototype.SetTexture = function (p, v) {
		this.mat.setTexture(p, v);
	};
	Acts.prototype.SetVector3 = function (p, x, y, z) {
		this.mat.setVector3(p, new BABYLON.Vector3(x, y, z));
	};
	Acts.prototype.SetVector2 = function (p, x, y) {
		this.mat.setVector2(p, new BABYLON.Vector2(x, y));
	};

	Acts.prototype.SetColor3 = function (p, r, g, b) {
		this.mat.setColor3(p, new BABYLON.Color3.FromInts(r, g, b));
	};
	Acts.prototype.SetColor4 = function (p, r, g, b, a) {
		this.mat.setColor4(p, new BABYLON.Color4.FromInts(r, g, b, a));
	};

	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	behaviorProto.exps = new Exps();

}
	());
