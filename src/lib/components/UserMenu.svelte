<script lang="ts">
	import { cachedCalls, session, theme } from '$lib/js/globals';
	import { createEventDispatcher } from 'svelte';
	import Dismissable from './Dismissable.svelte';
	import MenuOption from './MenuOption.svelte';
	import { invalidateAll } from '$app/navigation';

	const dispatch = createEventDispatcher();

	async function logOut() {
		$session = { state: 'unauthenticated', jwt: undefined };
		dispatch('dismiss');
		invalidateAll();
	}
</script>

<Dismissable on:dismiss>
	<ul class="menu">
		{#if $session.state === 'unauthenticated'}
			<li>
				<MenuOption
					padding="1rem"
					on:click={() => {
						$session.state = 'authenticating';
						dispatch('dismiss');
					}}
				>
					Log in
				</MenuOption>
			</li>
		{/if}
		<li>
			<MenuOption
				padding="1rem"
				on:click={() => {
					$theme = $theme === 'light' ? 'dark' : 'light';
					dispatch('dismiss');
				}}
			>
				Toggle dark mode
			</MenuOption>
		</li>
		{#if $session.state == 'authenticated'}
			<li>
				<MenuOption
					padding="1rem"
					on:click={() => {
						logOut();
						dispatch('dismiss');
					}}
				>
					Log out
					<span class="menu__loggedInUserOnSmallScreens">
						{#await $cachedCalls.siteResponse then siteResponse}
							{#if $session.state === 'authenticated' && siteResponse.my_user}
								{siteResponse.my_user.local_user_view.person.name}
							{/if}
						{/await}
					</span>
				</MenuOption>
			</li>
		{/if}
	</ul>
</Dismissable>

<style lang="scss">
	@use '$lib/css/colors';
	@use '$lib/css/breakpoints';

	.menu {
		font-size: 0.8rem;

		@include colors.themify() {
			background: colors.themed('maxContrastTheme');
			border: solid 1px colors.themed('subtleBorder');
			box-shadow: 1px 1px 5px rgba(colors.themed('themedShadow'), 0.05);
		}

		li {
			display: grid;
			grid-template-columns: 1fr;
		}

		.menu__loggedInUserOnSmallScreens {
			@include breakpoints.desktopAndUp {
				display: none;
			}
		}
	}
</style>
