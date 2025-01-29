// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaContacts = function(runtime)
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
cr.plugins_.cranberrygame_CordovaContacts = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaContacts.prototype;
		
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
		var self=this;
		window.addEventListener("resize", function () {//cranberrygame
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaContacts.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof navigator['contacts'] == 'undefined')
            return;	
			
		this.contacts = [];		
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
	
	instanceProto.set = function (x)
	{
		this.arr[x] = val;
	};
*/	
//cranberrygame start
	instanceProto.createContact = function (displayName, phoneNumber, email, url, photo)
	{
		var self = this;
		
		var contact = navigator['contacts']['create']();
		//contact.id //DOMString
		contact['displayName'] = displayName;//DOMString
		//contact.nickname //DOMString
		//contact.note //DOMString
		//contact.birthday //Date
		//var name = new ContactName();
		//name.givenName = ""
		//name.formatted = "";
		//name.familyName = "";
		//name.middleName = "";
		//name.honorificPrefix = "";
		//name.honorificSuffix = "";
		//contact.name = name;//ContactName
/*
		var organization = new ContactOrganization();
        organization.pref = false;
        organization.type = "";
		organization.name = "";
        organization.department = "";
        organization.title = "";
		contact.organizations = [organization];//ContactOrganization[]
		var address = new ContactAddress();		
        address.pref = false;
        address.type = "";
        address.formatted = "";
        address.streetAddress = "";
        address.locality = "";
        address.region = "";
        address.postalCode = "";
        address.country = "";
		contact.addresses = [address];//ContactAddress[]		
*/		
		//
		//contact.phoneNumbers = [new ContactField('mobile', '917-555-5432', true), new ContactField('work', '212-555-1234', false), new ContactField('home', '203-555-7890', false)];//
		contact['phoneNumbers'] = [new ContactField('mobile', phoneNumber, true)];//ContactField[]
/*		
		var phoneNumber = new ContactField();
        phoneNumber.type = "";	
        phoneNumber.value = "";	
        phoneNumber.pref = false;
		contact.phoneNumbers = [phoneNumber];
*/	
		contact['emails'] = [new ContactField('email', email)];//(ContactField[]
		contact['urls'] = [new ContactField('url', url)];//ContactField[]
		contact['photos'] = [new ContactField('photo', photo)];//ContactField[]
		//contact.categories //ContactField[]
		//contact.ims //ContactField[]
		//
		contact.save(function (result) {
			console.log(result['displayName']!=null?result['displayName']:"");
			console.log(result['phoneNumbers']!=null?result['phoneNumbers'][0]['value']:"");
			console.log(result['emails']!=null?result['emails'][0]['value']:"");
			console.log(result['urls']!=null?result['urls'][0]['value']:"");
			console.log(result['photos']!=null?result['photos'][0]['value']:"");//runtime error//		

			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaContacts.prototype.cnds.OnCreateContactSucceeded, self);
		}, function (error) {
			console.log("error code: " + error['code']);
			
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaContacts.prototype.cnds.OnCreateContactFailed, self);			
		});
	};
	
	instanceProto.findContacts = function (filter)
	{
		var self = this;

		var options = new ContactFindOptions();
		options['filter']   = filter;
		options['multiple'] = true;
		navigator['contacts']['find'](["displayName", "phoneNumbers", "emails", "urls", "photos"], 
		function (result) {
	
			self.contacts = result;

			for(var i = 0 ; i < self.contacts.length ; i++) {
				console.log(self.contacts[i]['displayName']!=null?self.contacts[i]['displayName']:"");
				console.log(self.contacts[i]['phoneNumbers']!=null?self.contacts[i]['phoneNumbers'][0]['value']:"");//runtime error
				console.log(self.contacts[i]['emails']!=null?self.contacts[i]['emails'][0]['value']:"");//runtime error
				console.log(self.contacts[i]['urls']!=null?self.contacts[i]['urls'][0]['value']:"");//runtime error
				console.log(self.contacts[i]['photos']!=null?self.contacts[i]['photos'][0]['value']:"");
			}
			
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaContacts.prototype.cnds.OnFindContactsSucceeded, self);			
		}, 
		function (error) {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaContacts.prototype.cnds.OnFindContactsFailed, self);
		}, options);
	}	
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
*/
	
//cranberrygame start
	Cnds.prototype.OnCreateContactSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnCreateContactFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnFindContactsSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnFindContactsFailed = function ()
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
		// alert the message
		alert(myparam);
	};
	
	//cranberrygame
	Acts.prototype.TriggerAction = function ()
	{
		var self=this;		
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaContacts.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	Acts.prototype.CreateContact = function (displayName, phoneNumber, email, url, photo)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof navigator['contacts'] == 'undefined')
            return;
			
		this.createContact(displayName, phoneNumber, email, url, photo);
	};
	Acts.prototype.FindContacts = function (filter)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof navigator['contacts'] == 'undefined')
            return;
			
		this.findContacts(filter);
	};
	Acts.prototype.FindAllContacts = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof navigator['contacts'] == 'undefined')
            return;
			
		this.findContacts("");
	}
//cranberrygame end
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
/*	
	// the example expression
	Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
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
*/
	
//cranberrygame start
	Exps.prototype.ContactsCount = function (ret)
	{
		ret.set_int(this.contacts.length);
	};
	Exps.prototype.DisplayNameAt = function (ret, i)
	{
		ret.set_string(this.contacts[i]['displayName']!=null?this.contacts[i]['displayName']:"");
	};
	Exps.prototype.PhoneNumberAt = function (ret, i)
	{
		ret.set_string(this.contacts[i]['phoneNumbers']!=null?this.contacts[i]['phoneNumbers'][0]['value']:"");
	};
	Exps.prototype.EmailAt = function (ret, i)
	{
		ret.set_string(this.contacts[i]['emails']!=null?this.contacts[i]['emails'][0]['value']:"");
	};
	Exps.prototype.UrlAt = function (ret, i)
	{
		ret.set_string(this.contacts[i]['urls']!=null?this.contacts[i]['urls'][0]['value']:"");
	};
	Exps.prototype.PhotoAt = function (ret, i)
	{
		ret.set_string(this.contacts[i]['photos']!=null?this.contacts[i]['photos'][0]['value']:"");
	};	
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());