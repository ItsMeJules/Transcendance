import { AnyAction, Reducer, combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import ChannelSlice from './reducers/ChannelSlice';
import { userReducer } from './reducers/UserSlice';

const reduxPersistActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

const appReducer = combineReducers({
  channels: ChannelSlice,
  user: persistReducer({ key: "user", storage }, userReducer),
})

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === "user/unsetUser") {
    storage.removeItem('persist:user')
    return appReducer(undefined, action)
  }
  return appReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [...reduxPersistActions],
      },
    }),
})

export const persistor = persistStore(store, null);

export type RootState = ReturnType<typeof appReducer>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch<AppDispatch>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector