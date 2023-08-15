<script lang="ts">
	import type { CommentTreeNode } from '$lib/js/comments';
	import type { CommentView } from 'lemmy-js-client';
	import Comment from './Comment.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let nodes: CommentTreeNode[];
	export let flattenedTree: CommentView[];
	export let focusedCommentId: number | null;

	let loading = false;
	$: {
		if (nodes) {
			loading = false;
		}
	}
</script>

{#each nodes as node, i}
	<div class="commentList">
		<Comment
			{node}
			{flattenedTree}
			{focusedCommentId}
			appearance="thread"
			on:subtreeExpansionRequest
		/>
		{#if node.children.length == 0 && node.leaf.counts.child_count > 0}
			<div class="commentList__loadMore">
				<button
					on:click={() => {
						dispatch('subtreeExpansionRequest', node.leaf.comment.id);
						loading = true;
					}}
				>
					{#if loading}
						Loading...
					{:else}
						Load {node.leaf.counts.child_count} more
					{/if}
				</button>
			</div>
		{/if}
	</div>
{/each}

<style lang="scss">
	@use '$lib/css/colors';

	.commentList__loadMore {
		padding: 0.3rem;
		font-size: 0.8rem;
		@include colors.themify() {
			background-color: colors.themed('color2');
		}

		button {
			padding: 0.5rem;
			background: none;
			text-decoration: none;
			border: none;
			cursor: pointer;
			border-radius: 10px;

			&:hover {
				@include colors.themify() {
					background-color: colors.themed('color1');
				}
			}
		}
	}
</style>
