const { HOME_PROCESS_KEY } = require('../../constants/processKeys');

module.exports = function registerHomeWindow() {
  const windowServices = require('../index');
  windowServices.registerWindow(HOME_PROCESS_KEY, {
    width: 800,
    height: 600,
  });
};
