<script lang="ts">
	import { session, cachedCalls } from '$lib/js/globals';
	import { createEventDispatcher } from 'svelte';
	import ModalPopup from './ModalPopup.svelte';
	import ThemedButton from './ThemedButton.svelte';
	import { getClient } from '$lib/js/client';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();
	let usernameOrEmail: string = '';
	let password: string = '';
	let error: string | undefined = undefined;
	let loading = false;

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

<ModalPopup minWidth="300px" width="450px" on:dismiss>
	<div class="loginPopup">
		<div class="loginPopup__side">
			<span class="material-icons">lock</span>
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
				<div class="loginPopup__formItem">
					<label for="usernameOrEmail">Username or e-mail</label>
					<input
						type="text"
						id="usernameOrEmail"
						name="usernameOrEmail"
						bind:value={usernameOrEmail}
						placeholder="linus@example.com"
					/>
				</div>
				<div class="loginPopup__formItem">
					<label for="password">Password</label>
					<input type="password" id="password" name="password" bind:value={password} />
				</div>
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
	@use 'material-icons/iconfont/filled.css';

	.loginPopup {
		display: grid;
		grid-template-columns: minmax(10%, 80px) 1fr;

		.loginPopup__side {
			background-color: #170115;
			background-image: url('$lib/img/fills/fill2.svg');
			background-size: cover;
			display: flex;
			flex-direction: row;
			align-items: start;
			padding: 1rem;
			justify-content: center;
			color: white;

			.material-icons {
				font-size: 2rem;
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

			.loginPopup__formItem {
				display: flex;
				flex-direction: column;
				align-items: start;
				gap: 0.5rem;
			}

			label {
				text-align: right;
				font-size: 0.8rem;
			}

			input {
				padding: 0.8rem 0.75rem;
				border-radius: 5px;
				font-size: 0.9rem;
				margin: 0 2px; // Offset outline

				@include colors.themify() {
					border: solid 1px rgba(colors.themed('themedShadow'), 0.3);
					outline: solid 2px colors.themed('color1');

					&:focus-within {
						border: solid 1px rgba(colors.themed('themedShadow'), 0.4);
					}
				}
			}

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
