<script lang="ts">
	import type { PageData } from './$types';
	import FrontPostListPage from '$lib/reusablePages/postList/FrontPostListPage.svelte';

	export let data: PageData;
</script>

<FrontPostListPage postsResponsePromise={data.streamed.postsResponse} pageId={data.pageId} />
