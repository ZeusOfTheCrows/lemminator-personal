<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import PrimarySidebar from '$lib/components/PrimarySidebar.svelte';
	import ThemedButton from '$lib/components/ThemedButton.svelte';
	import logoOnLight from '$lib/img/logoOnLight.png';
	import logoOnDark from '$lib/img/logoOnDark.png';
	import logoOnLightSvg from '$lib/img/logoOnLight.svg';
	import logoOnDarkSvg from '$lib/img/logoOnDark.svg';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import { session, cachedCalls, theme } from '$lib/js/globals';
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';
	import LoginPopup from '$lib/components/LoginPopup.svelte';
	import EntityIcon from '$lib/components/EntityIcon.svelte';
	import UserMenu from '$lib/components/UserMenu.svelte';
	import { offset, flip, shift } from 'svelte-floating-ui/dom';
	import { createFloatingActions } from 'svelte-floating-ui';

	let root: HTMLElement;
	let navigating = false;

	beforeNavigate(() => {
		navigating = true;
	});

	afterNavigate(() => {
		navigating = false;
		primarySidebarModal.close();
	});

	onMount(() => {
		if (Cookies.get('demoDisclaimer') == undefined) {
			alert(
				"Hi! Thanks for trying out this early demo of Lemminator. Some caveats:\n\n- Some visible features do not work yet.\n- Only SFW posts are shown. A toggle should be implemented eventually.\n\nIf you're cool with that, carry on!"
			);
			Cookies.set('demoDisclaimer', 'shown', { expires: 7 });
		}
	});

	const [userMenuRef, userMenuContent] = createFloatingActions({
		strategy: 'absolute',
		placement: 'bottom-end',
		middleware: [offset(5), flip(), shift()]
	});

	let primarySidebarModal: HTMLDialogElement;
	let userMenuOpen = false;

	let postAuthCallback: (() => {}) | null = null;
	$: {
		if ($session.state === 'authenticating') {
			postAuthCallback = $session.callback ?? null;
		} else if ($session.state === 'authenticated' && postAuthCallback) {
			postAuthCallback();
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={logoOnLightSvg} media="(prefers-color-scheme: light)" />
	<link rel="icon" href={logoOnDarkSvg} media="(prefers-color-scheme: dark)" />
</svelte:head>

<div class:lightTheme={$theme === 'light'} class:darkTheme={$theme === 'dark'}>
	<div class="loader" class:loader--navigating={navigating}>&nbsp;</div>
	<div class="root" bind:this={root}>
		<header class="header">
			<div class="header__logoMenuToggle">
				<div class="header__menuToggle">
					<ThemedButton on:click={() => primarySidebarModal.showModal()} title="Open navigation">
						<span class="material-icons">menu</span>
					</ThemedButton>
				</div>
				<a href="/">
					{#if $theme === 'light'}
						<img src={logoOnLight} alt="Lemminator logo" class="header__logo" />
					{:else if $theme === 'dark'}
						<img src={logoOnDark} alt="Lemminator logo" class="header__logo" />
					{/if}
					{#await $cachedCalls.siteResponse then siteResponse}
						{siteResponse.site_view.site.name}
					{/await}
				</a>
			</div>
			<div class="header__search">
				<div class="header__searchBox">
					<SearchBox />
				</div>
			</div>
			<div class="header__menu">
				{#await $cachedCalls.siteResponse then siteResponse}
					<div class="header__user">
						<div use:userMenuRef>
							{#if $session.state === 'authenticated' && siteResponse.my_user}
								<ThemedButton on:click={() => (userMenuOpen = true)}>
									<span class="header__loggedInUser">
										{siteResponse.my_user.local_user_view.person.name}
									</span>
									{#if siteResponse.my_user.local_user_view.person.avatar}
										<EntityIcon
											src={siteResponse.my_user.local_user_view.person.avatar}
											alt="Avatar"
										/>
									{:else}
										<span class="material-icons">person</span>
									{/if}
								</ThemedButton>
							{:else}
								<ThemedButton icon="person" on:click={() => (userMenuOpen = true)} />
							{/if}
							{#if userMenuOpen}
								<div use:userMenuContent>
									<UserMenu on:dismiss={() => (userMenuOpen = false)} />
								</div>
							{/if}
						</div>
					</div>
				{/await}
			</div>
		</header>
		<div class="page">
			<aside class="primarySidebar">
				<PrimarySidebar />
			</aside>
			<dialog class="primarySidebarModal" bind:this={primarySidebarModal}>
				<div class="primarySidebarModal__top">
					{#await $cachedCalls.siteResponse then siteResponse}
						<div>{siteResponse.site_view.site.name}</div>
					{/await}
					<ThemedButton on:click={() => primarySidebarModal.close()} title="Close navigation">
						<span class="material-icons">menu_open</span>
					</ThemedButton>
				</div>
				<div class="primarySidebarModal__body">
					<PrimarySidebar />
				</div>
			</dialog>
			<slot />
		</div>
	</div>

	{#if $session.state === 'authenticating'}
		<LoginPopup on:dismiss={() => ($session.state = 'unauthenticated')} />
	{/if}
</div>

<style lang="scss">
	@use '$lib/css/resets';
	@use '$lib/css/globals';
	@use '$lib/css/colors';
	@use '$lib/css/breakpoints';
	@use '$lib/css/measurements';
	@use 'material-icons/iconfont/filled.css';

	.root {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		@include colors.themify() {
			background: colors.themed('maxContrastTheme');
			color: colors.themed('themedMainText');
		}
	}

	.loader {
		position: fixed;
		height: 0.25rem;
		top: 0;
		left: 0;
		width: 0vw;
		opacity: 0;
		transition: opacity 0.1s ease-in;
		z-index: 2;
		background: rgb(210, 158, 223);

		&.loader--navigating {
			opacity: 1;
			animation: loaderAnimation 10s cubic-bezier(0.45, 0.81, 0.925, 0.61) forwards;
		}

		@keyframes loaderAnimation {
			0% {
				width: 0vw;
			}
			100% {
				width: 100vw;
			}
		}
	}

	header {
		position: sticky;
		height: measurements.$headerVSize;
		top: 0;
		$gap: 1rem;
		padding: 0.5rem 1rem;
		display: flex;
		flex-shrink: 0;
		gap: $gap;
		align-items: center;
		justify-content: space-between;
		@include colors.themify() {
			background: colors.themed('maxContrastTheme');
			border-bottom: solid 1px colors.themed('subtleBorder');
			box-shadow: 0 0 10px colors.themed('color2');
		}
		z-index: 1; // Prevent secondary sidebar from painting over header

		.header__logoMenuToggle {
			display: flex;
			align-items: center;
			flex-basis: calc(275px - $gap);
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
			width: 2rem;
		}

		.header__search {
			display: none;

			@include breakpoints.largeAndUp {
				display: block;
				flex-grow: 1;

				.header__searchBox {
					max-width: 20rem;
				}
			}
		}

		.header__menu {
			display: flex;
			flex-direction: row;
			gap: 0.5rem;
			align-items: center;
			justify-content: center;
		}

		.header__user {
			display: flex;
			flex-direction: column;
			align-items: start;
		}

		.header__loggedInUser {
			display: none;
			font-size: 0.85rem;

			@include breakpoints.mediumAndUp {
				display: block;
			}
		}
	}

	.page {
		flex-grow: 1;
		flex-shrink: 1;
		display: flex;
		flex-direction: row;
		align-items: start;
		@include colors.themify() {
			background: linear-gradient(
					to bottom,
					rgba(colors.themed('color2'), 0.5),
					colors.themed('maxContrastTheme') 50%
				)
				fixed;
		}

		.primarySidebar {
			display: none;
			padding: 1rem 0;
			max-width: 275px;
			flex-basis: 275px;
			flex-shrink: 0;

			@include breakpoints.desktopAndUp {
				display: block;
				position: sticky;
				top: measurements.$headerVSize;
			}
		}

		.primarySidebarModal {
			@include colors.themify() {
				border: solid 1px colors.themed('subtleBorder');
			}
			transition: box-shadow 0.5s ease-in;

			&[open] {
				display: flex;
				flex-direction: column;
				gap: 1rem;
				position: fixed;
				animation: dim 0.1s ease-in forwards;
				top: 0;
				left: 0;
				width: 100vw;
				height: 100vh;
				min-height: 100vh; // <dialog> quirk because reasons
				max-width: 300px;
				padding: 0;
				margin: 0;
				animation: dim 0.1s ease-in forwards, slideLeft 0.1s ease-in forwards;

				@include colors.themify() {
					background: colors.themed('maxContrastTheme');
					color: colors.themed('maxContrastOnTheme');
				}

				@include colors.defineModalDim;
				@keyframes slideLeft {
					0% {
						transform: translateX(-100%);
					}

					100% {
						transform: translateX(0%);
					}
				}
			}

			.primarySidebarModal__top {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0.5rem 1rem 0.5rem 1rem;
				@include colors.themify() {
					border-bottom: solid 1px colors.themed('subtleBorder');
				}
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
