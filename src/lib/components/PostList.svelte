<script lang="ts">
	import { getClient } from '$lib/js/client';
	import PostOverviewCard from './PostOverviewCard.svelte';

	let client = getClient();
	let postsResponse = client.getPosts();
</script>

{#await postsResponse}
	Loading posts
{:then postsResponse}
	<div class="loadedPostList">
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

	.loadedPostList {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
