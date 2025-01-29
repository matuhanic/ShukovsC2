//All rights of distribution and edition reserved to Jose Carlos Hernández González (Josek5494) Spain

// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.CordovaPushNotifications = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{	

	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.CordovaPushNotifications.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type

	var appId1="User not registered.";
	var userIdOS="User not registered.";
	var pushTokenOS="User not registered.";
	var self;

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

		var inFocus = this.properties[2];

		if (typeof window['plugins'] == 'undefined') {return;}else{
		
			if (typeof window['plugins']['OneSignal'] == 'undefined') {return;}else{

				switch (inFocus) {

				case 0:
					window['plugins']['OneSignal'].startInit(this.properties[0], this.properties[1]).inFocusDisplaying(window['plugins']['OneSignal'].OSInFocusDisplayOption.None).handleNotificationReceived(function(jsonData){onNotifSuccTrigger();}).handleNotificationOpened(function(jsonData){onNotifOpenedTrigger();}).endInit();
				break;
				case 1:
					window['plugins']['OneSignal'].startInit(this.properties[0], this.properties[1]).inFocusDisplaying(window['plugins']['OneSignal'].OSInFocusDisplayOption.Notification).handleNotificationReceived(function(jsonData){onNotifSuccTrigger();}).handleNotificationOpened(function(jsonData){onNotifOpenedTrigger();}).endInit();
				break;
				case 2:
					window['plugins']['OneSignal'].startInit(this.properties[0], this.properties[1]).inFocusDisplaying(window['plugins']['OneSignal'].OSInFocusDisplayOption.InAppAlert).handleNotificationReceived(function(jsonData){onNotifSuccTrigger();}).handleNotificationOpened(function(jsonData){onNotifOpenedTrigger();}).endInit();
				break;
				default:
					window['plugins']['OneSignal'].startInit(this.properties[0], this.properties[1]).inFocusDisplaying(window['plugins']['OneSignal'].OSInFocusDisplayOption.None).handleNotificationReceived(function(jsonData){onNotifSuccTrigger();}).handleNotificationOpened(function(jsonData){onNotifOpenedTrigger();}).endInit();
				break;
				}

				window.setTimeout(getValues, 3000);
					
			}
		}

	};

	function getValues(){

		window['plugins']['OneSignal'].getIds(function (ids) {
			userIdOS=ids.userId;
			pushTokenOS=ids.pushToken;
		});

	}

	function indexToBoolean(index){

		switch (index) {
		case 0:		return true;
		case 1:		return false;
		}

	}

	function onNotifOpenedTrigger(){

	 self.runtime.trigger(cr.plugins_.CordovaPushNotifications.prototype.cnds.onNotifOpened, self);

	};

	function onNotifSuccTrigger(){

	 self.runtime.trigger(cr.plugins_.CordovaPushNotifications.prototype.cnds.onNotifSucc, self);

	};

	function onNotifFailedTrigger(){

	 self.runtime.trigger(cr.plugins_.CordovaPushNotifications.prototype.cnds.onNotifFailed, self);

	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.onNotifOpened = function ()
	{
		return true;
	};

	Cnds.prototype.onNotifSucc = function ()
	{
		return true;
	};

	Cnds.prototype.onNotifFailed = function ()
	{
		return true;
	};

	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.register = function ()
	{
		if (typeof window['plugins'] == 'undefined') {return;}else{
		
		window['plugins']['OneSignal'].registerForPushNotifications();

		}
	}

	Acts.prototype.sendTag = function (key, value)
	{
		if (typeof window['plugins'] == 'undefined') {return;}else{
		
		window['plugins']['OneSignal'].sendTag(key, value);

		}
	}

	Acts.prototype.deleteTag = function (key)
	{
		if (typeof window['plugins'] == 'undefined') {return;}else{
		
		window['plugins']['OneSignal'].deleteTag(key);

		}
	}

	Acts.prototype.enableVibrate = function (index)
	{
		if (typeof window['plugins'] == 'undefined') {return;}else{
		
		window['plugins']['OneSignal'].enableVibrate(indexToBoolean(index));

		}
	}

	Acts.prototype.enableSound = function (index)
	{
		if (typeof window['plugins'] == 'undefined') {return;}else{
		
		window['plugins']['OneSignal'].enableSound(indexToBoolean(index));

		}
	}

	Acts.prototype.enableSubs = function (index)
	{
		if (typeof window['plugins'] == 'undefined') {return;}else{
		
		window['plugins']['OneSignal'].setSubscription(indexToBoolean(index));

		}
	}

	Acts.prototype.promptLoc = function ()
	{
		if (typeof window['plugins'] == 'undefined') {return;}else{
		
		window['plugins']['OneSignal'].promptLocation();

		}
	}

	Acts.prototype.postNotif = function (cont,ids,incSeg,excSeg,datKey,datCont)
	{
		if (typeof window['plugins'] == 'undefined') {return;}else{
		
		var notifObj={ appId:appId1, contents: {en:cont}, include_player_ids: ids.split(","), included_segments: incSeg.split(","),
						excluded_segments: excSeg.split(","), data: {datKey:datCont}};

		window['plugins']['OneSignal'].postNotification(notifObj, onNotifSuccTrigger, onNotifFailedTrigger);

		}
	}

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.getTags = function (ret)
	{
		var tags1="";

		if (typeof window['plugins'] == 'undefined') {ret.set_string(tags1);}else{
		window['plugins']['OneSignal'].getTags(function (tags) {
			ret.set_string(JSON.stringify(tags));
		});
		}

	};

	Exps.prototype.getUserId = function (ret)
	{
		
		ret.set_string(userIdOS);
	};

	Exps.prototype.getPushToken = function (ret)
	{
		
		ret.set_string(pushTokenOS);

	};

	pluginProto.exps = new Exps();

}());