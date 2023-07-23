<script lang="ts">
	export let minHeight: string;
</script>

<div class="loadingSpinner" style:min-height={minHeight}>
	<div class="loadingSpinner__token" />
</div>

<style lang="scss">
	@use '$lib/css/colors';

	.loadingSpinner {
		display: flex;
		align-items: center;
		justify-content: center;

		.loadingSpinner__token {
			@include colors.themify() {
				background: colors.themed('menuAccent');
			}
			border-radius: 100%;
			min-width: 2rem;
			aspect-ratio: 1 / 1;
			display: flex;
			align-items: center;
			justify-content: center;
			animation: fullRotation 1.25s infinite;

			@keyframes fullRotation {
				0% {
					transform: rotate(0deg);
				}
				40% {
					transform: rotate(360deg);
				}
				100% {
					transform: rotate(360deg);
				}
			}

			&::after {
				display: block;
				content: '';
				@include colors.themify() {
					background: colors.themed('maxContrastOnTheme');
				}
				width: 20%;
				border-radius: 100%;
				aspect-ratio: 1 / 1;
				margin-top: 40%;
			}
		}
	}
</style>
