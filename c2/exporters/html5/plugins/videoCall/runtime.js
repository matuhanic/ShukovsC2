// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.hmmg_video_call = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.hmmg_video_call.prototype;
		
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
		this.apiKey = this.properties[0];
		this.connectedPeers = [];
		this.callingPeers = [];
		this.lastMessageSender = "";
		this.lastReceivedMessage = "";
		this.lastSentMessage = "";
		this.lastCaller = "" ;
		this.userStream = "" ;
		this.peerStream = "" ;
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
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
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				
				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.connected = function ()
	{
		return true;
	};
	Cnds.prototype.peerConnected = function ()
	{
		return true;
	};
	Cnds.prototype.msgReceived = function ()
	{
		return true;
	};
	Cnds.prototype.callReceived = function ()
	{
		return true;
	};
	Cnds.prototype.msgSent = function ()
	{
		return true;
	};
	Cnds.prototype.userAnswerCall = function ()
	{
		return true;
	};
	Cnds.prototype.peerStreamReceived = function ()
	{
		return true;
	};
	Cnds.prototype.userStreamReady = function ()
	{
		return true;
	};
	Cnds.prototype.cndHangUp = function ()
	{
		return true;
	};
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.connect = function (id)
	{
		this.user = new Peer(id, {key: this.apiKey});
		
		var self = this ;
		self.user.on('connection', function(conn) 
		{
			self.runtime.trigger(cr.plugins_.hmmg_video_call.prototype.cnds.peerConnected, self);
			self.connectedPeers[conn.peer] = conn ;
			self.connectedPeers[conn.peer].on("data",function(data)
			{
				self.lastMessageSender = conn.peer ;
				self.lastReceivedMessage = data ;
				self.runtime.trigger(cr.plugins_.hmmg_video_call.prototype.cnds.msgReceived, self);
			});
		});
		
		self.user.on('open', function(conn) 
		{
			self.runtime.trigger(cr.plugins_.hmmg_video_call.prototype.cnds.connected, self);
		});
		
		self.user.on('call', function(call) 
		{
			self.lastCaller = call.peer ;
			self.callingPeers[call.peer] = call;
			self.runtime.trigger(cr.plugins_.hmmg_video_call.prototype.cnds.callReceived, self);
		});
	};
	
	
	Acts.prototype.sendMsg = function (id,message)
	{
		var self = this ;
		if(typeof(self.connectedPeers[id]) === "undefined")
		{
			self.connectedPeers[id] = self.user.connect(id);
			self.connectedPeers[id].on("open",function()
			{
				self.connectedPeers[id].send(message);
				self.lastSentMessage = message ;
				self.runtime.trigger(cr.plugins_.hmmg_video_call.prototype.cnds.msgSent, self);
				
				self.connectedPeers[id].on("data",function(data)
				{
					self.lastMessageSender = id ;
					self.lastReceivedMessage = data ;
					self.runtime.trigger(cr.plugins_.hmmg_video_call.prototype.cnds.msgReceived, self);
				});
			});
		}
		else
		{
			self.connectedPeers[id].send(message);
			self.lastSentMessage = message ;
			self.runtime.trigger(cr.plugins_.hmmg_video_call.prototype.cnds.msgSent, self);
		}
	};
	
	Acts.prototype.call = function (id,type)
	{
		var video = type == 0;
		var self = this ;
		
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		navigator.getUserMedia(
		{
			video: video, 
			audio: true
		}, 
		function(stream) 
		{
		  	self.callingPeers[id] =  self.user.call(id, stream);
		  	self.userStream = URL.createObjectURL(stream);
		  	
		  	self.runtime.trigger(cr.plugins_.hmmg_video_call.prototype.cnds.userStreamReady, self);
		  	
		  	self.callingPeers[id].on('stream', function(remoteStream) 
		  	{
		  		self.peerStream = URL.createObjectURL(remoteStream);
				self.runtime.trigger(cr.plugins_.hmmg_video_call.prototype.cnds.peerStreamReceived, self);
		  	});
		  	self.callingPeers[id].on('close', function(remoteStream) 
		  	{
		  		self.runtime.trigger(cr.plugins_.hmmg_video_call.prototype.cnds.cndHangUp, self);
		  	});
		}, 
		function(err) 
		{
		  	console.error('Failed to get local stream' ,err);
		});
	};
	
	Acts.prototype.answerCall = function (id,type)
	{
		if(typeof(this.callingPeers[id]) != "undefined")
		{
			var video = type == 0;
			var self = this ;
			
			self.runtime.trigger(cr.plugins_.hmmg_video_call.prototype.cnds.callAnswer, self);
			
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			navigator.getUserMedia(
			{
				video: video, 
				audio: true
			}, 
			function(stream) 
			{
			  	self.callingPeers[id].answer(stream);
		  		self.userStream = URL.createObjectURL(stream);
		  		
		  		self.runtime.trigger(cr.plugins_.hmmg_video_call.prototype.cnds.userStreamReady, self);
			  	
			  	self.callingPeers[id].on('stream', function(remoteStream) 
			  	{
		  			self.peerStream = URL.createObjectURL(remoteStream);
		  			self.runtime.trigger(cr.plugins_.hmmg_video_call.prototype.cnds.peerStreamReceived, self);
			  	});
			  	
			  	self.callingPeers[id].on('close', function(remoteStream) 
			  	{
			  		self.runtime.trigger(cr.plugins_.hmmg_video_call.prototype.cnds.cndHangUp, self);
			  	});
			}, 
			function(err) 
			{
			  	console.error('Failed to get local stream' ,err);
			});
		}
		else 
		{
			console.error('No call from That Id' ,id);
		}
	};
	
	Acts.prototype.hangUp = function (id)
	{
		if(typeof(this.callingPeers[id]) != "undefined")
		{
			this.callingPeers[id].close();
		}
	};
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.LastMessagePeerId = function (ret)
	{
		if(this.lastMessageSender)
			ret.set_string(this.lastMessageSender);
	};
	Exps.prototype.LastCallerPeerId = function (ret)
	{
		if(this.lastCaller)
			ret.set_string(this.lastCaller);
	};
	Exps.prototype.LastReceivedMessage = function (ret)
	{
		if(this.lastReceivedMessage)
			ret.set_string(this.lastReceivedMessage);
	};
	Exps.prototype.LastSentMessage = function (ret)
	{
		if(this.lastSentMessage)
			ret.set_string(this.lastSentMessage);
	};
	Exps.prototype.UserId = function (ret)
	{
		if(this.user.id)
			ret.set_string(this.user.id);
	};
	Exps.prototype.PeerStream = function (ret)
	{
		if(this.userStream)
			ret.set_string(this.peerStream);
	};
	Exps.prototype.UserStream = function (ret)
	{
		if(this.userStream)
			ret.set_string(this.userStream);
	};
	
	pluginProto.exps = new Exps();

}());