import path from 'path'
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tanstackRouter from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

console.log()
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tanstackRouter({
            target: 'react',
            autoCodeSplitting: true,
        }),
        tailwindcss(),
        react()
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 5001,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://localhost:5000/',
                changeOrigin: true
            }
        }
    }
})
