// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

//cranberrygame start
//cranberrygame end

/*
//cranberrygame start: structure
cr.plugins_.Windows8Ext = function(runtime)
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
cr.plugins_.Windows8Ext = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Windows8Ext.prototype;
		
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
		var exist=false;
		for(var i=0;i<scripts.length;i++){
			//alert(scripts[i].src);//http://localhost:50000/jquery-2.0.0.min.js
			if(scripts[i].src.indexOf("cordova.js")!=-1||scripts[i].src.indexOf("phonegap.js")!=-1){
				exist=true;
				break;
			}
		}
		if(!exist){
			var newScriptTag=document.createElement("script");
			newScriptTag.setAttribute("type","text/javascript");
			newScriptTag.setAttribute("src", "cordova.js");
			document.getElementsByTagName("head")[0].appendChild(newScriptTag);
		}
*/		
//cranberrygame start
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

//cranberrygame start
function Language(defaultLanguage){
		//https://groups.google.com/forum/#!msg/phonegap/EkCyEBO8Dj4/SRPak1gT4XgJ
		
		var mat;
		var language="";
		//temp=navigator.language;
		//code=temp.substr(0,2); //error: always return en
		if(mat = navigator.userAgent.match(/bada.*\W(\w\w)-(\w\w)\W/i)){ //bada
			language=mat[1];
		}
		//temp=navigator.language;
		//code=temp.substr(0,2); //error: always return en
		else if(mat = navigator.userAgent.match(/blackberry.*\W(\w\w)-(\w\w)\W/i)){ //blackberry blackberry
			language=mat[1];
		}
		else{
			language="";
		}

		//if(!language){
		//if(language==null){
		if(language==""){
			var temp;
			if (navigator.language) { //non-IE: ios (en-US) , blackberry playbook (en-US) , qt (en-US) , webos (en_US)
					temp = navigator.language; 
			} else if (navigator.browserLanguage) { //IE, windows-phone-8,windows-phone-7 (en-US)
					temp = navigator.browserLanguage;
			} else if (navigator.userLanguage) { //IE, windows8 not complete
					temp = navigator.userLanguage;
			} else if (navigator.systemLanguage) { //IE
					temp = navigator.systemLanguage;
			}

			language=temp.substr(0,2);
		}
		
		if (typeof WinJS!="undefined") {//windows8
			//var languages = Windows.System.UserProfile.GlobalizationPreferences.languages;//minifiy error//http://www.scirra.com/forum/error-related-with-png-recompression-option_topic74728.html
      																								   //http://www.scirra.com/forum/plugin-developers-please-test-with-the-minifier_topic45502_page1.html 
			var languages = Windows["System"]["UserProfile"]["GlobalizationPreferences"]["languages"]; //http://msdn.microsoft.com/en-us/library/windows/apps/windows.system.userprofile.globalizationpreferences.languages.aspx
      																								   //http://kraigbrockschmidt.com/blog/?p=841
      																								   //http://stackoverflow.com/questions/2678230/how-to-getting-browser-current-locale-preference-using-javascript
			language=languages[0].substr(0,2);
			//console.log(code);
		}
		else if ((typeof pokki != "undefined") || (navigator.userAgent.indexOf("NodeWebkit")!=-1)){
			language="";
		}		        
		
		if (language==""){
			languageIsDetected=false;
			//language="en";
			language=defaultLanguage;
			//alert(defaultLanguage);
		}		
		        
		return language
}

