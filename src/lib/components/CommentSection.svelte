<script lang="ts">
	import ElevatedBox from './ElevatedBox.svelte';
	import type { CommentTree } from '$lib/js/comments';
	import CommentList from './CommentList.svelte';

	export let tree: CommentTree;
</script>

<ElevatedBox stacking="vertical">
	<div class="commentSection">
		{#if tree.flattenedTree.length == 0}
			<div class="commentSection__isEmpty">
				There are no comments yet. Early bird gets the worm!
			</div>
		{/if}
		<CommentList nodes={tree.topNodes} flattenedTree={tree.flattenedTree} />
	</div>
</ElevatedBox>

<style lang="scss">
	@use '$lib/css/colors';
	@use '$lib/css/markdown';

	.commentSection {
		.commentSection__isEmpty {
			padding: 2rem 0;
			text-align: center;
			opacity: 0.5;
		}
	}
</style>
