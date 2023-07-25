<script lang="ts">
	export let title: string | undefined = undefined;
	export let href: string | null = null;
	export let appearance: 'default' | 'dimmed' = 'default';
	export let icon: string | null = null;
	export let fontSize = '1rem';
</script>

{#if href}
	<a
		{href}
		class="transparentButton"
		class:transparentButton--default={appearance === 'default'}
		class:transparentButton--dimmed={appearance === 'dimmed'}
		style:font-size={fontSize}
	>
		{#if icon}
			<span class="material-icons" style:font-size={fontSize}>{icon}</span>
		{/if}
		<slot />
	</a>
{:else}
	<button
		class="transparentButton"
		{title}
		on:click
		class:transparentButton--default={appearance === 'default'}
		class:transparentButton--dimmed={appearance === 'dimmed'}
		style:font-size={fontSize}
	>
		{#if icon}
			<span class="material-icons" style:font-size={fontSize}>{icon}</span>
		{/if}
		<slot />
	</button>
{/if}

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
		padding: 0.5rem;

		@include colors.themify() {
			&.transparentButton--dimmed {
				color: rgba(colors.themed('themedMainText'), 0.8);
			}

			&:hover {
				background: colors.themed('color2');
			}
		}

		.material-icons {
			display: flex;
			align-items: center;
		}
	}

	a {
		text-decoration: none;
	}
</style>
