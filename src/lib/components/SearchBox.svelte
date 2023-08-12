<script lang="ts">
	import { keynav } from '$lib/js/globals';

	let inputElement: HTMLInputElement;
	export let query: string;

	export function focus() {
		inputElement.focus();
	}
</script>

<div class="searchBox" on:click={() => inputElement.focus()} role="none">
	<label for="search">
		<span class="material-icons">search</span>
	</label>
	<input
		type="search"
		name="search"
		placeholder="Search community or post"
		bind:this={inputElement}
		bind:value={query}
		on:focus={() => ($keynav.mode = 'typing')}
		on:blur={() => ($keynav.mode = 'normal')}
	/>
</div>

<style lang="scss">
	@use '$lib/css/colors';
	@use 'material-icons/iconfont/filled.css';

	.searchBox {
		padding: 0.5rem 1.5rem 0.5rem 0.8rem;
		font-size: 0.9rem;
		border-radius: 10px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0 2px; // Offset outline

		@include colors.themify() {
			border: solid 1px rgba(colors.themed('themedShadow'), 0.3);
			outline: solid 2px colors.themed('color1');
			background: colors.themed('maxContrastTheme');
			color: rgba(colors.themed('maxContrastOnTheme'), 0.5);

			&:focus-within {
				border: solid 1px rgba(colors.themed('themedShadow'), 0.4);
				color: rgba(colors.themed('maxContrastOnTheme'), 0.8);
			}
		}

		input {
			flex-grow: 1;
			border: none;
			outline: none;
			background: transparent;
			color: inherit;
			font-size: 0.8rem;
		}
	}
</style>
