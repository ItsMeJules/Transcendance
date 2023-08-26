import { createAction, createReducer } from "@reduxjs/toolkit";

import { UserData } from "../../Services/User";

interface UserDataState {
  userData: UserData
}

const initialState = {
  userData: {
    id: null,
    createdAt: null,
    updatedAt: null,
    email: null,
    firstName: null,
    lastName: null,
    username: null,
    profilePicture: null,
    gamesPlayed: null,
    gamesWon: null,
    userPoints: null,
    userLevel: null,
    isOnline: null,
    activeChannel: null,
  }
} as UserDataState

export const setUser = createAction<UserData>("user/setUser")
export const unsetUser = createAction("user/unsetUser")

export const setUserActiveChannel = createAction<string>("user/setUserActiveChannel")

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setUser, (state, action) => { state.userData = action.payload })
    .addCase(unsetUser, (state, action) => { })
    .addCase(setUserActiveChannel, (state, action) => { state.userData.activeChannel = action.payload })
})