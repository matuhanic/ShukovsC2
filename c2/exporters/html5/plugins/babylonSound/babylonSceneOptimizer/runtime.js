// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.babylonSceneoptim = function (runtime) {
	this.runtime = runtime;
};

(function () {
	var behaviorProto = cr.behaviors.babylonSceneoptim.prototype;

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

		if (!this.done) {
			if (this.runtime.scenes[this.inst.properties[19]]) {
				if (this.properties[0] == 0) // Low
				{
					BABYLON.SceneOptimizer.OptimizeAsync(this.runtime.scenes[this.inst.properties[19]], BABYLON.SceneOptimizerOptions.LowDegradationAllowed(),
						function () {
						// On success
					}, function () {
						// FPS target not reached
					});
				}
				if (this.properties[0] == 1) // Moderate
				{
					BABYLON.SceneOptimizer.OptimizeAsync(this.runtime.scenes[this.inst.properties[19]], BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed(),
						function () {
						// On success
					}, function () {
						// FPS target not reached
					});
				}
				if (this.properties[0] == 2) // High
				{
					BABYLON.SceneOptimizer.OptimizeAsync(this.runtime.scenes[this.inst.properties[19]], BABYLON.SceneOptimizerOptions.HighDegradationAllowed(),
						function () {
						// On success
					}, function () {
						// FPS target not reached
					});

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
