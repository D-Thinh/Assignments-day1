const form = $("#register-form");

const username = $("#username");
const email = $("#email");
const password = $("#password");
const confirmPassword = $("#confirm-password");
const submitBtn = $("#submit-btn");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log(form);
    if (
        validateUsername(username) &&
        validateEmail(email) &&
        validatePassword(password) &&
        validateConfirmPassword(confirmPassword)
    ) {
        const successMessage = document.createElement("p");
        successMessage.textContent = "Đăng ký thành công!";
        successMessage.classList.add("success-message");
        form.appendChild(successMessage);
        form.reset();
    }

    console.log(username.value);
});

username.addEventListener("input", function () {
    validateUsername(username);
    updateSubmitButton();
});

email.addEventListener("input", function () {
    validateEmail(email);
    updateSubmitButton();
});
password.addEventListener("input", function () {
    validatePassword(password);

    if (confirmPassword.value.trim() !== "") {
        validateConfirmPassword(confirmPassword);
    }
    updateSubmitButton();
});

confirmPassword.addEventListener("input", function () {
    validateConfirmPassword(confirmPassword);
    updateSubmitButton();
});

function updateSubmitButton() {
    submitBtn.disabled = !isFormValid();
}

function isFormValid() {
    return (
        validateUsername($("#username")) &&
        validateEmail($("#email")) &&
        validatePassword($("#password")) &&
        validateConfirmPassword($("#confirm-password"))
    );
}

function validateUsername(value) {
    const regex = /^[A-Za-z0-9_]{4,}$/;
    const userNameError = $("#username-error");
    if (!regex.test(value.value.trim())) {
        userNameError.textContent = "Tên đăng nhập không hợp lệ";
        return false;
    } else {
        userNameError.textContent = "";
        return true;
    }
}

function validateEmail(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailError = $("#email-error");
    if (!regex.test(value.value.trim())) {
        emailError.textContent = "Email không hợp lệ";
        return false;
    } else {
        emailError.textContent = "";
        return true;
    }
}
function validatePassword(value) {
    const regex = /^(?=.*\d).{8,}$/;
    const passwordError = $("#password-error");

    if (!regex.test(value.value.trim())) {
        passwordError.textContent = "Mật khẩu không hợp lệ";
        return false;
    } else {
        passwordError.textContent = "";
        return true;
    }
}
function validateConfirmPassword(value) {
    const password = $("#password");
    const confirmPasswordError = $("#confirm-password-error");
    if (value.value.trim() !== password.value.trim()) {
        confirmPasswordError.textContent = "Mật khẩu không khớp";
        return false;
    } else {
        confirmPasswordError.textContent = "";
        return true;
    }
}
