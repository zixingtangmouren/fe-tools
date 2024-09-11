const {
  HOME_PROCESS_KEY,
  MAIN_PROCESS_KEY,
  RECORD_PROCESS_KEY,
} = require('./constants/processKeys');
const regitserAllWindows = require('./windowServices/windows');
const MainIPC = require('./IPC/MainIPC');

module.exports = function setup() {
  require('@electron/remote/main').initialize();

  // 初始化 master 全局对象
  global.master = {};
  global.master.services = {};

  // 初始化各种服务
  const windowServices = require('./windowServices');
  global.master.services.windowService = windowServices;

  const ipc = new MainIPC({ processKey: MAIN_PROCESS_KEY });
  global.master.services.ipc = ipc;

  // 注册窗口、打开首页
  regitserAllWindows();
  windowServices.create(HOME_PROCESS_KEY);

  // 监听事件
  ipc.on('open.record.window', (data) => {
    console.log('data', data);
    windowServices.create(RECORD_PROCESS_KEY);
  });
};
