<script lang="ts">
	import { getClient } from '$lib/js/client';
	import ElevatedBox from './ElevatedBox.svelte';
	import type { GetCommunityResponse, GetSiteResponse } from 'lemmy-js-client';
	import { renderEnhancedMarkdown } from '$lib/js/markdown';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import { formatApproxInteger } from '$lib/js/format';

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
			<ElevatedBox title="Activity" stacking="vertical">
				<div class="secondaryNavigation__statList">
					<div class="statistic">
						<div class="statistic__metric">Subscribers</div>
						<div class="statistic__value">
							{formatApproxInteger(communityResponse.community_view.counts.subscribers)}
						</div>
					</div>
					<div class="statistic">
						<div class="statistic__metric">Users today</div>
						<div class="statistic__value">
							{formatApproxInteger(communityResponse.community_view.counts.users_active_day)}
						</div>
					</div>
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
			<ElevatedBox title="Activity" stacking="vertical">
				<div class="secondaryNavigation__statList">
					<div class="statistic">
						<div class="statistic__metric">Posts</div>
						<div class="statistic__value">
							{formatApproxInteger(siteResponse.site_view.counts.posts)}
						</div>
					</div>
					<div class="statistic">
						<div class="statistic__metric">Users today</div>
						<div class="statistic__value">
							{formatApproxInteger(siteResponse.site_view.counts.users_active_day)}
						</div>
					</div>
				</div>
			</ElevatedBox>
		{/await}
	{/if}
</div>

<style lang="scss">
	@use '$lib/css/colors';

	.secondaryNavigation {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		$innerPad: 1rem;

		.secondaryNavigation__runningText {
			padding: $innerPad;
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
				@include colors.themify() {
					border: solid 1px colors.themed('subtleBorder');
				}
			}
		}

		.secondaryNavigation__statList {
			padding: $innerPad;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 1rem 3rem;
		}
	}

	.statistic {
		.statistic__metric {
			font-size: 0.8rem;
			@include colors.themify() {
				color: colors.themed('deemphColor');
			}
			margin-bottom: 0.1rem;
		}

		.statistic__value {
			font-size: 1.2rem;
			font-weight: bold;
		}
	}
</style>
