// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.EasystarTilemap = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.EasystarTilemap.prototype;
		
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		this.easystarjs = new EasyStar["js"]();

		// Load properties
		if(this.properties[0] === 0)
			this.easystarjs["enableDiagonals"]();
		else
			this.easystarjs["disableDiagonals"]();

		if(this.properties[1] < 0)
			this.easystarjs["setIterationsPerCalculation"](Number.MAX_VALUE);
		else
			this.easystarjs["setIterationsPerCalculation"](this.properties[1]);

		if(this.properties[2] === 0)
			this.emptyWalkable = true;
		else
			this.emptyWalkable = false;

		
		// object is sealed after this call, so make sure any properties you'll ever need are created, e.g.
		// this.myValue = 0;

		this.paths = {};

		this.curTag = "";
		this.baseSetTileAt = this.inst.setTileAt;
		var arr = [];
		if(this.emptyWalkable)
			arr.push(-1 & 0x1FFFFFFF); //TILE_ID_MASK from the Tilemap runtime, add empty tile as an acceptable tile
		this.easystarjs["setAcceptableTiles"](arr);
	};

	function fillGridFromTilemap(grid, tilemap){
		var i, j;
		for(i = 0; i < grid.length; i++){
			for(j = 0; j < grid[i].length; j++){
				grid[i][j] = tilemap.getTileAt(j, i) & 0x1FFFFFFF; //TILE_ID_MASK from the Tilemap runtime
			}
		}
	}

	function createArray(length) {
		var arr = new Array(length || 0),
		    i = length;

		if (arguments.length > 1) {
		        var args = Array.prototype.slice.call(arguments, 1);
			while(i--) arr[length-1 - i] = createArray.apply(this, args);
		}

		return arr;
	}
	
	behinstProto.onDestroy = function ()
	{
		// called when associated object is being destroyed
		// note runtime may keep the object and behavior alive after this call for recycling;
		// release, recycle or reset any references here as necessary
		this.paths = {};
		this.inst.setTileAt = this.baseSetTileAt;
	};
	
	// called when saving the full state of the game
	behinstProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your behavior's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
			"paths" : this.paths,
			"acceptableTiles" : this.easystarjs["getAcceptableTiles"](),
			"costMap" : this.easystarjs["getCostMap"](),
			"pointsToAvoid" : this.easystarjs["getPointsToAvoid"](),
			"diagonalsEnabled" : this.easystarjs["getDiagonalsEnabled"](),
			"emptyWalkable" : this.emptyWalkable
		};
	};
	
	// called when loading the full state of the game
	behinstProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
		this.paths = o["paths"];

		var tilegrid = createArray(this.inst.mapheight, this.inst.mapwidth);

		var baseFunction = this.inst.setTileAt;

		this.inst.setTileAt = function (x_, y_, t_)
		{
			x_ = Math.floor(x_);
			y_ = Math.floor(y_);
			
			if (x_ < 0 || y_ < 0 || x_ >= this.mapwidth || y_ >= this.mapheight)
				return -1;

			tilegrid[y_][x_] = t_ & 0x1FFFFFFF; //TILE_ID_MASK from the Tilemap runtime
			baseFunction(x_, y_, t_);
		}
		fillGridFromTilemap(tilegrid, this.inst);
		this.easystarjs["setGrid"](tilegrid);
		this.easystarjs["setAcceptableTiles"](o["acceptableTiles"]);
		this.easystarjs["setCostMap"](o["costMap"]);
		this.easystarjs["setPointsToAvoid"](o["pointsToAvoid"]);
		if(o["diagonalsEnabled"])
			this.easystarjs["enableDiagonals"]();
		else
			this.easystarjs["disableDiagonals"]();
		this.curTag = "";
		this.emptyWalkable = o["emptyWalkable"];
	};

	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
		if(!this.easystarjs) return;
		if(!this.easystarjs["collisionGrid"] ||
		   this.easystarjs["collisionGrid"].length !== this.inst.mapheight ||
		   this.easystarjs["collisionGrid"][0].length !== this.inst.mapwidth){
			var tilegrid = createArray(this.inst.mapheight, this.inst.mapwidth);
			var baseFunction;
			if(this.baseSetTileAt === null)
				baseFunction = this.inst.setTileAt;
			else
				baseFunction = this.baseSetTileAt;

			var tilemapInst = this.inst;

			tilemapInst.setTileAt = function (x_, y_, t_)
			{
				x_ = Math.floor(x_);
				y_ = Math.floor(y_);
				
				if (x_ < 0 || y_ < 0 || x_ >= tilemapInst.mapheight || y_ >= tilemapInst.mapwidth)
					return -1;

				tilegrid[y_][x_] = t_ & 0x1FFFFFFF; //TILE_ID_MASK from the Tilemap runtime
				baseFunction.call(tilemapInst, x_, y_, t_);
			}
			fillGridFromTilemap(tilegrid, this.inst);
			this.easystarjs["setGrid"](tilegrid);
		}

		this.easystarjs["calculate"]();
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		/*
		propsections.push({
			"title": this.type.name,
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				{"name": "My property", "value": this.myProperty}
			]
		});
		*/
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		/*
		if (name === "My property")
			this.myProperty = value;
		*/
	};
	/**END-PREVIEWONLY**/

	behinstProto.doPathingRequest = function (tag_, x_, y_, x2_, y2_){
		if(!this.easystarjs["collisionGrid"]){
			var tilegrid = createArray(this.inst.mapheight, this.inst.mapwidth);

			var baseFunction;

			if(this.baseSetTileAt === null)
				baseFunction = this.inst.setTileAt;
			else
				baseFunction = this.baseSetTileAt;

			var tilemapInst = this.inst;

			tilemapInst.setTileAt = function (x_, y_, t_)
			{
				x_ = Math.floor(x_);
				y_ = Math.floor(y_);
				
				if (x_ < 0 || y_ < 0 || x_ >= tilemapInst.mapheight || y_ >= tilemapInst.mapwidth)
					return -1;

				tilegrid[y_][x_] = t_ & 0x1FFFFFFF; //TILE_ID_MASK from the Tilemap runtime
				baseFunction.call(tilemapInst, x_, y_, t_);
			}
			fillGridFromTilemap(tilegrid, this.inst);
			this.easystarjs["setGrid"](tilegrid);
		}

		var self = this;
		
		var notFoundFunction = function(){
			self.curTag = tag_;
			delete self.paths[tag_];
			self.runtime.trigger(cr.behaviors.EasystarTilemap.prototype.cnds.OnFailedToFindPath, self.inst);
			self.runtime.trigger(cr.behaviors.EasystarTilemap.prototype.cnds.OnAnyPathNotFound, self.inst);
		};

		var foundFunction = function(path){
			self.curTag = tag_;
			self.paths[tag_] = path;
			self.runtime.trigger(cr.behaviors.EasystarTilemap.prototype.cnds.OnPathFound, self.inst);
			self.runtime.trigger(cr.behaviors.EasystarTilemap.prototype.cnds.OnAnyPathFound, self.inst);
		};
		
		if(x_ < 0 || y_ < 0 || x2_ < 0 || y2_ < 0 ||
		   x_ > this.inst.mapwidth-1 || x2_ > this.inst.mapwidth-1 ||
		   y_ > this.inst.mapheight-1 || y2_ > this.inst.mapheight-1)
			notFoundFunction();
		else
			this.easystarjs["findPath"](x_, y_, x2_, y2_, function(path){
				if (path === null) {
			        	notFoundFunction();
				} else {
			        	foundFunction(path);
				}
			});
	}

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	//Cnds.prototype.IsMoving = function ()
	//{
		// ... see other behaviors for example implementations ...
	//	return false;
	//};

	//self.runtime.trigger(cr.plugins_.Tilemap.prototype.cnds.OnURLLoaded, self)

	Cnds.prototype.OnPathFound = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	
	Cnds.prototype.OnFailedToFindPath = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};

	Cnds.prototype.OnAnyPathFound = function ()
	{
		return true;
	};

	Cnds.prototype.OnAnyPathNotFound = function ()
	{
		return true;
	};
	
	// ... other conditions here ...
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	//Acts.prototype.Stop = function ()
	//{
		// ... see other behaviors for example implementations ...
	//};
	
	Acts.prototype.ForceCalculate = function(){
		this.easystarjs["calculate"]();
	}

	Acts.prototype.FindPath = function(x_, y_, x2_, y2_, tag_){
		this.doPathingRequest(tag_, x_, y_, x2_, y2_);
	}

	Acts.prototype.SetWalkableTiles = function(list){
		var arr = jQuery.map(list.split(';'), function(value){
		    	return parseInt(value, 10);
		});
		if(this.emptyWalkable)
			arr.push(-1 & 0x1FFFFFFF); //TILE_ID_MASK from the Tilemap runtime, add empty tile as an acceptable tile
		this.easystarjs["setAcceptableTiles"](arr);
	}

	Acts.prototype.SetDiagonal = function(disabled){
		if(disabled)
			this.easystarjs["disableDiagonals"]();
		else
			this.easystarjs["enableDiagonals"]();
	}

	Acts.prototype.SetTileCost = function(tileID, cost){
		this.easystarjs["setTileCost"](tileID, cost);
	}

	Acts.prototype.AddObstacle = function(x_, y_){
		this.easystarjs["avoidAdditionalPoint"](x_, y_);
	}

	Acts.prototype.RemoveObstacle = function(x_, y_){
		this.easystarjs["stopAvoidingAdditionalPoint"](x_, y_);
	}

	Acts.prototype.RemoveAllObstacles = function(){
		this.easystarjs["stopAvoidingAllAdditionalPoints"]();
	}

	Acts.prototype.SetIterationsPerCalculation = function(iterations){
		this.easystarjs["setIterationsPerCalculation"](iterations < 0 ? Number.MAX_VALUE : iterations);
	}
	Acts.prototype.CancelPendingPath = function(){
		this.easystarjs["clearInstanceList"]();
	}

	Acts.prototype.SetEmptyTileWalkable = function(nonWalkable){
		var tiles = this.easystarjs["getAcceptableTiles"]();
		var index = tiles.indexOf(-1 & 0x1FFFFFFF);
		if(nonWalkable){
			this.emptyWalkable = false;
			if(index !== -1){
				tiles.splice(index, 1);
				this.easystarjs["setAcceptableTiles"](tiles);
			}
		}
		else{
			this.emptyWalkable = true;
			if(index === -1){
				tiles.push(-1 & 0x1FFFFFFF);
				this.easystarjs["setAcceptableTiles"](tiles);
			}
		}
	};
	
	// ... other actions here ...

	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	// the example expression
	//Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	//{
	//	ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	//};

	Exps.prototype.PathLength = function(ret, tag){
		if(this.paths[tag] && this.paths[tag].length)
			ret.set_int(this.paths[tag].length);
		else
			ret.set_int(0);
	}

	Exps.prototype.NodeTileXAt = function(ret, tag, index){
		if(this.paths[tag] && this.paths[tag][index])
			ret.set_int(this.paths[tag][index].x);
		else
			ret.set_int(0);
	}

	Exps.prototype.NodeTileYAt = function(ret, tag, index){
		if(this.paths[tag] && this.paths[tag][index])
			ret.set_int(this.paths[tag][index].y);
		else
			ret.set_int(0);
	}

	Exps.prototype.NodeLayoutXAt = function(ret, tag, index){
		if(this.paths[tag] && this.paths[tag][index]){
			cr.plugins_.Tilemap.prototype.exps.TileToPositionX.call(this.inst, ret, this.paths[tag][index].x);
		}
		else
			ret.set_int(0);
	}

	Exps.prototype.NodeLayoutYAt = function(ret, tag, index){
		if(this.paths[tag] && this.paths[tag][index])
			cr.plugins_.Tilemap.prototype.exps.TileToPositionY.call(this.inst, ret, this.paths[tag][index].y);
		else
			ret.set_int(0);
	}

	Exps.prototype.CurrentTag = function(ret){
		ret.set_string(this.curTag);
	}
	
	Exps.prototype.NodeCostAt = function(ret, tag, index){
		if(this.paths[tag] && this.paths[tag][index])
			ret.set_float(this.paths[tag][index].cost / 10);
		else
			ret.set_float(0);
	}
	
	Exps.prototype.PathCost = function(ret, tag){
		if(this.paths[tag] && this.paths[tag].length)
			ret.set_float(this.paths[tag][this.paths[tag].length-1].cost / 10);
		else
			ret.set_float(0);
	}
	
	// ... other expressions here ...
	
	behaviorProto.exps = new Exps();
}());