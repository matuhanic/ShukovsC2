// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv



cr.plugins_.babylonCameraSLE = function (runtime) {
	this.runtime = runtime;

};

(function () {
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.babylonCameraSLE.prototype;

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
		this.mytype = "_camera";
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
			r : r,
			g : g,
			b : b
		};
		return rgb;
	}

	function hex2rgb(hex) {
		return {
			r : hex & 0xff,
			g : (hex >> 8) & 0xff,
			b : (hex >> 16) & 0xff
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
			"title" : "My debugger section",
			"properties" : [
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
	Cnds.prototype.CamOnCollide = function (m) {
		if (this.runtime.scenes[this.properties[1]]) {
			var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(m.getFirstPicked().properties[0]);
			return (camera.collided == mesh.name);
		} else {
			return false;
		}
	};
	Cnds.prototype.CamOnReady = function () {
		if (this.runtime.scenes[this.properties[1]]) {
			var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
			return camera.isReady();
		} else {
			return false;
		}

	};

	pluginProto.cnds = new Cnds();

	function Acts() {};
	Acts.prototype.CamRotateEase = function (x, y, z) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.cameraRotation.x += x;
		camera.cameraRotation.y += y;
		camera.cameraRotation.z += z;
	};
	Acts.prototype.CameraEllipsoid = function (x, y, z) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.ellipsoid.x = x;
		camera.ellipsoid.y = y;
		camera.ellipsoid.z = z;
	};
	Acts.prototype.CameraSetFov = function (f) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.fov = f;
	};
	Acts.prototype.CameraSetFovMode = function (fm) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		if (fm == 0) {
			camera.FOVMODE_HORIZONTAL_FIXED = BABYLON.FOVMODE_HORIZONTAL_FIXED;
		} else {
			camera.FOVMODE_HORIZONTAL_FIXED = BABYLON.FOVMODE_VERTICAL_FIXED;
		}

	};
	Acts.prototype.CamTranslateEase = function (x, y, z) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.cameraDirection.x += x;
		camera.cameraDirection.y += y;
		camera.cameraDirection.z += z;
	};
	Acts.prototype.CamApplyGravity = function (state) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		if (state == 0) {
			camera.applyGravity = true;
		} else {
			camera.applyGravity = false;
		}
	};
	Acts.prototype.CamCheckColl = function (state) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		if (state == 0) {
			camera.checkCollisions = true;
		} else {
			camera.checkCollisions = false;
		}
	};
	Acts.prototype.CamAttachPost = function (fx, bx, by, bw, bh, d, cl, r, map, lvl) {
		var cam = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		var postProcess;
		if (fx == 0) {
			postProcess = new BABYLON.BlackAndWhitePostProcess(cam + "bw", 1.0, null, null, this.runtime.scenes[this.properties[1]].engine, true);
		} else if (fx == 1) {
			postProcess = new BABYLON.BlurPostProcess(cam + "blr", new BABYLON.Vector2(bx, by), bw, bh, null, null, this.runtime.scenes[this.properties[1]].engine, true);
		} else if (fx == 2) {
			var sepiaKernelMatrix = BABYLON.Matrix.FromValues(
					0.393, 0.349, 0.272, 0,
					0.769, 0.686, 0.534, 0,
					0.189, 0.168, 0.131, 0,
					0, 0, 0, 0);
			postProcess = new BABYLON.ConvolutionPostProcess(cam + "sep", sepiaKernelMatrix, 1.0, null, null, this.runtime.scenes[this.properties[1]].engine, true);
		} else if (fx == 3) {
			postProcess = new BABYLON.FxaaPostProcess(cam + "fxaa", 1.0, null, null, this.runtime.scenes[this.properties[1]].engine, true);
		} else if (fx == 4) {
			postProcess = new BABYLON.RefractionPostProcess(cam + "ref", map, new BABYLON.Color3(1.0, 1.0, 1.0), d, cl, r, null, null, this.runtime.scenes[this.properties[1]].engine, true);
		} else if (fx == 5) {
			postProcess = new BABYLON.ColorCorrectionPostProcess(cam + "cc", map, 1.0, null, null, this.runtime.scenes[this.properties[1]].engine, true);
		}
		cam.attachPostProcess(postProcess, lvl);
	};
	Acts.prototype.CameraSetContr = function (up, down, left, right) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.keysUp.push(up);
		camera.keysDown.push(down);
		camera.keysLeft.push(left);
		camera.keysRight.push(right);

	};
	Acts.prototype.CameraClearContr = function () {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.keysUp = [];
		camera.keysDown = [];
		camera.keysLeft = [];
		camera.keysRight = [];
	};
	Acts.prototype.CameraSetTarg = function (m) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		var target = this.runtime.scenes[this.properties[1]].getMeshByName(m.getFirstPicked().properties[0]);
		camera.lockedTarget = target;

	};
	Acts.prototype.CameraSetSpeed = function (speed) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.speed = speed;

	};
	Acts.prototype.CameraSetPosTarg = function (x, y, z) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.setTarget(new BABYLON.Vector3(x, y, z));

	};
	Acts.prototype.CameraSetUpside = function (state) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		if (state == 0) {
			camera.allowUpsideDown = true;
		} else {
			camera.allowUpsideDown = false;
		}
	};
	Acts.prototype.CameraSetXSensi = function (xsens) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.angularSensibilityX = xsens;
	};
	Acts.prototype.CameraSetYSensi = function (ysens) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.angularSensibilityY = ysens;
	};
	Acts.prototype.CameraSetBeta = function (beta) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.beta = beta;
	};
	Acts.prototype.CameraSetAlpha = function (alpha) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.alpha = alpha;
	};
	Acts.prototype.CameraSetRadius = function (radius) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.radius = radius;
	};
	Acts.prototype.CameraSetWheelPrec = function (wp) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.wheelPrecision = wp;
	};
	Acts.prototype.CameraSetZoomFact = function (zf) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.zoomOnFactor = zf;
	};
	Acts.prototype.CameraZoomOn = function (m) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(m);
		camera.zoomOn(mesh);
	};
	Acts.prototype.CameraSetCollRad = function (x, y, z) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.collisionRadius = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.CameraSetAccel = function (ac) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.cameraAcceleration = ac;
	};
	Acts.prototype.CameraSetMaxSpeed = function (maxs) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.maxCameraSpeed = maxs;
	};
	Acts.prototype.CameraSetTarFMesh = function (m) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(m.getFirstPicked().properties[0]);
		camera.target = mesh;
	};
	Acts.prototype.CameraSetHeiOff = function (hei) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.heightOffset = hei;
	};
	Acts.prototype.CamRegisterEvent = function (type) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		if (type == 0) {
			camera.onCollide = function (col) {
				this.collided = col.name;
				this.runtime.trigger(cr.plugins_.babylonSceneLoader.prototype.cnds.CamOnCollide, this);
			}
		} else if (type == 1) {
			camera.onReady = function () {
				this.runtime.trigger(cr.plugins_.babylonSceneLoader.prototype.cnds.CamOnReady, this);
			}
		}

	};
	Acts.prototype.CamCreateArctRot = function (x, y, z, a, b, r) {
		var arcCamera = new BABYLON.ArcRotateCamera(this.properties[0], a, b, r, new BABYLON.Vector3(0, 0, 0), this.runtime.scenes[this.properties[1]]);
		arcCamera.setPosition(new BABYLON.Vector3(x, y, z));
	};
	Acts.prototype.CamCreateFree = function (x, y, z) {
		var freeCamera = new BABYLON.FreeCamera(this.properties[0], new BABYLON.Vector3(x, y, z), this.runtime.scenes[this.properties[1]]);
	};
	Acts.prototype.CamCreateFollow = function (x, y, z, m) {
		var target = getMeshByName(m);
		var followCamera = new BABYLON.FollowCamera(this.properties[0], new BABYLON.Vector3(x, y, z), this.runtime.scenes[this.properties[1]], target);
	};

	Acts.prototype.CamPanningSensibilty = function (s) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.panningSensibility = s;
	};
	Acts.prototype.CamPinchPrec = function (p) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.pinchPrecision = p;
	};
	Acts.prototype.CamInertia = function (p) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.inertia = p;
	};
	Acts.prototype.CamTargetOffset = function (x, y, z) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.targetScreenOffset = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.CamRotationOffset = function (r) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.rotationOffset = r
	};
	Acts.prototype.CameraVisiblity = function (v) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.visibility = v;
	};
	Acts.prototype.CameraSetParent = function (ptype, p) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		if (ptype == 0) {
			var parnt = this.runtime.scenes[this.properties[1]].getMeshByName(p.getFirstPicked().properties[0]);
		} else if (ptype == 1) {
			var parnt = this.runtime.scenes[this.properties[1]].getLightByName(p.getFirstPicked().properties[0]);
		} else {
			var parnt = this.runtime.scenes[this.properties[1]].getMeshByName(p.getFirstPicked().properties[0]);
		}
		var fix = camera.getAbsolutePosition();
		camera.parent = parnt;
		camera.setAbsolutePosition(fix);
		camera.rotation = new BABYLON.Vector3(0, 0, 0);
		camera.scaling = new BABYLON.Vector3(1, 1, 1);

	};
	Acts.prototype.CameraSetPosition = function (x, y, z) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.position = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.CameraSetRotation = function (x, y, z) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.rotation = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.CameraSetScaling = function (x, y, z) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.scaling = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.TranslateCameraBy = function (x, y, z) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.position = new BABYLON.Vector3(camera.position.x + x, camera.position.y + y, camera.position.z + z);
	};
	Acts.prototype.RotateCameraBy = function (x, y, z) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.rotation = new BABYLON.Vector3(camera.rotation.x + x, camera.rotation.y + y, camera.rotation.z + z);
	};
	Acts.prototype.ScaleCameraBy = function (x, y, z) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.scaling = new BABYLON.Vector3(camera.scaling.x + x, camera.scaling.y + y, camera.scaling.z + z);
	};

	Acts.prototype.CameraBeginAnim = function (animName, start, end, loop, speed) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		this.runtime.scenes[this.properties[1]].beginDirectAnimation(camera, [camera.getAnimationByName(animName)], start, end, loop, speed);

	};

	Acts.prototype.CameraStopAnim = function (name) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		this.runtime.scenes[this.properties[1]].stopAnimation(camera);
	};

	Acts.prototype.CameraCreateAnim = function (animName, param, start, mid, end, fps) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);

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
		camera.animations.push(anim);

	};

	Acts.prototype.CameraPauseAnim = function () {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		this.runtime.scenes[this.properties[1]].getAnimatableByTarget(camera).pause();
	};

	Acts.prototype.CameraRestartAnim = function () {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		this.runtime.scenes[this.properties[1]].getAnimatableByTarget(camera).restart();
	};
	Acts.prototype.CameraSetEnabled = function (state) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		if (state == 0) {
			camera.setEnabled(true);
		} else {
			camera.setEnabled(false);
		}
	};
	Acts.prototype.RotateCameraXLocal = function (angle) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.rotate(BABYLON.Axis.X, angle, BABYLON.Space.LOCAL);
	};
	Acts.prototype.RotateCameraYLocal = function (angle) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.rotate(BABYLON.Axis.Y, angle, BABYLON.Space.LOCAL);
	};
	Acts.prototype.RotateCameraZLocal = function (angle) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.rotate(BABYLON.Axis.Z, angle, BABYLON.Space.LOCAL);
	};
	Acts.prototype.RotateCameraXWorld = function (angle) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.rotate(BABYLON.Axis.X, angle, BABYLON.Space.WORLD);
	};
	Acts.prototype.RotateCameraYWorld = function (angle) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.rotate(BABYLON.Axis.Y, angle, BABYLON.Space.WORLD);
	};
	Acts.prototype.RotateCameraZWorld = function (angle) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.rotate(BABYLON.Axis.Z, angle, BABYLON.Space.WORLD);
	};

	Acts.prototype.TranslateCameraXLocal = function (angle) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.translate(BABYLON.Axis.X, angle, BABYLON.Space.LOCAL);
	};
	Acts.prototype.TranslateCameraYLocal = function (angle) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.translate(BABYLON.Axis.Y, angle, BABYLON.Space.LOCAL);
	};
	Acts.prototype.TranslateCameraZLocal = function (angle) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.translate(BABYLON.Axis.Z, angle, BABYLON.Space.LOCAL);
	};
	Acts.prototype.TranslateCameraXWorld = function (angle) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.translate(BABYLON.Axis.X, angle, BABYLON.Space.WORLD);
	};
	Acts.prototype.TranslateCameraYWorld = function (angle) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.translate(BABYLON.Axis.Y, angle, BABYLON.Space.WORLD);
	};
	Acts.prototype.TranslateCameraZWorld = function (angle) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.translate(BABYLON.Axis.Z, angle, BABYLON.Space.WORLD);
	};
	Acts.prototype.CameraSetPickable = function (pickable) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		if (pickable == 0) {
			camera.isPickable = true;
		} else {
			camera.isPickable = false;
		}
	};
	Acts.prototype.CameraDestroy = function (type) {
		var camera = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		camera.dispose();
	};
	Acts.prototype.CameraLock = function (l) {
		this.runtime.scenes[this.properties[1]].getEngine().isPointerLock = l;
	};	
	Acts.prototype.CameraFullsLock = function (l) {
		this.runtime.scenes[this.properties[1]].getEngine().switchFullscreen(l);
	};
	Acts.prototype.CameraInterDist = function (l) {
		var cam = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		cam.interaxialDistance = l;
	};

	Acts.prototype.CameraMinZ = function (l) {
		var cam = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		cam.minZ = l;
	};

	Acts.prototype.CameraMaxZ = function (l) {
		var cam = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		cam.maxZ = l;
	};
	
	Acts.prototype.CameraSetViewport = function (x,y,w,h) {
		var cam = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		cam.viewport = new BABYLON.Viewport(x,y,w,h);
	};

	Acts.prototype.TouchAngSens = function (l) {
		var cam = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		cam.touchAngularSensibility = l;
	};

	Acts.prototype.TouchMoveSens = function (l) {
		var cam = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		cam.touchMoveSensibility = l;
	};
	

	pluginProto.acts = new Acts();

	function Exps() {};

	Exps.prototype.CamPosX = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_float(obj.position.x);
	};
	Exps.prototype.CamPosY = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_float(obj.position.y);
	};
	Exps.prototype.CamPosZ = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_float(obj.position.z);
	};
	Exps.prototype.CamScaleX = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_float(obj.scaling.x);
	};
	Exps.prototype.CamScaleY = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_float(obj.scaling.y);
	};
	Exps.prototype.CamScaleZ = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_float(obj.scaling.z);
	};
	Exps.prototype.CamRotX = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_float(obj.rotation.x);
	};
	Exps.prototype.CamRotY = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_float(obj.rotation.y);
	};
	Exps.prototype.CamRotZ = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_float(obj.rotation.z);
	};
	Exps.prototype.CamFrontX = function (ret, dist) {
		var obj = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_float(obj.getFrontPosition(dist).x);
	};
	Exps.prototype.CamFrontY = function (ret, dist) {
		var obj = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_float(obj.getFrontPosition(dist).y);
	};
	Exps.prototype.CamFrontZ = function (ret, dist) {
		var obj = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_float(obj.getFrontPosition(dist).z);
	};
	Exps.prototype.Name = function (ret) {
		ret.set_string(this.properties[0])
	};	
	Exps.prototype.SceneUID = function (ret) {
		ret.set_int(this.properties[1])
	};

	Exps.prototype.FOV = function (ret) {
		var cam = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_int(cam.fov)
	};

	Exps.prototype.Type = function (ret) {
		var cam = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_string(cam.getTypeName())
	};

	Exps.prototype.DirectionX = function (ret,x,y,z) {
		var cam = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_float(cam.getDirection(new BABYLON.Vector3(x,y,z)).x);
	};

	Exps.prototype.DirectionY = function (ret,x,y,z) {
		var cam = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_float(cam.getDirection(new BABYLON.Vector3(x,y,z)).y);
	};

	Exps.prototype.DirectionZ = function (ret,x,y,z) {
		var cam = this.runtime.scenes[this.properties[1]].getCameraByName(this.properties[0]);
		ret.set_float(cam.getDirection(new BABYLON.Vector3(x,y,z)).z);
	};

	
	
	pluginProto.exps = new Exps();

}
	());