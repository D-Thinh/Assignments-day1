import { httpRequest } from "./httpRequest.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const registerRes = $("#register-form");

const usernameInput = $("#username");
const displayNameInput = $("#display-name");

const emailInput = $("#email");
const passwordInput = $("#password");

const countryInput = $("#country");
const bioInput = $("#bio");

const usernameError = $("#api-error");
const apiError = $("#api-error");
const displayNameError = $("#display-name-error");
const emailError = $("#email-error");
const passwordError = $("#password-error");
const countryError = $("#country-error");
const bioError = $("#bio-error");

function validateUsername() {
    const value = usernameInput.value.trim();

    if (!value) {
        usernameError.textContent = "Username không được để trống.";
        usernameError.classList.add("show");
        return false;
    }

    if (value.length < 4) {
        usernameError.textContent = "Username phải có ít nhất 4 ký tự.";
        usernameError.classList.add("show");
        return false;
    }

    usernameError.textContent = "";
    usernameError.classList.remove("show");

    return true;
}
function validateDisplayName() {
    const value = displayNameInput.value.trim();

    if (!value) {
        displayNameError.textContent = "Tên hiển thị không được để trống.";
        displayNameError.classList.add("show");

        return false;
    }

    displayNameError.textContent = "";
    displayNameError.classList.remove("show");

    return true;
}

function validateEmail() {
    const value = emailInput.value.trim();

    if (!value) {
        emailError.textContent = "Email không được để trống.";
        emailError.classList.add("show");

        return false;
    }

    if (!emailInput.validity.valid) {
        emailError.textContent = "Email không đúng định dạng.";
        emailError.classList.add("show");

        return false;
    }

    emailError.textContent = "";
    emailError.classList.remove("show");

    return true;
}
function validatePassword() {
    const value = passwordInput.value;

    if (!value) {
        passwordError.textContent = "Mật khẩu không được để trống.";
        passwordError.classList.add("show");

        return false;
    }

    if (value.length < 8) {
        passwordError.textContent = "Mật khẩu phải có ít nhất 8 ký tự.";
        passwordError.classList.add("show");

        return false;
    }

    if (!/[A-Z]/.test(value)) {
        passwordError.textContent =
            "Mật khẩu phải có ít nhất một chữ cái viết hoa.";
        passwordError.classList.add("show");

        return false;
    }

    if (!/[a-z]/.test(value)) {
        passwordError.textContent =
            "Mật khẩu phải có ít nhất một chữ cái viết thường.";
        passwordError.classList.add("show");

        return false;
    }

    if (!/[0-9]/.test(value)) {
        passwordError.textContent = "Mật khẩu phải có ít nhất một chữ số.";
        passwordError.classList.add("show");

        return false;
    }

    passwordError.textContent = "";
    passwordError.classList.remove("show");

    return true;
}
function validateCountry() {
    const value = countryInput.value.trim();

    if (!value) {
        countryError.textContent = "Quốc gia không được để trống.";
        countryError.classList.add("show");

        return false;
    }

    if (value.length < 2) {
        countryError.textContent = "Quốc gia phải có ít nhất 2 ký tự.";
        countryError.classList.add("show");

        return false;
    }

    countryError.textContent = "";
    countryError.classList.remove("show");

    return true;
}
function validateBio() {
    const value = bioInput.value.trim();

    if (!value) {
        bioError.textContent = "Bio không được để trống.";
        bioError.classList.add("show");

        return false;
    }

    if (value.length > 200) {
        bioError.textContent = "Bio không được vượt quá 200 ký tự.";
        bioError.classList.add("show");

        return false;
    }

    bioError.textContent = "";
    bioError.classList.remove("show");

    return true;
}

usernameInput.addEventListener("input", validateUsername);
displayNameInput.addEventListener("input", validateDisplayName);
emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", validatePassword);
countryInput.addEventListener("input", validateCountry);
bioInput.addEventListener("input", validateBio);

registerRes.addEventListener("submit", async (event) => {
    event.preventDefault();
    const isValid =
        validateUsername() &&
        validateDisplayName() &&
        validateEmail() &&
        validatePassword() &&
        validateCountry() &&
        validateBio();

    if (!isValid) {
        return;
    }
    const res = await httpRequest.post("/api/auth/register", {
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        display_name: displayNameInput.value.trim(),
        bio: bioInput.value.trim(),
        country: countryInput.value.trim(),
    });
    if (res.error) {
        apiError.textContent = res.error.message;
        apiError.hidden = false;
    }
    localStorage.setItem("accessToken", res.access_token);
    localStorage.setItem("refreshToken", res.refresh_token);
    window.location.href = "../../../index.html";
});

async function init() {}

init();
