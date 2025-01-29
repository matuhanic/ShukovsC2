// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.WrapH = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.WrapH.prototype;
		
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
	};
	
	behinstProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	behinstProto.saveToJSON = function ()
	{
		return {
		};
	};
	
	// called when loading the full state of the game
	behinstProto.loadFromJSON = function (o)
	{
	};

	behinstProto.tick = function ()
	{
		var inst = this.inst;
		inst.update_bbox();
		var bbox = inst.bbox;
		var layer = inst.layer;
		var layout = layer.layout;
		
		var lbound = 0, rbound = 0, tbound = 0, bbound = 0;
		
		lbound = layer.viewLeft;
		rbound = layer.viewRight;
		tbound = layer.viewTop;
		bbound = layer.viewBottom;
		
		if (bbox.right < lbound)
		{
			inst.x = (rbound - 1) + (inst.x - bbox.left);
			inst.set_bbox_changed();
		}
		else if (bbox.left > rbound)
		{
			inst.x = (lbound + 1) - (bbox.right - inst.x);
			inst.set_bbox_changed();
		}
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": this.type.name,
			"properties": []
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	behaviorProto.exps = new Exps();
	
}());