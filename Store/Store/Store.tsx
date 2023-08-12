import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { type } from "os";
import { createStore, combineReducers } from 'redux';
import userReducer from "./UserItem";

const store = () => configureStore({
    reducer: {
    user: userReducer,
    },
    devTools: true,
  });
  
  export type AppStore = ReturnType<typeof store>;
  export type AppState = ReturnType<AppStore["getState"]>;
  export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

  export default store;


// const rootReducer = combineReducers({
//   user: userReducer,
//   // Other reducers can be added here if needed
// });

// const store = createStore(rootReducer);

// export default store;
