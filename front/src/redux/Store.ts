import { AnyAction, Reducer, combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

import { channelReducer } from './slices/ChannelReducer'
import { userReducer } from './slices/UserReducer'

const appReducer = combineReducers({
  channels: channelReducer,
  user: persistReducer({ key: "root", storage }, userReducer),
})

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === "user/unsetUser") {
    storage.removeItem('persist:root')

    return appReducer(undefined, action)
  }
  return appReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk]
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof appReducer>
export type AppDispatch = typeof store.dispatch