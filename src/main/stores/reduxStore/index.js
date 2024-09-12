const { configureStore, Tuple } = require('@reduxjs/toolkit');
const { initReducers, initialState } = require('./reducers');
const {
  forwardToRenderer,
  replayActionMain,
  replayActionRenderer,
  // forwardToMain,
  forwardToMainWithParams,
} = require('electron-redux');

module.exports = function initReduxStore(preloadedState = initialState, scope) {
  const middleware = [];

  let replayAction;

  if (scope === 'render') {
    middleware.push(forwardToMainWithParams());
    replayAction = replayActionRenderer;
  } else {
    middleware.push(forwardToRenderer);
    replayAction = replayActionMain;
  }

  const store = configureStore({
    reducer: initReducers(),
    middleware: () => new Tuple(...middleware),
    preloadedState,
  });

  replayAction(store);

  return store;
};
