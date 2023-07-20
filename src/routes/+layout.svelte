<script lang="ts">
	import { page } from '$app/stores';

	let root: HTMLElement;
	let path: string;
	$: {
		path = $page.url.pathname;
		if (root) {
			root.querySelectorAll('a.highlightableRoute').forEach((element) => {
				if (element.attributes.getNamedItem('href')?.value == path) {
					element.classList.add('highlightedRoute');
				} else {
					element.classList.remove('highlightedRoute');
				}
			});
		}
	}
</script>

<div class="root" bind:this={root}>
	<header class="header">
		<div class="header__logo">Lemminator</div>
		<div class="header__search">Search</div>
		<div class="header__menu">Menu</div>
	</header>
	<div class="page">
		<slot />
	</div>
</div>

<svelte:head>
	<title>Lemminator</title>
</svelte:head>

<style lang="scss">
	@use '$lib/css/resets';
	@use '$lib/css/globals';
	@use '$lib/css/colors';

	.root {
		background: colors.$globalBg;
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

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

	.page {
		flex-grow: 1;
		flex-shrink: 1;
		overflow: scroll;
	}
</style>
