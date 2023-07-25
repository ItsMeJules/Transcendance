const API_URL = 'http://localhost:3000'

export const API_ROUTES = {
    SIGN_UP: `${API_URL}/auth/signup`,
    SIGN_IN: `${API_URL}/auth/signin`,
    USER_PROFILE: `${API_URL}/users/me`,
    USER_PROFILE_EDIT: `${API_URL}/users`,
    UPLOAD_PROFILE_PIC: `${API_URL}/users/upload-profile-picture`,
}

export const APP_ROUTES = {
    HOME:               '/',
    SIGN_IN:            '/login',
    SIGN_UP:            '/signup',
    USER_PROFILE:       '/profile/me',
    USER_PROFILE_EDIT:  '/profile/me/edit',
}