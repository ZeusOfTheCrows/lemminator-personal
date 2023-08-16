<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import PrimarySidebar from '$lib/components/PrimarySidebar.svelte';
	import ThemedButton from '$lib/components/ThemedButton.svelte';
	import LoginPopup from '$lib/components/LoginPopup.svelte';
	import logoMonochromeOnLight from '$lib/img/logoMonochromeOnLight.svg';
	import { session, cachedCalls, theme } from '$lib/js/globals';
	import EntityIcon from '$lib/components/EntityIcon.svelte';
	import UserMenu from '$lib/components/UserMenu.svelte';
	import { offset, flip, shift } from 'svelte-floating-ui/dom';
	import { createFloatingActions } from 'svelte-floating-ui';
	import SearchPopup from '$lib/components/SearchPopup.svelte';
	import BadgedIcon from '$lib/components/BadgedIcon.svelte';
	import { getClient } from '$lib/js/client';
	import { onMount } from 'svelte';

	let root: HTMLElement;
	let navigating = false;

	beforeNavigate(() => {
		navigating = true;
	});

	afterNavigate(() => {
		navigating = false;
		primarySidebarModal.close();
	});

	const [userMenuRef, userMenuContent] = createFloatingActions({
		strategy: 'absolute',
		placement: 'bottom-end',
		middleware: [offset(5), flip(), shift()]
	});

	let primarySidebarModal: HTMLDialogElement;
	let userMenuOpen = false;

	let postAuthCallback: (() => void) | null = null;
	$: {
		if ($session.state === 'authenticating') {
			postAuthCallback = $session.callback ?? null;
		} else if ($session.state === 'authenticated' && postAuthCallback) {
			postAuthCallback();
		}
	}

	let searchPopupOpen = false;

	let numUnreadMessages: number | null = null;
	async function refreshUnreadCount() {
		if ($session.state === 'authenticated') {
			const client = getClient();
			const unreadCountResponse = await client.getUnreadCount({ jwt: $session.jwt });
			numUnreadMessages =
				unreadCountResponse.mentions +
				unreadCountResponse.private_messages +
				unreadCountResponse.replies;
		} else {
			numUnreadMessages = null;
		}
	}
	onMount(() => {
		refreshUnreadCount();
		setInterval(refreshUnreadCount, 1000 * 30);
	});
</script>

<svelte:head>
	{#await $cachedCalls.siteResponse then siteResponse}
		<link rel="icon" href={siteResponse.site_view.site.icon} />
	{/await}
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
					{#await $cachedCalls.siteResponse}
						<div class="header__siteName header__siteName--loading">&nbsp;</div>
					{:then siteResponse}
						<img src={siteResponse.site_view.site.icon} alt="Logo" class="header__logo" />
						<div class="header__siteName">
							{siteResponse.site_view.site.name}
						</div>
					{/await}
				</a>
			</div>
			<div class="header__search">
				<button class="header__searchBox" on:click={() => (searchPopupOpen = true)}>
					<span class="material-icons">search</span>
					<span class="header__searchBoxLabel">Search community or post</span>
				</button>
			</div>
			<div class="header__menu">
				{#await $cachedCalls.siteResponse then siteResponse}
					{#if numUnreadMessages !== null}
						<ThemedButton title="Inbox" on:click={() => alert('Inbox management is coming soon!')}>
							<BadgedIcon icon="mail" count={numUnreadMessages} />
						</ThemedButton>
					{/if}
					<div class="header__user">
						<div use:userMenuRef>
							{#if $session.state === 'authenticated' && siteResponse.my_user}
								<ThemedButton on:click={() => (userMenuOpen = true)}>
									{#if siteResponse.my_user.local_user_view.person.avatar}
										<EntityIcon
											src={siteResponse.my_user.local_user_view.person.avatar}
											alt="Avatar"
										/>
									{:else}
										<span class="material-icons">person</span>
									{/if}
									<span class="header__loggedInUser">
										{siteResponse.my_user.local_user_view.person.name}
									</span>
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

		<footer class="footer">
			<div>
				<img class="footer__logo" src={logoMonochromeOnLight} alt="Lemminator logo" />
			</div>
			<div>
				{#await $cachedCalls.siteResponse}
					Powered by <a href="https://join-lemmy.org/" target="_blank">Lemmy</a> and
					<a href="https://gitlab.com/FrostySpectacles/lemminator" target="_blank">Lemminator</a>.
				{:then siteResponse}
					Powered by <a href="https://join-lemmy.org/" target="_blank">Lemmy</a>
					({siteResponse.version}) and
					<a href="https://gitlab.com/FrostySpectacles/lemminator" target="_blank">Lemminator</a>
					({import.meta.env.VITE_APP_COMMIT_HASH}).
				{/await}
			</div>
		</footer>
	</div>

	{#if $session.state === 'authenticating'}
		<LoginPopup on:dismiss={() => ($session.state = 'unauthenticated')} />
	{/if}
	{#if searchPopupOpen}
		<SearchPopup on:dismiss={() => (searchPopupOpen = false)} />
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

			.header__siteName {
				&.header__siteName--loading {
					width: 10rem;
					height: 2rem;

					@include colors.themify() {
						animation: shimmer 1.25s infinite;
						--animationColor1: #{colors.themed('color2')};
						--animationColor2: #{colors.themed('maxContrastTheme')};

						@keyframes shimmer {
							0% {
								background: var(--animationColor1);
							}
							40% {
								background: var(--animationColor2);
							}
							100% {
								background: var(--animationColor1);
							}
						}
					}
				}
			}
		}

		.header__logo {
			width: 2rem;
		}

		.header__search {
			display: none;

			@include breakpoints.largeAndUp {
				display: flex;
				flex-grow: 1;

				.header__searchBox {
					display: flex;
					align-items: center;
					flex-grow: 1;
					gap: 0.5rem;
					text-align: left;
					max-width: 20rem;
					border-radius: 10px;
					font-size: 0.85rem;
					margin: 0 2px; // Compensate outline
					padding: 0.5rem 1.5rem 0.5rem 0.8rem;
					cursor: pointer;

					@include colors.themify() {
						border: solid 1px rgba(colors.themed('themedShadow'), 0.3);
						outline: solid 2px colors.themed('color1');
						background: colors.themed('maxContrastTheme');
						color: rgba(colors.themed('maxContrastOnTheme'), 0.5);

						&:hover {
							background: rgba(colors.themed('color2'), 0.3);
						}
					}

					.header__searchBoxLabel {
						white-space: nowrap;
					}
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

			@include breakpoints.desktopAndUp {
				flex-shrink: 1;
				display: block;
				font-size: 0.85rem;
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

	.footer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 1.5rem;
		font-size: 0.8rem;
		gap: 0.5rem;

		@include colors.themify() {
			border-top: solid 1px colors.themed('subtleBorder');
			color: rgba(colors.themed('maxContrastOnTheme'), 0.4);
		}
		.footer__logo {
			opacity: 0.4;
			width: 2rem;

			@include colors.themifyMonochromeImage;
		}
	}
</style>
