import { httpRequest } from "./httpRequest.js";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./storage.js";

async function requestWithMethod(path, options, token) {
    const method = (options.method || "GET").toUpperCase();
    if (method === "POST") {
        return httpRequest.post(path, options.body, { ...options, token });
    }
    return httpRequest.get(path, { ...options, token });
}

export async function refreshAccessToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    const { ok, data } = await httpRequest.post("/api/auth/refresh-token", null, {
        token: refreshToken,
    });

    if (!ok || !data?.access_token) {
        clearTokens();
        return null;
    }

    setTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
    });

    return data.access_token;
}

/** Gọi API có Bearer; nếu 401 thì refresh rồi thử lại 1 lần. */
export async function apiFetch(path, options = {}) {
    let accessToken = getAccessToken();
    let result = await requestWithMethod(path, options, accessToken);

    if (result.status === 401) {
        accessToken = await refreshAccessToken();
        if (!accessToken) {
            return result;
        }
        result = await requestWithMethod(path, options, accessToken);
    }

    return result;
}

/** Trang cần đăng nhập: không có token / me fail → login. */
export async function requireAuth() {
    if (!getAccessToken()) {
        window.location.href = "/src/pages/login.html";
        return null;
    }

    const result = await apiFetch("/api/users/me");
    if (!result.ok || !result.data?.user) {
        clearTokens();
        window.location.href = "/src/pages/login.html";
        return null;
    }

    return result.data.user;
}

/** Trang login/register: đã login thì về trang chủ. */
export async function redirectIfAuthenticated() {
    if (!getAccessToken()) return;

    const result = await apiFetch("/api/users/me");
    if (result.ok && result.data?.user) {
        window.location.href = "/";
    }
}
