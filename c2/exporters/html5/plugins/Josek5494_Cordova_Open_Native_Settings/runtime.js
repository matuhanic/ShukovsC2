//All rights of distribution and edition reserved to Jose Carlos Hernández González (Josek5494) Spain

// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.CordovaOpNatSet = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{	

	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.CordovaOpNatSet.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	var self;

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

		self=this;

	};

	function indexToOption(index) {
		
		
		switch (index) {
		case 0:		return "open";
		case 1:		return "accesibility";
		case 2:     return "add_account";
		case 3:     return "airplane_mode";
		case 4:     return "apn";
		case 5:     return "application_details";
		case 6:     return "application_development";
		case 7:     return "application";
		case 8:     return "bluetooth";
		case 9:     return "captioning";
		case 10:    return "cast";
		case 11:    return "data_roaming";
		case 12:    return "date";
		case 13:    return "device_info";
		case 14:    return "display";
		case 15:    return "dream";
		case 16:    return "home";
		case 17:    return "input_method";
		case 18:    return "input_method_subtype";
		case 19:    return "internal_storage";
		case 20:    return "locale";
		case 21: 	return "location_source";
		case 22: 	return "manage_all_applications";
		case 23: 	return "manage_applications";
		case 24: 	return "memory_card";
		case 25: 	return "network_operator";
		case 26: 	return "nfc_sharing";
		case 27: 	return "nfc_payment";
		case 28: 	return "nfc_settings";
		case 29: 	return "print";
		case 30: 	return "privacy";
		case 31: 	return "quick_launch";
		case 32: 	return "search";
		case 33: 	return "security";
		case 34: 	return "settings";
		case 35: 	return "show_regulatory_info";
		case 36: 	return "sound";
		case 37: 	return "sync";
		case 38: 	return "usage_access";
		case 39: 	return "user_dictionary";
		case 40: 	return "voice_input";
		case 41: 	return "wifi_ip";
		case 42: 	return "wifi";
		case 43: 	return "wireless";
		}


	}

	function onAndroidLocationSuccess(){

		self.runtime.trigger(cr.plugins_.CordovaOpNatSet.prototype.cnds.onAndLocSuc, self);

	};

	function onIosNativeSuccess(){

		self.runtime.trigger(cr.plugins_.CordovaOpNatSet.prototype.cnds.onIOSNatSuc, self);

	};

	function onAndroidCustomSuccess(){

		self.runtime.trigger(cr.plugins_.CordovaOpNatSet.prototype.cnds.onAndCusSuc, self);

	};

	function onAndroidLocationFail(){

		self.runtime.trigger(cr.plugins_.CordovaOpNatSet.prototype.cnds.onAndLocFail, self);

	};

	function onIosNativeFail(){

		self.runtime.trigger(cr.plugins_.CordovaOpNatSet.prototype.cnds.onIOSNatFail, self);

	};

	function onAndroidCustomFail(){

		self.runtime.trigger(cr.plugins_.CordovaOpNatSet.prototype.cnds.onAndCusFail, self);

	};	

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.onAndLocSuc = function ()
	{
		return true;
	};

	Cnds.prototype.onIOSNatSuc = function ()
	{
		return true;
	};

	Cnds.prototype.onAndCusSuc = function ()
	{
		return true;
	};

	Cnds.prototype.onAndLocFail = function ()
	{
		return true;
	};

	Cnds.prototype.onIOSNatFail = function ()
	{
		return true;
	};

	Cnds.prototype.onAndCusFail = function ()
	{
		return true;
	};

	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.opAndLocSet = function ()
	{

		if(typeof cordova.plugins.settings.openSetting != undefined){
    	cordova.plugins.settings.open(onAndroidLocationSuccess,onAndroidLocationFail);}
    	else{return;}

	}

	Acts.prototype.opIOSNatSet = function ()
	{

		if(typeof cordova.plugins.settings.openSetting != undefined){
    	cordova.plugins.settings.open(onIosNativeSuccess,onIosNativeFail);}
    	else{return;}

	}

	Acts.prototype.opAndCusSet = function (index)
	{

		if(typeof cordova.plugins.settings.openSetting != undefined){
    	cordova.plugins.settings.openSetting(indexToOption(index),onAndroidCustomSuccess,onAndroidCustomFail);}
    	else{return;}

	}

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};

	pluginProto.exps = new Exps();

}());