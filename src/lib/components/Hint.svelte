<script lang="ts">
	export let icon: string | null = null;
</script>

<div class="hint">
	{#if icon}
		<div class="material-icons">{icon}</div>
	{/if}
	<slot />
</div>

<style lang="scss">
	@use '$lib/css/colors';
	@use 'material-icons/iconfont/filled.css';

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
