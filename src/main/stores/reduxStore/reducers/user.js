const { createSlice } = require('@reduxjs/toolkit');

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
  },
  reducers: {
    updateUserInfo: (state, action) => {
      state.user = action.payload;
    },
  },
});

module.exports = userSlice;
