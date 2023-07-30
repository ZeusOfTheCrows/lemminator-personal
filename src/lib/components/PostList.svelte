<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { keynav } from '$lib/js/globals';
	import { getDetailLinkForPost } from '$lib/js/navigation';
	import type { GetPostsResponse } from 'lemmy-js-client';
	import PostOverviewCard from './PostOverviewCard.svelte';
	import isEqual from 'lodash.isequal';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let communityName: string | null = null;
	afterNavigate(async ({ from, to }) => {
		if (!isEqual(from?.route, to?.route) || !isEqual(from?.params, to?.params)) {
			// Sometimes PostList gets recycled when navigating from community to community.
			// Reinitialize keyboard navigation in that case.
			console.log('Initialize post list navigation');
			postNavIndex = null;
			const postsResponse = await postsResponsePromise;
			const rawSelectedPostId = $page.url.searchParams.get('selectedPostId');

			if (rawSelectedPostId !== null) {
				if (rawSelectedPostId == 'first' && postsResponse.posts.length > 0) {
					postNavIndex = 0;
				} else if (rawSelectedPostId == 'last' && postsResponse.posts.length > 0) {
					postNavIndex = postsResponse.posts.length - 1;
				} else if (!isNaN(parseInt(rawSelectedPostId))) {
					const selectedPostId = parseInt(rawSelectedPostId);
					const resolvedIndex = postsResponse.posts.findIndex((pv) => pv.post.id == selectedPostId);
					postNavIndex = resolvedIndex >= 0 ? resolvedIndex : null;
				}
			}
		}
	});

	export let postsResponsePromise: Promise<GetPostsResponse>;

	let postNavIndex: number | null = null;
	let postPageElement: HTMLElement;
	$: {
		// Make sure to run this after the active prop of the PostOverviewCard has propagated
		setTimeout(() => {
			if (postNavIndex !== null && postPageElement) {
				const el = postPageElement.querySelector('.postOverviewCard--active');
				el?.scrollIntoView();
			}
		}, 1);
	}

	async function propagateKeynavToUrl() {
		if (postNavIndex === null) {
			$page.url.searchParams.delete('selectedPostId');
		} else {
			const postViews = (await postsResponsePromise).posts;
			$page.url.searchParams.set('selectedPostId', postViews[postNavIndex].post.id.toString());
		}
		goto(`?${$page.url.searchParams.toString()}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
	}

	async function handleKeyUp(event: KeyboardEvent) {
		const postViews = (await postsResponsePromise).posts;
		const maxIndex = postViews.length - 1;
		if ($keynav.mode !== 'normal') return;

		switch (event.key) {
			case 'j':
				const unclampedPostNavIndexDown = (postNavIndex ?? -1) + 1;
				if (unclampedPostNavIndexDown <= maxIndex) {
					postNavIndex = unclampedPostNavIndexDown;
					propagateKeynavToUrl();
				} else {
					dispatch('requestNextPage');
				}
				break;
			case 'k':
				const unclampedPostNavIndexUp = (postNavIndex ?? 0) - 1;
				if (unclampedPostNavIndexUp >= 0) {
					postNavIndex = unclampedPostNavIndexUp;
					propagateKeynavToUrl();
				} else {
					dispatch('requestPrevPage');
				}
				break;
			case 'Escape':
				postNavIndex = null;
				propagateKeynavToUrl();
				break;
			case 'Enter':
			case 'o':
				if (postNavIndex !== null) {
					const selectedPostView = postViews[postNavIndex];
					goto(getDetailLinkForPost(selectedPostView));
				}
				break;
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

{#await postsResponsePromise}
	<div class="postList">
		<PostOverviewCard postView={null} />
		<PostOverviewCard postView={null} />
		<PostOverviewCard postView={null} />
		<PostOverviewCard postView={null} />
		<PostOverviewCard postView={null} />
		<PostOverviewCard postView={null} />
	</div>
{:then postsResponse}
	{#if postsResponse.posts.length}
		<div class="postList" bind:this={postPageElement}>
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
	{/if}
{:catch}
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
