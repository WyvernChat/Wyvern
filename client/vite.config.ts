import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig(({ command }) => ({
    server: {
        port: 3001
    },
    preview: {
        port: 3001
    },
    root: "src",
    publicDir: "../public",
    build: {
        outDir: "../build",
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: [
                        "../node_modules/react/index.js",
                        "../node_modules/react-dom/index.js",
                        "../node_modules/react-icons/fa/index.js"
                    ]
                }
            }
        }
    },
    plugins: [
        react({
            include: "**/*.{jsx,tsx}"
        }),
        // viteCompression(),
        VitePWA({
            registerType: "autoUpdate",
            injectRegister: null,
            devOptions: {
                enabled: true
            },
            manifest: {
                name: "Wyvern",
                short_name: "Wyvern",
                start_url: "/channels/@me",
                display: "fullscreen",
                background_color: "#303030",
                theme_color: "#202225",
                description: "Wyvern chat progressive web app",
                icons: [
                    {
                        src: "/images/WyvernLogo-192x192.png",
                        type: "image/png",
                        sizes: "192x192"
                    },
                    {
                        src: "/images/WyvernLogo-512x512.png",
                        type: "image/png",
                        sizes: "512x512"
                    }
                ]
            }
        })
    ],
    define: {
        __API_URI__: `'${command === "build" ? "wyvern.tkdkid1000.net" : "localhost:3000"}'`,
        __APP_ENV__: `'${command === "build" ? "PRODUCTION" : "DEVELOPMENT"}'`
    }
}))
