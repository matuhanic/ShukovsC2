// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.BHT_MIDI = function (runtime)
{
	this.runtime = runtime;
};

(function ()
{
    var pluginProto = cr.plugins_.BHT_MIDI.prototype;
		
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

	var thisInstance = null;
	var useOgg = true;
	var instanceAudioPlugin = null;

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;

		thisInstance = this;
		
		// any other properties you need, e.g...
		assert2(cr.plugins_.Audio != null, "The 'BHT MIDI' plugin requires the 'Audio' plugin.");

        // Stolen from Audio plugin
		if (this.runtime.isDirectCanvas)
		    useOgg = this.runtime.isAndroid;		// AAC on iOS, OGG on Android
		else
		{
		    // The canPlayType() call mysteriously sometimes throws a 'not implemented' exception
		    // on IE for Windows 8 apps.  Let's just ignore that if it happens.
		    try
		    {
		        useOgg = !!(new Audio().canPlayType('audio/ogg; codecs="vorbis"'));
		    }
		    catch (e)
		    {
		        useOgg = false;
		    }
		}
		if (useOgg)
		{
		    ///console.log("BHT_MIDI using OGG");
		}
		else
		{
		    ///console.log("BHT_MIDI using M4A");
		}
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
	    this.prop_PlayerBufferSize = this.properties[0];
	    this.prop_NoteOffDecay = this.properties[1];
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

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

    // Triggers
	Cnds.prototype.OnInterfaceLoaded = function ()
	{
	    ///console.log("OnInterfaceLoaded");
	    return true;
	}
	Cnds.prototype.OnFileLoaded = function ()
	{
	    ///console.log("OnFileLoaded");
	    return true;
	}

    // Condition/state
	Cnds.prototype.IsPlaying = function ()
	{
	    return MIDI.Player.playing > 0;
	}

	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.LoadInterfaceByIndex = function (interfaceIndex, deviceIndex)
	{
	    ///console.log("LoadInterfaceByIndex");

	    // Check that the Audio plugin exists.
	    if (cr.plugins_.Audio != null)
	    {
	        var callFnc = cr.plugins_.Audio.prototype.acts.PlayByName;

	        var name, plugin;
	        var runtimeTypes = thisInstance.runtime.types;
	        for (name in runtimeTypes)
	        {
	            plugin = runtimeTypes[name];
	            if (plugin.plugin.acts.PlayByName == callFnc)
	            {
	                instanceAudioPlugin = plugin.instances[0];
	            }
	        }
	    }
	    switch (interfaceIndex)
	    {
	        case 0:
	            BHTMIDILoad();
	            window.setTimeout(function () { onMIDIInterfaceLoaded(); }, 1)
	            break;

	        case 1:
	            MIDI.loadPlugin(
                {
                    api: kInterface_WEBMIDI,
                    soundfontUrl: "./",
                    //instrument: "acoustic_grand_piano",
                    callback: onMIDIInterfaceLoaded,
                    outputIndex: deviceIndex
                });
	            break;
	    }
	}
	
	Acts.prototype.SetVolume = function (channel, volume)
	{
	    ///console.log("SetVolume(" + channel + "," + volume + ")");
	    MIDI.setVolume(channel, volume);
	}

	Acts.prototype.NoteOn = function (channel, note, velocity, delay)
	{
	    var date = new Date();
	    ///console.log(date + "," + date.getMilliseconds());
	    ///console.log("NoteOn("+channel+","+note+","+velocity+","+delay+")");
	    MIDI.noteOn(channel, note, Math.min(127, velocity), delay);
	}

	Acts.prototype.NoteOff = function (channel, note, delay)
	{
	    var date = new Date();
	    ///console.log(date + "," + date.getMilliseconds());
	    ///console.log("NoteOff(" + channel + "," + note + "," + delay + ")");
	    MIDI.noteOff(channel, note, delay);
	}

	Acts.prototype.KeyOn = function (channel, key, velocity, delay)
	{
	    ///console.log("KeyOn("+channel+","+key+","+velocity+","+delay+")");
	    MIDI.noteOn(channel, MIDI.keyToNote[key], Math.min(127, velocity), delay);
	}

	Acts.prototype.KeyOff = function (channel, key, delay)
	{
	    ///console.log("KeyOff("+channel+","+key+","+delay+")");
	    MIDI.noteOff(channel, MIDI.keyToNote[key], delay);
	}

	Acts.prototype.NoteChordOnByString = function (channel, chord, velocity, delay)
	{
	    ///console.log("NoteChordOnByString");
	    var midiChord = new Array();
	    var parts = chord.split(",");
	    for (var n = 0, length = parts.length; n < length; n++)
	    {
	        midiChord[n] = parts[n];
	    }
	    MIDI.chordOn(channel, midiChord, Math.min(127, velocity), delay);
	}

	Acts.prototype.NoteChordOffByString = function (channel, chord, delay)
	{
	    ///console.log("NoteChordOffByString");
	    var midiChord = new Array();
	    var parts = chord.split(",");
	    for (var n = 0, length = parts.length; n < length; n++)
	    {
	        midiChord[n] = parts[n];
	    }
	    MIDI.chordOff(channel, midiChord, delay);
	}

	Acts.prototype.KeyChordOnByString = function (channel, chord, velocity, delay)
	{
	    ///console.log("KeyChordOnByString");
	    var midiChord = new Array();
	    var parts = chord.split(",");
	    for (var n = 0, length = parts.length; n < length; n++)
	    {
	        midiChord[n] = MIDI.keyToNote[parts[n]];
	    }
	    MIDI.chordOn(channel, midiChord, Math.min(127, velocity), delay);
	}

	Acts.prototype.KeyChordOffByString = function (channel, chord, delay)
	{
	    ///console.log("KeyChordOffByString");
	    var midiChord = new Array();
	    var parts = chord.split(",");
	    for (var n = 0, length = parts.length; n < length; n++)
	    {
	        midiChord[n] = MIDI.keyToNote[parts[n]];
	    }
	    MIDI.chordOff(channel, midiChord, delay);
	}

    //
    // MIDI Player
	Acts.prototype.PlayerLoadFile = function (filename)
	{
	    if (filename.length > 0)
	    {
	        MIDI.Player.loadFile(filename, onMIDIFileLoaded);
	    }
	    else
	    {
	        ///console.log("PlayerLoadFile(): No file name provided");
	    }
	}

	Acts.prototype.PlayerStart = function (looping)
	{
	    if (MIDI.api == kInterface_C2MIDI)
	    {
	        // Reset the on/off counters.
	        for (var chnl = 0; chnl < 16; chnl++)
	        {
	            for (var i = 0; i <= 108; i++)
	            {
	                NextTagByIndex[chnl][i] = CurrentTagByIndex[chnl][i] = 0;
	            }
	        }
	    }
	    if (looping)
	    {
	        MIDI.Player.clearAnimation();
	        MIDI.Player.setAnimation(AnimationCallback);
	    }
	    MIDI.Player.start();
	}

	Acts.prototype.PlayerResume = function ()
	{
	    MIDI.Player.resume();
	}

	Acts.prototype.PlayerPause = function ()
	{
	    MIDI.Player.pause();
	    if (MIDI.api == kInterface_C2MIDI)
	    {
	        // Reset the on/off counters.
	        for (var chnl = 0; chnl < 16; chnl++)
	        {
	            for (var i = 0; i <= 108; i++)
	            {
	                NextTagByIndex[chnl][i] = CurrentTagByIndex[chnl][i] = 0;
	            }
	        }
	    }
	}

	Acts.prototype.PlayerStop = function ()
	{
	    ///console.log(new Date() + ": STOP");
	    MIDI.Player.stop();
	    MIDI.Player.clearAnimation();

	    MIDI.stopAllNotes();
	}

	Acts.prototype.PlayerLoadBase64File = function (data)
	{
	    MIDI.Player.loadFile(data, onMIDIFileLoaded);
	}

	var _official_fnobj;
	var callbackListener = null;
	Acts.prototype.PlayerAddListener = function (callbackName)
	{
	    assert2(cr.plugins_.Function != null, "The 'BHT MIDI' plugin requires the 'Function' plugin.");

	    // Check that the Function plugin exists.
	    if (cr.plugins_.Function != null)
	    {
	        var callFnc = cr.plugins_.Function.prototype.acts.CallFunction;

	        var name, plugin;
	        var runtimeTypes = thisInstance.runtime.types;
	        for (name in runtimeTypes)
	        {
	            plugin = runtimeTypes[name];
	            if (plugin.plugin.acts.CallFunction == callFnc)
	            {
	                _official_fnobj = plugin.instances[0];

	                callbackListener = callbackName;
	                MIDI.Player.addListener(BHTMIDIListenerCallback);
	            }
	        }
	    }
	}

	Acts.prototype.PlayerRemoveListener = function (callbackName)
	{
	    callbackListener = null;
	}

    // gmindex: 0-127
    // prefix: file name prefix for this soundfont
    // volume: master volume for the instrument, to allow mixing sounds of different levels
    // numberedNaming: 0 if string name, 1 if number name
    // knownNotesFromUser: this formatted list of note/key names
	Acts.prototype.AssignInstrument = function (gmindex, prefix, volume, numberedNaming, knownNotesFromUser)
	{
	    ///console.log("MIDIAssignInstrument(" + gmindex + "," + prefix + "," + volume + "," + numberedNaming + ",[" + knownNotesFromUser + "])");
	    C2InstrumentMap[gmindex] = { Prefix: prefix, Volume: volume, NumName: numberedNaming };

	    // This is a map we use to get from known notes to pitched notes.
	    // If the note exists, the offset is 0 (zero).
	    // We set all zeros first, then run an algorithm to calculate the offset to the closest known note.
	    // We can then calculate the frequency multiplier to get the note we need.
	    var noteMap = new Array();
	    var knownNotes = new Array();
	    var knownIndex = 0;

	    var lowestKnownNote = 128;
	    var highestKnownNote = -1;

	    // Break up the knownNotesFromUser into comma separated sections.
	    var curNote = 0;
	    var fileName;
	    var sections = knownNotesFromUser.split(",");
	    for (var i = 0; i < sections.length; i++)
	    {
	        ///console.log("S:" + sections[i]);
	        var range = sections[i].split("-");
	        var rangeStart = 0;
	        var rangeEnd = 0;
	        if (range.length == 2 || range.length == 1)
	        {
	            if (numberedNaming)
	            {
	                rangeStart = parseInt(range[0]);
	                if (range.length == 2)
	                {
	                    rangeEnd = parseInt(range[1]);
	                }
	                else
	                {
	                    rangeEnd = rangeStart;
	                }
	            }
	            else
	            {
	                rangeStart = MIDI.keyToNote[range[0]];
	                if (range.length == 2)
	                {
	                    rangeEnd = MIDI.keyToNote[range[1]];
	                }
	                else
	                {
	                    rangeEnd = rangeStart;
	                }
	            }

	            for (var j = rangeStart; j <= rangeEnd; j++)
	            {
	                ///console.log("R:" + j);
	                if (numberedNaming)
	                {
	                    curNote = j;
	                    fileName = pad(curNote, 3);
	                }
	                else
	                {
	                    curNote = j;
	                    fileName = MIDI.noteToKey[curNote];
	                }
	                ///console.log("R:" + j + " (" + curNote + ")");

	                var src = this.runtime.files_subfolder + prefix + fileName + (useOgg ? ".ogg" : ".m4a");

	                if (BHTMIDIFileExists(src))
	                {
	                    cr.plugins_.Audio.prototype.acts.PreloadByName.apply(instanceAudioPlugin, ["", prefix + fileName]);
	                    if (curNote < lowestKnownNote)
	                    {
	                        lowestKnownNote = curNote;
	                    }
	                    if (curNote > highestKnownNote)
	                    {
	                        highestKnownNote = curNote;
	                    }
	                    ///console.log("File FOUND: " + prefix + fileName);

	                    // Store offset from known note to 0, as there is no offset.
	                    noteMap[curNote] = { Offset: 0 }
	                    knownNotes[knownIndex++] = curNote;
	                }
	                else
	                {
	                    ///console.log("File not found: " + prefix + fileName);
	                }
	            }
	        }
	    }

	    // First, go down from the lowest known note
	    for (var i = lowestKnownNote - 1; i >= 0; i--)
	    {
	        noteMap[i] = { Offset: lowestKnownNote - i };	// positive to go up to get note
	    }
	    // Now do the other end
	    for (var i = highestKnownNote + 1; i < 128; i++)
	    {
	        noteMap[i] = { Offset: highestKnownNote - i };	// negative to go down
	    }

	    var prevKnown = knownNotes[0];

	    for (var i = 1; i < knownNotes.length; i++)
	    {
	        var diff = (knownNotes[i] - prevKnown) - 1;
	        var goUp = Math.ceil(diff / 2);
	        var goDown = diff - goUp;

	        for (var j = prevKnown + 1; j <= prevKnown + goDown; j++)
	        {
	            noteMap[j] = { Offset: prevKnown - j };
	        }
	        for (var j = knownNotes[i] - 1; j >= knownNotes[i] - goUp; j--)
	        {
	            noteMap[j] = { Offset: knownNotes[i] - j };
	        }
	        prevKnown = knownNotes[i];
	    }
	    C2InstrumentMap[gmindex].NoteMap = noteMap;
	    ///console.log("");
	}

	Acts.prototype.AssignDrumKit = function (index, prefix, volume, numberedNaming, knownNotesFromUser)
	{
	    C2DrumMap[index] = { Prefix: prefix, Volume: volume, NumName: numberedNaming };
	    C2DrumMap[index].NoteMap = ProcessKnownNotes(this.runtime, useOgg, prefix, numberedNaming, knownNotesFromUser, false);
	}

	function ProcessKnownNotes(thisRuntime, useOgg, prefix, numberedNaming, knownNotesFromUser, fillInTheBlanks)
	{
	    // This is a map we use to get from known notes to pitched notes.
	    // If the note exists, the offset is 0 (zero).
	    // We set all zeros first, then run an algorithm to calculate the offset to the closest known note.
	    // We can then calculate the frequency multiplier to get the note we need.
	    var noteMap = new Array();
	    var knownNotes = new Array();
	    var knownIndex = 0;

	    var lowestKnownNote = 128;
	    var highestKnownNote = -1;

	    // Break up the knownNotesFromUser into comma separated sections.
	    var curNote = 0;
	    var fileName;
	    var sections = knownNotesFromUser.split(",");
	    for (var i = 0; i < sections.length; i++)
	    {
	        ///console.log("S:" + sections[i]);
	        var range = sections[i].split("-");
	        var rangeStart = 0;
	        var rangeEnd = 0;
	        if (range.length == 2 || range.length == 1)
	        {
	            if (numberedNaming)
	            {
	                rangeStart = parseInt(range[0]);
	                if (range.length == 2)
	                {
	                    rangeEnd = parseInt(range[1]);
	                }
	                else
	                {
	                    rangeEnd = rangeStart;
	                }
	            }
	            else
	            {
	                rangeStart = MIDI.keyToNote[range[0]];
	                if (range.length == 2)
	                {
	                    rangeEnd = MIDI.keyToNote[range[1]];
	                }
	                else
	                {
	                    rangeEnd = rangeStart;
	                }
	            }

	            for (var j = rangeStart; j <= rangeEnd; j++)
	            {
	                ///console.log("R:" + j);
	                if (numberedNaming)
	                {
	                    curNote = j;
	                    fileName = pad(curNote, 3);
	                }
	                else
	                {
	                    curNote = j;
	                    fileName = MIDI.noteToKey[curNote];
	                }
	                ///console.log("R:" + j + " (" + curNote + ")");

	                var src = thisRuntime.files_subfolder + prefix + fileName + (useOgg ? ".ogg" : ".m4a");

	                if (BHTMIDIFileExists(src))
	                {
	                    cr.plugins_.Audio.prototype.acts.PreloadByName.apply(instanceAudioPlugin, ["", prefix + fileName]);
	                    if (curNote < lowestKnownNote)
	                    {
	                        lowestKnownNote = curNote;
	                    }
	                    if (curNote > highestKnownNote)
	                    {
	                        highestKnownNote = curNote;
	                    }
	                    ///console.log("File FOUND: " + prefix + fileName);

	                    // Store offset from known note to 0, as there is no offset.
	                    noteMap[curNote] = { Offset: 0 }
	                    knownNotes[knownIndex++] = curNote;
	                }
	                else
	                {
	                    ///console.log("File not found: " + prefix + fileName);
	                }
	            }
	        }
	    }

	    if (fillInTheBlanks)
	    {
	        // First, go down from the lowest known note
	        for (var i = lowestKnownNote - 1; i >= 0; i--)
	        {
	            noteMap[i] = { Offset: lowestKnownNote - i };	// positive to go up to get note
	        }
	        // Now do the other end
	        for (var i = highestKnownNote + 1; i < 128; i++)
	        {
	            noteMap[i] = { Offset: highestKnownNote - i };	// negative to go down
	        }

	        var prevKnown = knownNotes[0];

	        for (var i = 1; i < knownNotes.length; i++)
	        {
	            var diff = (knownNotes[i] - prevKnown) - 1;
	            var goUp = Math.ceil(diff / 2);
	            var goDown = diff - goUp;

	            for (var j = prevKnown + 1; j <= prevKnown + goDown; j++)
	            {
	                noteMap[j] = { Offset: prevKnown - j };
	            }
	            for (var j = knownNotes[i] - 1; j >= knownNotes[i] - goUp; j--)
	            {
	                noteMap[j] = { Offset: knownNotes[i] - j };
	            }
	            prevKnown = knownNotes[i];
	        }
	    }

	    return noteMap;
	}

	Acts.prototype.ProgramChange = function (channel, patch)
	{
	    MIDI.programChange(channel, patch);
	}

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.CurrentTime = function (ret)
	{
	    ret.set_float(MIDI.Player.currentTime);
	}
	Exps.prototype.EndTime = function (ret)
	{
	    ret.set_float(MIDI.Player.endTime);
	}
	Exps.prototype.IsPlaying = function (ret)
	{
	    ret.set_int(MIDI.Player.playing ? 1 : 0);
	}

	Exps.prototype.KeyToNote = function (ret, key)
	{
	    // I allow for 0x00-0x14 as undefined, but I'll limit the range to the internal range of: A0-C8 (0x15-0x6C).
	    var parts = key.split("");
	    ret.set_int(MIDI.keyToNote[key]);
	}

	Exps.prototype.NoteToKey = function (ret, note)
	{
	    // I allow for 0x00-0x14 as undefined, but I'll limit the range to the internal range of: A0-C8 (0x15-0x6C) (21-108).
	    if (note >= 0x15 && note <= 0x6C)
	    {
	        ret.set_string(MIDI.noteToKey[note]);
	    }
	    else
	    {
	        ret.set_string("");
	    }
	}

	Exps.prototype.GetInputs = function (ret)
	{
	    if (MIDI.getInput !== "undefined")
	    {
	        var input = MIDI.getInput();
	        if (input.length > 0)
	        {
	            var port = input[0];
	            ret.set_string(port.name);
	        }
	        else
	        {
	            ret.set_string("");
	        }
	    }
	    else
	    {
	        ret.set_string("");
	    }
	}
	Exps.prototype.GetOutputs = function (ret)
	{
	    if (MIDI.getOutputs !== "undefined")
	    {
	        var list = "";
	        var outputs = MIDI.getOutputs();
	        for (var i = 0; i < outputs.length; i++)
	        {
	            list += outputs[i].name;
	            list += ";";
	        }
	        ret.set_string(list);
	    }
	    else
	    {
	        ret.set_string("");
	    }
	}

	Exps.prototype.InterfaceSupported = function (ret, interfaceName)
	{
	    ret.set_int(0);

	    if (interfaceName.toLowerCase() == kInterface_WEBMIDI)
	    {
	        if (navigator.requestMIDIAccess)
	        {
	            if (TestJAZZ())
	            {
	                ret.set_int(1);
	            }
	        }
	    }
	    else if (interfaceName.toLowerCase() == kInterface_C2MIDI)
	    {
	        ret.set_int(1);
	    }
	}

	function TestJAZZ()
	{
	    // load the Jazz plugin
	    var o1 = document.createElement("object");
	    o1.style.cssText = "top: -500px; position: absolute;";
	    o1.id = "_Jazz" + Math.random() + "ie";
	    o1.classid = "CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90";

	    var activeX = o1;

	    var o2 = document.createElement("object");
	    o2.id = "_Jazz" + Math.random;
	    o2.type = "audio/x-jazz";
	    o1.appendChild(o2);

	    var objRef = o2;
	    var e = document.createElement("p");
	    e.appendChild(document.createTextNode("This page requires the "));

	    var a = document.createElement("a");
	    a.appendChild(document.createTextNode("Jazz plugin"));
	    a.href = "http://jazz-soft.net/";

	    e.appendChild(a);
	    e.appendChild(document.createTextNode("."));
	    o2.appendChild(e);

	    var insertionPoint = document.getElementById("MIDIPlugin");
	    if (!insertionPoint)
	        insertionPoint = document.body;
	    insertionPoint.appendChild(o1);

	    if (objRef.isJazz)
	        return true;
	    else if (activeX.isJazz)
	        return true;
	    else
	        return false;
    }

	Exps.prototype.CurrentInterface = function (ret)
	{
	    ret.set_string(MIDI.api);
	}

	Exps.prototype.Tempo = function (ret)
	{
	    ret.set_int(120);

	    if (typeof (MIDI.metadata) !== "undefined")
	    {
	        if (typeof (MIDI.metadata.tempo) !== "undefined")
	        {
	            ret.set_int(60000000 / MIDI.metadata.tempo.microsecondsPerBeat);
	        }
	    }
	}

	pluginProto.exps = new Exps();

    //////////////////////////////////////
    // Outside of the C2 plugin prototype.
    //

	var kInterface_C2MIDI = "c2midi";
	var kInterface_WEBMIDI = "webmidi";

	var kDrumChannel = 9;	// Refered as Channel 10, when starting at channel 1!

	var C2InstrumentMap = new Array();
	var C2DrumMap = new Array();

	var NextTagByIndex = new Array();
	var CurrentTagByIndex = new Array();

	function onMIDIInterfaceLoaded()
	{
	    ///console.log("onMIDIInterfaceLoaded()");
	    MIDI.eventBlockSize = thisInstance.prop_PlayerBufferSize;

	    thisInstance.runtime.trigger(pluginProto.cnds.OnInterfaceLoaded, thisInstance);
	}

    /*
        This is called when a MIDI file has finished loading. Retrieve any META data we need.
    */
	function onMIDIFileLoaded() //in_data)  // we are passed the raw data, but since it's already been parsed, there's not much we can do with it. Ignoring for now.
	{
	    ///console.log("onMIDIFileLoaded()");
	    MIDI.metadata = {};
	    for (var i = 0; i < MIDI.Player.data.length; i++)
	    {
	        var event = MIDI.Player.data[i][0].event;
	        if (event.type == "meta")
	        {
	            if (event.subtype == "timeSignature")
	            {
	                MIDI.metadata.timeSignature = event;
	            }
	            else if (event.subtype == "setTempo")
	            {
	                MIDI.metadata.tempo = event;
	            }
	        }
	    }
	    thisInstance.runtime.trigger(pluginProto.cnds.OnFileLoaded, thisInstance);
	}

	function BHTMIDILoad()
	{
	    MIDI.api = kInterface_C2MIDI;

	    MIDI.setVolume = function (channel, volume) { MIDI.channels[channel].volume = volume; };

	    MIDI.programChange = function (channel, patch)
	    {
	        ///console.log("programChange: ch=" + channel + " p=" + patch);
	        if (channel >= 0 && channel <= 15)
	        {
	            MIDI.channels[channel].instrument = 0;

	            if (patch >= 0 && patch <= 127)
	            {
	                MIDI.channels[channel].instrument = patch;
	            }
	        }
	    };

	    MIDI.noteOn = function (channel, note, velocity, delay) { return MIDINoteOn(channel, note, velocity, delay); };

	    MIDI.noteOff = function (channel, note, delay) { return MIDINoteOff(channel, note, delay, 1); };

	    MIDI.chordOn = function (channel, chord, velocity, delay) { MIDIChordOn(channel, chord, velocity, delay); };
	    MIDI.chordOff = function (channel, chord, delay) { MIDIChordOff(channel, chord, delay); };
	    MIDI.stopAllNotes = function () { MIDIStopAllNotes(); };
	    MIDI.getInput = function () { return {}; };
	    MIDI.getOutputs = function () { return {}; };

	    for (var chnl = 0; chnl < 16; chnl++)
	    {
	        NextTagByIndex[chnl] = [];
	        CurrentTagByIndex[chnl] = [];

	        for (var i = 0; i <= 108; i++)
	        {
	            NextTagByIndex[chnl][i] = 0;
	            CurrentTagByIndex[chnl][i] = 0;
	        }
	    }

	    for (var i = 0; i < 127; i++)
	    {
	        C2InstrumentMap[i] = { Prefix: "" };
	        C2DrumMap[i] = { Prefix: "" };
	    }

	    // Add volume to the channel. Default to 127.
	    for (var i = 0; i < 16; i++)
	    {
	        MIDI.channels[i].volume = 127;
	    }
	}

	function BHTMIDIListenerCallback(data)
	{
	    if (callbackListener != null)
	    {
	        //	console.log("ListenerCallback:"+data.message+","+data.channel+","+data.note);
	        var params = [data.now, data.channel, data.message, MIDI.noteToKey[data.note], data.note, data.velocity];
	        cr.plugins_.Function.prototype.acts.CallFunction.call(_official_fnobj, callbackListener, params);
	    }
	}

	function BHTMIDIFileExists(url)
	{
	    var http = new XMLHttpRequest();
	    http.open('HEAD', url, false);
	    http.send();
	    return http.status != 404;
	}

	function ChannelToPatch(channel)
	{
	    return channel == kDrumChannel ? C2DrumMap[MIDI.channels[channel].instrument] : C2InstrumentMap[MIDI.channels[channel].instrument];
	}

    // Need to clean this up - ActualMIDI_NOTE_On()
	function MIDINoteOn(channel, note, velocity, delay)
	{
	    var key = MIDI.noteToKey[note];
	    var tagOffset = NextTagByIndex[channel][note];
	    NextTagByIndex[channel][note]++;

	    if (delay > 0)
	    {
	        return window.setTimeout(function () { ActualMIDIKeyOn(channel, key, velocity, tagOffset) }, delay * 1000);
	    }
	    else
	    {
	        ActualMIDIKeyOn(channel, key, velocity, tagOffset);
	    }
	}

	function MIDINoteOff(channel, note, delay)
	{
	    //	console.log("MIDINoteOff("+channel+","+note+","+delay+")");
	    var key = MIDI.noteToKey[note];
	    var extraHold = 0.0;
	    // Note: we need the event triggered immediately. We are faking a sustain, which we don't want to show.
	    if (delay > 0)
	    {
	        return window.setTimeout(function () { MIDINoteOff(channel, note, -1) }, (delay + extraHold) * 1000);
	    }
	    else if (delay == 0)
	    {
	        return window.setTimeout(function () { MIDINoteOff(channel, note, -1) }, extraHold * 1000);
	        DirectMIDIPlayerCallback({ message: 128, now: 0, end: 0, channel: channel, note: note, velocity: 0 });
	    }
	    else
	    {
	        var tagOffset = CurrentTagByIndex[channel][note];
	        var fullTag = BuildFullTagName(channel, key, tagOffset);
	        CurrentTagByIndex[channel][note]++;
	        if (CurrentTagByIndex[channel][note] > NextTagByIndex[channel][note])
	        {
	            ///console.log("CTBI>NTBI-MIDIKeyOff(" + key + "," + tagOffset + "," + CurrentTagByIndex[channel][note] + "," + fullTag + ")");
	            CurrentTagByIndex[channel][note] = NextTagByIndex[channel][note];
	            return;
	        }
	        if (!cr.plugins_.Audio.prototype.cnds.IsTagPlaying.apply(instanceAudioPlugin, [fullTag]))
	        {
	            ///console.log("stop:TAG not found:" + key + "_" + tagOffset + ":NT=" + NextTagByIndex[channel][note] + ",CT=" + CurrentTagByIndex[channel][note]);
	            // Is there a next note - we may have missed the OFF event.
	            if (NextTagByIndex[channel][note] > CurrentTagByIndex[channel][note])
	            {
	                CurrentTagByIndex[channel][note]++;
	                if (cr.plugins_.Audio.prototype.cnds.IsTagPlaying.apply(instanceAudioPlugin, [fullTag]))
	                {
	                    //console.log("corrected-MIDIKeyOff["+key+","+tagOffset+","+key+"_"+(tagOffset+1)+"]");
	                    DecayedMIDIKeyOff(channel, key, 0, tagOffset);
	                }
	            }
	        }
	        else
	        {
	            DecayedMIDIKeyOff(channel, key, 0, tagOffset);
	        }
	    }
	}

	function MIDIChordOn(channel, chord, velocity, delay)
	{
	    for (var n = 0, length = chord.length; n < length; n++)
	    {
	        MIDINoteOn(channel, chord[n], velocity, delay);
	    }
	}

	function MIDIChordOff(channel, chord, delay)
	{
	    for (var n = 0, length = chord.length; n < length; n++)
	    {
	        MIDINoteOff(channel, chord[n], delay);
	    }
	}

	function MIDIStopAllNotes()
	{
	    var fullTag = "";
		var origKey = 0;
	    for (var chnl = 0; chnl < 16; chnl++)
	    {
	        for (var n = 0; n < CurrentTagByIndex[chnl].length; n++)
	        {
	            if (NextTagByIndex[chnl][n] > CurrentTagByIndex[chnl][n])
	            {
	                origKey = MIDI.noteToKey[n];
					fullTag = BuildFullTagName(chnl, origKey, CurrentTagByIndex[chnl][n]);
					//console.log("STOP: " + fullTag);
	                cr.plugins_.Audio.prototype.acts.Stop.apply(instanceAudioPlugin, [fullTag]);
	            }
	        }
	    }
	}

	function ActualMIDIKeyOn(channel, key, velocity, tagOffset)
	{
	    var patch = ChannelToPatch(channel);
	    var origKey = key;
	    //console.log("ActualMIDIKeyOn("+channel+","+key+","+tagOffset+", -> "+key+"_"+tagOffset+",fp:"+fromPlayer+")");
	    var adjustedVolume = Math.max(0,Math.min(127, (velocity * patch.Volume * MIDI.channels[channel].volume) / 16129));
	    var volumeDB = linearToDb(adjustedVolume / 127);    // 0 to 1.0
	    //console.log("ActualMIDIKeyOn(" + channel + "," + key + "," + adjustedVolume + ")");

	    var note = MIDI.keyToNote[key];

	    var rate = 0;
	    if (channel == kDrumChannel)
	    {
	        //console.log("DRUM:ActualMIDIKeyOn(" + channel + "," + key + "," + note + ")");
	    }
	    else
	    {
	        if (typeof (patch.NoteMap[note]) == 'undefined')
	        {
	            ///console.log("ERROR: note does not exist: " + note + ". Ch=" + channel + ", key=" + key);
	            return;
	        }

	        var baseKey = note + patch.NoteMap[note].Offset;

	        // This sound does not exist.
	        if (baseKey != note)
	        {
	            rate = Math.pow(Math.pow(2, 1 / 12), note - baseKey);
	            key = MIDI.noteToKey[baseKey];
	        }
	    }
	    var fullKey = BuildKeyName(channel, key);
	    var fullTag = BuildFullTagName(channel, origKey, tagOffset);
	    cr.plugins_.Audio.prototype.acts.PlayByName.apply(instanceAudioPlugin, [0, fullKey, 0, volumeDB, fullTag]);
	    if (rate != 0)
	    {
	        cr.plugins_.Audio.prototype.acts.SetPlaybackRate(fullTag, rate);
	        //console.log("Just played: " + fullKey + " with rate " + rate + " for " + origKey + " with tag=" + fullTag);
	    }
	    else
	    {
	        //		console.log("Just played: " + fullKey + " with rate " + rate + " for " + origKey + " with tag=" + fullTag);
	    }
	}

	function DecayedMIDIKeyOff(channel, key, velocity, tagOffset)
	{
	    var noteOffDecay = thisInstance.prop_NoteOffDecay;

	    var fullTag = BuildFullTagName(channel, key, tagOffset);
	    // Need a gain effect on the note/sound.
	    cr.plugins_.Audio.prototype.acts.AddGainEffect.apply(instanceAudioPlugin, [fullTag, 0]);

	    // SetEffectParameter = function (tag, index, param, value, ramp, time)
	    cr.plugins_.Audio.prototype.acts.SetEffectParameter.apply(instanceAudioPlugin, [fullTag, 0, 4, -60, 1, noteOffDecay]);

	    // Actually turn off the note/sound just after fade-out/decay.
	    window.setTimeout(function () { ActualMIDIKeyOff(channel, key, -1, tagOffset) }, (noteOffDecay + 0.05) * 1000);
	}

	function ActualMIDIKeyOff(channel, key, velocity, tagOffset)
	{
	    //		console.log("ActualMIDIKeyOff:" + channel+","+key+","+velocity+","+tagOffset + " -> " + key+"_"+tagOffset);
	    var fullTag = BuildFullTagName(channel, key, tagOffset);
	    cr.plugins_.Audio.prototype.acts.RemoveEffects.apply(instanceAudioPlugin, [fullTag]);
	    cr.plugins_.Audio.prototype.acts.Stop.apply(instanceAudioPlugin, [fullTag]);
	    //		console.log("Just stopped: " + key + " with tag=" + fullTag);
	}

	function BuildKeyName(channel, key)
	{
	    if (channel == kDrumChannel)
	    {
	        var patch = ChannelToPatch(channel);

	        if (patch.Prefix.length > 0)
	        {
	            if (patch.NumName)
	            {
	                key = pad(MIDI.keyToNote[key], 3);
	            }
	            return patch.Prefix + key;
	        }
	        return key;
	    }
	    else
	    {
	        //var patch = ChannelToPatch(channel);

	        if (C2InstrumentMap[MIDI.channels[channel].instrument].Prefix.length > 0)
	        {
	            if (C2InstrumentMap[MIDI.channels[channel].instrument].NumName)
	            {
	                key = pad(MIDI.keyToNote[key], 3);
	            }
	            return C2InstrumentMap[MIDI.channels[channel].instrument].Prefix + key;
	        }
	        return key;
	    }
	}

	function BuildFullTagName(channel, key, tagOffset)
	{
	    return BuildKeyName(channel, key) + "_" + tagOffset;
	}
	
	function AnimationCallback(data)
	{
//	console.log("AC:" + data.now +","+data.end + "   " + Math.abs(data.now - data.end)*1000);
		if(data.now > data.end || Math.abs(data.now - data.end)*1000 < 5)
		{
			MIDI.Player.stop();
			MIDI.Player.start();
		}
		else
		{
			return;
		}
		if(data.events != null)
		{
			for (var key in data.events)
			{
				var keyData = data.events[key];
				console.log("AC[]:"+key+",m="+keyData.message+",c="+keyData.channel+",n="+keyData.note);
			}
		}
	}

	function pad(num, size)
	{
	    var s = "000000000" + num;
	    return s.substr(s.length - size);
	}

    // Stolen from Audio plugin.
	function dbToLinear(x)
	{
	    var v = dbToLinear_nocap(x);
	    if (v < 0)
	        v = 0;
	    if (v > 1)
	        v = 1;
	    return v;
	};

	function linearToDb(x)
	{
	    if (x < 0)
	        x = 0;
	    if (x > 1)
	        x = 1;
	    return linearToDb_nocap(x);
	};

	function dbToLinear_nocap(x)
	{
	    return Math.pow(10, x / 20);
	};

	function linearToDb_nocap(x)
	{
	    return (Math.log(x) / Math.log(10)) * 20;
	};

}());