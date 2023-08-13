import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import * as child from "child_process";
const commitHash = child.execSync("git rev-parse --short HEAD").toString().trim();

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	define: {
		'import.meta.env.VITE_APP_COMMIT_HASH': JSON.stringify(commitHash),
	}
});
