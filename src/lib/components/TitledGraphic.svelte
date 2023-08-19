<script lang="ts">
	export let title: string;
	export let subtitle: string | null = null;
	export let icon: string;
	export let iconStyle: 'prerounded' | 'round' = 'prerounded';
</script>

<div class="iconWithText">
	<div class="iconWithText__image" class:iconWithText__image--round={iconStyle === 'round'}>
		<span class="material-icons">{icon}</span>
	</div>
	<div class="iconWithText__title">
		{title}
	</div>
	{#if subtitle}
		<div class="iconWithText__subtitle">{subtitle}</div>
	{/if}
	<slot name="additionalActions" />
</div>

<style lang="scss">
	@use '$lib/css/colors';
	@use 'material-icons/iconfont/filled.css';

	.iconWithText {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 2rem;
		gap: 0.5rem;

		.iconWithText__image {
			.material-icons {
				@include colors.themify() {
					border: solid 1rem colors.themed('menuAccent');
					color: rgba(colors.themed('maxContrastOnTheme'), 0.9);
					background: colors.themed('maxContrastTheme');
				}

				border-radius: 100%;
				font-size: 5rem;
				margin-bottom: 1rem;
			}

			&.iconWithText__image--round .material-icons {
				@include colors.themify() {
					background: rgba(colors.themed('maxContrastOnTheme'), 0.9);
					color: colors.themed('maxContrastTheme');
				}

				font-size: 3.75rem;
				padding: 0.5rem;
			}
		}

		.iconWithText__title {
			font-size: 1.2rem;
			font-weight: bold;
		}
	}
</style>
