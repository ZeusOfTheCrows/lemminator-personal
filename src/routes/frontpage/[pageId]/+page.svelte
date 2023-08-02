<script lang="ts">
	import type { PageData } from './$types';
	import FrontPostListPage from '$lib/reusablePages/postList/FrontPostListPage.svelte';

	export let data: PageData;
</script>

<FrontPostListPage postsResponse={data.postsResponse} pageId={data.pageId} />
