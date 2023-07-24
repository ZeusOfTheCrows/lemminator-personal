<script lang="ts">
	export let title: string | undefined = undefined;
	export let appearance: 'default' | 'smallRound' = 'default';
	export let icon: string | null = null;
	export let fontSize = '1rem';
</script>

<button
	class="transparentButton"
	{title}
	on:click
	class:transparentButton--default={appearance === 'default'}
	class:transparentButton--smallRound={appearance === 'smallRound'}
	style:font-size={fontSize}
>
	{#if icon}
		<span class="material-icons" style:font-size={fontSize}>{icon}</span>
	{/if}
	<slot />
</button>

<style lang="scss">
	@use '$lib/css/colors';
	@use 'material-icons/iconfont/filled.css';

	.transparentButton {
		display: flex;
		flex-direction: row;
		justify-content: stretch;
		background: none;
		border: none;
		outline: none;
		cursor: pointer;
		border-radius: 10px;
		font-family: 'Lato', sans-serif;
		gap: 0.5rem;

		&:hover {
			@include colors.themify() {
				background: colors.themed('color2');
			}
		}

		&.transparentButton--default {
			padding: 0.5rem;
		}

		&.transparentButton--smallRound {
			padding: 0.25rem;
			border-radius: 100%;
		}

		.material-icons {
			display: flex;
			align-items: center;
		}
	}
</style>
