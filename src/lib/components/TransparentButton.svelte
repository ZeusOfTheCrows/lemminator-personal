<script lang="ts">
	export let title: string | undefined = undefined;
	export let appearance: 'default' | 'smallRound' = 'default';
	export let icon: string | null = null;
</script>

<button
	class="transparentButton"
	{title}
	on:click
	class:transparentButton--smallRound={appearance === 'smallRound'}
>
	{#if icon}
		<span class="material-icons">{icon}</span>
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
		font-size: 1rem;
		padding: 0.5rem;
		border-radius: 10px;

		&:hover {
			background: colors.$color2;
		}

		&.transparentButton--smallRound {
			padding: 0.25rem;
			border-radius: 100%;
		}
	}
</style>
