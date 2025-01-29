// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_Mixpanel = function(runtime)
{
	this.runtime = runtime;
	Type
		onCreate
	Instance
		onCreate
		draw
		drawGL		
	cnds
		//MyCondition
		//TriggerCondition
	acts
		//MyAction
		//TriggerAction
	exps
		//MyExpression
};		
//cranberrygame end: structure
*/

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.cranberrygame_Mixpanel = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_Mixpanel.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

/*
	//for example
	var fbAppID = "";
	var fbAppSecret = "";
*/
//cranberrygame start
	var token = '';
	var eventProperties = {};
	var peopleProperties = {};
//cranberrygame end
	
	// called on startup for each object type
	typeProto.onCreate = function()
	{
		
/*			
		//cranberrygame
		var newScriptTag=document.createElement('script');
		newScriptTag.setAttribute("type","text/javascript");
		newScriptTag.setAttribute("src", "mylib.js");
		document.getElementsByTagName("head")[0].appendChild(newScriptTag);
		//cranberrygame
		var scripts=document.getElementsByTagName("script");
		var scriptExist=false;
		for(var i=0;i<scripts.length;i++){
			//alert(scripts[i].src);//http://localhost:50000/jquery-2.0.0.min.js
			if(scripts[i].src.indexOf("cordova.js")!=-1||scripts[i].src.indexOf("phonegap.js")!=-1){
				scriptExist=true;
				break;
			}
		}
		if(!scriptExist){
			var newScriptTag=document.createElement("script");
			newScriptTag.setAttribute("type","text/javascript");
			newScriptTag.setAttribute("src", "cordova.js");
			document.getElementsByTagName("head")[0].appendChild(newScriptTag);
		}
*/		
//cranberrygame start
		if(this.runtime.isBlackberry10 || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81){
			var scripts=document.getElementsByTagName("script");
			var scriptExist=false;
			for(var i=0;i<scripts.length;i++){
				//alert(scripts[i].src);//http://localhost:50000/jquery-2.0.0.min.js
				if(scripts[i].src.indexOf("cordova.js")!=-1||scripts[i].src.indexOf("phonegap.js")!=-1){
					scriptExist=true;
					break;
				}
			}
			if(!scriptExist){
				var newScriptTag=document.createElement("script");
				newScriptTag.setAttribute("type","text/javascript");
				newScriptTag.setAttribute("src", "cordova.js");
				document.getElementsByTagName("head")[0].appendChild(newScriptTag);
			}
		}
//cranberrygame end		
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
		
/*
		this.arr = [];
		this.forX = 0;
		
		var self = this;
		window.addEventListener("resize", function () {//cranberrygame
			self.runtime.trigger(cr.plugins_.cranberrygame_Mixpanel.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		token = this.properties[0];

		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof window["mixpanelanalytics"] == 'undefined')
				return;
			
			window["mixpanelanalytics"]['setUp'](token);
		}
		else {		
(function(f,b){if(!b.__SV){var a,e,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=f.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";e=f.getElementsByTagName("script")[0];e.parentNode.insertBefore(a,e)}})(document,window.mixpanel||[]);
window["mixpanel"]['init'](token);			
		}
//cranberrygame end			
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};

/*
	instanceProto.at = function (x)
	{
		return this.arr[x];
	};
	
	instanceProto.set = function (x, val)
	{
		this.arr[x] = val;
	};
	
	//
	instanceProto.doForEachTrigger = function (current_event)
	{
		this.runtime.pushCopySol(current_event.solModifiers);
		current_event.retrigger();
		this.runtime.popSol(current_event.solModifiers);
	};	
*/	
//cranberrygame start
//cranberrygame end
	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};

/*
	// the example condition
	Cnds.prototype.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};
	//cranberrygame
	Cnds.prototype.TriggerCondition = function ()
	{
		return true;
	};	
	Cnds.prototype.ArrForEach = function ()
	{
        var current_event = this.runtime.getCurrentEventStack().current_event;
		
		this.forX = 0;

		for (this.forX = 0; this.forX < this.arr.length; this.forX++)
		{
			this.doForEachTrigger(current_event);
		}

		this.forX = 0;

		return false;
	};	
*/
	
