<script lang="ts">
</script>

<main class="main">
	<slot name="main" />
</main>
<aside class="secondarySidebar">
	<slot name="secondarySidebar" />
</aside>

<style lang="scss">
	@use '$lib/css/resets';
	@use '$lib/css/globals';
	@use '$lib/css/colors';
	@use '$lib/css/measurements';
	@use '$lib/css/breakpoints';

	.main {
		padding: 1rem;
		align-self: stretch;
		flex-grow: 1;
		@include colors.themify() {
			border-left: solid 1px colors.themed('subtleBorder');
			border-right: solid 1px colors.themed('subtleBorder');
		}
	}

	.secondarySidebar {
		display: none;

		@include breakpoints.maxAndUp {
			display: block;
			padding: 1rem;
			position: sticky;
			top: measurements.$headerVSize;
			width: 300px;
			flex-grow: 0;
			flex-shrink: 0;
		}
	}
</style>
