<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import PrimarySidebar from '$lib/components/PrimarySidebar.svelte';

	let root: HTMLElement;

	function updateHighlightedRouteStyling() {
		// Stupid workaround: we have to wait for the DOM to settle in case this callback
		// got triggered due to a data load event. The timeout moves us to the back of the event
		// handling queue.
		setTimeout(() => {
			let path = $page.url.pathname;
			if (root) {
				root.querySelectorAll('a.highlightableRoute').forEach((element) => {
					if (element.attributes.getNamedItem('href')?.value == path) {
						element.classList.add('highlightedRoute');
					} else {
						element.classList.remove('highlightedRoute');
					}
				});
			}
		}, 1);
	}

	afterNavigate(updateHighlightedRouteStyling);
</script>

<div class="root" bind:this={root}>
	<header class="header">
		<div class="header__logo">Lemminator</div>
		<div class="header__search">Search</div>
		<div class="header__menu">Menu</div>
	</header>
	<div class="page">
		<aside class="primarySidebar">
			<PrimarySidebar on:communitiesResponseLoaded={updateHighlightedRouteStyling} />
		</aside>
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
		display: flex;
		flex-direction: row;
		align-items: start;
		min-height: 100%;

		.primarySidebar {
			padding: 1rem 0;
			position: sticky;
			top: 0;
			max-width: 300px;
			flex-basis: 300px;
			flex-shrink: 0;
		}
	}
</style>
