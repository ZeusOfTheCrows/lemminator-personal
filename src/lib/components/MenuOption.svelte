<script lang="ts">
	export let padding: string | undefined = undefined;
</script>

<button on:click class="menuOption" style:padding>
	<slot />
</button>

<style lang="scss">
	@use '$lib/css/colors';

	.menuOption {
		font-size: inherit;
		border: none;
		cursor: pointer;
		background: none;
		text-align: left;

		&:hover {
			@include colors.themify() {
				background: rgba(colors.themed('menuAccent'), 0.3);
			}
		}
	}
</style>
