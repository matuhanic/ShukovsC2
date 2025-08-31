// runtime.js
(function () {
  var pluginProto = cr.plugins_.ShukovServer = function(runtime) {
    this.runtime = runtime;
    this.serverURL = "http://localhost:3000";
    this.token = "";
    this.lastResponse = "";
    this.lastError = "";
    this.username = "";
    this.email = "";
    this.dataValue = "";
    this.allData = "";
    this.leaderboard = "";
    this.isConnected = false; // Статус подключения
  };

  var proto = pluginProto.prototype;

  // Object type
  proto.Type = function(plugin) {
    this.plugin = plugin;
    this.runtime = plugin.runtime;
  };

  var typeProto = proto.Type.prototype;

  typeProto.onCreate = function() {};

  // Instance
  proto.Instance = function(type) {
    this.type = type;
    this.runtime = type.runtime;
    this.serverURL = (this.properties && this.properties[0]) ? this.properties[0] : "http://localhost:3000";
    this.token = "";
    this.lastResponse = "";
    this.lastError = "";
    this.username = "";
    this.email = "";
    this.dataValue = "";
    this.allData = "";
    this.leaderboard = "";
    this.isConnected = false;
  };

  var instanceProto = proto.Instance.prototype;

  instanceProto.onCreate = function() {};

  // Safe JSON parsing utility (from common.js)
  function safeParseJSON(text) {
    try {
      return JSON.parse(text);
    } catch (err) {
      return null;
    }
  }

  // Conditions
  function Cnds() {};
  Cnds.prototype.OnRegisterSuccess = function () { return true; };
  Cnds.prototype.OnRegisterError = function () { return true; };
  Cnds.prototype.OnLoginSuccess = function () { return true; };
  Cnds.prototype.OnLoginError = function () { return true; };
  Cnds.prototype.OnLogoutSuccess = function () { return true; };
  Cnds.prototype.OnLogoutError = function () { return true; };
  Cnds.prototype.OnGetUserInfoSuccess = function () { return true; };
  Cnds.prototype.OnGetUserInfoError = function () { return true; };
  Cnds.prototype.OnSetDataSuccess = function () { return true; };
  Cnds.prototype.OnSetDataError = function () { return true; };
  Cnds.prototype.OnGetDataSuccess = function () { return true; };
  Cnds.prototype.OnGetDataError = function () { return true; };
  Cnds.prototype.OnUpdateDataSuccess = function () { return true; };
  Cnds.prototype.OnUpdateDataError = function () { return true; };
  Cnds.prototype.OnDeleteDataSuccess = function () { return true; };
  Cnds.prototype.OnDeleteDataError = function () { return true; };
  Cnds.prototype.OnLoadAllDataSuccess = function () { return true; };
  Cnds.prototype.OnLoadAllDataError = function () { return true; };
  Cnds.prototype.OnSetScoreSuccess = function () { return true; };
  Cnds.prototype.OnSetScoreError = function () { return true; };
  Cnds.prototype.OnGetLeaderboardSuccess = function () { return true; };
  Cnds.prototype.OnGetLeaderboardError = function () { return true; };
  Cnds.prototype.IsConnected = function () { return this.isConnected; };
  Cnds.prototype.OnConnected = function () { return true; };
  Cnds.prototype.OnConnectionError = function () { return true; };

  proto.cnds = new Cnds();

  // Actions
  function Acts() {};
  Acts.prototype.SetServerURL = function (url) {
    this.serverURL = url;
  };

  Acts.prototype.Register = function (username, password, email) {
    var self = this;
    self.lastResponse = "";
    self.lastError = "";
    var data = JSON.stringify({ username: username, password: password, email: email });
    var xhr = new XMLHttpRequest();
    xhr.open("POST", this.serverURL + "/register", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        self.lastResponse = xhr.responseText;
        if (xhr.status === 201) {
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnRegisterSuccess, self);
        } else {
          var parsed = safeParseJSON(xhr.responseText);
          self.lastError = parsed ? parsed.error || "Request failed with status " + xhr.status : "Invalid response";
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnRegisterError, self);
        }
      }
    };
    xhr.onerror = function () {
      self.lastError = "Network error";
      self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnRegisterError, self);
    };
    xhr.send(data);
  };

  Acts.prototype.Login = function (username, password) {
    var self = this;
    self.lastResponse = "";
    self.lastError = "";
    var data = JSON.stringify({ username: username, password: password });
    var xhr = new XMLHttpRequest();
    xhr.open("POST", this.serverURL + "/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        self.lastResponse = xhr.responseText;
        var parsed = safeParseJSON(xhr.responseText);
        if (xhr.status === 200 && parsed && parsed.token) {
          self.token = parsed.token;
          self.username = parsed.username;
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnLoginSuccess, self);
        } else {
          self.lastError = parsed ? parsed.error || "Request failed with status " + xhr.status : "Invalid response";
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnLoginError, self);
        }
      }
    };
    xhr.onerror = function () {
      self.lastError = "Network error";
      self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnLoginError, self);
    };
    xhr.send(data);
  };

  Acts.prototype.Logout = function () {
    var self = this;
    self.lastResponse = "";
    self.lastError = "";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", this.serverURL + "/logout", true);
    xhr.setRequestHeader("Authorization", "Bearer " + this.token);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        self.lastResponse = xhr.responseText;
        if (xhr.status === 200) {
          self.token = "";
          self.username = "";
          self.email = "";
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnLogoutSuccess, self);
        } else {
          var parsed = safeParseJSON(xhr.responseText);
          self.lastError = parsed ? parsed.error || "Request failed with status " + xhr.status : "Invalid response";
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnLogoutError, self);
        }
      }
    };
    xhr.onerror = function () {
      self.lastError = "Network error";
      self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnLogoutError, self);
    };
    xhr.send();
  };

  Acts.prototype.GetUserInfo = function () {
    var self = this;
    self.lastResponse = "";
    self.lastError = "";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.serverURL + "/user", true);
    xhr.setRequestHeader("Authorization", "Bearer " + this.token);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        self.lastResponse = xhr.responseText;
        var parsed = safeParseJSON(xhr.responseText);
        if (xhr.status === 200 && parsed) {
          self.username = parsed.username || "";
          self.email = parsed.email || "";
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnGetUserInfoSuccess, self);
        } else {
          self.lastError = parsed ? parsed.error || "Request failed with status " + xhr.status : "Invalid response";
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnGetUserInfoError, self);
        }
      }
    };
    xhr.onerror = function () {
      self.lastError = "Network error";
      self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnGetUserInfoError, self);
    };
    xhr.send();
  };

  Acts.prototype.SetData = function (key, value) {
    var self = this;
    self.lastResponse = "";
    self.lastError = "";
    var data = JSON.stringify({ key: key, value: value });
    var xhr = new XMLHttpRequest();
    xhr.open("POST", this.serverURL + "/set-data", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + this.token);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        self.lastResponse = xhr.responseText;
        if (xhr.status === 200 || xhr.status === 201) {
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnSetDataSuccess, self);
        } else {
          var parsed = safeParseJSON(xhr.responseText);
          self.lastError = parsed ? parsed.error || "Request failed with status " + xhr.status : "Invalid response";
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnSetDataError, self);
        }
      }
    };
    xhr.onerror = function () {
      self.lastError = "Network error";
      self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnSetDataError, self);
    };
    xhr.send(data);
  };

  Acts.prototype.GetData = function (key) {
    var self = this;
    self.lastResponse = "";
    self.lastError = "";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.serverURL + "/get-data?key=" + encodeURIComponent(key), true);
    xhr.setRequestHeader("Authorization", "Bearer " + this.token);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        self.lastResponse = xhr.responseText;
        var parsed = safeParseJSON(xhr.responseText);
        if (xhr.status === 200 && parsed && parsed.value !== undefined) {
          self.dataValue = parsed.value;
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnGetDataSuccess, self);
        } else {
          self.lastError = parsed ? parsed.error || "Request failed with status " + xhr.status : "Invalid response";
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnGetDataError, self);
        }
      }
    };
    xhr.onerror = function () {
      self.lastError = "Network error";
      self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnGetDataError, self);
    };
    xhr.send();
  };

  Acts.prototype.UpdateData = function (key, value) {
    var self = this;
    self.lastResponse = "";
    self.lastError = "";
    var data = JSON.stringify({ key: key, value: value });
    var xhr = new XMLHttpRequest();
    xhr.open("POST", this.serverURL + "/update-data", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + this.token);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        self.lastResponse = xhr.responseText;
        if (xhr.status === 200) {
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnUpdateDataSuccess, self);
        } else {
          var parsed = safeParseJSON(xhr.responseText);
          self.lastError = parsed ? parsed.error || "Request failed with status " + xhr.status : "Invalid response";
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnUpdateDataError, self);
        }
      }
    };
    xhr.onerror = function () {
      self.lastError = "Network error";
      self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnUpdateDataError, self);
    };
    xhr.send(data);
  };

  Acts.prototype.DeleteData = function (key) {
    var self = this;
    self.lastResponse = "";
    self.lastError = "";
    var data = JSON.stringify({ key: key });
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", this.serverURL + "/delete-data", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + this.token);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        self.lastResponse = xhr.responseText;
        if (xhr.status === 200) {
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnDeleteDataSuccess, self);
        } else {
          var parsed = safeParseJSON(xhr.responseText);
          self.lastError = parsed ? parsed.error || "Request failed with status " + xhr.status : "Invalid response";
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnDeleteDataError, self);
        }
      }
    };
    xhr.onerror = function () {
      self.lastError = "Network error";
      self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnDeleteDataError, self);
    };
    xhr.send(data);
  };

  Acts.prototype.LoadAllData = function () {
    var self = this;
    self.lastResponse = "";
    self.lastError = "";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.serverURL + "/load-all-data", true);
    xhr.setRequestHeader("Authorization", "Bearer " + this.token);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        self.lastResponse = xhr.responseText;
        if (xhr.status === 200) {
          self.allData = xhr.responseText;
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnLoadAllDataSuccess, self);
        } else {
          var parsed = safeParseJSON(xhr.responseText);
          self.lastError = parsed ? parsed.error || "Request failed with status " + xhr.status : "Invalid response";
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnLoadAllDataError, self);
        }
      }
    };
    xhr.onerror = function () {
      self.lastError = "Network error";
      self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnLoadAllDataError, self);
    };
    xhr.send();
  };

  Acts.prototype.SetScore = function (score) {
    var self = this;
    self.lastResponse = "";
    self.lastError = "";
    var data = JSON.stringify({ score: score });
    var xhr = new XMLHttpRequest();
    xhr.open("POST", this.serverURL + "/set-score", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + this.token);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        self.lastResponse = xhr.responseText;
        if (xhr.status === 200 || xhr.status === 201) {
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnSetScoreSuccess, self);
        } else {
          var parsed = safeParseJSON(xhr.responseText);
          self.lastError = parsed ? parsed.error || "Request failed with status " + xhr.status : "Invalid response";
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnSetScoreError, self);
        }
      }
    };
    xhr.onerror = function () {
      self.lastError = "Network error";
      self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnSetScoreError, self);
    };
    xhr.send(data);
  };

  Acts.prototype.GetLeaderboard = function () {
    var self = this;
    self.lastResponse = "";
    self.lastError = "";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.serverURL + "/leaderboard", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        self.lastResponse = xhr.responseText;
        if (xhr.status === 200) {
          self.leaderboard = xhr.responseText;
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnGetLeaderboardSuccess, self);
        } else {
          var parsed = safeParseJSON(xhr.responseText);
          self.lastError = parsed ? parsed.error || "Request failed with status " + xhr.status : "Invalid response";
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnGetLeaderboardError, self);
        }
      }
    };
    xhr.onerror = function () {
      self.lastError = "Network error";
      self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnGetLeaderboardError, self);
    };
    xhr.send();
  };

  Acts.prototype.CheckConnection = function () {
    var self = this;
    self.lastResponse = "";
    self.lastError = "";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.serverURL + "/ping", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        self.lastResponse = xhr.responseText;
        var parsed = safeParseJSON(xhr.responseText);
        if (xhr.status === 200 && parsed && parsed.status === "ok") {
          self.isConnected = true;
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnConnected, self);
        } else {
          self.isConnected = false;
          self.lastError = parsed ? parsed.error || "Request failed with status " + xhr.status : "Invalid response";
          self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnConnectionError, self);
        }
      }
    };
    xhr.onerror = function () {
      self.isConnected = false;
      self.lastError = "Network error";
      self.runtime.trigger(cr.plugins_.ShukovServer.prototype.cnds.OnConnectionError, self);
    };
    xhr.send();
  };

  proto.acts = new Acts();

  // Expressions
  function Exps() {};
  Exps.prototype.LastResponse = function (ret) {
    ret.set_string(this.lastResponse);
  };
  Exps.prototype.LastError = function (ret) {
    ret.set_string(this.lastError);
  };
  Exps.prototype.Token = function (ret) {
    ret.set_string(this.token);
  };
  Exps.prototype.Username = function (ret) {
    ret.set_string(this.username);
  };
  Exps.prototype.Email = function (ret) {
    ret.set_string(this.email);
  };
  Exps.prototype.DataValue = function (ret) {
    ret.set_string(this.dataValue);
  };
  Exps.prototype.AllData = function (ret) {
    ret.set_string(this.allData);
  };
  Exps.prototype.Leaderboard = function (ret) {
    ret.set_string(this.leaderboard);
  };

  proto.exps = new Exps();
}());

// Инструкции:
// - Исправлены ошибки в обработке JSON, статусов HTTP и очистки переменных.
// - Добавлена утилита safeParseJSON для безопасного парсинга ответов.
// - Добавлено действие CheckConnection и условия IsConnected, OnConnected, OnConnectionError.
// - Для HTTPS: используйте https:// в Server URL (настройте сервер для HTTPS в продакшене).
// - Создайте папку ShukovServer, добавьте файлы, заархивируйте в ShukovServer.c2addon и установите в Construct 2.
// - Тестируйте: добавьте объект Shukov Server, используйте действие CheckConnection и проверяйте условия IsConnected, OnConnected, OnConnectionError.
// - Расширьте по необходимости (добавьте друзей, сообщения и т.д., но это требует дополнительных таблиц/эндпоинтов).