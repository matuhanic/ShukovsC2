// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.RotatePlus = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.RotatePlus.prototype;
		
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
		this.speed = cr.to_radians(this.properties[0]);
		this.acc = cr.to_radians(this.properties[1]);
		this.enabled = (this.properties[2] !== 0);
	};
	
	behinstProto.saveToJSON = function ()
	{
		return { 
            "speed": this.speed,
            "acc": this.acc,
			"en": this.enabled
        };
	};
	
	behinstProto.loadFromJSON = function (o)
	{
        this.speed = o["speed"];
        this.acc = o["acc"];
		this.enabled = o["en"];
	};

	behinstProto.tick = function ()
	{
		if (!this.enabled)
			return;
		
		const dt = this.runtime.getDt(this.inst);
		
		if (dt === 0)
			return;
		
		if (this.acc !== 0)
			this.speed += this.acc * dt;
		
		if (this.speed !== 0)
		{
			this.inst.angle = cr.clamp_angle(this.inst.angle + this.speed * dt);
			this.inst.set_bbox_changed();
		}
	};
	
	behinstProto.tick2 = function ()
	{
    };
	
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": this.type.name,
			"properties": [
				{"name": "Speed", "value": cr.to_degrees(this.speed)},
				{"name": "Acceleration", "value": cr.to_degrees(this.acc)},
				{"name": "Enabled", "value": this.enabled}
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		switch (name) {
		case "Speed":			this.speed = cr.to_radians(value);	break;
		case "Acceleration":	this.acc = cr.to_radians(value);	break;
		case "Enabled":			this.enabled = value;				break;
		}
	};
	/**END-PREVIEWONLY**/
    
	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	behaviorProto.cnds = new Cnds();
	
	Cnds.prototype.IsBehaviorEnabled = function ()
	{
		return (this.enabled);
	};
   
	//////////////////////////////////////
	// Actions
	function Acts() {};
	behaviorProto.acts = new Acts();

	Acts.prototype.SetEnabled = function (s)
	{
		this.enabled = (s === 1);
	};

	Acts.prototype.SetSpeed = function (s)
	{
		this.speed = cr.to_radians(s);
	};
    
	Acts.prototype.SetAcceleration = function (a)
	{
		this.acc = cr.to_radians(a);
	};
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	behaviorProto.exps = new Exps();
    
	Exps.prototype.Speed = function (ret)
	{
		ret.set_float(cr.to_degrees(this.speed));
	};

	Exps.prototype.Acceleration = function (ret)
	{
		ret.set_float(cr.to_degrees(this.acc));
	};
	
	Exps.prototype.Enabled = function (ret)
	{
		ret.set_int((this.enabled) ? 1 : 0);
	};
	
}());