// ECMAScript 5
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Класс Behavior
// *** ПОМЕНЯЙТЕ BEHAVIOR ID ЗДЕСЬ *** - это "id" из параметров поведения в "edittime.js"
//           vvvvvvvvvv
cr.behaviors.hp = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	//                  *** ПОМЕНЯЙТЕ BEHAVIOR ID ЗДЕСЬ *** - это "id" из параметров поведения в "edittime.js"
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.hp.prototype;


	/////////////////////////////////////
	// Класс, тип свойства.
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;

    // Вызывается после завершения инициализации типа.
	behtypeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Экземпляр класса Behavior.
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
        this.inst = inst;				// экземпляр объекта содержащего ваш Behavior.
		this.runtime = type.runtime;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		// Загрузка свойств.
		this.hp = this.properties[0];
		this.maxHp = this.properties[1];
		
		// Здесь должны быть созданы все свойства, которые вам когда-либо понадобятся. Пример:
		// this.myValue = 0;
	};
	
	behinstProto.onDestroy = function ()
	{
		// Вызывается после разрушения. (On destroy).
		// Обратите внимание, что среда выполнения может работать с объектами и поведениями после их разрушения.
		// освободить, перезапустить или сбросить любые ссылки - можно здесь. При необходимости.
	};
	
	// Вызывается при сохранении состояния.
	behinstProto.saveToJSON = function ()
	{
		// Возвращает объект, содержащий информацию о состоянии вашего Behavior в формате JSON.
		// Обратите внимание! Вы ДОЛЖНЫ использовать такой синтаксис что бы не сломать всё к чертям.
		return {
			// Пример:
			"myValue1": this.myValue1 , // Обратите внимание! Параметры пишутся через запятую.
            "myValue2": this.myValue2
		};
	};
	
	// Вызывается при загрузке состояния.
	behinstProto.loadFromJSON = function (o)
	{
        // Загружает объект "o", содержащий информацию о состоянии вашего Behavior в формате JSON.
		// "o"  Это список сохранённых параметров. Что бы достать параметр обратитесь по имени.
        // Пример:
        this.myValue1 = o["myValue1"];
        this.myValue2 = o["myValue2"];
		// Обратите внимание! Вы ДОЛЖНЫ использовать такой синтаксис что бы не сломать всё к чертям.
	};

	behinstProto.tick = function ()
    {
        // Вызывается каждый тик. (Every tick)

        var dt = this.runtime.getDt(this.inst); // "dt" это количество времени, прошедшее с последнего тика.

	};

	behinstProto.getDebuggerValues = function (propsections)
	{
		// Это отображение для Debug.
		// Каждый раздел представляет собой объект из "заголовка" и "свойства".
		// "properties" - это массив (список) свойств для отображения.
		propsections.push({
			"title": this.type.name,
			"properties": [
                // Параметры свойств:
                // name     Обяз. парам.    Имя         Должно быть уникальным.
                // value    Обяз. парам.    Значение    Число, текст или флажок.
                // html     Не обяз.парам.  флажок      Установите true, чтобы интерпретировать имя и значение как строки HTML, а не как простой текст.
                // readonly Не обяз.парам.  флажок      Установите true, чтобы отключить редактирование свойства.

                // Добавление свойства:
                // { "name": "My property name", "value": this.myProperty }
                
                // Пример:
                { "name": "Debug property 1", "value": this.myProperty1 } , // Обратите внимание! Свойства пишутся через запятую
                { "name": "Debug property 2", "value": this.myProperty2 }
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		// Вызывается при изменении свойства

        // Параметры:
        // header   Заголовок
        // name     Имя свойства
        // value    Значение

		if (name === "Hp")
			this.hp = value;
	};

	//////////////////////////////////////
	// Условия
	function Cnds() {};

	// Пример добавления условий:
	Cnds.prototype.Alive = function () // Event1 это script_name.
	{
		if (this.hp > 0)
			return true;
		else
			return false;
    };
	
	Cnds.prototype.CompareHP = function (cmp, Value)
	{
		return cr.do_cmp(this.hp, cmp, Value);
	};
	
	Cnds.prototype.CompareMaxHP = function (cmp, Value)
	{
		return cr.do_cmp(this.maxHp, cmp, Value);
	};
	
	behaviorProto.cnds = new Cnds(); // Сохранение всех условий.

	//////////////////////////////////////
	// Действия
	function Acts() {};

	// Пример добавления действия:
    Acts.prototype.Kill = function () // Action1 это script_name.
	{
		this.hp = 0;
	};
	
	Acts.prototype.SetHP = function (Value) // Action1 это script_name.
	{
		this.hp = Value;
		
		if (this.hp > this.maxHp) {
			this.hp = this.maxHp;
		}
	};
	
	Acts.prototype.AddHP = function (Value) // Action1 это script_name.
	{
		this.hp = this.hp + Value;
		
		if (this.hp > this.maxHp) {
			this.hp = this.maxHp;
		}
	};
	
	Acts.prototype.SetMaxHP = function (Value) // Action1 это script_name.
	{
		this.maxHp = Value;
		
		if (this.hp > this.maxHp) {
			this.hp = this.maxHp;
		}
	};
	
	Acts.prototype.AddMaxHP = function (Value) // Action1 это script_name.
	{
		this.maxHp = this.maxHp + Value;
		
		if (this.hp > this.maxHp) {
			this.hp = this.maxHp;
		}
	};
	
	Acts.prototype.Heal = function () // Action1 это script_name.
	{
		this.hp = this.maxHp;
	};
	
	behaviorProto.acts = new Acts(); // Сохранение всех действий.

	//////////////////////////////////////
	// Выражения
	function Exps() {};

	// Пример добавления выражения:
    Exps.prototype.HP = function (ret)
    {
        // "ret" всегда должен быть первым параметром. Возвращайте результат выражения через него.

        // Пример возврата целого числа:
        ret.set_int(this.hp);			// Вернуть целое число.

        // Другие примеры:
		// ret.set_float(0.5);			// Вернуть не целое число.
		// ret.set_string("Hello");		// Вернуть текст.
		// ret.set_any("woo");			// Вернуть число или текст.
	};
	
	Exps.prototype.MaxHP = function (ret)
    {
        // "ret" всегда должен быть первым параметром. Возвращайте результат выражения через него.

        // Пример возврата целого числа:
        ret.set_int(this.maxHp);		// Вернуть целое число.

        // Другие примеры:
		// ret.set_float(0.5);			// Вернуть не целое число.
		// ret.set_string("Hello");		// Вернуть текст.
		// ret.set_any("woo");			// Вернуть число или текст.
	};
	
    behaviorProto.exps = new Exps(); // Сохранение всех выражений.
	
}());