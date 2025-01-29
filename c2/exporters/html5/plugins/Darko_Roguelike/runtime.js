// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Roguelike = function (runtime)
{
    this.runtime = runtime;
};

(function ()
{
    /////////////////////////////////////
    // *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
    //                            vvvvvvvv
    var pluginProto = cr.plugins_.Roguelike.prototype;

    /////////////////////////////////////
    // Object type class
    pluginProto.Type = function (plugin)
    {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };

    var typeProto = pluginProto.Type.prototype;

    // called on startup for each object type
    typeProto.onCreate = function ()
    {
    };

    /////////////////////////////////////
    // Instance class
    pluginProto.Instance = function (type)
    {
        this.type = type;
        this.runtime = type.runtime;

        // any other properties you need, e.g...
        // this.myValue = 0;
    };

    var instanceProto = pluginProto.Instance.prototype;

    // called whenever an instance is created
    instanceProto.onCreate = function ()
    {
        // note the object is sealed after this call; ensure any properties you'll ever need are set on the object
        // e.g...
        // this.myValue = 0;

        this.map = {};
        this.cur_coords = "";		// current map cell in for-each loop
        this.cell_count = 0;            // number of map cells
        this.isDungeon = false;
        this.rooms = [];
        this.roomArrLen = 0;
        this.roomArrInd = 0;
        this.curDoor = null;

        this.freecells = [];            // floor cells
        this.width;                     // map width
        this.height;                    // map height

        this.fov = {};
        this.visibility = {};

        this.dijkstra = null;
        this.passableCallback = null;
        this.targetX = 0;
        this.targetY = 0;
        this.path = {};

        this.seed = ROT.RNG.getSeed();
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
            "map": this.map,
            "cur_coords": this.cur_coords,
            "cell_count": this.cell_count,
            "isDungeon": this.isDungeon,
            "rooms": this.rooms,
            "roomArrLen": this.roomArrLen,
            "roomArrInd": this.roomArrInd,
            "curDoor": this.curDoor,
            "freecells": this.freecells,
            "width": this.width,
            "height": this.height,
            "fov": this.fov,
            "visibility": this.visibility,
            "dijkstra": this.dijkstra,
            "passableCallback": this.passableCallback,
            "targetX ": this.targetX,
            "targetY": this.targetY,
            "path": this.path,
            "seed": this.seed

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

        this.map = o["map"];
        this.cur_coords = o["cur_coords"];
        this.cell_count = o["cell_count"];
        this.isDungeon = o["isDungeon"];
        this.rooms = o["rooms"];
        this.roomArrLen = o["roomArrLen"];
        this.roomArrInd = o["roomArrInd"];
        this.curDoor = o["curDoor"];

        this.freecells = o["freecells"];
        this.width = o["width"];
        this.height = o["height"];

        this.fov = o["fov"];
        this.visibility = o["visibility"];

        this.dijkstra = o["dijkstra"];
        this.passableCallback = o["passableCallback"];
        this.targetX = o["targetX"];
        this.targetY = o["targetY"];
        this.path = o["path"];

        this.seed = o["seed"]
    };

    instanceProto.putCharacter = function (x, y, ch)
    {
        var key = x + "," + y;
        this.map[key] = ch;
    };

    instanceProto.roomAt = function (x)
    {
        x = Math.floor(x);

        if (isNaN(x) || x < 0 || x > this.roomArrLen - 1)
            return 0;

        return this.rooms[x];
    };

    instanceProto.doForEachTrigger = function (current_event)
    {
        this.runtime.pushCopySol(current_event.solModifiers);
        current_event.retrigger();
        this.runtime.popSol(current_event.solModifiers);
    };

    instanceProto.generateMap = function (mapGenerator, width, height) {
        var generatedCells = 0;

        var mapCallback = function (x, y, value) {
            generatedCells++;
            var mapSize = width * height;
            if (generatedCells >= mapSize) {
                this.runtime.trigger(cr.plugins_.Roguelike.prototype.cnds.OnMapGenerated, this);
                if (this.isDungeon) {
                    this.rooms = mapGenerator.getRooms();
                    this.roomArrLen = this.rooms.length;
                }
            }
            var key = x + "," + y;

            if (value) {
                this.putCharacter(x, y, "#");
            } else {
                this.putCharacter(x, y, ".");
                this.freecells.push(key);
            }
            this.cell_count++;
        };

        mapGenerator.create(mapCallback.bind(this));
    };

    // only called if a layout object - draw to a canvas 2D context
    instanceProto.draw = function (ctx)
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
    function Cnds() {
    }
    ;


    Cnds.prototype.ForEachCell = function ()
    {
        var current_event = this.runtime.getCurrentEventStack().current_event;

        for (var p in this.map)
        {
            if (this.map.hasOwnProperty(p))
            {
                this.cur_coords = p;
                this.doForEachTrigger(current_event);
            }
        }

        this.cur_coords = "";
        return false;
    };

    Cnds.prototype.ForEachVisible = function ()
    {
        var current_event = this.runtime.getCurrentEventStack().current_event;

        for (var p in this.fov)
        {
            if (this.fov.hasOwnProperty(p))
            {
                this.cur_coords = p;
                this.doForEachTrigger(current_event);
            }
        }

        this.cur_coords = "";
        return false;
    };

    Cnds.prototype.ForEachPath = function ()
    {
        var current_event = this.runtime.getCurrentEventStack().current_event;

        for (var p in this.path)
        {
            if (this.path.hasOwnProperty(p))
            {
                this.cur_coords = p;
                this.doForEachTrigger(current_event);
            }
        }

        this.cur_coords = "";
        return false;
    };

    Cnds.prototype.ForEachRoom = function ()
    {
        var current_event = this.runtime.getCurrentEventStack().current_event;

        this.roomArrInd = 0;
        for (this.roomArrInd = 0; this.roomArrInd < this.roomArrLen; this.roomArrInd++)
        {
            this.doForEachTrigger(current_event);
        }

        this.roomArrInd = 0;

        return false;
    };

    Cnds.prototype.ForEachDoorOfRoomAt = function (roomInd)
    {
        if (roomInd >= this.roomArrLen || roomInd < 0)
            return;
        var room = this.rooms[roomInd];
        if (!room)
            return;

        var setCurDoor = function (x, y) {
            var current_event = this.runtime.getCurrentEventStack().current_event;
            this.curDoor = {};
            this.curDoor.x = x;
            this.curDoor.y = y;
            this.doForEachTrigger(current_event);
        }

        room.getDoors(setCurDoor.bind(this));

        this.curDoor = null;
        return false;
    };

    Cnds.prototype.CompareChar = function (key_, cmp_, value_)
    {
        return cr.do_cmp(this.map[key_], cmp_, value_);
    };

    Cnds.prototype.OnMapGenerated = function ()
    {
        return true;
    };

    Cnds.prototype.OnFOVComputed = function ()
    {
        return true;
    };

    Cnds.prototype.OnPathComputed = function ()
    {
        return true;
    };

    pluginProto.cnds = new Cnds();

    //////////////////////////////////////
    // Actions
    function Acts() {
    }
    ;

    // the example action
    Acts.prototype.GenerateDungeon = function (width, height, type,
            roomWidthMin, roomWidthMax,
            roomHeightMin, roomHeightMax,
            corridorLengthMin, corridorLengthMax,
            roomDugPercentage)
    {

        ROT.DEFAULT_WIDTH = width;
        ROT.DEFAULT_HEIGHT = height;

        this.width = width;
        this.height = height;

        var mapGenerator = {};

        function DungeonConfiguration() {
            this.roomWidth = [roomWidthMin, roomWidthMax];
            this.roomHeight = [roomHeightMin, roomHeightMax];
            this.corridorLength = [corridorLengthMin, corridorLengthMax];
            this.roomDugPercentage = roomDugPercentage;
        }
        ;

        var diggerConfiguration = new DungeonConfiguration();


        switch (type) {
            case 0:
                mapGenerator = new ROT.Map.Digger(width, height, diggerConfiguration);
                this.isDungeon = true;
                break;
            case 1:
                mapGenerator = new ROT.Map.Uniform(width, height, diggerConfiguration);
                this.isDungeon = true;
                break;
            case 2:
                mapGenerator = new ROT.Map.Rogue(width, height);
                break;
            case 3:
                mapGenerator = new ROT.Map.Arena(width, height);
                break;
            default:
                mapGenerator = new ROT.Map.Digger(width, height);
        }

        this.generateMap(mapGenerator, width, height);
    };

    Acts.prototype.GenerateCellular = function (width, height,
            probability, generationNum,
            born, survive)
    {

        ROT.DEFAULT_WIDTH = width;
        ROT.DEFAULT_HEIGHT = height;

        this.width = width;
        this.height = height;

        var bornArr = born.split(" ");
        for (var i = 0; i < bornArr.length; i++) {
            var num = parseInt(bornArr[i]);
            if (isNaN(num)) {
                bornArr[i] = 2;
            } else {
                bornArr[i] = num;
            }
        }

        var surviveArr = survive.split(" ");
        for (var i = 0; i < surviveArr.length; i++) {
            num = parseInt(surviveArr[i]);
            if (isNaN(num)) {
                surviveArr[i] = 2;
            } else {
                surviveArr[i] = num;
            }
        }

        var cellularConfig = {
            born: bornArr,
            survive: surviveArr
        }

        var mapGenerator = {};
        mapGenerator = new ROT.Map.Cellular(width, height, cellularConfig);
        mapGenerator.randomize(probability);

        for (i = 0; i < generationNum; i++) {
            this.generateMap(mapGenerator, width, height);
        }
    };

    Acts.prototype.GenerateMaze = function (width, height,
            type, regularity)
    {

        window.console.log(type);
        ROT.DEFAULT_WIDTH = width;
        ROT.DEFAULT_HEIGHT = height;

        this.width = width;
        this.height = height;

        var mapGenerator = {};

        switch (type) {
            case 0:
                mapGenerator = new ROT.Map.DividedMaze(width, height);
                break;
            case 1:
                mapGenerator = new ROT.Map.IceyMaze(width, height, regularity);
                break;
            case 2:
                mapGenerator = new ROT.Map.EllerMaze(width, height);
                break;
            default:
                mapGenerator = new ROT.Map.DividedMaze(width, height);
                break;
        }

        this.generateMap(mapGenerator, width, height);
    };

    Acts.prototype.ComputeFOV = function (x, y, r)
    {
        // reset the field of view hashmap
        this.fov = {};
        this.visibility = {};
        var numCellsInspected = 0;
        var numCellsTotal = Math.pow(r * 2 + 1, 2) - 1;

        // console.log("map: " + this.map);
        /* input callback */
        var lightPasses = function (x, y) {
            numCellsInspected++;
            if (numCellsInspected >= numCellsTotal) {
                this.runtime.trigger(cr.plugins_.Roguelike.prototype.cnds.OnFOVComputed, this);
            }

            var key = x + "," + y;
            if (key in this.map) {
                return (this.map[key] === ".");
            }
            return false;
        };

        var fov = new ROT.FOV.PreciseShadowcasting(lightPasses.bind(this));

        var outputCallback = (function (x, y, r, visibility) {
            var key = x + "," + y;
            this.fov[key] = this.map[key];
            this.visibility[key] = visibility;
        }).bind(this);

        fov.compute(x, y, r, outputCallback);
    };

    Acts.prototype.GeneratePassabilityMap = function () {
        window.console.log("Calculate");
        /* input callback informs about map structure */
        this.passableCallback = function (x, y) {
            return (this.map[x + "," + y] === ".");
        };

        /* prepare path to given coords */
        this.dijkstra = new ROT.Path.Dijkstra(this.targetX, this.targetY, this.passableCallback.bind(this));
    };

    Acts.prototype.ComputePath = function (sourceX, sourceY, targetX, targetY) {
        this.path = {};

        /* prepare path to given coords */
//        if (!this.dijkstra || (this.targetX !== targetX || this.targetY !== targetY)) {
        this.targetX = targetX;
        this.targetY = targetY;
        this.type.plugin.acts.GeneratePassabilityMap.call(this);
//        }

        var outputCallback = function (x, y) {
            var key = x + "," + y;
            this.path[key] = "*";
            if (x === targetX && y === targetY) {
                this.runtime.trigger(cr.plugins_.Roguelike.prototype.cnds.OnPathComputed, this);
            }
        }.bind(this);

        /* compute from given coords #1 */
        this.dijkstra.compute(sourceX, sourceY, outputCallback);
    };

    Acts.prototype.PutCharacter = function (x, y, ch)
    {
        this.putCharacter(x, y, ch);
    };

    Acts.prototype.SetSeed = function (seed) {
        this.seed = ROT.RNG.setSeed(seed);
    }

    pluginProto.acts = new Acts();

    //////////////////////////////////////
    // Expressions
    function Exps() {
    }
    ;

    Exps.prototype.parseX = function (ret, key)
    {
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        ret.set_int(x);
    };

    Exps.prototype.parseY = function (ret, key)
    {

        var parts = key.split(",");
        var y = parseInt(parts[1]);
        ret.set_int(y);
    };

    Exps.prototype.getCharacter = function (ret, x, y)
    {
        var key = x + "," + y;
        ret.set_string(this.map[key]);
    };

    Exps.prototype.CellCount = function (ret)
    {
        ret.set_int(this.cell_count);
    };

    Exps.prototype.CurrentCoordinates = function (ret)
    {
        ret.set_string(this.cur_coords);
    };

    Exps.prototype.CellVisibility = function (ret, key)
    {
        ret.set_int(this.visibility[key]);
    };

    Exps.prototype.CurrentCharacter = function (ret)
    {
        // Could be requested outside for-each loop
        if (this.map.hasOwnProperty(this.cur_coords))
            ret.set_string(this.map[this.cur_coords]);
        else
            ret.set_int(0);
    };

    Exps.prototype.NumberOfRooms = function (ret)
    {
        ret.set_int(this.roomArrLen);
    };

    Exps.prototype.CurRoomInd = function (ret)
    {
        ret.set_int(this.roomArrInd);
    };

    Exps.prototype.CurDoorX = function (ret)
    {
        if (this.curDoor)
            ret.set_int(this.curDoor.x);
    };

    Exps.prototype.CurDoorY = function (ret)
    {
        if (this.curDoor)
            ret.set_int(this.curDoor.y);
    };

    Exps.prototype.getRoomEdge = function (ret, ind, edge)
    {
        var room = this.roomAt(ind);
        var roomEdge;

        if (room)
        {
            switch (edge) {
                case "left":
                    roomEdge = room.getLeft();
                    break;
                case "right":
                    roomEdge = room.getRight();
                    break;
                case "top":
                    roomEdge = room.getTop();
                    break;
                case "bottom":
                    roomEdge = room.getBottom();
                    break;
                default:
                    roomEdge = room.getLeft();
                    break;
            }
            ret.set_int(roomEdge);
        }
        else
            ret.set_int(0);
    };


    Exps.prototype.RoomCenterX = function (ret, roomIndex)
    {
        var room = this.roomAt(roomIndex);

        if (room) {
            var coordNumber = room.getCenter()[0];
            ret.set_int(coordNumber);
        }        
        else ret.set_int(0);
    };

    Exps.prototype.RoomCenterY = function (ret, roomIndex)
    {
        var room = this.roomAt(roomIndex);

        if (room) {
            var coordNumber = room.getCenter()[1];
            ret.set_int(coordNumber);
        }        
        else ret.set_int(0);
    };


    Exps.prototype.Seed = function (ret)
    {
        ret.set_int(ROT.RNG.getSeed());
    };

    pluginProto.exps = new Exps();

}());

