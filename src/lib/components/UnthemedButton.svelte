<script lang="ts">
	export let padding: string | undefined = undefined;
</script>

<button on:click class="unthemedButton" style:padding>
	<slot />
</button>

<style lang="scss">
	.unthemedButton {
		font-size: inherit;
		border: none;
		cursor: pointer;
		background: none;

		&:hover {
			background: none;
		}
	}
</style>
