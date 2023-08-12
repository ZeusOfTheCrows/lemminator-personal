<script lang="ts">
	import ElevatedBox from './ElevatedBox.svelte';
	import type { GetCommunityResponse } from 'lemmy-js-client';
	import { renderEnhancedMarkdown } from '$lib/js/markdown';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import { formatApproxInteger } from '$lib/js/format';
	import { getClient } from '$lib/js/client';
	import { cachedCalls, session } from '$lib/js/globals';

	let client = getClient();
	let communityResponse: Promise<GetCommunityResponse> = new Promise(() => {});

	// Community context, if applicable
	export let communityName: string | null = null;

	$: {
		if (communityName) {
			communityResponse = client.getCommunity(communityName, $session.jwt);
		}
	}
</script>

<div class="secondaryNavigation">
	{#if communityName}
		{#await communityResponse}
			<LoadingSpinner minHeight="4rem" />
		{:then communityResponse}
			{#if communityResponse.community_view.community.description}
				<ElevatedBox title="About community" stacking="vertical">
					<div class="secondaryNavigation__runningText">
						{@html renderEnhancedMarkdown(
							communityResponse.community_view.community.description ?? ''
						)}
					</div>
				</ElevatedBox>
			{/if}
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
		{#await $cachedCalls.siteResponse}
			<LoadingSpinner minHeight="4rem" />
		{:then siteResponse}
			{#if siteResponse.site_view.site.description}
				<ElevatedBox title={`About ${siteResponse.site_view.site.name}`} stacking="vertical">
					<p class="secondaryNavigation__runningText">
						{@html renderEnhancedMarkdown(siteResponse.site_view.site.description)}
						{#if siteResponse.site_view.site.sidebar}
							{@html renderEnhancedMarkdown(siteResponse.site_view.site.sidebar)}
						{/if}
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
	@use '$lib/css/markdown';

	.secondaryNavigation {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		$innerPad: 1rem;

		.secondaryNavigation__runningText {
			padding: $innerPad;
			font-size: 0.85rem;
			line-height: 1.1rem;

			@include markdown.styleExternalContent($allowFontSizeIncreases: true);
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
