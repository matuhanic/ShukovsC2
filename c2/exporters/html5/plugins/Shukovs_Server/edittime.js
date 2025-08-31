﻿// edittime.js
// ECMAScript 5 strict mode
"use strict";

// Called by Construct 2 to register the plugin
function GetPluginSettings() {
  return {
    "name": "Shukov Server",
    "id": "ShukovServer",
    "version": "1.0",
    "description": "Плагин для взаимодействия с сервером: регистрация, вход, сохранение данных, лидерборды и проверка соединения.",
    "author": "Matvey Shukov",
    "help url": "",
    "category": "Web",
    "type": "object",
    "rotatable": false,
    "flags": 0 | pf_singleglobal
  };
}

// Property list for the editor
var property_list = [
  {
    "name": "Server URL",
    "id": "server_url",
    "type": "text",
    "desc": "Base URL of the server (e.g., https://yourserver.com or http://localhost:3000). Use HTTPS in production.",
    "initial_value": "http://localhost:3000"
  }
];

// Actions
AddStringParam("Server URL", "Базовый URL сервера (например, https://yourserver.com или http://localhost:3000)");
AddAction(100, af_none, "Set Server URL", "Setup", "Set server URL to {0}", "Установить URL сервера.", "SetServerURL");

AddStringParam("Username", "Имя пользователя");
AddStringParam("Password", "Пароль");
AddStringParam("Email", "Email (опционально, должен быть валидным: user@domain.com)");
AddAction(101, af_none, "Register", "Auth", "Register user {0} with password {1} and email {2}", "Зарегистрировать пользователя.", "Register");

AddStringParam("Username", "Имя пользователя");
AddStringParam("Password", "Пароль");
AddAction(102, af_none, "Login", "Auth", "Login user {0} with password {1}", "Войти как пользователь.", "Login");

AddAction(103, af_none, "Logout", "Auth", "Logout current user", "Выйти из аккаунта.", "Logout");

AddAction(104, af_none, "Get User Info", "Auth", "Get current user info", "Получить информацию о пользователе.", "GetUserInfo");

AddStringParam("Key", "Ключ данных (уникальный идентификатор)");
AddStringParam("Value", "Значение данных (JSON строка, используйте JSON.stringify в Construct 2)");
AddAction(105, af_none, "Set Data", "Data", "Set data for key {0} to {1}", "Установить данные по ключу.", "SetData");

AddStringParam("Key", "Ключ данных");
AddAction(106, af_none, "Get Data", "Data", "Get data for key {0}", "Получить данные по ключу.", "GetData");

AddStringParam("Key", "Ключ данных");
AddStringParam("Value", "Значение данных (JSON строка, используйте JSON.stringify в Construct 2)");
AddAction(107, af_none, "Update Data", "Data", "Update data for key {0} to {1}", "Обновить данные по ключу.", "UpdateData");

AddStringParam("Key", "Ключ данных");
AddAction(108, af_none, "Delete Data", "Data", "Delete data for key {0}", "Удалить данные по ключу.", "DeleteData");

AddAction(109, af_none, "Load All Data", "Data", "Load all user data", "Загрузить все данные пользователя.", "LoadAllData");

AddNumberParam("Score", "Очки (целое число)");
AddAction(110, af_none, "Set Score", "Leaderboard", "Set score to {0}", "Установить очки.", "SetScore");

AddAction(111, af_none, "Get Leaderboard", "Leaderboard", "Get top 10 leaderboard", "Получить лидерборд.", "GetLeaderboard");

AddAction(112, af_none, "Check Connection", "Connection", "Check server connection", "Проверить соединение с сервером.", "CheckConnection");

// Conditions
AddCondition(0, cf_trigger, "On Register Success", "Auth", "On register success", "Сработало при успешной регистрации.", "OnRegisterSuccess");
AddCondition(1, cf_trigger, "On Register Error", "Auth", "On register error", "Сработало при ошибке регистрации.", "OnRegisterError");

AddCondition(2, cf_trigger, "On Login Success", "Auth", "On login success", "Сработало при успешном входе.", "OnLoginSuccess");
AddCondition(3, cf_trigger, "On Login Error", "Auth", "On login error", "Сработало при ошибке входа.", "OnLoginError");

AddCondition(4, cf_trigger, "On Logout Success", "Auth", "On logout success", "Сработало при успешном выходе.", "OnLogoutSuccess");
AddCondition(5, cf_trigger, "On Logout Error", "Auth", "On logout error", "Сработало при ошибке выхода.", "OnLogoutError");

AddCondition(6, cf_trigger, "On Get User Info Success", "Auth", "On get user info success", "Сработало при успешном получении информации о пользователе.", "OnGetUserInfoSuccess");
AddCondition(7, cf_trigger, "On Get User Info Error", "Auth", "On get user info error", "Сработало при ошибке получения информации о пользователе.", "OnGetUserInfoError");

