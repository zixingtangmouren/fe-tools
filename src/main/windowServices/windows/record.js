const { RECORD_PROCESS_KEY } = require('../../constants/processKeys');

module.exports = function registerHomeWindow() {
  const windowServices = require('../index');
  windowServices.registerWindow(RECORD_PROCESS_KEY, {
    width: 400,
    height: 250,
  });
};
