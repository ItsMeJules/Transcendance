import { AnyAction, Reducer, combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import ChannelSlice from './reducers/ChannelSlice';
import { userReducer } from './reducers/UserSlice';

const appReducer = combineReducers({
  channels: ChannelSlice,
  user: persistReducer({ key: "user", storage }, userReducer),
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
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof appReducer>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch<AppDispatch>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector