const baseUrl = import.meta.env.VITE_API_BASE_URL;

const httpRequest = {
    get: async (path) => {
        try {
            const res = await fetch(`${baseUrl}${path}`);
            return await res.json();
        } catch (e) {
            console.error("Error:", err);
        }
    },
    post: async (path, data) => {
        try {
            const res = await fetch(`${baseUrl}${path}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            return await res.json();
        } catch (e) {
            console.error("Error:", err);
        }
    },
};

export { httpRequest };
