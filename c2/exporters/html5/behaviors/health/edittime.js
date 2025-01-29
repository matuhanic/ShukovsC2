
// Внимание! Любой текст нужно писать  английскими буквами.

function GetBehaviorSettings() // Параметры поведения.
{
	return {
        "name": "Health",			        // Имя: отображается в окне "Add behavior".
        "id": "hp",			            // Пишется без пробелов. Изменяя здесь, не забудьте изменить и в "runtime.js".
        "version": "1.0",					    // (Число с точкой в формате х.у) Сonstruct 2 использует это для проверок совместимости.
        "description": "Allows you to add health to the object without instance variables. Also, this behavior can be used not only to add health.", // Описание.
		"author": "GameSoul",  // Автор.
        "help url": "http://www.google.com",    // Ссылка на сайт помощи.
        "category": "Attributes",				// Раздел в окне "Add behavior", например: Attributes, General и Movements. Можно написать свой и он будет добавлен.
        "flags": 0						        // Раскомментируйте строки для включения флагов. Убрав // и оставив | bf_onlyone.
					//	| bf_onlyone			// Может быть добавлен только один раз к объекту, например как "solid".
	};
};


//////////////////////////////////////// Параметры условий, действий и выражений.
// Параметры (Params).

// Параметры параметров:
// label                имя         Обяз. парам.    Пишется в кавычках.
// description          описание    Обяз. парам.    Пишется в кавычках.
// text                 текст       Обяз. парам.    Пишется в кавычках.
// initial_string       значение    Не обяз.парам.  Пишется в кавычках.
// initial_selection    выбор       Не обяз.парам.  Пишется целым числом.

// Добавление параметров:
// AddNumberParam(label, description, initial_string)			        // Число.
// AddStringParam(label, description, initial_string)		            // Текст.
// AddAnyTypeParam(label, description, initial_string)			        // Любой.
// AddCmpParam(label, description)										// Сравнение.
// AddComboParamOption(text)											// Заголовок выпадающего списка (Пишется перед элементами списка).
// AddComboParam(label, description, initial_selection)			        // Элемент выпадающего списка.
// AddObjectParam(label, description)									// Выбор объекта.
// AddLayerParam(label, description)									// Номер слоя или его имя (Layer).
// AddLayoutParam(label, description)									// Выбор макета (Layout).
// AddKeybParam(label, description)										// Выбор клавиши (Возвращает значение в VK формате. VK это виртуальный код клавиши).
// AddAudioFileParam(label, description)								// Выбор аудио файла.

// Пример 1: AddNumberParam("My NumParam", "Need to nothing", "12")     // Число под названием "My NumParam", описанием "Need to nothing" и значением 12.
// Пример 2: AddStringParam("My StrParam", "Need to nothing")           // Текст под названием "My StrParam", описанием "Need to nothing" и без начального значения.


// Параметры добавляются перед условиями, действиями или выражениями.

//////////////////////////////////////// Условия, а также их параметры.
// Условия (Conditions или Events).

// Параметры условий:
// id           Целое число. Должно быть уникальным для каждого условия.
// flags        Флаги. Пишутся через символ "|", который заменяет запятую. Список флагов:
//                  cf_none - ничего,
//                  cf_trigger - триггер,
//                  cf_fake_trigger - дэтриггер,
//                  cf_static - статичный,
//                  cf_looping - цикличный,
//                  cf_not_invertible - не инвертируется,
//                  cf_deprecated - возражает,
//                  cf_incompatible_with_triggers - несовместим с триггерами.
// list_name    Имя в окне "Add event".
// category     Раздел в окне "Add event". Новый или уже существующий.
// display_str  Отображение в "Event sheet". Используй для форматирования:
//                  {i} - для отображения параметров по индексу (i это индекс),
//                  <b>Любой текст</b> - для отображения жирного текста,
//                  <i>Любой текст</i> - для отображения курсивного текста,
//                  {my} - для отображения иконки и имени вашего "Behavior".
// description  Описание в окне "Add event".
// script_name  Имя в коде. Нужно в "runtime.js". Вводить без пробелов.

// Добавление условий:
// AddCondition(id, flags, list_name, category, display_str, description, script_name);

// Пример
AddCondition(0, cf_none, "Is alive", "", "{my} is alive", "True when the object is alive.", "Alive");

AddCmpParam("Comparison", "Choose the way to compare the current health.");
AddNumberParam("Value", "The health, to compare the current health to.");
AddCondition(1, 0, "Compare HP", "", "{my} HP {0} {1}", "", "CompareHP");

AddCmpParam("Comparison", "Choose the way to compare the current maximum health.");
AddNumberParam("Value", "The maximum health, to compare the current maximum health to.");
AddCondition(2, 0, "Compare Max HP", "", "Max {my} {0} {1}", "", "CompareMaxHP");

