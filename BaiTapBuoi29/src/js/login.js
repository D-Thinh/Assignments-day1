import { redirectIfAuthenticated } from "./auth-guard.js";
import { httpRequest } from "./httpRequest.js";
import { setTokens, setUserInfomation } from "./storage.js";

const $ = document.querySelector.bind(document);

const form = $("#login-form");
const emailInput = $("#email");
const passwordInput = $("#password");
const loginError = $("#login-error");
const loginLoading = $("#login-loading");
const loginBtn = $("#login-btn");

redirectIfAuthenticated();

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    loginError.classList.add("hidden");
    loginError.textContent = "";
    loginLoading?.classList.remove("hidden");
    if (loginBtn) loginBtn.disabled = true;

    const { ok, data, status } = await httpRequest.post("/api/auth/login", {
        email: emailInput.value.trim(),
        password: passwordInput.value,
    });

    loginLoading?.classList.add("hidden");
    if (loginBtn) loginBtn.disabled = false;

    if (!ok || data?.error || status === 401) {
        loginError.textContent =
            data?.error?.message || "Email hoặc mật khẩu không đúng.";
        loginError.classList.remove("hidden");
        return;
    }
    setUserInfomation(JSON.stringify(data.user));
    setTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
    });

    window.location.href = "/";
});
