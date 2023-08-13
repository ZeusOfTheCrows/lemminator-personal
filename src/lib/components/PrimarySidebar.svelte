<script lang="ts">
	import { getClient } from '$lib/js/client';
	import { createEventDispatcher, onMount } from 'svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import { page } from '$app/stores';
	import type { ListCommunitiesResponse } from 'lemmy-js-client';
	import { error } from '@sveltejs/kit';

	const dispatch = createEventDispatcher();
	const client = getClient();
	let communitiesResponse: Promise<ListCommunitiesResponse>;

	onMount(() => {
		communitiesResponse = client
			.listTopCommunities()
			.then((response) => {
				dispatch('communitiesResponseLoaded');
				return response;
			})
			.catch(() => {
				throw error(502, 'Community sidebar load failed');
			});
	});
</script>

<ul class="mainNavigation">
	<li>
		<a
			href="/"
			class:highlightedRoute={$page.route.id === '/' || $page.route.id?.startsWith('/frontpage/')}
			>Frontpage</a
		>
	</li>
	<li>
		<a
			href="/subscriptions"
			class:highlightedRoute={$page.route.id === '/subscriptions' ||
				$page.route.id?.startsWith('/subscriptions/')}
		>
			Subscriptions
		</a>
	</li>
	{#await communitiesResponse}
		<LoadingSpinner minHeight="4rem" />
	{:then communitiesResponse}
		{#if communitiesResponse}
			{#each communitiesResponse.communities as communityView}
				<li class="communityItem">
					<a
						href={`/c/${communityView.community.name}`}
						class="communityItem"
						class:highlightedRoute={$page.params.communityName == communityView.community.name}
					>
						{#if communityView.community.icon}
							<img src={communityView.community.icon} alt="" class="communityItem__icon" />
						{:else}
							<div class="communityItem__iconPlaceholder material-icons">people</div>
						{/if}
						<div class="communityItem__title">
							{communityView.community.title}
						</div>
					</a>
				</li>
			{/each}
		{/if}
	{/await}
</ul>

<style lang="scss">
	@use '$lib/css/colors';
	@use '$lib/css/breakpoints';
	@use 'material-icons/iconfont/filled.css';

	.mainNavigation {
		@include colors.themify() {
			color: rgba(colors.themed('themedMainText'), 0.9);
		}

		li {
			display: flex;
			flex-direction: column;
			font-size: 0.95rem;
			line-height: 1.2rem;

			a {
				padding: 0.8rem 1.2rem;
				width: 100%;
				height: 100%;
				text-decoration: none;
				border: solid 1px transparent;
				border-left: none;

				@include breakpoints.mediumAndUp {
					padding: 0.5rem 1rem;
				}

				@include colors.themify() {
					&:hover {
						background: rgba(colors.themed('menuAccent'), 0.3);
					}
				}
			}
		}
	}

	.communityItem {
		display: flex;
		flex-direction: row;
		gap: 0.6rem;
		align-items: center;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;

		@include colors.themify() {
			.communityItem__icon,
			.communityItem__iconPlaceholder {
				width: 20px;
				object-fit: cover;
				aspect-ratio: 1 / 1;
				border-radius: 100%;
				background: colors.themed('color1');
				flex-shrink: 0;
			}

			.communityItem__iconPlaceholder {
				display: flex;
				align-items: center;
				justify-content: center;
				color: colors.themed('maxContrastOnTheme');
				font-size: 0.9rem;
			}

			.communityItem__title {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}
	}

	.highlightedRoute {
		@include colors.themify() {
			border-color: colors.themed('subtleBorder');
			background: colors.themed('menuAccent');
		}
	}
</style>
