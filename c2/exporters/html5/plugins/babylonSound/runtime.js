// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv


cr.plugins_.babylonNewSound = function (runtime) {
	this.runtime = runtime;

};

(function () {
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.babylonNewSound.prototype;

	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function (plugin) {
		this.plugin = plugin;
		this.runtime = plugin.runtime;

	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function () { };

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function (type) {
		this.type = type;
		this.runtime = type.runtime;
		this.mytype = "_sound";
		this.done = false;
		this.created = false;
		// any other properties you need, e.g...
		// this.myValue = 0;
	};

	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function () {
		//this.runtime.tickMe(this);
		this.runtime.tick2Me(this);
	};

	instanceProto.tick2 = function () {
		if (this.runtime.scenes[this.properties[1]] && !this.runtime.scenes[this.properties[1]].getSoundByName("sound" + this.uid)) { // Is scene defined
			if (!this.created) // We didn't create the mesh yet
			{
				var xpos = this.x - (this.runtime.original_width / 2);
				var ypos = - (this.y - (this.runtime.original_height / 2));
				var zpos = this.properties[6];
				this.scene = this.runtime.scenes[this.properties[1]];
				var _this = this;
				var triggerLoaded = this.runtime.trigger(cr.plugins_.babylonNewSound.prototype.cnds.IsSoundLoaded, this);
				var triggerEnded = this.runtime.trigger(cr.plugins_.babylonNewSound.prototype.cnds.IsSoundEnded, this);
				this.sound = new BABYLON.Sound("sound" + this.uid, this.properties[3], this.scene,
				function(){triggerLoaded;}, { loop: _this.properties[8], autoplay:  _this.properties[9], spatialSound: _this.properties[10], maxDistance: _this.properties[6],refDistance:_this.properties[7],rolloffFactor:_this.properties[11] });
				this.created = true;
				this.sound.setPosition(new BABYLON.Vector3(xpos,ypos,zpos));
				
				this.sound.onended = function () {
					triggerEnded;
				}
				
			}
			//alert(this.created);
			if (this.created) {
				if (this.properties[2] == 1) // Construct 2 is taking the wheel
				{
					if (!this.done) {

						//var xscale = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).scaling.z;
						//var yscale = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).scaling.y;
						//this.width = (this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).getBoundingInfo().boundingBox.extendSize.z * xscale) * 2;
						//this.height = (this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).getBoundingInfo().boundingBox.extendSize.y * yscale) * 2;
						this.x = xpos;
						this.y = -ypos;

						//this.angle = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).rotation.x;
						this.set_bbox_changed();

						this.done = true;
						this.hotspotX = 0.5;
						this.hotspotY = 0.5;
						this.update_bbox();
					} else {
						//this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).rotation.x = this.angle; // Euler
						if(this.sound)
						{
							this.sound.setPosition(new BABYLON.Vector3(parseFloat(this.x)), parseFloat(-this.y), parseFloat(this.properties[6]));
						}
						
						//this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).isVisible = this.visible;
						//this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).visibility = this.opacity;
						//this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).scaling.z = this.width / (this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).getBoundingInfo().boundingBox.extendSize.z * 2);
						//this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).scaling.y = this.height / (this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).getBoundingInfo().boundingBox.extendSize.y * 2);

					}

				} else // We don't need to check again
				{
					this.runtime.untick2Me(this);
				}
			}

		}

	};

	instanceProto.tick = function () { };

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

	function getAnimName(inst, animID) {
		var animName = inst.type.animations[animID][0]; //DiffuseMap, BumpMap, SpecularMap
		return animName;
	}
	function getAnimTextureFileByName(inst, name, frame) {
		var animID;
		var file = "null";
		for (var i = 0; i < inst.type.animations.length; i++) {
			var frameName = getAnimName(inst, i);

			if (frameName == name) {
				animID = i;
				var anim = inst.type.animations[animID][7];
				var file = anim[frame][0]; // "model-myanim-000.png" "model-myanim-001.png"
				break;
			} else {
				continue;
			}
		}

		return file;

	}

	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function () { };

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
	instanceProto.draw = function (ctx) { };

	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw) { };

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
	function Cnds() { };

	Cnds.prototype.IsSoundLoaded = function () {	
		return true;
	};

	Cnds.prototype.IsSoundEnded = function () {
		return true;
	};
	Cnds.prototype.IsSoundPlaying = function () {
		return this.sound.isPlaying;
	};

	pluginProto.cnds = new Cnds();

	function Acts() { };

	Acts.prototype.AttachToMesh = function (o) {
		this.sound.attachToMesh(this.scene.getMeshByName("mesh" + o.getFirstPicked().uid));
	};
	Acts.prototype.DetachMesh = function () {
		this.sound.detachFromMesh();
	};
	Acts.prototype.Play = function () {
		this.sound.play();
	};
	Acts.prototype.Stop = function () {
		this.sound.stop();
	};
	Acts.prototype.Pause = function () {
		this.sound.pause();
	};
	Acts.prototype.Destroy = function () {
		this.sound.dispose();
	};
	Acts.prototype.SetVolume = function (v) {
		this.sound.setVolume(v);
	};
	Acts.prototype.SetPosition = function (x, y, z) {
		this.sound.setPosition(new BABYLON.Vector3(x, y, z));
	};
	Acts.prototype.SetPlaybackRate = function (r) {
		this.sound.setPlaybackRate(r);
	};

	Acts.prototype.SetLocalDir = function (x, y, z) {
		this.sound.setLocalDirectionToMesh(new BABYLON.Vector3(x, y, z));
	};

	Acts.prototype.SetDirCone = function (x, y, z) {
		this.sound.setDirectionalCone(x, y, z);
	};
	pluginProto.acts = new Acts();

	function Exps() { };


	pluginProto.exps = new Exps();

}
	());
