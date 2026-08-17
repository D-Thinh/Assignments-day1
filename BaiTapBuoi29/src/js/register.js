import { redirectIfAuthenticated } from "./auth-guard.js";
import { httpRequest } from "./httpRequest.js";
import { setTokens } from "./storage.js";

const $ = document.querySelector.bind(document);

const form = $("#register-form");
const usernameInput = $("#username");
const displayNameInput = $("#display-name");
const emailInput = $("#email");
const passwordInput = $("#password");
const countryInput = $("#country");
const bioInput = $("#bio");

const usernameError = $("#username-error");
const displayNameError = $("#display-name-error");
const emailError = $("#email-error");
const passwordError = $("#password-error");
const countryError = $("#country-error");
const bioError = $("#bio-error");
const apiError = $("#api-error");
const registerLoading = $("#register-loading");
const registerBtn = $("#register-submit");

function setFieldError(el, message) {
    if (!el) return false;
    el.textContent = message;
    el.classList.add("show");
    return false;
}

function clearFieldError(el) {
    if (!el) return true;
    el.textContent = "";
    el.classList.remove("show");
    return true;
}

function validateUsername() {
    const value = usernameInput.value.trim();
    if (!value) return setFieldError(usernameError, "Username không được để trống.");
    if (value.length < 4) return setFieldError(usernameError, "Username phải có ít nhất 4 ký tự.");
    return clearFieldError(usernameError);
}

function validateDisplayName() {
    const value = displayNameInput.value.trim();
    if (!value) return setFieldError(displayNameError, "Tên hiển thị không được để trống.");
    return clearFieldError(displayNameError);
}

function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) return setFieldError(emailError, "Email không được để trống.");
    if (!emailInput.validity.valid) return setFieldError(emailError, "Email không đúng định dạng.");
    return clearFieldError(emailError);
}

function validatePassword() {
    const value = passwordInput.value;
    if (!value) return setFieldError(passwordError, "Mật khẩu không được để trống.");
    if (value.length < 8) return setFieldError(passwordError, "Mật khẩu phải có ít nhất 8 ký tự.");
    if (!/[A-Z]/.test(value)) return setFieldError(passwordError, "Mật khẩu phải có ít nhất một chữ cái viết hoa.");
    if (!/[a-z]/.test(value)) return setFieldError(passwordError, "Mật khẩu phải có ít nhất một chữ cái viết thường.");
    if (!/[0-9]/.test(value)) return setFieldError(passwordError, "Mật khẩu phải có ít nhất một chữ số.");
    return clearFieldError(passwordError);
}

function validateCountry() {
    const value = countryInput.value.trim();
    if (!value) return setFieldError(countryError, "Quốc gia không được để trống.");
    if (value.length < 2) return setFieldError(countryError, "Quốc gia phải có ít nhất 2 ký tự.");
    return clearFieldError(countryError);
}

function validateBio() {
    const value = bioInput.value.trim();
    if (!value) return setFieldError(bioError, "Bio không được để trống.");
    if (value.length > 200) return setFieldError(bioError, "Bio không được vượt quá 200 ký tự.");
    return clearFieldError(bioError);
}

usernameInput.addEventListener("input", validateUsername);
displayNameInput.addEventListener("input", validateDisplayName);
emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", validatePassword);
countryInput.addEventListener("input", validateCountry);
bioInput.addEventListener("input", validateBio);

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isValid =
        validateUsername() &&
        validateDisplayName() &&
        validateEmail() &&
        validatePassword() &&
        validateCountry() &&
        validateBio();

    if (!isValid) return;

    apiError.hidden = true;
    apiError.textContent = "";
    registerLoading?.classList.remove("hidden");
    if (registerBtn) registerBtn.disabled = true;

    try {
        const { ok, data } = await httpRequest.post("/api/auth/register", {
            username: usernameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value,
            display_name: displayNameInput.value.trim(),
            bio: bioInput.value.trim(),
            country: countryInput.value.trim(),
        });

        if (!ok || data?.error) {
            apiError.textContent = data?.error?.message || "Đăng ký thất bại.";
            apiError.hidden = false;
            return;
        }

        setTokens({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
        });

        window.location.href = "/";
    } finally {
        registerLoading?.classList.add("hidden");
        if (registerBtn) registerBtn.disabled = false;
    }
});

redirectIfAuthenticated();
