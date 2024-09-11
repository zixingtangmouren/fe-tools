const { ipcRenderer } = require('electron');
const BaseIPC = require('./BaseIPC');
const {
  CHANNEL_RENDER_REGITSER,
  CHANNEL_RENDER_ADD_PORT,
  CHANNEL_RENDER_PROVIDE_PORT,
} = require('./constants');

class RenderIPC extends BaseIPC {
  constructor(props) {
    super({
      ...props,
      namespace: 'render',
    });
    this._init();
  }

  _init() {
    this._registerRenderICPToMain();
    this._addRenderProcessMessageListener();
  }

  _registerRenderICPToMain() {
    const result = ipcRenderer.sendSync(CHANNEL_RENDER_REGITSER, {
      processKey: this.processKey,
    });

    if (!result.success) {
      console.error('registerRenderICPToMain error:', result.message);
      return;
    }

    console.log('registerRenderICPToMain success:', result);
  }

  _addRenderProcessMessageListener() {
    ipcRenderer.once(CHANNEL_RENDER_PROVIDE_PORT, (event, data) => {
      console.log('receive provide port message:', data, event.ports);
      const { processKeys } = data;
      const ports = event.ports;

      processKeys.forEach((processKey, index) => {
        this._regitserProcessIPCPort(processKey, ports[index]);
        this._addMessagePortListener(ports[index]);
      });
    });

    ipcRenderer.on(CHANNEL_RENDER_ADD_PORT, (event, data) => {
      console.log('receive add port message:', data, event.ports);
      const { processKey } = data;
      const messagePort = event.ports[0];
      this._regitserProcessIPCPort(processKey, messagePort);
      this._addMessagePortListener(messagePort);
    });
  }

  _regitserProcessIPCPort(processKey, messagePort) {
    this.processMessagePortMap[processKey] = {
      processKey,
      messagePort,
    };
  }

  _addMessagePortListener(messagePort) {
    messagePort.onmessage = (event) => {
      console.log('messagePort receive message:', event.data);
      this.handleMessages(event.data);
    };
  }
}

module.exports = RenderIPC;
