// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaFile = function(runtime)
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
cr.plugins_.cranberrygame_CordovaFile = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaFile.prototype;
		
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
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window['requestFileSystem'] == 'undefined')
            return;
			
		//this.text
		//this.directoryEntries
		//this.curTag
		
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
	instanceProto.writeText = function (file, text, append_mode)
	{
		var self = this;

		//http://docs.phonegap.com/en/3.3.0/cordova_file_file.md.html#FileWriter
		function gotFS(fileSystem) {
			fileSystem['root']['getFile'](file, { 'create': true }, gotFileEntry, fail);
		}		 
		function gotFileEntry(fileEntry) {
			fileEntry['createWriter'](gotFileWriter, fail);
		}
		function gotFileWriter(writer) {
			writer.onwriteend = function(evt) {
				console.log("contents of file now 'some sample text'");
				//writer.truncate(11);
				//writer.onwriteend = function(evt) {
				//	console.log("contents of file now 'some sample'");
				//	writer.seek(4);
				//	writer.write(" different text");
				//	writer.onwriteend = function(evt){
				//		console.log("contents of file now 'some different text'");
				//	}
				//};
				if (append_mode)				
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnAppendTextSucceeded, self);				
				else
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnWriteTextSucceeded, self);				
			};
			if (append_mode)
				writer.seek(writer.length);
			writer.write(text);
		}
	
		function fail(error) {
			console.log(error.target.error.code);
			if (append_mode)
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnAppendTextFailed, self);
			else
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnReadTextFailed, self);
		}		
		window['requestFileSystem'](LocalFileSystem['PERSISTENT'], 0, gotFS, fail);
	};

	instanceProto.readText = function (file, tag)
	{
		var self = this;

		function gotFS(fileSystem) {
			fileSystem['root']['getFile'](file, { create: true }, gotFileEntry, fail);
		}		 
		function gotFileEntry(fileEntry) {
			fileEntry['file'](gotFile, fail);
		}
	    function gotFile(file){
			readAsText(file);
		}
		function readAsText(file) {
			var reader = new FileReader();
			reader.onloadend = function (evt) {
				console.log("Read as text");
				//var xml = evt.target.result;
				//fileObject = xml;
				//ParseXmlCat(xml);
				//alert(evt.target.result);
				self.text = evt.target.result;
				self.curTag = tag;				
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnReadTextSucceeded, self);				
			};
			reader.readAsText(file);
		}
		function fail(error) {
			console.log(error.target.error.code);
			self.curTag = tag;
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnReadTextFailed, self);
		}		
		window['requestFileSystem'](LocalFileSystem['PERSISTENT'], 0, gotFS, fail);	
	}

	instanceProto.removeFile = function (file)
	{
		var self=this;

		function gotFS(fileSystem) {
			fileSystem['root']['getFile'](file, { create: true }, gotFileEntry, fail);
		}		 
		function gotFileEntry(fileEntry) {
			fileEntry['remove'](removed, fail);
		}
	    function removed(file){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnRemoveFileSucceeded, self);
		}
		function fail(error) {
			console.log(error.target.error.code);
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnRemoveFileFailed, self);
		}		
		window['requestFileSystem'](LocalFileSystem['PERSISTENT'], 0, gotFS, fail);
	}
	
	instanceProto.checkIfFileExists = function (file)
	{
		var self=this;

		function gotFS(fileSystem) {
			fileSystem['root']['getFile'](file, { create: false }, gotFileEntry, fail);
		}		 
		function gotFileEntry(fileEntry) {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnFileExists, self);
		}
		function fail(error) {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnFileDoesNotExist, self);
		}		
		window['requestFileSystem'](LocalFileSystem['PERSISTENT'], 0, gotFS, fail);
	}
	
	instanceProto.copyFile = function (sourceFilePath, targetFilePath)	
	{
		//http://docs.phonegap.com/en/3.3.0/cordova_file_file.md.html#File		
		//http://t196380.handhelds-phonegap.handheldtalk.info/phonegap-3-3-0-copyto-and-moveto-throwing-t196380.html		
		//http://www.mangogood.com/?p=89
		//The File API can't access files inside the asset directory. You'll need to write a plugin.
		//http://www.techques.com/question/1-8524488/how-to-use-copyto-api-in-phonegap
		
		var self=this;

		var fileSystem_;
		function gotFS(fileSystem) {
			fileSystem_ = fileSystem;
			fileSystem['root']['getFile'](sourceFilePath, { create: false }, gotFileEntry, fail);
		}
		var fileEntry_;
		var targetDirectory_ = '';
		var targetFileName_ = '';		
		function gotFileEntry(fileEntry) {
			fileEntry_ = fileEntry;
			if (targetFilePath.indexOf('/') != -1) {
				targetDirectory_ = targetFilePath.substring(0, targetFilePath.lastIndexOf('/'));
				targetFileName_ = targetFilePath.substring(targetFilePath.lastIndexOf('/') + 1);
			}
			else {
				targetDirectory_ = '';
				targetFileName_ = targetFilePath;
			}
			
			fileSystem_['root']['getDirectory'](targetDirectory_, {create: true, exclusive: false}, gotDirectoryEntry, fail);
		}
		function gotDirectoryEntry(directoryEntry) {
			//alert(directoryEntry.fullPath+"/"+targetFileName_);
			
			fileEntry_['copyTo'](directoryEntry, targetFileName_, copied, fail);			
		}
	    function copied(fileEntry){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnCopyFileSucceeded, self);
		}
		function fail(error) {
			console.log(error.code);
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnCopyFileFailed, self);
		}		
		window['requestFileSystem'](LocalFileSystem['PERSISTENT'], 0, gotFS, fail);
	}

	instanceProto.moveFile = function (sourceFilePath, targetFilePath)
	{
		var self=this;

		var fileSystem_;
		function gotFS(fileSystem) {
			fileSystem_ = fileSystem;
			fileSystem['root']['getFile'](sourceFilePath, { create: false }, gotFileEntry, fail);
		}
		var fileEntry_;
		var targetDirectory_ = '';
		var targetFileName_ = '';			
		function gotFileEntry(fileEntry) {
			fileEntry_ = fileEntry;
			if (targetFilePath.indexOf('/') != -1) {
				targetDirectory_ = targetFilePath.substring(0, targetFilePath.lastIndexOf('/'));
				targetFileName_ = targetFilePath.substring(targetFilePath.lastIndexOf('/') + 1);
			}
			else {
				targetDirectory_ = '';
				targetFileName_ = targetFilePath;
			}
			
			fileSystem_['root']['getDirectory'](targetDirectory_, {create: true, exclusive: false}, gotDirectoryEntry, fail);//
		}
		function gotDirectoryEntry(directoryEntry) {
			//alert(directoryEntry.fullPath+"/"+targetFileName_);
			
			fileEntry_['moveTo'](directoryEntry, targetFileName_, moved, fail);			
		}
	    function moved(fileEntry){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnMoveFileSucceeded, self);
		}
		function fail(error) {
			console.log(error.code);
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnMoveFileFailed, self);
		}		
		window['requestFileSystem'](LocalFileSystem['PERSISTENT'], 0, gotFS, fail);		
	}

	instanceProto.getDirectoryEntries = function (directory)
	{
		var self=this;

		function gotFS(fileSystem) {
			fileSystem['root']['getDirectory'](directory, {create: false, exclusive: false}, gotDirectoryEntry, fail);			
		}
		function gotDirectoryEntry(directoryEntry) {
			var directoryReader = directoryEntry.createReader();
			directoryReader.readEntries(gotDirectoryEntries,fail);
		}	
		function gotDirectoryEntries(result) {
			var directoryEntries = result;
			var i;
			for (i=0; i<directoryEntries.length; i++) {
				console.log(directoryEntries[i].isFile);
				console.log(directoryEntries[i].isDirectory);
				console.log(directoryEntries[i].name);
				console.log(directoryEntries[i].fullPath);
			}
			self.directoryEntries = directoryEntries;
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnGetDirectoryEntriesSucceeded, self);
		}			
		function fail(error) {
			console.log(error.code);
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnGetDirectoryEntriesFailed, self);
		}		
		window['requestFileSystem'](LocalFileSystem['PERSISTENT'], 0, gotFS, fail);
	}

	instanceProto.createDirectory = function (directory)
	{
		var self=this;

		function gotFS(fileSystem) {
			fileSystem['root']['getDirectory'](directory, {create: true, exclusive: false}, gotDirectoryEntry, fail);			
		}
		function gotDirectoryEntry(directoryEntry) {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnCreateDirectorySucceeded, self);
		}	
		function fail(error) {
			console.log(error.code);
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.OnCreateDirectoryFailed, self);
		}		
		window['requestFileSystem'](LocalFileSystem['PERSISTENT'], 0, gotFS, fail);
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
	Cnds.prototype.OnWriteTextSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnWriteTextFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnAppendTextSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnAppendTextFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnReadTextSucceeded = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	Cnds.prototype.OnReadTextFailed = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	Cnds.prototype.OnRemoveFileSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnRemoveFileFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnFileExists = function ()
	{
		return true;
	};
	Cnds.prototype.OnFileDoesNotExist = function ()
	{
		return true;
	};	
	Cnds.prototype.OnCopyFileSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnCopyFileFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnMoveFileSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnMoveFileFailed = function ()
	{
		return true;
	};	
	Cnds.prototype.OnGetDirectoryEntriesSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnGetDirectoryEntriesFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnCreateDirectorySucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnCreateDirectoryFailed = function ()
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
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaFile.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	Acts.prototype.WriteText = function (file, text)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window['requestFileSystem'] == 'undefined')
            return;
			
		this.writeText(file, text);
	};
	Acts.prototype.AppendText = function (file, text)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window['requestFileSystem'] == 'undefined')
            return;
			
		this.writeText(file, text, true);		
	};	
	Acts.prototype.ReadText = function (file, tag)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window['requestFileSystem'] == 'undefined')
            return;
			
		this.readText(file, tag);
	};
	Acts.prototype.RemoveFile = function (file)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window['requestFileSystem'] == 'undefined')
            return;
			
		this.removeFile(file);
	};
	Acts.prototype.CheckIfFileExists = function (file)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window['requestFileSystem'] == 'undefined')
            return;
			
		this.checkIfFileExists(file);
	};
	Acts.prototype.CopyFile = function (sourceFilePath, targetDirectory, targetFileName)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window['requestFileSystem'] == 'undefined')
            return;

		this.copyFile(sourceFilePath, targetDirectory, targetFileName);
	};	
	Acts.prototype.MoveFile = function (sourceFilePath, targetDirectory, targetFileName)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window['requestFileSystem'] == 'undefined')
            return;

		this.moveFile(sourceFilePath, targetDirectory, targetFileName);
	};
	Acts.prototype.GetDirectoryEntries = function (directory)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window['requestFileSystem'] == 'undefined')
            return;

		this.getDirectoryEntries(directory);
	};
	Acts.prototype.CreateDirectory = function (directory)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;
        if (typeof window['requestFileSystem'] == 'undefined')
            return;

		this.createDirectory(directory);
	};
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
	Exps.prototype.Text = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.text);		// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.DirectoryEntriesCount = function (ret)
	{
		ret.set_int(this.directoryEntries.length);
	};
	Exps.prototype.IsFileAt = function (ret, i)
	{
		ret.set_int(this.directoryEntries[i].isFile?1:0);
	};
	Exps.prototype.IsDirectoryAt = function (ret, i)
	{
		ret.set_int(this.directoryEntries[i].isDirectory?1:0);
	};
	
	Exps.prototype.NameAt = function (ret, i)
	{
		ret.set_string(this.directoryEntries[i].name);
	};	
	Exps.prototype.FullPathAt = function (ret, i)
	{
		ret.set_string(this.directoryEntries[i].fullPath);
	};	
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());