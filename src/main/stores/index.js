const { createStore, applyMiddleware } = require('redux');

function reducer(state = { num: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { num: state.num + 1 };
    case 'DECREMENT':
      return { num: state.num - 1 };
    default:
      return state;
  }
}

const myMiddleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    // 中间件逻辑
    console.log('before', action);
    return next(action);
  };

const store = createStore(reducer, { num: 0 }, applyMiddleware(myMiddleware));

store.subscribe(() => console.log(store.getState()));

store.dispatch({ type: 'INCREMENT' });
// {value: 1}
store.dispatch({ type: 'INCREMENT' });
// {value: 2}
store.dispatch({ type: 'DECREMENT' });
