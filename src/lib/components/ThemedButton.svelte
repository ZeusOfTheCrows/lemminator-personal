<script lang="ts">
	export let title: string | undefined = undefined;
	export let href: string | null = null;
	export let appearance: 'default' | 'dimmed' | 'filled' = 'default';
	export let icon: string | null = null;
	export let fontSize = '1rem';
</script>

{#if href}
	<a
		{href}
		class="themedButton"
		class:themedButton--default={appearance === 'default'}
		class:themedButton--dimmed={appearance === 'dimmed'}
		class:themedButton--filled={appearance === 'filled'}
		style:font-size={fontSize}
	>
		{#if icon}
			<span class="material-icons" style:font-size={fontSize}>{icon}</span>
		{/if}
		<slot />
	</a>
{:else}
	<button
		class="themedButton"
		{title}
		on:click
		class:themedButton--default={appearance === 'default'}
		class:themedButton--dimmed={appearance === 'dimmed'}
		class:themedButton--filled={appearance === 'filled'}
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

	.themedButton {
		display: flex;
		flex-direction: row;
		justify-content: stretch;
		background: none;
		border: none;
		outline: none;
		cursor: pointer;
		border-radius: 10px;
		gap: 0.5rem;
		padding: 0.5rem;
		align-items: center;

		@include colors.themify() {
			&.themedButton--dimmed {
				color: rgba(colors.themed('themedMainText'), 0.8);
			}

			&.themedButton--filled {
				background: colors.themed('color2');
				&:hover {
					background: darken(colors.themed('color2'), 1%);
				}
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
