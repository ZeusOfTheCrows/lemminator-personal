<script lang="ts">
	import { page } from '$app/stores';
	import PostList from '$lib/components/PostList.svelte';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
	import { getClient } from '$lib/js/client';
	import type { GetCommunityResponse } from 'lemmy-js-client';

	const client = getClient();
	let communityResponse: Promise<GetCommunityResponse> = new Promise(() => {});
	$: {
		communityResponse = client.getCommunity({
			name: $page.params.communityName
		});
	}
</script>

{#await communityResponse then communityResponse}
	<PageHolder>
		<svelte:fragment slot="main">
			<div
				class="communityBanner"
				class:communityBanner--hasImage={!!communityResponse.community_view.community.banner}
				style:--bannerImage={`url(${communityResponse.community_view.community.banner})`}
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
			<PostList communityName={$page.params.communityName} />
		</svelte:fragment>
		<svelte:fragment slot="secondarySidebar">
			<SecondarySidebar communityName={$page.params.communityName} />
		</svelte:fragment>
	</PageHolder>
{/await}

<style lang="scss">
	@use '$lib/css/colors';

	.communityBanner {
		$gradient: linear-gradient(to top, colors.$themedShadow, rgba(colors.$themedShadow, 0));
		height: 10rem;
		background-image: $gradient, colors.$gradient12;
		background-size: cover;
		background-position: center;
		border-radius: 10px;
		display: flex;
		align-content: end;
		align-items: end;
		padding-left: 1rem;
		padding-bottom: 1rem;
		margin-bottom: 1rem;

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
				background: colors.$maxContrastBgFill;
			}

			.communityBanner__title {
				color: colors.$maxContrastBgFill;
				font-size: 1.25rem;
				font-weight: bold;
				text-shadow: 0 0 20px colors.$maxContrastShadow, 0 0 10px colors.$maxContrastShadow;
			}
		}
	}
</style>
