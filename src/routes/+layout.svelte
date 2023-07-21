<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import PrimarySidebar from '$lib/components/PrimarySidebar.svelte';
	import TransparentButton from '$lib/components/TransparentButton.svelte';
	import logoOnLight from '$lib/img/logoOnLight.png';
	import logoOnLightSvg from '$lib/img/logoOnLight.svg';
	import logoOnDarkSvg from '$lib/img/logoOnDark.svg';
	import type { GetSiteResponse } from 'lemmy-js-client';
	import { getClient } from '$lib/js/client';

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

	afterNavigate(() => {
		updateHighlightedRouteStyling();
		primarySidebarModal.close();
	});

	let primarySidebarModal: HTMLDialogElement;

	let client = getClient();
	let siteResponse: Promise<GetSiteResponse> = new Promise(() => {});
	$: {
		siteResponse = client.getSite();
	}
</script>

<svelte:head>
	<title>Lemminator</title>
	<link rel="icon" href={logoOnLightSvg} media="(prefers-color-scheme: light)" />
	<link rel="icon" href={logoOnDarkSvg} media="(prefers-color-scheme: dark)" />
</svelte:head>

<div class="root" bind:this={root}>
	<header class="header">
		<div class="header__logoMenuToggle">
			<div class="header__menuToggle">
				<TransparentButton on:click={() => primarySidebarModal.showModal()} title="Open navigation">
					<span class="material-icons">menu</span>
				</TransparentButton>
			</div>
			<a href="/">
				<img src={logoOnLight} alt="Lemminator logo" class="header__logo" />
				{#await siteResponse then siteResponse}
					{siteResponse.site_view.site.name}
				{/await}
			</a>
		</div>
		<div class="header__search">Search</div>
		<div class="header__menu">Menu</div>
	</header>
	<div class="page">
		<aside class="primarySidebar">
			<PrimarySidebar on:communitiesResponseLoaded={updateHighlightedRouteStyling} />
		</aside>
		<dialog class="primarySidebarModal" bind:this={primarySidebarModal}>
			<div class="primarySidebarModal__top">
				{#await siteResponse then siteResponse}
					<div>{siteResponse.site_view.site.name}</div>
				{/await}
				<TransparentButton on:click={() => primarySidebarModal.close()} title="Close navigation">
					<span class="material-icons">menu_open</span>
				</TransparentButton>
			</div>
			<div class="primarySidebarModal__body">
				<PrimarySidebar on:communitiesResponseLoaded={updateHighlightedRouteStyling} />
			</div>
		</dialog>
		<slot />
	</div>
</div>

<style lang="scss">
	@use '$lib/css/resets';
	@use '$lib/css/globals';
	@use '$lib/css/colors';
	@use '$lib/css/breakpoints';
	@use 'material-icons/iconfont/filled.css';

	.root {
		background: colors.$globalBg;
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	header {
		padding: 0.5rem 1rem;
		display: flex;
		flex-shrink: 0;
		align-items: center;
		border-bottom: solid 1px colors.$subtleBorder;

		.header__logoMenuToggle {
			display: flex;
			align-items: center;
			flex-basis: 275px;
			gap: 0.5rem;

			.header__menuToggle {
				font-size: 0.8rem;

				@include breakpoints.desktopAndUp {
					display: none;
				}
			}

			a {
				display: flex;
				align-items: center;
				text-decoration: none;
				gap: 0.5rem;
				font-size: 1.1rem;
				font-weight: bold;
			}
		}

		.header__logo {
			width: 3rem;
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

		.primarySidebar {
			display: none;
			padding: 1rem 0;
			max-width: 275px;
			flex-basis: 275px;
			flex-shrink: 0;

			@include breakpoints.desktopAndUp {
				display: block;
				position: sticky;
				top: 0;
			}
		}

		.primarySidebarModal {
			border: solid 1px colors.$subtleBorder;
			transition: box-shadow 0.5s ease-in;

			&[open] {
				display: flex;
				flex-direction: column;
				gap: 1rem;
				position: absolute;
				animation: dim 0.1s ease-in forwards;
				top: 0;
				left: 0;
				width: 100vw;
				height: 100vh;
				min-height: 100vh; // <dialog> quirk because reasons
				max-width: 300px;
				padding: 0;
				margin: 0;

				@keyframes dim {
					0% {
						box-shadow: 0 0 0 100vmax rgba(colors.$themedShadow, 0);
						transform: translateX(-100%);
					}
					100% {
						box-shadow: 0 0 0 100vmax rgba(colors.$themedShadow, 0.4);
						transform: translateX(0%);
					}
				}
			}

			.primarySidebarModal__top {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0.5rem 1rem 0.5rem 1rem;
				border-bottom: solid 1px colors.$subtleBorder;
				font-weight: bold;
			}

			.primarySidebarModal__body {
				flex-grow: 1;
				flex-shrink: 1;
				overflow: scroll;
				padding-bottom: 0.5rem;
			}
		}
	}
</style>
