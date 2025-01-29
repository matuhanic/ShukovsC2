﻿// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Namespace = function(runtime)
{
    this.runtime = runtime;
};

(function ()
{
    var pluginProto = cr.plugins_.Namespace.prototype;
        
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
    
    var isInPreview = false;    // set in onCreate
    
    function FuncStackEntry()
    {
        this.name = "";
        this.retVal = 0;
        this.params = [];
    };
    
    function pushFuncStack(self)
    {
        self.funcStackPtr = self.funcStackPtr + 1;
        
        if (self.funcStackPtr === self.funcStack.length)
            self.funcStack.push(new FuncStackEntry());
            
        return self.funcStack[self.funcStackPtr];
    };
    
    function getCurrentFuncStack(self)
    {
        if (self.funcStackPtr < 0)
            return null;
            
        return self.funcStack[self.funcStackPtr];
    };
    
    function getOneAboveFuncStack(self)
    {
        if (!self.funcStack.length)
            return null;
        
        var i = self.funcStackPtr + 1;
        
        if (i >= self.funcStack.length)
            i = self.funcStack.length - 1;
            
        return self.funcStack[i];
    };
    
    function popFuncStack(self)
    {
        assert2(self.funcStackPtr >= 0, "Popping empty function stack");
        
        self.funcStackPtr = self.funcStackPtr - 1;
    };

    instanceProto.onCreate = function()
    {
        isInPreview = (typeof cr_is_preview !== "undefined");
        this.funcStack = []
        this.funcStackPtr = -1
    };
    
    //////////////////////////////////////
    // Conditions
    function Cnds() {};

    Cnds.prototype.OnNamespace = function (name_)
    {
        var fs = getCurrentFuncStack(this);
        
        if (!fs)
            return false;
        
        return cr.equals_nocase(name_, fs.name);
    };
    
    Cnds.prototype.CompareParam = function (index_, cmp_, value_)
    {
        var fs = getCurrentFuncStack(this);
        
        if (!fs)
            return false;
        
        index_ = cr.floor(index_);
        
        if (index_ < 0 || index_ >= fs.params.length)
            return false;
            
        return cr.do_cmp(fs.params[index_], cmp_, value_);
    };
    
    pluginProto.cnds = new Cnds();

    //////////////////////////////////////
    // Actions
    function Acts() {};

    Acts.prototype.CallNamespace = function (name_, params_)
    {
        var fs = pushFuncStack(this);
        fs.name = name_.toLowerCase();
        fs.retVal = 0;
        cr.shallowAssignArray(fs.params, params_);
        
        // Note: executing fast trigger path based on fs.name
        var ran = this.runtime.trigger(cr.plugins_.Namespace.prototype.cnds.OnNamespace, this, fs.name);
        
        // In preview mode, log to the console if nothing was triggered
        if (isInPreview && !ran)
        {
            log("[Construct 2] '"+ this.type.name +"' Namespace object: called function '" + name_ + "', but no event was triggered. Is the function call spelt incorrectly or no longer used?", "warn");
        }
        
        popFuncStack(this);
    };
    
    Acts.prototype.SetReturnValue = function (value_)
    {
        var fs = getCurrentFuncStack(this);
        
        if (fs)
            fs.retVal = value_;
        else
            log("[Construct 2] '"+ this.type.name +"' Namespace object: used 'Set return value' when not in a function call. Tried to return: " + value_, "warn");
    };
    
    pluginProto.acts = new Acts();

    //////////////////////////////////////
    // Expressions
    function Exps() {};

    Exps.prototype.ReturnValue = function (ret)
    {
        // The previous function has already popped - so check one level up the function stack
        var fs = getOneAboveFuncStack(this);
        
        if (fs)
            ret.set_any(fs.retVal);
        else
            ret.set_int(0);
    };
    
    Exps.prototype.ParamCount = function (ret)
    {
        var fs = getCurrentFuncStack(this);
        
        if (fs)
            ret.set_int(fs.params.length);
        else
        {
            log("[Construct 2] '"+ this.type.name +"' Namespace object: used 'ParamCount' expression when not in a function call", "warn");
            ret.set_int(0);
        }
    };
    
    Exps.prototype.Param = function (ret, index_)
    {
        index_ = cr.floor(index_);
        var fs = getCurrentFuncStack(this);
        
        if (fs)
        {
            if (index_ >= 0 && index_ < fs.params.length)
            {
                ret.set_any(fs.params[index_]);
            }
            else
            {
                log("[Construct 2] '"+ this.type.name +"' Namespace object: in function '" + fs.name + "', accessed parameter out of bounds (accessed index " + index_ + ", " + fs.params.length + " params available)", "warn");
                ret.set_int(0);
            }
        }
        else
        {
            log("[Construct 2] '"+ this.type.name +"' Namespace object: used 'Param' expression when not in a function call", "warn");
            ret.set_int(0);
        }
    };
    
    Exps.prototype.Call = function (ret, name_)
    {
        var fs = pushFuncStack(this);
        fs.name = name_.toLowerCase();
        fs.retVal = 0;
        
        // Copy rest of parameters from arguments
        fs.params.length = 0;
        var i, len;
        for (i = 2, len = arguments.length; i < len; i++)
            fs.params.push(arguments[i]);
        
        // Note: executing fast trigger path based on fs.name
        var ran = this.runtime.trigger(cr.plugins_.Namespace.prototype.cnds.OnNamespace, this, fs.name);
        
        // In preview mode, log to the console if nothing was triggered
        if (isInPreview && !ran)
        {
            log("[Construct 2] '"+ this.type.name +"' Namespace object: expression Namespace.Call('" + name_ + "' ...) was used, but no event was triggered. Is the function call spelt incorrectly or no longer used?", "warn");
        }
        
        popFuncStack(this);

        ret.set_any(fs.retVal);
    };
    
    pluginProto.exps = new Exps();

}());