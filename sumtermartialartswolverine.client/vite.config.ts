import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
    plugins: [react()],
    server: {
        port: 62921,
        proxy: mode === 'development' ? {
            '/api': {
                target: 'http://localhost:5163',
                changeOrigin: true,
                secure: false
            }
        } : {}
    }
}))