// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.CordovaSocialSharing = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{	

	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.CordovaSocialSharing.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;


	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};


	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.generalShare = function (msg, sub, link, file)
	{
		if (typeof window['plugins'] == 'undefined') {return;}else{
		window['plugins']['socialsharing'].share(msg,sub,file,link);}
	}

	Acts.prototype.twitterShare = function (msg, link, file)
	{
		if (typeof window['plugins'] == 'undefined') {return;}else{
		window['plugins']['socialsharing'].shareViaTwitter(msg,file,link);}
	}

	Acts.prototype.facebookShare = function (msg, link, file)
	{
		if (typeof window['plugins'] == 'undefined') {return;}else{
		window['plugins']['socialsharing'].shareViaFacebook(msg,file,link);}
	}

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();

}());