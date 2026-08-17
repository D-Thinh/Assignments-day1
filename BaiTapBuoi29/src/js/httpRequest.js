const baseUrl = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (options.token) {
        headers.Authorization = `Bearer ${options.token}`;
    }

    try {
        const res = await fetch(`${baseUrl}${path}`, {
            ...options,
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        const data = await res.json().catch(() => null);

        return { ok: res.ok, status: res.status, data };
    } catch (error) {
        console.error("HTTP error:", error);
        return { ok: false, status: 0, data: { error: { message: error.message } } };
    }
}

export const httpRequest = {
    get(path, options = {}) {
        return request(path, { ...options, method: "GET" });
    },

    post(path, body, options = {}) {
        return request(path, { ...options, method: "POST", body });
    },
};