//////////////////////////////////////// Действия, а также их параметры.
// Действия (Action).

// Параметры действий:
// id           Целое число. Должно быть уникальным для каждого действия.
// flags        Флаги. Пишутся через символ "|", который заменяет запятую. Список флагов:
//                  af_none - ничего,
//                  af_deprecated - возражает.
// list_name    Имя в окне "Add action".
// category     Раздел в окне "Add action". Новый или уже существующий.
// display_str  Отображение в "Event sheet". Используй для форматирования:
//                  {i} - для отображения параметров по индексу (i это индекс),
//                  <b>Любой текст</b> - для отображения жирного текста,
//                  <i>Любой текст</i> - для отображения курсивного текста,
//                  {my} - для отображения иконки и имени вашего "Behavior".
// description  Описание в окне "Add action".
// script_name  Имя в коде. Нужно в "runtime.js". Вводить без пробелов.

// Добавление действия:
// AddAction(id, flags, list_name, category, display_str, description, script_name);

// Пример
AddAction(0, af_none, "Kill", "", "{my} Kill", "Kills an object.", "Kill");

AddNumberParam("Value", "", "1");
AddAction(1, af_none, "Set HP", "", "Set {my} to {0}", "Set the value of health.", "SetHP");

AddNumberParam("Value", "", "1");
AddAction(2, af_none, "Add HP", "", "Add {0} to {my}", "Add to the health value.", "AddHP");

AddNumberParam("Value", "", "1");
AddAction(3, af_none, "Set Max HP", "", "Set Max {my} to {0}", "Set the value of maximum health.", "SetMaxHP");

AddNumberParam("Value", "", "1");
AddAction(4, af_none, "Add Max HP", "", "Add {0} to Max {my}", "Add to the maximum health value.", "AddMaxHP");

AddAction(5, af_none, "Heal", "", "{my} Heal", "Heals an object.", "Heal");
// Добавление параметров такое же как у событий.


//////////////////////////////////////// Выражения, а также их параметры.
// Выражения (Expressions).

// Параметры выражений:
// id           Целое число. Должно быть уникальным для каждого выражения.
// flags        Флаги. Пишутся через символ "|", который заменяет запятую. Должен быть указан хотя бы один флаг с return. Список флагов:
//                  ef_none - ничего, 
//                  ef_deprecated - возражать, 
//                  ef_return_number - возврат числа, 
//                  ef_return_string - возврат текста,
//                  ef_return_any - возврат любого типа,
//                  ef_variadic_parameters - возврат массива параметров.
// list_name    Имя в окне выбора выражений.
// category     Раздел в окне выбора выражений. Новый или уже существующий.
// exp_name 	Имя в коде и "Event sheet". Нужно в "runtime.js". Вводить без пробелов.
// description  Описание в окне выбора выражений.

// Добавление выражения:
// AddExpression(id, flags, list_name, category, exp_name, description);

// Пример
AddExpression(0, ef_return_number, "HP", "", "HP", "Get the object's current health.");
AddExpression(1, ef_return_number, "MaxHP", "", "MaxHP", "Get the object's current maximum health.");


////////////////////////////////////////
ACESDone();


//////////////////////////////////////// Свойства
// Свойства (Properties).

// Параметры свойств.
// type             Тип. Список типов:
//                      ept_integer - целое число,
//                      ept_float - число,
//                      ept_text - текст,
//                      ept_combo - список.
// name             Имя.
// initial_value    Начальное значение.
// description      Описание.
// items            Элементы списка.
// default_item     Элемент поумолчанию.

// Добавление свойства:
// new cr.Property(type, name, initial_value, description)

// Добавление свойства с типом "ept_combo":
// new cr.Property(ept_combo, name, default_item, description, items)

// Массив (список) свойств.
var property_list = [

    // Примеры добавления свойств:
    new cr.Property(ept_integer, "HP", 100, "The current value of health."), // обратите внимание! они пишутся через запятую.
	new cr.Property(ept_integer, "MaxHP", 100, "The current value of maximum health.")

	];


//////////////////////////////////////// Классы и функции
// Классы и функции (Classes and functions)

// Вызывается при создании нового типа Behavior в IDE
function CreateIDEBehaviorType()
{
	return new IDEBehaviorType();
}

// Класс, представляющий тип Behavior в IDE
function IDEBehaviorType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Вызывается при создании этого типа Behavior
IDEBehaviorType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

// Класс, представляющий отдельный экземпляр Behavior в IDE.
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");

	this.instance = instance;
	this.type = type;
	
	this.properties = {};
	
    for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Любые другие свойства. Например:
	// this.myValue = 0;
}

// Вызывается после завершения инициализации объекта. On create.
IDEInstance.prototype.OnCreate = function()
{
}

// Вызывается после изменения свойства.
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
