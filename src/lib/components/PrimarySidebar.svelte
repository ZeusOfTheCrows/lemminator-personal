<script lang="ts">
	import { getClient } from '$lib/js/client';
	import { createEventDispatcher } from 'svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';

	const dispatch = createEventDispatcher();
	const client = getClient();
	let communitiesResponse = client.listCommunities({
		type_: 'Local',
		sort: 'TopDay'
	});
	$: {
		communitiesResponse.then(() => {
			dispatch('communitiesResponseLoaded');
		});
	}
</script>

<ul class="mainNavigation">
	<li><a href="/" class="highlightableRoute">Frontpage</a></li>
	<li><a href="/subscriptions" class="highlightableRoute">Subscriptions</a></li>
	{#await communitiesResponse}
		<LoadingSpinner minHeight="4rem" />
	{:then communitiesResponse}
		{#each communitiesResponse.communities as community}
			<li class="communityItem">
				<a href={`/c/${community.community.name}`} class="communityItem highlightableRoute">
					{#if community.community.icon}
						<img src={community.community.icon} alt="" class="communityItem__icon" />
					{:else}
						<div class="communityItem__iconPlaceholder material-icons">people</div>
					{/if}
					{community.community.title}
				</a>
			</li>
		{/each}
	{/await}
</ul>

<style lang="scss">
	@use '$lib/css/colors';
	@use '$lib/css/breakpoints';
	@use 'material-icons/iconfont/filled.css';

	.mainNavigation {
		font-family: 'Lato', sans-serif;
		@include colors.themify() {
			color: rgba(colors.themed('themedMainText'), 0.9);
		}

		li {
			display: flex;
			flex-direction: column;
			line-height: 1.2rem;

			a {
				padding: 1.2rem;
				width: 100%;
				height: 100%;
				text-decoration: none;
				border: solid 1px transparent;
				border-left: none;

				@include breakpoints.mediumAndUp {
					padding: 0.5rem 0 0.5rem 1rem;
				}

				@include colors.themify() {
					&:hover {
						background: rgba(colors.themed('menuAccent'), 0.3);
					}

					&:global(.highlightedRoute) {
						border-color: colors.themed('subtleBorder');
						background: colors.themed('menuAccent');
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
			}

			.communityItem__iconPlaceholder {
				display: flex;
				align-items: center;
				justify-content: center;
				color: colors.themed('maxContrastOnTheme');
				font-size: 0.9rem;
			}
		}
	}
</style>
