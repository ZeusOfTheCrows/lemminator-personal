<script lang="ts">
	import type { SearchResponse } from 'lemmy-js-client';
	import ModalPopup from './ModalPopup.svelte';
	import SearchBox from './SearchBox.svelte';
	import { getClient } from '$lib/js/client';
	import { session } from '$lib/js/globals';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import EntityIcon from './EntityIcon.svelte';
	import { getNormalizedCommunityName } from '$lib/js/navigation';
	import { createEventDispatcher, onMount } from 'svelte';
	import ThemedButton from './ThemedButton.svelte';

	const dispatch = createEventDispatcher();

	let searchBox: SearchBox;
	let searchResponse: Promise<SearchResponse> | null = null;
	let query: string = '';

	$: {
		if (query) {
			const client = getClient();
			searchResponse = client.search({
				query,
				jwt: $session.jwt
			});
		} else {
			searchResponse = null;
		}
	}

	onMount(() => {
		searchBox.focus();
	});
</script>

<ModalPopup on:dismiss width="30rem">
	<div class="searchPopup">
		<div class="searchPopup__top">
			<div class="searchPopup__box">
				<SearchBox bind:query bind:this={searchBox} />
			</div>
			<ThemedButton icon="close" on:click={() => dispatch('dismiss')} />
		</div>

		{#if searchResponse}
			{#await searchResponse}
				<LoadingSpinner minHeight="4rem" />
			{:then searchResponse}
				{#if searchResponse.communities.length}
					<ul class="searchPopup__communities">
						{#each searchResponse.communities as communityView}
							<li class="searchPopup__communityResult">
								<a
									href={`/c/${getNormalizedCommunityName(communityView.community)}`}
									on:click={() => dispatch('dismiss')}
								>
									{#if communityView.community.icon}
										<EntityIcon src={communityView.community.icon} alt="Community icon" />
									{/if}
									{communityView.community.title}
									{#if !communityView.community.local}
										<span class="searchPopup__communityResult__external" title="External community">
											<span class="material-icons">link</span>
											{new URL(communityView.community.actor_id).hostname}
										</span>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			{:catch}
				<div class="searchPopup__error">Could not load search results.</div>
			{/await}
		{/if}
	</div>
</ModalPopup>

<style lang="scss">
	@use '$lib/css/colors';
	@use 'material-icons/iconfont/filled.css';

	.searchPopup {
		display: flex;
		flex-direction: column;
		padding: 1rem 0;
		gap: 0.5rem;

		.searchPopup__top {
			display: flex;
			flex-direction: row;
			gap: 0.5rem;
			align-items: center;
			justify-content: stretch;

			.searchPopup__box {
				flex-grow: 1;
			}
		}

		.searchPopup__top,
		.searchPopup__error {
			padding: 0 1rem;
		}

		.searchPopup__error {
			font-size: 0.9rem;
		}

		.searchPopup__communities {
			flex-shrink: 1;
			overflow-y: scroll;
		}

		.searchPopup__communityResult {
			a {
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 0.5rem;
				padding: 0.7rem calc(1rem + 2px);
				text-decoration: none;

				&:hover {
					@include colors.themify() {
						background: colors.themed('color2');
					}
				}
			}

			.searchPopup__communityResult__external {
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 0.3rem;

				.material-icons {
					font-size: 0.9rem;
				}
				opacity: 0.5;
				font-size: 0.8rem;
			}
		}
	}
</style>
