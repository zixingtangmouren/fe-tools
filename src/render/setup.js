const remote = require('@electron/remote');
const RenderIPC = require('../main/IPC/RenderIPC');

function initMaster({ processKey }) {
  const Master = remote.getGlobal('master');
  const { services } = Master;

  const ipc = new RenderIPC({ processKey });

  const newMaster = {
    services: {
      ipc,
      windowService: services.windowService,
    },
  };

  window.master = newMaster;
}
