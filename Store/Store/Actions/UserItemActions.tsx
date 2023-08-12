import { UserData } from "../UserItem";

export const SET_USER_DATA = 'SET_USER_DATA';

export function setUserData(userData: any) {
    return {
        type:SET_USER_DATA,
        payload:userData,
    };
}