//cranberrygame start
//cranberrygame end
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

/*
	// the example action
	Acts.prototype.MyAction = function (myparam)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
        if (typeof navigator["camera"] == 'undefined')
            return;
			
		// alert the message
		alert(myparam);
	};
	
	//cranberrygame
	Acts.prototype.TriggerAction = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
        if (typeof navigator["camera"] == 'undefined')
            return;
			
		var self = this;		
		self.runtime.trigger(cr.plugins_.cranberrygame_Mixpanel.prototype.cnds.TriggerCondition, self);
	};	
	
	Acts.prototype.Open = function (URL, locationBar)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
        if (typeof navigator["camera"] == 'undefined')
            return;	
		
	};	
*/
	
//cranberrygame start
	Acts.prototype.TrackEvent = function (eventName)
	{
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof window["mixpanelanalytics"] == 'undefined')
				return;

			window["mixpanelanalytics"]['trackEvent'](eventName);
		}
		else {
			if (typeof window["mixpanel"] == 'undefined')
				return;

			window["mixpanel"]['track'](eventName, eventProperties);
			eventProperties	= {};
		}
	};
	Acts.prototype.AddEventProperty = function (propertyName, propertyValue)
	{
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof window["mixpanelanalytics"] == 'undefined')
				return;

			window["mixpanelanalytics"]['addEventProperty'](propertyName, propertyValue);
		}
		else {
			if (typeof window["mixpanel"] == 'undefined')
				return;
			
			if (propertyName && propertyValue)
				eventProperties[propertyName] = propertyValue;
		}
	}
	Acts.prototype.IdentifyPeople = function (distinctId)
	{
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof window["mixpanelanalytics"] == 'undefined')
				return;

			window["mixpanelanalytics"]["identifyPeople"](distinctId);
		}
		else {
			if (typeof window["mixpanel"] == 'undefined')
				return;

			window["mixpanel"]["identify"](distinctId);
		}
	}
	Acts.prototype.AddPeopleProperty = function (propertyName, propertyValue)
	{
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof window["mixpanelanalytics"] == 'undefined')
				return;
	
			window["mixpanelanalytics"]['addPeopleProperty'](propertyName, propertyValue);
		}
		else {
			if (typeof window["mixpanel"] == 'undefined')
				return;
			
			if (propertyName && propertyValue)
				peopleProperties[propertyName] = propertyValue;
		}
	}
	Acts.prototype.ChangePeopleProperties = function ()
	{
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof window["mixpanelanalytics"] == 'undefined')
				return;

			window["mixpanelanalytics"]["changePeopleProperties"]();
		}
		else {
			if (typeof window["mixpanel"] == 'undefined')
				return;
		
			window["mixpanel"]["people"]["set"](peopleProperties);
		}
		peopleProperties = {};
	}
	Acts.prototype.IncrementPeopleProperty = function (propertyName, propertyValue)
	{
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof window["mixpanelanalytics"] == 'undefined')
				return;
				
			window["mixpanelanalytics"]["incrementPeopleProperty"](propertyName, propertyValue);
		}
		else {
			if (typeof window["mixpanel"] == 'undefined')
				return;
			
			window["mixpanel"]["people"]["increment"](propertyName, propertyValue);
		}
	}
	Acts.prototype.DeletePeople = function ()
	{
		if (this.runtime.isAndroid || this.runtime.isiOS) {
			if (typeof window["mixpanelanalytics"] == 'undefined')
				return;

			window["mixpanelanalytics"]["deletePeople"]();
		}
		else {
			if (typeof window["mixpanel"] == 'undefined')
				return;
			
			window["mixpanel"]["people"]["delete_user"]();
		}
	}
//cranberrygame end
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
/*	
	// the example expression
	Exps.prototype.CellXCount = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.Text = function (ret, param) //cranberrygame
	{     
		ret.set_string("Hello");		// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};
	//
	Exps.prototype.CurValue = function (ret)
	{
		ret.set_any(this.at(this.forX));
	};	
	Exps.prototype.At = function (ret, x_)
	{
		ret.set_any(this.at(x));
	};	
	Exps.prototype.Width = function (ret)
	{
		ret.set_int(this.cx);
	};
*/
	
//cranberrygame start
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());