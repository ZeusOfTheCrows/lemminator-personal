<script lang="ts">
	import type { CommentTreeNode } from '$lib/js/comments';
	import type { CommentView } from 'lemmy-js-client';
	import Comment from './Comment.svelte';
	import { createEventDispatcher } from 'svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';

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
		<Comment {node} {flattenedTree} {focusedCommentId} on:subtreeExpansionRequested />
		{#if node.unloadedChildren}
			{#if loading}
				<LoadingSpinner minHeight="4rem" />
			{:else}
				<div class="commentList__loadMore">
					<button
						on:click={() => {
							dispatch('subtreeExpansionRequested', node.leaf.comment.id);
							loading = true;
						}}
					>
						Load {node.unloadedChildren} more
					</button>
				</div>
			{/if}
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
