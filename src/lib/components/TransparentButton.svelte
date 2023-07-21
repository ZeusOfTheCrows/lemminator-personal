<script lang="ts">
	export let title: string | undefined = undefined;
</script>

<button class="transparentButton" {title} on:click>
	<slot />
</button>

<style lang="scss">
	@use '$lib/css/colors';

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
	}
</style>
