// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaFileTransfer = function(runtime)
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
cr.plugins_.cranberrygame_CordovaFileTransfer = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaFileTransfer.prototype;
		
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
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFileTransfer.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof FileTransfer == 'undefined')
            return;
		
		//this.progress
		//this.total
		//this.curTag
		
		var self=this;
		this.fileTransfer = new FileTransfer();
		this.fileTransfer['onprogress'] = function(progressEvent){
			if (progressEvent.lengthComputable) {
			  self.progress = progressEvent.loaded;
			  self.total = progressEvent.total;
			  self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFileTransfer.prototype.cnds.OnProgress, self);
			} 
			else {
			}
		};
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
*/	
//cranberrygame start
	instanceProto.downloadFileFromURL = function (url, file)
	{
		var self=this;
		
		var uri = encodeURI(url);
		this.fileTransfer['download'](
			uri,
			file,
			function(result) {
				console.log("download complete: " + result.fullPath);
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFileTransfer.prototype.cnds.OnDownloadFileFromURLSucceeded, self);
			},
			function(error) {
				console.log("download error source " + error.source);
				console.log("download error target " + error.target);
				console.log("download error code" + error.code);
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFileTransfer.prototype.cnds.OnFDownloadFileFromURLFailed, self);
			},
			false,
			{
				'headers': {
				}
			}
		);	
	}	
	instanceProto.uploadFileToServer = function (uploadFile, mimeType, serverCgiUrl, fileInputFieldName, additionalParameters, tag)
	{
		var self=this;
		
		var options = new FileUploadOptions();
		options['fileKey'] = fileInputFieldName; //ex) "uploadfile"
		options['fileName'] = uploadFile.substr(uploadFile.lastIndexOf('/')+1);
		//options['mimeType'] = "image/png";
		//options['mimeType'] = "image/jpeg";
		//options['mimeType'] = "text/plain";
		options['mimeType'] = mimeType;
		//options['params'] = {};
		//options['params']['value1'] = "test";
		//options['params']['value2'] = "param";
		try {		
			if (additionalParameters != "" && additionalParameters.indexOf("=") != -1) {
				options['params'] = {};
				if (additionalParameters.indexOf("&") != -1) {
					var arr = additionalParameters.split("&");
					
					var i, len;
					for (i = 0, len = arr.length; i < len; i++)
					{
						var nameValue = arr[i];
						var arrInner = nameValue.split("=");
						var name = arrInner[0];
						var value = arrInner[1];
						options['params'][name] = value;
					}
				}
				else {
					var arrInner = additionalParameters.split("=");
					var name = arrInner[0];
					var value = arrInner[1];
					options['params'][name] = value;
				}			
			}
		}
		catch (e) {}		
		//options['headers'] = {'headerParam':'headerValue'};		
		this.fileTransfer['upload'](
			uploadFile,
			encodeURI(serverCgiUrl),
			function(result) {
				console.log("Code = " + result.responseCode);
				console.log("Response = " + result.response);
				console.log("Sent = " + result.bytesSent);
				self.curTag = tag;				
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFileTransfer.prototype.cnds.OnUploadFileToServerSucceeded, self);
			},
			function(error) {
				console.log("an error has occurred: Code = " + error.code);
				console.log("upload error source " + error.source);
				console.log("upload error target " + error.target);
				self.curTag = tag;				
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFileTransfer.prototype.cnds.OnUploadFileToServerFailed, self);
			},
			options
		);
	}
	instanceProto.abort = function ()
	{
		fileTransfer['abort'](function(result){
			console.log("Code = " + result.responseCode);
			console.log("Response = " + result.response);
			console.log("Sent = " + result.bytesSent);
		}, function(error){
			console.log("upload error source " + error.source);
			console.log("upload error target " + error.target);
		});
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
	Cnds.prototype.OnDownloadFileFromURLSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnDownloadFileFromURLFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnUploadFileToServerSucceeded = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	Cnds.prototype.OnUploadFileToServerFailed = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	Cnds.prototype.OnProgress = function ()
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
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFileTransfer.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	Acts.prototype.DownloadFileFromURL = function (url, file)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof FileTransfer == 'undefined')
            return;
			
		this.downloadFileFromURL(url, file);
	};	
	Acts.prototype.UploadFileToServer = function (uploadFile, mimeType, serverCgiUrl, fileInputFieldName, additionalParameters, tag)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof FileTransfer == 'undefined')
            return;
			
		this.uploadFileToServer(uploadFile, mimeType, serverCgiUrl, fileInputFieldName, additionalParameters, tag);
	};
	Acts.prototype.Abort = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof FileTransfer == 'undefined')
            return;
			
		this.abort();
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
*/
	
//cranberrygame start
	Exps.prototype.Progress = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.progress);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.Total = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.total);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());