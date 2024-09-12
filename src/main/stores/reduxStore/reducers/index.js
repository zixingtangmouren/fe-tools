const userSlice = require('./user');
const counterSlice = require('./counter');

const initialState = {
  user: null,
  counter: {
    value: 0,
  },
};

function initReducers() {
  return {
    user: userSlice.reducer,
    counter: counterSlice.reducer,
  };
}

module.exports = {
  initReducers,
  initialState,
};
