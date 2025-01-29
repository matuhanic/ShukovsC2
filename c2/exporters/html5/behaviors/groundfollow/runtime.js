// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.groundfollow = function(runtime)
{
    this.runtime = runtime;
};

(function ()
{
    var behaviorProto = cr.behaviors.groundfollow.prototype;

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
        this.anglesArray = [];
        this.anglesHistory = [];
    };

    var behinstProto = behaviorProto.Instance.prototype;

    behinstProto.onCreate = function()
    {
        this.inst.extra["groundfollowEnabled"] = (this.properties[0] !== 0);
    };

    behinstProto.tick = function ()
    {
        if (this.inst.extra["groundfollowEnabled"]){
            if (this.inst_platformer == null){
                for (var i = 0; i < this.inst.behavior_insts.length; i++)
                {
                    var obj = this.inst.behavior_insts[i];
                    if (obj.type.name == "Platform" || obj.type.name == "PlatformPlus"){
                        this.inst_platformer = obj;
                    }
                }
            }

            if (this.inst_platformer != null){
                if (this.inst_platformer.lastFloorObject != null && (this.inst_platformer.dx !== 0 || this.inst_platformer.dy !== 0)){
                    this.anglesArray.push(this.inst_platformer.lastFloorObject.angle);
                    if (this.anglesArray.length > this.properties[1]){
                        this.anglesArray.splice(0,1);
                    }
                    var add = 0;
                    for (var i = 0; i < this.anglesArray.length; i++) {
                        add += this.anglesArray[i];
                    }
                    add = add / this.anglesArray.length;
                    this.inst.angle = add;
                }
            }
        }
    };

    /**BEGIN-PREVIEWONLY**/
    behinstProto.getDebuggerValues = function (propsections)
    {
        propsections.push({
            "title": this.type.name,
            "properties": [
                {"name": "Enabled", "value": this.inst.extra["groundfollowEnabled"]}
            ]
        });
    };

    behinstProto.onDebugValueEdited = function (header, name, value)
    {
        if (name === "Enabled")
            this.inst.extra["groundfollowEnabled"] = value;
    };
    /**END-PREVIEWONLY**/

    function Cnds() {};

    Cnds.prototype.IsEnabled = function ()
    {
        return this.inst.extra["groundfollowEnabled"];
    };

    Cnds.prototype.getCatchPrecision = function ()
    {
        return this.properties[1];
    };

    behaviorProto.cnds = new Cnds();

    function Acts() {};

    Acts.prototype.SetEnabled = function (e)
    {
        this.inst.extra["groundfollowEnabled"] = !!e;
    };

    behaviorProto.acts = new Acts();

}());