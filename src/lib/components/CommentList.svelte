<script lang="ts">
	import type { CommentTreeNode } from '$lib/js/comments';
	import type { CommentView } from 'lemmy-js-client';
	import Comment from './Comment.svelte';

	export let nodes: CommentTreeNode[];
	export let flattenedTree: CommentView[];
	export let focusedCommentId: number | null;
</script>

{#each nodes as node, i}
	<Comment {node} {flattenedTree} {focusedCommentId} />
{/each}
