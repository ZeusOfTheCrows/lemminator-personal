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
		@include colors.themify() {
			background: colors.themed('maxContrastTheme');
		}
		border-radius: 10px;
		overflow: hidden;

		&.elevatedBox--horizontal {
			flex-direction: row;
		}

		&.elevatedBox--vertical {
			flex-direction: column;
		}

		@include colors.themify() {
			border: solid 1px colors.themed('subtleBorder');
			box-shadow: 1px 1px 55px colors.themed('boxShadow');

			.elevatedBox__title {
				padding: 0.75rem 1rem;
				font-size: 0.8rem;
				color: colors.themed('deemphColor');
				background: colors.themed('gradient12');
			}
		}
	}
</style>
