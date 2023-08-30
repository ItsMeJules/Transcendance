import { createAction, createReducer } from "@reduxjs/toolkit";

import { UserData } from "services/User/User";

interface UserDataState {
  userData: {
    id: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    profilePicture: string | null;
    gamesPlayed: number | null;
    gamesWon: number | null;
    userPoints: number | null;
    userLevel: number | null;
    isOnline: boolean | null;
    currentRoom: string | null;
  }
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
    currentRoom: null,
  }
} as UserDataState

export const setUser = createAction<UserData>("user/setUser")
export const unsetUser = createAction("user/unsetUser")

export const setUserActiveChannel = createAction<string>("user/setUserActiveChannel")

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setUser, (state, action) => {
      console.log(action.payload)
      state.userData = action.payload
    })
    .addCase(unsetUser, (state, action) => { state.userData = initialState.userData })
    .addCase(setUserActiveChannel, (state, action) => { state.userData.currentRoom = action.payload })
})
