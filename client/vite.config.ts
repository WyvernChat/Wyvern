import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig(({ command }) => ({
    server: {
        port: 3001
    },
    appType: "spa",
    root: "src",
    build: {
        outDir: "../build",
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["../node_modules/react/index.js", "../node_modules/react-dom/index.js"]
                }
            }
        }
    },
    plugins: [
        // spa("/"),
        react({
            include: "**/*.{jsx,tsx}"
        })
    ],
    define: {
        __API_URI__: `'${command === "build" ? "wyvern.tkdkid1000.net" : "localhost:3000"}'`,
        __APP_ENV__: `'${command === "build" ? "PRODUCTION" : "DEVELOPMENT"}'`
    }
}))
