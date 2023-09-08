export const API_URL = "/api";

export const API_ROUTES = {
  SIGN_UP: `${API_URL}/auth/signup`,
  SIGN_IN: `${API_URL}/auth/signin`,
  REFRESH_TOKEN: `${API_URL}/auth/refresh-token`,
  LOG_OUT: `${API_URL}/users/logout`,
  USER_PROFILE: `${API_URL}/users/me`,
  USER_COMPLETE: `${API_URL}/users/complete-user`,
  USER_PROFILE_EDIT: `${API_URL}/users`,
  USER_PIC_CHANGE: `${API_URL}/users/pf`,
  USER_FRIENDS: `${API_URL}/users/me/friends`,
  GENERIC_USER_PROFILE: `${API_URL}/users/`,
  GAME_HISTORY_SUFFIX: "/game-history",
  UPLOAD_PROFILE_PIC: `${API_URL}/users/upload-profile-picture`,
  ADD_FRIEND: `${API_URL}/users/add-friend/`,
  GET_LEADERBOARD: `${API_URL}/users/leaderboard`,
  GET_ALL_USERS: `${API_URL}/users/all`,
  ACTIVATE_2FA: `${API_URL}/auth/turn-on`,
  DEACTIVATE_2FA: `${API_URL}/auth/turn-off`,
  AUTHENTICATE_2FA: `${API_URL}/auth/authenticate`,
  STATE_2FA: `${API_URL}/users/me/2fa-state`,
  CURRENT_CHAT: `${API_URL}/users/current-chat`,
  COMPLETE_ROOM: `${API_URL}/users/complete-room`,
  VISIBLE_CHANNELS: `${API_URL}/chat/visible-rooms`,
  HOME_CHECK_TOKEN: `${API_URL}/auth/home`,
};

export const APP_URL = `http://${process.env.REACT_APP_LOCAL_IP}:8000`;

export const SOCKET_GENERAL = "/general";
export const SOCKET_GAME = "/game";
export const SOCKET_CHAT = "/chat";

export const APP_ROUTES = {
  HOME: "/",
  SIGN_IN: "/login",
  SIGN_UP: "/signup",
  LOG_OUT: "/logout",
  DASHBOARD: "/dashboard/*",
  USER_PROFILE: "profile/me",
  USER_PROFILE_ABSOLUTE: "/dashboard/profile/me",
  USER_PROFILE_EDIT: "profile/me/edit",
  USER_PROFILE_EDIT_ABSOLUTE: "/dashboard/profile/me/edit",
  GENERIC_USER_PROFILE: "profile/",
  GENERIC_USER_PROFILE_ABSOLUTE: "/dashboard/profile/",
  MATCHMAKING: "matchmaking",
  MATCHMAKING_ABSOLUTE: "/dashboard/matchmaking",
  PLAY: "play",
  PLAY_ABSOLUTE: "/dashboard/play",
  SPECTATE: "spectate",
  SPECTATE_ABSOLUTE: "/dashboard/spectate",
  USER_FRIENDS: "/profile/me/friends",
  AUTH_2FA: "/profile/me/two-fa",
  LEADERBOARD: "/leaderboard",
  GAME_HISTORY_SUFFIX: "/game-history",
  REDIRECT_PLAY: "/dashboard/redirect-play",
};

export enum APP_SCREENS {
  ME_PROFILE,
  PROFILE_EDIT,
  USER_PROFILE,
  MATCHMAKING,
  PLAY,
  SPECTATE,
  CHAT,
  FRIENDS,
  LEADERBOARD,
  ONLINE_GAMES,
  ALL_USERS,
}
