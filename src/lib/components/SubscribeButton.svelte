<script lang="ts">
	import { getClient } from '$lib/js/client';
	import { session } from '$lib/js/globals';
	import type { CommunityResponse } from 'lemmy-js-client';

	export let communityResponse: CommunityResponse;
	let subscribed = false;
	$: {
		subscribed = ['Subscribed', 'Pending'].includes(communityResponse.community_view.subscribed);
	}
	let loading = false;

	async function toggleSubscriptionStatus() {
		if ($session.state === 'authenticated') {
			const client = getClient();
			loading = true;
			communityResponse = await client.setSubscriptionStatus({
				communityId: communityResponse.community_view.community.id,
				status: !subscribed,
				jwt: $session.jwt
			});
			loading = false;
		} else if ($session.state == 'unauthenticated') {
			$session = {
				state: 'authenticating',
				jwt: undefined,
				callback: toggleSubscriptionStatus
			};
		}
	}
</script>

<button
	class="subscribeButton"
	class:subscribeButton--loading={loading}
	on:click={toggleSubscriptionStatus}
	title={subscribed ? 'Unsubscribe' : 'Subscribe'}
>
	{#if loading}
		<span class="subscribeButton__icon material-icons">refresh</span>
	{:else if subscribed}
		<span class="subscribeButton__icon material-icons">check_circle</span>
	{:else}
		<span class="subscribeButton__icon material-icons">add_circle</span>
	{/if}
	{#if subscribed}
		<span class="subscribeButton__text">Subscribed</span>
	{:else}
		<span class="subscribeButton__text">Subscribe</span>
	{/if}
</button>

<style lang="scss">
	@use '$lib/css/colors';
	@use '$lib/css/breakpoints';
	@use 'material-icons/iconfont/filled.css';

	.subscribeButton {
		display: flex;
		align-items: center;
		padding: 0.5rem;
		border-radius: 10px;
		cursor: pointer;
		background: #eadbf7;
		color: rgb(11, 9, 12);

		&:hover:not(&.subscribeButton--loading) {
			filter: brightness(0.97);
		}

		.subscribeButton__text {
			display: none;

			@include breakpoints.largeAndUp {
				display: block;
				padding-left: 0.3rem;
				border-left: solid 1px #88888833;
				margin-left: 0.5rem;
			}
		}

		&.subscribeButton--loading {
			cursor: not-allowed;
			color: #888;

			.subscribeButton__icon {
				animation: fullRotation 1.25s infinite;

				@keyframes fullRotation {
					0% {
						transform: rotate(0deg);
					}
					40% {
						transform: rotate(360deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}
			}
		}
	}
</style>
