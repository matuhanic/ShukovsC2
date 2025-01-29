//Steam4C2 plugin by AJ2DI sasu - copyright 2016
//Based on an original idea by Greenheart games https://github.com/greenheartgames/greenworks
//Original license on https://github.com/greenheartgames/greenworks/blob/master/LICENSE
var fs = require('fs');

var Steam4C2;

if (process.platform == 'darwin') {
  if (process.arch == 'x64')
    Steam4C2 = require('./Steam4C2-osx64');
  else if (process.arch == 'ia32')
    Steam4C2 = require('./Steam4C2-osx32');
} else if (process.platform == 'win32') {
  if (process.arch == 'x64')
    Steam4C2 = require('./Steam4C2-win64');
  else if (process.arch == 'ia32')
    Steam4C2 = require('./Steam4C2-win32');
} else if (process.platform == 'linux') {
  if (process.arch == 'x64')
    Steam4C2 = require('./Steam4C2-linux64');
  else if (process.arch == 'ia32')
    Steam4C2 = require('./Steam4C2-linux32');
}

function error_process(err, error_callback) {
  if (err && error_callback)
    error_callback(err);
}


var EventEmitter = require('events').EventEmitter;
Steam4C2.__proto__ = EventEmitter.prototype;
EventEmitter.call(Steam4C2);

Steam4C2._steam_events.on = function () {
  Steam4C2.emit.apply(Steam4C2, arguments);
};

module.exports = Steam4C2;