function getAboutTitle(){
    var lan = Language("en");

	var title="About";

	if (lan=="af"){
		title="Oor";
	}
	else if (lan=="ar"){
		title="حول";
	}
	else if (lan=="az"){
		title="Haqqında";
	}
	else if (lan=="be"){
		title="аб";
	}
	else if (lan=="bg"){
		title="за";
	}
	else if (lan=="ca"){
		title="Sobre";
	}
	else if (lan=="cs"){
		title="O";
	}
	else if (lan=="da"){
		title="Om";
	}
	else if (lan=="de"){
		title="über";
	}
	else if (lan=="el"){
		title="περίπου";
	}
	else if (lan=="en"){
		title="About";
	}
	else if (lan=="es"){
		title="Acerca De";
	}
	else if (lan=="et"){
		title="Kohta";
	}
	else if (lan=="eu"){
		title="Buruz";
	}
	else if (lan=="fa"){
		title="در حدود";
	}
	else if (lan=="fi"){
		title="Noin";
	}
	else if (lan=="fr"){
		title="Sur";
	}
	else if (lan=="ga"){
		title="Faoi";
	}
	else if (lan=="gl"){
		title="Sobre";
	}
	else if (lan=="hi"){
		title="के बारे में";
	}
	else if (lan=="hr"){
		title="Oko";
	}
	else if (lan=="hu"){
		title="Körülbelül";
	}
	else if (lan=="id"){
		title="Tentang";
	}
	else if (lan=="it"){
		title="Circa";
	}
	else if (lan=="iw"){
		title="על";
	}
	else if (lan=="ja"){
		title="約";
	}
	else if (lan=="ko"){
		title="대하여";
	}
	else if (lan=="lt"){
		title="Apie";
	}
	else if (lan=="lv"){
		title="Par";
	}
	else if (lan=="mk"){
		title="за";
	}
	else if (lan=="ms"){
		title="Kira-kira";
	}
	else if (lan=="nl"){
		title="Over";
	}
	else if (lan=="no"){
		title="Om";
	}
	else if (lan=="pl"){
		title="O";
	}
	else if (lan=="pt"){
		title="Sobre";
	}
	else if (lan=="ro"){
		title="Despre";
	}
	else if (lan=="ru"){
		title="о";
	}
	else if (lan=="sk"){
		title="O";
	}
	else if (lan=="sl"){
		title="O";
	}
	else if (lan=="sq"){
		title="Për";
	}
	else if (lan=="sr"){
		title="око";
	}
	else if (lan=="sv"){
		title="Ca";
	}
	else if (lan=="sw"){
		title="Kuhusu";
	}
	else if (lan=="th"){
		title="เกี่ยวกับ";
	}
	else if (lan=="tr"){
		title="Hakkında";
	}
	else if (lan=="uk"){
		title="про";
	}
	else if (lan=="vi"){
		title="Về";
	}
	else if (lan=="zh"){
		title="关于";
	}
	else if (lan=="zh-tw"){
		title="關於";
	}
	else if (lan=="zu"){
		title="Mayelana";
	}
	
	return title;
}

