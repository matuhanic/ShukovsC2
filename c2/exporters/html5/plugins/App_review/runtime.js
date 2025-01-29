// ECMAScript 5 strict mode
"use strict";
assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");
cr.plugins_.EMI_INDO_plugin_app_review = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.EMI_INDO_plugin_app_review.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	
	typeProto.onCreate = function()
	{};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{

		 if (typeof cordova == 'undefined'){return;}else{};
		 this.cd = cordova.plugins.AppReview;
};

instanceProto.onDestroy = function ()
	{};
	instanceProto.saveToJSON = function ()
	{
		return {};
	};
	instanceProto.loadFromJSON = function (o)
	{};
	instanceProto.draw = function(ctx)
	{};
	instanceProto.drawGL = function (glw)
	{};
	instanceProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": "My debugger section",
			"properties": []});};
	instanceProto.onDebugValueEdited = function ()
	{};
	
// C
function Cnds() {};

pluginProto.cnds = new Cnds();
// A
function Acts() {};

Acts['prototype']['aa']=function(){if(typeof cordova=='undefined')return;else{};this['cd']['requestReview']()['catch'](function(){return this['cd']['openStoreScreen']();});},Acts['prototype']['bb']=function(){if(typeof cordova=='undefined')return;else{};this['cd']['requestReview']();},Acts['prototype']['cc']=function(package_name){if(typeof cordova=='undefined')return;else{}this['cd']['openStoreScreen'](package_name);};

pluginProto.acts = new Acts();

function Exps() {};

pluginProto.exps = new Exps();



}());