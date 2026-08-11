const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const elements = {
    location: $("#location"),
    browser: $("#browser"),
    online: $("#online-status"),
    onlineIcon: $("#online-status-icon"),
    os: $("#os"),
    languages: $("#languages"),
    screenSize: $("#screen-size"),
    orientation: $("#orientation"),
};

// --- Mappings ---
const LANGUAGE_MAP = {
    "vi-VN": "Tiếng Việt",
    "en-US": "English",
};

const ORIENTATION_MAP = {
    "landscape-primary": "Ngang",
    "landscape-secondary": "Ngang",
    "portrait-primary": "Dọc",
    "portrait-secondary": "Dọc",
};

// logic
async function updateLocation() {
    if (!navigator.geolocation) {
        elements.location.textContent = "Trình duyệt không hỗ trợ định vị";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                );

                if (!response.ok) throw new Error("Không thể lấy địa chỉ");

                const data = await response.json();
                elements.location.textContent = data.display_name;
            } catch (error) {
                console.error("Reverse geocoding error:", error);
                elements.location.textContent = "Không thể xác định địa chỉ";
            }
        },
        (error) => {
            console.error("Geolocation error:", error);
            elements.location.textContent = "Không thể lấy vị trí";
        },
    );
}

function getBrowserName() {
    const ua = navigator.userAgent;
    if (ua.includes("Edg")) return "Microsoft Edge";
    if (ua.includes("Chrome")) return "Google Chrome";
    if (ua.includes("Firefox")) return "Mozilla Firefox";
    if (ua.includes("Safari")) return "Safari";
    return "Unknown Browser";
}

function updateBrowser() {
    elements.browser.innerHTML = getBrowserName();
}

function updateOnlineStatus() {
    const isOnline = navigator.onLine;
    elements.onlineIcon.classList.toggle("offline", !isOnline);
    elements.online.innerHTML = isOnline ? "Online" : "Offline";
}

function getOperatingSystem() {
    const ua = navigator.userAgent;
    if (/Windows/i.test(ua)) return "Windows";
    if (/Mac OS X/i.test(ua)) return "macOS";
    if (/Android/i.test(ua)) return "Android";
    if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
    if (/Linux/i.test(ua)) return "Linux";
    return "Unknown OS";
}

function updateOS() {
    elements.os.innerHTML = getOperatingSystem();
}

function updateLanguages() {
    const languageValue = navigator.languages.map((lang) => LANGUAGE_MAP[lang]);
    elements.languages.innerHTML = languageValue.join(" ");
}

function updateScreenSize() {
    elements.screenSize.innerHTML = `${screen.width} x ${screen.height} (px)`;
}

function updateOrientation() {
    elements.orientation.innerHTML =
        ORIENTATION_MAP[screen.orientation.type] || "Không xác định";
}

// --- Init ---
function initDeviceInfo() {
    updateLocation();
    updateBrowser();
    updateOnlineStatus();
    updateOS();
    updateLanguages();
    updateScreenSize();
    updateOrientation();

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    screen.orientation?.addEventListener("change", updateOrientation);
}

initDeviceInfo();

const navLink = $$(".nav-link");
const fingerBtn = $("#finger-btn");
const homeBtn = $("#home-btn");
const fingerPage = $("#fingerprint-page");
const homePage = $("#home-page");
const fingerLinkPage = $("#fingerprint-link");
const backHomePage = $("#back-home");

const systemInfo = {
    location: elements.location.textContent,
    browser: elements.browser.textContent,
    online: elements.online.textContent,
    os: elements.os.textContent,
    languages: elements.languages.textContent,
    screenSize: elements.screenSize.textContent,
    orientation: elements.orientation.textContent,
};
const getSystemInfo = () => {
    return {
        location: elements.location.textContent,
        browser: elements.browser.textContent,
        online: elements.online.textContent,
        os: elements.os.textContent,
        languages: elements.languages.textContent,
        screenSize: elements.screenSize.textContent,
        orientation: elements.orientation.textContent,
    };
};

const renderStateData = () => {
    const systemInfo = history.state?.systemInfo;

    if (!systemInfo) {
        stateData.textContent = "Không có dữ liệu từ trang chủ";
        return;
    }

    stateData.innerHTML = `
        <div class="state-item">
            <span>Vị trí</span>
            <strong>${systemInfo.location}</strong>
        </div>

        <div class="state-item">
            <span>Trình duyệt</span>
            <strong>${systemInfo.browser}</strong>
        </div>

        <div class="state-item">
            <span>Trạng thái</span>
            <strong>${systemInfo.online}</strong>
        </div>

        <div class="state-item">
            <span>Hệ điều hành</span>
            <strong>${systemInfo.os}</strong>
        </div>

        <div class="state-item">
            <span>Ngôn ngữ</span>
            <strong>${systemInfo.languages}</strong>
        </div>

        <div class="state-item">
            <span>Kích thước màn hình</span>
            <strong>${systemInfo.screenSize}</strong>
        </div>

        <div class="state-item">
            <span>Hướng màn hình</span>
            <strong>${systemInfo.orientation}</strong>
        </div>
    `;
};

const stateData = $("#state-data");

const showHomePage = () => {
    homePage.classList.remove("home-page-disable");
    fingerPage.classList.add("fingerprint-page-disable");
};

const showFingerprintPage = () => {
    homePage.classList.add("home-page-disable");
    fingerPage.classList.remove("fingerprint-page-disable");

    renderStateData();
    renderFingerprint();
    navLink.forEach((i) => i.classList.remove("active"));
    fingerBtn.classList.add("active");
};

fingerBtn.addEventListener("click", () => {
    event.preventDefault();
    pushFingerprintPage();
});

fingerLinkPage.addEventListener("click", () => {
    event.preventDefault();
    pushFingerprintPage();
});

function pushFingerprintPage() {
    const systemInfo = getSystemInfo();
    if (location.pathname === "/BaiTapBuoi27/fingerprint") {
        return;
    }
    history.pushState(
        {
            page: "Fingerprinting",
            systemInfo: systemInfo,
        },
        "",
        "#fingerprint",
    );
    homePage.classList.add("home-page-disable");
    fingerPage.classList.remove("fingerprint-page-disable");
    navLink.forEach((i) => i.classList.remove("active"));
    fingerBtn.classList.add("active");
    renderStateData();
}

window.addEventListener("popstate", () => {
    if (history.state?.page === "Fingerprinting") {
        showFingerprintPage();
    } else {
        showHomePage();
    }
    navLink.forEach((i) => i.classList.remove("active"));
    homeBtn.classList.add("active");
});

if (location.hash === "#fingerprint") {
    history.replaceState(null, "", location.pathname);

    showHomePage();
}

backHomePage.addEventListener("click", () => {
    event.preventDefault();
    history.replaceState(null, "", location.pathname);
    showHomePage();
    navLink.forEach((i) => i.classList.remove("active"));
    homeBtn.classList.add("active");
});
