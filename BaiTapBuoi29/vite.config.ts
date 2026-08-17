import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [tailwindcss()],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                login: resolve(__dirname, "src/pages/login.html"),
                register: resolve(__dirname, "src/pages/register.html"),
                profile: resolve(__dirname, "src/pages/profile.html"),
            },
        },
    },
});
