<script lang="ts">
	export let src: string;
	export let alt: string | undefined = undefined;
</script>

<img {src} {alt} class="entityIcon" />

<style lang="scss">
	@use '$lib/css/colors';

	.entityIcon {
		width: 20px;
		height: 20px;
		border-radius: 100%;
		object-fit: cover;

		// Fallbacks for load failures
		font-size: 0; // We have alt text for screen readers, regular users don't need it
		@include colors.themify() {
			background: colors.themed('themedMainText');
		}
	}
</style>
