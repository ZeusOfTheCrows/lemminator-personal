<script lang="ts">
	import PrimarySidebar from '$lib/components/PrimarySidebar.svelte';
	import PostList from '$lib/components/PostList.svelte';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
</script>

<div class="rootLayout">
	<aside class="primarySidebar">
		<PrimarySidebar />
	</aside>
	<main class="main">
		<PostList />
	</main>
	<aside class="secondarySidebar">
		<SecondarySidebar />
	</aside>
</div>

<style lang="scss">
	@use '$lib/css/resets';
	@use '$lib/css/globals';
	@use '$lib/css/colors';

	.rootLayout {
		display: flex;
		flex-direction: row;
		background: colors.$bgAccent;
		align-items: start;
		min-height: 100%;

		.primarySidebar {
			padding: 1rem 0;
			position: sticky;
			top: 0;
			max-width: 300px;
			flex-basis: 300px;
			flex-shrink: 0;
		}

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
	}
</style>
