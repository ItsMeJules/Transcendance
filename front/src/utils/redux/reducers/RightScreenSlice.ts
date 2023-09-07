import { createAction, createReducer } from "@reduxjs/toolkit";
import { APP_SCREENS } from "utils/routing/routing";

interface RightScreenState {
  rightScreenState: APP_SCREENS,
  noGame: boolean,
}

const initialState = {
  rightScreenState: APP_SCREENS.CHAT
} as RightScreenState

export const setRightScreenState = createAction<APP_SCREENS>("rightScreen/setRightScreenState")
export const setRightScreenNoGame = createAction<boolean>("rightScreen/setRightScreenNoGame")

export const rightScreenReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setRightScreenState, (state, action) => {
      state.rightScreenState = action.payload;
    })
    .addCase(setRightScreenNoGame, (state, action) => {
      state.noGame = action.payload;
    })
})