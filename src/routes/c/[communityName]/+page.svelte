<script lang="ts">
	import { page } from '$app/stores';
	import PostList from '$lib/components/PostList.svelte';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
	import { getClient } from '$lib/js/client';
	import type { GetCommunityResponse } from 'lemmy-js-client';
	import { cachedCalls } from '$lib/js/globals';

	const client = getClient();
	let communityResponse: Promise<GetCommunityResponse> = new Promise(() => {});
	$: {
		communityResponse = client.getCommunity({
			name: $page.params.communityName
		});
	}

	function makeBannerImageVar(url: string | undefined): string | undefined {
		if (url) {
			return `url(${url})`;
		} else {
			return;
		}
	}
</script>

<svelte:head>
	{#await $cachedCalls.siteResponse then siteResponse}
		{#await communityResponse then communityResponse}
			<title>
				{communityResponse.community_view.community.title} - {siteResponse.site_view.site.name}
			</title>
		{/await}
	{/await}
</svelte:head>

<PageHolder>
	<svelte:fragment slot="main">
		{#await communityResponse then communityResponse}
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
		{/await}
		<PostList communityName={$page.params.communityName} />
	</svelte:fragment>
	<svelte:fragment slot="secondarySidebar">
		<SecondarySidebar communityName={$page.params.communityName} />
	</svelte:fragment>
</PageHolder>

<style lang="scss">
	@use '$lib/css/colors';

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
		margin-bottom: 1rem;

		@include colors.themify() {
			$gradient: linear-gradient(
				to top,
				colors.themed('themedShadow'),
				rgba(colors.themed('themedShadow'), 0)
			);

			background: $gradient, url('$lib/img/fills/fill1.svg'), #0e0035;

			&.communityBanner--hasImage {
				background: $gradient, var(--bannerImage);
			}
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
				@include colors.themify() {
					background: colors.themed('maxContrastTheme');
				}
			}

			.communityBanner__title {
				@include colors.themify() {
					color: colors.themed('maxContrastTheme');
					text-shadow: 0 0 20px colors.themed('themedShadow'),
						0 0 10px colors.themed('themedShadow');
				}
				font-size: 1.25rem;
				font-weight: bold;
			}
		}
	}
</style>
