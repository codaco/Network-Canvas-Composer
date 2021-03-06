const log = require('electron-log');

if (process.env.NODE_ENV !== 'development') {
  log.transports.console.level = false;
}
log.transports.file.level = 'debug';
log.transports.file.format = '{h}:{i}:{s}:{ms} {text}';
log.transports.file.maxSize = 5 * 1024 * 1024;
log.transports.file.streamConfig = { flags: 'w' };

module.exports = log;
