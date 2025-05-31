import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		viteStaticCopy({
			targets: [
				{
					src: '_headers',
					dest: ''
				},
				{
					src: 'node_modules/wasm-vips/lib/vips-*.wasm',
					dest: '_app/immutable/workers/chunks'
				}
			]
		})
	],
	server: {
		headers: {
			'Cross-Origin-Embedder-Policy': 'require-corp',
			'Cross-Origin-Opener-Policy': 'same-origin'
		}
	},
	optimizeDeps: {
		exclude: ['wasm-vips']
	},
	worker: {
		format: 'es'
	}
});
