// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

// Plugin class
cr.plugins_.Reinarte_Notifica = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Reinarte_Notifica.prototype;

	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};

	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};

	var instanceProto = pluginProto.Instance.prototype;
	
	function indexToParamPosition(i){
		switch (i) {
			case 0:	return 'top-right';
			case 1:	return 'top-left';
			case 2:	return 'bottom-left';
			case 3:	return 'bottom-right';
		}
		return 'bottom-right';
	};

	function indexToParamFadeInSpeed(i){
		switch (i) {
			case 0:	return 'slow';
			case 1:	return 'medium';
			case 2:	return 'fast';
		}
		return 'slow';
	};

	function indexToParamFadeOutSpeed(i){
		switch (i) {
			case 0:	return 'slow';
			case 1:	return 'medium';
			case 2:	return 'fast';
		}
		return 'slow';
	};

	function indexToParamStyle(i){
		switch (i) {
			case 0:	return '';
			case 1:	return 'gritter-light';
			case 2:	return 'gritter-success';
			case 3:	return 'gritter-info';
			case 4:	return 'gritter-warning';
			case 5:	return 'gritter-error';
			case 6:	return 'gritter-red';
			case 7:	return 'gritter-yellow';
			case 8:	return 'gritter-green';
			case 9:	return 'gritter-blue';
		}
		return '';
	};
	
	instanceProto.onCreate = function()
	{
		this.position = indexToParamPosition(this.properties[0]);
		this.fade_in_speed = indexToParamFadeInSpeed(this.properties[0]);
		this.fade_out_speed = indexToParamFadeOutSpeed(this.properties[0]);
		jQuery.extend(jQuery["gritter"].options, {
			"position": this.position,
			"fade_in_speed": this.fade_in_speed,
			"fade_out_speed": this.fade_out_speed,
			"max_to_display": 0
		});
	};

	instanceProto.onDestroy = function ()
	{
	};
	
	instanceProto.saveToJSON = function ()
	{
		return {
		};
	};

	instanceProto.loadFromJSON = function (o)
	{
	};

	instanceProto.draw = function(ctx)
	{
	};

	instanceProto.drawGL = function (glw)
	{
	};

	// Conditions
	function Cnds() {};

	Cnds.prototype.OnNotificationClicked = function (tag)
	{
		return cr.equals_nocase(tag, this.curr_tag);
	};
	
	pluginProto.cnds = new Cnds();

	// Actions
	function Acts() {};

	Acts.prototype.DeleteAllNotifications = function ()
	{
		jQuery["gritter"].removeAll();
	};

	Acts.prototype.AddNotificationClickable = function (id,title,text,image,timeout,style)
	{
		var self = this;
		self.curr_tag = id;
		jQuery["gritter"].add({
			"title": title,
			"text": text,
			"image": image,
			"time": timeout,
			"sticky": 0,
			"class_name": "gritter-clickable gritter-id-" + id + " " + indexToParamStyle(style),
			"close_on_click": 1
		});
		jQuery(".gritter-id-" + id).click(function(){
			self.runtime.trigger(cr.plugins_.Reinarte_Notifica.prototype.cnds.OnNotificationClicked, self);
			return false;
		});
	}

	pluginProto.acts = new Acts();

	// Expressions
	function Exps() {};
	
	pluginProto.exps = new Exps();

}());
