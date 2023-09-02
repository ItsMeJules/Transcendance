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
    blockedUsers: number[];
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
    blockedUsers: [],
  }
} as UserDataState

export const setUser = createAction<any>("user/setUser")
export const unsetUser = createAction("user/unsetUser")
export const addUserBlocked = createAction<number>("user/addUserBlocked")
export const removeUserBlocked = createAction<number>("user/removeUserBlocked")

export const setUserActiveChannel = createAction<string>("user/setUserActiveChannel")

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setUser, (state, action) => {
      const { blockedUsers, ...payload } = action.payload
      const blockedUsersId = blockedUsers.map((item: any) => item.id)
      const newState = {
        ...payload,
        blockedUsers: blockedUsersId,
      }

      state.userData = newState
    })
    .addCase(unsetUser, (state, action) => { state.userData = initialState.userData })
    .addCase(addUserBlocked, (state, action) => { state.userData.blockedUsers.push(action.payload) })
    .addCase(removeUserBlocked, (state, action) => { 
      state.userData.blockedUsers = state.userData.blockedUsers.filter(id => id !== action.payload) 
    })
    .addCase(setUserActiveChannel, (state, action) => { state.userData.currentRoom = action.payload })
})
