<script lang="ts">
	import ElevatedBox from './ElevatedBox.svelte';
	import type { CommentTree, CommentTreeNode } from '$lib/js/comments';
	import CommentList from './CommentList.svelte';
	import { keynav } from '$lib/js/globals';

	export let tree: CommentTree;
	export let focusedNode: CommentTreeNode | null = null;

	function navigateBetweenSiblings(positionShift: 1 | -1) {
		if (focusedNode === null && tree.topNodes.length) {
			focusedNode = tree.topNodes[0];
		} else if (focusedNode && focusedNode.fullPath.length == 1) {
			const currentChildIndex = tree.topNodes.findIndex((n) => n == focusedNode);
			const newChildIndex = currentChildIndex + positionShift;
			if (newChildIndex >= 0 && newChildIndex < tree.topNodes.length) {
				focusedNode = tree.topNodes[newChildIndex];
			}
		} else if (focusedNode && focusedNode.fullPath.length > 1) {
			const parentId = [...focusedNode.fullPath].reverse()[1];
			const parentNode = tree.topNodes.flat(Infinity).find((n) => n.leaf.comment.id === parentId);
			if (!parentNode) throw 'Expected parent node not found';

			const currentChildIndex = parentNode.children.findIndex((c) => c == focusedNode);
			const newChildIndex = currentChildIndex + positionShift;
			if (newChildIndex >= 0 && newChildIndex < parentNode.children.length) {
				focusedNode = parentNode.children[newChildIndex];
			}
		}
	}

	function navigateToFirstChild() {
		if (!focusedNode || focusedNode.children.length <= 0) return;
		focusedNode = focusedNode.children[0];
	}

	function navigateToParent() {
		if (!focusedNode || focusedNode.fullPath.length <= 1) return;

		let pathToTraverse = focusedNode.fullPath.slice(0, focusedNode.fullPath.length - 1);
		let currentNodes = tree.topNodes;
		let cursor = null;

		while (pathToTraverse.length) {
			cursor = currentNodes.find((n) => n.leaf.comment.id == pathToTraverse[0]);
			if (!cursor) throw 'could not find expected element';
			pathToTraverse = pathToTraverse.slice(1);
			currentNodes = cursor.children;
		}

		if (cursor) {
			focusedNode = cursor;
		}
	}

	async function handleKeyUp(event: KeyboardEvent) {
		if ($keynav.mode !== 'normal') return;

		switch (event.key) {
			case 'h':
				navigateToParent();
				break;
			case 'j':
				navigateBetweenSiblings(1);
				break;
			case 'k':
				navigateBetweenSiblings(-1);
				break;
			case 'l':
				navigateToFirstChild();
				break;
			case 'Escape':
				if (focusedNode) {
					focusedNode = null;
				}
				break;
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<p class="commentSectionGlitchWarning">
	The "Load more comments" buttons aren't entirely stable yet. Bear with us while we figure this
	out!
</p>

<ElevatedBox stacking="vertical">
	<div class="commentSection">
		{#if tree.flattenedTree.length == 0}
			<div class="commentSection__isEmpty">
				There are no comments yet. Early bird gets the worm!
			</div>
		{/if}
		<CommentList
			nodes={tree.topNodes}
			flattenedTree={tree.flattenedTree}
			focusedCommentId={focusedNode?.leaf.comment.id ?? null}
			on:subtreeExpansionRequested
		/>
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

	.commentSectionGlitchWarning {
		padding: 0.5rem 0;
		opacity: 0.5;
		font-size: 0.85rem;
	}
</style>
