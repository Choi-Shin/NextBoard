import { createSlice } from "@reduxjs/toolkit";
import { getUser } from "../lib/user_helper";

const initialState = {
  client: {
    boardType: "",
    detailId: "",
    loginUser: {
      isLogin: false,
      loginId: "",
    },
    dropdownUser: "",
  },
};

export const ReducerSlice = createSlice({
  name: "boardapp",
  initialState,
  reducers: {
    boardTypeAction: (state, action) => {
      state.client.boardType = action.payload;
    },
    detailAction: (state, action) => {
      state.client.detailId = action.payload;
    },
    loginAction: (state, action) => {
      state.client.loginUser = {
        isLogin: true,
        loginId: action.payload,
      };
    },
    logoutAction: (state, action) => {
      state.client.loginUser = {
        isLogin: false,
        loginId: "",
      };
    },
    dropdownAction: (state, action) => {
      state.client.dropdownUser = action.payload;
    },
  },
});

export const {
  boardTypeAction,
  detailAction,
  loginAction,
  logoutAction,
  dropdownAction,
} = ReducerSlice.actions;

export default ReducerSlice.reducer;
