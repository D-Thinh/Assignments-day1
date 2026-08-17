const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
const INFOMATION = "userInfomation";

export function getAccessToken() {
    return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
    return localStorage.getItem(REFRESH_KEY);
}
export function setUserInfomation(data) {
    if (data) localStorage.setItem(INFOMATION, data);
}
export function getUserInfomation(data) {
    return localStorage.getItem(INFOMATION);
}
export function setTokens({ accessToken, refreshToken }) {
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
}
export function clearUserInfomation() {
    localStorage.removeItem(INFOMATION);
}

export function isLoggedIn() {
    return Boolean(getAccessToken());
}
