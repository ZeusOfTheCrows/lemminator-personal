<script lang="ts">
	import PrimarySidebar from '$lib/components/PrimarySidebar.svelte';
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

	.main {
		padding: 1rem;
		align-self: stretch;
		flex-grow: 1;
		border-left: solid 1px colors.$subtleBorder;
		border-right: solid 1px colors.$subtleBorder;
	}

	.secondarySidebar {
		padding: 1rem;
		position: sticky;
		top: 0;
		flex-basis: 300px;
		flex-shrink: 0;
	}
</style>
