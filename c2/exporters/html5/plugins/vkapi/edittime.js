function GetPluginSettings()
{
    return {
        "name":			"Extended VK Api",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
        "id":			"ExtendedVkApi",				// this is used to identify this plugin and is saved to the project; never change it
        "version":		"2.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
        "description":          "Расширенная интеграция VK.Api в Construct 2",
        "author":		"Victor Pekarskiy",
        "help url":		"http://c2community.ru/forum/viewtopic.php?f=18&t=6353",
        "category":		"Platform specific",				// Prefer to re-use existing categories, but you can set anything here
        "type":			"object",				// either "world" (appears in layout and is drawn), else "object"
        "rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
        "flags":		pf_singleglobal,					// uncomment lines to enable flags...
        //	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
        //	| pf_texture			// object has a single texture (e.g. tiled background)
        //	| pf_position_aces		// compare/set/get x, y...
        //	| pf_size_aces			// compare/set/get width, height...
        //	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
        //	| pf_appearance_aces	// compare/set/get visible, opacity...
        //	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
        //	| pf_animations			// enables the animations system.  See 'Sprite' for usage
        //	| pf_zorder_aces		// move to top, bottom, layer...
        //  | pf_nosize				// prevent resizing in the editor
        //	| pf_effects			// allow WebGL shader effects to be added
        //  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
        // a single non-tiling image the size of the object) - required for effects to work properly
        "dependency":	"xd_connection.js"
    };
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// example	
AddCondition(0,	cf_trigger, "On ready", "Основное", "On ready", "Срабатывает когда приложение инциализировалось и готово к работе с VK", "OnReady");

AddCondition(1,	cf_trigger, "On Balance Changed", "Операции с голосами", "On Balance Changed", "Событие происходит, когда пользователь положил или снял голоса с баланса приложения. Параметр balance содержит текущий баланс пользователя в сотых долях голоса. Этот параметр можно использовать только для вывода пользователю. Достоверность баланса всегда нужно проверять с помощью метода secure.getBalance.", "OnBalCh");
AddCondition(5,	cf_trigger, "On Order Cancel", "Операции с товарами", "On Order Cancel", "Событие происходит, когда пользователь отменяет покупку ТОВАРА.", "onOrdCan");
AddCondition(6,	cf_trigger, "On Order Success", "Операции с товарами", "On Order Success", "Событие происходит, когда покупка ТОВАРА закончилась успешно.", "onOrdSuc");
AddCondition(7,	cf_trigger, "On Order Fail", "Операции с товарами", "On Order Fail", "Событие происходит, когда покупка ТОВАРА закончилась неуспешно.", "onOrdFail");

AddCondition(2,	cf_trigger, "On Window Blur", "Окно", "On Window Blur", "Событие происходит, когда окно с приложением теряет фокус. Например, когда пользователь открывает окно с настройками приложения.", "OnBlur");
AddCondition(3,	cf_trigger, "On Window Focus", "Окно", "On Window Focus", "Событие происходит, когда окно с приложением получает фокус. Например, когда пользователь закрывает окно с настройками приложения.", "OnFocus");
AddCondition(4,	0, "Is Blur", "Окно", "Is Window Blur", "Правдиво, когда окно не в фокусе ", "IsBlur");

AddCondition(8,	cf_trigger, "On Friends List Loaded", "Друзья", "On Friends List Loaded", "Событие происходит, когда отработала ф-ция Friends Get", "onFrLoad");

AddCondition(9,	cf_trigger, "On Albums List Loaded", "Фотографии", "On Albums List Loaded", "Событие происходит, когда отработала ф-ция Получения списка альбомов", "onAlbumLoaded");
AddCondition(10,cf_trigger, "On New Album Created", "Фотографии", "On New Album Created", "Событие происходит, когда отработала ф-ция Создать новый альбом", "onAlbumCreated");
AddCondition(11,cf_trigger, "On URL Upload Server Detected", "Фотографии", "On URL Upload Server Detected", "Событие происходит, когда получен адрес сервера для загрузки фото", "onGetUpServer");
AddCondition(12,cf_trigger, "On Photo Saved", "Фотографии", "On Photo Saved", "Событие происходит, когда фото сохранились после вызова Photo Save", "onPhotoSaved");
AddCondition(13,af_deprecated, "On Application Friends Got", "Друзья в приложении", "On app friends loaded", "Срабатывает когда список друзей приложения загрузился", "OnReadyAppFriends");
AddCondition(14,cf_trigger, "On Profile Reading Done", "Получение информации о профиле", "User Profile Reading Done", "Срабатывает когда была загружена информация о пользователе", "UserLoaded");

AddCondition(15,cf_trigger, "On Search Finished", "Пользователи", "On search finished", "Событие происходит, когда поиск пользователей завершён.", "onSearchFinish");
AddCondition(16,cf_trigger, "On Application Added", "Системные", "On Application Added", "Событие происходит, когда пользователь устанавливает приложение.", "onApplicationAdded");
AddCondition(17,cf_trigger, "On Subscriptions Loaded", "Пользователи", "On Subscriptions Loaded", "Событие происходит, когда получен список подписок пользователя.", "onGetSubscriptionFinish");
AddCondition(18,cf_trigger, "On Status Got", "Пользователи", "On Status Got", "Событие происходит, когда получен статус пользователя.", "OnStatusGot");
AddCondition(19,cf_trigger, "On Countries Got", "База данных Вконтакте", "On Countries Got", "Событие происходит, когда получен список стран из базы данных Вконтакте.", "OnCountriesGot");
AddCondition(20,cf_trigger, "On Regions Got", "База данных Вконтакте", "On Regions Got", "Событие происходит, когда получен список регионов страны из базы данных Вконтакте.", "OnRegionsGot");
AddCondition(21,cf_trigger, "On Country Info Got", "База данных Вконтакте", "On Country Info Got", "Событие происходит, когда получена информация о странах из базы данных Вконтакте.", "OnCountryInfoGot");
AddCondition(22,cf_trigger, "On Cities List Got", "База данных Вконтакте", "On Cities List Got", "Событие происходит, когда получен список городов страны из базы данных Вконтакте.", "OnCitiesListGot");
AddCondition(23,cf_trigger, "On Cities Info Loaded", "База данных Вконтакте", "On Cities Info Loaded", "Событие происходит, когда получена информация о городах страны из базы данных Вконтакте.", "OnCitiesInfoLoaded");
AddCondition(24,cf_trigger, "On installation info loaded", "Пользователи", "On inst. info loaded", "Событие происходит, когда получена информация, установил ли пользователь приложение.", "OnUsersInstallationInfoGot");
AddCondition(27,cf_trigger, "On storage loaded", "Работа с данными", "On storage loaded", "Событие происходит, когда переменная была загружена.", "OnStorageLoaded");


AddExpression(0, ef_return_string, "Получить JSON массив текущего поль.", "Пользователь приложения", "OwnDataJsonArr", "Массив данных пользователя со структорой для импорта в массив типа Construct Array");

AddExpression(2, ef_return_number, "Получить ID заказа", "Платежи", "orderId", "Если покупка успешна - получить ID заказа");
AddExpression(3, ef_return_number, "Получить код ошибки", "Платежи", "errorCode", "Если произошла ошибка при покупке - получить код ошибки");

AddExpression(4, ef_return_string, "Получить JSON массив друзей", "Друзья", "FriensDataJsonArr", "Массив со структорой для импорта в массив типа Construct Array");
AddExpression(5, ef_return_string, "Получить JSON массив альбомов", "Фотографии", "AlbumsDataJsonArr", "Массив со структорой для импорта в массив типа Construct Array");
AddExpression(6, ef_return_number, "Получить aid созданного альбома", "Фотографии", "GetNewAlbumAid", "Числовое значения альбома");

AddExpression(7, ef_return_string, "Получить URL сервера для аплоада фото", "Фотографии", "ServerUpUrl", "URL сервера");
AddExpression(8, ef_return_string, "Получить id сохраненного фото", "Фотографии", "GetPhotoId", "Например photo152321_1231351");
AddExpression(9, af_deprecated, "Получить список друзей, установивших приложение.", "Пользователи приложения", "AppFriendsDataJsonArr", "Массив друзей, установивших приложение");
AddExpression(10, ef_return_string, "Получить JSON массив загружаемого пользователя.", "Пользователи Вконтакте", "UserArray", "Массив с информацией о пользователе");
AddExpression(11, ef_return_string, "Получить JSON массив найденных пользователей.", "Пользователи Вконтакте", "SearchingResultsDataJsonArr", "Массив с информацией о найденных пользователях.");
AddExpression(12, ef_return_string, "Получить JSON массив подписок пользователя.", "Пользователи Вконтакте", "SubscriptionsResultsDataJsonArr", "Массив с информацией о подписках пользователя.");
AddExpression(13, ef_return_string, "Получить статус пользователя.", "Пользователи Вконтакте", "GetStatusResult", "Текст статуса пользователя.");
AddExpression(14, ef_return_string, "Получить список стран из базы данных Вконтакте.", "База данных Вконтакте", "CountriesDataJsonArr", "Список стран из базы данных Вконтакте.");
AddExpression(15, ef_return_string, "Получить список регионов страны из базы данных Вконтакте.", "База данных Вконтакте", "RegionsDataJsonArr", "Список регионов страны из базы данных Вконтакте.");
AddExpression(16, ef_return_string, "Получить информацию о странах по их id.", "База данных Вконтакте", "CountryInfoDataJsonArr", "Информация о странах по их id.");
AddExpression(17, ef_return_string, "Получить список городов страны.", "База данных Вконтакте", "CitiesListDataJsonArr", "Список городов страны.");
AddExpression(18, ef_return_string, "Получить информацию о городах по их id.", "База данных Вконтакте", "CitiesInfoDataJsonArr", "Информация о городах по id.");
AddExpression(19, ef_return_string, "Установил ли пользователь приложение.", "Пользователи Вконтакте", "IsAppUser", "1 - установил, 0 - не установил.");
AddExpression(22, ef_return_string, "Значение запрашиваемой переменной.", "Работа с данными", "GetStorage", "Загружает значение сохранённой переменной.");


AddStringParam("id_owner", "ID пользователя, которому отправлять на стену(если не заполнено, опубликовать текущему пользователю)");
AddStringParam("message", "Текст сообщения");
AddStringParam("attachments", "список объектов, приложенных к записи и разделённых символом ,. Например: photo66748_265827614,http://habrahabr.ru");
AddStringParam("lat", "географическая широта отметки, заданная в градусах (от -90 до 90).");
AddStringParam("long", "географическая долгота отметки, заданная в градусах (от -180 до 180).");
AddStringParam("place_id", "идентификатор места, в котором отмечен пользователь");
AddStringParam("services", "Например twitter, facebook.");
AddStringParam("from_group", "Данный параметр учитывается, если owner_id < 0 (статус публикуется на стене группы). 1 - статус будет опубликован от имени группы, 0 - статус будет опубликован от имени пользователя (по умолчанию).");
AddStringParam("signed", "Данный параметр учитывается, если owner_id < 0 (статус публикуется на стене группы). 1 - статус будет опубликован от имени группы, 0 - статус будет опубликован от имени пользователя (по умолчанию).");
AddStringParam("friends_only", "1 - статус будет доступен только друзьям, 0 - всем пользователям. По умолчанию публикуемые статусы доступны всем пользователям.");
AddAction(0, 0, "Опубликовать на стене", "Стена", "Публикация с текстом <i>{1}</i>", "Публикация поста на стене(необходимы права в приложении)", "PublishToWall");

AddStringParam("count","Имя товара для покупки");
AddAction(1, 0, "Show Order Box", "Платежи", "Товар <i>{0}</i>", "Открыть окно работы с голосами", "ShowOrderBox");
AddAction(2, 0, "Show Invite Box", "Другое", "Показать окно приглашения друзей", "Открывает окно для приглашения друзей пользователя в приложение.", "ShowInviteBox");

AddStringParam("title","текст заголовка окна");
AddAction(3, 0, "Set Title", "Другое", "Изменяет заголовок окна браузера на <i>{0}</i>.", "Изменить заголовок окна браузера.", "SetTitle");


AddComboParamOption("nom");
AddComboParamOption("gen");
AddComboParamOption("dat");
AddComboParamOption("acc");
AddComboParamOption("ins");
AddComboParamOption("abl");
AddComboParam("name_case", "падеж для склонения имени и фамилии пользователя. Возможные значения: именительный – nom, родительный – gen, дательный – dat, винительный – acc, творительный – ins, предложный – abl. По умолчанию nom.", "nom");
AddStringParam("count","количество друзей, которое нужно вернуть. (по умолчанию – все друзья)");
AddStringParam("offset","смещение, необходимое для выборки определенного подмножества друзей.");
AddComboParamOption("name");
AddComboParamOption("hints");
AddComboParam("order", "Порядок в котором нужно вернуть список друзей. Допустимые значения: name - сортировать по имени (работает только при переданном параметре fields).", "hints");
AddAction(4, 0, "Friends Get", "Друзья", "Получить список друзей с параметрами склонения:<i>{0}</i>, количество:<i>{1}</i>, смещение:<i>{2}</i>, сортировка:<i>{3}</i>", "Получить список друзей в jsonarray для импорта в Array(Construct)", "FriendsGet");
AddAction(5, 0, "Get Albums", "Фотографии", "Получает массив с списком альбомов", "Получить список альбомов", "GetAlbums");

AddStringParam("title", "Название альбома","Новый альбом");
AddStringParam("privacy", "Уровень доступа к альбому. Значения: 0 – все пользователи, 1 – только друзья, 2 – друзья и друзья друзей, 3 - только я.");
AddStringParam("comment_privacy", "Уровень доступа к комментированию альбома. Значения: 0 – все пользователи, 1 – только друзья, 2 – друзья и друзья друзей, 3 - только я.");
AddStringParam("description", "Текст описания альбома.");
AddStringParam("gid", "Идентификатор группы, в которой создаётся альбом. В этом случае privacy и comment_privacy могут принимать два значения: 0 - доступ для всех пользователей, 1 - доступ только для участников группы.");
AddAction(6, 0, "Create Album", "Фотографии", "Создает пустой альбом", "Создать пустой альбом", "CreateAlbum");

AddNumberParam("aid", "ID альбома, в который необходимо загрузить фотографии",0);
AddStringParam("gid", "ID группы, при загрузке фотографии в группу.");
AddAction(7, 0, "Get Upload Server", "Фотографии", "Возвращает адрес сервера для загрузки фотографий.", "Возвращает адрес сервера для загрузки фотографий.", "GetUpServer");

AddStringParam("json", "Массив полученный от сервера загрузок");
AddStringParam("caption", "Описание к фото");
AddStringParam("gid", "ID группы, при загрузке фотографии в группу.");
AddAction(8, 0, "Save photo", "Фотографии", "Сохранить фото", "Сохраняет фото", "SavePhoto");
AddAction(9, af_deprecated, "Get Application Friends", "Друзья", "Получить список друзей, которые установили приложение для текущего пользователя", "Получить список друзей, которые установили приложение", "GetAppsFriends");

AddStringParam("uids", "Информация об аккаунте");
AddAction(10, 0, "Get User", "Пользователи", "Получить информацию о пользователе", "Получить информацию о пользователе", "UsersGet");

AddNumberParam("width", "Изменить ширину на...");
AddNumberParam("height", "Изменить высоту на...");
AddAction(11, 0, "Изменить размер окна", "Системные", "Изменить ширину окна на <i>{0}</i> и высоту на <i>{1}</i>", "Изменяет ширину и высоту экрана.", "setsize");

AddAction(12, 0, "Показать окно установки приложения", "Системные", "Отрыть окно установки приложения", "Открывает окно установки приложения.", "showInstallBox");

AddNumberParam("permissions", "Как правильно запрашивать доступ: http://vk.com/dev/permissions");
AddAction(13, 0, "Показать окно настроек", "Системные", "Отрыть окно настроек приложения с запросом <i>{0}</i>", "Открывает окно настроек приложения (доступ к друзьям, фото и т.п.;).", "showSettingsBox");

AddNumberParam("uid", "ID пользователя, которому следует отправить уведомление (он должен быть другом текущего пользователя).");
AddStringParam("message", "Текст сообщения.");
AddStringParam("requestKey", "Ключ?");
AddAction(14, 0, "Отправить уведомление", "Системные", "Отправить уведомление пользователю <b>{0}</b> с текстом <i>{1}</i>", "Посылает уведомление пользователю.", "sendNotification");

AddNumberParam("top", "Смещение скролла относительно нулевой координаты окна.");
AddNumberParam("speed", "Задает скорость анимации в миллисекундах.");
AddAction(15, 0, "Инициировать скроллинг окна браузера", "Системные", "Инициировать вертикальный скроллинг со смещением <i>{0}</i> и скоростью <i>{1}</i> мс.", "Скроллинг окна браузера.", "scrollWindow");

AddStringParam("photohash", "Укажите ID фото. Например: photo-29559271_366114487");
AddAction(16, 0, "Изменить аватар", "Фотографии", "Изменить аватар профиля на <b>загруженную</b> фотографию <i>{0}</i>", "Замена фото профиля.", "showProfilePhotoBox");

AddStringParam("q", "Текст запроса. Например, Иван Иванов");
AddNumberParam("sort", "Сортировка результатов: 1 - по дате регистрации, 0 - по популярности.");
AddNumberParam("offset", "Cмещение относительно первого найденного пользователя для выборки определенного подмножества.");
AddNumberParam("count", "Количество возвращаемых пользователей (20 по умолчанию, 1000 - максимум).");
AddNumberParam("city", "Идентификатор города.");
AddNumberParam("country", "Идентификатор страны.");
AddStringParam("hometown", "Название города строкой.");
AddNumberParam("sex", "Пол, 1 — женщина, 2 — мужчина, 0 (по умолчанию) — любой. ");
AddNumberParam("status", "Семейное положение: 1 — Не женат, 2 — Встречается, 3 — Помолвлен, 4 — Женат, 7 — Влюблён, 5 — Всё сложно, 6 — В активном поиске.");
AddNumberParam("age_from", "Начиная с какого возраста.");
AddNumberParam("age_to", "До какого возраста.");
AddNumberParam("birth_year", "Год рождения.");
AddAction(17, 0, "Поиск пользователя", "Пользователи", "Найти пользователя <i>{0}</i>", "Поиск пользователя.", "usersearch");

AddNumberParam("user_id", "Идентификатор пользователя, подписки которого необходимо получить. По умолчанию идентификатор текущего пользователя.");
AddNumberParam("offset", "Cмещение необходимое для выборки определенного подмножества подписок.");
AddNumberParam("count", "Количество подписок, которые необходимо вернуть. По умолчанию 20, максимальное значение 200.");
AddAction(18, 0, "Получить подписки", "Пользователи", "Получить список подписок пользователя <i>{0}</i>", "Подписки пользователя.", "userSubscriptions");

AddNumberParam("user_id", "ID нужного пользователя.");
AddAction(19, 0, "Получить статус", "Пользователи", "Получить статус пользователя <b>{0}</b>", "Статус пользователя.", "userStatusGet");

AddNumberParam("offset", "Отступ, необходимый для выбора определенного подмножества стран.");
AddNumberParam("count", "Количество стран, которое необходимо вернуть (по умолчанию 100, максимальное значение 1000).");
AddAction(20, 0, "Получить список стран", "База данных Вконтакте", "Получить список из <b>{1}</b> стран", "Список стран.", "getCountries");

AddNumberParam("country_id", "Идентификатор страны, полученный действием 'Получить список стран'.");
AddStringParam("region_name", "Строка поискового запроса. Например, Лен. Для вывода всех регионов оставьте это поле пустым.");
AddNumberParam("offset", "Отступ, необходимый для выбора определенного подмножества регионов.");
AddNumberParam("count", "Количество регионов, которое необходимо вернуть (по умолчанию 100, максимальное значение 1000).");
AddAction(21, 0, "Получить список регионов", "База данных Вконтакте", "Получить список из <b>{3}</b> регионов страны, с индексом <b>{0}</b>", "Список регионов.", "getRegions");

AddStringParam("country_ids", "Идентификаторы стран. Список положительных чисел, разделенных запятыми, количество элементов должно составлять не более 1000.");
AddAction(22, 0, "Получить информацию о странах", "База данных Вконтакте", "Получить информацию о странах <i>{0}</i>", "Информация о странах.", "getCountryInfo");

AddNumberParam("country_id", "Идентификатор страны.");
AddNumberParam("region_id", "Идентификатор региона (не обязательно).");
AddStringParam("search", "Строка поискового запроса. Например, Санкт.");
AddComboParamOption("0");
AddComboParamOption("1");
AddComboParam("need_all", "1 – возвращать все города. 0 – возвращать только основные города.");
AddNumberParam("offset", "Отступ, необходимый для получения определенного подмножества городов.");
AddNumberParam("count", "Количество городов, которые необходимо вернуть. По умолчанию 100, максимальное значение 1000.");
AddAction(23, 0, "Получить список городов", "База данных Вконтакте", "Получить список городов страны <i>{0}</i>", "Список городов.", "getCitiesList");

AddStringParam("city_ids", "Идентификаторы городов.");
AddAction(24, 0, "Получить города по их id", "База данных Вконтакте", "Получить информацию о городах с id <i>{0}</i>", "Информация о городах.", "getCitiesInfo");

AddStringParam("user_id", "Идентификатор пользователя для проверки.");
AddAction(25, 0, "Установлено ли приложение", "Пользователи", "Проверить, установлено ли приложение у пользователя с ID <b>{0}</b>", "Проверка установки приложения.", "wasInstalled");

AddStringParam("user_id", "идентификатор пользователя, для которого необходимо получить список друзей онлайн. По умолчанию равен идентификатору текущего пользователя.");
AddComboParamOption("0");
AddComboParamOption("1");
AddComboParam("online_mobile", "1 – получить друзей, находящихся в сети с телефона. 0 - по умолчанию.");
AddNumberParam("count", "Количество друзей онлайн, которое нужно вернуть. (по умолчанию – все друзья онлайн).");
AddNumberParam("offset", "Смещение, необходимое для выборки определенного подмножества друзей онлайн.");
AddAction(26, af_deprecated, "Получить онлайн-друзей", "Друзья", "Получить список онлайн-друзей пользователя <b>{0}</b>.", "Список друзей, находящихся в сети.", "getOnlineFriends");

AddStringParam("key", "Название переменной. Может содержать символы латинского алфавита, цифры, знак тире, нижнее подчёркивание [a-zA-Z_\-0-9].");
AddStringParam("value", "Значение переменной, сохраняются только первые 4096 байта.");
AddNumberParam("user_id", "Id пользователя, переменная которого устанавливается, в случае если данные запрашиваются серверным методом.");
AddNumberParam("global", "Указывается 1, если необходимо работать с глобальными переменными, а не с переменными пользователя.");
AddAction(27, 0, "Сохранить переменную", "Работа с данными", "Сохранить переменную под именем <b>{0}</b> и значением <i>{1}</i>.", "Сохранить переменную на сервер Вконтакте.", "setStorage");

AddStringParam("key", "Значение переменной, сохраняются только первые 4096 байта.");
AddNumberParam("user_id", "Id пользователя, переменная которого устанавливается, в случае если данные запрашиваются серверным методом.");
AddNumberParam("global", "Указывается 1, если необходимо работать с глобальными переменными, а не с переменными пользователя.");
AddAction(28, 0, "Получить переменную", "Работа с данными", "Загрузить значение переменной <b>{0}</b>.", "Загрузить значение переменной с сервера Вконтакте.", "getStorage");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click


// Property grid properties for this plugin
var property_list = [
new cr.Property(ept_text,"App ID","","The App ID VK gives you after creating an app."),
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
