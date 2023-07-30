<script lang="ts">
	import type { PageData } from './$types';
	import PostListPage from '$lib/reusablePages/postList/PostListPage.svelte';

	export let data: PageData;
</script>

<PostListPage
	communityResponse={data.communityResponse}
	postsResponsePromise={data.streamed.postResponse}
	pageId={data.pageId}
/>
