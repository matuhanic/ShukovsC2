function GetPluginSettings()
{
    return {
        "name":            "Namespace",
        "id":            "Namespace",
        "version":        "1.0.5",
        "description":    "Exactly like the core Function plugin, except that you can create more than one instance for namespacing purposes.",
        "author":        "Scott A",
        "help url":        "http://www.scirra.com/manual/149/function",
        "category":        "General",
        "type":            "object",            // not in layout
        "rotatable":    false,
        "flags":        pf_nosize
    };
};

//////////////////////////////////////////////////////////////
// Conditions
AddStringParam("Name", "The name of the namespace function that is being called.", "\"\"");
AddCondition(0,    cf_trigger | cf_fast_trigger, "On function", "Function", "On <b>{0}</b>", "Triggered when a namespaced function is called.", "OnNamespace");

AddNumberParam("Index", "Index of the parameter to compare.");
AddCmpParam("Comparison", "How to compare the namespace parameter.");
AddAnyTypeParam("Value", "The value to compare to.");
AddCondition(1, cf_none, "Compare parameter", "Function", "Parameter {0} {1} {2}", "Compare the value of a parameter in a namespaced function call.", "CompareParam");

//////////////////////////////////////////////////////////////
// Actions
AddStringParam("Name", "The name of the namespace to call.", "\"\"");
AddVariadicParams("Parameter {n}", "A parameter to pass for the namespace call, which can be accessed with Namespace.Param({n}).");
AddAction(0, 0, "Call function", "Function", "Call <b>{0}</b> (<i>{...}</i>)", "Call a namespaced function, running its 'On function' event.", "CallNamespace");

AddAnyTypeParam("Value", "A number or some text to return from the namespace call.");
AddAction(1, 0, "Set return value", "Function", "Set return value to <b>{0}</b>", "In an 'On function' event, set the return value.", "SetReturnValue");

//////////////////////////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_any, "", "Function", "ReturnValue", "Get the value set by 'Set return value'.");

AddExpression(1, ef_return_number, "", "Function", "ParamCount", "Get the number of parameters passed to this namespaced function.");

AddNumberParam("Index", "The zero-based index of the parameter to get.");
AddExpression(2, ef_return_any, "", "Function", "Param", "Get the value of a parameter passed to the namespaced function.");

AddStringParam("Name", "The name of the namespace function to call.");
AddExpression(3, ef_return_any | ef_variadic_parameters, "", "Function", "Call", "Call a namespaced function with parameters and return its return value.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
    ];
    
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
    return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
    assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
    return new IDEInstance(instance, this);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
    assert2(this instanceof arguments.callee, "Constructor called as a function");
    
    // Save the constructor parameters
    this.instance = instance;
    this.type = type;
    
    // Set the default property values from the property table
    this.properties = {};
    
    for (var i = 0; i < property_list.length; i++)
        this.properties[property_list[i].name] = property_list[i].initial_value;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
    
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
}
