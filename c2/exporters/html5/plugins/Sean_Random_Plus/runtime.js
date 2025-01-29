// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.RandomPlus = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.RandomPlus.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.count = 0;
		//this.isIncrement;
	};

	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function()
	{
		//var isIncrement = (this.properties[0] === 0);
	};
	
	
	

	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;
	
	acts.setCount = function (n)
	{
		// do something
		this.count = n;
	};

	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	
	exps.RandPlus = function(ret, randSeed, min, max)
	{
	++this.count;
	
	var seed = randSeed*(this.count+1);
	var r = new mersenne(seed);
	
	var bigRand = r.randInt();
	bigRand = (bigRand/0xffffffff)+0.5;
	
	var RandNumber = min + (bigRand * (max-min));

	ret.set_any(RandNumber);

	};
	
}());
