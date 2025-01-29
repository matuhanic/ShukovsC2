// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.babylonSkyhdr = function (runtime) {
	this.runtime = runtime;
};

(function () {
	var behaviorProto = cr.behaviors.babylonSkyhdr.prototype;

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
		if (this.runtime.scenes[this.inst.properties[19]]) {
			if(!this.done)
			{
			if (this.properties[0] == 1) // SkyHDR enabled
			{
				// Environment Texture
				var hdrTexture = new BABYLON.HDRCubeTexture(this.properties[1] + ".hdr", this.runtime.scenes[this.inst.properties[19]], this.properties[2]);
				// Skybox
				var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox"+this.inst.properties[19], this.properties[3], this.runtime.scenes[this.inst.properties[19]]);
				var hdrSkyboxMaterial = new BABYLON.PBRMaterial("hdrskyBoxMat"+this.inst.properties[19], this.runtime.scenes[this.inst.properties[19]]);
				hdrSkyboxMaterial.backFaceCulling = false;
				hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
				hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
				hdrSkyboxMaterial.microSurface = this.properties[4];
				hdrSkyboxMaterial.cameraExposure = this.properties[5];
				hdrSkyboxMaterial.cameraContrast = this.properties[6];
				hdrSkyboxMaterial.disableLighting = true;
				hdrSkybox.material = hdrSkyboxMaterial;
				hdrSkybox.infiniteDistance = true;
				this.done = true;
			}
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
