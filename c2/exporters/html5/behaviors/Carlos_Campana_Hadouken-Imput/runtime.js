// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.HadokenInput = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.HadokenInput.prototype;
		
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
		this.timeToResetChain = this.properties[0];
		this.resetChainOnCommandChainFired = this.properties[1];
		this.chain = "";
		this.lastChainLinkTime = 0;
		
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
			"timeToResetChain": this.timeToResetChain,
			"resetChainOnCommandChainFired" : this.resetChainOnCommandChainFired
		};
	};
	
	// called when loading the full state of the game
	behinstProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		 this.timeToResetChain = o[ "timeToResetChain" ];
		 this.resetChainOnCommandChainFired = o[ "resetChainOnCommandChainFired" ];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};

	behinstProto.tick = function ()
	{
		if( this.lastChainLinkTime != 0 ) {
			var now = new Date( );
			var diff = now - this.lastChainLinkTime;
			
			if( diff > this.timeToResetChain * 1000.0 ) {
				this.lastChainLinkTime = 0;
				this.chain = "";

				this.runtime.trigger(cr.behaviors.HadokenInput.prototype.cnds.onCommandChainTimeout, this.inst);
			}
		}
		//var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
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
				//{"name": "Time to reset chain", "Time to reset chain VALUE", false, true: this.timeToResetChain}
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		//if (name === "My property")
			//this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.onCommandChainFired = function (inChain) {
		if( this.chain.toLowerCase( ) == inChain.toLowerCase( ) ) {
			if( this.resetChainOnCommandChainFired == true ) {
				this.lastChainLinkTime = 0;
				this.chain = "";
			}
			
			return true;
		}

		return false;
	};
	
	Cnds.prototype.onCommandChainLinkAdded = function () {
		return true;
	};
	
	Cnds.prototype.onCommandChainTimeout = function () {
		return true;
	};	
	
	behaviorProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.ClearChainLink = function () {
		this.lastChainLinkTime = 0;
		this.chain = "";
	};
	
	Acts.prototype.AddChainLink = function (chainLink)
	{
		if( this.lastChainLinkTime != 0 ) {
			var now = new Date( );
			var diff = now - this.lastChainLinkTime;
			
			if( diff > this.timeToResetChain * 1000.0 ) {
				this.lastChainLinkTime = 0;
				this.chain = "";
			}
		}

		this.lastChainLinkTime = new Date( );
		this.chain += chainLink + ";";

		this.lastChainLink = chainLink.toLowerCase( );
		this.runtime.trigger(cr.behaviors.HadokenInput.prototype.cnds.onCommandChainLinkAdded, this.inst);

		this.runtime.trigger(cr.behaviors.HadokenInput.prototype.cnds.onCommandChainFired, this.inst);

	};
	
	// ... other actions here ...
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.lastCommandChainLink = function (ret) {
		ret.set_string( this.lastChainLink );
	};

	Exps.prototype.chain = function (ret) {
		ret.set_string( this.chain );
	};

	Exps.prototype.remainingTimeToTimeout = function (ret) {
		if( this.lastChainLinkTime != 0 ) {
			var now = new Date( );
			var diff = now - this.lastChainLinkTime;

			ret.set_float( diff / 1000.0 );
			
		} else {
			ret.set_float( 0.0 );
			
		}		
	};
	
	behaviorProto.exps = new Exps();
	
}());