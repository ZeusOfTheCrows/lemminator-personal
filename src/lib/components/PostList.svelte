<script lang="ts">
	import { getClient } from '$lib/js/client';
	import type { GetPostsResponse, PostView } from 'lemmy-js-client';
	import PostOverviewCard from './PostOverviewCard.svelte';
	import { keynav, lastKeyboardSelectedPostId } from '$lib/js/globals';
	import { goto } from '$app/navigation';
	import { getDetailLinkForPost } from '$lib/js/navigation';
	import { onMount } from 'svelte';
	import TransparentButton from './TransparentButton.svelte';

	let client = getClient();
	export let communityName: string | null = null;
	let prevCommunityName: string | null = null;
	$: {
		if (prevCommunityName != communityName) {
			console.debug(
				'Reset selected post (previous community %s, now %s)',
				prevCommunityName,
				communityName
			);
			prevCommunityName = communityName;
			postNavIndex = null;
		}
	}

	let loading = false;
	let postViews: PostView[] = [];
	let nextPageToRequest = 1;
	let postsResponsePromise: Promise<GetPostsResponse> = new Promise(() => {});
	onMount(() => {
		postViews = [];
		nextPageToRequest = 1;
		loadNextPage();
	});

	async function loadNextPage() {
		console.log('Loading page', nextPageToRequest);
		loading = true;
		postsResponsePromise = client
			.getPosts({
				community_name: communityName ?? undefined,
				page: nextPageToRequest
			})
			.then((response) => {
				loading = false;
				postViews = postViews.concat(response.posts);
				nextPageToRequest += 1;
				return response;
			});
	}

	let postNavIndex: number | null = null;
	let postPageElement: HTMLElement;
	$: {
		// Make sure to run this after the active prop of the PostOverviewCard has propagated
		setTimeout(() => {
			// For initial page load: restore keyboard selection
			if (postNavIndex === null && $lastKeyboardSelectedPostId !== null) {
				Promise.all([postsResponsePromise]).then(([{ posts }]) => {
					const matchedIndex = posts.findIndex((p) => p.post.id === $lastKeyboardSelectedPostId);
					if (matchedIndex >= 0) {
						postNavIndex = matchedIndex;
					}
					$lastKeyboardSelectedPostId = null;
				});
			} else if (postNavIndex !== null && postPageElement) {
				const el = postPageElement.querySelector('.postOverviewCard--active');
				el?.scrollIntoView();
			}
		}, 1);
	}

	async function handleKeyUp(event: KeyboardEvent) {
		const maxIndex = postViews.length - 1;
		if ($keynav.mode !== 'normal') return;

		switch (event.key) {
			case 'j':
				postNavIndex = Math.min((postNavIndex ?? -1) + 1, maxIndex);
				if (postNavIndex == maxIndex && !loading) {
					loadNextPage();
				}
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
					const selectedPostView = postViews[postNavIndex];
					$lastKeyboardSelectedPostId = selectedPostView.post.id;
					goto(getDetailLinkForPost(selectedPostView));
				}
				break;
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<div class="postList">
	{#if postViews.length}
		<div class="postPage" bind:this={postPageElement}>
			{#each postViews as postView, i}
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
	{/if}
	{#if !loading && postViews.length}
		<div class="loadMorePlacer">
			<TransparentButton icon="keyboard_double_arrow_down" on:click={loadNextPage}>
				Load more
			</TransparentButton>
		</div>
	{/if}
	{#await postsResponsePromise}
		<div class="postPage">
			<PostOverviewCard postView={null} />
			<PostOverviewCard postView={null} />
			<PostOverviewCard postView={null} />
			<PostOverviewCard postView={null} />
			<PostOverviewCard postView={null} />
			<PostOverviewCard postView={null} />
		</div>
	{:catch postsResponse}
		Error loading posts
	{/await}
</div>

<style lang="scss">
	@use '$lib/css/resets';
	@use '$lib/css/globals';

	.postList {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.postPage {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		.loadMorePlacer {
			display: flex;
			justify-content: center;
		}
	}
</style>
