<script lang="ts">
	import type { PageData } from './$types';
	import PostListPage from '$lib/reusablePages/postList/PostListPage.svelte';

	export let data: PageData;
</script>

{#if data.communityResponse}
	<PostListPage
		communityResponse={data.communityResponse}
		postsResponse={data.postsResponse}
		pageId={data.pageId}
	/>
{/if}
