const { WEBVIEW_PROCESS_KEY } = require('../../constants/processKeys');

module.exports = function registerWebViewWindow() {
  const windowServices = require('../index');
  windowServices.registerWindow(WEBVIEW_PROCESS_KEY, {
    width: 400,
    height: 250,
  });
};
