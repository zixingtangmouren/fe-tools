const remote = require('@electron/remote');
const RenderIPC = require('../main/IPC/RenderIPC');
const initReduxStore = require('../main/stores/reduxStore');
const counterSlice = require('../main/stores/reduxStore/reducers/counter');

function initMaster({ processKey }) {
  const Master = remote.getGlobal('master');
  const { services, stores } = Master;

  const ipc = new RenderIPC({ processKey });

  const state = stores.reduxStore.getState();
  const reduxStore = initReduxStore(state, 'render');

  setTimeout(() => {
    console.log('increment', counterSlice.actions.increment());
    reduxStore.dispatch(counterSlice.actions.increment());
  }, 3001);

  const newMaster = {
    services: {
      ipc,
      windowService: services.windowService,
    },
    stores: {
      reduxStore,
    },
  };

  window.master = newMaster;
}
