<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
	import { cachedCalls, session } from '$lib/js/globals';
	import type { GetPostsResponse } from 'lemmy-js-client';
	import ThemedButton from '$lib/components/ThemedButton.svelte';
	import { POST_PAGE_SIZE } from '$lib/js/client';
	import { goto } from '$app/navigation';
	import TitledGraphic from '$lib/components/TitledGraphic.svelte';

	export let postsResponse: GetPostsResponse | undefined;
	export let pageId: number;

	function onRequestPrevPage() {
		if (!postsResponse) return;
		if (pageId <= 1) return;

		goto(`/subscriptions/${pageId - 1}?selectedPostId=last`);
	}

	function onRequestNextPage() {
		if (!postsResponse) return;
		Promise.all([postsResponse]).then(([postsResponse]) => {
			if (postsResponse.posts.length < POST_PAGE_SIZE) return;

			goto(`/subscriptions/${pageId + 1}?selectedPostId=first`);
		});
	}
</script>

<svelte:head>
	{#await $cachedCalls.siteResponse then siteResponse}
		<title>Subscriptions - {siteResponse.site_view.site.name}</title>
	{/await}
</svelte:head>

<PageHolder>
	<svelte:fragment slot="main">
		<div class="subscriptionPostListPage">
			{#if postsResponse}
				{#if pageId > 1}
					<div class="loadMorePlacer">
						<ThemedButton icon="keyboard_double_arrow_up" href={`/frontpage/${pageId - 1}`}>
							Load previous
						</ThemedButton>
					</div>
				{/if}
				<PostList
					communityName={null}
					{postsResponse}
					on:requestPrevPage={onRequestPrevPage}
					on:requestNextPage={onRequestNextPage}
				/>
				{#await postsResponse then postsResponse}
					{#if postsResponse.posts.length >= POST_PAGE_SIZE}
						<div class="loadMorePlacer">
							<ThemedButton icon="keyboard_double_arrow_down" href={`/frontpage/${pageId + 1}`}>
								Load next
							</ThemedButton>
						</div>
					{/if}
				{/await}
			{:else if $session.state === 'unauthenticated'}
				<TitledGraphic
					icon="list"
					title="Your favorites on one page"
					subtitle="Subscribe to communities for free."
					iconStyle="round"
				>
					<svelte:fragment slot="additionalActions">
						<ThemedButton
							icon="person"
							appearance="filled"
							on:click={() => ($session = { state: 'authenticating', jwt: undefined })}
						>
							Log in
						</ThemedButton>
					</svelte:fragment>
				</TitledGraphic>
			{/if}
		</div>
	</svelte:fragment>
	<svelte:fragment slot="secondarySidebar">
		<SecondarySidebar />
	</svelte:fragment>
</PageHolder>

<style lang="scss">
	@use '$lib/css/colors';

	.subscriptionPostListPage {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.loadMorePlacer {
			display: flex;
			justify-content: center;
		}
	}
</style>
