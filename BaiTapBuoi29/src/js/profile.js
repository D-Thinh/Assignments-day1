import { requireAuth } from "./auth-guard.js";
import { clearTokens } from "./storage.js";

const $ = document.querySelector.bind(document);

const profileLoading = $("#profile-loading");
const profileError = $("#profile-error");
const logoutBtn = $("#logout-btn");

function fillProfile(user) {
    const name = user.display_name || user.username || "User";
    const initial = name.charAt(0).toUpperCase();

    const setText = (id, value) => {
        const el = $(id);
        if (el) el.textContent = value ?? "-";
    };

    setText("#user-name", name);
    setText("#profile-name", name);
    setText("#profile-email", user.email);
    setText("#profile-username", user.username);
    setText("#profile-email-detail", user.email);
    setText("#profile-country", user.country);
    setText("#profile-bio", user.bio);

    const avatar = $("#profile-avatar");
    if (avatar) avatar.textContent = initial;

    const userAvatar = $(".user-avatar");
    if (userAvatar) userAvatar.textContent = initial;
}

async function init() {
    const user = await requireAuth();
    if (!user) return;

    if (profileLoading) {
        profileLoading.classList.add("hidden");
    }
    if (profileError) profileError.classList.add("hidden");
    fillProfile(user);
}

logoutBtn?.addEventListener("click", () => {
    clearTokens();
    window.location.href = "/src/pages/login.html";
});

init().catch((error) => {
    console.error(error);
    if (profileLoading) profileLoading.hidden = true;
    if (profileError) {
        profileError.textContent = "Không tải được thông tin người dùng.";
        profileError.classList.remove("hidden");
    }
});