AddCondition(8, cf_trigger, "On Set Data Success", "Data", "On set data success", "Сработало при успешной установке данных.", "OnSetDataSuccess");
AddCondition(9, cf_trigger, "On Set Data Error", "Data", "On set data error", "Сработало при ошибке установки данных.", "OnSetDataError");

AddCondition(10, cf_trigger, "On Get Data Success", "Data", "On get data success", "Сработало при успешном получении данных.", "OnGetDataSuccess");
AddCondition(11, cf_trigger, "On Get Data Error", "Data", "On get data error", "Сработало при ошибке получения данных.", "OnGetDataError");

AddCondition(12, cf_trigger, "On Update Data Success", "Data", "On update data success", "Сработало при успешном обновлении данных.", "OnUpdateDataSuccess");
AddCondition(13, cf_trigger, "On Update Data Error", "Data", "On update data error", "Сработало при ошибке обновления данных.", "OnUpdateDataError");

AddCondition(14, cf_trigger, "On Delete Data Success", "Data", "On delete data success", "Сработало при успешном удалении данных.", "OnDeleteDataSuccess");
AddCondition(15, cf_trigger, "On Delete Data Error", "Data", "On delete data error", "Сработало при ошибке удаления данных.", "OnDeleteDataError");

AddCondition(16, cf_trigger, "On Load All Data Success", "Data", "On load all data success", "Сработало при успешной загрузке всех данных.", "OnLoadAllDataSuccess");
AddCondition(17, cf_trigger, "On Load All Data Error", "Data", "On load all data error", "Сработало при ошибке загрузки всех данных.", "OnLoadAllDataError");

AddCondition(18, cf_trigger, "On Set Score Success", "Leaderboard", "On set score success", "Сработало при успешной установке очков.", "OnSetScoreSuccess");
AddCondition(19, cf_trigger, "On Set Score Error", "Leaderboard", "On set score error", "Сработало при ошибке установки очков.", "OnSetScoreError");

AddCondition(20, cf_trigger, "On Get Leaderboard Success", "Leaderboard", "On get leaderboard success", "Сработало при успешном получении лидерборда.", "OnGetLeaderboardSuccess");
AddCondition(21, cf_trigger, "On Get Leaderboard Error", "Leaderboard", "On get leaderboard error", "Сработало при ошибке получения лидерборда.", "OnGetLeaderboardError");

AddCondition(22, cf_none, "Is Connected", "Connection", "Is connected to server", "Проверяет, есть ли соединение с сервером.", "IsConnected");
AddCondition(23, cf_trigger, "On Connected", "Connection", "On connected to server", "Сработало при успешном подключении к серверу.", "OnConnected");
AddCondition(24, cf_trigger, "On Connection Error", "Connection", "On connection error", "Сработало при ошибке подключения к серверу.", "OnConnectionError");

// Expressions
AddExpression(0, ef_return_string, "Last Response", "Response", "LastResponse", "Последний ответ от сервера (JSON строка).");
AddExpression(1, ef_return_string, "Last Error", "Response", "LastError", "Последняя ошибка от сервера (JSON строка или сообщение).");
AddExpression(2, ef_return_string, "Token", "Auth", "Token", "JWT токен после успешного входа.");
AddExpression(3, ef_return_string, "Username", "Auth", "Username", "Имя пользователя.");
AddExpression(4, ef_return_string, "Email", "Auth", "Email", "Email пользователя.");
AddExpression(5, ef_return_string, "Data Value", "Data", "DataValue", "Значение полученных данных (для GetData).");
AddExpression(6, ef_return_string, "All Data", "Data", "AllData", "Все данные пользователя (JSON строка для LoadAllData).");
AddExpression(7, ef_return_string, "Leaderboard", "Leaderboard", "Leaderboard", "Лидерборд (JSON строка).");

// Required SDK functions for Construct 2
function CreateIDEObjectType() {
  return new IDEObjectType();
}

function IDEObjectType() {
  // Empty constructor
}

IDEObjectType.prototype.CreateInstance = function(instance) {
  return new IDEInstance(instance);
};

function IDEInstance(instance, type) {
  this.instance = instance;
  this.type = type;
  this.properties = {};
  for (var i = 0; i < property_list.length; i++) {
    this.properties[property_list[i].id] = property_list[i].initial_value || "";
  }
}

IDEInstance.prototype.OnCreate = function() {};
IDEInstance.prototype.OnPropertyChanged = function(id, value) {};
IDEInstance.prototype.OnInserted = function() {};
IDEInstance.prototype.OnRemoved = function() {};