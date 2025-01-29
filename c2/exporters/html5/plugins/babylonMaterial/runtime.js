// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv


cr.plugins_.babylonMaterialSLE = function (runtime) {
	this.runtime = runtime;

};

(function () {
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.babylonMaterialSLE.prototype;

	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function (plugin) {
		this.plugin = plugin;
		this.runtime = plugin.runtime;

	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function () {};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function (type) {
		this.type = type;
		this.runtime = type.runtime;
		this.mytype = "_material";
		// any other properties you need, e.g...
		// this.myValue = 0;
	};

	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function () {

		//this.runtime.tickMe(this);
		//this.runtime.tick2Me(this);
	};

	instanceProto.tick = function () {};

	instanceProto.tick2 = function () {};

	function getRGB(color) {
		var c2rgb = color.split(",");
		var r = c2rgb[0].split("(");
		var g = c2rgb[1];
		var b = c2rgb[2].split(")");
		r = r[1];
		g = g;
		b = b[0];
		return {
			r: r,
			g: g,
			b: b
		};
		return rgb;
	}

	function hex2rgb(hex) {
		return {
			r: hex & 0xff,
			g: (hex >> 8) & 0xff,
			b: (hex >> 16) & 0xff
		};
	}

	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function () {};

	// called when saving the full state of the game
	instanceProto.saveToJSON = function () {
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};

	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o) {
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};

	// only called if a layout object - draw to a this.babylon.canvas 2D context
	instanceProto.draw = function (ctx) {};

	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw) {};

	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections) {
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property

				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
	};

	instanceProto.onDebugValueEdited = function (header, name, value) {
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	pluginProto.cnds = new Cnds();

	function Acts() {};
	Acts.prototype.MatSetAlpha = function (alp) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.alpha = alp;
	};
	Acts.prototype.MatSetAlphaMode = function (alpmode) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.alphaMode = alpmode;
	};
	Acts.prototype.MatSetBackFaceCulling = function (state) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		if (state == 0) {
			material.backFaceCulling = true;
		} else {
			material.backFaceCulling = false;
		}

	};
	Acts.prototype.MatSetFillMode = function (fillm) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.fillMode = fillm;
	};
	Acts.prototype.MatSetSideOrient = function (sor) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.sideOrientation = sor;
	};
	Acts.prototype.MatSetFogState = function (state) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		if (state == 0) {
			material.fogEnabled = true;
		} else {
			material.fogEnabled = false;
		}
	};
	Acts.prototype.MatSetLightState = function (state) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		if (state == 0) {
			material.disableLighting = true;
		} else {
			material.disableLighting = false;
		}
	};
	Acts.prototype.MatSetParallState = function (state) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		if (state == 0) {
			material.useParallax = true;
		} else {
			material.useParallax = false;
		}
	};
	Acts.prototype.MatSetOccluState = function (state) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		if (state == 0) {
			material.useParallaxOcclusion = true;
		} else {
			material.useParallaxOcclusion = false;
		}
	};
	Acts.prototype.MatSetAlphaFromDif = function (state) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		if (state == 0) {
			material.hasAlpha = true;
			material.useAlphaFromDiffuseTexture = true;
		} else {
			material.hasAlpha = false;
			material.useAlphaFromDiffuseTexture = false;
		}
	};
	Acts.prototype.MatSetAmbColor = function (r, g, b) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.ambientColor = new BABYLON.Color3.FromInts(parseInt(r), parseInt(g), parseInt(b));
	};
	Acts.prototype.MatSetDifColor = function (r, g, b) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.diffuseColor = new BABYLON.Color3.FromInts(parseInt(r), parseInt(g), parseInt(b));
	};
	Acts.prototype.MatSetEmiColor = function (r, g, b) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.emissiveColor = new BABYLON.Color3.FromInts(parseInt(r), parseInt(g), parseInt(b));
	};
	Acts.prototype.MatSetSpecuColor = function (r, g, b) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.specularColor = new BABYLON.Color3.FromInts(parseInt(r), parseInt(g), parseInt(b));
	};
	Acts.prototype.MatSetDifTexture = function (texture) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.diffuseTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
	};
	Acts.prototype.MatSetAmbTexture = function (texture) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.ambientTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
	};
	Acts.prototype.MatSetBumpTexture = function (texture) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.bumpTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
	};
	Acts.prototype.MatSetEmiTexture = function (texture) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.emissiveTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
	};
	Acts.prototype.MatSetLightmapTexture = function (texture) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.lightmapTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
	};
	Acts.prototype.MatSetRefleTexture = function (type, texture, pl, rL, lev) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		var plane = pl.split(",");

		if (type == 0) {
			material.reflectionTexture = new BABYLON.CubeTexture(texture, this.runtime.scenes[this.properties[1]]);
			material.reflectionTexture.level = lev;
		} else {
			material.reflectionTexture = new BABYLON.MirrorTexture("mirror", 512, this.runtime.scenes[this.properties[1]], true); //Create a mirror texture
			material.reflectionTexture.mirrorPlane = new BABYLON.Plane(plane[0], plane[1], plane[2], plane[3]);
			material.reflectionTexture.level = lev;
			if (rL.is_family) {
				for (var i = 0; i < rL.instances.length; i++) {
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(rL.instances[i].properties[0]);
					material.reflectionTexture.renderList.push(mesh);
				}
			} else {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(rL.instances[0].properties[0]);
				material.reflectionTexture.renderList.push(mesh);
			}
		}
	};
	Acts.prototype.MatSetRefraTexture = function (texture) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.refractionTexture = new BABYLON.CubeTexture(texture, this.runtime.scenes[this.properties[1]]);
		material.linkRefractionWithTransparency = true;
		material.indexOfRefraction = 0.5;
	};
	Acts.prototype.MatSetMetallicTexture = function (texture) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.metallicTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
	};
	Acts.prototype.MatSetSpecuPower = function (spec) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.specularPower = spec;
	};
	Acts.prototype.MatSetParallScale = function (para) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.parallaxScaleBias = para;
	};
	Acts.prototype.MatSetRoughness = function (rough) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.roughness = rough;
	};
	Acts.prototype.MatCreateStandard = function () {
		var material = new BABYLON.StandardMaterial(this.properties[0], this.runtime.scenes[this.properties[1]]);
	};
	Acts.prototype.MatCreatePBR = function () {
		var material = new BABYLON.PBRMaterial(this.properties[0], this.runtime.scenes[this.properties[1]]);
	};
	Acts.prototype.MatSetAlbColor = function (r, g, b) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.albedoColor = new BABYLON.Color3.FromInts(r, g, b);
	};
	Acts.prototype.MatSetRefityColor = function (r, g, b) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.reflectivityColor = new BABYLON.Color3.FromInts(r, g, b);
	};
	Acts.prototype.MatSetAlbTexture = function (texture, u, v) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.albedoTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
		material.albedoTexture.uScale = u;
		material.albedoTexture.vScale = v;
	};
	Acts.prototype.MatSetMicroSur = function (mic) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.microSurface = mic;
	};
	Acts.prototype.MatSetDirecIntens = function (inten) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.directIntensity = inten;
	};
	Acts.prototype.MatSetEnvIntens = function (inten) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.environmentIntensity = inten;
	};
	Acts.prototype.MatSetCamExpo = function (expo) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.cameraExposure = expo;
	};
	Acts.prototype.MatSetCamContr = function (cont) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.cameraContrast = cont;
	};
	Acts.prototype.MatSetMesh = function (m) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		if (m.is_family) {
			for (var i = 0; i < m.instances.length; i++) {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(m);
				mesh.material = material;
			}
		} else {
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(m);
			mesh.material = material;
		}

	};
	Acts.prototype.MatSetUV = function (type, u, v) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		if (type == 0) {
			material.diffuseTexture.uScale = u;
			material.diffuseTexture.vScale = v;
		} else {
			material.bumpTexture.uScale = u;
			material.bumpTexture.vScale = v;
		}

	};
	Acts.prototype.MatUseEmAsIll = function (b) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.useEmissiveAsIllumination = b;

	};

	Acts.prototype.MatInvertNMX = function (b) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.invertNormalMapX = b;

	};

	Acts.prototype.MatInvertNMY = function (b) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.invertNormalMapY = b;

	};

	Acts.prototype.MatMetalAlphaRough = function (b) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.useRoughnessFromMetallicTextureAlpha = b;

	};

	Acts.prototype.MatMetalAGreenRough = function (b) {
		var material = this.runtime.scenes[this.properties[1]].getMaterialByName(this.properties[0]);
		material.useRoughnessFromMetallicTextureGreen = b;

	};

	pluginProto.acts = new Acts();

	function Exps() {};
	Exps.prototype.Name = function (ret) {
		ret.set_string(this.properties[0])
	};
	Exps.prototype.SceneUID = function (ret) {
		ret.set_int(this.properties[1])
	};
	pluginProto.exps = new Exps();

}
	());
