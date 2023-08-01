<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
	import { cachedCalls, restoredScrollY } from '$lib/js/globals';
	import type { GetPostsResponse } from 'lemmy-js-client';
	import TransparentButton from '$lib/components/TransparentButton.svelte';
	import { POST_PAGE_SIZE } from '$lib/js/client';
	import { goto } from '$app/navigation';

	export let postsResponsePromise: Promise<GetPostsResponse>;
	export let pageId: number;

	$: {
		Promise.all([postsResponsePromise]).then(() => {
			if ($restoredScrollY) {
				window.scrollTo({ top: $restoredScrollY });
			}
		});
	}

	function onRequestPrevPage() {
		if (pageId <= 1) return;

		goto(`/frontpage/${pageId - 1}?selectedPostId=last`);
	}

	function onRequestNextPage() {
		Promise.all([postsResponsePromise]).then(([postsResponse]) => {
			if (postsResponse.posts.length < POST_PAGE_SIZE) return;

			goto(`/frontpage/${pageId + 1}?selectedPostId=first`);
		});
	}
</script>

<svelte:head>
	{#await $cachedCalls.siteResponse then siteResponse}
		<title>Frontpage - {siteResponse.site_view.site.name}</title>
	{/await}
</svelte:head>

<PageHolder>
	<svelte:fragment slot="main">
		<div class="frontPostListPage">
			{#await postsResponsePromise then}
				{#if pageId > 1}
					<div class="loadMorePlacer">
						<TransparentButton icon="keyboard_double_arrow_up" href={`/frontpage/${pageId - 1}`}>
							Load previous
						</TransparentButton>
					</div>
				{/if}
			{/await}
			<PostList
				communityName={null}
				{postsResponsePromise}
				on:requestPrevPage={onRequestPrevPage}
				on:requestNextPage={onRequestNextPage}
			/>
			{#await postsResponsePromise then postsResponse}
				{#if postsResponse.posts.length >= POST_PAGE_SIZE}
					<div class="loadMorePlacer">
						<TransparentButton icon="keyboard_double_arrow_down" href={`/frontpage/${pageId + 1}`}>
							Load next
						</TransparentButton>
					</div>
				{/if}
			{/await}
		</div>
	</svelte:fragment>
	<svelte:fragment slot="secondarySidebar">
		<SecondarySidebar />
	</svelte:fragment>
</PageHolder>

<style lang="scss">
	@use '$lib/css/colors';

	.frontPostListPage {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.loadMorePlacer {
			display: flex;
			justify-content: center;
		}
	}
</style>
