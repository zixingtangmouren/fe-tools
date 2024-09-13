import { HOME_PROCESS_KEY, MAIN_PROCESS_KEY, RECORD_PROCESS_KEY } from './constants/processKeys';
import regitserAllWindows from './windowService/windows';
import MainIPC from './IPC/MainIPC';
import PluginsService from './pluginsService';
import initReduxStore from './stores/reduxStore';

export default function setup() {
  require('@electron/remote/main').initialize();

  // 初始化 master 全局对象
  global.master = {};
  global.master.services = {};
  global.master.stores = {};

  // 初始化各种服务
  const windowServices = require('./windowService');
  global.master.services.windowService = windowServices;

  // 挂载 ipc 服务
  const ipc = new MainIPC({ processKey: MAIN_PROCESS_KEY });
  global.master.services.ipc = ipc;

  // 挂载插件服务
  const pluginsService = new PluginsService();
  global.master.services.pluginsService = pluginsService;

  // 初始化 redux stores
  const reduxStore = initReduxStore();
  global.master.stores.reduxStore = reduxStore;

  // 注册窗口、打开首页
  regitserAllWindows();
  windowServices.create(HOME_PROCESS_KEY);

  // 监听事件
  ipc.on('open.record.window', (data) => {
    console.log('data', data);
    windowServices.create(RECORD_PROCESS_KEY);
  });
}
