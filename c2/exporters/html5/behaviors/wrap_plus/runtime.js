// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.wrapPlus = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.wrapPlus.prototype;
		
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
		this.mode = this.properties[0];	// 0 = wrap to layout, 1 = wrap to viewport, 2 = wrap to custom coordinates
		this.ways = this.properties[1];	// 0 = both, 1 = horizontal, 2 = vertical
		this.left_mrg = this.properties[2]; // left margin
		this.right_mrg = this.properties[3]; // right margin
		this.top_mrg = this.properties[4]; // top margin
		this.bottom_mrg = this.properties[5]; // bottom margin
		this.enabled = (this.properties[6] !== 0); // initial state
	};
	
	behinstProto.saveToJSON = function ()
	{
		return {
			"m": this.mode,
			"w": this.ways,
			"l_mrg": this.left_mrg,
			"r_mrg": this.right_mrg,
			"t_mrg": this.top_mrg,
			"b_mrg": this.bottom_mrg,
			"en": this.enabled
		};
	};
	
	behinstProto.loadFromJSON = function (o)
	{
		this.mode = o["m"];
		this.ways = o["w"];
		this.left_mrg = o["l_mrg"];
		this.right_mrg = o["r_mrg"];
		this.top_mrg = o["t_mrg"];
		this.bottom_mrg = o["b_mrg"];
		this.enabled = o["en"];
	};

	behinstProto.tick = function ()
	{
		var inst = this.inst;
		inst.update_bbox();
		var bbox = inst.bbox;
		var layer = inst.layer;
		var layout = layer.layout;
		
		var lbound = 0, rbound = 0, tbound = 0, bbound = 0;
		
		if (!this.enabled)
			return;
		
		// wrap to layout
		if (this.mode === 0)
		{
			rbound = layout.width;
			bbound = layout.height;
		}
		// wrap to viewport
		else if (this.mode === 1)
		{
			lbound = layer.viewLeft;
			rbound = layer.viewRight;
			tbound = layer.viewTop;
			bbound = layer.viewBottom;
		}
		// wrap to custom coordinates
		else
		{
			lbound = this.left_mrg;
			rbound = this.right_mrg;
			tbound = this.top_mrg;
			bbound = this.bottom_mrg;
		}
		
		if (this.ways === 0)
		{
			if (bbox.right < lbound)
			{
				inst.x = (rbound - 1) + (inst.x - bbox.left);
				this.runtime.trigger(cr.behaviors.wrapPlus.prototype.cnds.OnWrap, this.inst);
				inst.set_bbox_changed();
			}
			if (bbox.left > rbound)
			{
				inst.x = (lbound + 1) - (bbox.right - inst.x);
				this.runtime.trigger(cr.behaviors.wrapPlus.prototype.cnds.OnWrap, this.inst);
				inst.set_bbox_changed();
			}
			
			if (bbox.bottom < tbound)
			{
				inst.y = (bbound - 1) + (inst.y - bbox.top);
				this.runtime.trigger(cr.behaviors.wrapPlus.prototype.cnds.OnWrap, this.inst);
				inst.set_bbox_changed();
			}
			if (bbox.top > bbound)
			{
				inst.y = (tbound + 1) - (bbox.bottom - inst.y);
				this.runtime.trigger(cr.behaviors.wrapPlus.prototype.cnds.OnWrap, this.inst);
				inst.set_bbox_changed();
			}
		}
		
		else if (this.ways === 1)
		{
			if (bbox.right < lbound)
			{
				inst.x = (rbound - 1) + (inst.x - bbox.left);
				this.runtime.trigger(cr.behaviors.wrapPlus.prototype.cnds.OnWrap, this.inst);
				inst.set_bbox_changed();
			}
			if (bbox.left > rbound)
			{
				inst.x = (lbound + 1) - (bbox.right - inst.x);
				this.runtime.trigger(cr.behaviors.wrapPlus.prototype.cnds.OnWrap, this.inst);
				inst.set_bbox_changed();
			}
		}
		
		else if (this.ways === 2)
		{
			if (bbox.bottom < tbound)
			{
				inst.y = (bbound - 1) + (inst.y - bbox.top);
				this.runtime.trigger(cr.behaviors.wrapPlus.prototype.cnds.OnWrap, this.inst);
				inst.set_bbox_changed();
			}
			if (bbox.top > bbound)
			{
				inst.y = (tbound + 1) - (bbox.bottom - inst.y);
				this.runtime.trigger(cr.behaviors.wrapPlus.prototype.cnds.OnWrap, this.inst);
				inst.set_bbox_changed();
			}
		}
	};
		
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": this.type.name,
			"properties": [
				{"name": "Left margin", "value": this.left_mrg},
				{"name": "Right margin", "value": this.right_mrg},
				{"name": "Top margin", "value": this.top_mrg},
				{"name": "Bottom margin", "value": this.bottom_mrg},
				{"name": "Enabled", "value": this.enabled}
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		switch (name) {
		case "Left margin":			this.left_mrg = value;		break;
		case "Right margin":		this.right_mrg = value;		break;
		case "Top margin":			this.top_mrg = value;		break;
		case "Bottom margin":		this.bottom_mrg = value;	break;
		case "Enabled":				this.enabled = value;		break;
		}
	};
	/**END-PREVIEWONLY**/
	
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.IsBehaviorEnabled = function ()
	{
		return (this.enabled);
	};
	
	Cnds.prototype.OnWrap = function ()
	{
		return true;
	};
	
	behaviorProto.cnds = new Cnds();
	
	// Actions
	function Acts() {};
	
	Acts.prototype.SetEnabled = function (en)
	{
		this.enabled = (en === 1);
	};
	
	Acts.prototype.SetWays = function (ways_a)
	{
		switch(ways_a) 
		{
			case 0: this.ways = 0; break;
			case 1: this.ways = 1; break;
			case 2: this.ways = 2; break;
		}
	};
	
	Acts.prototype.SetLeftMargin = function (left_mrg)
	{
		this.left_mrg = left_mrg;
	};
	
	Acts.prototype.SetRightMargin = function (right_mrg)
	{
		this.right_mrg = right_mrg;
	};
	
	Acts.prototype.SetTopMargin = function (top_mrg)
	{
		this.top_mrg = top_mrg;
	};
	
	Acts.prototype.SetBottomMargin = function (bottom_mrg)
	{
		this.bottom_mrg = bottom_mrg;
	};
	
	behaviorProto.acts = new Acts();
	
	// Expressions
	function Exps() {};
	
	Exps.prototype.Enabled = function (ret) 
	{
		ret.set_int((this.enabled) ? 1 : 0);
	};
	
	Exps.prototype.LeftMargin = function (ret)
	{
		ret.set_float(this.left_mrg);
	};
	
	Exps.prototype.RightMargin = function (ret)
	{
		ret.set_float(this.right_mrg);
	};
	
	Exps.prototype.TopMargin = function (ret)
	{
		ret.set_float(this.top_mrg);
	};
	
	Exps.prototype.BottomMargin = function (ret)
	{
		ret.set_float(this.bottom_mrg);
	};
	
	behaviorProto.exps = new Exps();
	
}());