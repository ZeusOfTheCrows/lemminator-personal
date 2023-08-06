<script lang="ts">
	import { session } from '$lib/js/globals';
	import { createEventDispatcher } from 'svelte';
	import Dismissable from './Dismissable.svelte';
	import UnthemedButton from './UnthemedButton.svelte';

	const dispatch = createEventDispatcher();

	async function logOut() {
		$session = { state: 'unauthenticated' };
		dispatch('dismiss');
	}
</script>

<Dismissable on:dismiss>
	<ul class="menu">
		<li>
			<UnthemedButton padding="1rem" on:click={logOut}>Log out</UnthemedButton>
		</li>
	</ul>
</Dismissable>

<style lang="scss">
	@use '$lib/css/colors';

	.menu {
		@include colors.themify() {
			background: colors.themed('maxContrastTheme');
			border: solid 1px colors.themed('subtleBorder');
			box-shadow: 1px 1px 5px rgba(colors.themed('themedShadow'), 0.05);
		}
	}
</style>
