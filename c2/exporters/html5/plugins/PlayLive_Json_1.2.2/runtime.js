// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class

cr.plugins_.playlive_json = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	
	var pluginProto = cr.plugins_.playlive_json.prototype;
		
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
		this.data = [];
		this.tag = "";
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
	};
	
	instanceProto.saveToJSON = function ()
    {
        return this.data;
    };
    
    instanceProto.loadFromJSON = function (load)
    {
        this.data = load;
    };

	instanceProto.draw = function(ctx)
	{
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.OnComplete = function (tag_)
	{
		return cr.equals_nocase(tag_, this.tag);
	};

	Cnds.prototype.OnAnyComplete = function ()
	{
		return true;
	};

	Cnds.prototype.OnError = function (tag_)
	{
		return tag_ ? cr.equals_nocase(tag_, this.tag) : true;
	};

	Cnds.prototype.OnAnyError = function ()
	{
		return true;
	};

	Cnds.prototype.IsEmpty = function ()
	{
		return this.data == "";
	};

	pluginProto.cnds = new Cnds();
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.LoadJSON = function (tag_, url_, type_)
	{
		jQuery.ajaxSetup({'beforeSend': function(xhr)
		{	// if not => browser warnings
			if (xhr.overrideMimeType) xhr.overrideMimeType("text/plain");
		}});

		// instant loading JSON
		jQuery.ajaxSetup( { "async": true } );

		// Create a context object with a reference back to this
		var context_obj = { inst: this };

		// Set 'GET' or 'POST'
		var type = type_ ? "POST" : "GET";

		// Make the request
		this.tag = tag_;
		jQuery.ajax(
		{
			type: type,
			url: url_,
			dataType: "json",
			context: context_obj,
			success: function(data)
			{
				this.inst.data = data;
				this.inst.runtime.trigger(cr.plugins_.playlive_json.prototype.cnds.OnComplete, this.inst);
				this.inst.runtime.trigger(cr.plugins_.playlive_json.prototype.cnds.OnAnyComplete, this.inst);
			},
			error: function(err)
			{
				this.inst.data = [];
				this.inst.tag = "";
				this.inst.runtime.trigger(cr.plugins_.playlive_json.prototype.cnds.OnError, this.inst);
				this.inst.runtime.trigger(cr.plugins_.playlive_json.prototype.cnds.OnAnyError, this.inst);
			}
		});
	};

	Acts.prototype.SetJSON = function (tag_, str_)
	{
		this.data = JSON.parse(str_);
	};

	Acts.prototype.Clear = function ()
	{
		this.data = [];
		this.tag = "";
	};

	pluginProto.acts = new Acts();
	//////////////////////////////////////
	// Expressions
	instanceProto.Construct = function (type_, args_)
	{
		/////////////////////////////////////
		var array = [], loop = args_.length;
		loop -= type_ === "name" ? 1 : 0;
	    for (var i = 1; i < loop; i++) {
	        if (typeof args_[i] === "string")
	        	array.push(args_[i]);
	        else
	        	array.push("<" + args_[i] + ">");
	    };
	    /////////////////////////////////////
	    var str = "." + JSON.stringify(array);
	    str = str.replace(/\[/g, "").replace(/\]/g, "");
	    str = str.replace(/\"/g, "").replace(/\,/g, ".");
	    str = str.replace(/\</g, "[").replace(/\>/g, "]");
	    str = str.replace(/\.\[/g, "[");
	    var result = eval("this.data" + str);
	    /////////////////////////////////////
	    switch (type_) {
	    	case "name":
	    		return Object.keys(result)[args_[args_.length-1]];
	    	case "size":
	    		return Object.keys(result).length;
	    	case "value":
	    		return JSON.stringify(result);
	    };
	};
	/////////////////////////////////////
	function Exps() {};

	Exps.prototype.GetAsJSON = function (ret)
	{
		ret.set_string(JSON.stringify(this.data));
	};

	Exps.prototype.GetKeyName = function (ret)
	{
		ret.set_any(this.Construct("name", arguments));
	};

	Exps.prototype.GetSize = function (ret)
	{
		ret.set_int(this.Construct("size", arguments));
	};
	
	Exps.prototype.GetValue = function (ret)
	{
		ret.set_any(this.Construct("value", arguments));
	};

	Exps.prototype.GetTag = function (ret)
	{
		ret.set_any(this.tag);
	};

	pluginProto.exps = new Exps();

}());