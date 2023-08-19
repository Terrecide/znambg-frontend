import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd());
    return {
        server: {
            host: true,
            port: parseInt(env.VITE_HTTP_PORT)
        },
        plugins: [sveltekit()]
    };
});
