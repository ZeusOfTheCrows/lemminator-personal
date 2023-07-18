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

		> * {
			padding: 1rem;
		}

		.communities {
			flex-basis: 300px;
			flex-shrink: 0;
		}

		.main {
			flex-grow: 1;
			background: colors.$bgAccent;
		}

		.communityMeta {
			flex-basis: 300px;
			flex-shrink: 0;
		}
	}
</style>
