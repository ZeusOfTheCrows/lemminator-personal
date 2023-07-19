<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
</script>

<div class="rootLayout">
	<aside class="communities">sidebar</aside>
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

		> * {
			padding: 1rem;
		}

		.communities {
			position: sticky;
			top: 0;
			flex-basis: 300px;
			flex-shrink: 0;
		}

		.main {
			flex-grow: 1;
			border-left: solid 1px colors.$subtleBorder;
			border-right: solid 1px colors.$subtleBorder;
		}

		.communityMeta {
			position: sticky;
			top: 0;
			flex-basis: 300px;
			flex-shrink: 0;
		}
	}
</style>
