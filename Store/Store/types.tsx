import { UserData } from "./Store/UserItem";

export type RootState = {
    user: UserData;
    // someOtherReducer: SomeOtherState;
    // Add more properties for other reducers
  };