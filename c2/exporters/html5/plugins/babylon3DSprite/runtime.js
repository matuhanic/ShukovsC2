// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv


cr.plugins_.babylon3DSprite = function (runtime) {
	this.runtime = runtime;

};

(function () {
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.babylon3DSprite.prototype;

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
		this.mytype = "_sprite";
		this.done = false;
		this.created = false;
		// any other properties you need, e.g...
		// this.myValue = 0;
	};

	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function () {
		//this.runtime.tickMe(this);
		//alert(this.type.animations[0][7][0]);
		this.runtime.tick2Me(this);
	};

	function GetAnimation(type, name) {
		for (var i = 0; i < type.animations.length; i++) {
			if (type.animations[i][0] == name) {

				return {
					name: type.animations[i][0],
					speed: type.animations[i][1],
					loop: type.animations[i][2],
					images: type.animations[i][7]
				};
			}
		}
		return false;
	}
	instanceProto.tick2 = function () {
		if (this.runtime.scenes[this.properties[1]] && !this.sprite) { // Is scene defined
			if (!this.created) // We didn't create the mesh yet
			{
				var xpos = this.x - (this.runtime.original_width / 2);
				var ypos = - (this.y - (this.runtime.original_height / 2));
				var zpos = this.properties[7];
				var scene = this.runtime.scenes[this.properties[1]];
				this.image = GetAnimation(this.type, this.properties[3]).images[this.properties[4]][0];
				this.spriteManager = new BABYLON.SpriteManager("spriteManager" + this.uid, this.image, 1, 64, scene);
				this.spriteManager.cellWidth = this.properties[6];
				this.spriteManager.cellHeight = this.properties[7];
				this.spriteManager.fogEnabled = true;
				this.sprite = new BABYLON.Sprite("sprite" + this.uid, this.spriteManager);
				this.sprite.isPickable = true;
				if (this.properties[5]) {
					this.sprite.playAnimation(this.properties[8], this.properties[9], GetAnimation(this.type, this.properties[3]).loop, (3000 / GetAnimation(this.type, this.properties[3]).speed));
				}

				this.sprite.angle = -this.angle;
				this.sprite.width = this.width;
				this.sprite.height = this.height
				this.sprite.position = new BABYLON.Vector3(xpos, ypos, zpos);;
				this.created = true;
			}
			if (this.created) {
				if (this.properties[2] == 1) // Construct 2 is taking the wheel
				{
					if (!this.done) {

						//var xscale = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).scaling.z;
						//var yscale = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).scaling.y;
						//this.width = (this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).getBoundingInfo().boundingBox.extendSize.z * xscale) * 2;
						//this.height = (this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).getBoundingInfo().boundingBox.extendSize.y * yscale) * 2;
						this.x = this.sprite.position.x;
						this.y = -this.sprite.position.y;
						this.angle = this.sprite.angle;
						this.set_bbox_changed();

						this.done = true;
						this.hotspotX = 0.5;
						this.hotspotY = 0.5;
						this.update_bbox();
					} else {
						this.sprite.angle = this.angle; // Euler
						this.sprite.position.x = this.x;
						this.sprite.position.y = -this.y;
						//this.runtime.scenes[this.properties[1]].getMeshByName("mesh"+this.uid).isVisible = this.visible;
						//this.runtime.scenes[this.properties[1]].getMeshByName("mesh"+this.uid).visibility = this.opacity;


						this.sprite.width = this.width;
						this.sprite.height = this.height;
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


	pluginProto.cnds = new Cnds();

	function Acts() { };
	Acts.prototype.SetCellSize = function (w, h) {
		this.spriteManager.cellWidth = w;
		this.spriteManager.cellHeight = h;
	};
	Acts.prototype.Dispose = function () {
		this.sprite.dispose();
		this.spriteManager.dispose();
	};
	Acts.prototype.Angle = function (a) {
		this.sprite.angle = a;
	};
	Acts.prototype.SetColor = function (r, g, b) {
		this.sprite.color.r = r;
		this.sprite.color.g = g;
		this.sprite.color.b = b;
	};
	Acts.prototype.Width = function (w) {
		this.sprite.width = w;
	};
	Acts.prototype.Height = function (h) {
		this.sprite.height = h;
	};
	Acts.prototype.SetPosition = function (x, y, z) {
		this.sprite.position = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.PlayAnimation = function (from, to, loop, delay) {
		this.sprite.playAnimation(from, to, loop, delay);
	};
	Acts.prototype.StopAnimation = function (y) {
		this.sprite.stopAnimation();
	};
	pluginProto.acts = new Acts();

	function Exps() { };


	pluginProto.exps = new Exps();

}
	());
