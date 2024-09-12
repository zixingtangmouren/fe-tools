const registerHomeWindow = require('./home');
const registerRecordWindow = require('./record');
const regitserWeiViewWindow = require('./webviews');

module.exports = function registerAllWindows() {
  // 注册本地窗口
  registerHomeWindow();
  registerRecordWindow();
  regitserWeiViewWindow();

  // 注册插件窗口
};
