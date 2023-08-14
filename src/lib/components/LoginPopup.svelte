<script lang="ts">
	import { session, cachedCalls } from '$lib/js/globals';
	import { createEventDispatcher, onMount } from 'svelte';
	import ModalPopup from './ModalPopup.svelte';
	import ThemedButton from './ThemedButton.svelte';
	import { getClient } from '$lib/js/client';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import TitledGraphic from './TitledGraphic.svelte';
	import InputField from './InputField.svelte';

	const dispatch = createEventDispatcher();
	let usernameOrEmail: string = '';
	let password: string = '';
	let error: string | undefined = undefined;
	let loading = false;

	let usernameField: InputField;

	onMount(() => {
		usernameField.focus();
	});

	async function tryLogin() {
		try {
			const client = getClient();
			loading = true;
			const jwt = await client.acquireJwt(usernameOrEmail, password);
			loading = false;
			$session = {
				state: 'authenticated',
				jwt
			};
		} catch (e) {
			loading = false;
			if (e === 'incorrect_login') {
				error = 'That login/password combination is not correct.';
			} else {
				error = `${e}`;
			}
		}
	}
</script>

<ModalPopup minWidth="300px" width="550px" on:dismiss>
	<div class="loginPopup">
		<div class="loginPopup__side">
			<TitledGraphic icon="lock" iconStyle="round" title="" />
		</div>
		<div class="loginPopup__content">
			<div class="loginPopup__contentTop">
				<h3 class="loginPopup__title">
					{#await $cachedCalls.siteResponse then siteResponse}
						<span>
							Log in to
							<span class="loginPopup__instanceName">
								{siteResponse.site_view.site.name}
							</span>
						</span>
					{/await}
				</h3>
				<button class="loginPopup__close" on:click={() => dispatch('dismiss')}>
					<span class="material-icons">close</span>
				</button>
			</div>
			<div class="loginPopup__form">
				<InputField
					uniqueId="usernameOrEmail"
					type="text"
					label="Username or e-mail"
					bind:value={usernameOrEmail}
					bind:this={usernameField}
					placeholder="linus@example.com"
				/>
				<InputField uniqueId="password" type="password" label="Password" bind:value={password} />
				{#if error}
					<div class="loginPopup__error">{error}</div>
				{/if}
				<div class="loginPopup__submit">
					{#if loading}
						<LoadingSpinner minHeight="1rem" />
					{:else}
						<ThemedButton appearance="filled" on:click={() => tryLogin()}>Log in</ThemedButton>
					{/if}
				</div>
			</div>
		</div>
	</div>
</ModalPopup>

<style lang="scss">
	@use '$lib/css/colors';
	@use '$lib/css/breakpoints';
	@use 'material-icons/iconfont/filled.css';

	.loginPopup {
		display: flex;

		.loginPopup__side {
			display: none;

			@include breakpoints.mediumAndUp {
				background-size: cover;
				display: flex;
				flex-basis: 140px;
				flex-grow: 0;
				flex-shrink: 1;
				flex-direction: row;
				align-items: start;
				padding: 1rem;
				justify-content: center;
				color: white;
				overflow-x: hidden;

				@include colors.themify() {
					background-color: colors.themed('themedShadow');
					border-right: solid 1px colors.themed('subtleBorder');
				}
			}
		}

		.loginPopup__content {
			flex-grow: 1;
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding: 1rem;
			min-width: 20rem;

			@include colors.themify() {
				background: colors.themed('maxContrastTheme');
				color: colors.themed('themedMainText');
			}

			.loginPopup__contentTop {
				display: flex;
				justify-content: space-between;
				gap: 0.5rem;
				align-items: center;
				height: 2rem;
				margin-bottom: 0.5rem;
			}

			.loginPopup__close {
				background: none;
				border: none;
				cursor: pointer;
			}

			.loginPopup__title {
				font-size: 1.2rem;
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 0.5rem;
			}
		}

		.loginPopup__instanceName {
			font-weight: bold;
		}

		.loginPopup__form {
			display: flex;
			flex-direction: column;
			align-items: start;
			gap: 1rem;

			.loginPopup__error {
				font-size: 0.8rem;
			}

			.loginPopup__submit {
				grid-column: 2;
				display: flex;
				flex-direction: column;
				gap: 0.75rem;
				align-items: start;
			}
		}
	}
</style>
