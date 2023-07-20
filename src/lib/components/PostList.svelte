<script lang="ts">
	import { getClient } from '$lib/js/client';
	import type { GetPostsResponse } from 'lemmy-js-client';
	import PostOverviewCard from './PostOverviewCard.svelte';

	let client = getClient();
	export let communityName: string | null = null;
	let postsResponse: Promise<GetPostsResponse> = new Promise(() => {});
	$: {
		postsResponse = client.getPosts({
			community_name: communityName ?? undefined
		});
	}
</script>

{#await postsResponse}
	<div class="postList">
		<PostOverviewCard postView={null} />
		<PostOverviewCard postView={null} />
		<PostOverviewCard postView={null} />
		<PostOverviewCard postView={null} />
		<PostOverviewCard postView={null} />
		<PostOverviewCard postView={null} />
	</div>
{:then postsResponse}
	<div class="postList">
		{#each postsResponse.posts as postView}
			<!-- Can be revisited when an NSFW toggle has been implemented -->
			{#if postView.post.nsfw === false}
				<PostOverviewCard {postView} />
			{/if}
		{/each}
	</div>
{:catch postsResponse}
	Error loading posts
{/await}

<style lang="scss">
	@use '$lib/css/resets';
	@use '$lib/css/globals';

	.postList {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