function getSupportTitle(){
    var lan = Language("en");

	var title="Support";

	if (lan=="af"){
		title="Ondersteuning";
	}
	else if (lan=="ar"){
		title="دعم";
	}
	else if (lan=="az"){
		title="Dəstək";
	}
	else if (lan=="be"){
		title="падтрымка";
	}
	else if (lan=="bg"){
		title="подкрепа";
	}
	else if (lan=="ca"){
		title="Suport";
	}
	else if (lan=="cs"){
		title="Podpora";
	}
	else if (lan=="da"){
		title="Støtte";
	}
	else if (lan=="de"){
		title="Unterstützung";
	}
	else if (lan=="el"){
		title="υποστήριξη";
	}
	else if (lan=="en"){
		title="Support";
	}
	else if (lan=="es"){
		title="Apoyo";
	}
	else if (lan=="et"){
		title="Toetus";
	}
	else if (lan=="eu"){
		title="Laguntza";
	}
	else if (lan=="fa"){
		title="پشتیبانی";
	}
	else if (lan=="fi"){
		title="Tuki";
	}
	else if (lan=="fr"){
		title="Soutien";
	}
	else if (lan=="ga"){
		title="Tacaíocht";
	}
	else if (lan=="gl"){
		title="Apoio";
	}
	else if (lan=="hi"){
		title="समर्थन";
	}
	else if (lan=="hr"){
		title="Podrška";
	}
	else if (lan=="hu"){
		title="Támogatás";
	}
	else if (lan=="id"){
		title="Mendukung";
	}
	else if (lan=="it"){
		title="Supporto";
	}
	else if (lan=="iw"){
		title="תמיכה";
	}
	else if (lan=="ja"){
		title="サポート";
	}
	else if (lan=="ko"){
		title="지원";
	}
	else if (lan=="lt"){
		title="Parama";
	}
	else if (lan=="lv"){
		title="Atbalsts";
	}
	else if (lan=="mk"){
		title="поддршка";
	}
	else if (lan=="ms"){
		title="Sokongan";
	}
	else if (lan=="nl"){
		title="Ondersteuning";
	}
	else if (lan=="no"){
		title="Støtte";
	}
	else if (lan=="pl"){
		title="Wsparcie";
	}
	else if (lan=="pt"){
		title="Apoio";
	}
	else if (lan=="ro"){
		title="Suport";
	}
	else if (lan=="ru"){
		title="поддержка";
	}
	else if (lan=="sk"){
		title="Podpora";
	}
	else if (lan=="sl"){
		title="Podpora";
	}
	else if (lan=="sq"){
		title="Mbështetje";
	}
	else if (lan=="sr"){
		title="подршка";
	}
	else if (lan=="sv"){
		title="Stöd";
	}
	else if (lan=="sw"){
		title="Msaada";
	}
	else if (lan=="th"){
		title="สนับสนุน";
	}
	else if (lan=="tr"){
		title="Destek";
	}
	else if (lan=="uk"){
		title="підтримка";
	}
	else if (lan=="vi"){
		title="Hỗ Trợ";
	}
	else if (lan=="zh"){
		title="支持";
	}
	else if (lan=="zh-tw"){
		title="支持";
	}
	else if (lan=="zu"){
		title="Support";
	}
	
	return title;
}

