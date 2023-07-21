<script lang="ts">
	import { getClient } from '$lib/js/client';
	import ElevatedBox from './ElevatedBox.svelte';
	import type { GetCommunityResponse, GetSiteResponse } from 'lemmy-js-client';
	import { renderEnhancedMarkdown } from '$lib/js/markdown';
	import LoadingSpinner from './LoadingSpinner.svelte';

	let client = getClient();
	export let siteResponse: Promise<GetSiteResponse> = new Promise(() => {});
	let communityResponse: Promise<GetCommunityResponse> = new Promise(() => {});

	// Community context, if applicable
	export let communityName: string | null = null;

	$: {
		if (communityName) {
			communityResponse = client.getCommunity({
				name: communityName
			});
		}
	}
</script>

<div class="secondaryNavigation">
	{#if communityName}
		{#await communityResponse}
			<LoadingSpinner minHeight="4rem" />
		{:then communityResponse}
			<ElevatedBox title="About community" stacking="vertical">
				<div class="secondaryNavigation__runningText">
					{@html renderEnhancedMarkdown(
						communityResponse.community_view.community.description ?? ''
					)}
				</div>
			</ElevatedBox>
		{/await}
	{:else}
		{#await siteResponse}
			<LoadingSpinner minHeight="4rem" />
		{:then siteResponse}
			{#if siteResponse.site_view.site.description}
				<ElevatedBox title={`About ${siteResponse.site_view.site.name}`} stacking="vertical">
					<p class="secondaryNavigation__runningText">
						{@html renderEnhancedMarkdown(siteResponse.site_view.site.description)}
					</p>
				</ElevatedBox>
			{/if}
		{/await}
	{/if}
</div>

<style lang="scss">
	@use '$lib/css/colors';

	.secondaryNavigation {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.secondaryNavigation__runningText {
			padding: 1rem;
			font-size: 0.85rem;
			line-height: 1.1rem;

			:global(h1),
			:global(h2),
			:global(h3),
			:global(h4),
			:global(h5),
			:global(p) {
				margin-bottom: 0.5rem;

				&:last-child {
					margin-bottom: 0;
				}
			}

			:global(li) {
				padding-bottom: 0.2rem;
			}

			:global(img) {
				max-width: 100%;
			}

			:global(hr) {
				border: solid 1px colors.$subtleBorder;
			}
		}
	}
</style>
