import adapter_netlify from '@sveltejs/adapter-netlify';
import adapter_node from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter_node()
	}
};

if (process.env.BUILD_FOR_NETLIFY) {
	config.kit.adapter = adapter_netlify();
}

export default config;
