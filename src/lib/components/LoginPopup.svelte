<script lang="ts">
	import { session, cachedCalls } from '$lib/js/globals';
	import { createEventDispatcher } from 'svelte';
	import ModalPopup from './ModalPopup.svelte';
	import ThemedButton from './ThemedButton.svelte';
	import { startSession } from '$lib/js/client';

	const dispatch = createEventDispatcher();
	let usernameOrEmail: string = '';
	let password: string = '';
	let error: string | undefined = undefined;

	async function tryLogin() {
		try {
			const jwt = await startSession(usernameOrEmail, password);
			$session = {
				state: 'authenticated',
				jwt
			};
		} catch (e) {
			if (e === 'incorrect_login') {
				error = 'That login/password combination is not correct.';
			} else {
				error = `${e}`;
			}
		}
	}
</script>

<ModalPopup minWidth="300px" width="500px">
	<div class="loginPopup">
		<div class="loginPopup__top">
			<h3 class="loginPopup__title">
				{#await $cachedCalls.siteResponse then siteResponse}
					<span class="material-icons">lock</span>
					<span>
						Log in to
						<span class="loginPopup__instanceName">
							{siteResponse.site_view.site.name}
						</span>
					</span>
				{/await}
			</h3>
			<button class="loginPopup__close" on:click={() => dispatch('dismiss')}>X</button>
		</div>
		<div class="loginPopup__content">
			<div class="loginPopup__form">
				<label for="usernameOrEmail">Username or e-mail</label>
				<input
					type="text"
					id="usernameOrEmail"
					name="usernameOrEmail"
					bind:value={usernameOrEmail}
					placeholder="linus@example.com"
				/>
				<label for="password">Password</label>
				<input type="password" id="password" name="password" bind:value={password} />
				<div class="loginPopup__submit">
					{#if error}
						<div class="loginPopup__error">{error}</div>
					{/if}
					<ThemedButton appearance="filled" on:click={() => tryLogin()}>Log in</ThemedButton>
				</div>
			</div>
		</div>
	</div>
</ModalPopup>

<style lang="scss">
	@use '$lib/css/colors';
	@use 'material-icons/iconfont/filled.css';

	.loginPopup {
		display: grid;
		grid-template-rows: 60px 1fr;

		.loginPopup__top {
			background-color: #170115;
			background-image: url('$lib/img/fills/fill2.svg');
			background-size: cover;
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 0 1rem;
			justify-content: space-between;

			.loginPopup__close {
				background: white;
				font-size: 1.2rem;
				aspect-ratio: 1/1;
				width: 1.75rem;
				border-radius: 100%;
				cursor: pointer;
			}
		}

		.loginPopup__content {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding: 1rem;

			@include colors.themify() {
				background: colors.themed('maxContrastTheme');
				color: colors.themed('themedMainText');
			}
		}

		.loginPopup__title {
			font-size: 1.2rem;
			color: #fff;
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 0.5rem;
		}

		.loginPopup__instanceName {
			font-weight: bold;
		}

		.loginPopup__form {
			display: grid;
			grid-template-columns: min-content 1fr;
			gap: 0.8rem 1rem;
			align-items: center;

			label {
				grid-column: 1;
				text-align: right;
				font-size: 0.9rem;
			}

			input {
				grid-column: 2;
				padding: 0.8rem 0.75rem;
				border-radius: 5px;
				font-size: 1rem;

				@include colors.themify() {
					border: solid 1px rgba(colors.themed('themedShadow'), 0.3);
					outline: solid 2px colors.themed('color1');

					&:focus-within {
						outline: solid 1px colors.themed('themedMainText');
					}
				}
			}

			.loginPopup__submit {
				grid-column: 2;
				display: flex;
				flex-direction: column;
				gap: 0.75rem;
				align-items: start;

				.loginPopup__error {
					font-size: 0.8rem;
				}
			}
		}
	}
</style>
