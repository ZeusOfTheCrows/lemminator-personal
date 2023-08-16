<script lang="ts">
	export let icon: string;
	export let count: number | null;
</script>

<div class="badgedIcon">
	<div class="badgedIcon__icon material-icons">{icon}</div>
	{#if count}
		<div class="badgedIcon__count">{count}</div>
	{/if}
</div>

<style lang="scss">
	@use '$lib/css/colors';
	@use 'material-icons/iconfont/filled.css';

	.badgedIcon {
		display: grid;

		.badgedIcon__icon,
		.badgedIcon__count {
			grid-row: 1;
			grid-column: 1;
		}

		.badgedIcon__count {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.6rem;
			border-radius: 50%;
			transform: translateX(65%) translateY(-35%);

			@include colors.themify() {
				background: colors.themed('themedMainText');
				border: solid 3px colors.themed('maxContrastTheme');
				color: colors.themed('maxContrastTheme');
			}
		}
	}
</style>
