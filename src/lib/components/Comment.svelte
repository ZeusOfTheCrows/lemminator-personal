<script lang="ts">
	import { renderEnhancedMarkdown } from '$lib/js/markdown';
	import EntityIcon from './EntityIcon.svelte';
	import TransparentButton from './TransparentButton.svelte';
	import type { CommentTreeNode } from '$lib/js/comments';
	import CommentList from './CommentList.svelte';
	import type { CommentView } from 'lemmy-js-client';
	import { formatRelativeTime } from '$lib/js/client';

	export let node: CommentTreeNode;
	export let flattenedTree: CommentView[];
	let isAlternate: boolean;
	$: {
		const index = flattenedTree.findIndex((item) => item == node.leaf);
		if (index === undefined) {
			throw 'could not find item in comment tree';
		} else {
			isAlternate = index % 2 != 0;
		}
	}
</script>

<div class="comment" class:comment--alternate={isAlternate}>
	<div class="comment__metaLine">
		{#if node.leaf.creator.avatar}
			<EntityIcon src={node.leaf.creator.avatar} alt="Avatar" />
		{/if}
		{node.leaf.creator.name}
		<div class="comment__relativeTimePresep">&middot;</div>
		<div class="comment__relativeTime">
			{formatRelativeTime(node.leaf.comment.published)}
		</div>
	</div>
	<div class="comment__content">
		{@html renderEnhancedMarkdown(node.leaf.comment.content)}
	</div>
	<div class="comment__actionLine">
		<TransparentButton
			appearance="dimmed"
			icon="keyboard_arrow_up"
			title="Upvote"
			fontSize="0.875rem"
		>
			{node.leaf.counts.upvotes}
		</TransparentButton>
		<TransparentButton
			appearance="dimmed"
			icon="keyboard_arrow_down"
			title="Downvote"
			fontSize="0.875rem"
		>
			{node.leaf.counts.downvotes}
		</TransparentButton>
	</div>
</div>
{#if node.children.length}
	<div class="commentDescendants">
		<CommentList nodes={node.children} {flattenedTree} />
	</div>
{/if}

<style lang="scss">
	@use '$lib/css/colors';
	@use '$lib/css/markdown';

	.comment {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem 0;

		@include colors.themify() {
			border-bottom: solid 1px colors.themed('subtleBorder');

			&.comment--alternate {
				background: rgba(colors.themed('elevatedBoxAccent'), 0.25);
			}
		}

		.comment__metaLine,
		.comment__content {
			padding: 0 1rem;
		}

		.comment__metaLine {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 0.2rem;
			font-size: 0.75rem;

			@include colors.themify() {
				color: colors.themed('deemphColor');
			}
		}

		.comment__content {
			font-size: 0.9rem;
			line-height: 1.25rem;
			@include markdown.styleExternalContent($allowFontSizeIncreases: false);
		}

		.comment__actionLine {
			display: flex;
			flex-direction: row;
			gap: 1rem;
			padding: 0 0.5rem;
		}
	}

	.commentDescendants {
		@include colors.themify() {
			border-left: solid 10px colors.themed('color2');
		}
	}
</style>
