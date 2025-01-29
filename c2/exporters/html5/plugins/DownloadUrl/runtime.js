// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.DownloadUrl = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.DownloadUrl.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};
			
	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};

	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function()
	{
		
	};

	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": "DownloadUrl",
			"properties": [
				
			]
		});
	};
	/**END-PREVIEWONLY**/
	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.InvokeDownloadUrl = function (url_, mimetype_, filename_)
	{
			var a = document.createElement("a");
		
		if (typeof a["download"] === "undefined")
		{
			// can't do much better than this without download tag support
			window.open(url_);
			alert(' Web Browser without download tag support for image in preview mode of Construct 2!\n  Work with Edge Browser in preview\n \n Navegador da Web sem suporte à tag de download de imagem no modo preview do Construct 2!\n  Funciona com o navegador Edge no modo preview');
		}
		else
		{
			// auto download
			var body = document.getElementsByTagName("body")[0];
			a.textContent = filename_;
			a.href = url_;
			a["download"] = filename_;
			body.appendChild(a);
			var clickEvent = new MouseEvent("click");
			a.dispatchEvent(clickEvent);
			body.removeChild(a);
		}
	};
	
		pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	pluginProto.exps = new Exps();
	
}());