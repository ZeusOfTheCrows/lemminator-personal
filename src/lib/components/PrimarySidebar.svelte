<script lang="ts">
	import { getClient } from '$lib/js/client';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	const client = getClient();
	let communitiesResponse = client.listCommunities({
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
		Loading communities
	{:then communitiesResponse}
		{#each communitiesResponse.communities as community}
			<li class="communityItem">
				<a href={`/c/${community.community.name}`} class="communityItem highlightableRoute">
					<img src={community.community.icon} alt="" class="communityItem__icon" />
					{community.community.title}
				</a>
			</li>
		{/each}
	{/await}
</ul>

<style lang="scss">
	@use '$lib/css/colors';

	.mainNavigation {
		li {
			display: flex;
			flex-direction: column;
			padding-right: 1rem;
			line-height: 1.2rem;
			font-size: 0.9rem;

			a {
				padding: 0.5rem 0 0.5rem 1rem;
				width: 100%;
				height: 100%;
				text-decoration: none;
				border: solid 1px transparent;
				border-left: none;

				&:global(.highlightedRoute) {
					border-color: colors.$subtleBorder;
					background: colors.$gradient12;
					border-top-right-radius: 10px;
					border-bottom-right-radius: 10px;
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

		.communityItem__icon {
			width: 20px;
			object-fit: cover;
			aspect-ratio: 1 / 1;
			border-radius: 100%;
		}
	}
</style>
