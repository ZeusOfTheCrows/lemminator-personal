<script lang="ts">
	export let title: string | null = null;
	export let stacking: 'horizontal' | 'vertical';
</script>

<div
	class="elevatedBox"
	class:elevatedBox--horizontal={stacking == 'horizontal'}
	class:elevatedBox--vertical={stacking == 'vertical'}
>
	{#if title}
		<div class="elevatedBox__title">{title}</div>
	{/if}
	<slot />
</div>

<style lang="scss">
	@use '$lib/css/colors';

	.elevatedBox {
		display: flex;
		background: white;
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 2px 2px 5px colors.$boxShadow;

		&.elevatedBox--horizontal {
			flex-direction: row;
		}

		&.elevatedBox--vertical {
			flex-direction: column;
		}

		.elevatedBox__title {
			padding: 0.75rem 1rem;
			font-size: 0.8rem;
			color: colors.$deemphColor;
			background: colors.$bgAccent2;
		}
	}
</style>
