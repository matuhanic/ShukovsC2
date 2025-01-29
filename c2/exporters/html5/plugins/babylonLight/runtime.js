// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv



cr.plugins_.babylonLightSLE = function(runtime) {
    this.runtime = runtime;

};

(function() {
    /////////////////////////////////////
    // *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
    //                            vvvvvvvv
    var pluginProto = cr.plugins_.babylonLightSLE.prototype;

    /////////////////////////////////////
    // Object type class
    pluginProto.Type = function(plugin) {
        this.plugin = plugin;
        this.runtime = plugin.runtime;

    };

    var typeProto = pluginProto.Type.prototype;

    // called on startup for each object type
    typeProto.onCreate = function() {

    };

    /////////////////////////////////////
    // Instance class
    pluginProto.Instance = function(type) {
        this.type = type;
        this.runtime = type.runtime;
        this.mytype = "_light";
		this.done;
        // any other properties you need, e.g...
        // this.myValue = 0;
    };

    var instanceProto = pluginProto.Instance.prototype;

    // called whenever an instance is created
    instanceProto.onCreate = function() {



        //this.runtime.tickMe(this);
        this.runtime.tick2Me(this);
    };

    instanceProto.tick = function() {
    };

    instanceProto.tick2 = function() {
        if (this.properties[2] == 1) // Construct 2 is taking the wheel
        {

            if (this.runtime.scenes[this.properties[1]] && this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0])) {
                if (!this.done) {


                    switch (this.properties[3]) {
                        case 0:// ZY
                            //var xscale = this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).scaling.z;
                            //var yscale = this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).scaling.y;
                            //this.width = (this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).getBoundingInfo().boundingBox.extendSize.z * xscale) * 2;
                            //this.height = (this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).getBoundingInfo().boundingBox.extendSize.y * yscale) * 2;
                            this.x = this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).position.z;
                            this.y = -this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).position.y;
                            this.angle = this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).direction.x;
                            break;
                        case 1:// XY
                           // var xscale = this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).scaling.x;
                           // var yscale = this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).scaling.y;
                           // this.width = (this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).getBoundingInfo().boundingBox.extendSize.x * xscale) * 2;
                           // this.height = (this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).getBoundingInfo().boundingBox.extendSize.y * yscale) * 2;
                            this.x = this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).position.x;
                            this.y = -this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).position.y;
                            this.angle = this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).direction.z;
                            break;
                    }


                    this.set_bbox_changed();

                    this.done = true;
                    this.hotspotX = 0.5;
                    this.hotspotY = 0.5;
                    this.update_bbox();
                } else {
                    this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).direction.x = this.angle; // Euler
					
                    switch (this.properties[3]) {
                        case 0:// ZY
                            this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).position.z = this.x;
                            this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).position.y = -this.y;
                            //this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).scaling.z = this.width / (this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).getBoundingInfo().boundingBox.extendSize.z * 2);
                            //this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).scaling.y = this.height / (this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).getBoundingInfo().boundingBox.extendSize.y * 2);

                            break;
                        case 1:// XY
                            this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).position.x = this.x;
                            this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).position.y = -this.y;
                           // this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).scaling.x = this.width / (this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).getBoundingInfo().boundingBox.extendSize.x * 2);
                           // this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).scaling.y = this.height / (this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).getBoundingInfo().boundingBox.extendSize.y * 2);

                            break;
                    }
                    this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).setEnabled(this.visible);
				    this.runtime.scenes[this.properties[1]].getLightByName(this.properties[0]).intensity = this.opacity/100;

                }

            }

        }
    };

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
    instanceProto.onDestroy = function() { };

    // called when saving the full state of the game
    instanceProto.saveToJSON = function() {
        // return a Javascript object containing information about your object's state
        // note you MUST use double-quote syntax (e.g. "property": value) to prevent
        // Closure Compiler renaming and breaking the save format
        return {
            // e.g.
            //"myValue": this.myValue
        };
    };

    // called when loading the full state of the game
    instanceProto.loadFromJSON = function(o) {
        // load from the state previously saved by saveToJSON
        // 'o' provides the same object that you saved, e.g.
        // this.myValue = o["myValue"];
        // note you MUST use double-quote syntax (e.g. o["property"]) to prevent
        // Closure Compiler renaming and breaking the save format
    };

    // only called if a layout object - draw to a this.babylon.canvas 2D context
    instanceProto.draw = function(ctx) {

    };

    // only called if a layout object in WebGL mode - draw to the WebGL context
    // 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
    // directory or just copy what other plugins do.
    instanceProto.drawGL = function(glw) { };

    // The comments around these functions ensure they are removed when exporting, since the
    // debugger code is no longer relevant after publishing.
    /**BEGIN-PREVIEWONLY**/
    instanceProto.getDebuggerValues = function(propsections) {
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

    instanceProto.onDebugValueEdited = function(header, name, value) {
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
	Cnds.prototype.IsLightReady = function () {
		return true;
	};
	pluginProto.cnds = new Cnds();

	function Acts() { };
	Acts.prototype.LightSetDiff = function (r, g, b) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.diffuse.r = r;
		light.diffuse.g = g;
		light.diffuse.b = b;
	};

	Acts.prototype.LightSetIntensity = function (i) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.intensity = i;
	};
	Acts.prototype.LightSetLightMMode = function (md) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.lightmapMode = md;
	};
	Acts.prototype.LightSetLightRadius = function (r) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.radius = r;
	};
	Acts.prototype.LightSetLightRange = function (r) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.range = r;
	};
	Acts.prototype.LightSetLightExponent = function (ex) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.exponent = ex;
	};
	Acts.prototype.LightSetLightAngle = function (an) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.angle = an;
	};

	Acts.prototype.SetGroundColor = function (r, g, b) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.groundColor.r = r;
		light.groundColor.g = g;
		light.groundColor.b = b;
	};
	Acts.prototype.LightVisiblity = function (v) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.visibility = v;
	};
	Acts.prototype.LightSetParent = function (ptype, p) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		if (ptype == 0) {
			var parnt = this.runtime.scenes[this.properties[1]].getMeshByName(p.getFirstPicked().properties[0]);
		} else if (ptype == 1) {
			var parnt = this.runtime.scenes[this.properties[1]].getLightByName(p.getFirstPicked().properties[0]);
		} else {
			var parnt = this.runtime.scenes[this.properties[1]].getMeshByName(p.getFirstPicked().properties[0]);
		}
		//var fix = light.getAbsolutePosition();
		light.parent = parnt;
		//light.setAbsolutePosition(fix);
		light.rotation = new BABYLON.Vector3(0, 0, 0);
		light.scaling = new BABYLON.Vector3(1, 1, 1);

	};
	Acts.prototype.LightSetPosition = function (x, y, z) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.position = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.LightSetRotation = function (x, y, z) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.rotation = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.LightSetScaling = function (x, y, z) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.scaling = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.TranslateLightBy = function (x, y, z) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.position = new BABYLON.Vector3(light.position.x + x, light.position.y + y, light.position.z + z);
	};
	Acts.prototype.RotateLightBy = function (x, y, z) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.rotation = new BABYLON.Vector3(light.rotation.x + x, light.rotation.y + y, light.rotation.z + z);
	};
	Acts.prototype.ScaleLightBy = function (x, y, z) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.scaling = new BABYLON.Vector3(light.scaling.x + x, light.scaling.y + y, light.scaling.z + z);
	};

	Acts.prototype.LightBeginAnim = function (animName, start, end, loop, speed) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		this.runtime.scenes[this.properties[1]].beginDirectAnimation(light, [light.getAnimationByName(animName)], start, end, loop, speed);

	};

	Acts.prototype.LightStopAnim = function (name) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		this.runtime.scenes[this.properties[1]].stopAnimation(light);
	};

	Acts.prototype.LightCreateAnim = function (animName, param, start, mid, end, fps) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);

		start = start.split(",");
		mid = mid.split(",");
		end = end.split(",");

		var anim = new BABYLON.Animation(animName, param, fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE, true);
		anim.blendingSpeed = 0.5;
		// An array with all animation keys
		var keys = [];

		//At the animation key 0, the value of scaling is "1"
		start[0] = parseInt(start[0]);
		start[1] = parseFloat(start[1]);
		mid[0] = parseInt(mid[0]);
		mid[1] = parseFloat(mid[1]);
		end[0] = parseInt(end[0]);
		end[1] = parseFloat(end[1]);

		if (param == "rotation.x" || param == "rotation.y" || param == "rotation.z") {
			start[1] *= (Math.PI / 180);
			mid[1] *= (Math.PI / 180);
			end[1] *= (Math.PI / 180);
		}

		keys.push({
			frame: start[0],
			value: start[1]
		});

		//At the animation key 20, the value of scaling is "0.2"
		keys.push({
			frame: mid[0],
			value: mid[1]
		});

		//At the animation key 100, the value of scaling is "1"
		keys.push({
			frame: end[0],
			value: end[1]
		});

		anim.setKeys(keys);
		light.animations.push(anim);

	};

	Acts.prototype.LightPauseAnim = function () {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		this.runtime.scenes[this.properties[1]].getAnimatableByTarget(light).pause();
	};

	Acts.prototype.LightRestartAnim = function () {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		this.runtime.scenes[this.properties[1]].getAnimatableByTarget(light).restart();
	};
	Acts.prototype.LightSetEnabled = function (state) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		if (state == 0) {
			light.setEnabled(true);
		} else {
			light.setEnabled(false);
		}
	};
	Acts.prototype.RotateLightXLocal = function (angle) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.rotate(BABYLON.Axis.X, angle, BABYLON.Space.LOCAL);
	};
	Acts.prototype.RotateLightYLocal = function (angle) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.rotate(BABYLON.Axis.Y, angle, BABYLON.Space.LOCAL);
	};
	Acts.prototype.RotateLightZLocal = function (angle) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.rotate(BABYLON.Axis.Z, angle, BABYLON.Space.LOCAL);
	};
	Acts.prototype.RotateLightXWorld = function (angle) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.rotate(BABYLON.Axis.X, angle, BABYLON.Space.WORLD);
	};
	Acts.prototype.RotateLightYWorld = function (angle) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.rotate(BABYLON.Axis.Y, angle, BABYLON.Space.WORLD);
	};
	Acts.prototype.RotateLightZWorld = function (angle) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.rotate(BABYLON.Axis.Z, angle, BABYLON.Space.WORLD);
	};

	Acts.prototype.TranslateLightXLocal = function (d) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.translate(BABYLON.Axis.X, d, BABYLON.Space.LOCAL);
	};
	Acts.prototype.TranslateLightYLocal = function (d) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.translate(BABYLON.Axis.Y, d, BABYLON.Space.LOCAL);
	};
	Acts.prototype.TranslateLightZLocal = function (d) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.translate(BABYLON.Axis.Z, d, BABYLON.Space.LOCAL);
	};
	Acts.prototype.TranslateLightXWorld = function (d) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.translate(BABYLON.Axis.X, d, BABYLON.Space.WORLD);
	};
	Acts.prototype.TranslateLightYWorld = function (d) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.translate(BABYLON.Axis.Y, d, BABYLON.Space.WORLD);
	};
	Acts.prototype.TranslateLightZWorld = function (d) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.translate(BABYLON.Axis.Z, d, BABYLON.Space.WORLD);
	};
	Acts.prototype.LightSetPickable = function (pickable) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		if (pickable == 0) {
			light.isPickable = true;
		} else {
			light.isPickable = false;
		}
	};
	Acts.prototype.LightDestroy = function (type) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.dispose();
	};

	Acts.prototype.LightTranslLocaly = function (x, y, z) {
		var light = this.runtime.scenes[this.properties[1]].getLightByName(this.properties.[0]);
		light.position.x = new BABYLON.Vector3(BABYLON.Axis.X, light.position.x + x, BABYLON.Space.LOCAL);
		light.position.y = new BABYLON.Vector3(BABYLON.Axis.Y, light.position.y + y, BABYLON.Space.LOCAL);
		light.position.z = new BABYLON.Vector3(BABYLON.Axis.Z, light.position.z + z, BABYLON.Space.LOCAL);
	};


	pluginProto.acts = new Acts();

	function Exps() { };
	Exps.prototype.Name = function (ret) {
		ret.set_string(this.properties.[0])
	};
	Exps.prototype.SceneUID = function (ret) {
		ret.set_int(this.properties[1])
	};
	pluginProto.exps = new Exps();

}
	());
