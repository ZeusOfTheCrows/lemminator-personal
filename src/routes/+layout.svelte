<script lang="ts">
</script>

<header class="header">
	<div class="header__logo">Lemminator</div>
	<div class="header__search">Search</div>
	<div class="header__menu">Menu</div>
</header>
<slot />

<svelte:head>
	<title>Lemminator</title>
</svelte:head>

<style lang="scss">
	@use '$lib/css/resets';
	@use '$lib/css/globals';
	@use '$lib/css/colors';

	header {
		padding: 1rem;
		display: flex;
		flex-shrink: 0;

		.header__logo {
			display: flex;
			align-items: center;
			flex-basis: 300px;
		}

		.header__search {
			flex-grow: 1;
		}

		.header__menu {
			text-align: right;
		}
	}
</style>
