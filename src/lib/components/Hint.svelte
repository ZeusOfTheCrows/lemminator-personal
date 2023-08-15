<script lang="ts">
</script>

<div class="hint">
	<slot />
</div>

<style lang="scss">
	@use '$lib/css/colors';

	.hint {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		border-radius: 10px;
		padding: 0.7rem;

		@include colors.themify() {
			background: colors.themed('color2');
		}
	}
</style>
