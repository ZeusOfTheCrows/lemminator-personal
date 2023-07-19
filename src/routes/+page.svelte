<script lang="ts">
	import MainNavigation from '$lib/components/MainNavigation.svelte';
	import PostList from '$lib/components/PostList.svelte';
</script>

<div class="rootLayout">
	<aside class="communities">
		<MainNavigation />
	</aside>
	<main class="main">
		<PostList />
	</main>
	<aside class="communityMeta">sidebar 2</aside>
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

		.communities {
			padding: 1rem 0;
			position: sticky;
			top: 0;
			max-width: 300px;
			flex-basis: 300px;
			flex-shrink: 0;
		}

		.main {
			padding: 1rem;
			flex-grow: 1;
			border-left: solid 1px colors.$subtleBorder;
			border-right: solid 1px colors.$subtleBorder;
		}

		.communityMeta {
			padding: 1rem;
			position: sticky;
			top: 0;
			flex-basis: 300px;
			flex-shrink: 0;
		}
	}
</style>
