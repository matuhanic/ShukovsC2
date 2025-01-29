// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaCalendar = function(runtime)
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
cr.plugins_.cranberrygame_CordovaCalendar = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaCalendar.prototype;
		
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
	var events = [];
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
		
		var self=this;
		window.addEventListener("resize", function () {//cranberrygame
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaCalendar.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof window == 'undefined' || typeof window['plugins'] == 'undefined' || typeof window['plugins']['calendar'] == 'undefined')
        	return;
			
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
	Cnds.prototype.OnCreateEventSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnCreateEventFailed = function ()
	{
		return true;
	};	
	Cnds.prototype.OnFindEventSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnFindEventFailed = function ()
	{
		return true;
	};	
	Cnds.prototype.OnDeleteEventSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnDeleteEventFailed = function ()
	{
		return true;
	};	
	Cnds.prototype.OnListEventSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnListEventFailed = function ()
	{
		return true;
	};	
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
			
		var self=this;		
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaCalendar.prototype.cnds.TriggerCondition, self);
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
	Acts.prototype.CreateEvent = function (eventName, location_, description, fromYear, fromMonth, fromDay, fromHour, fromMinute, toYear, toMonth, toDay, toHour, toMinute)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof window == 'undefined' || typeof window['plugins'] == 'undefined' || typeof window['plugins']['calendar'] == 'undefined')
        	return;
			
		var cal = window['plugins']['calendar'];
		//var title = "New Years party";
		//var location = "The Club";
		//var notes = "Bring pizza.";
		//var start = new Date(2015,0,1,20,0,0,0,0); // Jan 1st, 2015 20:00
		//var end = new Date(2015,0,1,22,0,0,0,0);   // Jan 1st, 2015 22:00
		var title = eventName;
		var location = location_;
		var notes = description;
		var start = new Date(fromYear,fromMonth-1,fromDay,fromHour,fromMinute,0,0,0); // Jan 1st, 2015 20:00
		var end = new Date(toYear,toMonth-1,toDay,toHour,toMinute,0,0,0);   // Jan 1st, 2015 22:00
		var calendarName = "MyCal";

		//var success = function(message) {alert("Success: " + JSON.stringify(message))};
		//var error   = function(message) {alert("Error: " + message)};
		var self = this;		
		cal.createEvent(title, location, notes, start, end,
		function(result){
			//alert("Success: " + JSON.stringify(result));
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaCalendar.prototype.cnds.OnCreateEventSucceeded, self);
		}, 
		function(error){
			//alert("Error: " + error);
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaCalendar.prototype.cnds.OnCreateEventSucceeded, self);
		});		
	};

	Acts.prototype.DeleteEvent = function (eventName, location_, description, fromYear, fromMonth, fromDay, fromHour, fromMinute, toYear, toMonth, toDay, toHour, toMinute)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof window == 'undefined' || typeof window['plugins'] == 'undefined' || typeof window['plugins']['calendar'] == 'undefined')
        	return;
			
		var cal = window['plugins']['calendar'];
		//var title = "New Years party";
		//var location = "The Club";
		//var notes = "Bring pizza.";
		//var start = new Date(2015,0,1,20,0,0,0,0); // Jan 1st, 2015 20:00
		//var end = new Date(2015,0,1,22,0,0,0,0);   // Jan 1st, 2015 22:00
		var title = eventName;
		var location = location_;
		var notes = description;
		var start = new Date(fromYear,fromMonth-1,fromDay,fromHour,fromMinute,0,0,0); // Jan 1st, 2015 20:00
		var end = new Date(toYear,toMonth-1,toDay,toHour,toMinute,0,0,0);   // Jan 1st, 2015 22:00		
		var calendarName = "MyCal";

		//var success = function(message) {alert("Success: " + JSON.stringify(message))};
		//var error   = function(message) {alert("Error: " + message)};
		var self = this;
		if	(title == "")	
			title = null;
		if	(location == "")	
			location = null;
		if	(notes == "")	
			notes = null;		
		cal.deleteEvent(title, location, notes, start, end,
		function(result){
			//alert("Success: " + JSON.stringify(result));
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaCalendar.prototype.cnds.OnDeleteEventSucceeded, self);
		}, 
		function(error){
			//alert("Error: " + error);
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaCalendar.prototype.cnds.OnDeleteEventFailed, self);
		});		
	};
	
	Acts.prototype.FindEvent = function (eventName, location_, description, fromYear, fromMonth, fromDay, fromHour, fromMinute, toYear, toMonth, toDay, toHour, toMinute)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof window == 'undefined' || typeof window['plugins'] == 'undefined' || typeof window['plugins']['calendar'] == 'undefined')
        	return;
			
		var cal = window['plugins']['calendar'];
		//var title = "New Years party";
		//var location = "The Club";
		//var notes = "Bring pizza.";
		//var start = new Date(2015,0,1,20,0,0,0,0); // Jan 1st, 2015 20:00
		//var end = new Date(2015,0,1,22,0,0,0,0);   // Jan 1st, 2015 22:00
		var title = eventName;
		var location = location_;
		var notes = description;
		var start = new Date(fromYear,fromMonth-1,fromDay,fromHour,fromMinute,0,0,0); // Jan 1st, 2015 20:00
		var end = new Date(toYear,toMonth-1,toDay,toHour,toMinute,0,0,0);   // Jan 1st, 2015 22:00		
		var calendarName = "MyCal";

		//var success = function(message) {alert("Success: " + JSON.stringify(message))};
		//var error   = function(message) {alert("Error: " + message)};
		var self = this;
		if	(title == "")	
			title = null;
		if	(location == "")	
			location = null;
		if	(notes == "")	
			notes = null;
		cal.findEvent(title, location, notes, start, end,
		function(result){
			//alert("Success: " + JSON.stringify(result));
			
			events = result;
			
			for (var i = 0 ; i < events.length; ++i)
			{
				console.log(events[i]['title']);
				console.log(events[i]['location']);
				console.log(events[i]['startDate']);
				console.log(events[i]['endDate']);
				console.log(events[i]['message']);
				//console.log(events[i]['id']);
				console.log(events[i]['allday']);
			}
			
			if (events.length > 0)
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaCalendar.prototype.cnds.OnFindEventSucceeded, self);
			else
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaCalendar.prototype.cnds.OnFindEventFailed, self);
		}, 
		function(error){
			//alert("Error: " + error);
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaCalendar.prototype.cnds.OnFindEventFailed, self);
		});		
	};

	Acts.prototype.OpenCalendar = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof window == 'undefined' || typeof window['plugins'] == 'undefined' || typeof window['plugins']['calendar'] == 'undefined')
        	return;

		// to open the calendar app at 'today'
		var d = new Date();		
		window['plugins']['calendar']['openCalendar'](d);
	};	
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
	Exps.prototype.EventsCount = function (ret)
	{
		ret.set_int(events.length);
	};
	Exps.prototype.EventNameAt = function (ret, i)
	{
		ret.set_string(events[i]['title']);
	};
	Exps.prototype.LocationAt = function (ret, i)
	{
		ret.set_string(events[i]['location']);
	};
	Exps.prototype.FromDateAt = function (ret, i)
	{
		ret.set_string(events[i]['startDate']);
	};
	Exps.prototype.ToDateAt = function (ret, i)
	{
		ret.set_string(events[i]['endDate']);
	};
	Exps.prototype.DescriptionAt = function (ret, i)
	{
		ret.set_string(events[i]['message']);
	};	

	Exps.prototype.FromDateYearAt = function (ret, i)
	{
		ret.set_int(new Date(events[i]['startDate']).getFullYear());
	};
	Exps.prototype.FromDateMonthAt = function (ret, i)
	{
		ret.set_int(new Date(events[i]['startDate']).getMonth() + 1);
	};
	Exps.prototype.FromDateDayAt = function (ret, i)
	{
		ret.set_int(new Date(events[i]['startDate']).getDate());
	};
	Exps.prototype.FromDateHourAt = function (ret, i)
	{
		ret.set_int(new Date(events[i]['startDate']).getHours());
	};
	Exps.prototype.FromDateMinuteAt = function (ret, i)
	{
		ret.set_int(new Date(events[i]['startDate']).getMinutes());
	};
	Exps.prototype.FromDateSecondAt = function (ret, i)
	{
		ret.set_int(new Date(events[i]['startDate']).getSeconds());
	};

	Exps.prototype.ToDateYearAt = function (ret, i)
	{
		ret.set_int(new Date(events[i]['endDate']).getFullYear());
	};
	Exps.prototype.ToDateMonthAt = function (ret, i)
	{
		ret.set_int(new Date(events[i]['endDate']).getMonth() + 1);
	};
	Exps.prototype.ToDateDayAt = function (ret, i)
	{
		ret.set_int(new Date(events[i]['endDate']).getDate());
	};
	Exps.prototype.ToDateHourAt = function (ret, i)
	{
		ret.set_int(new Date(events[i]['endDate']).getHours());
	};
	Exps.prototype.ToDateMinuteAt = function (ret, i)
	{
		ret.set_int(new Date(events[i]['endDate']).getMinutes());
	};
	Exps.prototype.ToDateSecondAt = function (ret, i)
	{
		ret.set_int(new Date(events[i]['endDate']).getSeconds());
	};
	
	Exps.prototype.IdAt = function (ret, i)
	{
		ret.set_string(events[i]['id']);
	};
	Exps.prototype.AllDayAt = function (ret, i)
	{
		ret.set_int(events[i]['allday']);
	};
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());