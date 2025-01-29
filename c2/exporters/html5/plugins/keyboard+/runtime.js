// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.KeyboardPlus = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.KeyboardPlus.prototype;
		
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
		
		this._keysDownByString = new Set;
		this._keysDownByWhich = new Set;
		this._triggerWhich = 0;
		this._triggerString = "";
		this._triggerTypedKey = "";
		this.keydowncheck = false;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function()
	{
		var self = this;
		
		// Bind keyboard events via jQuery.  Not supported in directCanvas
		if (!this.runtime.isDomFree)
		{
			jQuery(document).keydown(
				function(info) {
					self.onKeyDown(info);
				}
			);
			
			jQuery(document).keyup(
				function(info) {
					self.onKeyUp(info);
				}
			);
		}
	};
	
	// On iframe embedded games like the Scirra Arcade, these keys can end up
	// scrolling the parent page unless we specifically block them every time.
	var keysToBlockWhenFramed = [32, 33, 34, 35, 36, 37, 38, 39, 40, 44];

	instanceProto.onKeyDown = function (a)
	{
		var alreadyPreventedDefault = false;
		
		// Always block certain key presses in frames which can result in page scrolling.
		if (window != window.top && keysToBlockWhenFramed.indexOf(a.which) > -1)
		{
			a.preventDefault();
			alreadyPreventedDefault = true;
			a.stopPropagation();
		}
		
		const b = a["which"]
          , c = a["code"] || b.toString()
          , d = a["key"];
        this._keysDownByString.has(c) || (this._keysDownByString.add(c),
        this._keysDownByWhich.add(b),
        this._triggerString = c,
        this._triggerWhich = b,
        this._triggerTypedKey = d,
		this.keydowncheck = true,
		this.runtime.isInUserInputEvent = true,
		this.runtime.trigger(cr.plugins_.KeyboardPlus.prototype.cnds.OnAnyKey, this),
		this.runtime.trigger(cr.plugins_.KeyboardPlus.prototype.cnds.OnKey, this),
		this.runtime.trigger(cr.plugins_.KeyboardPlus.prototype.cnds.OnLeftRightKey, this), // + Pressed
		this.runtime.trigger(cr.plugins_.KeyboardPlus.prototype.cnds.OnKeyCode, this),
		this.runtime.isInUserInputEvent = false)
		
		// If any event ran, prevent the default behavior.  This does not include 'on any key' running though.
		/* if (eventRan || eventRan2)
		{
			// this.usedKeys[info.which] = true;
			
			if (!alreadyPreventedDefault)
				info.preventDefault();
		} */
	};

	instanceProto.onKeyUp = function (a)
	{	
		const b = a["which"]
          , c = a["code"] || b.toString()
          , d = a["key"];
        this._keysDownByString.delete(c),
        this._keysDownByWhich.delete(b),
        this._triggerString = c,
        this._triggerWhich = b,
        this._triggerTypedKey = d,
		this.keydowncheck = false,
		this.runtime.isInUserInputEvent = true,
		this.runtime.trigger(cr.plugins_.KeyboardPlus.prototype.cnds.OnAnyKeyReleased, this),
		this.runtime.trigger(cr.plugins_.KeyboardPlus.prototype.cnds.OnKeyReleased, this),
		this.runtime.trigger(cr.plugins_.KeyboardPlus.prototype.cnds.OnLeftRightKeyReleased, this),
		this.runtime.trigger(cr.plugins_.KeyboardPlus.prototype.cnds.OnKeyCodeReleased, this),
		this.runtime.isInUserInputEvent = false
	};
	
	instanceProto.onWindowBlur = function ()
	{
		for (const a of this._keysDownByWhich)
            this._keysDownByWhich.delete(a),
            this._triggerWhich = a,
			this.runtime.trigger(cr.plugins_.KeyboardPlus.prototype.cnds.OnAnyKeyReleased, this),
			this.runtime.trigger(cr.plugins_.KeyboardPlus.prototype.cnds.OnKeyReleased, this),
			this.runtime.trigger(cr.plugins_.KeyboardPlus.prototype.cnds.OnKeyCodeReleased, this);
        this._keysDownByString.clear()
	};
	
	instanceProto.IsKeyDown = function (a) 
	{
        return this._keysDownByString.has(a);
    }
	
	instanceProto.IsKeyDown2 = function (b)
	{
		const c = a();
        if ("string" == typeof b)
            return c.IsKeyDown(b);
        if ("number" == typeof b)
            return c.IsKeyCodeDown(b);
        throw new TypeError("expected string or number")
	}
	
    instanceProto.IsKeyCodeDown = function (a) 
	{
        return this._keysDownByWhich.has(a);
    }
	
	instanceProto.saveToJSON = function ()
	{
		return { "triggerWhich": this._triggerWhich };
		return { "triggerTypedKey": this._triggerTypedKey };
	};
	
	instanceProto.loadFromJSON = function (o)
	{
		this._triggerWhich = o["triggerWhich"];
        o.hasOwnProperty("triggerTypedKey") && (this._triggerTypedKey = o["triggerTypedKey"]);
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": "Keyboard",
			"properties": [
				{"name": "Last key code", "value": this._triggerWhich, "readonly": true},
				{"name": "Last key string", "value": "'" + fixedStringFromCharCode(this._triggerWhich) + "'", "readonly": true},
				{"name": "Last typed key", "value": this._triggerTypedKey, "readonly": true}
			]	
		});
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	const a = ["ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight", "AltLeft", "AltRight", "MetaLeft", "MetaRight"];
	
	Cnds.prototype.IsKeyDown = function(a)
	{
		return this._keysDownByWhich.has(a);
	};
	
	Cnds.prototype.OnKey = function(a)
	{
		return this._triggerWhich === a;
	};
	
	Cnds.prototype.OnAnyKey = function(a)
	{
		return true;
	};
	
	Cnds.prototype.OnAnyKeyReleased = function(a)
	{
		return true;
	};
	
	Cnds.prototype.IsAnyKeyDown = function(a)
	{
		if (this.keydowncheck === true)
			return true;
		else
			return false;
	};
	
	Cnds.prototype.OnKeyReleased = function(a)
	{
		return this._triggerWhich === a;
	};
	
	Cnds.prototype.IsKeyCodeDown = function(a)
	{
		a = Math.floor(a);
		return this._keysDownByWhich.has(a);
	};
	
	Cnds.prototype.OnKeyCode = function(a)
	{
		return this._triggerWhich === a;
	};
	
	Cnds.prototype.OnKeyCodeReleased = function(a)
	{
		return this._triggerWhich === a;
	};
	
	Cnds.prototype.OnLeftRightKey = function(b)
	{
		const c = a[b];
        return this._triggerString === c;
	};
	
	Cnds.prototype.OnLeftRightKeyReleased = function(b)
	{
		const c = a[b];
        return this._triggerString === c;
	};
	
	Cnds.prototype.LeftRightIsKeyDown = function(b)
	{
		const c = a[b];
        return this._keysDownByString.has(c);
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.LastKeyCode = function (ret)
	{
		ret.set_int(this._triggerWhich);
	};
	
	// Turns out Javascript's fromCharCode is nearly totally useless. Fix it with our own function.
	function fixedStringFromCharCode(kc)
	{
		kc = Math.floor(kc);
		// 8 === a ? "backspace" : 9 === a ? "tab" : 13 === a ? "enter" : 16 === a ? "shift" : 17 === a ? "control" : 18 === a ? "alt" : 19 === a ? "pause" : 20 === a ? "capslock" : 27 === a ? "esc" : 33 === a ? "pageup" : 34 === a ? "pagedown" : 35 === a ? "end" : 36 === a ? "home" : 37 === a ? "\u2190" : 38 === a ? "\u2191" : 39 === a ? "\u2192" : 40 === a ? "\u2193" : 45 === a ? "insert" : 46 === a ? "del" : 91 === a ? "left window key" : 92 === a ? "right window key" : 93 === a ? "select" : 96 === a ? "numpad 0" : 97 === a ? "numpad 1" : 98 === a ? "numpad 2" : 99 === a ? "numpad 3" : 100 === a ? "numpad 4" : 101 === a ? "numpad 5" : 102 === a ? "numpad 6" : 103 === a ? "numpad 7" : 104 === a ? "numpad 8" : 105 === a ? "numpad 9" : 106 === a ? "numpad *" : 107 === a ? "numpad +" : 109 === a ? "numpad -" : 110 === a ? "numpad ." : 111 === a ? "numpad /" : 112 === a ? "F1" : 113 === a ? "F2" : 114 === a ? "F3" : 115 === a ? "F4" : 116 === a ? "F5" : 117 === a ? "F6" : 118 === a ? "F7" : 119 === a ? "F8" : 120 === a ? "F9" : 121 === a ? "F10" : 122 === a ? "F11" : 123 === a ? "F12" : 144 === a ? "numlock" : 145 === a ? "scroll lock" : 186 === a ? ";" : 187 === a ? "=" : 188 === a ? "," : 189 === a ? "-" : 190 === a ? "." : 191 === a ? "/" : 192 === a ? "'" : 219 === a ? "[" : 220 === a ? "\\" : 221 === a ? "]" : 222 === a ? "#" : 223 === a ? "`" : String.fromCharCode(a)
		
		// Alphanumerics work with fromCharCode, so just special case every other key
		switch (kc) {
		case 8:		return "backspace";
		case 9:		return "tab";
		case 13:	return "enter";
		case 16:	return "shift";
		case 17:	return "control";
		case 18:	return "alt";
		case 19:	return "pause";
		case 20:	return "capslock";
		case 27:	return "esc";
		case 33:	return "pageup";
		case 34:	return "pagedown";
		case 35:	return "end";
		case 36:	return "home";
		case 37:	return "←";
		case 38:	return "↑";
		case 39:	return "→";
		case 40:	return "↓";
		case 45:	return "insert";
		case 46:	return "del";
		case 91:	return "left window key";
		case 92:	return "right window key";
		case 93:	return "select";
		case 96:	return "numpad 0";
		case 97:	return "numpad 1";
		case 98:	return "numpad 2";
		case 99:	return "numpad 3";
		case 100:	return "numpad 4";
		case 101:	return "numpad 5";
		case 102:	return "numpad 6";
		case 103:	return "numpad 7";
		case 104:	return "numpad 8";
		case 105:	return "numpad 9";
		case 106:	return "numpad *";
		case 107:	return "numpad +";
		case 109:	return "numpad -";
		case 110:	return "numpad .";
		case 111:	return "numpad /";
		case 112:	return "F1";
		case 113:	return "F2";
		case 114:	return "F3";
		case 115:	return "F4";
		case 116:	return "F5";
		case 117:	return "F6";
		case 118:	return "F7";
		case 119:	return "F8";
		case 120:	return "F9";
		case 121:	return "F10";
		case 122:	return "F11";
		case 123:	return "F12";
		case 144:	return "numlock";
		case 145:	return "scroll lock";
		case 186:	return ";";
		case 187:	return "=";
		case 188:	return ",";
		case 189:	return "-";
		case 190:	return ".";
		case 191:	return "/";
		case 192:	return "'";
		case 219:	return "[";
		case 220:	return "\\";
		case 221:	return "]";
		case 222:	return "#";
		case 223:	return "`";
		default:	return String.fromCharCode(kc);
		}
	};
	
	Exps.prototype.StringFromKeyCode = function (ret, kc)
	{
		ret.set_string(fixedStringFromCharCode(kc));
	};
	
	Exps.prototype.TypedKey = function(ret)
	{
		ret.set_string(this._triggerTypedKey);
	};
	
	pluginProto.exps = new Exps();

}());