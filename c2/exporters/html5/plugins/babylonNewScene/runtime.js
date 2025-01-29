// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

 /////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv


cr.plugins_.babylonNewScene = function (runtime) {
	this.runtime = runtime;

};

(function () {
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.babylonNewScene.prototype;

	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function (plugin) {
		this.plugin = plugin;
		this.runtime = plugin.runtime;
		this.runtime.scenes = [];
		this.runtime.babylCanvasList = [];

	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function () {};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function (type) {
		this.type = type;
		this.runtime = type.runtime;

		this.scene;
		this.engine;
		this.mytype = "_scene";
		this.canvas;
		this.c2canvas;
		this.maindiv;
		// any other properties you need, e.g...
		// this.myValue = 0;
	};

	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function () {

		// Did we already create the canvas ?
		if (document.getElementById('babylonCanvas' + this.uid) === null) {
			this.canvas = document.createElement('canvas');
			this.c2canvas = document.getElementById('c2canvas');
			this.maindiv = this.runtime.canvas.parentNode;
			this.canvas.id = "babylonCanvas" + this.uid;
			this.runtime.babylCanvasList.push(this.canvas);
			this.canvas.style.position = "absolute";
			this.c2canvas.style.position = "absolute";
			this.maindiv.style.position = "relative";
			this.canvas.style.width = this.width * 100 / this.runtime.original_width + "%";
			this.canvas.style.height = this.height * 100 / this.runtime.original_height + "%";
			this.canvas.style.top = this.x * this.runtime.aspect_scale + "px";
			this.canvas.style.left = this.y * this.runtime.aspect_scale + "px";
			this.runtime.canvas.style["pointer-events"] = "none";

			if (this.properties[19] == 0) // Render inside C2
			{
				this.canvas.style.zIndex = "0";
				this.canvas.style.opacity = 0;
				this.webGL_texture = this.runtime.glwrap.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			} else if (this.properties[19] == 1) // Render under C2
			{
				this.canvas.style.zIndex = "0";
				this.runtime.canvas.style.zIndex = "1";
				this.canvas.style.opacity = 1;
			} else // Render ontop of C2
			{
				//this.canvas.style.zIndex = "1";
				//this.runtime.canvas.style.zIndex = "0";
				//this.canvas.style.opacity = 1;

			}
			this.canvas.setAttribute("unselectable", "on");
			this.canvas.style.userSelect = "none";
			this.canvas.style.webkitUserSelect = "none";
			this.canvas.style.MozUserSelect = "none";

			this.canvas.addEventListener('contextmenu', function (e) {
				if (e.button === 2) {
					e.preventDefault();
					return false;
				}
			}, false);

			this.maindiv.appendChild(this.canvas);

			var engine = new BABYLON.Engine(this.canvas, this.properties[0]);
			this.engine = engine;
			this.engine.enableOfflineSupport = false;
			engine.setDepthBuffer(this.properties[1]);
			engine.renderEvenInBackground = this.properties[2];
			engine.cullBackFaces = this.properties[3];
			engine.setHardwareScalingLevel(this.properties[20]);
			var scene = new BABYLON.Scene(engine);
			if (this.engine) // Pre resize
			{
				this.engine.resize();
			}

			if (this.properties[4] == 0) //False
			{
				this.engine.hideLoadingUI();
				this.runtime.canvas.style.zIndex = "1";
			}

			scene.MinDeltaTime = this.properties[5];
			scene.MaxDeltaTime = this.properties[6];
			scene.autoClear = this.properties[7];
			var clearCol = getRGB(this.properties[8]);
			var ambCol = getRGB(this.properties[9]);
			scene.clearColor = new BABYLON.Color3.FromInts(clearCol.r, clearCol.g, clearCol.b);
			scene.ambientColor = new BABYLON.Color3.FromInts(ambCol.r, ambCol.g, ambCol.b);
			scene.forceWireframe = this.properties[10];
			scene.forcePointsCloud = this.properties[11];
			scene.forceShowBoundingBoxes = this.properties[12];
			scene.shadowsEnabled = this.properties[13];
			scene.lightsEnabled = this.properties[14];
			scene.texturesEnabled = this.properties[15];

			// Debug
			if (this.properties[16] == 1) {
				scene.debugLayer.show();
				//document.getElementById("DebugLayer").style.zIndex = "1";
		document.getElementById("scene-explorer-host").style.zIndex = "5";
document.getElementById("inspector-host").style.zIndex = "5";

			}

			scene.collisionsEnabled = true;
			var grav = this.properties[17].split(",");
			grav[0] = parseFloat(grav[0]);
			grav[1] = parseFloat(grav[1]);
			grav[2] = parseFloat(grav[2]);
			// Wait for textures and shaders to be ready
			var ins = this;
			scene.executeWhenReady(function () {
				ins.runtime.scenes[ins.properties[18]] = scene;
				ins.runtime.scenes[ins.properties[18]].canvas = ins.canvas;
				engine.resize();
				ins.scene = scene;
				ins.canvas.scene = scene;
				setTimeout(function () {
					ins.runtime.trigger(cr.plugins_.babylonNewScene.prototype.cnds.IsSceneReady, ins);
				}, 500); // Wait 500ms before trigerring

				if (ins.properties[4] == 0) //False
				{
					ins.runtime.canvas.style.zIndex = "0";
				}
				// Once the scene is loaded, just register a render loop to render it
				engine.runRenderLoop(function () {
					scene.render();
				});
				
 			});

		}

		//this.runtime.tickMe(this);
		if (this.properties[19] == 0) // Render inside C2
		{
			this.runtime.tick2Me(this);
		}
	};

	instanceProto.tick = function () {};

	instanceProto.tick2 = function () {

		this.runtime.redraw = true;
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
		return rgb;
	}

	function getXYZ(c2xyz, inst) {
		var xyz = c2xyz;
		xyz = xyz.split(",");
		xyz[0] = xyz[0] - (inst.runtime.this.canvas.width / 2);
		xyz[1] =  - (xyz[1] - (inst.runtime.this.canvas.height / 2));
		xyz[2] = xyz[2];
		return xyz;
	}

	// Resize
	/* window.addEventListener("resize", function () {
	if (this.engine) {
	this.engine.resize();
	}

	}); */

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

	// only called if a layout object - draw to a this.canvas 2D context
	instanceProto.draw = function (ctx) {};

	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	function insertAfter(newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}
	instanceProto.drawGL = function (glw) {
		if (this.properties[19] == 0) // Render inside C2
		{
			this.canvas = document.getElementById('babylonCanvas' + this.uid); // Get canvas for layout changes
			this.scene = this.canvas.scene; // Get canvas for layout changes
			this.runtime.scenes[this.uid] = this.scene;
			if (this.runtime.babylCanvasList.length > 1) {
				insertAfter(this.canvas, this.canvas.parentNode.children[this.runtime.babylCanvasList.length]); // Fixes camera control issue
			}
			this.runtime.glwrap.videoToTexture(this.canvas, this.webGL_texture);
			glw.setTexture(this.webGL_texture);
			glw.setOpacity(this.opacity);
			var q = this.bquad;
			glw.quad(q.blx, q.tly, q.brx, q.try_, q.trx, q.bry, q.tlx, q.bly);
		}

	};

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

	Cnds.prototype.IsSceneReady = function () {

		return this.scene.isReady();
	};
	pluginProto.cnds = new Cnds();

	function Acts() {};
	Acts.prototype.SceneSetCam = function (c) {
		var camera = this.scene.getCameraByName(c.instances[0].properties[0]);
		this.scene.activeCamera = [];
		this.scene.setActiveCameraByName(c);
	};
	Acts.prototype.AttachCamControl = function (c) {
		var camera = this.scene.getCameraByName(c.instances[0].properties[0]);
		camera.attachControl(this.canvas, true);
		camera._needMoveForGravity = true;
	};
	Acts.prototype.DetachCamControl = function (c) {
		var camera = this.scene.getCameraByName(c.instances[0].properties[0]);
		camera.detachControl(this.canvas);
	};
	Acts.prototype.SceneSetGravity = function (x, y, z) {
		this.scene.gravity = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.SceneSetCollisions = function (s) {
		this.scene.collisionsEnabled = s;
	};
	Acts.prototype.SceneEnablePhys = function (e, x, y, z) {
		if (e == 0) {
			this.scene.enablePhysics(new BABYLON.Vector3(x, y, z), new BABYLON.CannonJSPlugin());
		} else {
			this.scene.enablePhysics(new BABYLON.Vector3(x, y, z), new BABYLON.OimoJSPlugin());
		}
	};
	Acts.prototype.SceneDisablePhys = function () {
		this.scene.disablePhysicsEngine()
	};
	Acts.prototype.SceneDestroy = function () {
		this.scene.dispose()
	};
	Acts.prototype.SceneSetEngineGravity = function (x, y, z) {
		this.scene.setGravity(new BABYLON.Vector3(x, y, z));
	};
	Acts.prototype.SceneSetTimestep = function (t) {
		this.scene.getPhysicsEngine().setTimeStep(t);
	};
	Acts.prototype.PlaySkelAnim = function (id, bone, from, to, loop, speed) {
		this.scene.beginAnimation(this.scene.skeletons[id], from, to, loop, speed);

	};
	Acts.prototype.StopSkelAnim = function (type, id, bone, from, to, loop, speed) {
		this.scene.stopAnimation(this.scene.skeletons[id]);
	};

	Acts.prototype.ShowDebug = function () {
		this.scene.debugLayer.show();
				document.getElementById("scene-explorer-host").style.zIndex = "5";
document.getElementById("inspector-host").style.zIndex = "5";

	};
	Acts.prototype.HideDebug = function () {
		this.scene.debugLayer.hide();
	};

	Acts.prototype.SetAmbientColor = function (r, g, b) {
		this.scene.ambientColor.r = r;
		this.scene.ambientColor.g = g;
		this.scene.ambientColor.b = b;
	};

	Acts.prototype.SetClearColor = function (r, g, b) {
		this.scene.clearColor.r
		this.scene.clearColor.g = g;
		this.scene.clearColor.b = b;
	};

	Acts.prototype.SetFogColor = function (r, g, b) {
		this.scene.fogColor.r
		this.scene.fogColor.g = g;
		this.scene.fogColor.b = b;
	};

	Acts.prototype.SetFogState = function (s) {
		this.scene.fogEnabled = s
	};

	Acts.prototype.SetFlaresState = function (s) {
		this.scene.lensFlaresEnabled = s
	};

	Acts.prototype.SetLightsState = function (s) {
		this.scene.lightsEnabled = s
	};

	Acts.prototype.SetParticlesState = function (s) {
		this.scene.particlesEnabled = s;
	};

	Acts.prototype.SetShadowsState = function (s) {
		this.scene.shadowsEnabled = s;
	};

	Acts.prototype.SetSkeletonsState = function (s) {
		this.scene.skeletonsEnabled = s;
	};

	Acts.prototype.SetTexturesState = function (s) {
		this.scene.texturesEnabled = s;
	};

	Acts.prototype.SetAudioState = function (s) {
		this.scene.audioEnabled = s;
	};

	Acts.prototype.SetWireframeState = function (s) {
		this.scene.forceWireframe = s;
	};

	Acts.prototype.SetBBoxState = function (s) {
		this.scene.forceShowBoundingBoxes = s;
	};

	Acts.prototype.SetPointsClState = function (s) {
		this.scene.forcePointsCloud = s;
	};

	Acts.prototype.UseRightHanded = function (s) {
		this.scene.useRightHandedSystem = s;
	};

	Acts.prototype.UseDelayedLoading = function (s) {
		this.scene.useDelayedTextureLoading = s;
	};

	Acts.prototype.DepthBuffer = function (s) {
		this.engine.setDepthBuffer(s);
	};

	Acts.prototype.SetHardwScaling = function (v) {
		this.engine.setHardwareScalingLevel(v);
	};
	Acts.prototype.ShowDebug = function () {
		this.scene.debugLayer.show();
				document.getElementById("scene-explorer-host").style.zIndex = "5";
document.getElementById("inspector-host").style.zIndex = "5";

	};
	Acts.prototype.HideDebug = function () {
		this.scene.debugLayer.hide();
	};

	pluginProto.acts = new Acts();

	function Exps() {};

	Exps.prototype.PointerX = function (ret) {
		ret.set_float(parseFloat(this.scene.pointerX));
	};
	Exps.prototype.PointerY = function (ret) {
		ret.set_float(parseFloat(this.scene.pointerY));
	};
	Exps.prototype.MeshUnderPointer = function (ret) {
		var pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
		if (pickResult.pickedMesh) {
			ret.set_string(pickResult.pickedMesh.name.toString());
		} else {
			ret.set_string("null");
		}
	};
	Exps.prototype.ScenePickedX = function (ret) {
		var pickResult;
		pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
		if (pickResult.hit) {
			ret.set_float(pickResult.pickedPoint.x)

		} else {
			ret.set_float(-1)
		}
	};
	Exps.prototype.ScenePickedY = function (ret) {
		var pickResult;
		pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
		if (pickResult.hit) { ;
			ret.set_float(pickResult.pickedPoint.y)
		} else {
			ret.set_float(-1)
		}
	};
	Exps.prototype.ScenePickedZ = function (ret) {
		var pickResult;
		pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
		if (pickResult.hit) { ;
			ret.set_float(pickResult.pickedPoint.z)
		} else {
			ret.set_float(-1)
		}
	};
	Exps.prototype.ScenePickedZ = function (ret) {
		var pickResult;
		pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
		if (pickResult.hit) { ;
			ret.set_float(pickResult.distance)
		} else {
			ret.set_float(-1)
		}
	};
	Exps.prototype.SceneAxisX = function (ret) {
		ret.set_int(BABYLON.Axis.X)
	};
	Exps.prototype.SceneAxisY = function (ret) {
		ret.set_int(BABYLON.Axis.Y)
	};
	Exps.prototype.SceneAxisZ = function (ret) {
		ret.set_int(BABYLON.Axis.Z)
	};
	Exps.prototype.SceneLocalSpace = function (ret) {
		ret.set_int(BABYLON.Space.LOCAL)
	};
	Exps.prototype.SceneWorldSpace = function (ret) {
		ret.set_int(BABYLON.Space.WORLD)
	};
	Exps.prototype.SceneRaycastedXPoint = function (ret, x, y, z, xD, yD, zD) {
		var rayPick = new BABYLON.Ray(new BABYLON.Vector3(x, y, z), new BABYLON.Vector3(xD, yD, zD));
		var meshFound = this.scene.pickWithRay(rayPick);
		ret.set_float(meshFound.pickedPoint.x);
	};
	Exps.prototype.SceneRaycastedYPoint = function (ret, x, y, z, xD, yD, zD) {
		var rayPick = new BABYLON.Ray(new BABYLON.Vector3(x, y, z), new BABYLON.Vector3(xD, yD, zD));
		var meshFound = this.scene.pickWithRay(rayPick);
		ret.set_float(meshFound.pickedPoint.y);
	};
	Exps.prototype.SceneRaycastedZPoint = function (ret, x, y, z, xD, yD, zD) {
		var rayPick = new BABYLON.Ray(new BABYLON.Vector3(x, y, z), new BABYLON.Vector3(xD, yD, zD));
		var meshFound = this.scene.pickWithRay(rayPick);
		ret.set_float(meshFound.pickedPoint.z);
	};
	Exps.prototype.SceneRaycastedMesh = function (ret, x, y, z, xD, yD, zD) {
		var rayPick = new BABYLON.Ray(new BABYLON.Vector3(x, y, z), new BABYLON.Vector3(xD, yD, zD));
		var meshFound = this.scene.pickWithRay(rayPick);
		if (meshFound.pickedMesh) {
			ret.set_string(meshFound.pickedMesh.name);
		} else {
			ret.set_string("null");
		}
	};
Exps.prototype.FPS = function (ret) {
		ret.set_int(this.engine.getFps());
	};

	Exps.prototype.RenderWidth = function (ret) {
		ret.set_float(this.engine.getRenderWidth(true));
	};

	Exps.prototype.RenderHeight = function (ret) {
		ret.set_float(this.engine.getRenderHeight(true));
	};

	Exps.prototype.WebGlInfo = function (ret) {
		ret.set_string(this.engine.getGlInfo().renderer + '\n' + this.engine.getGlInfo().vendor + '\n' + this.engine.getGlInfo().version);
	};

	Exps.prototype.MeshesCount = function (ret) {
		ret.set_int(this.scene.meshes.length);
	};

	Exps.prototype.LightsCount = function (ret) {
		ret.set_int(this.scene.lights.length);
	};

	Exps.prototype.CamerasCount = function (ret) {
		ret.set_int(this.scene.cameras.length);
	};

	Exps.prototype.AnimationsCount = function (ret) {
		ret.set_int(this.scene.animations.length);
	};

	Exps.prototype.ActiveCamera = function (ret) {
		ret.set_string(this.scene.activeCamera.name);
	};
	pluginProto.exps = new Exps();

}
	());
