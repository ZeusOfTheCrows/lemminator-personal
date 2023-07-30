<script lang="ts">
	import type { PageData } from './$types';
	import PostListPage from '$lib/reusablePages/postList/PostListPage.svelte';

	export let data: PageData;
</script>

<!-- This should always be present, but it pleases the type checker -->
{#if data.communityResponse}
	<PostListPage
		communityResponse={data.communityResponse}
		postsResponsePromise={data.streamed.postsResponse}
		pageId={data.pageId}
	/>
{/if}
