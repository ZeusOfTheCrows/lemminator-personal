<script lang="ts">
	import { page } from '$app/stores';
	import PostList from '$lib/components/PostList.svelte';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
	import { cachedCalls } from '$lib/js/globals';
	import type { CommunityResponse, GetPostsResponse } from 'lemmy-js-client';
	import { goto } from '$app/navigation';
	import { POST_PAGE_SIZE } from '$lib/js/client';
	import ThemedButton from '$lib/components/ThemedButton.svelte';
	import FederationHint from '$lib/components/FederationHint.svelte';

	export let communityResponse: CommunityResponse;
	export let postsResponse: GetPostsResponse;
	export let pageId: number;

	function makeBannerImageVar(url: string | undefined): string | undefined {
		if (url) {
			return `url(${url})`;
		} else {
			return;
		}
	}

	function onRequestPrevPage() {
		if (pageId <= 1) return;

		goto(`/c/${$page.params.communityName}/page/${pageId - 1}?selectedPostId=last`);
	}

	function onRequestNextPage() {
		Promise.all([postsResponse]).then(([postsResponse]) => {
			if (postsResponse.posts.length < POST_PAGE_SIZE) return;

			goto(`/c/${$page.params.communityName}/page/${pageId + 1}?selectedPostId=first`);
		});
	}
</script>

<svelte:head>
	{#await $cachedCalls.siteResponse then siteResponse}
		<title>
			{communityResponse.community_view.community.title} - {siteResponse.site_view.site.name}
		</title>
	{/await}
</svelte:head>

<PageHolder>
	<svelte:fragment slot="main">
		<div class="postListPage">
			<div
				class="communityBanner"
				class:communityBanner--hasImage={!!communityResponse.community_view.community.banner}
				style:--bannerImage={makeBannerImageVar(communityResponse.community_view.community.banner)}
			>
				<div class="communityBanner__info">
					{#if communityResponse.community_view.community.icon}
						<img
							class="communityBanner__icon"
							src={communityResponse.community_view.community.icon}
							alt="Community icon"
						/>
					{/if}
					<h1 class="communityBanner__title">
						{communityResponse.community_view.community.title}
					</h1>
				</div>
			</div>
			{#if !communityResponse.community_view.community.local}
				<FederationHint
					hostname={new URL(communityResponse.community_view.community.actor_id).hostname}
				/>
			{/if}
			{#await postsResponse then}
				{#if pageId > 1}
					<div class="loadMorePlacer">
						<ThemedButton
							icon="keyboard_double_arrow_up"
							href={`/c/${$page.params.communityName}/page/${pageId - 1}`}
						>
							Load previous
						</ThemedButton>
					</div>
				{/if}
			{/await}
			<PostList
				communityName={$page.params.communityName}
				{postsResponse}
				on:requestNextPage={onRequestNextPage}
				on:requestPrevPage={onRequestPrevPage}
			/>
			{#if postsResponse.posts.length >= POST_PAGE_SIZE}
				<div class="loadMorePlacer">
					<ThemedButton
						icon="keyboard_double_arrow_down"
						href={`/c/${$page.params.communityName}/page/${pageId + 1}`}
					>
						Load next
					</ThemedButton>
				</div>
			{/if}
		</div>
	</svelte:fragment>
	<svelte:fragment slot="secondarySidebar">
		<SecondarySidebar communityName={$page.params.communityName} />
	</svelte:fragment>
</PageHolder>

<style lang="scss">
	@use '$lib/css/colors';

	.postListPage {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.communityBanner {
			height: 10rem;
			background-size: cover;
			background-position: center;
			border-radius: 10px;
			display: flex;
			align-content: end;
			align-items: end;
			padding-left: 1rem;
			padding-bottom: 1rem;

			$gradient: linear-gradient(to top, rgb(22, 2, 27), rgba(22, 2, 27, 0));
			background: $gradient, url('$lib/img/fills/fill1.svg'), #0e0035;

			&.communityBanner--hasImage {
				background: $gradient, var(--bannerImage);
			}

			.communityBanner__info {
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 1rem;

				.communityBanner__icon {
					border-radius: 100%;
					width: 5rem;
					aspect-ratio: 1 / 1;
					object-fit: cover;
					padding: 0.3rem;
					background: white;
				}

				.communityBanner__title {
					color: white;
					text-shadow: 0 0 20px rgb(22, 2, 27), 0 0 10px rgb(22, 2, 27);
					font-size: 1.25rem;
					font-weight: bold;
				}
			}
		}

		.loadMorePlacer {
			display: flex;
			justify-content: center;
		}
	}
</style>
