<script lang="ts">
	import { page } from '$app/stores';
	import PageHolder from '$lib/components/PageHolder.svelte';
</script>

<svelte:head>
	<title>Oh snap</title>
</svelte:head>

<PageHolder>
	<svelte:fragment slot="main">
		<div class="error">
			<div class="error__image">
				<span class="material-icons">error</span>
			</div>
			<div class="error__title">
				{$page?.error?.message ?? 'Error occurred'}
			</div>
			<div class="error__subtitle">Sorry for the inconvenience.</div>
		</div>
	</svelte:fragment>
</PageHolder>

<style lang="scss">
	@use '$lib/css/colors';
	@use 'material-icons/iconfont/filled.css';

	.error {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 2rem;
		gap: 0.5rem;

		.error__image .material-icons {
			@include colors.themify() {
				border: solid 1rem colors.themed('color2');
				color: rgba(colors.themed('maxContrastOnTheme'), 0.9);
			}

			border-radius: 100%;
			font-size: 5rem;
			margin-bottom: 1rem;
		}

		.error__title {
			font-size: 1.2rem;
			font-weight: bold;
		}
	}
</style>
