const BaseIPC = require('./BaseIPC');
const { ipcMain, MessageChannelMain } = require('electron');
const {
  CHANNEL_RENDER_REGITSER,
  CHANNEL_MESSAGE,
  CHANNEL_RENDER_ADD_PORT,
  CHANNEL_RENDER_PROVIDE_PORT,
} = require('./constants');

class MainIPC extends BaseIPC {
  constructor(props) {
    super({
      ...props,
      namespace: 'main',
    });
    this._init();
  }

  _init() {
    this._addIPCRenderRegisterListener();
  }

  _addIPCRenderRegisterListener() {
    ipcMain.on(CHANNEL_RENDER_REGITSER, (event, data) => {
      console.log('main process receive register message:', data);
      const { port1, port2 } = new MessageChannelMain();
      const { processKey: newProcessKey } = data;

      const result = this._regitserProcessIPCPort(newProcessKey, event, port1);

      if (!result) {
        return;
      }

      this._mainProcessAddProcessMessageListener(newProcessKey);
      this._allProcessAddNewProcessMessageListener(newProcessKey, port2);
    });
  }

  /**
   * 注册渲染进程相关信息并保存
   * @param {*} newProcessKey
   * @param {*} event
   * @param {*} messagePort
   * @returns
   */
  _regitserProcessIPCPort(newProcessKey, event, messagePort) {
    const webContents = event.sender;
    const hasPort = !!this.processMessagePortMap[newProcessKey];

    if (hasPort) {
      const error = `processKey: ${newProcessKey} has been regitsered`;
      console.warn(error);
      event.returnValue = {
        success: false,
        message: error,
      };
      return false;
    }

    // 正常注册，保存进程 key 和 messagePort 的映射关系
    this.processMessagePortMap[newProcessKey] = {
      processKey: newProcessKey,
      messagePort,
      webContents,
    };

    event.returnValue = {
      success: true,
    };

    return true;
  }

  /**
   * 主进程监听渲染进程的
   * @param {*} newProcessKey
   */
  _mainProcessAddProcessMessageListener(newProcessKey) {
    const { messagePort } = this.processMessagePortMap[newProcessKey];
    messagePort.start();
    messagePort.on(CHANNEL_MESSAGE, (msg) => {
      const { data } = msg;
      console.log('main process receive message:', data);
      this.handleMessages(data);
    });
  }

  _allProcessAddNewProcessMessageListener(newProcessKey, mainPort) {
    const newProcessWillProviedProcessKey = [this.processKey];
    const newProcessWillProviedPorts = [mainPort];
    for (const item of Object.values(this.processMessagePortMap)) {
      if (item.processKey !== newProcessKey) {
        // 创建渲染进程之间的通信通道
        const { port1, port2 } = new MessageChannelMain();
        // 告知其他渲染进程，有新进程的 key 和 messagePort
        item.webContents.postMessage(
          CHANNEL_RENDER_ADD_PORT,
          { processKey: newProcessKey },
          [port1]
        );

        // 记录新进程需要依赖的其他进程 key 和 messagePort
        newProcessWillProviedProcessKey.push(item.processKey);
        newProcessWillProviedPorts.push(port2);
      }
    }

    // 新渲染进程发送当前全部的进程 key 和 messagePort
    this.processMessagePortMap[newProcessKey].webContents.postMessage(
      CHANNEL_RENDER_PROVIDE_PORT,
      {
        processKey: newProcessKey,
        processKeys: newProcessWillProviedProcessKey,
      },
      newProcessWillProviedPorts
    );
  }
}

module.exports = MainIPC;
