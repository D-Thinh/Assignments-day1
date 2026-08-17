import { httpRequest } from "./httpRequest.js";
import {
    clearTokens,
    getUserInfomation,
    clearUserInfomation,
} from "./storage.js";

const $ = document.querySelector.bind(document);

const userName = $("#user-name");
const albumsGrid = $("#albums-grid");
const tracksList = $("#tracks-list");
const artistsGrid = $("#artists-grid");
const playlistsGrid = $("#playlists-grid");
const logoutBtn = $("#logout-btn");

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatPlayCount(count) {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count;
}

function formatListeners(count) {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count;
}

function loadAlbums(albums) {
    if (!albums?.length) {
        albumsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">♫</div>
                <h3>Chưa có album</h3>
                <p>Hiện tại chưa có album nào để hiển thị.</p>
            </div>`;
        return;
    }

    albumsGrid.innerHTML = albums
        .map(
            (album) => `
            <article class="album-card">
                <div class="album-cover-wrapper">
                    <img class="album-cover" src="${album.cover_image_url}" alt="${album.title}" loading="lazy" />
                    <button class="album-play-btn" data-album-id="${album.id}" aria-label="Phát ${album.title}">▶</button>
                </div>
                <div class="album-info">
                    <h3 class="album-title">${album.title}</h3>
                    <p class="album-artist">${album.artist_name}</p>
                    <div class="album-meta">
                        <span>${album.total_tracks} bài hát</span>
                        <span class="meta-dot">•</span>
                        <span>${album.release_date}</span>
                    </div>
                </div>
            </article>`,
        )
        .join("");
}

function loadTracks(tracks) {
    if (!tracks?.length) {
        tracksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fa-solid fa-music"></i></div>
                <h3>Chưa có bài hát</h3>
                <p>Hiện tại chưa có bài hát nào để hiển thị.</p>
            </div>`;
        return;
    }

    tracksList.innerHTML = tracks
        .slice(0, 10)
        .map(
            (track, index) => `
            <div class="song-item" data-id="${track.id}">
                <div class="song-number">${index + 1}</div>
                <div class="song-image">
                    <img src="${track.image_url}" alt="${track.title}">
                </div>
                <div class="song-info">
                    <h3>${track.title}</h3>
                    <p>${track.artist_name}</p>
                </div>
                <div class="song-album">${track.album_title ?? ""}</div>
                <div class="song-play-count">${formatPlayCount(track.play_count)}</div>
                <div class="song-duration">${formatDuration(track.duration)}</div>
                <button class="like-btn ${track.is_liked ? "liked" : ""}">
                    <i class="fa-${track.is_liked ? "solid" : "regular"} fa-heart"></i>
                </button>
                <button class="play-btn" data-audio="${track.audio_url}">
                    <i class="fa-solid fa-play"></i>
                </button>
            </div>`,
        )
        .join("");
}

function loadArtists(artists) {
    if (!artists?.length) {
        artistsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fa-solid fa-user-music"></i></div>
                <h3>Chưa có nghệ sĩ</h3>
                <p>Hiện tại chưa có nghệ sĩ nào để hiển thị.</p>
            </div>`;
        return;
    }

    artistsGrid.innerHTML = artists
        .map(
            (artist) => `
            <div class="artist-card" data-id="${artist.id ?? ""}">
                <div class="artist-image-wrapper">
                    <img src="${artist.image_url ?? ""}" alt="${artist.name ?? "Nghệ sĩ"}" />
                    ${
                        artist.is_verified
                            ? `<span class="verified-badge"><i class="fa-solid fa-check"></i></span>`
                            : ""
                    }
                </div>
                <h3>${artist.name ?? "Không rõ nghệ sĩ"}</h3>
                <p>${formatListeners(artist.monthly_listeners ?? 0)} người nghe hàng tháng</p>
            </div>`,
        )
        .join("");
}

function loadPlaylists(tracks) {
    if (!tracks?.length) {
        playlistsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fa-solid fa-list-music"></i></div>
                <h3>Chưa có playlist</h3>
                <p>Hiện tại chưa có playlist nào để hiển thị.</p>
            </div>`;
        return;
    }

    const playlistMap = new Map();

    tracks.forEach((track) => {
        if (!track.album_id) return;

        if (!playlistMap.has(track.album_id)) {
            playlistMap.set(track.album_id, {
                id: track.album_id,
                title: track.album_title ?? "Playlist không tên",
                image: track.album_cover_image_url ?? track.image_url,
                tracks: [],
            });
        }

        playlistMap.get(track.album_id).tracks.push(track);
    });

    const playlists = Array.from(playlistMap.values());

    if (!playlists.length) {
        playlistsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fa-solid fa-list-music"></i></div>
                <h3>Chưa có playlist</h3>
                <p>Không tìm thấy playlist từ danh sách bài hát.</p>
            </div>`;
        return;
    }

    playlistsGrid.innerHTML = playlists
        .map(
            (playlist) => `
            <div class="playlist-card" data-id="${playlist.id}">
                <div class="playlist-cover">
                    <img src="${playlist.image ?? ""}" alt="${playlist.title}" />
                    <button class="playlist-play-btn" data-playlist-id="${playlist.id}">
                        <i class="fa-solid fa-play"></i>
                    </button>
                </div>
                <div class="playlist-info">
                    <h3>${playlist.title}</h3>
                    <p>${playlist.tracks.length} bài hát</p>
                </div>
            </div>`,
        )
        .join("");
}
function getInfomation() {
    const userInfomation = getUserInfomation();
    userName.textContent = "Umknow";
    console.log();
    if (userInfomation) {
        userName.textContent = JSON.parse(userInfomation).username;
    }
}

function getApiErrorMessage(result, fallback) {
    return (
        result?.data?.error?.message ||
        result?.data?.message ||
        fallback
    );
}

function showSectionError(container, title, result) {
    if (!container) return;

    const message = getApiErrorMessage(
        result,
        "Không thể tải dữ liệu. Vui lòng thử lại sau.",
    );

    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">!</div>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>`;
}

async function init() {
    getInfomation();
    const [albumsRes, tracksRes, artistsRes] = await Promise.all([
        httpRequest.get("/api/albums?limit=20&offset=0"),
        httpRequest.get("/api/tracks?limit=50&offset=0"),
        httpRequest.get("/api/artists?limit=20&offset=0"),
    ]);

    if (albumsRes.ok) {
        loadAlbums(albumsRes.data?.albums);
    } else {
        showSectionError(albumsGrid, "Không tải được album", albumsRes);
    }

    if (tracksRes.ok) {
        loadTracks(tracksRes.data?.tracks);
        loadPlaylists(tracksRes.data?.tracks);
    } else {
        showSectionError(tracksList, "Không tải được bài hát", tracksRes);
        showSectionError(playlistsGrid, "Không tải được playlist", tracksRes);
    }

    if (artistsRes.ok) {
        loadArtists(artistsRes.data?.artists);
    } else {
        showSectionError(artistsGrid, "Không tải được nghệ sĩ", artistsRes);
    }
}

logoutBtn?.addEventListener("click", () => {
    clearTokens();
    clearUserInfomation();
    window.location.href = "/src/pages/login.html";
});

init();
