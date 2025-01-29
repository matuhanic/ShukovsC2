// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.hmmg_CharacterGenerator = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.hmmg_CharacterGenerator.prototype;
		
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
		
		this.gender = this.properties[0] == 0 ? "male" : "female";
		this.hasMid = this.properties[1] == 0 ? false : true;
		
		switch(this.properties[2])
		{
			case 0 : this.type = "child";break;
			case 1 : this.type = "teen";break;
			case 2 : this.type = "adult";break;
			case 3 : this.type = "senior";break;
			default : this.type = "adult";break;
		}
		
		this.fullName       = chance.name({ middle: this.hasMid , gender: this.gender });	
		this.birthday 		 = chance.birthday({type: this.type, string: true , american: false });
		
		this.firstName 	= $.trim(this.fullName.split(" ")[0]);
		if( this.hasMid == true)
		{
			this.midName 	= $.trim(this.fullName.split(" ")[1]);
			this.lastName 	= $.trim(this.fullName.split(" ")[2]);
		}
		else
		{
			this.midName 	= "";
			this.lastName 	= $.trim(this.fullName.split(" ")[1]);
		}
		
		var thisDate 			= new Date(this.birthday.split("/")[2], this.birthday.split("/")[1] , this.birthday.split("/")[0], 0, 0, 0, 0); 
		var characterDate	= new Date();
		this.age = dateDiffInYears(thisDate, characterDate);
		
		
		
	};
	
	behinstProto.onDestroy = function ()
	{
		// called when associated object is being destroyed
		// note runtime may keep the object and behavior alive after this call for recycling;
		// release, recycle or reset any references here as necessary
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
	};

	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
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
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
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
	Cnds.prototype.hasMiddleName = function ()
	{
		if($.trim(this.midName).length >0)
			this.hasMid = true ;
		else
			this.hasMid = false;
		
		return this.hasMid;
	};
	Cnds.prototype.isMale = function ()
	{
		return this.gender == "male";
	};
	Cnds.prototype.isFemale = function ()
	{
		return this.gender == "female";
	};
	Cnds.prototype.isChild = function ()
	{
		return this.type == "child";
	};
	Cnds.prototype.isTeen = function ()
	{
		return this.type == "teen";
	};
	Cnds.prototype.isAdult = function ()
	{
		return this.type == "adult";
	};
	Cnds.prototype.isSenior = function ()
	{
		return this.type == "senior";
	};
	Cnds.prototype.isOlderThan = function (daya,montha,yeara)
	{
		var thisDate 			= new Date(this.birthday.split("/")[2], this.birthday.split("/")[1] , this.birthday.split("/")[0], 0, 0, 0, 0); 
		var characterDate	= new Date(yeara, montha , daya, 0, 0, 0, 0); 

		return characterDate > thisDate;
	};
	Cnds.prototype.isYoungerThan = function (daya,montha,yeara)
	{

		var thisDate 			= new Date(this.birthday.split("/")[2], this.birthday.split("/")[1] , this.birthday.split("/")[0], 0, 0, 0, 0); 
		var characterDate	= new Date(yeara, montha , daya, 0, 0, 0, 0); 

		return characterDate < thisDate;
	};
	
	// ... other conditions here ...
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.SetName = function (firstName,middleName,lastName)
	{
		this.firstName = firstName ;
		this.lastName = lastName ;
		if( $.trim(middleName).length > 0)
		{
			this.midName = middleName ;
			this.hasMid = true;
		}
		else
		{
			this.midName = "";
			this.hasMid = false;
		}
	};
	
	Acts.prototype.SetBirthday = function (day,month,year)
	{
		if( isDateValid(day+"/"+month+"/"+year) )
		{
			this.birthday = day+"/"+month+"/"+year ;
			var thisDate 			= new Date(this.birthday.split("/")[2], this.birthday.split("/")[1] , this.birthday.split("/")[0], 0, 0, 0, 0); 
			var characterDate	= new Date();
			this.age = dateDiffInYears(thisDate, characterDate);
		}
		else
		{
			alert("You did set a wrong Date , check your action's 'Set Birthday' parameters ");
		}
	};
	
	Acts.prototype.SetGender = function (gender)
	{
		(gender == 0) ? this.gender = "male" : this.gender = "female" ;
	};
	
	Acts.prototype.ReGenerateFullName = function ()	
	{
		this.fullName = chance.name({middle: this.hasMid, gender: this.gender });
		this.firstName 	= $.trim(this.fullName.split(" ")[0]);
		if( this.hasMid == true)
		{
			this.midName 	= $.trim(this.fullName.split(" ")[1]);
			this.lastName 	= $.trim(this.fullName.split(" ")[2]);
		}
		else
		{
			this.midName 	= "";
			this.lastName 	= $.trim(this.fullName.split(" ")[1]);
		}
	};
	

	Acts.prototype.ReGenerateFirstName = function ()	
	{
		this.firstName = chance.first({ gender: this.gender });
	};
	
	Acts.prototype.ReGenerateMiddleName = function ()	
	{
		this.midName = chance.first({ gender: this.gender });
	};
	
	Acts.prototype.ReGenerateLastName = function ()	
	{
		this.lastName = chance.last({ gender: this.gender });
	};
	
	Acts.prototype.ReGenerateBirthday = function ()	
	{
		this.birthday = chance.birthday({type: this.type, string: true , american: false });
	};
	
	
	
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	// the example expression
	Exps.prototype.FirstName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.firstName);				// return our value
	};
	Exps.prototype.MiddleName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.midName);				// return our value
	};
	Exps.prototype.LastName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.lastName);				// return our value
	};
	Exps.prototype.FullName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		if(this.hasMid)
			ret.set_string(this.firstName+" "+this.midName+" "+this.lastName);
		else
			ret.set_string(this.firstName+"  "+this.lastName);
	};
	Exps.prototype.Age = function (ret,toComapre)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		
		if(toComapre == "today")
		{
			var thisDate 			= new Date(this.birthday.split("/")[2], this.birthday.split("/")[1] , this.birthday.split("/")[0], 0, 0, 0, 0); 
			var characterDate	= new Date();
			this.age = dateDiffInYears(thisDate, characterDate);
			ret.set_int(this.age);
		}
		else if(isDateValid(toComapre))
		{
			var thisDate 			= new Date(this.birthday.split("/")[2], this.birthday.split("/")[1] , this.birthday.split("/")[0], 0, 0, 0, 0); 
			var characterDate	= new Date(toComapre.split("/")[2],toComapre.split("/")[1] , toComapre.split("/")[0], 0, 0, 0, 0); 
			this.age = dateDiffInYears(thisDate, characterDate);
			ret.set_int(this.age);
		}
		else
		{
			alert("Error , in expression CharacterGenerator.Age(parameter)   You have to write 'today' or a date like this Format '20/03/2015'   ");
		}
	};
	Exps.prototype.Birthday = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.birthday);
	};
	Exps.prototype.BirthdayYear = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(parseInt(this.birthday.split("/")[2]));
	};
	Exps.prototype.BirthdayMonth = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(parseInt(this.birthday.split("/")[1]));
	};
	Exps.prototype.BirthdayDay = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(parseInt(this.birthday.split("/")[0]));	
	};
	Exps.prototype.Gender = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.gender);	
	};
	Exps.prototype.Type = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		if(this.age)
		{
			if(1 <= this.age &&  this.age <= 12 )
				this.type = "child";
			else if(13 <= this.age &&  this.age <= 19 )
				this.type = "teen";
			else if(20 <= this.age &&  this.age <= 65 )
				this.type = "adult";
			else if(65 <= this.age &&  this.age <= 100 )
				this.type = "senior";
		}
		ret.set_string(this.type);	
	};

	
	
	
	
	
	
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	
	// ... other expressions here ...
	
	behaviorProto.exps = new Exps();
	
}());


function isDateValid(input)
{
	var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
	if(input)
	{		
		if (input.match(reg)) 
			return true
		else 
			return false;
	}
	else
		return false;
}

function dateDiffInYears(dateold, datenew) 
{
     var ynew = datenew.getFullYear();
     var mnew = datenew.getMonth();
     var dnew = datenew.getDate();
     var yold = dateold.getFullYear();
     var mold = dateold.getMonth();
     var dold = dateold.getDate();
     var diff = ynew - yold;
     if (mold > mnew)
		diff--;
     else 
	{
          if (mold == mnew) 
		{
               if (dold > dnew) 
				diff--;
          }
     }
     return diff;
}
	
	
	