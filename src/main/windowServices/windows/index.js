const registerHomeWindow = require('./home');
const registerRecordWindow = require('./record');

module.exports = function registerAllWindows() {
  registerHomeWindow();
  registerRecordWindow();
};
