export const API_URL = "/api";

export const API_ROUTES = {
  SIGN_UP: `${API_URL}/auth/signup`,
  SIGN_IN: `${API_URL}/auth/signin`,
  LOG_OUT: `${API_URL}/users/logout`,
  USER_PROFILE: `${API_URL}/users/me`,
  USER_PROFILE_EDIT: `${API_URL}/users`,
  USER_PIC_CHANGE: `${API_URL}/users/pf`,
  USER_FRIENDS: `${API_URL}/users/me/friends`,
  GENERIC_USER_PROFILE: `${API_URL}/users/`,
  UPLOAD_PROFILE_PIC: `${API_URL}/users/upload-profile-picture`,
  ADD_FRIEND: `${API_URL}/users/add-friend/`,
  GET_LEADERBOARD: `${API_URL}/users/leaderboard`,
  GET_ALL_USERS: `${API_URL}/users/all`,
  ACTIVATE_2FA: `${API_URL}/auth/turn-on`,
  DEACTIVATE_2FA: `${API_URL}/auth/turn-off`,
  CURRENT_CHAT: `${API_URL}/users/current-chat`,
  AUTHENTICATE_2FA: `${API_URL}/auth/authenticate`,
};

export const APP_URL = "http://localhost:8000";

export const SOCKET_GENERAL = "/general";
export const SOCKET_GAME = "/game";
export const SOCKET_CHAT = "/chat";

export const APP_ROUTES = {
  HOME: "/",
  SIGN_IN: "/login",
  SIGN_UP: "/signup",
  LOG_OUT: "/logout",
  USER_PROFILE: "/profile/me",
  USER_PROFILE_EDIT: "/profile/me/edit",
  USER_FRIENDS: "/profile/me/friends",
  LOG_2FA: "/profile/me/two-fa",
  GENERIC_USER_PROFILE: "/profile/",
  LEADERBOARD: "/leaderboard",
};
