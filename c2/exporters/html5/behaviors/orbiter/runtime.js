// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.Orbiter = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.Orbiter.prototype;
		
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
		// Load properties

		this.setangle = (this.properties[0] !== 0);
		this.wforce = this.properties[1];
		this.hforce = this.properties[2];
		this.speed = this.properties[3];
		this.zan = this.properties[4];

		this.centreX = this.inst.x;
		this.centreY = this.inst.y;
		this.angle = 0;
		this.czan = 0;
		this.pinObject = null;
		this.pinObjUid = -1;
		this.pinned = false;
		
		// object is sealed after this call, so make sure any properties you'll ever need are created, e.g.
		// this.myValue = 0;


	};
	
	behinstProto.onDestroy = function ()
	{
		// called when associated object is being destroyed
		// note runtime may keep the object and behavior alive after this call for recycling;
		// release, recycle or reset any references here as necessary
	};
	
	// called when saving the full state of the game
	behinstProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your behavior's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
			"ifangl": this.setangle,
			"angle": this.angle,
			"wf": this.wforce,
			"hf": this.hforce,
			"speed": this.speed,
			"cx": this.centreX,
			"cy": this.centreY,
			"uid": this.pinObject ? this.pinObject.uid : -1,
			"pined": this.pinned,
			"zan" : this.zan
		};
	};
	
	// called when loading the full state of the game
	behinstProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
		this.setangle = o["ifangl"];
		this.angle = o["angle"];
		this.wforce = o["wf"];
		this.hforce = o["hf"];
		this.speed = o["speed"];
		this.centreX = o["cx"];
		this.centreY = o["cy"];
		this.pinObjUid = o["uid"];
		this.pinned = o["pined"];
		this.zan = o["zan"]
	};

	behinstProto.afterLoad = function ()
	{
		// Look up the pinned object UID now getObjectByUID is available
		if (this.pinObjUid === -1)
			this.pinObject = null;
		else
		{
			this.pinObject = this.runtime.getObjectByUID(this.pinObjUid);
			assert2(this.pinObject, "Failed to find pin object by UID");
		}
		
		this.pinObjUid = -1;
	};

	behinstProto.tick = function (dt)
	{
		var dt = this.runtime.getDt(this.inst);

		///if (this.angle > 6.005) {this.angle = 0};
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
		this.angle += (this.speed/100)*dt;
		this.test = 0;
		this.czan = cr.to_radians(this.zan);
		if (this.pinned) 
			{
				this.inst.x = this.pinObject.x + (Math.cos(this.angle) * this.wforce * Math.cos(this.czan) - Math.sin(this.angle) * this.hforce * Math.sin(this.czan));
				this.inst.y = this.pinObject.y + (Math.sin(this.angle) * this.hforce * Math.cos(this.czan) + Math.cos(this.angle) * this.wforce * Math.sin(this.czan));
			} 
		else 
			{
				this.inst.x = this.centreX + (Math.cos(this.angle) * this.wforce * Math.cos(this.czan) - Math.sin(this.angle) * this.hforce * Math.sin(this.czan));
				this.inst.y = this.centreY + (Math.sin(this.angle) * this.hforce * Math.cos(this.czan) + Math.cos(this.angle) * this.wforce * Math.sin(this.czan));
			};

		if (this.setangle) {this.inst.angle = this.angle};
		this.inst.set_bbox_changed();
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": this.type.name,
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				{"name": "Angle", "value": cr.to_clamped_degrees(this.angle)}, 
				//{"name": "natAngle", "value": this.angle},
				{"name": "ZAngle", "value": cr.to_clamped_degrees(this.czan)}, 
				//{"name": "test", "value": this.test}, 
				{"name": "Pinned UID", "value": this.pinObject ? this.pinObject.uid : 0, "readonly": true}
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "ZAngle")
			this.zan = value;
		switch (name) {
		case "ZAngle":					this.zan = value;					break;
		case "Angle": 					this.angle = value;					break;
		};
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.IsMoving = function ()
	{
		// ... see other behaviors for example implementations ...
		return false;
	};
	
	// ... other conditions here ...
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.setpos = function (x, y)
	{
		this.centreX = x;
		this.centreY = y;
	};
	
	Acts.prototype.setang = function (ang)
	{
		var newang = ang
		this.angle = cr.to_radians(newang);
	};

	Acts.prototype.setspd = function (spd)
	{
		this.speed = spd;
	};

	Acts.prototype.setwdth = function (wdth)
	{
		this.wforce = wdth;
	};

	Acts.prototype.sethgth = function (hgth)
	{
		this.hforce = hgth;
	};

	Acts.prototype.setzan = function (zan)
	{
		this.zan = zan;
	};

	Acts.prototype.PinM = function (obj)
	{
		if (!obj)
			return;
			
		var otherinst = obj.getFirstPicked(this.inst);
		
		if (!otherinst)
			return;
			
		this.pinObject = otherinst;
		this.pinned = true;
	};

	// ... other actions here ...
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	// the example expression
	Exps.prototype.speed = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.speed);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	Exps.prototype.angle = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(cr.to_clamped_degrees(this.angle));				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	Exps.prototype.zangle = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(cr.to_clamped_degrees(this.czan));				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	Exps.prototype.wdistance = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.wforce);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	Exps.prototype.hdistance = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.hforce);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	Exps.prototype.centrex = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		if (this.pinned){
			ret.set_int(this.pinObject.x);
		}else{
			ret.set_int(this.centreX);
		}	// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	Exps.prototype.centrey = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		if (this.pinned){
			ret.set_int(this.pinObject.y);
		}else{
			ret.set_int(this.centreY);
		}	// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	// ... other expressions here ...
	
	behaviorProto.exps = new Exps();
	
}());