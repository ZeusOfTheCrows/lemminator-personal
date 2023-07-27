<script lang="ts">
	import { getClient } from '$lib/js/client';
	import type { GetPostsResponse } from 'lemmy-js-client';
	import PostOverviewCard from './PostOverviewCard.svelte';
	import { keynav, lastKeyboardSelectedPostId } from '$lib/js/globals';
	import { goto } from '$app/navigation';
	import { getDetailLinkForPost } from '$lib/js/navigation';

	let client = getClient();
	export let communityName: string | null = null;
	let postsResponse: Promise<GetPostsResponse> = new Promise(() => {});
	$: {
		postsResponse = client.getPosts({
			community_name: communityName ?? undefined
		});
	}

	let postNavIndex: number | null = null;
	let postListElement: HTMLElement;
	$: {
		// Make sure to run this after the active prop of the PostOverviewCard has propagated
		setTimeout(() => {
			// For initial page load: restore keyboard selection
			if (postNavIndex === null && $lastKeyboardSelectedPostId !== null) {
				Promise.all([postsResponse]).then(([{ posts }]) => {
					postNavIndex = posts.findIndex((p) => p.post.id === $lastKeyboardSelectedPostId) ?? null;
					$lastKeyboardSelectedPostId = null;
				});
			} else if (postNavIndex !== null && postListElement) {
				const el = postListElement.querySelector('.postOverviewCard--active');
				el?.scrollIntoView();
			}
		}, 1);
	}

	async function handleKeyUp(event: KeyboardEvent) {
		const maxIndex = (await postsResponse).posts.length - 1;
		if ($keynav.mode !== 'normal') return;

		switch (event.key) {
			case 'j':
				postNavIndex = Math.min((postNavIndex ?? -1) + 1, maxIndex);
				break;
			case 'k':
				postNavIndex = Math.max((postNavIndex ?? 0) - 1, 0);
				break;
			case 'Escape':
				postNavIndex = null;
				break;
			case 'Enter':
			case 'o':
				if (postNavIndex !== null) {
					const selectedPostView = (await postsResponse).posts[postNavIndex];
					$lastKeyboardSelectedPostId = selectedPostView.post.id;
					goto(getDetailLinkForPost(selectedPostView));
				}
				break;
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

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
	<div class="postList" bind:this={postListElement}>
		{#each postsResponse.posts as postView, i}
			<!-- Can be revisited when an NSFW toggle has been implemented -->
			{#if postView.post.nsfw === false}
				<PostOverviewCard
					{postView}
					showCommunity={!communityName}
					active={postNavIndex !== null ? i == postNavIndex : null}
				/>
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