function getPrivacyTitle(){

    var lan = Language("en");

	var title="Privacy Policy";

	if (lan=="af"){
		title="Privaatheid Beleid";
	}
	else if (lan=="ar"){
		title="سياسة الخصوصية";
	}
	else if (lan=="az"){
		title="Məxfilik Siyasəti";
	}
	else if (lan=="be"){
		title="палітыка прыватнасці";
	}
	else if (lan=="bg"){
		title="политика за поверителност";
	}
	else if (lan=="ca"){
		title="Política De Privacitat";
	}
	else if (lan=="cs"){
		title="Zásady Ochrany Osobních údajů";
	}
	else if (lan=="da"){
		title="Fortrolighedspolitik";
	}
	else if (lan=="de"){
		title="Datenschutzrichtlinie";
	}
	else if (lan=="el"){
		title="πολιτική προστασίας προσωπικών δεδομένων";
	}
	else if (lan=="en"){
		title="Privacy Policy";
	}
	else if (lan=="es"){
		title="Política De Privacidad";
	}
	else if (lan=="et"){
		title="Privaatsus";
	}
	else if (lan=="eu"){
		title="Pribatutasun Politika";
	}
	else if (lan=="fa"){
		title="سیاست حفظ حریم خصوصی";
	}
	else if (lan=="fi"){
		title="Yksityisyyden Suoja";
	}
	else if (lan=="fr"){
		title="Politique De Confidentialité";
	}
	else if (lan=="ga"){
		title="Polasaí Príobháideachta";
	}
	else if (lan=="gl"){
		title="Política De Privacidade";
	}
	else if (lan=="hi"){
		title="गोपनीयता नीति";
	}
	else if (lan=="hr"){
		title="Pravila O Privatnosti";
	}
	else if (lan=="hu"){
		title="Adatvédelmi Nyilatkozat";
	}
	else if (lan=="id"){
		title="Kebijakan Privasi";
	}
	else if (lan=="it"){
		title="Privacy Policy";
	}
	else if (lan=="iw"){
		title="מדיניות פרטיות";
	}
	else if (lan=="ja"){
		title="個人情報保護方針";
	}
	else if (lan=="ko"){
		title="개인 정보 취급 방침";
	}
	else if (lan=="lt"){
		title="Privatumo Politika";
	}
	else if (lan=="lv"){
		title="Privātuma Politika";
	}
	else if (lan=="mk"){
		title="Политика за приватност";
	}
	else if (lan=="ms"){
		title="Dasar Privasi";
	}
	else if (lan=="nl"){
		title="Privacybeleid";
	}
	else if (lan=="no"){
		title="Personvern";
	}
	else if (lan=="pl"){
		title="Polityka Prywatności";
	}
	else if (lan=="pt"){
		title="Política De Privacidade";
	}
	else if (lan=="ro"){
		title="Politica De Confidențialitate";
	}
	else if (lan=="ru"){
		title="политика конфиденциальности";
	}
	else if (lan=="sk"){
		title="Zásady Ochrany Osobných údajov";
	}
	else if (lan=="sl"){
		title="Politika Zasebnosti";
	}
	else if (lan=="sq"){
		title="Privacy Policy";
	}
	else if (lan=="sr"){
		title="Политика приватности";
	}
	else if (lan=="sv"){
		title="Integritetspolicy";
	}
	else if (lan=="sw"){
		title="Sera Ya Faragha";
	}
	else if (lan=="th"){
		title="นโยบายความเป็นส่วนตัว";
	}
	else if (lan=="tr"){
		title="Gizlilik Politikası";
	}
	else if (lan=="uk"){
		title="політика конфіденційності";
	}
	else if (lan=="vi"){
		title="Chính Sách Bảo Mật";
	}
	else if (lan=="zh"){
		title="隐私政策";
	}
	else if (lan=="zh-tw"){
		title="隱私政策";
	}
	else if (lan=="zu"){
		title="Inqubomgomo Yemfihlo";
	}
	
	return title;
}

//cranberrygame end
	
	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		
/*
		var self=this;
		window.addEventListener("resize", function () {//cranberrygame
			self.runtime.trigger(cr.plugins_.Windows8Ext.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isWindows8App))
			return;
			
		this.showAbout = (this.properties[0] !== 0);
		//this.showPreferences = (this.properties[1] !== 0);
		this.showSupport = (this.properties[1] !== 0);
		this.showPrivacy = (this.properties[2] !== 0);
		
		var self = this;
		
		var winStore = Windows["ApplicationModel"]["Store"];
		
		// Settings charm event
		if (this.showAbout || this.showSupport || this.showPrivacy)
		{
			WinJS["Application"].addEventListener("settings", function (e) {
				var cmds = {};
				
				if (self.showAbout)
					//cmds["about"] = { "title": "About", "href": "/about.html" };
					cmds["about"] = { "title": "About", "href": "/www/about.html" };
				//if (self.showPreferences)
				//	cmds["preferences"] = { "title": "Preferences", "href": "/#prefs" };
				if (self.showSupport)
					//cmds["support"] = { "title": "Support", "href": "/support.html" };
					cmds["support"] = { "title": "Support", "href": "/www/support.html" };
				if (self.showPrivacy){
					//cmds["privacy"] = { "title": "Privacy Policy", "href": "/privacy.html" };
					//cmds["privacy"] = { "title": getPrivacyTitle(), "href": "/privacy.html" };
					cmds["privacy"] = { "title": getPrivacyTitle(), "href": "/www/privacy.html" };
				}
				
				e["detail"]["applicationcommands"] = cmds;
				WinJS["UI"]["SettingsFlyout"]["populateSettings"](e);
			});
		}
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
		self.runtime.trigger(cr.plugins_.Windows8Ext.prototype.cnds.TriggerCondition, self);	
	};	
*/
	
//cranberrygame start
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
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());